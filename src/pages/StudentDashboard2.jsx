import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  FileText,
  AlertTriangle,
  Award,
  RefreshCw,
  Users,
  GraduationCap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Filler,
} from "chart.js";
import { Pie, Bar, Doughnut, Line } from "react-chartjs-2";
import { api } from "../utils/api";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Filler
);

export default function StudentDashboard2() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [studentName, setStudentName] = useState("Student");
  const [examHistory, setExamHistory] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const storedName = sessionStorage.getItem("studentName");
    const storedId = sessionStorage.getItem("studentId");
    if (storedName) setStudentName(storedName);
    else if (storedId) setStudentName(storedId);
  }, []);

  useEffect(() => {
    const storedStudentId = sessionStorage.getItem("studentId");
    if (storedStudentId) {
      setStudentId(storedStudentId);
      fetchStudentAnalytics(storedStudentId);
      fetchExamHistory(storedStudentId);
    } else {
      setError("Student ID not found. Please log in again.");
      setLoading(false);
      setLoadingHistory(false);
    }
  }, []);

  const fetchExamHistory = async (id) => {
    try {
      setLoadingHistory(true);
      const response = await fetch(
        `https://codeguard-server-side-1.onrender.com/api/analytics/student/exam-history?studentId=${encodeURIComponent(id)}`
      );
      const data = await response.json();
      if (data.success) {
        setExamHistory(data.data);
      }
    } catch (err) {
      console.error("Error fetching exam history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchStudentAnalytics = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getStudentAnalytics(id);
      if (response.success) setAnalytics(response.data);
      else setError("Failed to load analytics");
    } catch (err) {
      console.error("Error fetching student analytics:", err);
      setError("Failed to load analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 2000, easing: "easeInOutQuart" },
    plugins: {
      legend: { position: "top", labels: { font: { size: 12 }, padding: 15 } },
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your analytics...</p>
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
          {studentId && (
            <button
              onClick={() => fetchStudentAnalytics(studentId)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  const stats = analytics
    ? [
        {
          title: "Exams Attended",
          value: analytics.totalExamsAttended || 0,
          icon: CheckCircle,
          color: "from-indigo-100 via-blue-100 to-cyan-100",
        },
        {
          title: "Flags Received",
          value: analytics.totalFlagsReceived || 0,
          icon: AlertTriangle,
          color: "from-rose-100 via-pink-100 to-amber-100",
        },
        {
          title: "Currently In Exam",
          value: analytics.isCurrentlyInExam ? "Yes" : "No",
          icon: FileText,
          color: analytics.isCurrentlyInExam
            ? "from-green-100 via-emerald-100 to-teal-100"
            : "from-gray-100 via-gray-200 to-gray-100",
        },
        {
          title: "Avg. Flags / Exam",
          value:
            analytics.totalExamsAttended > 0
              ? (
                  analytics.totalFlagsReceived / analytics.totalExamsAttended
                ).toFixed(1)
              : "0",
          icon: Award,
          color: "from-purple-100 via-violet-100 to-fuchsia-100",
        },
      ]
    : [];

  const flagsPerExamData =
    analytics?.flagsPerExam?.length > 0
      ? {
          labels: analytics.flagsPerExam.map(
            (exam) => exam.examName || exam.courseName || exam.roomId
          ),
          datasets: [
            {
              label: "Flags Received",
              data: analytics.flagsPerExam.map((exam) => exam.flagsCount),
              backgroundColor: [
                "rgba(99, 102, 241, 0.8)",
                "rgba(236, 72, 153, 0.8)",
                "rgba(59, 130, 246, 0.8)",
                "rgba(168, 85, 247, 0.8)",
                "rgba(34, 211, 238, 0.8)",
              ],
              borderWidth: 2,
            },
          ],
        }
      : { labels: [], datasets: [] };

  const monthlyStatsData = analytics?.monthlyStats
    ? {
        labels: analytics.monthlyStats.map((m) => m.month),
        datasets: [
          {
            label: "Exams Attended",
            data: analytics.monthlyStats.map((m) => m.examsAttended),
            borderColor: "rgb(99, 102, 241)",
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Flags Received",
            data: analytics.monthlyStats.map((m) => m.flagsReceived),
            borderColor: "rgb(239, 68, 68)",
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            tension: 0.4,
            fill: true,
          },
        ],
      }
    : { labels: [], datasets: [] };

  const recentExamsData =
    analytics?.recentExams?.length > 0
      ? {
          labels: analytics.recentExams
            .slice(0, 5)
            .map(
              (exam) =>
                exam.examName || exam.courseName || exam.roomId || "Unknown"
            ),
          datasets: [
            {
              data: analytics.recentExams
                .slice(0, 5)
                .map((exam) => exam.flagsCount || 0),
              backgroundColor: [
                "#4f46e5",
                "#10b981",
                "#f59e0b",
                "#ef4444",
                "#8b5cf6",
              ],
            },
          ],
        }
      : { labels: [], datasets: [] };

  const examStatusData = analytics
    ? {
        labels: ["Exams with Flags", "Clean Exams"],
        datasets: [
          {
            data: [
              analytics.flagsPerExam?.length || 0,
              Math.max(
                0,
                (analytics.totalExamsAttended || 0) -
                  (analytics.flagsPerExam?.length || 0)
              ),
            ],
            backgroundColor: [
              "rgba(239, 68, 68, 0.8)",
              "rgba(34, 197, 94, 0.8)",
            ],
          },
        ],
      }
    : { labels: [], datasets: [] };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Analytics</h1>
        {studentId && (
          <button
            onClick={() => fetchStudentAnalytics(studentId)}
            disabled={loading}
            className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        )}
      </div>

      {/* Stats Grid */}
      {/* <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="h-40"
          >
            <Card className="h-full rounded-2xl overflow-hidden shadow-md border-none">
              <div
                className={`h-full w-full p-6 flex flex-col justify-between bg-gradient-to-br ${stat.color}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {stat.title}
                    </p>
                    <h3 className="text-3xl font-bold mt-2 text-gray-900">
                      {stat.value}
                    </h3>
                  </div>
                  <div className="p-3 bg-white/60 rounded-xl shadow-inner">
                    <stat.icon className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div> */}
      {/* Stats Grid */}
<motion.div
  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {stats.map((stat) => (
    <motion.div
      key={stat.title}
      variants={itemVariants}
      whileHover={{ scale: 1.05 }}
      className="h-40"
    >
      <Card
        className={`h-full rounded-2xl shadow-md border-none overflow-hidden bg-linear-to-br ${stat.color} flex flex-col justify-between p-6`}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-700">{stat.title}</p>
            <h3 className="text-3xl font-bold mt-2 text-gray-900">
              {stat.value}
            </h3>
          </div>
          <div className="p-3 bg-white/60 rounded-xl shadow-inner">
            <stat.icon className="w-6 h-6 text-gray-700" />
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3">{stat.trend}</p>
      </Card>
    </motion.div>
  ))}
</motion.div>


      {/* Charts */}
      <div className="grid mt-10 grid-cols-1 lg:grid-cols-2 gap-8">
        {flagsPerExamData.labels.length > 0 && (
          <div className="bg-white shadow-md rounded-xl p-4 border border-gray-100">
            <h3 className="text-lg font-semibold text-center mb-3 text-red-600">
              Flags Received Per Exam
            </h3>
            <div className="h-[300px]">
              <Bar data={flagsPerExamData} options={chartOptions} />
            </div>
          </div>
        )}

        {monthlyStatsData.labels.length > 0 && (
          <div className="bg-white shadow-md rounded-xl p-4 border border-gray-100">
            <h3 className="text-lg font-semibold text-center mb-3 text-purple-600">
              Monthly Statistics
            </h3>
            <div className="h-[300px]">
              <Line data={monthlyStatsData} options={chartOptions} />
            </div>
          </div>
        )}

        {recentExamsData.labels.length > 0 && (
          <div className="bg-white shadow-md rounded-xl p-4 border border-gray-100">
            <h3 className="text-lg font-semibold text-center mb-3 text-indigo-600">
              Flags in Recent Exams
            </h3>
            <div className="h-[300px]">
              <Pie data={recentExamsData} options={chartOptions} />
            </div>
          </div>
        )}

        {examStatusData.labels.length > 0 && (
          <div className="bg-white shadow-md rounded-xl p-4 border border-gray-100">
            <h3 className="text-lg font-semibold text-center mb-3 text-orange-600">
              Exam Status Distribution
            </h3>
            <div className="h-[300px]">
              <Doughnut data={examStatusData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>

      {/* Exam History Section */}
      {examHistory && !loadingHistory && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-10 space-y-6"
        >
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="glass-card">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Exams Taken</p>
                    <h3 className="text-3xl font-bold mt-2">{examHistory.totalExams}</h3>
                  </div>
                  <FileText className="w-12 h-12 text-blue-500" />
                </div>
              </div>
            </Card>
            <Card className="glass-card">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Different Examiners</p>
                    <h3 className="text-3xl font-bold mt-2">{examHistory.totalExaminers}</h3>
                  </div>
                  <Users className="w-12 h-12 text-green-500" />
                </div>
              </div>
            </Card>
            <Card className="glass-card">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Exams/Examiner</p>
                    <h3 className="text-3xl font-bold mt-2">
                      {examHistory.totalExaminers > 0
                        ? Math.round(examHistory.totalExams / examHistory.totalExaminers)
                        : 0}
                    </h3>
                  </div>
                  <GraduationCap className="w-12 h-12 text-purple-500" />
                </div>
              </div>
            </Card>
          </div>

          {/* Exams by Examiner Chart */}
          {examHistory.byExaminer.length > 0 && (
            <Card className="glass-card shadow-md">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-indigo-600">
                  Exams Taken Under Different Examiners
                </h3>
              </div>
              <div className="p-4">
                <div className="h-[300px]">
                  <Bar
                    data={{
                      labels: examHistory.byExaminer.map(
                        (examiner) => examiner.examinerName || examiner.examinerUsername || "Unknown"
                      ),
                      datasets: [
                        {
                          label: "Exams Taken",
                          data: examHistory.byExaminer.map((examiner) => examiner.examCount),
                          backgroundColor: "rgba(99, 102, 241, 0.8)",
                          borderColor: "rgb(99, 102, 241)",
                          borderWidth: 2,
                          borderRadius: 8
                        }
                      ]
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Recent Exams List */}
          {examHistory.examHistory.length > 0 && (
            <Card className="glass-card shadow-md">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Recent Exam History</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {examHistory.examHistory.slice(0, 10).map((exam, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{exam.examName}</h4>
                        <p className="text-sm text-gray-600">
                          Examiner: {exam.examinerName || exam.examinerUsername || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {exam.examDate
                            ? new Date(exam.examDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                              })
                            : "Date not available"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">
                          {exam.activityCount} activities
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      )}

      {/* Current Exam */}
      {analytics?.isCurrentlyInExam && analytics?.currentExamRoom && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className="bg-linear-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30">
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-cyan-600">
                  Currently In Exam
                </h3>
                <p className="text-muted-foreground mt-1">
                  {analytics.currentExamRoom.examName ||
                    analytics.currentExamRoom.courseName ||
                    analytics.currentExamRoom.roomId}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-cyan-500/20">
                <FileText className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
