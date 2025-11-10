import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { motion } from "framer-motion";
import {
    BookOpen,
    Calendar,
    Loader2,
    Mail,
    Phone,
    Save,
    User,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedStudentId = sessionStorage.getItem("studentId");
    if (storedStudentId) {
      fetchStudentInfo(storedStudentId);
    } else {
      console.warn("⚠️ No studentId found in sessionStorage.");
      setLoading(false);
    }
  }, []);

  const fetchStudentInfo = async (studentId) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/students/${studentId}`
      );
      setStudent(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch student info:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );

  if (!student)
    return (
      <div className="text-center mt-10 text-gray-500 font-medium">
        ⚠️ No student data found. Please log in again.
      </div>
    );

  const phone = student.phone || "+880 1731531449";
  const dob = student.dob || "2005-01-01";
  const department = student.department || "Computer Science";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-full mx-auto space-y-2"
    >
      {/* Profile Header */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-32 h-32 border-4 border-primary/20">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=student" />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-3xl font-bold gradient-text">
                {student.name}
              </h2>
              <p className="text-muted-foreground mt-1">
                {student.studentId
                  ? `Student ID: ${student.studentId}`
                  : "Student Account"}
              </p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                <Button variant="outline" size="sm">
                  Change Avatar
                </Button>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text">Profile Information</CardTitle>
          <CardDescription>
            Update your personal and contact details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  defaultValue={student.name}
                  className="bg-secondary/50"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={student.email}
                  className="bg-secondary/50"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  defaultValue={phone}
                  className="bg-secondary/50"
                />
              </div>

              {/* DOB */}
              <div className="space-y-2">
                <Label htmlFor="dob" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  type="date"
                  defaultValue={dob}
                  className="bg-secondary/50"
                />
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Department
                </Label>
                <Input
                  id="department"
                  defaultValue={department}
                  className="bg-secondary/50"
                />
              </div>

              {/* Student ID */}
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  defaultValue={student.studentId}
                  disabled
                  className="bg-secondary/50"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text">Student Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <div className="text-3xl font-bold text-primary">
                {student.totalCourses || 5}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Total Courses
              </div>
            </div>
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <div className="text-3xl font-bold text-primary">
                {student.examsTaken || 12}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Exams Taken
              </div>
            </div>
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <div className="text-3xl font-bold text-primary">
                {student.averageScore || 4.5}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Average Score
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
