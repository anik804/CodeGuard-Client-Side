import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function LayoutContent({ children }) {
  const { open, setOpen } = useSidebar();

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40">
        <DashboardSidebar />
      </div>

      {/* Collapsible Toggle Button */}
      {/* <div className="fixed top-6 left-4 z-50">
        <AnimatePresence>
          <motion.button
            key={open ? "close" : "open"}
            onClick={() => setOpen(!open)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-black text-white shadow-lg flex items-center justify-center"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </AnimatePresence>
      </div> */}

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          open ? "ml-64" : "ml-20"
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

export function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
