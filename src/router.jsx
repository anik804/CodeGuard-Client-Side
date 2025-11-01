// import { createBrowserRouter } from "react-router";
// import AuthLayout from "./layouts/AuthLayout";
// import App from "./App";
// import Home from "./pages/Home";
// import Login from "./components/Login";
// import { ExaminerDashboardContent } from "./pages/ExaminerDashboard";
// import MonitoringDashboardPage from "./pages/MonitoringDashboard";
// import { StudentDashboardContent } from "./pages/StudentDashboard";
// import PrivateRoute from "./provider/PrivateRoute";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       {
//         index: true,
//         element: <Home />,
//       },
//     ],
//   },
//   {
//     path: "/auth",
//     element: <AuthLayout />,
//     children: [
//       {
//         path: "/auth/login",
//         element: <Login />,
//       },
//     ],
//   },
//   {
//     path: "/examiner-dashboard",
//     element: (
//       <PrivateRoute allowedRoles={["examiner"]}>
//         <ExaminerDashboardContent />
//       </PrivateRoute>
//     ),
//   },
//   {
//     path: "/student-dashboard",
//     element: (
//       <PrivateRoute allowedRoles={["student"]}>
//         <StudentDashboardContent />
//       </PrivateRoute>
//     ),
//   },
//   {
//     path: "/monitoring/:roomId",
//     element: (
//       <PrivateRoute allowedRoles={["examiner"]}>
//         <MonitoringDashboardPage />
//       </PrivateRoute>
//     ),
//   },
// ]);

// export default router;


import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./components/Login";
import AuthLayout from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashBoardLayout";
import { StudentDashboardLayout } from "./layouts/StudentDashboardLayout";
// import CreateExamPage from "./pages/CreateExam";
import Dashboard from "./pages/DashBoard";
import ExamHistoryPage from "./pages/ExamHistory";
import Home from "./pages/Home";
import MonitoringDashboardPage from "./pages/MonitoringDashboard";
import ScheduleExamPage from "./pages/ScheduleExam";
// import { StudentDashboardContent } from "./pages/StudentDashboard";
import PrivateRoute from "./provider/PrivateRoute";
import { Outlet } from "react-router";
import Profile from "./pages/Profile";
import { ExaminerDashboardContent } from "./pages/ExaminerDashboard";
import StudentDashboard2 from "./pages/StudentDashboard2";
import JoinExam from "./pages/JoinExam";
import StudentProfile from "./pages/StudentProfile";
// import JoinExam from "./pages/JoinExam";
// import StudentProfile from "./pages/StudentProfile";
// import StudentProfile from "./pages/StudentProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "/auth/login",
        element: <Login />,
      },
    ],
  },

  // Examiner Dashboard and Nested Pages
  {
    path: "/examiner-dashboard",
    element: (
      <PrivateRoute allowedRoles={["examiner"]}>
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Dashboard></Dashboard> }, // Dashboard Overview
      { path: "create-exam", element: <ExaminerDashboardContent></ExaminerDashboardContent> },
      { path: "schedule-exam", element: <ScheduleExamPage /> },
      { path: "exam-history", element: <ExamHistoryPage /> },
      { path: "profile" , element: <Profile></Profile>}
    ],
  },
  // Student Dashboard
  {
    path: "/student-dashboard",
    element: (
      <PrivateRoute allowedRoles={["student"]}>
        <StudentDashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <StudentDashboard2 /> }, // Overview
      { path: "join-exam", element: <JoinExam /> },
      { path: "stu-profile", element: <StudentProfile /> },
    ],
  },
  // Monitoring page (examiner only)
    {
    path: "/monitoring/:roomId",
    element: (
      <PrivateRoute allowedRoles={["examiner"]}>
        <DashboardLayout>
          <MonitoringDashboardPage />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
]);

export default router;
