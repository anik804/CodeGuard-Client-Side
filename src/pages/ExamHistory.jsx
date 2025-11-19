import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Calendar, Users, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function ExamHistory() {
  const [examHistory, setExamHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      
      const response = await fetch(
        `${API_BASE_URL}/api/exam-history/examiner?${queryParams}`
      );
      
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
    // Export logic here
    toast.info('Export feature coming soon');
  };

  const handleViewDetails = (roomId) => {
    // Navigate to exam details or monitoring page
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

  // Calculate stats
  const totalStudents = examHistory.reduce((sum, exam) => sum + (exam.students || 0), 0);
  const totalSubmissions = examHistory.reduce((sum, exam) => sum + (exam.submissions || 0), 0);
  const totalAlerts = examHistory.reduce((sum, exam) => sum + (exam.alerts || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Exam History</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all past and completed exams
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchExamHistory}
            disabled={loading}
          >
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

      {/* Exam Table */}
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
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Exam Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Alerts</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examHistory.map((exam) => (
                    <motion.tr
                      key={exam.id || exam.roomId}
                      variants={rowVariants}
                      className="border-border hover:bg-secondary/50 transition-colors"
                    >
                      <TableCell className="font-medium">{exam.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {exam.date 
                            ? new Date(exam.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {exam.students || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        {exam.submissions || 0}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                          <span className={exam.alerts > 0 ? "text-destructive" : ""}>
                            {exam.alerts || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            exam.status === "completed"
                              ? "default"
                              : exam.status === "in-progress"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {exam.status || 'completed'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-primary/10"
                          onClick={() => handleViewDetails(exam.roomId)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}