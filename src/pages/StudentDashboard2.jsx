import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, AlertTriangle, Award } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock student data
const studentInfo = {
  name: "Anik",
  studentId: "C231109",
};

const examMarksData = [
  { exam: "Midterm 1", marks: 85 },
  { exam: "Midterm 2", marks: 78 },
  { exam: "Final", marks: 92 },
  { exam: "Quiz 1", marks: 88 },
  { exam: "Quiz 2", marks: 95 },
];

const stats = [
  { title: "Exams Attended", value: "5", icon: CheckCircle, color: "bg-primary/20 text-primary" },
  { title: "Exams Available", value: "8", icon: FileText, color: "bg-cyan-500/20 text-cyan-400" },
  { title: "Activity Alerts", value: "2", icon: AlertTriangle, color: "bg-destructive/20 text-destructive" },
  { title: "Average Score", value: "87.6%", icon: Award, color: "bg-green-500/20 text-green-400" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function StudentDashboard2() {
  return (
    <div className="space-y-6 max-w-full mx-auto">
      {/* Student Info Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card border-primary/20 shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold gradient-text">{studentInfo.name}</h2>
                <p className="text-muted-foreground mt-1">ID: {studentInfo.studentId}</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/20">
                <Award className="w-8 h-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
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

      {/* Exam Marks Chart */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="gradient-text">Exam Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={examMarksData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                <XAxis dataKey="exam" stroke="hsl(0 0% 60%)" />
                <YAxis stroke="hsl(0 0% 60%)" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0 0% 10%)",
                    border: "1px solid hsl(0 0% 20%)",
                    borderRadius: "8px",
                  }}
                />
                <Bar 
                  dataKey="marks" 
                  fill="hsl(189, 94%, 43%)" 
                  radius={[8, 8, 0, 0]}
                  label={{ position: 'top', fill: 'hsl(0 0% 98%)' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
