import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MonitorPlay, Download, FileText, Eye, ExternalLink, LogOut, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function ExamInstructions({ courseName, durationMinutes, roomId, username }) {
  const navigate = useNavigate();
  const [isSharing, setIsSharing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [examStarted, setExamStarted] = useState(false);
  const [validRoom, setValidRoom] = useState(false);
  const [questionUrl, setQuestionUrl] = useState(null);
  const [examStartedByExaminer, setExamStartedByExaminer] = useState(false);
  const [showLeaveRequest, setShowLeaveRequest] = useState(false);
  const [leaveReason, setLeaveReason] = useState("");
  const [submissionFile, setSubmissionFile] = useState(null);
  const [uploadingSubmission, setUploadingSubmission] = useState(false);
  const userVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);
  const submissionInputRef = useRef(null);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // countdown timer
  useEffect(() => {
    if (!isSharing || timeLeft <= 0) return;
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [isSharing, timeLeft]);

  // Connect to socket and join room immediately when component mounts
  useEffect(() => {
    if (!roomId || typeof window === "undefined") return;

    // ✅ Connect to signaling server immediately
    socketRef.current = io("https://codeguard-server-side-walb.onrender.com");
    
    // Get student ID from sessionStorage
    const studentId = sessionStorage.getItem('studentId') || 'unknown';
    
    // Join room with student info immediately
    socketRef.current.emit("student-join-room", { 
      roomId, 
      studentId,
      studentName: username || 'Student'
    });

    console.log("✅ Student joined socket room:", { roomId, studentId, name: username });

    // Listen for exam start - questionUrl is actually the roomId now
    socketRef.current.on("exam-started", ({ questionUrl: roomIdForQuestion }) => {
      console.log("📚 Exam started, room ID for question:", roomIdForQuestion);
      // Store roomId as questionUrl (we'll use it to fetch PDF)
      setQuestionUrl(roomIdForQuestion || roomId);
      setExamStartedByExaminer(true);
      toast.success("Exam started! Questions are now available.");
      
      // ✅ Notify extension that exam has actually started (start monitoring now)
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage({
          type: "EXAM_STARTED"
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.warn("Extension not available:", chrome.runtime.lastError.message);
          } else {
            console.log("✅ Extension notified: Exam started - monitoring active");
          }
        });
      }
    });

    socketRef.current.on("exam-ended", (data) => {
      setExamStartedByExaminer(false);
      toast.info(data?.message || "Exam has ended.");
      
      // ✅ Notify extension that exam has ended
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage({
          type: "END_EXAM"
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.warn("Extension not available:", chrome.runtime.lastError.message);
          } else {
            console.log("✅ Extension notified: Exam ended");
          }
        });
      }
      
      // Stop screen sharing and disconnect
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      setIsSharing(false);
      setExamStarted(false);
    });

    // Handle leave request responses
    socketRef.current.on("leave-request-approved", (data) => {
      toast.success(data.message || "Your leave request has been approved!");
      
      // ✅ Stop monitoring when student leaves
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage({
          type: "STOP_MONITORING"
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.warn("Extension not available:", chrome.runtime.lastError.message);
          } else {
            console.log("✅ Extension notified: Monitoring stopped");
          }
        });
      }
      
      // Student can now leave - redirect after a moment
      setTimeout(() => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        if (peerRef.current) {
          peerRef.current.destroy();
          peerRef.current = null;
        }
        socketRef.current?.disconnect();
        navigate('/student-dashboard');
      }, 2000);
    });

    socketRef.current.on("leave-request-denied", (data) => {
      toast.error(data.message || "Your leave request has been denied.");
    });

    // Handle kick
    socketRef.current.on("student-kicked", (data) => {
      toast.error(data.message || "You have been removed from the exam.");
      
      // ✅ Stop monitoring when student is kicked
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage({
          type: "STOP_MONITORING"
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.warn("Extension not available:", chrome.runtime.lastError.message);
          } else {
            console.log("✅ Extension notified: Monitoring stopped");
          }
        });
      }
      
      setTimeout(() => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        if (peerRef.current) {
          peerRef.current.destroy();
          peerRef.current = null;
        }
        socketRef.current?.disconnect();
        navigate('/student-dashboard');
      }, 2000);
    });

    // Handle force disconnect
    socketRef.current.on("force-disconnect", () => {
      // ✅ Stop monitoring when force disconnected
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage({
          type: "STOP_MONITORING"
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.warn("Extension not available:", chrome.runtime.lastError.message);
          } else {
            console.log("✅ Extension notified: Monitoring stopped");
          }
        });
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      setIsSharing(false);
      setExamStarted(false);
      socketRef.current?.disconnect();
      toast.error("You have been disconnected from the exam.");
    });

    // ✅ Handle examiner signal for WebRTC
    socketRef.current.on("receive-signal", (payload) => {
      console.log("📩 Received examiner signal:", payload);

      // Only handle signal if stream is ready (screen sharing has started)
      if (!streamRef.current) {
        console.warn("⚠️ Stream not ready yet - screen sharing not started");
        return;
      }

      // Ensure peer exists (should be created when screen sharing starts)
      if (!peerRef.current) {
        console.warn("⚠️ Peer not created yet, creating now...");
        const peer = new Peer({
          initiator: false,
          trickle: true,
          stream: streamRef.current,
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
          console.log("📤 Sending signal back to examiner:", signalData);
          socketRef.current?.emit("send-signal", {
            signal: signalData,
            to: payload.from,
          });
        });

        peer.on("connect", () => {
          console.log("✅ Peer connection established with examiner");
        });

        peer.on("error", (err) => console.error("Peer error:", err));

        peerRef.current = peer;
      }

      // Signal the peer with the received signal
      try {
        if (peerRef.current) {
          peerRef.current.signal(payload.signal);
        }
      } catch (err) {
        console.error("Error signaling peer:", err);
      }
    });

    // cleanup on unmount
    return () => {
      console.log("🧹 Cleaning up connections...");
      peerRef.current?.destroy();
      socketRef.current?.disconnect();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [roomId, username]);

  // ✅ validate room again before starting screen share (extra safety)
  // const validateRoom = async () => {
  //   try {
  //     const response = await axios.post("https://codeguard-server-side-walb.onrender.com/api/rooms/validate", {
  //       roomId,
  //       password: "", // optional if already validated before joining
  //     });

  //     if (response.data.success) {
  //       console.log("✅ Room validated before starting exam");
  //       setValidRoom(true);
  //       return true;
  //     } else {
  //       alert("Room validation failed. Please rejoin from dashboard.");
  //       return false;
  //     }
  //   } catch (err) {
  //     console.error("❌ Validation failed:", err);
  //     alert("Server error while validating room. Please retry.");
  //     return false;
  //   }
  // };

  const startExam = async () => {
    if (!roomId) return;

    if (!examStartedByExaminer) {
      toast.error("Please wait for the examiner to start the exam first.");
      return;
    }

    setIsSharing(true);
    try {
      // ✅ Get student's screen share
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      streamRef.current = stream;

      console.log("🎥 Screen sharing started:", stream);
      if (userVideoRef.current) userVideoRef.current.srcObject = stream;

      setExamStarted(true);

      // Notify examiner that screen sharing has started
      if (socketRef.current) {
        const studentId = sessionStorage.getItem('studentId') || 'unknown';
        socketRef.current.emit("student-started-sharing", {
          roomId,
          studentId,
          socketId: socketRef.current.id
        });
        console.log("📤 Notified examiner that screen sharing started");
      }

      // Peer connection will be created when examiner sends signal
      // (handled in receive-signal listener above)

    } catch (err) {
      console.error("❌ Error accessing display media:", err);
      toast.error("Screen sharing permission is required. Please allow and try again.");
      setIsSharing(false);
      setExamStarted(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 md:py-8">
      <Card className="w-full max-w-6xl mx-auto shadow-2xl border-0 rounded-none md:rounded-xl overflow-hidden">
        <CardHeader className="relative pt-8 pb-6 bg-linear-to-r from-[#1a0f3d] via-[#2e1d5a] to-[#1a0f3d] text-white">
          <CardTitle className="text-center text-2xl md:text-3xl font-bold mb-2">
            {courseName}
          </CardTitle>
          <div className="absolute top-4 right-4 md:right-6 text-right">
            <p className="text-xs md:text-sm font-medium text-blue-200">Time Remaining</p>
            <p className="text-xl md:text-2xl font-bold font-mono text-white">
              {formatTime(timeLeft)}
            </p>
          </div>
          {examStartedByExaminer && (
            <div className="mt-4 text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                Exam Started
              </span>
            </div>
          )}
        </CardHeader>

      <CardContent className="px-4 md:px-10 py-8 bg-white">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Exam Question Section - Only show after screen sharing starts */}
          {examStartedByExaminer && questionUrl && isSharing && (
            <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Exam Questions Available</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700 font-medium">
                  The exam questions are now available. You can download them below.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                        const proxyUrl = `https://codeguard-server-side-walb.onrender.com/api/rooms/${roomId}/question/download`;
                        
                        const loadingToast = toast.loading("Preparing PDF view...");
                        const headers = {};
                        if (token) {
                          headers['Authorization'] = `Bearer ${token}`;
                        }
                        
                        const response = await fetch(proxyUrl, {
                          method: 'GET',
                          headers: headers,
                          credentials: 'include'
                        });
                        
                        if (!response.ok) {
                          let errorMessage = "Failed to get view link";
                          try {
                            const errorData = await response.json();
                            errorMessage = errorData.message || errorData.error || errorMessage;
                          } catch (e) {
                            errorMessage = response.statusText || errorMessage;
                          }
                          toast.dismiss(loadingToast);
                          toast.error(errorMessage);
                          return;
                        }
                        
                        const data = await response.json();
                        
                        if (data.success && data.url) {
                          // Open PDF in new tab for viewing
                          window.open(data.url, '_blank');
                          toast.dismiss(loadingToast);
                          toast.success("PDF opened in new tab");
                        } else {
                          toast.dismiss(loadingToast);
                          toast.error("Invalid response from server");
                        }
                      } catch (error) {
                        console.error("Error viewing PDF:", error);
                        toast.error("Failed to view PDF. Please try again.");
                      }
                    }}
                    variant="outline"
                    className="flex items-center space-x-2 border-2 hover:bg-blue-50 border-blue-300"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View PDF</span>
                  </Button>
                  
                  <Button
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                        const proxyUrl = `https://codeguard-server-side-walb.onrender.com/api/rooms/${roomId}/question/download`;
                        
                        const loadingToast = toast.loading("Preparing PDF download...");
                        const headers = {};
                        if (token) {
                          headers['Authorization'] = `Bearer ${token}`;
                        }
                        
                        const response = await fetch(proxyUrl, {
                          method: 'GET',
                          headers: headers,
                          credentials: 'include'
                        });
                        
                        if (!response.ok) {
                          let errorMessage = "Failed to get download link";
                          try {
                            const errorData = await response.json();
                            errorMessage = errorData.message || errorData.error || errorMessage;
                          } catch (e) {
                            errorMessage = response.statusText || errorMessage;
                          }
                          toast.dismiss(loadingToast);
                          toast.error(errorMessage);
                          return;
                        }
                        
                        const data = await response.json();
                        
                        if (data.success && data.url) {
                          // Trigger download
                          const link = document.createElement('a');
                          link.href = data.url;
                          link.download = data.fileName || `exam-questions-${roomId}.pdf`;
                          link.target = '_blank';
                          link.style.display = 'none';
                          
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          
                          toast.dismiss(loadingToast);
                          toast.success("PDF download started");
                        } else {
                          toast.dismiss(loadingToast);
                          toast.error("Invalid response from server");
                        }
                      } catch (error) {
                        console.error("Error downloading PDF:", error);
                        toast.error("Failed to download PDF. Please try again.");
                      }
                    }}
                    variant="outline"
                    className="flex items-center space-x-2 border-2 hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!examStartedByExaminer && (
            <Card className="bg-linear-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 shadow-md">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                  <p className="text-yellow-800 font-semibold text-center">
                    ⏳ Waiting for examiner to start the exam...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-linear-to-br from-gray-50 to-blue-50 border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3 text-sm md:text-base text-gray-700">
                <li className="leading-relaxed">Ensure your coding environment (e.g., VS Code) is open and ready.</li>
                <li className="leading-relaxed">Click "Start Screen Sharing" to begin sharing your entire screen with the examiner.</li>
                <li className="leading-relaxed">Do not close or refresh the browser during the exam.</li>
                <li className="leading-relaxed">The examiner will monitor your screen in real-time throughout the exam.</li>
                <li className="leading-relaxed">Questions will be available after you start screen sharing.</li>
              </ol>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
            {!examStarted && (
              <Button
                onClick={startExam}
                disabled={isSharing || !examStartedByExaminer}
                className="w-full sm:w-auto bg-linear-to-r from-[#1a0f3d] to-[#2e1d5a] hover:from-[#2e1d5a] hover:to-[#3d2a6b] text-white px-8 py-6 text-base md:text-lg font-semibold shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
              >
                <MonitorPlay className="mr-2 h-5 w-5" />
                {!examStartedByExaminer ? "Waiting for Exam to Start..." : "Start Screen Sharing"}
              </Button>
            )}
            {examStarted && (
              <>
                <Button
                  variant="outline"
                  disabled
                  className="px-8 py-6 text-base md:text-lg border-2 border-green-500 text-green-700 bg-green-50 font-semibold"
                >
                  <MonitorPlay className="mr-2 h-5 w-5" />
                  Screen Sharing Active
                </Button>
                <Button
                  onClick={() => setShowLeaveRequest(true)}
                  variant="outline"
                  className="px-6 py-6 text-base md:text-lg border-2 border-orange-500 text-orange-700 bg-orange-50 font-semibold hover:bg-orange-100"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Request to Leave
                </Button>
              </>
            )}
          </div>

          {/* Leave Request Dialog */}
          {showLeaveRequest && (
            <Card className="mt-6 bg-yellow-50 border-2 border-yellow-300">
              <CardHeader>
                <CardTitle className="text-yellow-800">Request to Leave Exam</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason (optional)
                  </label>
                  <Input
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    placeholder="Enter reason for leaving..."
                    className="bg-white"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      const studentId = sessionStorage.getItem('studentId') || 'unknown';
                      socketRef.current?.emit("student-request-leave", {
                        roomId,
                        studentId,
                        studentName: username,
                        reason: leaveReason || "No reason provided"
                      });
                      toast.info("Leave request sent to examiner");
                      setShowLeaveRequest(false);
                      setLeaveReason("");
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Send Request
                  </Button>
                  <Button
                    onClick={() => {
                      setShowLeaveRequest(false);
                      setLeaveReason("");
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* File Upload Section (when screen sharing is active) */}
          {isSharing && (
            <Card className="mt-6 bg-green-50 border-2 border-green-300">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Your Work
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">
                  Upload your completed work as a PDF or Word document. The examiner will review it.
                </p>
                <Input
                  ref={submissionInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const allowedTypes = [
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                      ];
                      if (allowedTypes.includes(file.type)) {
                        setSubmissionFile(file);
                      } else {
                        toast.error("Please select a PDF or Word document");
                      }
                    }
                  }}
                  className="bg-white"
                />
                {submissionFile && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">{submissionFile.name}</span>
                    </div>
                    <Button
                      onClick={async () => {
                        if (!submissionFile) return;
                        setUploadingSubmission(true);
                        const formData = new FormData();
                        formData.append('submission', submissionFile);
                        formData.append('studentId', sessionStorage.getItem('studentId') || 'unknown');
                        formData.append('studentName', username || 'Student');

                        try {
                          const response = await axios.post(
                            `https://codeguard-server-side-walb.onrender.com/api/submissions/${roomId}/submit`,
                            formData,
                            {
                              headers: {
                                'Content-Type': 'multipart/form-data',
                              },
                            }
                          );

                          if (response.data.success) {
                            toast.success("Work uploaded successfully!");
                            setSubmissionFile(null);
                            if (submissionInputRef.current) {
                              submissionInputRef.current.value = '';
                            }
                          } else {
                            toast.error(response.data.message || "Failed to upload work");
                          }
                        } catch (error) {
                          console.error("Upload error:", error);
                          toast.error(error.response?.data?.message || "Failed to upload work");
                        } finally {
                          setUploadingSubmission(false);
                        }
                      }}
                      disabled={uploadingSubmission}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {uploadingSubmission ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {isSharing && (
          <div className="mt-6 max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-2 shadow-xl">
              <div className="flex items-center justify-between mb-2 px-2">
                <p className="text-white text-sm font-medium">Your Screen Preview</p>
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="text-white text-xs">Live</span>
                </span>
              </div>
              <video
                ref={userVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full rounded-lg border-2 border-gray-700"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  );
}
