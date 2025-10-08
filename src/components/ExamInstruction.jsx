import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonitorPlay } from "lucide-react";
import io from "socket.io-client";
import Peer from "simple-peer";
import axios from "axios";

export function ExamInstructions({ courseName, durationMinutes, roomId, username }) {
  const [isSharing, setIsSharing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [examStarted, setExamStarted] = useState(false);
  const [validRoom, setValidRoom] = useState(false);
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

  // cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("🧹 Cleaning up connections...");
      peerRef.current?.destroy();
      socketRef.current?.disconnect();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // ✅ validate room again before starting screen share (extra safety)
  // const validateRoom = async () => {
  //   try {
  //     const response = await axios.post("https://codeguard-server-side-walb.onrender.com/rooms/validate", {
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

    // double-check room validation
    // const isValid = await validateRoom();
    // if (!isValid) return;

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

      // ✅ Connect to signaling server
      socketRef.current = io("https://codeguard-server-side-walb.onrender.com");
      socketRef.current.emit("student-join-room", roomId);

      // ✅ Handle examiner signal
      socketRef.current.on("receive-signal", (payload) => {
        console.log("📩 Received examiner signal:", payload);

        if (!peerRef.current) {
          const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: streamRef.current,
          });

          peer.on("signal", (signalData) => {
            console.log("📤 Sending signal back to examiner:", signalData);
            socketRef.current?.emit("send-signal", {
              signal: signalData,
              to: payload.from,
            });
          });

          peer.on("error", (err) => console.error("Peer error:", err));

          peerRef.current = peer;
        }

        peerRef.current.signal(payload.signal);
      });
    } catch (err) {
      console.error("❌ Error accessing display media:", err);
      alert("Screen sharing permission is required. Please allow and try again.");
      setExamStarted(false);
    }
  };

  return (
    <Card className="w-full rounded-t-none shadow-xl">
      <CardHeader className="relative pt-10">
        <CardTitle className="text-center text-3xl font-bold text-gray-800">
          {courseName}
        </CardTitle>
        <div className="absolute top-4 right-6 text-right">
          <p className="text-sm font-medium text-gray-600">Time Remaining:</p>
          <p className="text-2xl font-bold text-gray-800">
            {formatTime(timeLeft)}
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-10 pb-10">
        <div className="max-w-xl mx-auto space-y-8">
          <ol className="list-decimal list-inside space-y-3 text-lg text-gray-700">
            <li>Ensure your coding environment (e.g., VS Code) is open.</li>
            <li>Click "Start Exam" to begin sharing your entire screen.</li>
            <li>Do not close or refresh the browser during the exam.</li>
            <li>Examiner can monitor your screen in real-time.</li>
          </ol>

          <div className="flex justify-center items-center space-x-4 pt-4">
            {!examStarted && (
              <Button
                onClick={startExam}
                disabled={isSharing}
                className="bg-[#1a0f3d] hover:bg-[#2e1d5a] text-white px-8 py-6 text-lg"
              >
                Start Exam & Share Screen
              </Button>
            )}
            <Button
              variant="outline"
              disabled
              className={`px-8 py-6 text-lg ${
                isSharing
                  ? "border-green-600 text-green-700 bg-green-50"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              <MonitorPlay className="mr-2 h-5 w-5" />
              Monitoring {isSharing ? "Active" : "Inactive"}
            </Button>
          </div>
        </div>

        <video
          ref={userVideoRef}
          autoPlay
          muted
          playsInline
          style={{ display: "block", width: "100%", marginTop: "20px" }}
        />
      </CardContent>
    </Card>
  );
}
