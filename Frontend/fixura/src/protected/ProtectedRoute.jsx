import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, role = "user" }) => {
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);
  const location = useLocation();
  
  const [wasAuthenticated, setWasAuthenticated] = useState(isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) setWasAuthenticated(true);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    if (wasAuthenticated) {
      toast.error("Please log in to access this page");
    }
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (role === "admin" && !isAdmin) {
    toast.error("You do not have permission to access this page");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
