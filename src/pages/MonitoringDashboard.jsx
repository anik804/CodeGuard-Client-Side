import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { toast } from "sonner";
import { useWebRTC } from "../hooks/useWebRTC";
import { formatTime } from "../utils/timeFormatter";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Download, 
  Users, 
  Video, 
  AlertTriangle, 
  Clock,
  X,
  Check,
  Eye,
  FileDown,
  UserX,
  GraduationCap
} from "lucide-react";

// Components
import { ExamInfoSection } from "../components/monitoring/ExamInfoSection";
import { MonitoringHeader } from "../components/monitoring/MonitoringHeader";
import { MonitoringSidebar } from "../components/monitoring/MonitoringSidebar";
import { StatsSection } from "../components/monitoring/StatsSection";
import { StudentVideoGrid } from "../components/monitoring/StudentVideoGrid";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Light pastel gradient animation (matching examiner overview)
const lightGradientAnimation = {
  background: [
    "linear-gradient(135deg, #d6f5f5, #ffe6f0)",
    "linear-gradient(135deg, #ffe6f0, #fff1b8)",
    "linear-gradient(135deg, #fff1b8, #d6f5f5)",
  ],
  transition: { duration: 10, repeat: Infinity, repeatType: "loop" },
};

export default function MonitoringDashboardPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [peers, setPeers] = useState([]);
  const [examStarted, setExamStarted] = useState(false);
  const [examEnded, setExamEnded] = useState(false);
  const [timer, setTimer] = useState(0);
  const [examCountdown, setExamCountdown] = useState(0);
  const [students, setStudents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [questionFile, setQuestionFile] = useState(null);
  const [questionUrl, setQuestionUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [examDetails, setExamDetails] = useState(null);
  const [flaggedStudents, setFlaggedStudents] = useState(new Set());
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveRequestsOverlayOpen, setLeaveRequestsOverlayOpen] = useState(false);
  const [kickDialogOpen, setKickDialogOpen] = useState(false);
  const [studentToKick, setStudentToKick] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState("monitoring");
  const socketRef = useRef(null);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  const { peersRef, setupWebRTCHandlers, cleanup: cleanupWebRTC } = useWebRTC(
    socketRef,
    setPeers,
    setStudents
  );

  // Calculate exam countdown
  useEffect(() => {
    if (examStarted && examDetails?.examDuration) {
      const examDurationSeconds = examDetails.examDuration * 60;
      const remaining = Math.max(0, examDurationSeconds - timer);
      setExamCountdown(remaining);
    } else {
      setExamCountdown(0);
    }
  }, [timer, examStarted, examDetails?.examDuration]);

  // Main useEffect
  useEffect(() => {
    if (!roomId || typeof window === "undefined") return;

    socketRef.current = io("https://codeguard-server-side-walb.onrender.com");

    // Fetch exam details
    fetch(`https://codeguard-server-side-walb.onrender.com/api/rooms/${roomId}/exam-details`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.room) {
          setExamDetails(data.room);
          if (data.room.examName || data.room.courseName) {
            document.title = `Monitoring: ${data.room.examName || data.room.courseName}`;
          }
        }
      })
      .catch((err) => console.error("Failed to fetch exam details:", err));

    // Fetch existing question
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
      setFlaggedStudents((prev) => new Set([...prev, log.studentId]));
      toast.error(`🚨 Student ${log.studentId} visited illegal site!`, {
        duration: 5000,
      });
    });

    // Handle leave requests
    socketRef.current.on("student-leave-request", (request) => {
      setLeaveRequests((prev) => [...prev, request]);
      setLeaveRequestsOverlayOpen(true); // Auto-open overlay when new request arrives
      toast.info(`📤 ${request.studentName} requested to leave`, {
        duration: 5000,
      });
    });

    // Fetch submissions
    fetchSubmissions();

    return () => {
      socketRef.current?.disconnect();
      cleanupWebRTC();
      clearInterval(timerRef.current);
    };
  }, [roomId]);

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/submissions/${roomId}/submissions`);
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    }
  };

  // Refresh submissions when tab is active
  useEffect(() => {
    if (activeTab === "submissions") {
      fetchSubmissions();
      const interval = setInterval(fetchSubmissions, 10000);
      return () => clearInterval(interval);
    }
  }, [activeTab, roomId]);

  // Upload exam question
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

    if (questionFile.type !== 'application/pdf') {
      toast.error("Please select a PDF file");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('question', questionFile);

    try {
      const response = await axios.post(
        `https://codeguard-server-side-walb.onrender.com/api/rooms/${roomId}/question`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setQuestionUrl("uploaded");
        toast.success("Exam question uploaded successfully!");
        
        if (examStarted && socketRef.current) {
          socketRef.current.emit("question-uploaded", { roomId });
          toast.info("Question sent to all students!");
        }
      } else {
        toast.error(response.data.message || "Failed to upload question");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to upload question");
    } finally {
      setUploading(false);
    }
  };

  // Exam control functions
  const startExam = async () => {
    try {
      if (examDetails) {
        await fetch(`https://codeguard-server-side-walb.onrender.com/api/rooms/${roomId}/exam-details`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseName: examDetails.examName || examDetails.courseName,
            examDuration: examDetails.examDuration
          })
        });
      }

      socketRef.current.emit("exam-start", { roomId });
      setExamStarted(true);
      setExamEnded(false);
      timerRef.current = setInterval(() => setTimer((prev) => prev + 1), 1000);
      
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
    setExamEnded(true);
    clearInterval(timerRef.current);
    setTimer(0);
    cleanupWebRTC();
    toast.success("Exam ended successfully");
  };

  // Handle leave request response
  const handleLeaveRequestResponse = (request, approved) => {
    socketRef.current.emit("examiner-respond-leave", {
      roomId,
      studentSocketId: request.socketId,
      approved
    });
    setLeaveRequests((prev) => prev.filter(r => r.socketId !== request.socketId));
    toast.success(approved ? "Leave request approved" : "Leave request denied");
  };

  // Handle kick student
  const handleKickStudent = (student) => {
    setStudentToKick(student);
    setKickDialogOpen(true);
  };

  const confirmKickStudent = () => {
    if (studentToKick && socketRef.current) {
      socketRef.current.emit("examiner-kick-student", {
        roomId,
        studentSocketId: studentToKick.socketId,
        reason: "Removed by examiner"
      });
      toast.success(`Student ${studentToKick.name} has been removed`);
      setKickDialogOpen(false);
      setStudentToKick(null);
    }
  };

  // Export attendance
  const handleExportAttendance = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/rooms/${roomId}/attendance/export`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_${roomId}_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Attendance exported successfully!");
    } catch (error) {
      console.error("Error exporting attendance:", error);
      toast.error("Failed to export attendance");
    }
  };

  // Dismiss flag
  const handleDismissFlag = (studentId) => {
    setFlaggedStudents((prev) => {
      const newSet = new Set(prev);
      newSet.delete(studentId);
      return newSet;
    });
    toast.success(`Flag dismissed for student ${studentId}`);
  };

  // Show back button only when exam not started OR after exam ended
  const showBackButton = !examStarted || examEnded;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header with Back Button */}
      {showBackButton && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm"
        >
          <div className="px-4 md:px-6 py-3">
            <Button
              onClick={() => navigate("/examiner-dashboard")}
              variant="ghost"
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Overview
            </Button>
          </div>
        </motion.div>
      )}

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
        activeStudents={peers.length}
        totalStudents={students.length}
        flaggedCount={flaggedStudents.size}
      />

      {/* Main Tabs */}
      <div className="p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-2 mb-6 bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
            <TabsTrigger 
              value="monitoring" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Video className="w-4 h-4 mr-2" />
              Live Monitoring
            </TabsTrigger>
            <TabsTrigger 
              value="submissions" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Submissions & Info
            </TabsTrigger>
          </TabsList>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="mt-0">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <ExamInfoSection examDetails={examDetails} />

              <StatsSection
                activeStudents={peers.length}
                totalStudents={students.length}
                logsCount={flaggedStudents.size}
                timer={timer}
                examStarted={examStarted}
              />

              {/* Leave Requests Button (when overlay is closed but requests exist) */}
              {leaveRequests.length > 0 && !leaveRequestsOverlayOpen && (
                <Button
                  onClick={() => setLeaveRequestsOverlayOpen(true)}
                  className="fixed left-4 top-20 z-30 bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Leave Requests ({leaveRequests.length})
                </Button>
              )}

              {/* Leave Requests Overlay (like sidebar) */}
              <AnimatePresence>
                {leaveRequests.length > 0 && leaveRequestsOverlayOpen && (
                  <motion.div
                    initial={{ x: -400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -400, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed left-4 top-20 bottom-4 w-80 glass-card rounded-lg shadow-2xl border-2 border-yellow-200 overflow-hidden flex flex-col z-30"
                  >
                  <div className="p-3 border-b border-yellow-200 bg-yellow-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-700" />
                      <h3 className="font-bold text-yellow-800">Leave Requests ({leaveRequests.length})</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLeaveRequestsOverlayOpen(false)}
                      className="p-1 h-7 w-7 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {leaveRequests.map((request) => (
                      <div key={request.socketId} className="p-3 bg-white rounded-lg border border-yellow-200 hover:shadow-md transition-all">
                        <div className="mb-2">
                          <p className="font-medium text-gray-800 text-sm">{request.studentName}</p>
                          <p className="text-xs text-gray-600 mt-1">{request.reason || "No reason provided"}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleLeaveRequestResponse(request, true)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 h-8 px-3 flex-1"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleLeaveRequestResponse(request, false)}
                            size="sm"
                            variant="destructive"
                            className="h-8 px-3 flex-1"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Deny
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Content */}
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
                  onKickStudent={handleKickStudent}
                  roomId={roomId}
                />
              </main>
            </motion.div>
          </TabsContent>

          {/* Submissions & Info Tab */}
          <TabsContent value="submissions" className="mt-0">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto space-y-6">
              {/* Welcome Banner */}
              <motion.div
                variants={itemVariants}
                animate={lightGradientAnimation}
                className="rounded-xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center text-gray-800"
              >
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Student Submissions & Information
                  </h1>
                  <p className="text-sm md:text-base mt-1 text-gray-600">
                    Review student work and manage attendance
                  </p>
                </div>
                <Button
                  onClick={handleExportAttendance}
                  className="mt-4 md:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Attendance
                </Button>
              </motion.div>

              {/* Stats Grid */}
              <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-card h-32 overflow-hidden relative">
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    animate={{
                      background: [
                        "linear-gradient(135deg, #fff6e5, #e0f7fa, #f9fbe7)",
                        "linear-gradient(135deg, #e0f7fa, #f9fbe7, #fff6e5)",
                      ],
                      transition: { duration: 12, repeat: Infinity, repeatType: "loop" },
                    }}
                  />
                  <CardContent className="p-4 relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Total Students</p>
                      <h3 className="text-2xl font-bold mt-1">{students.length}</h3>
                    </div>
                    <div className="p-2 rounded-lg bg-gradient-to-r from-pink-100 via-blue-100 to-green-100">
                      <Users className="w-5 h-5 text-gray-700" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card h-32 overflow-hidden relative">
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    animate={{
                      background: [
                        "linear-gradient(135deg, #fff6e5, #e0f7fa, #f9fbe7)",
                        "linear-gradient(135deg, #e0f7fa, #f9fbe7, #fff6e5)",
                      ],
                      transition: { duration: 12, repeat: Infinity, repeatType: "loop" },
                    }}
                  />
                  <CardContent className="p-4 relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Submissions</p>
                      <h3 className="text-2xl font-bold mt-1">{submissions.length}</h3>
                    </div>
                    <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-100 via-purple-100 to-cyan-100">
                      <FileText className="w-5 h-5 text-gray-700" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card h-32 overflow-hidden relative">
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    animate={{
                      background: [
                        "linear-gradient(135deg, #fff6e5, #e0f7fa, #f9fbe7)",
                        "linear-gradient(135deg, #e0f7fa, #f9fbe7, #fff6e5)",
                      ],
                      transition: { duration: 12, repeat: Infinity, repeatType: "loop" },
                    }}
                  />
                  <CardContent className="p-4 relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Flagged</p>
                      <h3 className="text-2xl font-bold mt-1">{flaggedStudents.size}</h3>
                    </div>
                    <div className="p-2 rounded-lg bg-gradient-to-r from-red-100 via-orange-100 to-pink-100">
                      <AlertTriangle className="w-5 h-5 text-gray-700" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card h-32 overflow-hidden relative">
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    animate={{
                      background: [
                        "linear-gradient(135deg, #fff6e5, #e0f7fa, #f9fbe7)",
                        "linear-gradient(135deg, #e0f7fa, #f9fbe7, #fff6e5)",
                      ],
                      transition: { duration: 12, repeat: Infinity, repeatType: "loop" },
                    }}
                  />
                  <CardContent className="p-4 relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Active Streams</p>
                      <h3 className="text-2xl font-bold mt-1">{peers.length}</h3>
                    </div>
                    <div className="p-2 rounded-lg bg-gradient-to-r from-green-100 via-teal-100 to-lime-100">
                      <Video className="w-5 h-5 text-gray-700" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Submissions List */}
              <motion.div variants={itemVariants}>
                <Card className="glass-card shadow-lg">
                  <CardHeader>
                    <CardTitle className="gradient-text flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Student Submissions ({submissions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {submissions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <FileText className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-600 text-lg font-medium">No submissions yet</p>
                        <p className="text-gray-500 text-sm mt-2">Student submissions will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {submissions.map((submission) => (
                          <motion.div
                            key={submission._id}
                            whileHover={{ scale: 1.02 }}
                            className="p-4 bg-white/50 rounded-lg border border-gray-200 hover:shadow-md transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                  <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800">{submission.studentName}</p>
                                  <p className="text-sm text-gray-600">{submission.studentId}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(submission.uploadedAt).toLocaleString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-700">{submission.fileName}</p>
                                  <p className="text-xs text-gray-500">
                                    {(submission.fileSize / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Button
                                  onClick={async () => {
                                    try {
                                      const response = await fetch(`http://localhost:3000/api/submissions/submission/${submission._id}/download`);
                                      const data = await response.json();
                                      if (data.success) {
                                        window.open(data.url, '_blank');
                                      }
                                    } catch (error) {
                                      toast.error("Failed to view submission");
                                    }
                                  }}
                                  variant="outline"
                                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  onClick={async () => {
                                    try {
                                      const response = await fetch(`http://localhost:3000/api/submissions/submission/${submission._id}/download`);
                                      const data = await response.json();
                                      if (data.success) {
                                        const a = document.createElement('a');
                                        a.href = data.url;
                                        a.download = data.fileName;
                                        a.click();
                                      }
                                    } catch (error) {
                                      toast.error("Failed to download submission");
                                    }
                                  }}
                                  variant="outline"
                                  className="border-green-500 text-green-600 hover:bg-green-50"
                                >
                                  <FileDown className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Student List */}
              <motion.div variants={itemVariants}>
                <Card className="glass-card shadow-lg">
                  <CardHeader>
                    <CardTitle className="gradient-text flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Student Information ({students.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {students.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Users className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-600 text-lg font-medium">No students joined yet</p>
                      </div>
                    ) : (
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {students.map((student, index) => {
                          const isFlagged = flaggedStudents.has(student.studentId);
                          return (
                            <motion.div
                              key={student.socketId || index}
                              whileHover={{ scale: 1.02 }}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                isFlagged
                                  ? "bg-red-50 border-red-200"
                                  : "bg-white/50 border-gray-200 hover:shadow-md"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  isFlagged
                                    ? "bg-gradient-to-br from-red-500 to-pink-600"
                                    : "bg-gradient-to-br from-blue-500 to-indigo-600"
                                }`}>
                                  <span className="text-white font-semibold text-sm">
                                    {student.name?.charAt(0).toUpperCase() || "S"}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800">{student.name || "Student"}</p>
                                  <p className="text-sm text-gray-600">{student.studentId}</p>
                                  {student.joinedAt && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Joined: {new Date(student.joinedAt).toLocaleTimeString()}
                                    </p>
                                  )}
                                </div>
                                {isFlagged && (
                                  <AlertTriangle className="w-5 h-5 text-red-500" />
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Kick Student Dialog */}
      <AlertDialog open={kickDialogOpen} onOpenChange={setKickDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kick Student?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {studentToKick?.name} ({studentToKick?.studentId}) from the exam? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmKickStudent} className="bg-red-600 hover:bg-red-700">
              Kick Student
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
