import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { StudentDashboardSidebar } from "./StudentDashboardSidebar";

function LayoutContent({ children }) {
  const { open } = useSidebar();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedStudentId = sessionStorage.getItem("studentId");
    if (storedStudentId) {
      fetchStudentInfo(storedStudentId);
    } else {
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
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40">
        <StudentDashboardSidebar />
      </div>

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          open ? "ml-64" : "ml-20"
        }`}
      >
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="h-20 sm:h-24 border-b border-indigo-100 bg-white/70 backdrop-blur-md shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-8 py-4 sm:py-0 sticky top-0 z-20"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-black">
              Student Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              Welcome back,{" "}
              <span className="text-black font-semibold">
                {student?.name || "Student"}
              </span>{" "}
              👋
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mt-2 sm:mt-0 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm shadow-md"
          >
            ID: {student?.studentId || "—"}
          </motion.div>
        </motion.header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className=""
          >
            <Outlet context={{ student }} />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export function StudentDashboardLayout() {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
}
