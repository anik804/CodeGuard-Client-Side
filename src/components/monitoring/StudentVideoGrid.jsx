import { Video } from "lucide-react";
import StudentVideo from "../StudentVideo";

export function StudentVideoGrid({ 
  peers, 
  students, 
  flaggedStudents, 
  sidebarOpen, 
  activityLogOpen 
}) {
  const getMarginClass = () => {
    if (sidebarOpen) return 'lg:mr-[340px]';
    return 'lg:mr-0';
  };

  return (
    <div className={`w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl shadow-2xl p-4 md:p-6 overflow-auto border border-slate-700/50 transition-all duration-300 ${getMarginClass()}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 pb-4 border-b border-slate-700/50">
        <div>
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            📺 Live Student Monitoring
          </h2>
          <p className="text-sm text-slate-300 mt-2 flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 rounded-md font-semibold text-xs">
              {peers.length} Active
            </span>
            <span className="px-2.5 py-1 bg-blue-500/20 border border-blue-400/40 text-blue-300 rounded-md font-semibold text-xs">
              {students.length} Total
            </span>
            {flaggedStudents.size > 0 && (
              <span className="px-2.5 py-1 bg-red-500/20 border border-red-400/40 text-red-300 rounded-md font-semibold text-xs animate-pulse">
                ⚠️ {flaggedStudents.size} Flagged
              </span>
            )}
          </p>
        </div>
      </div>

      {peers.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16 py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4 border border-cyan-400/30">
            <Video className="w-12 h-12 text-cyan-400" />
          </div>
          <p className="text-slate-200 font-semibold text-lg mb-2">No active streams yet</p>
          <p className="text-slate-400 text-sm text-center max-w-md">
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
                isFlagged={flaggedStudents.has(p.studentInfo?.studentId || p.peerId)}
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

