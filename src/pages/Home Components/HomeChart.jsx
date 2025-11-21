import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
import { Card } from "@/components/ui/card";
import { api } from "../../utils/api";
import { RefreshCw, AlertTriangle } from "lucide-react";

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

const HomeChart = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

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
      setError("Failed to load analytics");
      // Use fallback data if API fails
      setAnalytics({
        platformStats: { totalStudents: 0, totalExaminers: 0, totalRooms: 0, totalFlags: 0 },
        monthlyStats: [],
        flagsPerExam: [],
        impactMetrics: { totalExams: 0, totalStudentsReached: 0, totalFlagsPrevented: 0 },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const animatedHeading = {
    background: "linear-gradient(90deg, #6366f1, #ec4899, #9333ea)",
    backgroundSize: "200% 200%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "gradientAnimation 8s linear infinite",
  };

  // Prepare chart data from analytics
  const totalUsersData = analytics
    ? {
        labels: ["Students", "Examiners"],
        datasets: [
          {
            label: "Total Users",
            data: [
              analytics.platformStats?.totalStudents || 0,
              analytics.platformStats?.totalExaminers || 0,
            ],
            backgroundColor: [
              "rgba(99, 102, 241, 0.8)",
              "rgba(236, 72, 153, 0.8)",
            ],
            borderColor: ["rgb(99, 102, 241)", "rgb(236, 72, 153)"],
            borderWidth: 2,
          },
        ],
      }
    : {
        labels: ["Students", "Examiners"],
        datasets: [
          {
            label: "Total Users",
            data: [0, 0],
            backgroundColor: [
              "rgba(99, 102, 241, 0.8)",
              "rgba(236, 72, 153, 0.8)",
            ],
            borderColor: ["rgb(99, 102, 241)", "rgb(236, 72, 153)"],
            borderWidth: 2,
          },
        ],
      };

  const roomsCreatedData = analytics
    ? {
        labels: ["Total Rooms", "Active Rooms", "Flags Detected"],
        datasets: [
          {
            label: "Room Status",
            data: [
              analytics.platformStats?.totalRooms || 0,
              analytics.platformStats?.activeRooms || 0,
              analytics.platformStats?.totalFlags || 0,
            ],
            backgroundColor: [
              "rgba(59, 130, 246, 0.8)",
              "rgba(168, 85, 247, 0.8)",
              "rgba(34, 211, 238, 0.8)",
            ],
            borderColor: ["rgb(59, 130, 246)", "rgb(168, 85, 247)", "rgb(34, 211, 238)"],
            borderWidth: 2,
          },
        ],
      }
    : {
        labels: ["Total Rooms", "Active Rooms", "Flags Detected"],
        datasets: [
          {
            label: "Room Status",
            data: [0, 0, 0],
            backgroundColor: [
              "rgba(59, 130, 246, 0.8)",
              "rgba(168, 85, 247, 0.8)",
              "rgba(34, 211, 238, 0.8)",
            ],
            borderColor: ["rgb(59, 130, 246)", "rgb(168, 85, 247)", "rgb(34, 211, 238)"],
            borderWidth: 2,
          },
        ],
      };

  const monthlyJoinsData = analytics?.monthlyStats
    ? {
        labels: analytics.monthlyStats.map((m) => m.month),
        datasets: [
          {
            label: "Students",
            data: analytics.monthlyStats.map((m) => m.studentsJoined),
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            borderColor: "rgb(99, 102, 241)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "rgb(99, 102, 241)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: "Examiners",
            data: analytics.monthlyStats.map((m) => m.examinersJoined),
            backgroundColor: "rgba(236, 72, 153, 0.2)",
            borderColor: "rgb(236, 72, 153)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "rgb(236, 72, 153)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      }
    : {
        labels: [],
        datasets: [
          {
            label: "Students",
            data: [],
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            borderColor: "rgb(99, 102, 241)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
          {
            label: "Examiners",
            data: [],
            backgroundColor: "rgba(236, 72, 153, 0.2)",
            borderColor: "rgb(236, 72, 153)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      };

  const roomsPerMonthData = analytics?.monthlyStats
    ? {
        labels: analytics.monthlyStats.map((m) => m.month),
        datasets: [
          {
            label: "Rooms Created",
            data: analytics.monthlyStats.map((m) => m.roomsCreated),
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 2,
            borderRadius: 8,
            hoverBackgroundColor: "rgba(59, 130, 246, 1)",
          },
        ],
      }
    : {
        labels: [],
        datasets: [
          {
            label: "Rooms Created",
            data: [],
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      };

  const cheatActivityData = analytics?.flagsPerExam
    ? {
        labels: analytics.flagsPerExam.slice(0, 6).map((exam) => exam.examName || exam.courseName || exam.roomId),
        datasets: [
          {
            label: "Cheat Activities Detected",
            data: analytics.flagsPerExam.slice(0, 6).map((exam) => exam.flagsCount),
            backgroundColor: [
              "rgba(99, 102, 241, 0.8)",
              "rgba(236, 72, 153, 0.8)",
              "rgba(59, 130, 246, 0.8)",
              "rgba(168, 85, 247, 0.8)",
              "rgba(34, 211, 238, 0.8)",
              "rgba(251, 146, 60, 0.8)",
            ],
            borderColor: [
              "rgb(99, 102, 241)",
              "rgb(236, 72, 153)",
              "rgb(59, 130, 246)",
              "rgb(168, 85, 247)",
              "rgb(34, 211, 238)",
              "rgb(251, 146, 60)",
            ],
            borderWidth: 2,
          },
        ],
      }
    : {
        labels: [],
        datasets: [
          {
            label: "Cheat Activities Detected",
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 2,
          },
        ],
      };

  const totalStatsData = analytics
    ? {
        labels: ["Total Students", "Total Examiners", "Total Rooms", "Cheat Activities"],
        datasets: [
          {
            label: "Platform Overview",
            data: [
              analytics.platformStats?.totalStudents || 0,
              analytics.platformStats?.totalExaminers || 0,
              analytics.platformStats?.totalRooms || 0,
              analytics.platformStats?.totalFlags || 0,
            ],
            backgroundColor: [
              "rgba(99, 102, 241, 0.8)",
              "rgba(236, 72, 153, 0.8)",
              "rgba(59, 130, 246, 0.8)",
              "rgba(251, 146, 60, 0.8)",
            ],
            borderColor: [
              "rgb(99, 102, 241)",
              "rgb(236, 72, 153)",
              "rgb(59, 130, 246)",
              "rgb(251, 146, 60)",
            ],
            borderWidth: 2,
            borderRadius: 12,
            hoverBackgroundColor: [
              "rgba(99, 102, 241, 1)",
              "rgba(236, 72, 153, 1)",
              "rgba(59, 130, 246, 1)",
              "rgba(251, 146, 60, 1)",
            ],
          },
        ],
      }
    : {
        labels: ["Total Students", "Total Examiners", "Total Rooms", "Cheat Activities"],
        datasets: [
          {
            label: "Platform Overview",
            data: [0, 0, 0, 0],
            backgroundColor: [
              "rgba(99, 102, 241, 0.8)",
              "rgba(236, 72, 153, 0.8)",
              "rgba(59, 130, 246, 0.8)",
              "rgba(251, 146, 60, 0.8)",
            ],
            borderColor: [
              "rgb(99, 102, 241)",
              "rgb(236, 72, 153)",
              "rgb(59, 130, 246)",
              "rgb(251, 146, 60)",
            ],
            borderWidth: 2,
            borderRadius: 12,
          },
        ],
      };

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
          color: "white",
          font: { size: 12 },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#374151",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  const pieChartOptions = { ...chartOptions, cutout: "0%" };
  const doughnutChartOptions = { ...chartOptions, cutout: "65%" };

  return (
    <section
      id="insights"
      className="py-20 px-6 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-4 text-primary-foreground"
            style={animatedHeading}
          >
            Platform Analytics
          </h2>
          <p className="text-muted-foreground text-lg">
            Real-time insights into exam monitoring and user activity
          </p>
          {error && (
            <div className="mt-4 flex items-center justify-center gap-2 text-yellow-500">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </motion.div>

        {loading && !analytics ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading analytics...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Chart 1: Total Users */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-elegant hover:shadow-glow transition-all duration-300">
                <h3 className="text-xl font-bold mb-4 text-card-foreground">User Distribution</h3>
                <div className="h-[300px]">
                  <Doughnut data={totalUsersData} options={doughnutChartOptions} />
                </div>
              </Card>
            </motion.div>

            {/* Chart 2: Room Status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-elegant hover:shadow-glow transition-all duration-300">
                <h3 className="text-xl font-bold mb-4 text-card-foreground">Room Status Overview</h3>
                <div className="h-[300px]">
                  <Pie data={roomsCreatedData} options={pieChartOptions} />
                </div>
              </Card>
            </motion.div>

            {/* Chart 3: Monthly Joins */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="md:col-span-2"
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-elegant hover:shadow-glow transition-all duration-300">
                <h3 className="text-xl font-bold mb-4 text-card-foreground">Monthly User Joins</h3>
                <div className="h-[350px]">
                  {monthlyJoinsData.labels.length > 0 ? (
                    <Line data={monthlyJoinsData} options={chartOptions} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No data available
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Chart 4: Rooms Per Month */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-elegant hover:shadow-glow transition-all duration-300">
                <h3 className="text-xl font-bold mb-4 text-card-foreground">Rooms Created Per Month</h3>
                <div className="h-[300px]">
                  {roomsPerMonthData.labels.length > 0 ? (
                    <Bar data={roomsPerMonthData} options={chartOptions} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No data available
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Chart 5: Cheat Activities */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-elegant hover:shadow-glow transition-all duration-300">
                <h3 className="text-xl font-bold mb-4 text-card-foreground">Flags Per Exam (Top 6)</h3>
                <div className="h-[300px]">
                  {cheatActivityData.labels.length > 0 ? (
                    <Doughnut data={cheatActivityData} options={doughnutChartOptions} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No data available
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Chart 6: Total Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="md:col-span-2"
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-elegant hover:shadow-glow transition-all duration-300">
                <h3 className="text-xl font-bold mb-4 text-card-foreground">Platform Overview Statistics</h3>
                <div className="h-[350px]">
                  <Bar data={totalStatsData} options={chartOptions} />
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeChart;
