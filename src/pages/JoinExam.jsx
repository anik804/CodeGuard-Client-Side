import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardCheck, Clock, Calendar, ArrowRight } from "lucide-react";
import { useState } from "react";

const availableExams = [
  {
    id: 1,
    title: "Midterm Examination - Computer Networks",
    date: "2024-11-15",
    time: "10:00 AM",
    duration: "2 hours",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Final Exam - Database Management",
    date: "2024-11-20",
    time: "2:00 PM",
    duration: "3 hours",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Quiz - Operating Systems",
    date: "2024-11-12",
    time: "11:00 AM",
    duration: "1 hour",
    status: "live",
  },
];

export default function JoinExam() {
  const [examCode, setExamCode] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">Join Exam</h1>
        <p className="text-muted-foreground">Enter exam code or select from available exams</p>
      </motion.div>

      {/* Join with Code */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              Join with Exam Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="examCode" className="sr-only">Exam Code</Label>
                <Input
                  id="examCode"
                  placeholder="Enter exam code (e.g., EXAM-2024-001)"
                  value={examCode}
                  onChange={(e) => setExamCode(e.target.value)}
                  className="bg-secondary/50 text-lg"
                />
              </div>
              <Button size="lg" className="gap-2">
                Join Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Available Exams */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-4">Available Exams</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableExams.map((exam, index) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            >
              <Card
                className={`glass-card hover:shadow-lg transition-all duration-300 ${
                  exam.status === "live" ? "border-primary animate-glow" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    {exam.status === "live" && (
                      <span className="px-2 py-1 text-xs font-semibold bg-primary/20 text-primary rounded-full">
                        LIVE
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {exam.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {exam.time} • {exam.duration}
                  </div>
                  <Button
                    className="w-full gap-2"
                    variant={exam.status === "live" ? "default" : "outline"}
                  >
                    {exam.status === "live" ? "Join Now" : "View Details"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
