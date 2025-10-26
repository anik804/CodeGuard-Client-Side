import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Peer from "simple-peer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Bell,
  Clock,
  HeartPulse,
  ScreenShare,
  Video,
  AlertTriangle,
  Globe,
  X,
} from "lucide-react";
import StudentVideo from "../components/StudentVideo";
import { Button } from "../components/ui/button";

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
  const socketRef = useRef(null);
  const peersRef = useRef([]);
  const timerRef = useRef(null);

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

    // Join room as examiner
    socketRef.current.emit("examiner-join-room", { roomId });

    // --- WebRTC: Handle student joining ---
    socketRef.current.on("student-joined", ({ studentId }) => {
      console.log(`👩‍🎓 Student ${studentId} joined.`);

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
        socketRef.current.emit("send-signal", {
          to: studentId,
          signal: signalData,
        });
      });

      peer.on("stream", (remoteStream) => {
        const peerState = peersRef.current.find((p) => p.peerId === studentId);
        if (peerState) {
          peerState.stream = remoteStream;
          setPeers([...peersRef.current]);
        }
      });

      peer.on("error", (err) => console.error("Peer error:", err));

      const newPeer = { peerId: studentId, peer, stream: null };
      peersRef.current.push(newPeer);
      setPeers([...peersRef.current]);
    });

    socketRef.current.on("receive-signal", ({ signal, from }) => {
      const peerItem = peersRef.current.find((p) => p.peerId === from);
      if (peerItem) peerItem.peer.signal(signal);
    });

    socketRef.current.on("student-left", (studentId) => {
      console.log(`❌ Student ${studentId} left.`);
      const peerItem = peersRef.current.find((p) => p.peerId === studentId);
      peerItem?.peer.destroy();
      const newPeers = peersRef.current.filter((p) => p.peerId !== studentId);
      peersRef.current = newPeers;
      setPeers(newPeers);
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

  // --- Exam control functions ---
  const startExam = () => {
    socketRef.current.emit("exam-start", { roomId });
    setExamStarted(true);
    timerRef.current = setInterval(() => setTimer((prev) => prev + 1), 1000);
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold">
            International Islamic University Chittagong
          </h1>
          <p className="text-sm text-gray-500">
            Real-Time Proctoring Dashboard – Room {roomId}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={startExam}
            disabled={examStarted}
            className={`text-white ${examStarted ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
          >
            Start Exam
          </Button>
          <Button
            onClick={endExam}
            disabled={!examStarted}
            variant="destructive"
          >
            End Exam
          </Button>
          <div className="text-right">
            <p className="font-mono text-lg">{formatTime(timer)}</p>
            <p className="text-xs text-gray-400">Session Timer</p>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="text-blue-500" />}
          title="Active Students"
          value={activeStudents.toString()}
        />
        <StatCard
          icon={<Bell className="text-red-500" />}
          title="Active Alerts"
          value={logs.length.toString()}
          highlight
        />
        <StatCard
          icon={<HeartPulse className="text-green-500" />}
          title="System Health"
          value="98%"
        />
        <StatCard
          icon={<Clock className="text-purple-500" />}
          title="Session Time"
          value={formatTime(timer)}
        />
      </section>

      {/* Main */}
      <main className="flex flex-1 p-6 space-x-6">
        {/* Student video grid */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-4 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Live Student Streams</h2>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center space-x-2">
                <ScreenShare className="w-4 h-4" /> <span>Full View</span>
              </Button>
              <Button className="bg-green-600 text-white flex items-center space-x-2">
                <Video className="w-4 h-4" /> <span>Project View</span>
              </Button>
            </div>
          </div>

          {peers.length === 0 ? (
            <p className="text-gray-500 text-center mt-12">No active students yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {peers.map((p) =>
                p.stream ? (
                  <StudentVideo key={p.peerId} peer={p.peer} stream={p.stream} />
                ) : null
              )}
            </div>
          )}
        </div>

        {/* Real-time Activity Log */}
        <div className="w-[400px] bg-white rounded-xl shadow-sm p-4 border border-gray-100 overflow-hidden flex flex-col">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <AlertTriangle className="text-red-500 mr-2" /> Activity Log
          </h2>
          <div className="overflow-y-auto flex-1 space-y-3">
            <AnimatePresence>
              {logs.length === 0 ? (
                <p className="text-gray-400 text-sm text-center mt-8">
                  No flagged activity yet.
                </p>
              ) : (
                logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-red-100 bg-red-50 p-3 rounded-lg shadow-sm flex items-start space-x-3"
                  >
                    <Globe className="text-red-500 w-5 h-5 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        Student #{log.studentId}
                      </p>
                      <p className="text-xs text-gray-600 break-all">
                        Visited: {log.illegalUrl}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {new Date(log.timestamp).toLocaleString("en-GB")}
                      </p>
                    </div>
                    <a
                      href={log.screenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-xs hover:underline"
                    >
                      View
                    </a>
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
function StatCard({ icon, title, value, highlight }) {
  return (
    <div
      className={`bg-white rounded-xl p-5 flex justify-between items-center shadow-sm border ${
        highlight ? "border-red-200" : "border-gray-100"
      }`}
    >
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p
          className={`text-3xl font-bold ${
            highlight ? "text-red-600" : "text-gray-800"
          }`}
        >
          {value}
        </p>
      </div>
      <div className="bg-gray-50 p-3 rounded-full">{icon}</div>
    </div>
  );
}
