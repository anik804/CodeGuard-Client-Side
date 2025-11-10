import { motion } from "framer-motion";
import { Users, FileText, AlertTriangle, TrendingUp, Calendar, Clock, ArrowRight, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  { exam: "Midterm 1", alerts: 5 },
  { exam: "Midterm 2", alerts: 8 },
  { exam: "Final", alerts: 3 },
  { exam: "Quiz 1", alerts: 12 },
  { exam: "Quiz 2", alerts: 6 },
];

const attendanceData = [
  { name: "Present", value: 85, color: "hsl(189, 94%, 43%)" },
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
  {
    title: "Total Students",
    value: "156",
    icon: Users,
    trend: "+12%",
    color: "bg-primary/20 text-primary",
  },
  {
    title: "Active Exams",
    value: "8",
    icon: FileText,
    trend: "+5",
    color: "bg-cyan-500/20 text-cyan-400",
  },
  {
    title: "Cheating Alerts",
    value: "23",
    icon: AlertTriangle,
    trend: "-8%",
    color: "bg-destructive/20 text-destructive",
  },
  {
    title: "Avg Attendance",
    value: "89%",
    icon: TrendingUp,
    trend: "+3%",
    color: "bg-green-500/20 text-green-400",
  },
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
  const navigate = useNavigate();
  const [examinerRooms, setExaminerRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  useEffect(() => {
    const fetchExaminerRooms = async () => {
      try {
        const username = sessionStorage.getItem("username");
        if (!username) {
          console.log("⚠️ No username found in sessionStorage");
          return;
        }

        console.log("🔍 Fetching rooms for examiner:", username);
        const response = await fetch(
          `http://localhost:3000/api/rooms/by-examiner?examinerUsername=${encodeURIComponent(username)}`
        );
        
        if (!response.ok) {
          console.error("❌ Failed to fetch rooms:", response.status, response.statusText);
          return;
        }
        
        const data = await response.json();
        console.log("📦 Received rooms data:", data);
        
        if (data.success) {
          console.log(`✅ Found ${data.rooms?.length || 0} rooms`);
          setExaminerRooms(data.rooms || []);
        } else {
          console.error("❌ API returned success: false", data.message);
        }
      } catch (error) {
        console.error("❌ Failed to fetch examiner rooms:", error);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchExaminerRooms();
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

  return (
    <div className="space-y-6">
      {/* Created/Scheduled Exams Section */}
      {examinerRooms.length > 0 && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <div className="glass-card p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 gradient-text flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Your Created Exams ({examinerRooms.length})
            </h3>
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
                      <Calendar className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
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
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <div className="glass-card hover:shadow-lg transition-all duration-300 animate-glow p-6 rounded-xl bg-black/40 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <h3 className="text-3xl font-bold mt-2 text-white">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-primary mt-1">{stat.trend}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
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
        {/* Total Exams Taken */}
        <motion.div variants={itemVariants}>
          <div className="glass-card p-6 rounded-xl bg-black/40 border border-white/10">
            <h3 className="text-lg font-semibold mb-4 gradient-text text-white">
              Total Exams Taken
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={examActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                <XAxis dataKey="month" stroke="hsl(0 0% 60%)" />
                <YAxis stroke="hsl(0 0% 60%)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0 0% 10%)",
                    border: "1px solid hsl(0 0% 20%)",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="exams"
                  stroke="hsl(189, 94%, 43%)"
                  strokeWidth={3}
                  dot={{ fill: "hsl(189, 94%, 43%)", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Cheating Alerts */}
        <motion.div variants={itemVariants}>
          <div className="glass-card p-6 rounded-xl bg-black/40 border border-white/10">
            <h3 className="text-lg font-semibold mb-4 gradient-text text-white">
              Cheating Alerts by Exam
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cheatingAlertsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                <XAxis dataKey="exam" stroke="hsl(0 0% 60%)" />
                <YAxis stroke="hsl(0 0% 60%)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0 0% 10%)",
                    border: "1px solid hsl(0 0% 20%)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="alerts"
                  fill="hsl(0, 72%, 51%)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Student Attendance */}
        <motion.div variants={itemVariants}>
          <div className="glass-card p-6 rounded-xl bg-black/40 border border-white/10">
            <h3 className="text-lg font-semibold mb-4 gradient-text text-white">
              Student Attendance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0 0% 10%)",
                    border: "1px solid hsl(0 0% 20%)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Student Exam Completion */}
        <motion.div variants={itemVariants}>
          <div className="glass-card p-6 rounded-xl bg-black/40 border border-white/10">
            <h3 className="text-lg font-semibold mb-4 gradient-text text-white">
              Student Exam Completion
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentExamData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                <XAxis type="number" stroke="hsl(0 0% 60%)" />
                <YAxis dataKey="student" type="category" stroke="hsl(0 0% 60%)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0 0% 10%)",
                    border: "1px solid hsl(0 0% 20%)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="examsCompleted"
                  fill="hsl(189, 94%, 43%)"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
