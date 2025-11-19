import { useRef, useCallback } from "react";
import Peer from "simple-peer";
import { toast } from "sonner";

// Polyfill global for simple-peer in browser
if (typeof global === "undefined") {
  window.global = window;
}

const MAX_RETRIES_PER_PEER = 3;

export function useWebRTC(socketRef, setPeers, setStudents) {
  const peersRef = useRef([]);

  const createPeerConnectionForStudent = (socketId, studentInfo, retryCount = 0) => {
    // Check if peer already exists
    const existingPeer = peersRef.current.find((p) => p.peerId === socketId);
    if (existingPeer) {
      console.log("Peer already exists for:", socketId);
      return;
    }

    console.log(
      `Creating peer connection for student: ${socketId} (retry ${retryCount}/${MAX_RETRIES_PER_PEER})`
    );
    
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

      const peerItem = peersRef.current.find((p) => p.peerId === socketId);
      const currentRetry = peerItem?.retryCount ?? retryCount;

      // Handle connection failed with limited automatic retries
      if (
        err?.message?.toLowerCase().includes("connection failed") &&
        currentRetry < MAX_RETRIES_PER_PEER
      ) {
        console.warn(
          `Peer connection failed for ${socketId}. Retrying (${currentRetry + 1}/${MAX_RETRIES_PER_PEER})...`
        );

        // Clean up current peer
        try {
          peer.destroy();
        } catch {}

        peersRef.current = peersRef.current.filter((p) => p.peerId !== socketId);
        setPeers([...peersRef.current]);

        // Retry after a short delay
        setTimeout(() => {
          createPeerConnectionForStudent(socketId, studentInfo, currentRetry + 1);
        }, 1000);

        return;
      }

      // Give a clear message after retries are exhausted or for other errors
      if (currentRetry >= MAX_RETRIES_PER_PEER) {
        toast.error(
          `Unable to establish connection with ${studentInfo.name}. Please check their network or retry later.`
        );
      } else {
        toast.error(`Connection error with ${studentInfo.name}`);
      }
    });

    const peerItem = {
      peerId: socketId,
      peer,
      stream: null,
      studentInfo: studentInfo,
      retryCount,
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

  const setupWebRTCHandlers = useCallback(() => {
    if (!socketRef.current) return;

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
  }, [socketRef, setPeers, setStudents]);

  const cleanup = useCallback(() => {
    peersRef.current.forEach((p) => p.peer.destroy());
    peersRef.current = [];
    setPeers([]);
  }, [setPeers]);

  return {
    peersRef,
    setupWebRTCHandlers,
    cleanup,
  };
}

