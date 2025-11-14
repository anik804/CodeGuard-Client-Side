import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Bell, ChevronRight, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Pagination } from "./Pagination";

export function ActivityLog({ 
  isOpen, 
  onClose, 
  roomId,
  flaggedStudents 
}) {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    if (isOpen && roomId) {
      fetchLogs(currentPage);
      // Refresh logs every 5 seconds to get new flagged activities
      const interval = setInterval(() => {
        fetchLogs(currentPage);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, roomId, currentPage]);

  const fetchLogs = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/proctoring/logs?roomId=${roomId}&page=${page}&limit=${itemsPerPage}`
      );
      const data = await response.json();
      if (data.success) {
        setLogs(data.logs || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
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
          className="fixed right-4 top-16 bottom-4 w-72 bg-slate-800/95 backdrop-blur-xl rounded-lg shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col z-30"
        >
          <div className="p-3 border-b border-slate-700/50 bg-slate-900/50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center space-x-2 relative">
              <AlertTriangle className="text-red-400 w-4 h-4" /> 
              <span>Activity Log</span>
              {logs.length > 0 && (
                <span className="px-1.5 py-0.5 bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-semibold rounded">
                  {logs.length}
                </span>
              )}
              {flaggedStudents.size > 0 && (
                <span className="absolute -top-0.5 left-16 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white"></span>
              )}
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
          <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            {loading ? (
              <div className="flex flex-col items-center justify-center mt-12 py-8">
                <div className="w-8 h-8 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 text-xs text-center font-medium mt-3">
                  Loading...
                </p>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-12 py-8">
                <div className="w-12 h-12 bg-green-500/20 border border-green-400/40 rounded-full flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-slate-300 text-xs text-center font-medium">
                  No flagged activity
                </p>
                <p className="text-slate-500 text-[10px] text-center mt-1">
                  All students following guidelines
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.div
                    key={`${log.studentId}-${log.timestamp}-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-red-500/30 bg-red-500/10 p-2.5 rounded-md hover:bg-red-500/15 transition-colors"
                  >
                    <div className="flex items-start space-x-2">
                      <div className="shrink-0 mt-0.5">
                        <Globe className="text-red-400 w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-red-300 mb-1">
                          Student #{log.studentId}
                        </p>
                        <p className="text-[10px] text-slate-300 break-all mb-1.5 bg-slate-900/50 px-2 py-1 rounded">
                          {log.illegalUrl}
                        </p>
                        <p className="text-[10px] text-slate-400 mb-1.5">
                          {new Date(log.timestamp).toLocaleString("en-GB")}
                        </p>
                        <a
                          href={log.screenshotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-[10px] font-medium text-cyan-400 hover:text-cyan-300 hover:underline"
                        >
                          View Screenshot →
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              totalItems={pagination.totalLogs}
              itemsPerPage={itemsPerPage}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

