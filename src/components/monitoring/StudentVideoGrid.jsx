import { Video, Users } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import StudentVideo from "../StudentVideo";
import { Button } from "../ui/button";
import { Pagination } from "./Pagination";

export function StudentVideoGrid({ 
  peers, 
  students, 
  flaggedStudents, 
  sidebarOpen, 
  activityLogOpen,
  onToggleSidebar,
  onDismissFlag,
  roomId
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedStudents, setPaginatedStudents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshIntervalRef = useRef(null);
  const lastFetchRef = useRef({ roomId: null, page: null }); // Track last fetch to prevent duplicate calls
  const itemsPerPage = 12; // Show 12 students per page (3x4 grid on large screens)

  const getMarginClass = () => {
    if (sidebarOpen) return 'lg:mr-[340px]';
    return 'lg:mr-0';
  };

  // Fetch paginated students from server
  useEffect(() => {
    if (!roomId) return;

    // Clear any existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    // Determine if this is a new page/room (need to show loading)
    const isNewPage = lastFetchRef.current.roomId !== roomId || 
                      lastFetchRef.current.page !== currentPage;
    
    // Update tracking
    lastFetchRef.current = { roomId, page: currentPage };

    // Show loading only on new page/room
    if (isNewPage) {
      setLoading(true);
    }

    const fetchPaginatedStudents = async (silent = false) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/rooms/${roomId}/students?page=${currentPage}&limit=${itemsPerPage}`
        );
        const data = await response.json();
        if (data.success) {
          const newStudents = data.students || [];
          
          // Only update state if data has actually changed (prevent unnecessary re-renders)
          setPaginatedStudents(prev => {
            // Quick comparison: check if arrays are different lengths or contain different IDs
            if (prev.length !== newStudents.length) {
              return newStudents;
            }
            
            // Compare student IDs
            const prevIds = prev.map(s => s.socketId || s.studentId).sort().join(',');
            const newIds = newStudents.map(s => s.socketId || s.studentId).sort().join(',');
            
            if (prevIds !== newIds) {
              return newStudents;
            }
            return prev; // No change, return previous to prevent re-render
          });
          
          // Update pagination only if it changed
          setPagination(prev => {
            const newPagination = data.pagination;
            if (!prev || 
                prev.currentPage !== newPagination.currentPage ||
                prev.totalPages !== newPagination.totalPages ||
                prev.totalStudents !== newPagination.totalStudents) {
              return newPagination;
            }
            return prev;
          });
        }
      } catch (error) {
        console.error("Failed to fetch paginated students:", error);
      } finally {
        // Only hide loading if we showed it (not on silent refreshes)
        if (isNewPage && !silent) {
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchPaginatedStudents(false);
    
    // Set up background refresh (silent, no loading indicator, no flickering)
    refreshIntervalRef.current = setInterval(() => {
      fetchPaginatedStudents(true); // Silent refresh
    }, 15000); // Refresh every 15 seconds

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [roomId, currentPage, itemsPerPage]);

  // Filter peers to only show those on the current page
  // Use ref to store previous values and prevent unnecessary recalculations
  const displayedPeers = useMemo(() => {
    if (!paginatedStudents.length) {
      // If no paginated students, show all peers (fallback)
      return peers.filter(p => p.stream);
    }

    // Create a Set of socketIds and studentIds from the current page
    const pageStudentIds = new Set(
      paginatedStudents.map(s => s.socketId || s.studentId)
    );
    const pageStudentSocketIds = new Set(
      paginatedStudents.map(s => s.socketId)
    );

    // Filter peers that match the current page
    const filtered = peers.filter(p => {
      const peerSocketId = p.peerId;
      const peerStudentId = p.studentInfo?.studentId || p.studentInfo?.socketId;
      
      return p.stream && (
        pageStudentSocketIds.has(peerSocketId) ||
        pageStudentIds.has(peerStudentId) ||
        pageStudentIds.has(peerSocketId)
      );
    });
    
    return filtered;
  }, [peers, paginatedStudents]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of grid when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate active streams count for current page
  const activeStreamsOnPage = displayedPeers.length;
  const totalActiveStreams = peers.filter(p => p.stream).length;

  return (
    <div className={`w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl shadow-2xl p-4 md:p-6 overflow-auto border border-slate-700/50 transition-all duration-300 ${getMarginClass()}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 pb-4 border-b border-slate-700/50">
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            📺 Live Student Monitoring
          </h2>
          <p className="text-sm text-slate-300 mt-2 flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 rounded-md font-semibold text-xs">
              {activeStreamsOnPage} Active (Page)
            </span>
            <span className="px-2.5 py-1 bg-blue-500/20 border border-blue-400/40 text-blue-300 rounded-md font-semibold text-xs">
              {pagination?.totalStudents || students.length} Total
            </span>
            {flaggedStudents.size > 0 && (
              <span className="px-2.5 py-1 bg-red-500/20 border border-red-400/40 text-red-300 rounded-md font-semibold text-xs">
                ⚠️ {flaggedStudents.size} Flagged
              </span>
            )}
            {pagination && pagination.totalPages > 1 && (
              <span className="px-2.5 py-1 bg-purple-500/20 border border-purple-400/40 text-purple-300 rounded-md font-semibold text-xs">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
            )}
          </p>
        </div>
        {onToggleSidebar && (
          <Button
            onClick={onToggleSidebar}
            className="shadow-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-2 h-9 px-3 transition-all duration-300"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium">{sidebarOpen ? 'Close Panel' : 'View Panel'}</span>
            {flaggedStudents.size > 0 && (
              <span className="px-1.5 py-0.5 bg-red-600 text-white text-xs font-semibold rounded">
                {flaggedStudents.size}
              </span>
            )}
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-16 py-12">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm mt-4">Loading students...</p>
        </div>
      ) : displayedPeers.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16 py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4 border border-cyan-400/30">
            <Video className="w-12 h-12 text-cyan-400" />
          </div>
          <p className="text-slate-200 font-semibold text-lg mb-2">No active streams on this page</p>
          <p className="text-slate-400 text-sm text-center max-w-md">
            {pagination && pagination.totalStudents > 0 
              ? "Student streams will appear here once they start screen sharing"
              : "No students have joined this exam yet"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {displayedPeers.map((p) => (
              <StudentVideo 
                key={p.peerId} 
                peer={p.peer} 
                stream={p.stream}
                studentName={p.studentInfo?.name || "Student"}
                studentId={p.studentInfo?.studentId || p.peerId}
                isFlagged={flaggedStudents.has(p.studentInfo?.studentId || p.peerId)}
                onDismissFlag={onDismissFlag}
              />
            ))}
          </div>
          
          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                totalItems={pagination.totalStudents}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

