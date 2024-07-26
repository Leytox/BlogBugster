import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Profile from "./pages/Profile.jsx";
import NewPost from "./pages/Post/NewPost.jsx";
import GoTop from "./components/GoTop.jsx";
import EditPost from "./pages/Post/EditPost.jsx";
import Post from "./pages/Post/Post.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        {/*{<Route path="/user/:username" element={<Profile />} />}*/}
        <Route path="/new-post" element={<NewPost />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <GoTop />
      <ToastContainer
        position={"bottom-right"}
        theme={"dark"}
        limit={4}
        newestOnTop={true}
      />
      <Footer />
    </>
  );
}
