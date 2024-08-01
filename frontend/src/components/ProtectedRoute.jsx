import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser } from "../features/auth/authSlice.js";

const ProtectedRoute = ({ children, RouteType }) => {
  const { user } = useSelector(selectUser);
  switch (RouteType) {
    case "private":
      if (!user) return <Navigate to="/login" />;
      break;
    case "public":
      if (user) return <Navigate to="/user/dashboard" />;
      break;
    case "admin":
      if (!user) return <Navigate to="/" />;
      else if (user.role !== "admin") return <Navigate to="/user/dashboard" />;
      break;
    default:
      break;
  }
  return children;
};

export default ProtectedRoute;
