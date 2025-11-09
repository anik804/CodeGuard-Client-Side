import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Calendar, Users, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const examHistory = [
  {
    id: 1,
    title: "Midterm Exam - Computer Science",
    date: "2025-10-15",
    students: 45,
    alerts: 3,
    status: "Completed",
    average: 78,
  },
  {
    id: 2,
    title: "Quiz 1 - Data Structures",
    date: "2025-10-20",
    students: 50,
    alerts: 1,
    status: "Completed",
    average: 85,
  },
  {
    id: 3,
    title: "Final Exam - Algorithms",
    date: "2025-10-28",
    students: 38,
    alerts: 5,
    status: "In Progress",
    average: 0,
  },
  {
    id: 4,
    title: "Midterm Exam - Database Systems",
    date: "2025-10-10",
    students: 42,
    alerts: 2,
    status: "Completed",
    average: 82,
  },
  {
    id: 5,
    title: "Quiz 2 - Operating Systems",
    date: "2025-11-01",
    students: 0,
    alerts: 0,
    status: "Scheduled",
    average: 0,
  },
];

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
            View and manage all past and upcoming exams
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Exam Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Exams</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Exam Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Alerts</TableHead>
                  <TableHead>Average</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examHistory.map((exam) => (
                  <motion.tr
                    key={exam.id}
                    variants={rowVariants}
                    className="border-border hover:bg-secondary/50 transition-colors"
                  >
                    <TableCell className="font-medium">{exam.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {exam.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {exam.students}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <span className={exam.alerts > 0 ? "text-destructive" : ""}>
                          {exam.alerts}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{exam.status === "Completed" ? `${exam.average}%` : "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          exam.status === "Completed"
                            ? "default"
                            : exam.status === "In Progress"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {exam.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}