import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonitorPlay, Download, FileText, Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";
import { toast } from "sonner";

export function ExamInstructions({ courseName, durationMinutes, roomId, username }) {
  const [isSharing, setIsSharing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [examStarted, setExamStarted] = useState(false);
  const [validRoom, setValidRoom] = useState(false);
  const [questionUrl, setQuestionUrl] = useState(null);
  const [examStartedByExaminer, setExamStartedByExaminer] = useState(false);
  const userVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);

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
    socketRef.current = io("http://localhost:3000");
    
    // Get student ID from sessionStorage
    const studentId = sessionStorage.getItem('studentId') || 'unknown';
    
    // Join room with student info immediately
    socketRef.current.emit("student-join-room", { 
      roomId, 
      studentId,
      studentName: username || 'Student'
    });

    console.log("✅ Student joined socket room:", { roomId, studentId, name: username });

    // Listen for exam start and question
    socketRef.current.on("exam-started", ({ questionUrl: qUrl }) => {
      console.log("📚 Exam started, received question URL:", qUrl);
      setQuestionUrl(qUrl);
      setExamStartedByExaminer(true);
      toast.success("Exam started! Questions are now available.");
    });

    socketRef.current.on("exam-ended", () => {
      setExamStartedByExaminer(false);
      toast.info("Exam has ended.");
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
  //     const response = await axios.post("http://localhost:3000/api/rooms/validate", {
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
                  The exam questions are now available. You can download or view them below.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => {
                      const proxyUrl = `http://localhost:3000/api/rooms/${roomId}/question/download`;
                      window.open(proxyUrl, '_blank');
                    }}
                    className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center space-x-2 shadow-md"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Questions</span>
                  </Button>
                  <Button
                    onClick={() => {
                      const proxyUrl = `http://localhost:3000/api/rooms/${roomId}/question/download`;
                      const link = document.createElement('a');
                      link.href = proxyUrl;
                      link.download = `exam-questions-${roomId}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
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
              <Button
                variant="outline"
                disabled
                className="px-8 py-6 text-base md:text-lg border-2 border-green-500 text-green-700 bg-green-50 font-semibold"
              >
                <MonitorPlay className="mr-2 h-5 w-5" />
                Screen Sharing Active
              </Button>
            )}
          </div>
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
