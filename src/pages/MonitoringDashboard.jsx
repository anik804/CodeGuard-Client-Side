import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

import { toast } from "sonner";
import { useWebRTC } from "../hooks/useWebRTC";
import { formatTime } from "../utils/timeFormatter";

// Components
import { MonitoringHeader } from "../components/monitoring/MonitoringHeader";
import { ExamInfoSection } from "../components/monitoring/ExamInfoSection";
import { StatsSection } from "../components/monitoring/StatsSection";
import { MonitoringSidebar } from "../components/monitoring/MonitoringSidebar";
import { StudentVideoGrid } from "../components/monitoring/StudentVideoGrid";
import { Button } from "../components/ui/button";

export default function MonitoringDashboardPage() {
  const { roomId } = useParams();
  const [peers, setPeers] = useState([]);
  const [examStarted, setExamStarted] = useState(false);
  const [timer, setTimer] = useState(0); // Session timer in seconds
  const [examCountdown, setExamCountdown] = useState(0); // Exam countdown in seconds
  const [students, setStudents] = useState([]); // List of joined students
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar - start collapsed
  const [questionFile, setQuestionFile] = useState(null);
  const [questionUrl, setQuestionUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [examDetails, setExamDetails] = useState(null);
  const [flaggedStudents, setFlaggedStudents] = useState(new Set()); // Track students with illegal sites
  const socketRef = useRef(null);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  // WebRTC hook
  const { peersRef, setupWebRTCHandlers, cleanup: cleanupWebRTC } = useWebRTC(
    socketRef,
    setPeers,
    setStudents
  );

  // Calculate exam countdown based on exam duration
  useEffect(() => {
    if (examStarted && examDetails?.examDuration) {
      const examDurationSeconds = examDetails.examDuration * 60;
      const remaining = Math.max(0, examDurationSeconds - timer);
      setExamCountdown(remaining);
    } else {
      setExamCountdown(0);
    }
  }, [timer, examStarted, examDetails?.examDuration]);

  // --- Main useEffect ---
  useEffect(() => {
    if (!roomId || typeof window === "undefined") return;

    socketRef.current = io("http://localhost:3000");

    // Note: Logs are now fetched by ActivityLog component with pagination

    // Fetch exam details
    fetch(`http://localhost:3000/api/rooms/${roomId}/exam-details`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.room) {
          setExamDetails(data.room);
          // Update document title with exam name
          if (data.room.examName || data.room.courseName) {
            document.title = `Monitoring: ${data.room.examName || data.room.courseName}`;
          }
        }
      })
      .catch((err) => console.error("Failed to fetch exam details:", err));

    // Fetch existing question if any
    fetch(`http://localhost:3000/api/rooms/${roomId}/question`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.hasQuestion) {
          setQuestionUrl("uploaded");
        }
      })
      .catch((err) => console.error("Failed to fetch question:", err));

    // Join room as examiner
    socketRef.current.emit("examiner-join-room", { roomId });

    // --- WebRTC: Handle student joining ---
    // Receive current student list
    socketRef.current.on("current-students", (studentList) => {
      setStudents(studentList);
    });

    socketRef.current.on("student-joined", (studentInfo) => {
      console.log(`👩‍🎓 Student ${studentInfo.name} (${studentInfo.studentId}) joined.`);
      setStudents((prev) => [...prev, studentInfo]);
      toast.success(`${studentInfo.name} joined the exam`);
    });

    // Setup WebRTC handlers
    setupWebRTCHandlers();

    // Handle flagged events
    socketRef.current.on("student-flagged", (log) => {
      console.log("🚨 Flagged Activity:", log);
      // Add student to flagged set for red border
      setFlaggedStudents((prev) => new Set([...prev, log.studentId]));
      // Show notification toast
      toast.error(`🚨 Student ${log.studentId} visited illegal site!`, {
        duration: 5000,
      });
      // Note: Flag will remain until examiner dismisses it manually
    });

    return () => {
      socketRef.current?.disconnect();
      cleanupWebRTC();
      clearInterval(timerRef.current);
    };
  }, [roomId]);

  // --- Upload exam question ---
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setQuestionFile(file);
    } else {
      toast.error("Please select a PDF file");
    }
  };

  const handleUploadQuestion = async () => {
    if (!questionFile) {
      toast.error("Please select a PDF file first");
      return;
    }

    console.log("📤 Starting PDF upload...");
    console.log("📤 File details:", {
      name: questionFile.name,
      type: questionFile.type,
      size: questionFile.size
    });

    // Validate file type on frontend
    if (questionFile.type !== 'application/pdf') {
      toast.error("Please select a PDF file");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('question', questionFile);

    try {
      console.log(`📤 Uploading to: http://localhost:3000/api/rooms/${roomId}/question`);
      
      const response = await axios.post(
        `http://localhost:3000/api/rooms/${roomId}/question`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("📤 Upload response:", response.data);

      if (response.data.success) {
        // PDF is now stored in MongoDB, so we just mark it as uploaded
        setQuestionUrl("uploaded"); // Mark as uploaded (we'll use roomId to fetch)
        console.log("✅ Upload successful! File:", response.data.fileName);
        toast.success("Exam question uploaded successfully!");
        
        // If exam is already started, notify students immediately
        if (examStarted && socketRef.current) {
          socketRef.current.emit("question-uploaded", { roomId });
          toast.info("Question sent to all students!");
        }
      } else {
        console.error("❌ Upload failed:", response.data);
        toast.error(response.data.message || "Failed to upload question");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      console.error("❌ Error response:", error.response?.data);
      toast.error(error.response?.data?.message || error.message || "Failed to upload question");
    } finally {
      setUploading(false);
    }
  };

  // --- Exam control functions ---
  const startExam = async () => {
    // Allow starting exam without question - examiner can upload later
    try {
      // Update exam started time in database
      if (examDetails) {
        await fetch(`http://localhost:3000/api/rooms/${roomId}/exam-details`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseName: examDetails.examName || examDetails.courseName,
            examDuration: examDetails.examDuration
          })
        });
      }

      // Emit exam-start - if question exists, it will be sent to students
      socketRef.current.emit("exam-start", { roomId });
      setExamStarted(true);
      timerRef.current = setInterval(() => setTimer((prev) => prev + 1), 1000);
      
      // Check if question exists
      const response = await fetch(`http://localhost:3000/api/rooms/${roomId}/question`);
      const data = await response.json();
      
      if (data.success && data.hasQuestion) {
        toast.success("Exam started! Questions sent to all students.");
      } else {
        toast.success("Exam started! You can upload questions anytime during the exam.");
      }
      console.log("✅ Exam started for room:", roomId);
    } catch (error) {
      console.error("Error starting exam:", error);
      toast.error("Failed to start exam. Please try again.");
    }
  };

  const endExam = () => {
    socketRef.current.emit("exam-end", { roomId });
    setExamStarted(false);
    clearInterval(timerRef.current);
    setTimer(0);
    cleanupWebRTC();
  };

  // Dismiss flag (false alarm)
  const handleDismissFlag = (studentId) => {
    setFlaggedStudents((prev) => {
      const newSet = new Set(prev);
      newSet.delete(studentId);
      return newSet;
    });
    toast.success(`Flag dismissed for student ${studentId}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <MonitoringHeader
        roomId={roomId}
        examDetails={examDetails}
        examStarted={examStarted}
        timer={timer}
        examCountdown={examCountdown}
        questionFile={questionFile}
        questionUrl={questionUrl}
        uploading={uploading}
        fileInputRef={fileInputRef}
        onFileSelect={handleFileSelect}
        onUploadQuestion={handleUploadQuestion}
        onStartExam={startExam}
        onEndExam={endExam}
      />

      <ExamInfoSection examDetails={examDetails} />

      <StatsSection
        activeStudents={peers.length}
        totalStudents={students.length}
        logsCount={flaggedStudents.size}
        timer={timer}
        examStarted={examStarted}
      />

      {/* Main */}
      <main className="flex flex-1 p-4 md:p-6 gap-4 md:gap-6 relative flex-col lg:flex-row">
        <MonitoringSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          roomId={roomId}
          flaggedStudents={flaggedStudents}
        />

        <StudentVideoGrid
          peers={peers}
          students={students}
          flaggedStudents={flaggedStudents}
          sidebarOpen={sidebarOpen}
          activityLogOpen={false}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onDismissFlag={handleDismissFlag}
          roomId={roomId}
        />
      </main>
    </div>
  );
}
