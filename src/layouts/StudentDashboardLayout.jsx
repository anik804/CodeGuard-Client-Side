import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useState } from "react";
import { StudentDashboardSidebar } from "./StudentDashboardSidebar";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";

export function StudentDashboardLayout() {
  const [studentName, setStudentName] = useState("Anik");

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <StudentDashboardSidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 border-b border-border flex items-center px-6 gap-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Student Dashboard</h1>
              <span className="text-sm text-muted-foreground">
                • Welcome back, <span className="text-primary font-medium">{studentName}</span>!
              </span>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-6 overflow-auto min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Outlet renders nested routes */}
              <Outlet context={{ setStudentName }} />
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
