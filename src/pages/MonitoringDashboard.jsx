import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Peer from "simple-peer";
import io from "socket.io-client";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import { Bell, Clock, HeartPulse, ScreenShare, Users, Video, Upload, FileText, ChevronLeft, ChevronRight, AlertTriangle, Globe } from "lucide-react";
import StudentVideo from "../components/StudentVideo";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { toast } from "sonner";

// Polyfill global for simple-peer in browser
if (typeof global === "undefined") {
  window.global = window;
}

export default function MonitoringDashboardPage() {
  const { roomId } = useParams();
  const [peers, setPeers] = useState([]);
  const [logs, setLogs] = useState([]); // Activity log list
  const [examStarted, setExamStarted] = useState(false);
  const [timer, setTimer] = useState(0); // in seconds
  const [students, setStudents] = useState([]); // List of joined students
  const [sidebarOpen, setSidebarOpen] = useState(true); // Student sidebar
  const [questionFile, setQuestionFile] = useState(null);
  const [questionUrl, setQuestionUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const socketRef = useRef(null);
  const peersRef = useRef([]);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Helper: Format seconds into hh:mm:ss
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((secs % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // --- Main useEffect ---
  useEffect(() => {
    if (!roomId || typeof window === "undefined") return;

    socketRef.current = io("http://localhost:3000");

    // Fetch historical logs on mount
    fetch(`http://localhost:3000/api/proctoring/logs?roomId=${roomId}`)
      .then((res) => res.json())
      .then((data) => setLogs(data.logs || []))
      .catch((err) => console.error("Failed to fetch logs:", err));

    // Fetch existing question if any
    fetch(`http://localhost:3000/api/rooms/${roomId}/question`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.questionUrl) {
          setQuestionUrl(data.questionUrl);
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
      
      // Don't create peer connection yet - wait for student to start screen sharing
      // Peer connection will be created when student emits "student-started-sharing"
    });

    // Listen for when student starts screen sharing
    socketRef.current.on("student-started-sharing", ({ studentId, socketId }) => {
      console.log(`📹 Student ${studentId} (${socketId}) started screen sharing`);
      
      // Use functional update to get latest students state
      setStudents((currentStudents) => {
        // Find the student info
        let studentInfo = currentStudents.find(s => s.socketId === socketId || s.studentId === studentId);
        
        // If not found, create default info
        if (!studentInfo) {
          studentInfo = {
            socketId: socketId,
            studentId: studentId,
            name: `Student ${studentId}`,
            joinedAt: new Date()
          };
          console.warn("Student info not found, using default:", studentInfo);
        }
        
        // Create peer connection outside of setState
        setTimeout(() => createPeerConnectionForStudent(socketId, studentInfo), 0);
        
        return currentStudents; // Return unchanged state
      });
    });

    // Helper function to create peer connection for a student
    const createPeerConnectionForStudent = (socketId, studentInfo) => {

      // Check if peer already exists
      const existingPeer = peersRef.current.find((p) => p.peerId === socketId);
      if (existingPeer) {
        console.log("Peer already exists for:", socketId);
        return;
      }

      console.log("Creating peer connection for student:", socketId);
      
      // Create new peer connection
      const peer = new Peer({
        initiator: true,
        trickle: true,
        stream: null,
        config: {
          iceServers: [
            { urls: ["stun:bn-turn2.xirsys.com"] },
            {
              username:
                "J4u6YIUf1k35iq4q0pS1BfFWOC4UUQy25eT5ZsDsWdETzfXFw0TYZL4etEHu7VrnAAAAAGjmYQ5NdXNoZmlx",
              credential: "2403ae1a-a447-11f0-9415-0242ac140004",
              urls: [
                "turn:bn-turn2.xirsys.com:80?transport=udp",
                "turn:bn-turn2.xirsys.com:3478?transport=udp",
                "turn:bn-turn2.xirsys.com:80?transport=tcp",
                "turn:bn-turn2.xirsys.com:3478?transport=tcp",
                "turns:bn-turn2.xirsys.com:443?transport=tcp",
                "turns:bn-turn2.xirsys.com:5349?transport=tcp",
              ],
            },
          ],
        },
      });

      peer.on("signal", (signalData) => {
        console.log("📤 Sending signal to student:", socketId);
        socketRef.current.emit("send-signal", {
          to: socketId,
          signal: signalData,
        });
      });

      peer.on("stream", (remoteStream) => {
        console.log("📹 Received stream from student:", socketId);
        const peerState = peersRef.current.find((p) => p.peerId === socketId);
        if (peerState) {
          peerState.stream = remoteStream;
          setPeers([...peersRef.current]);
          toast.success(`Receiving stream from ${studentInfo.name}`);
        }
      });

      peer.on("connect", () => {
        console.log("✅ Peer connection established with:", socketId);
      });

      peer.on("error", (err) => {
        console.error("❌ Peer error:", err);
        toast.error(`Connection error with ${studentInfo.name}`);
      });

      const peerItem = { 
        peerId: socketId, 
        peer, 
        stream: null,
        studentInfo: studentInfo
      };
      
      // Check if peer already exists before adding
      const existingIndex = peersRef.current.findIndex((p) => p.peerId === socketId);
      if (existingIndex >= 0) {
        peersRef.current[existingIndex] = peerItem;
      } else {
        peersRef.current.push(peerItem);
      }
      setPeers([...peersRef.current]);
    };

    socketRef.current.on("receive-signal", ({ signal, from }) => {
      const peerItem = peersRef.current.find((p) => p.peerId === from);
      if (peerItem) peerItem.peer.signal(signal);
    });

    socketRef.current.on("student-left", (studentInfo) => {
      console.log(`❌ Student ${studentInfo.name} (${studentInfo.studentId}) left.`);
      setStudents((prev) => prev.filter((s) => s.socketId !== studentInfo.socketId));
      const peerItem = peersRef.current.find((p) => p.peerId === studentInfo.socketId);
      peerItem?.peer.destroy();
      const newPeers = peersRef.current.filter((p) => p.peerId !== studentInfo.socketId);
      peersRef.current = newPeers;
      setPeers(newPeers);
      toast.info(`${studentInfo.name} left the exam`);
    });

    // Handle flagged events
    socketRef.current.on("student-flagged", (log) => {
      console.log("🚨 Flagged Activity:", log);
      setLogs((prev) => [log, ...prev]);
    });

    return () => {
      socketRef.current?.disconnect();
      peersRef.current.forEach((p) => p.peer.destroy());
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
    if (!questionUrl) {
      toast.error("Please upload exam questions before starting the exam");
      return;
    }
    
    // Verify question exists in database
    try {
      const response = await fetch(`http://localhost:3000/api/rooms/${roomId}/question`);
      const data = await response.json();
      
      if (data.success && data.hasQuestion) {
        // Emit exam-start with just roomId (students will use it to fetch PDF)
        socketRef.current.emit("exam-start", { roomId });
        setExamStarted(true);
        timerRef.current = setInterval(() => setTimer((prev) => prev + 1), 1000);
        toast.success("Exam started! Questions sent to all students.");
        console.log("✅ Exam started for room:", roomId);
      } else {
        toast.error("Question not found. Please upload questions again.");
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      toast.error("Failed to verify question. Please try again.");
    }
  };

  const endExam = () => {
    socketRef.current.emit("exam-end", { roomId });
    setExamStarted(false);
    clearInterval(timerRef.current);
    setTimer(0);
    // Optional: Notify students, cleanup peers
    peersRef.current.forEach((p) => p.peer.destroy());
    setPeers([]);
  };

  const activeStudents = peers.length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold bg-linear-to-r from-[#1a0f3d] to-[#2e1d5a] bg-clip-text text-transparent">
                International Islamic University Chittagong
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Real-Time Proctoring Dashboard – Room <span className="font-semibold text-[#1a0f3d]">{roomId}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {!examStarted && (
                <div className="flex items-center space-x-2 border-r pr-3 border-gray-300">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex items-center space-x-2 border-2 hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">Upload Questions</span>
                    <span className="sm:hidden">Upload</span>
                  </Button>
                  {questionFile && (
                    <Button
                      onClick={handleUploadQuestion}
                      disabled={uploading}
                      className="flex items-center space-x-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md"
                    >
                      {uploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4" />
                          <span>Save</span>
                        </>
                      )}
                    </Button>
                  )}
                  {questionUrl && !questionFile && (
                    <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">Ready</span>
                    </div>
                  )}
                </div>
              )}
              <Button
                onClick={startExam}
                disabled={examStarted || !questionUrl}
                className={`text-white font-semibold shadow-md ${
                  examStarted 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                }`}
              >
                {examStarted ? "Exam Running" : "Start Exam"}
              </Button>
              <Button
                onClick={endExam}
                disabled={!examStarted}
                variant="destructive"
                className="font-semibold shadow-md"
              >
                End Exam
              </Button>
              <div className="text-right bg-linear-to-br from-gray-900 to-gray-800 text-white px-4 py-2 rounded-lg shadow-md">
                <p className="font-mono text-lg md:text-xl font-bold">{formatTime(timer)}</p>
                <p className="text-xs text-gray-300">Session Timer</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            icon={<Users className="text-blue-500" />}
            title="Active Students"
            value={activeStudents.toString()}
            subtitle={`${students.length} joined`}
          />
          <StatCard
            icon={<Bell className="text-red-500" />}
            title="Active Alerts"
            value={logs.length.toString()}
            highlight
            subtitle="Flagged activities"
          />
          <StatCard
            icon={<HeartPulse className="text-green-500" />}
            title="System Health"
            value="98%"
            subtitle="All systems operational"
          />
          <StatCard
            icon={<Clock className="text-purple-500" />}
            title="Session Time"
            value={formatTime(timer)}
            subtitle={examStarted ? "Exam in progress" : "Ready to start"}
          />
        </div>
      </section>

      {/* Main */}
      <main className="flex flex-1 p-4 md:p-6 gap-4 md:gap-6 relative flex-col lg:flex-row">
        {/* Student Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full lg:w-80 bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50 flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center space-x-2 text-gray-800">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Joined Students</span>
                  <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full">
                    {students.length}
                  </span>
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="p-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {students.length === 0 ? (
                  <div className="flex flex-col items-center justify-center mt-12 py-8">
                    <Users className="w-16 h-16 text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm text-center font-medium">
                      No students joined yet
                    </p>
                  </div>
                ) : (
                  students.map((student) => (
                    <Card key={student.socketId} className="p-4 hover:shadow-md transition-all border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="shrink-0">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-900 truncate">{student.name}</p>
                            <p className="text-xs text-gray-500 truncate">ID: {student.studentId}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(student.joinedAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center space-x-2">
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!sidebarOpen && (
          <Button
            variant="outline"
            onClick={() => setSidebarOpen(true)}
            className="absolute left-4 md:left-6 top-4 md:top-6 z-10 shadow-md border-2 bg-white hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4 mr-2" />
            Students ({students.length})
          </Button>
        )}

        {/* Student video grid */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-4 md:p-6 overflow-auto border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Live Student Streams</h2>
              <p className="text-sm text-gray-500 mt-1">
                {peers.length} active stream{peers.length !== 1 ? 's' : ''} • {students.length} total student{students.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center space-x-2 border-2">
                <ScreenShare className="w-4 h-4" /> <span className="hidden sm:inline">Grid View</span>
              </Button>
              <Button className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex items-center space-x-2 shadow-md">
                <Video className="w-4 h-4" /> <span className="hidden sm:inline">Active Streams</span>
              </Button>
            </div>
          </div>

          {peers.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-16 py-12">
              <div className="w-24 h-24 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                <Video className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium text-lg mb-2">No active streams yet</p>
              <p className="text-gray-500 text-sm text-center max-w-md">
                Student streams will appear here once they start screen sharing
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {peers.map((p) =>
                p.stream ? (
                  <StudentVideo 
                    key={p.peerId} 
                    peer={p.peer} 
                    stream={p.stream}
                    studentName={p.studentInfo?.name || "Student"}
                    studentId={p.studentInfo?.studentId || p.peerId}
                  />
                ) : null
              )}
            </div>
          )}
        </div>

        {/* Real-time Activity Log */}
        <div className="w-full md:w-[400px] bg-white rounded-xl shadow-lg p-4 md:p-5 border-2 border-gray-200 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center">
              <AlertTriangle className="text-red-500 mr-2 w-5 h-5" /> 
              Activity Log
            </h2>
            {logs.length > 0 && (
              <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                {logs.length}
              </span>
            )}
          </div>
          <div className="overflow-y-auto flex-1 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <AnimatePresence>
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-12 py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <Bell className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-gray-500 text-sm text-center font-medium">
                    No flagged activity yet
                  </p>
                  <p className="text-gray-400 text-xs text-center mt-1">
                    All students are following guidelines
                  </p>
                </div>
              ) : (
                logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border-2 border-red-200 bg-linear-to-r from-red-50 to-orange-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className="shrink-0 mt-0.5">
                        <Globe className="text-red-500 w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 mb-1">
                          Student #{log.studentId}
                        </p>
                        <p className="text-xs text-gray-700 break-all mb-2 bg-white/60 px-2 py-1 rounded">
                          <span className="font-medium">Visited:</span> {log.illegalUrl}
                        </p>
                        <p className="text-[11px] text-gray-500 mb-2">
                          {new Date(log.timestamp).toLocaleString("en-GB")}
                        </p>
                        <a
                          href={log.screenshotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          View Screenshot →
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Stat Card ---
function StatCard({ icon, title, value, highlight, subtitle }) {
  return (
    <div
      className={`bg-white rounded-xl p-5 flex justify-between items-center shadow-md hover:shadow-lg transition-shadow border-2 ${
        highlight ? "border-red-200 bg-red-50/30" : "border-gray-100"
      }`}
    >
      <div className="flex-1">
        <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">{title}</p>
        <p
          className={`text-2xl md:text-3xl font-bold mb-1 ${
            highlight ? "text-red-600" : "text-gray-800"
          }`}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
      <div className={`p-3 rounded-full ${highlight ? "bg-red-100" : "bg-linear-to-br from-gray-50 to-gray-100"}`}>
        {icon}
      </div>
    </div>
  );
}
