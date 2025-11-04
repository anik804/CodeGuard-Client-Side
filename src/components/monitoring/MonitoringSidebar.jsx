import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Users, AlertTriangle, X, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Pagination } from "./Pagination";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Students Tab Content
function StudentsTab({ roomId }) {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    if (roomId) {
      fetchStudents(currentPage);
    }
  }, [roomId, currentPage]);

  const fetchStudents = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/rooms/${roomId}/students?page=${page}&limit=${itemsPerPage}`
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

  return (
    <div className="flex flex-col h-full">
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
          onPageChange={setCurrentPage}
          totalItems={pagination.totalStudents}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}

// Activity Log Tab Content
function ActivityTab({ roomId, flaggedStudents }) {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    if (roomId) {
      fetchLogs(currentPage);
      const interval = setInterval(() => {
        fetchLogs(currentPage);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [roomId, currentPage]);

  const fetchLogs = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/proctoring/logs?roomId=${roomId}&page=${page}&limit=${itemsPerPage}`
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

  return (
    <div className="flex flex-col h-full">
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
              <AlertTriangle className="w-6 h-6 text-green-400" />
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
                    <AlertTriangle className="text-red-400 w-4 h-4" />
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
          onPageChange={setCurrentPage}
          totalItems={pagination.totalLogs}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}

// Blocked Websites Management Tab
function BlockedWebsitesTab({ roomId }) {
  const [websites, setWebsites] = useState([]);
  const [newWebsite, setNewWebsite] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (roomId) {
      fetchWebsites();
    }
  }, [roomId]);

  const fetchWebsites = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/proctoring/blocked-websites/${roomId}`
      );
      const data = await response.json();
      if (data.success) {
        setWebsites(data.websites || []);
      }
    } catch (error) {
      console.error("Failed to fetch blocked websites:", error);
    }
  };

  const handleAdd = async () => {
    if (!newWebsite.trim()) {
      toast.error("Please enter a website");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/proctoring/blocked-websites/${roomId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ website: newWebsite.trim() }),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Website blocked successfully");
        setNewWebsite("");
        fetchWebsites();
      } else {
        toast.error(data.message || "Failed to block website");
      }
    } catch (error) {
      toast.error("Failed to block website");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (website) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/proctoring/blocked-websites/${roomId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ website }),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Website unblocked successfully");
        fetchWebsites();
      } else {
        toast.error(data.message || "Failed to unblock website");
      }
    } catch (error) {
      toast.error("Failed to unblock website");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-slate-700/50">
        <div className="flex gap-2">
          <Input
            placeholder="e.g., example.com"
            value={newWebsite}
            onChange={(e) => setNewWebsite(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            className="bg-slate-800/50 border-slate-700 text-slate-200 text-xs"
          />
          <Button
            onClick={handleAdd}
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-700 text-white h-9 px-3"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        {websites.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-12 py-8">
            <p className="text-slate-400 text-xs text-center font-medium">
              No custom blocked websites
            </p>
            <p className="text-slate-500 text-[10px] text-center mt-1">
              Default websites are always blocked
            </p>
          </div>
        ) : (
          websites.map((website, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-slate-800/50 rounded-md hover:bg-slate-700/50 transition-colors"
            >
              <span className="text-xs text-slate-200 truncate flex-1">
                {website}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(website)}
                className="h-6 w-6 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function MonitoringSidebar({ roomId, flaggedStudents, isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed right-4 top-16 bottom-4 w-80 bg-slate-800/95 backdrop-blur-xl rounded-lg shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col z-30"
        >
          <Tabs defaultValue="students" className="flex flex-col h-full">
            <div className="p-3 border-b border-slate-700/50 bg-slate-900/50 flex items-center justify-between">
              <TabsList className="bg-slate-800/50 border border-slate-700/50">
                <TabsTrigger 
                  value="students" 
                  className="text-xs data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
                >
                  <Users className="w-3.5 h-3.5 mr-1" />
                  Students
                </TabsTrigger>
                <TabsTrigger 
                  value="activity" 
                  className="text-xs data-[state=active]:bg-red-600 data-[state=active]:text-white relative"
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  Activity
                  {flaggedStudents.size > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white"></span>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="blocked" 
                  className="text-xs data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Blocked
                </TabsTrigger>
              </TabsList>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1 h-7 w-7 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <TabsContent value="students" className="h-full m-0 mt-0">
                <StudentsTab roomId={roomId} />
              </TabsContent>
              <TabsContent value="activity" className="h-full m-0 mt-0">
                <ActivityTab roomId={roomId} flaggedStudents={flaggedStudents} />
              </TabsContent>
              <TabsContent value="blocked" className="h-full m-0 mt-0">
                <BlockedWebsitesTab roomId={roomId} />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

