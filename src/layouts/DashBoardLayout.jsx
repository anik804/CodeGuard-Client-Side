import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

function LayoutContent({ children }) {
  const { open } = useSidebar();

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40">
        <DashboardSidebar />
      </div>

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
