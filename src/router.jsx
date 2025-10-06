// // src/router.jsx



import { createBrowserRouter } from "react-router";
// import Homelayout from "../layouts/Homelayout";
// import Home from "../pages/Home/Home";
// import Login from "../pages/Authentication/Login";
// import Register from "../pages/Authentication/Register";
// import DashboardLayout from "../layouts/Dashboardlayout";
// import PrivateRoute from "../provider/PrivateRoute";
// import ErrorPage from "../components/ErrorPage";
 import AuthLayout from "./layouts/AuthLayout";
import App from "./App";
import Home from "./pages/Home";
import Login from "./components/Login";
import { ExaminerDashboardContent } from "./pages/ExaminerDashboard";
import MonitoringDashboardPage from "./pages/MonitoringDashboard";
import { StudentDashboardContent } from "./pages/StudentDashboard";
// import RegisterForm from "./components/Register";
// import Register from "./components/Register";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,

    children: [
      {
        index: true,

        //path: "home",
        element: <Home></Home>,
      }
      
    ],
  },

  {
    path: "/auth",
    element: <AuthLayout></AuthLayout>,
    children: [
      {
        path: "/auth/login",
        element: <Login></Login>,
      },

      // {
      //   path: "/auth/register",
      //   element: <Register></Register>,
      // },
    ],
  },

  // {
  //   path: "/dashboard",
  //   element: (
  //     <PrivateRoute>
  //       <DashboardLayout></DashboardLayout>
  //     </PrivateRoute>
  //   ),
  //   children: [
      

     
  //   ],
  // },
  {
    path: "/examiner-dashboard",
    element: (
      
        <ExaminerDashboardContent></ExaminerDashboardContent>
      
    ),
    children: [
      

     
    ],
  },

  {
    path: "/monitoring/:roomId",
    element: (
      
        <MonitoringDashboardPage />
      
    ),
  },
  {
    path: "/student-join",
    element: (
      
        <StudentDashboardContent />
      
    ),
  },


  // {
  //   path: "/*",
  //   element: <ErrorPage></ErrorPage>,
  // },
]);

export default router;

// // Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
