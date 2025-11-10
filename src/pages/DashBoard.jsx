import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, AlertTriangle, TrendingUp, RefreshCw } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut, Pie } from "react-chartjs-2";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { api } from "../utils/api";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [examinerName, setExaminerName] = useState("Examiner");

  useEffect(() => {
    // Get examiner name from sessionStorage
    const storedName = sessionStorage.getItem("examinerName");
    const storedUsername = sessionStorage.getItem("username");
    if (storedName) {
      setExaminerName(storedName);
    } else if (storedUsername) {
      setExaminerName(storedUsername);
    } else if (user?.name) {
      setExaminerName(user.name);
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAnalytics();
      if (response.success) {
        setAnalytics(response.data);
      } else {
        setError("Failed to load analytics");
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // Refresh analytics every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  // Chart options with animations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "hsl(0 0% 60%)",
          font: { size: 12 },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  const pieChartOptions = {
    ...chartOptions,
    cutout: "65%",
  };

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-destructive" />
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Prepare data from analytics
  const stats = analytics
    ? [
        {
          title: "Total Students",
          value: analytics.platformStats?.totalStudents || 0,
          icon: Users,
          trend: `+${analytics.connectedUsers?.connectedStudents || 0} connected`,
          color: "bg-primary/20 text-primary",
        },
        {
          title: "Total Exams",
          value: analytics.platformStats?.totalRooms || 0,
          icon: FileText,
          trend: `${analytics.platformStats?.activeRooms || 0} active`,
          color: "bg-cyan-500/20 text-cyan-400",
        },
        {
          title: "Cheating Alerts",
          value: analytics.platformStats?.totalFlags || 0,
          icon: AlertTriangle,
          trend: `${analytics.flaggedPercentage?.percentage || 0}% flagged`,
          color: "bg-destructive/20 text-destructive",
        },
        {
          title: "Connected Examiners",
          value: analytics.connectedUsers?.connectedExaminers || 0,
          icon: TrendingUp,
          trend: `${analytics.platformStats?.totalExaminers || 0} total`,
          color: "bg-green-500/20 text-green-400",
        },
      ]
    : [];

  // Monthly exams data
  const examActivityData = analytics?.monthlyStats
    ? {
        labels: analytics.monthlyStats.map((m) => m.month),
        datasets: [
          {
            label: "Exams Created",
            data: analytics.monthlyStats.map((m) => m.roomsCreated),
            borderColor: "rgb(99, 102, 241)",
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "rgb(99, 102, 241)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      }
    : { labels: [], datasets: [] };

  // Flags per exam data
  const cheatingAlertsData = analytics?.flagsPerExam
    ? {
        labels: analytics.flagsPerExam.slice(0, 5).map((exam) => exam.examName || exam.courseName || exam.roomId),
        datasets: [
          {
            label: "Flags",
            data: analytics.flagsPerExam.slice(0, 5).map((exam) => exam.flagsCount),
            backgroundColor: [
              "rgba(248, 113, 113, 0.8)",
              "rgba(251, 191, 36, 0.8)",
              "rgba(96, 165, 250, 0.8)",
              "rgba(52, 211, 153, 0.8)",
              "rgba(167, 139, 250, 0.8)",
            ],
            borderColor: [
              "rgb(248, 113, 113)",
              "rgb(251, 191, 36)",
              "rgb(96, 165, 250)",
              "rgb(52, 211, 153)",
              "rgb(167, 139, 250)",
            ],
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      }
    : { labels: [], datasets: [] };

  // Attendance data (flagged vs non-flagged)
  const attendanceData = analytics?.flaggedPercentage
    ? {
        labels: ["Flagged Students", "Non-Flagged Students"],
        datasets: [
          {
            label: "Student Status",
            data: [
              analytics.flaggedPercentage.flaggedStudentsCount,
              Math.max(
                0,
                analytics.flaggedPercentage.totalStudentsAttended -
                  analytics.flaggedPercentage.flaggedStudentsCount
              ),
            ],
            backgroundColor: ["rgba(239, 68, 68, 0.8)", "rgba(34, 197, 94, 0.8)"],
            borderColor: ["rgb(239, 68, 68)", "rgb(34, 197, 94)"],
            borderWidth: 2,
          },
        ],
      }
    : { labels: [], datasets: [] };

  // Exam attendance per exam
  const studentExamData = analytics?.examAttendance
    ? {
        labels: analytics.examAttendance.slice(0, 5).map((exam) => exam.examName || exam.courseName || exam.roomId),
        datasets: [
          {
            label: "Students Attended",
            data: analytics.examAttendance.slice(0, 5).map((exam) => exam.studentsAttended),
            backgroundColor: [
              "rgba(96, 165, 250, 0.8)",
              "rgba(248, 113, 113, 0.8)",
              "rgba(251, 191, 36, 0.8)",
              "rgba(52, 211, 153, 0.8)",
              "rgba(167, 139, 250, 0.8)",
            ],
            borderColor: [
              "rgb(96, 165, 250)",
              "rgb(248, 113, 113)",
              "rgb(251, 191, 36)",
              "rgb(52, 211, 153)",
              "rgb(167, 139, 250)",
            ],
            borderWidth: 2,
          },
        ],
      }
    : { labels: [], datasets: [] };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black text-white rounded-xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome, {examinerName}!
          </h1>
          <p className="text-sm md:text-base mt-1 text-indigo-200">
            Examiner Dashboard - CodeGuard Analytics
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="mt-4 md:mt-0 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="glass-card hover:shadow-lg transition-all duration-300 animate-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                    <p className="text-xs text-primary mt-1">{stat.trend}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <motion.div
        className="grid gap-6 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Exam Activity Chart */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text">Total Exams Created (Monthly)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {examActivityData.labels.length > 0 ? (
                  <Line data={examActivityData} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cheating Alerts Chart */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text">Flags Per Exam (Top 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {cheatingAlertsData.labels.length > 0 ? (
                  <Bar data={cheatingAlertsData} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Student Attendance Chart */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text">Student Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {attendanceData.labels.length > 0 ? (
                  <Doughnut data={attendanceData} options={pieChartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Exam Attendance Chart */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text">Students Attended Per Exam (Top 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {studentExamData.labels.length > 0 ? (
                  <Bar data={studentExamData} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
