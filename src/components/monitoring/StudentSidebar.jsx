import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Pagination } from "./Pagination";

export function StudentSidebar({ 
  isOpen, 
  onClose, 
  roomId,
  totalStudents,
  activityLogOpen 
}) {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    if (isOpen && roomId) {
      fetchStudents(currentPage);
    }
  }, [isOpen, roomId, currentPage]);

  const fetchStudents = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://codeguard-server-side-walb.onrender.com/api/rooms/${roomId}/students?page=${page}&limit=${itemsPerPage}`
      );
      const data = await response.json();
      if (data.success) {
        setStudents(data.students || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-16 bottom-4 w-72 bg-slate-800/95 backdrop-blur-xl rounded-lg shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col z-30 ${
            activityLogOpen ? 'right-[300px]' : 'right-4'
          }`}
        >
          <div className="p-3 border-b border-slate-700/50 bg-slate-900/50 flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center space-x-2 text-slate-200">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Participants</span>
              <span className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-semibold rounded">
                {students.length}
              </span>
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 h-7 w-7 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            {loading ? (
              <div className="flex flex-col items-center justify-center mt-12 py-8">
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 text-xs text-center font-medium mt-3">
                  Loading...
                </p>
              </div>
            ) : students.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-12 py-8">
                <Users className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-slate-400 text-xs text-center font-medium">
                  No participants yet
                </p>
              </div>
            ) : (
              students.map((student) => (
                <div key={student.socketId} className="p-2 hover:bg-slate-700/30 transition-all rounded-md cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <div className="shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs text-slate-200 truncate">{student.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{student.studentId}</p>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              totalItems={pagination.totalStudents}
              itemsPerPage={itemsPerPage}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}


