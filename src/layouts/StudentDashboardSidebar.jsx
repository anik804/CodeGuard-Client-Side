import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  LogOut,
  UserCheck,
  GraduationCap
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { AuthContext } from "@/provider/AuthProvider";

const menuItems = [
  { title: "Overview", url: ".", icon: LayoutDashboard },
  { title: "Join Exam", url: "join-exam", icon: UserCheck },
  { title: "Profile", url: "stu-profile", icon: User },
];

export function StudentDashboardSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOutUser } = useContext(AuthContext);

  const isActive = (path) => {
    if (path === ".") return location.pathname.endsWith("/student-dashboard");
    return location.pathname.endsWith(path);
  };

  const handleLogout = async () => {
    await signOutUser();
    navigate("/"); // redirect to home after logout
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        {/* Header */}
        <div className="p-4 flex items-center gap-3 border-b border-border">
          <motion.div
            className="w-29 h-12 rounded-lg bg-primary/20 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <GraduationCap className="w-6 h-6 text-primary" />
          </motion.div>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-bold text-lg gradient-text">Code Guard</span>
              <span className="text-xs text-muted-foreground">Student Portal</span>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-3 w-full"
                      >
                        <item.icon className="w-5 h-5" />
                        {open && <span>{item.title}</span>}
                      </motion.div>
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
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
            {open && <span>Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
