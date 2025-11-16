import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Users, AlertTriangle, X, Plus, FileText, Eye, FileDown } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";npm
import { Pagination } from "./Pagination";

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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-12 py-8">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 text-xs text-center font-medium mt-3">
              Loading...
            </p>
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-12 py-8">
            <Users className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-600 text-xs text-center font-medium">
              No participants yet
            </p>
          </div>
        ) : (
          students.map((student) => (
            <div key={student.socketId} className="p-2 hover:bg-gray-100 transition-all rounded-md cursor-pointer group border border-gray-200 bg-white/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div className="shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs text-gray-800 truncate">{student.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{student.studentId}</p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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
  const [loading, setLoading] = useState(true); // Only show loading on initial load
  const seenLogIdsRef = useRef(new Set()); // Use ref for synchronous access
  const newLogIdsRef = useRef(new Set()); // Track newly added log IDs for highlighting
  const isInitialLoad = useRef(true);
  const itemsPerPage = 10;

  useEffect(() => {
    if (roomId) {
      // Reset tracking when room changes
      seenLogIdsRef.current.clear();
      newLogIdsRef.current.clear();
      isInitialLoad.current = true;
      
      // Initial load - load the page user requested
      fetchLogs(currentPage, true);
      
      // Refresh every 5 seconds without showing loading
      // Only check for new logs if user is on page 1
      const interval = setInterval(() => {
        if (currentPage === 1) {
          // Silently check for new logs and append them
          fetchLogs(1, false);
        }
        // If user is on other pages, don't refresh (they can manually navigate)
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [roomId, currentPage]);

  // Remove highlight from new logs after 3 seconds
  useEffect(() => {
    if (newLogIdsRef.current.size > 0) {
      const timer = setTimeout(() => {
        if (newLogIdsRef.current.size > 0) {
          newLogIdsRef.current.clear();
          // Trigger re-render to remove highlight
          setLogs(prev => [...prev]);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [logs.length]); // Only re-run when log count changes

  const fetchLogs = async (page, isInitial = false) => {
    // Only show loading on initial load
    if (isInitial) {
      setLoading(true);
      isInitialLoad.current = true;
    }
    
    try {
      const response = await fetch(
        `https://codeguard-server-side-walb.onrender.com/api/proctoring/logs?roomId=${roomId}&page=${page}&limit=${itemsPerPage}`
      );
      const data = await response.json();
      if (data.success) {
        const fetchedLogs = data.logs || [];
        
        if (isInitial) {
          // Initial load: set all logs for the requested page
          setLogs(fetchedLogs);
          // Track all log IDs as seen
          fetchedLogs.forEach(log => {
            const logId = `${log._id || log.studentId}-${log.timestamp}`;
            seenLogIdsRef.current.add(logId);
          });
          setPagination(data.pagination);
        } else {
          // Subsequent refreshes (only called for page 1): only add new logs
          // This ensures seamless appending of new logs without showing loading
          if (page === 1) {
            const newLogs = fetchedLogs.filter(log => {
              const logId = `${log._id || log.studentId}-${log.timestamp}`;
              if (!seenLogIdsRef.current.has(logId)) {
                seenLogIdsRef.current.add(logId);
                newLogIdsRef.current.add(logId); // Mark as new for highlighting
                return true;
              }
              return false;
            });
            
            if (newLogs.length > 0) {
              // Prepend new logs to the beginning with smooth animation
              setLogs(prevLogs => [...newLogs, ...prevLogs]);
              
              // Update pagination if needed
              if (data.pagination) {
                setPagination(data.pagination);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      if (isInitial) {
        setLoading(false);
        isInitialLoad.current = false;
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading && isInitialLoad.current ? (
          <div className="flex flex-col items-center justify-center mt-12 py-8">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 text-xs text-center font-medium mt-3">
              Loading...
            </p>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-12 py-8">
            <div className="w-12 h-12 bg-green-100 border-2 border-green-300 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-gray-700 text-xs text-center font-medium">
              No flagged activity
            </p>
            <p className="text-gray-500 text-[10px] text-center mt-1">
              All students following guidelines
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {logs.map((log) => {
              const logId = `${log._id || log.studentId}-${log.timestamp}`;
              const isNew = newLogIdsRef.current.has(logId);
              
              return (
                <motion.div
                  key={logId}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`border-2 ${isNew ? 'border-yellow-400 bg-yellow-50 ring-2 ring-yellow-200' : 'border-red-300 bg-red-50'} p-2.5 rounded-md hover:bg-red-100 transition-all duration-300`}
                >
                <div className="flex items-start space-x-2">
                  <div className="shrink-0 mt-0.5">
                    <AlertTriangle className="text-red-600 w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-red-700 mb-1">
                      Student #{log.studentId}
                    </p>
                    <p className="text-[10px] text-gray-700 break-all mb-1.5 bg-white px-2 py-1 rounded border border-gray-200">
                      {log.illegalUrl}
                    </p>
                    <p className="text-[10px] text-gray-600 mb-1.5">
                      {new Date(log.timestamp).toLocaleString("en-GB")}
                    </p>
                    {log.screenshotUrl && (
                      <a
                        href={log.screenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[10px] font-medium text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        View Screenshot →
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
              );
            })}
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

// Submissions Tab Content
function SubmissionsTab({ roomId }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roomId) {
      fetchSubmissions();
      const interval = setInterval(fetchSubmissions, 10000);
      return () => clearInterval(interval);
    }
  }, [roomId]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`https://codeguard-server-side-walb.onrender.com/api/submissions/${roomId}/submissions`);
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-12 py-8">
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 text-xs text-center font-medium mt-3">Loading...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-12 py-8">
            <FileText className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-600 text-xs text-center font-medium">No submissions yet</p>
          </div>
        ) : (
          submissions.map((submission) => (
            <div key={submission._id} className="p-3 bg-white/80 rounded-lg border border-gray-200 hover:bg-white hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs text-gray-800 truncate">{submission.studentName}</p>
                  <p className="text-[10px] text-gray-600 truncate">{submission.studentId}</p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {new Date(submission.uploadedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    onClick={async () => {
                      try {
                        const response = await fetch(`https://codeguard-server-side-walb.onrender.com/api/submissions/submission/${submission._id}/download`);
                        const data = await response.json();
                        if (data.success) {
                          window.open(data.url, '_blank');
                        }
                      } catch (error) {
                        toast.error("Failed to view submission");
                      }
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                    title="View"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        const response = await fetch(`https://codeguard-server-side-walb.onrender.com/api/submissions/submission/${submission._id}/download`);
                        const data = await response.json();
                        if (data.success) {
                          const a = document.createElement('a');
                          a.href = data.url;
                          a.download = data.fileName;
                          a.click();
                        }
                      } catch (error) {
                        toast.error("Failed to download submission");
                      }
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-100"
                    title="Download"
                  >
                    <FileDown className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <p className="text-[10px] text-gray-600 truncate">{submission.fileName}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Website Access Control Tab (Whitelist - allowed websites)
function BlockedWebsitesTab({ roomId }) {
  const [allAllowed, setAllAllowed] = useState([]);
  const [defaultAllowed, setDefaultAllowed] = useState([]);
  const [customAllowed, setCustomAllowed] = useState([]);
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
        `https://codeguard-server-side-walb.onrender.com/api/proctoring/blocked-websites/${roomId}`
      );
      const data = await response.json();
      if (data.success) {
        setAllAllowed(data.allowedWebsites || []);
        setDefaultAllowed(data.defaultAllowed || []);
        setCustomAllowed(data.customAllowed || []);
      }
    } catch (error) {
      console.error("Failed to fetch allowed websites:", error);
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
        `https://codeguard-server-side-walb.onrender.com/api/proctoring/blocked-websites/${roomId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ website: newWebsite.trim() }),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Website added to allowed list successfully");
        setNewWebsite("");
        fetchWebsites();
      } else {
        toast.error(data.message || "Failed to add website");
      }
    } catch (error) {
      toast.error("Failed to add website");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (website) => {
    try {
      const response = await fetch(
        `https://codeguard-server-side-walb.onrender.com/api/proctoring/blocked-websites/${roomId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ website }),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Website removed from allowed list successfully");
        fetchWebsites();
      } else {
        toast.error(data.message || "Failed to remove website");
      }
    } catch (error) {
      toast.error("Failed to remove website");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <p className="text-xs text-gray-600 mb-2">
          All websites are blocked by default. Add websites to allow access.
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., example.com"
            value={newWebsite}
            onChange={(e) => setNewWebsite(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            className="bg-white border-gray-300 text-gray-800 text-xs"
          />
          <Button
            onClick={handleAdd}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-3"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {/* Default Allowed Websites */}
        {defaultAllowed.length > 0 && (
          <div>
            <p className="text-xs text-gray-600 font-medium mb-2 px-1">Default Allowed (Cannot be removed)</p>
            {defaultAllowed.map((website, index) => (
              <div
                key={`default-${index}`}
                className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md"
              >
                <span className="text-xs text-green-700 truncate flex-1">
                  {website}
                </span>
                <span className="text-[10px] text-green-600 px-1.5 py-0.5 bg-green-100 rounded border border-green-200">
                  Default
                </span>
              </div>
            ))}
          </div>
        )}
        
        {/* Custom Allowed Websites */}
        {customAllowed.length > 0 && (
          <div>
            <p className="text-xs text-gray-600 font-medium mb-2 px-1 mt-3">Custom Allowed</p>
            {customAllowed.map((website, index) => (
              <div
                key={`custom-${index}`}
                className="flex items-center justify-between p-2 bg-white/80 rounded-md hover:bg-white border border-gray-200 transition-colors"
              >
                <span className="text-xs text-gray-800 truncate flex-1">
                  {website}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(website)}
                  className="h-6 w-6 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {allAllowed.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-12 py-8">
            <p className="text-gray-600 text-xs text-center font-medium">
              No websites allowed yet
            </p>
            <p className="text-gray-500 text-[10px] text-center mt-1">
              Add websites to allow student access
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function MonitoringSidebar({ roomId, flaggedStudents = new Set(), isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed right-4 top-20 bottom-4 w-80 glass-card rounded-lg shadow-2xl border-2 border-gray-200 overflow-hidden flex flex-col z-30"
        >
          <Tabs defaultValue="students" className="flex flex-col h-full">
            <div className="p-3 border-b border-gray-200 bg-white/50 flex items-center justify-between">
              <TabsList className="bg-white/80 border border-gray-200">
                <TabsTrigger 
                  value="students" 
                  className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  <Users className="w-3.5 h-3.5 mr-1" />
                  Students
                </TabsTrigger>
                <TabsTrigger 
                  value="activity" 
                  className="text-xs data-[state=active]:bg-red-600 data-[state=active]:text-white relative data-[state=active]:shadow-sm"
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  Activity
                  {flaggedStudents.size > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white"></span>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="blocked" 
                  className="text-xs data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  Access Control
                </TabsTrigger>
                <TabsTrigger 
                  value="submissions" 
                  className="text-xs data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5 mr-1" />
                  Submissions
                </TabsTrigger>
              </TabsList>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1 h-7 w-7 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
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
              <TabsContent value="submissions" className="h-full m-0 mt-0">
                <SubmissionsTab roomId={roomId} />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

