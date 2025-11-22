
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Calendar, Users, AlertTriangle, Loader2, RefreshCw, Clock, FileText, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function ExamHistory() {
  const [examHistory, setExamHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(examHistory.length / itemsPerPage);

  useEffect(() => {
    fetchExamHistory();
  }, []);

  const fetchExamHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const examinerUsername = sessionStorage.getItem('username');
      const examinerId = sessionStorage.getItem('examinerId');
      
      const queryParams = new URLSearchParams();
      if (examinerUsername) queryParams.append('examinerUsername', examinerUsername);
      if (examinerId) queryParams.append('examinerId', examinerId);
      
      const response = await fetch(`${API_BASE_URL}/api/exam-history/examiner?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setExamHistory(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch exam history');
        toast.error(data.message || 'Failed to fetch exam history');
      }
    } catch (err) {
      console.error('Error fetching exam history:', err);
      setError('Failed to load exam history');
      toast.error('Failed to load exam history');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    toast.info('Export feature coming soon');
  };

  const handleViewDetails = async (exam) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/exam-history/${exam.roomId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedExam(data.data);
        setIsDialogOpen(true);
      } else {
        toast.error('Failed to load exam details');
      }
    } catch (err) {
      console.error('Error fetching exam details:', err);
      toast.error('Failed to load exam details');
    }
  };

  const handleNavigateToMonitoring = (roomId) => {
    window.location.href = `/monitoring/${roomId}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading exam history...</p>
        </div>
      </div>
    );
  }

  if (error && examHistory.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-destructive" />
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchExamHistory} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Pagination logic
  const paginatedExams = examHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const totalStudents = examHistory.reduce((sum, exam) => sum + (exam.students || 0), 0);
  const totalSubmissions = examHistory.reduce((sum, exam) => sum + (exam.submissions || 0), 0);
  const totalAlerts = examHistory.reduce((sum, exam) => sum + (exam.alerts || 0), 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Exam History</h1>
          <p className="text-muted-foreground mt-2">View and manage all past and completed exams</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchExamHistory} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{examHistory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Exam Cards */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Exams</CardTitle>
        </CardHeader>
        <CardContent>
          {examHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No exam history found. Completed exams will appear here.
            </div>
          ) : (
            <>
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paginatedExams.map((exam) => (
                  <motion.div
                    key={exam.id || exam.roomId}
                    variants={rowVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50" onClick={() => handleViewDetails(exam)}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg font-semibold line-clamp-2">{exam.title}</CardTitle>
                          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{exam.date ? new Date(exam.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">{exam.students || 0}</span>
                            <span className="text-muted-foreground">Students</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-green-500" />
                            <span className="font-medium">{exam.submissions || 0}</span>
                            <span className="text-muted-foreground">Submissions</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className={`w-4 h-4 ${exam.alerts > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
                            <span className={`text-sm font-medium ${exam.alerts > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                              {exam.alerts || 0} Alerts
                            </span>
                          </div>
                          <Badge variant={exam.status === "completed" ? "default" : exam.status === "in-progress" ? "secondary" : "outline"}>
                            {exam.status || 'completed'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination Controls */}
              <div className="flex justify-center mt-6 gap-2">
                <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Detailed Exam Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedExam?.examName || selectedExam?.courseName || 'Exam Details'}</DialogTitle>
            <DialogDescription>Complete information about this exam</DialogDescription>
          </DialogHeader>
          {selectedExam && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Course Name</p>
                  <p className="font-semibold">{selectedExam.courseName || 'N/A'}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Room ID</p>
                  <p className="font-semibold">{selectedExam.roomId || 'N/A'}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="font-semibold text-2xl">{selectedExam.totalStudentsJoined || 0}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Submissions</p>
                  <p className="font-semibold text-2xl">{selectedExam.submissionsCount || 0}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Flagged Students</p>
                  <p className="font-semibold text-2xl text-destructive">{selectedExam.flaggedStudentsCount || 0}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className="mt-1" variant={selectedExam.status === 'completed' ? 'default' : 'secondary'}>
                    {selectedExam.status || 'completed'}
                  </Badge>
                </div>
              </div>

              {selectedExam.examStartedAt && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Started At</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(selectedExam.examStartedAt).toLocaleString()}</span>
                  </div>
                </div>
              )}

              {selectedExam.examEndedAt && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Ended At</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(selectedExam.examEndedAt).toLocaleString()}</span>
                  </div>
                </div>
              )}

              {selectedExam.examDuration && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Duration</p>
                  <p className="font-semibold">{selectedExam.examDuration} minutes</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleNavigateToMonitoring(selectedExam.roomId)} className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  View Monitoring Dashboard
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}


