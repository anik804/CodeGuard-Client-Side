import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "./AuthProvider";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { loading } = useContext(AuthContext);
  const location = useLocation();

  const storedRole = sessionStorage.getItem("role");

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen gap-2">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );

  if (storedRole && (!allowedRoles || allowedRoles.includes(storedRole))) {
    return children;
  }

  return <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
