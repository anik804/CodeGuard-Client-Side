// import { NavLink, useNavigate, useLocation } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   LayoutDashboard,
//   User,
//   LogOut,
//   UserCheck,
//   GraduationCap
// } from "lucide-react";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import { Button } from "@/components/ui/button";
// import { useContext } from "react";
// import { AuthContext } from "@/provider/AuthProvider";

// const menuItems = [
//   { title: "Overview", url: ".", icon: LayoutDashboard },
//   { title: "Join Exam", url: "join-exam", icon: UserCheck },
//   { title: "Profile", url: "stu-profile", icon: User },
// ];

// export function StudentDashboardSidebar() {
//   const { open } = useSidebar();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { signOutUser } = useContext(AuthContext);

//   const isActive = (path) => {
//     if (path === ".") return location.pathname.endsWith("/student-dashboard");
//     return location.pathname.endsWith(path);
//   };

//   const handleLogout = async () => {
//     await signOutUser();
//     navigate("/"); // redirect to home after logout
//   };

//   return (
//     <Sidebar collapsible="icon" className="border-r border-border">
//       <SidebarContent>
//         {/* Header */}
//         <div className="py-4 px-7 flex items-center gap-3 border-b border-border">
//           <motion.div
//             className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center"
//             whileHover={{ scale: 1.05 }}
//           >
//             <GraduationCap className="w-6 h-6 text-primary" />
//           </motion.div>
//           {open && (
//             <motion.div
//               initial={{ opacity: 0, x: -10 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="flex flex-col"
//             >
//               <span className="font-bold text-lg gradient-text">Code Guard</span>
//               <span className="text-xs text-muted-foreground">Student Portal</span>
//             </motion.div>
//           )}
//         </div>

//         {/* Navigation */}
//         <SidebarGroup>
//           <SidebarGroupLabel>Navigation</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {menuItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild isActive={isActive(item.url)}>
//                     <NavLink to={item.url}>
//                       <motion.div
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         className="flex items-center gap-3 w-full"
//                       >
//                         <item.icon className="w-5 h-5" />
//                         {open && <span>{item.title}</span>}
//                       </motion.div>
//                     </NavLink>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         {/* Logout */}
//         <div className="mt-auto p-4 border-t border-border">
//           <Button
//             onClick={handleLogout}
//             variant="ghost"
//             className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
//           >
//             <LogOut className="w-5 h-5" />
//             {open && <span>Logout</span>}
//           </Button>
//         </div>
//       </SidebarContent>
//     </Sidebar>
//   );
// }



import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, User, LogOut, UserCheck, GraduationCap } from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { AuthContext } from "@/provider/AuthProvider";
import { GiExpander } from "react-icons/gi";
import { GoSidebarCollapse } from "react-icons/go";

const menuItems = [
  { title: "Overview", url: ".", icon: LayoutDashboard },
  { title: "Join Exam", url: "join-exam", icon: UserCheck },
  { title: "Profile", url: "stu-profile", icon: User },
];

export function StudentDashboardSidebar() {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOutUser } = useContext(AuthContext);

  const isActive = (path) => {
    if (path === ".") return location.pathname.endsWith("/student-dashboard");
    return location.pathname.endsWith(path);
  };

  const handleLogout = async () => {
    await signOutUser();
    navigate("/");
  };

  const sidebarVariants = {
    open: { width: 256, transition: { duration: 0.3 } },
    closed: { width: 80, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={sidebarVariants}
      animate={open ? "open" : "closed"}
      className="fixed inset-y-0 left-0 z-40 bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 border-r border-border flex flex-col justify-between overflow-hidden"
    >
      <SidebarContent className="flex flex-col justify-between h-full bg-transparent">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-border relative">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-lg bg-blue-200/40 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <GraduationCap className="w-6 h-6 text-blue-700" />
            </motion.div>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col"
                >
                  <span className="font-bold text-lg gradient-text">CodeGuard</span>
                  <span className="text-xs text-muted-foreground">Student Portal</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Collapse button at top-right when expanded */}
          {open && (
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <GoSidebarCollapse className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup className="flex-1 overflow-y-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
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
                      <AnimatePresence>
                        {open && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                          >
                            {item.title}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom actions */}
        <div className="p-4 flex flex-col gap-2 border-t border-border">
          {/* Expand button at bottom when collapsed */}
          {!open && (
            <Button
              variant="outline"
              onClick={() => setOpen(true)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 w-full flex justify-center"
            >
              <GiExpander className="w-5 h-5" />
            </Button>
          )}

          {/* Logout */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-100"
          >
            <LogOut className="w-5 h-5" />
            <AnimatePresence>
              {open && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </SidebarContent>
    </motion.div>
  );
}
