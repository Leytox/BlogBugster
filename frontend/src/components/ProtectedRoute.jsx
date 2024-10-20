import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser } from "../features/auth/authSlice.js";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, RouteType }) => {
  const { user } = useSelector(selectUser);
  switch (RouteType) {
    case "private":
      if (!user) return <Navigate to="/auth/login" />;
      break;
    case "public":
      if (user)
        return (
          <Navigate
            to={`/posts?page=1&category=all&sortOrder=new&searchTerm=`}
          />
        );
      break;
    case "admin":
      if (!user) return <Navigate to="/" />;
      else if (!user.isAdmin)
        return (
          <Navigate to="/posts?page=1&category=all&sortOrder=new&searchTerm=" />
        );
      break;
    default:
      break;
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  RouteType: PropTypes.oneOf(["private", "public", "admin"]),
};

export default ProtectedRoute;
