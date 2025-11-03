import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUserGraduate } from "react-icons/fa";
import axios from "axios";

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
      const res = await axios.get(`http://localhost:3000/api/students/${studentId}`);
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
        <span className="loading loading-spinner loading-lg text-indigo-500"></span>
      </div>
    );

  if (!student)
    return (
      <div className="text-center mt-10 text-gray-500 font-medium">
        No student data found. please log in again.
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-6 mt-6 border border-indigo-100"
    >
      <div className="flex flex-col items-center gap-4">
        <FaUserGraduate className="text-6xl text-indigo-500" />
        <h2 className="text-2xl font-bold bg-black bg-clip-text text-transparent">
          {student.name}
        </h2>
        <p className="text-gray-500">{student.email}</p>
        <div className="divider w-2/3 mx-auto"></div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <InfoCard label="Student ID" value={student.studentId} />
        <InfoCard label="Section" value={student.section} />
        <InfoCard label="Role" value={student.role} />
      </div>
    </motion.div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 shadow-sm hover:shadow-md transition">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-lg font-semibold text-indigo-700 break-words">{value}</p>
    </div>
  );
}

// update student profile page


// import { motion } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { User, Mail, Phone, Calendar, Save } from "lucide-react";

// export default function StudentProfile() {
//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <h1 className="text-3xl font-bold gradient-text mb-2">
//           Student Profile
//         </h1>
//         <p className="text-muted-foreground">
//           Manage your personal information
//         </p>
//       </motion.div>

//       {/* Profile Form */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.1 }}
//       >
//         <Card className="glass-card shadow-lg border border-border">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <User className="w-5 h-5 text-primary" />
//               Personal Information
//             </CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-6">
//             <div className="grid gap-6 md:grid-cols-2">
//               {/* Full Name */}
//               <div className="space-y-2">
//                 <Label htmlFor="fullName">Full Name</Label>
//                 <Input
//                   id="fullName"
//                   placeholder="John Doe"
//                   defaultValue="John Doe"
//                   className="bg-secondary/50"
//                 />
//               </div>

//               {/* Student ID */}
//               <div className="space-y-2">
//                 <Label htmlFor="studentId">Student ID</Label>
//                 <Input
//                   id="studentId"
//                   placeholder="STU-2024-001"
//                   defaultValue="STU-2024-001"
//                   disabled
//                   className="bg-secondary/50"
//                 />
//               </div>

//               {/* Email */}
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="flex items-center gap-2">
//                   <Mail className="w-4 h-4" />
//                   Email
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="john.doe@example.com"
//                   defaultValue="john.doe@example.com"
//                   className="bg-secondary/50"
//                 />
//               </div>

//               {/* Phone */}
//               <div className="space-y-2">
//                 <Label htmlFor="phone" className="flex items-center gap-2">
//                   <Phone className="w-4 h-4" />
//                   Phone
//                 </Label>
//                 <Input
//                   id="phone"
//                   type="tel"
//                   placeholder="+1 234 567 8900"
//                   defaultValue="+1 234 567 8900"
//                   className="bg-secondary/50"
//                 />
//               </div>

//               {/* DOB */}
//               <div className="space-y-2">
//                 <Label htmlFor="dob" className="flex items-center gap-2">
//                   <Calendar className="w-4 h-4" />
//                   Date of Birth
//                 </Label>
//                 <Input
//                   id="dob"
//                   type="date"
//                   defaultValue="2000-01-15"
//                   className="bg-secondary/50"
//                 />
//               </div>

//               {/* Department */}
//               <div className="space-y-2">
//                 <Label htmlFor="department">Department</Label>
//                 <Input
//                   id="department"
//                   placeholder="Computer Science"
//                   defaultValue="Computer Science"
//                   className="bg-secondary/50"
//                 />
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="pt-4 flex justify-end gap-3">
//               <Button variant="outline" className="w-24">
//                 Cancel
//               </Button>
//               <Button className="gap-2 w-32">
//                 <Save className="w-4 h-4" />
//                 Save Changes
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }
