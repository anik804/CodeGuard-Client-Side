import { motion } from "framer-motion";
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
  const animatedHeading = {
    background: "linear-gradient(90deg, #6366f1, #ec4899, #9333ea)",
    backgroundSize: "200% 200%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "gradientAnimation 8s linear infinite",
  };

  const totalUsersData = {
    labels: ["Students", "Examiners"],
    datasets: [
      {
        label: "Total Users",
        data: [1248, 86],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderColor: ["rgb(99, 102, 241)", "rgb(236, 72, 153)"],
        borderWidth: 2,
      },
    ],
  };

  const roomsCreatedData = {
    labels: ["Active Rooms", "Completed Rooms", "Cancelled Rooms"],
    datasets: [
      {
        label: "Room Status",
        data: [34, 142, 8],
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

  const monthlyJoinsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Students",
        data: [85, 120, 145, 180, 210, 195, 220, 240, 265, 290, 310, 335],
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
        data: [12, 15, 18, 22, 25, 28, 30, 32, 35, 38, 42, 45],
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
  };

  const roomsPerMonthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Rooms Created",
        data: [8, 12, 15, 18, 22, 19, 25, 28, 32, 35, 38, 42],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: "rgba(59, 130, 246, 1)",
      },
    ],
  };

  const cheatActivityData = {
    labels: [
      "Screen Switch",
      "Tab Switch",
      "Copy Attempt",
      "Multiple Windows",
      "Unauthorized Device",
      "Other",
    ],
    datasets: [
      {
        label: "Cheat Activities Detected",
        data: [45, 89, 34, 23, 12, 8],
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
  };

  const totalStatsData = {
    labels: ["Total Students", "Total Examiners", "Total Rooms", "Cheat Activities"],
    datasets: [
      {
        label: "Platform Overview",
        data: [1248, 86, 184, 211],
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
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white", // Legend text white
          font: { size: 12 },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "#111827", // Dark background
        titleColor: "#ffffff",       // White title text
        bodyColor: "#ffffff",        // White body text
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
    <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary-foreground" style={animatedHeading}>
            Platform Analytics
          </h2>
          <p className="text-muted-foreground text-lg">
            Real-time insights into exam monitoring and user activity
          </p>
        </motion.div>

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
              <h3 className="text-xl font-bold mb-4 text-card-foreground">
                Monthly User Joins
              </h3>
              <div className="h-[350px]">
                <Line data={monthlyJoinsData} options={chartOptions} />
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
                <Bar data={roomsPerMonthData} options={chartOptions} />
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
              <h3 className="text-xl font-bold mb-4 text-card-foreground">Cheat Detection Types</h3>
              <div className="h-[300px]">
                <Doughnut data={cheatActivityData} options={doughnutChartOptions} />
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
      </div>
    </section>
  );
};

export default HomeChart;
