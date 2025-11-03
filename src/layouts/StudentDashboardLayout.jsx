import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useState, useEffect } from "react";
import { StudentDashboardSidebar } from "./StudentDashboardSidebar";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

export function StudentDashboardLayout() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-indigo-600">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading Student Dashboard...
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <StudentDashboardSidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="h-20 border-b border-indigo-100 bg-white/70 backdrop-blur-md shadow-sm flex items-center justify-between px-8 sticky top-0 z-20"
          >
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Student Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back,{" "}
                <span className="text-indigo-600 font-semibold">
                  {student?.name || "Student"}
                </span>{" "}
                👋
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm shadow-md"
            >
              ID: {student?.studentId || "—"}
            </motion.div>
          </motion.header>

          {/* Content */}
          <div className="flex-1 p-8 overflow-auto min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-sm p-6 border border-indigo-100"
            >
              <Outlet context={{ student }} />
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}



// import { SidebarProvider } from "@/components/ui/sidebar";
// import React, { useState } from "react";
// import { StudentDashboardSidebar } from "./StudentDashboardSidebar";
// import { motion } from "framer-motion";
// import { Outlet } from "react-router-dom";

// export function StudentDashboardLayout() {
//   const [studentName, setStudentName] = useState("Anik");

//   return (
//     <SidebarProvider defaultOpen>
//       <div className="min-h-screen flex w-full">
//         {/* Sidebar */}
//         <div className="w-64 flex-shrink-0">
//           <StudentDashboardSidebar />
//         </div>

//         {/* Main content */}
//         <main className="flex-1 flex flex-col min-w-0">
//           {/* Header */}
//           <header className="h-16 border-b border-border flex items-center px-6 gap-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
//             <div className="flex items-center gap-2">
//               <h1 className="text-xl font-semibold">Student Dashboard</h1>
//               <span className="text-sm text-muted-foreground">
//                 • Welcome back, <span className="text-primary font-medium">{studentName}</span>!
//               </span>
//             </div>
//           </header>

//           {/* Content */}
//           <div className="flex-1 p-6 overflow-auto min-w-0">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               {/* Outlet renders nested routes */}
//               <Outlet context={{ setStudentName }} />
//             </motion.div>
//           </div>
//         </main>
//       </div>
//     </SidebarProvider>
//   );
// }
