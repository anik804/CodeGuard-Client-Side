import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, AlertTriangle, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";

// Mock data
const examActivityData = [
  { month: "Jan", exams: 12 },
  { month: "Feb", exams: 19 },
  { month: "Mar", exams: 15 },
  { month: "Apr", exams: 25 },
  { month: "May", exams: 22 },
  { month: "Jun", exams: 30 },
];

const cheatingAlertsData = [
  { exam: "Mid-1", alerts: 5 },
  { exam: "Mid-2", alerts: 8 },
  { exam: "Final", alerts: 3 },
  { exam: "Quiz 1", alerts: 12 },
  { exam: "Quiz 2", alerts: 6 },
];

const attendanceData = [
  { name: "Present", value: 85, color: "hsl(120, 70%, 40%)" },
  { name: "Absent", value: 10, color: "hsl(0, 72%, 51%)" },
  { name: "Late", value: 5, color: "hsl(45, 93%, 47%)" },
];

const studentExamData = [
  { student: "Alice", examsCompleted: 8 },
  { student: "Bob", examsCompleted: 7 },
  { student: "Charlie", examsCompleted: 9 },
  { student: "Diana", examsCompleted: 6 },
  { student: "Eve", examsCompleted: 10 },
];

const stats = [
  { title: "Total Students", value: "156", icon: Users, trend: "+12%", color: "bg-primary/20 text-primary" },
  { title: "Active Exams", value: "8", icon: FileText, trend: "+5", color: "bg-cyan-500/20 text-cyan-400" },
  { title: "Cheating Alerts", value: "23", icon: AlertTriangle, trend: "-8%", color: "bg-destructive/20 text-destructive" },
  { title: "Avg Attendance", value: "89%", icon: TrendingUp, trend: "+3%", color: "bg-green-500/20 text-green-400" },
];

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

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: "hsl(0 0% 0%)",
      border: "1px solid hsl(0 0% 20%)",
      borderRadius: "8px",
      color: "#fff",
    },
    itemStyle: { color: "#fff" },
    labelStyle: { color: "#fff" },
  };

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
            Welcome, {user?.name || "Anik"}!
          </h1>
          <p className="text-sm md:text-base mt-1 text-indigo-200">
            {user?.role === "teacher"
              ? "Teacher of CSE Department, IIUC"
              : user?.role || "Teacher"}
          </p>
        </div>
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
              <CardTitle className="gradient-text">Total Exams Taken</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={examActivityData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                  <XAxis dataKey="month" stroke="hsl(0 0% 60%)" interval={0} />
                  <YAxis stroke="hsl(0 0% 60%)" />
                  <Tooltip {...tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="exams"
                    stroke="url(#colorUv)"
                    strokeWidth={3}
                    dot={{ fill: "hsl(189, 94%, 43%)", r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(189, 94%, 43%)" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="hsl(63, 94%, 47%)" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cheating Alerts Chart */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text">Cheating Alerts by Exam</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={cheatingAlertsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                  <XAxis dataKey="exam" stroke="hsl(0 0% 60%)" interval={0} />
                  <YAxis stroke="hsl(0 0% 60%)" />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="alerts" radius={[12, 12, 0, 0]}>
                    {cheatingAlertsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#f87171", "#fbbf24", "#60a5fa", "#34d399", "#a78bfa"][index % 5]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Student Attendance Chart */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text">Student Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Student Exam Completion */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text">Student Exam Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={studentExamData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                  <XAxis type="number" stroke="hsl(0 0% 60%)" />
                  <YAxis dataKey="student" type="category" stroke="hsl(0 0% 60%)" interval={0} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="examsCompleted" radius={[0, 12, 12, 0]}>
                    {studentExamData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#60a5fa", "#f87171", "#fbbf24", "#34d399", "#a78bfa"][index % 5]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
