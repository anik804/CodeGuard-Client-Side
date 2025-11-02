import { useEffect, useRef } from "react";
import Peer from "simple-peer";

const StudentVideo = ({ peer, stream, studentName = "Student", studentId = "N/A" }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream;
      ref.current.onloadedmetadata = () => {
        ref.current.play().catch(console.error);
      };
    }

    const handleError = (err) => console.error("Peer error:", err);
    peer.on("error", handleError);

    return () => {
      peer.off("error", handleError);
    };
  }, [peer, stream]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="relative bg-black flex justify-center items-center aspect-video">
        <video
          ref={ref}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 px-2 py-0.5 text-xs text-white rounded-full bg-green-500">
          ACTIVE
        </div>
      </div>
      <div className="p-3 border-t">
        <p className="font-semibold text-sm truncate">{studentName}</p>
        <p className="text-xs text-gray-500">ID: {studentId}</p>
        <p className="text-xs text-gray-700 mt-1">Normal Activity</p>
      </div>
    </div>
  );
};

export default StudentVideo;
