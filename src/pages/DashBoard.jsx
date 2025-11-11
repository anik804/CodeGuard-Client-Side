import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, AlertTriangle, TrendingUp, RefreshCw, Calendar, Clock, ArrowRight } from "lucide-react";
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
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import { api } from "../utils/api";

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
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Light pastel gradient animation
const lightGradientAnimation = {
  background: [
    "linear-gradient(135deg, #d6f5f5, #ffe6f0)",
    "linear-gradient(135deg, #ffe6f0, #fff1b8)",
    "linear-gradient(135deg, #fff1b8, #d6f5f5)",
  ],
  transition: { duration: 10, repeat: Infinity, repeatType: "loop" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [examinerName, setExaminerName] = useState("Examiner");
  const [examinerRooms, setExaminerRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [examinerAnalytics, setExaminerAnalytics] = useState(null);
  const [loadingExaminerAnalytics, setLoadingExaminerAnalytics] = useState(true);

  useEffect(() => {
    const storedName = sessionStorage.getItem("examinerName");
    const storedUsername = sessionStorage.getItem("username");
    if (storedName) setExaminerName(storedName);
    else if (storedUsername) setExaminerName(storedUsername);
    else if (user?.name) setExaminerName(user.name);
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAnalytics();
      if (response.success) setAnalytics(response.data);
      else setError("Failed to load analytics");
    } catch (err) {
      console.error(err);
      setError("Failed to load analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch examiner rooms
  const fetchExaminerRooms = async () => {
    try {
      const username = sessionStorage.getItem("username");
      if (!username) {
        console.log("⚠️ No username found in sessionStorage");
        return;
      }

      const response = await fetch(
        `https://codeguard-server-side-walb.onrender.com/api/rooms/by-examiner?examinerUsername=${encodeURIComponent(username)}`
      );
      
      if (!response.ok) {
        console.error("❌ Failed to fetch rooms:", response.status, response.statusText);
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        setExaminerRooms(data.rooms || []);
      }
    } catch (error) {
      console.error("❌ Failed to fetch examiner rooms:", error);
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    fetchExaminerRooms();
  }, []);

  // Fetch examiner-specific analytics
  useEffect(() => {
    const fetchExaminerAnalytics = async () => {
      try {
        const username = sessionStorage.getItem("username");
        if (!username) return;

        const [studentsPerExamRes, roomsCreatedRes] = await Promise.all([
          fetch(`https://codeguard-server-side-walb.onrender.com/api/analytics/examiner/students-per-exam?examinerUsername=${encodeURIComponent(username)}`),
          fetch(`https://codeguard-server-side-walb.onrender.com/api/analytics/examiner/rooms-created?examinerUsername=${encodeURIComponent(username)}`)
        ]);

        const studentsPerExamData = await studentsPerExamRes.json();
        const roomsCreatedData = await roomsCreatedRes.json();

        if (studentsPerExamData.success && roomsCreatedData.success) {
          setExaminerAnalytics({
            studentsPerExam: studentsPerExamData.data,
            roomsCreated: roomsCreatedData.data
          });
        }
      } catch (error) {
        console.error("Failed to fetch examiner analytics:", error);
      } finally {
        setLoadingExaminerAnalytics(false);
      }
    };

    fetchExaminerAnalytics();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const isScheduled = (room) => {
    if (!room.startTime) return false;
    const startTime = new Date(room.startTime);
    return startTime > new Date();
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 2000, easing: "easeInOutQuart" },
    plugins: {
      legend: { position: "top", labels: { color: "hsl(0 0% 60%)", font: { size: 12 }, padding: 15 } },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  const pieChartOptions = { ...chartOptions, cutout: "65%" };

  if (loading && !analytics)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );

  if (error && !analytics)
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

  const stats = analytics
    ? [
        { title: "Total Students", value: analytics.platformStats?.totalStudents || 0, icon: Users, trend: `+${analytics.connectedUsers?.connectedStudents || 0} connected`, color: "bg-gradient-to-r from-pink-100 via-blue-100 to-green-100" },
        { title: "Total Exams", value: analytics.platformStats?.totalRooms || 0, icon: FileText, trend: `${analytics.platformStats?.activeRooms || 0} active`, color: "bg-gradient-to-r from-yellow-100 via-purple-100 to-cyan-100" },
        { title: "Cheating Alerts", value: analytics.platformStats?.totalFlags || 0, icon: AlertTriangle, trend: `${analytics.flaggedPercentage?.percentage || 0}% flagged`, color: "bg-gradient-to-r from-red-100 via-orange-100 to-pink-100" },
        { title: "Connected Examiners", value: analytics.connectedUsers?.connectedExaminers || 0, icon: TrendingUp, trend: `${analytics.platformStats?.totalExaminers || 0} total`, color: "bg-gradient-to-r from-green-100 via-teal-100 to-lime-100" },
      ]
    : [];

  const examActivityData = analytics?.monthlyStats
    ? {
        labels: analytics.monthlyStats.map((m) => m.month),
        datasets: [
          { label: "Exams Created", data: analytics.monthlyStats.map((m) => m.roomsCreated), borderColor: "#60a5fa", backgroundColor: "rgba(96,165,250,0.2)", fill: true, tension: 0.4, pointBackgroundColor: "#60a5fa", pointBorderColor: "#fff", pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6 },
        ],
      }
    : { labels: [], datasets: [] };

  const cheatingAlertsData = analytics?.flagsPerExam
    ? {
        labels: analytics.flagsPerExam.slice(0, 5).map((exam) => exam.examName || exam.courseName || exam.roomId),
        datasets: [
          {
            label: "Flags",
            data: analytics.flagsPerExam.slice(0, 5).map((exam) => exam.flagsCount),
            backgroundColor: ["rgba(248, 186, 202,0.8)", "rgba(251, 207, 135,0.8)", "rgba(147, 197, 253,0.8)", "rgba(134, 239, 172,0.8)", "rgba(216, 180, 254,0.8)"],
            borderColor: ["rgb(248, 186, 202)", "rgb(251, 207, 135)", "rgb(147, 197, 253)", "rgb(134, 239, 172)", "rgb(216, 180, 254)"],
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      }
    : { labels: [], datasets: [] };

  const attendanceData = analytics?.flaggedPercentage
    ? {
        labels: ["Flagged Students", "Non-Flagged Students"],
        datasets: [
          {
            label: "Student Status",
            data: [
              analytics.flaggedPercentage.flaggedStudentsCount,
              Math.max(0, analytics.flaggedPercentage.totalStudentsAttended - analytics.flaggedPercentage.flaggedStudentsCount),
            ],
            backgroundColor: ["rgba(254, 202, 202,0.8)", "rgba(187, 247, 208,0.8)"],
            borderColor: ["rgb(254, 202, 202)", "rgb(187, 247, 208)"],
            borderWidth: 2,
          },
        ],
      }
    : { labels: [], datasets: [] };

  const studentExamData = analytics?.examAttendance
    ? {
        labels: analytics.examAttendance.slice(0, 5).map((exam) => exam.examName || exam.courseName || exam.roomId),
        datasets: [
          {
            label: "Students Attended",
            data: analytics.examAttendance.slice(0, 5).map((exam) => exam.studentsAttended),
            backgroundColor: ["rgba(147,197,253,0.8)", "rgba(254,186,202,0.8)", "rgba(251,207,135,0.8)", "rgba(134,239,172,0.8)", "rgba(216,180,254,0.8)"],
            borderColor: ["rgb(147,197,253)", "rgb(254,186,202)", "rgb(251,207,135)", "rgb(134,239,172)", "rgb(216,180,254)"],
            borderWidth: 2,
          },
        ],
      }
    : { labels: [], datasets: [] };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        animate={lightGradientAnimation}
        className="rounded-xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center text-gray-800"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome, {examinerName}!
          </h1>
          <p className="text-sm md:text-base mt-1 text-gray-600">
            Examiner Dashboard - CodeGuard Analytics
          </p>
        </div>
        <button
          onClick={() => {
            fetchAnalytics();
            fetchExaminerRooms();
            const username = sessionStorage.getItem("username");
            if (username) {
              const fetchExaminerAnalytics = async () => {
                try {
                  setLoadingExaminerAnalytics(true);
                  const [studentsPerExamRes, roomsCreatedRes] = await Promise.all([
                    fetch(`https://codeguard-server-side-walb.onrender.com/api/analytics/examiner/students-per-exam?examinerUsername=${encodeURIComponent(username)}`),
                    fetch(`https://codeguard-server-side-walb.onrender.com/api/analytics/examiner/rooms-created?examinerUsername=${encodeURIComponent(username)}`)
                  ]);

                  const studentsPerExamData = await studentsPerExamRes.json();
                  const roomsCreatedData = await roomsCreatedRes.json();

                  if (studentsPerExamData.success && roomsCreatedData.success) {
                    setExaminerAnalytics({
                      studentsPerExam: studentsPerExamData.data,
                      roomsCreated: roomsCreatedData.data
                    });
                  }
                } catch (error) {
                  console.error("Failed to fetch examiner analytics:", error);
                } finally {
                  setLoadingExaminerAnalytics(false);
                }
              };
              fetchExaminerAnalytics();
            }
          }}
          disabled={loading || loadingExaminerAnalytics}
          className="mt-4 md:mt-0 px-4 py-2 bg-white/50 text-gray-800 rounded-lg hover:bg-white/70 transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading || loadingExaminerAnalytics ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </motion.div>

      {/* Stats Grid - Examiner Specific Stats */}
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
          <Card className="glass-card h-48 overflow-hidden relative">
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={{
                background: [
                  "linear-gradient(135deg, #fff6e5, #e0f7fa, #f9fbe7)",
                  "linear-gradient(135deg, #e0f7fa, #f9fbe7, #fff6e5)",
                ],
                transition: { duration: 12, repeat: Infinity, repeatType: "loop" },
              }}
            />
            <CardContent className="p-6 relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Total Rooms Created</p>
                <h3 className="text-3xl font-bold mt-2">
                  {loadingExaminerAnalytics ? (
                    <span className="text-gray-400">...</span>
                  ) : examinerAnalytics?.roomsCreated?.totalRooms ?? examinerRooms.length}
                </h3>
                <p className="text-xs text-gray-600 mt-1">Your exam rooms</p>
              </div>
              <div className="p-3 rounded-lg bg-linear-to-r from-pink-100 via-blue-100 to-green-100">
                <FileText className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
          <Card className="glass-card h-48 overflow-hidden relative">
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={{
                background: [
                  "linear-gradient(135deg, #fff6e5, #e0f7fa, #f9fbe7)",
                  "linear-gradient(135deg, #e0f7fa, #f9fbe7, #fff6e5)",
                ],
                transition: { duration: 12, repeat: Infinity, repeatType: "loop" },
              }}
            />
            <CardContent className="p-6 relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Total Students</p>
                <h3 className="text-3xl font-bold mt-2">
                  {loadingExaminerAnalytics ? (
                    <span className="text-gray-400">...</span>
                  ) : examinerAnalytics?.studentsPerExam?.reduce((sum, exam) => sum + exam.totalStudentsJoined, 0) ?? 0}
                </h3>
                <p className="text-xs text-gray-600 mt-1">Across all exams</p>
              </div>
              <div className="p-3 rounded-lg bg-linear-to-r from-yellow-100 via-purple-100 to-cyan-100">
                <Users className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
          <Card className="glass-card h-48 overflow-hidden relative">
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={{
                background: [
                  "linear-gradient(135deg, #fff6e5, #e0f7fa, #f9fbe7)",
                  "linear-gradient(135deg, #e0f7fa, #f9fbe7, #fff6e5)",
                ],
                transition: { duration: 12, repeat: Infinity, repeatType: "loop" },
              }}
            />
            <CardContent className="p-6 relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Average Students/Exam</p>
                <h3 className="text-3xl font-bold mt-2">
                  {loadingExaminerAnalytics ? (
                    <span className="text-gray-400">...</span>
                  ) : examinerAnalytics?.studentsPerExam?.length > 0
                    ? Math.round(
                        examinerAnalytics.studentsPerExam.reduce((sum, exam) => sum + exam.totalStudentsJoined, 0) /
                        examinerAnalytics.studentsPerExam.length
                      )
                    : 0}
                </h3>
                <p className="text-xs text-gray-600 mt-1">Per exam average</p>
              </div>
              <div className="p-3 rounded-lg bg-linear-to-r from-red-100 via-orange-100 to-pink-100">
                <TrendingUp className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
          <Card className="glass-card h-48 overflow-hidden relative">
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={{
                background: [
                  "linear-gradient(135deg, #fff6e5, #e0f7fa, #f9fbe7)",
                  "linear-gradient(135deg, #e0f7fa, #f9fbe7, #fff6e5)",
                ],
                transition: { duration: 12, repeat: Infinity, repeatType: "loop" },
              }}
            />
            <CardContent className="p-6 relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Total Exams</p>
                <h3 className="text-3xl font-bold mt-2">
                  {loadingExaminerAnalytics ? (
                    <span className="text-gray-400">...</span>
                  ) : examinerAnalytics?.studentsPerExam?.length ?? examinerRooms.length}
                </h3>
                <p className="text-xs text-gray-600 mt-1">Exams conducted</p>
              </div>
              <div className="p-3 rounded-lg bg-linear-to-r from-green-100 via-teal-100 to-lime-100">
                <FileText className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Fallback Stats Grid - Only show if examiner analytics not available */}
      {!examinerAnalytics && !loadingExaminerAnalytics && (
        <motion.div 
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat) => (
            <motion.div key={stat.title} variants={itemVariants} whileHover={{ scale: 1.03 }}>
              <Card className="glass-card h-48 overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  animate={{
                    background: [
                      "linear-gradient(135deg, #fff6e5, #e0f7fa, #f9fbe7)",
                      "linear-gradient(135deg, #e0f7fa, #f9fbe7, #fff6e5)",
                    ],
                    transition: { duration: 12, repeat: Infinity, repeatType: "loop" },
                  }}
                />
                <CardContent className="p-6 relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{stat.title}</p>
                    <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                    <p className="text-xs text-gray-600 mt-1">{stat.trend}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

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
                  <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>
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
                  <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>
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
                  <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>
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
                  <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Examiner Analytics Section - Students Per Exam Chart */}
      {examinerAnalytics && !loadingExaminerAnalytics && examinerAnalytics.studentsPerExam.length > 0 && (
        <motion.div 
          variants={itemVariants} 
          initial="hidden" 
          animate="visible"
        >
          <Card className="glass-card shadow-lg">
            <CardHeader>
              <CardTitle className="gradient-text flex items-center gap-2">
                <Users className="w-5 h-5" />
                Students Joined Per Exam
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Bar
                  data={{
                    labels: examinerAnalytics.studentsPerExam.slice(0, 10).map(exam => exam.examName),
                    datasets: [
                      {
                        label: "Students Joined",
                        data: examinerAnalytics.studentsPerExam.slice(0, 10).map(exam => exam.totalStudentsJoined),
                        backgroundColor: "rgba(96, 165, 250, 0.8)",
                        borderColor: "rgb(96, 165, 250)",
                        borderWidth: 2,
                        borderRadius: 8
                      }
                    ]
                  }}
                  options={chartOptions}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Created/Scheduled Exams Section */}
      {examinerRooms.length > 0 && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mt-6"
        >
          <Card className="glass-card shadow-lg">
            <CardHeader>
              <CardTitle className="gradient-text flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Your Created Exams ({examinerRooms.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {examinerRooms.map((room) => (
                  <motion.div
                    key={room.roomId}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/monitoring/${room.roomId}`)}
                    className="glass-card p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg cursor-pointer transition-all group bg-white/80"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                          {room.examName || room.courseName || room.roomId}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">Room: {room.roomId}</p>
                        {room.examSubject && (
                          <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded mb-2 border border-blue-200">
                            {room.examSubject}
                          </span>
                        )}
                      </div>
                      {isScheduled(room) ? (
                        <Calendar className="w-4 h-4 text-yellow-600 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-green-600 shrink-0" />
                      )}
                    </div>
                    
                    <div className="space-y-1.5 mb-3">
                      {room.examDuration && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{room.examDuration} minutes</span>
                        </div>
                      )}
                      {room.startTime && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(room.startTime)}</span>
                        </div>
                      )}
                      {room.maxStudents && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Users className="w-3 h-3" />
                          <span>Max: {room.maxStudents} students</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className={`text-xs px-2 py-1 rounded ${
                        isScheduled(room) 
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-300" 
                          : "bg-green-100 text-green-700 border border-green-300"
                      }`}>
                        {isScheduled(room) ? "Scheduled" : "Created"}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
