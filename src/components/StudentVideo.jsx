import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { Maximize2, Minimize2, User, X, UserX } from "lucide-react";
import { Button } from "./ui/button";

const StudentVideo = ({ peer, stream, studentName = "Student", studentId = "N/A", socketId, isFlagged = false, onDismissFlag, onKickStudent }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
      ref.current.onloadedmetadata = () => {
        if (ref.current && !ref.current.paused) {
          ref.current.play().catch((err) => {
            // Ignore play() errors - they're often due to browser autoplay policies
            if (!err.message.includes("play() request was interrupted")) {
              console.warn("Video play error:", err);
            }
          });
        }
      };
    }

    const handleError = (err) => {
      // Only log non-connection errors to avoid spam
      if (!err?.message?.toLowerCase().includes("connection failed")) {
        console.error("Peer error:", err);
      }
    };
    
    if (peer && typeof peer.on === 'function') {
      peer.on("error", handleError);
    }

    return () => {
      if (peer && typeof peer.off === 'function') {
        peer.off("error", handleError);
      }
    };
  }, [peer, stream]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 relative ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "hover:shadow-xl"
      } ${
        isFlagged ? "ring-1 ring-red-400 border-2 border-red-400" : ""
      }`}
      style={isFlagged ? { 
        borderColor: '#f87171'
      } : {}}
    >
      <div className="absolute top-2 left-2 z-10 flex gap-2">
        {isFlagged && onDismissFlag && (
          <Button
            onClick={() => onDismissFlag(studentId)}
            variant="ghost"
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white border border-red-600 rounded-md h-7 px-2 text-xs font-medium shadow-lg"
            title="Dismiss false alarm"
          >
            <X className="w-3 h-3 mr-1" />
            Dismiss
          </Button>
        )}
        {onKickStudent && (
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              if (typeof onKickStudent === 'function') {
                onKickStudent();
              }
            }}
            variant="ghost"
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white border border-orange-600 rounded-md h-7 px-2 text-xs font-medium shadow-lg z-20"
            title="Kick student"
          >
            <UserX className="w-3 h-3 mr-1" />
            Kick
          </Button>
        )}
      </div>
      <div className={`relative bg-gradient-to-br from-gray-900 to-black flex justify-center items-center aspect-video group ${
        isFlagged ? "ring-1 ring-red-400 border border-red-400" : ""
      }`}>
        <video
          ref={ref}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain"
        />
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          <div className="px-2.5 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            <span>LIVE</span>
          </div>
          <Button
            onClick={toggleFullscreen}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white border border-white/20 rounded"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-xs font-medium">Click fullscreen icon to expand</p>
        </div>
      </div>
      <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
              {studentName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">{studentName}</p>
            <p className="text-xs text-gray-500 truncate">ID: {studentId}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center space-x-2">
          {isFlagged ? (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-xs text-red-600 font-medium">⚠️ Flagged Activity</p>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-xs text-gray-600 font-medium">Normal Activity</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentVideo;
