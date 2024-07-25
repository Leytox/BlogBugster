import { Link, useLocation } from "react-router-dom";
import { selectUser, setUser } from "../features/auth/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../features/auth/authApiSlice.js";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
import SearchContainer from "./SearchContainer.jsx";

const Header = () => {
  const { user } = useSelector(selectUser);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const location = useLocation();
  let currentLocation;
  if (location.pathname === "/") currentLocation = "HOME";
  else {
    currentLocation = location.pathname.split("/");
    currentLocation = currentLocation[currentLocation.length - 1].toUpperCase();
    if (currentLocation.includes("-"))
      currentLocation = currentLocation.split("-").join(" ");
  }
  const handleLogout = async () => {
    const res = await logout();
    dispatch(setUser(null));
    toast.success(res.data.message);
  };
  return (
    <header
      className={
        "sticky z-50 top-0 w-full h-[80px] gradient flex flex-row justify-between gap-12 items-center px-8"
      }
    >
      <div className={"flex flex-row gap-12 items-center"}>
        <Link to={"/"}>
          <img src={logo} alt="logo" width={50} height={50} />
        </Link>
        <h1 className={"text-xl font-bold max-sm:hidden"}>{currentLocation}</h1>
      </div>
      <nav
        className={
          "flex flex-row justify-center items-center gap-4 font-normal"
        }
      >
        <SearchContainer />
        {user ? (
          <>
            <Link
              className={
                "uppercase hover:text-gray-300 hover:border-gray-300 flex justify-center items-center transition ease-in-out rounded-md border-[1px] border-white px-1 py-2"
              }
              to={"/new-post"}
            >
              New post
            </Link>
            <Link
              className={
                "uppercase hover:text-gray-300 hover:border-gray-300 transition ease-in-out"
              }
              to={"/profile"}
            >
              {user.name}
            </Link>
            <Link
              className={
                "uppercase hover:text-gray-300 hover:border-gray-300 transition ease-in-out"
              }
              to={"/"}
              onClick={handleLogout}
            >
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link
              className={
                "uppercase hover:text-gray-300 hover:border-gray-300 transition ease-in-out"
              }
              to={"/login"}
            >
              Login
            </Link>
            <Link
              className={
                "uppercase hover:text-gray-300 hover:border-gray-300 transition ease-in-out rounded-md border-[1px] border-white px-4 py-2"
              }
              to={"/register"}
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
