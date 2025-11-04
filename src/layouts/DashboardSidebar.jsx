import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import {
  Clock,
  GraduationCap,
  History,
  LayoutDashboard,
  LogOut,
  Plus,
  User,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/provider/AuthProvider";

const menuItems = [
  { title: "Overview", url: ".", icon: LayoutDashboard },
  { title: "Create Exam Now", url: "create-exam", icon: Plus },
  { title: "Schedule Exam", url: "schedule-exam", icon: Clock },
  { title: "Exam History", url: "exam-history", icon: History },
  { title: "Profile", url: "profile", icon: User },
];

export function DashboardSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOutUser } = useContext(AuthContext);

  const isActive = (path) => {
    if (path === ".") return location.pathname.endsWith("/examiner-dashboard");
    return location.pathname.endsWith(path);
  };

  const handleLogout = async () => {
    await signOutUser();
    navigate("/"); // redirect to home
  };

  return (
    <Sidebar
      collapsible="icon"
      className="w-64 border-r border-border bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200"
    >
      <SidebarContent className="bg-gray-300">
        {/* Header */}
        <div className="p-4 flex items-center gap-3 border-b border-border">
          <motion.div
            className="w-10 h-10 rounded-lg bg-blue-200/40 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <GraduationCap className="w-6 h-6 text-blue-700" />
          </motion.div>

          {open && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-bold text-lg gradient-text">CodeGuard</span>
              <span className="text-xs text-muted-foreground">
                Teacher Portal
              </span>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                  >
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 w-full px-2 py-2 rounded-lg transition-colors duration-200 ${
                          isActive
                            ? "bg-blue-300 text-blue-900 font-semibold"
                            : "text-blue-800 hover:bg-blue-200/50 hover:text-blue-900"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        <div className="mt-auto p-4 border-t border-border">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-100"
          >
            <LogOut className="w-5 h-5" />
            {open && <span>Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
