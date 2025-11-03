import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-40">
          <DashboardSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1  ml-20 transition-all duration-300 md:ml-[170px]">
          <div className="p-6">
            {/* <SidebarTrigger className="mb-4" /> */}
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
