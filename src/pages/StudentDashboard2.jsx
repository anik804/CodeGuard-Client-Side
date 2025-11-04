import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, FileText, AlertTriangle, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
} from "chart.js";
import { Pie, Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

export default function DashboardHome() {
  const [username, setUsername] = useState("Student");

  const stats = [
    { title: "Exams Attended", value: "5", icon: CheckCircle, color: "bg-primary/20 text-primary" },
    { title: "Exams Available", value: "8", icon: FileText, color: "bg-cyan-500/20 text-cyan-400" },
    { title: "Activity Alerts", value: "2", icon: AlertTriangle, color: "bg-destructive/20 text-destructive" },
    { title: "Average Score", value: "87.6%", icon: Award, color: "bg-green-500/20 text-green-400" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  // 🔹 Fake dashboard data
  const examStats = {
    totalExams: 6,
    teachers: [
      { name: "irfan@iiuc.ac.bd", exams: 2 },
      { name: "tanvir@iiuc.ac.bd", exams: 3 },
      { name: "jamil@iiuc.ac.bd", exams: 1 },
    ],
    courses: [
      { name: "Data Structure", exams: 2 },
      { name: "Algorithms", exams: 1 },
      { name: "DBMS", exams: 1 },
      { name: "OOP", exams: 2 },
    ],
    examDates: ["2025-05-02", "2025-06-14", "2025-07-21", "2025-09-03", "2025-09-28", "2025-10-15"],
    scores: [65, 70, 80, 85, 90, 88],
    examTypes: { MCQ: 4, Written: 2 },
  };

  // 📊 Pie Chart (Exams per Course)
  const pieData = {
    labels: examStats.courses.map((c) => c.name),
    datasets: [
      {
        data: examStats.courses.map((c) => c.exams),
        backgroundColor: ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"],
        borderWidth: 1,
      },
    ],
  };

  // 📊 Bar Chart (Exams per Teacher)
  const barData = {
    labels: examStats.teachers.map((t) => t.name),
    datasets: [
      {
        label: "Exams Given",
        data: examStats.teachers.map((t) => t.exams),
        backgroundColor: "#10b981",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: { y: { beginAtZero: true }, x: { ticks: { font: { size: 12 } } } },
  };

  // 📈 Line Chart (Scores Over Time)
  const lineData = {
    labels: examStats.examDates,
    datasets: [
      {
        label: "Exam Scores",
        data: examStats.scores,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
      },
    ],
  };

  // 🍩 Doughnut Chart (Exam Type Distribution)
  const doughnutData = {
    labels: ["MCQ Exams", "Written Exams"],
    datasets: [
      {
        data: [examStats.examTypes.MCQ, examStats.examTypes.Written],
        backgroundColor: ["#10b981", "#f59e0b"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6">
      {/* 🔹 Stats Grid */}
      <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" variants={containerVariants} initial="hidden" animate="visible">
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="glass-card hover:shadow-lg transition-all duration-300 animate-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
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

      {/* 🔹 Graphs Section */}
      <div className="grid mt-10 grid-cols-1 lg:grid-cols-2 gap-8">
       

        {/* Bar Chart */}
        <div className="bg-white shadow-md rounded-xl p-4 border border-gray-100">
          <h3 className="text-lg font-semibold text-center mb-3 text-green-600">Exams per Teacher</h3>
          <Bar data={barData} options={barOptions} />
        </div>

        {/* Line Chart */}
        <div className="bg-white shadow-md rounded-xl p-4 border border-gray-100">
          <h3 className="text-lg font-semibold text-center mb-3 text-purple-600">Exam Scores Over Time</h3>
          <Line data={lineData} />

        </div>

 {/* Pie Chart */}
        <div className="bg-white shadow-md rounded-xl p-4 border border-gray-100">
          <h3 className="text-lg font-semibold text-center mb-3 text-indigo-600">Exams per Course</h3>
          <Pie data={pieData} height={100} />
        </div>

         {/* Doughnut Chart */}
        <div className="bg-white shadow-md rounded-xl p-4 border border-gray-100">
          <h3 className="text-lg font-semibold text-center mb-3 text-orange-600">Exam Type Distribution</h3>
          <Doughnut data={doughnutData} />
        </div>
       
      </div>

      {/* 🔹 Exam Dates List */}
      {/* <div className="bg-white border border-gray-100 shadow-md rounded-xl p-4 mt-8">
        <h3 className="text-lg font-semibold text-center text-purple-600 mb-4">Exam History (Date-wise)</h3>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-center">
          {examStats.examDates.map((date, i) => (
            <li key={i} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3 rounded-lg shadow-sm border hover:shadow-md transition">
              <span className="text-sm font-medium text-gray-700">🗓 {date}</span>
            </li>
          ))}
        </ul>
      </div> */}
    </motion.div>
  );
}




// import { motion } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { FileText, CheckCircle, AlertTriangle, Award } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// // Mock student data
// const studentInfo = {
//   name: "Anik",
//   studentId: "C231109",
// };

// const examMarksData = [
//   { exam: "Midterm 1", marks: 85 },
//   { exam: "Midterm 2", marks: 78 },
//   { exam: "Final", marks: 92 },
//   { exam: "Quiz 1", marks: 88 },
//   { exam: "Quiz 2", marks: 95 },
// ];

// const stats = [
//   { title: "Exams Attended", value: "5", icon: CheckCircle, color: "bg-primary/20 text-primary" },
//   { title: "Exams Available", value: "8", icon: FileText, color: "bg-cyan-500/20 text-cyan-400" },
//   { title: "Activity Alerts", value: "2", icon: AlertTriangle, color: "bg-destructive/20 text-destructive" },
//   { title: "Average Score", value: "87.6%", icon: Award, color: "bg-green-500/20 text-green-400" },
// ];

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0 },
// };

// export default function StudentDashboard2() {
//   return (
//     <div className="space-y-6 max-w-full mx-auto">
//       {/* Student Info Card */}
//       {/* <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Card className="glass-card border-primary/20 shadow-none">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="text-2xl font-bold gradient-text">{studentInfo.name}</h2>
//                 <p className="text-muted-foreground mt-1">ID: {studentInfo.studentId}</p>
//               </div>
//               <div className="p-4 rounded-lg bg-primary/20">
//                 <Award className="w-8 h-8 text-primary" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div> */}

//       {/* Stats Grid */}
//       <motion.div
//         className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         {stats.map((stat) => (
//           <motion.div key={stat.title} variants={itemVariants}>
//             <Card className="glass-card hover:shadow-lg transition-all duration-300 animate-glow">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-muted-foreground">{stat.title}</p>
//                     <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
//                   </div>
//                   <div className={`p-3 rounded-lg ${stat.color}`}>
//                     <stat.icon className="w-6 h-6" />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </motion.div>

//       {/* Exam Marks Chart */}
//       <motion.div
//         variants={itemVariants}
//         initial="hidden"
//         animate="visible"
//         transition={{ delay: 0.3 }}
//       >
//         <Card className="glass-card">
//           <CardHeader>
//             <CardTitle className="gradient-text">Exam Performance</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={400}>
//               <BarChart data={examMarksData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
//                 <XAxis dataKey="exam" stroke="hsl(0 0% 60%)" />
//                 <YAxis stroke="hsl(0 0% 60%)" domain={[0, 100]} />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "hsl(0 0% 10%)",
//                     border: "1px solid hsl(0 0% 20%)",
//                     borderRadius: "8px",
//                   }}
//                 />
//                 <Bar 
//                   dataKey="marks" 
//                   fill="hsl(189, 94%, 43%)" 
//                   radius={[8, 8, 0, 0]}
//                   label={{ position: 'top', fill: 'hsl(0 0% 98%)' }}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }
