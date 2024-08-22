import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import NewPost from "./pages/Post/NewPost.jsx";
import GoTop from "./components/GoTop.jsx";
import Post from "./pages/Post/Post.jsx";
import NotFound from "./pages/NotFound.jsx";
import "react-toastify/dist/ReactToastify.css";
import Posts from "./pages/Post/Posts.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EditPost from "./pages/Post/EditPost.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute RouteType={"public"}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="user/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="user/profile/:id" element={<Profile />} />
        <Route
          path="auth/register"
          element={
            <ProtectedRoute RouteType={"public"}>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="auth/login"
          element={
            <ProtectedRoute RouteType={"public"}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route path={"/"} element={<Posts />} />
        <Route
          path="posts/new"
          element={
            <ProtectedRoute>
              <NewPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="posts/:id/edit"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />
        <Route path="posts/:id" element={<Post />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <GoTop />
      <ToastContainer
        position={"bottom-right"}
        theme={"dark"}
        limit={4}
        newestOnTop={true}
        autoClose={2000}
      />
      <Footer />
    </>
  );
}
