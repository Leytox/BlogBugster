import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../features/auth/authApiSlice.js";
import { selectUser, setUser } from "../features/auth/authSlice.js";
import { selectLocation } from "../features/location/locationSlice.js";
import { toast } from "react-toastify";
import logo from "/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faPlus,
  faSignOut,
  faUser,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";
import SearchContainer from "./SearchContainer.jsx";

const Header = () => {
  const [position, setPosition] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useSelector(selectUser);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const { location } = useSelector(selectLocation);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await logout();
    dispatch(setUser(null));
    toast.success(res.data.message);
    return navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      let moving = window.scrollY;
      setVisible(position > moving);
      setPosition(moving);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [position]);

  return (
    <header
      className={`${visible ? "top-0" : "-top-24"} transition-all duration-300 sticky z-50 w-full h-[80px] gradient flex flex-row justify-between gap-12 items-center px-32 max-lg:px-6`}
    >
      <div className={"flex flex-row gap-12 items-center"}>
        <Link to={"/"}>
          <img src={logo} alt="logo" width={48} height={48} />
        </Link>
        <h1 className={"text-xl font-bold max-md:hidden uppercase"}>
          {location}
        </h1>
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
                "gap-2 uppercase hover:text-gray-300 hover:border-gray-300 flex text-center justify-center items-center transition ease-in-out rounded-md border-[1px] border-white px-2 py-2"
              }
              to={"/posts/new"}
            >
              New post <FontAwesomeIcon icon={faPlus} />
            </Link>
            {user.isAdmin && (
              <Link
                className={
                  "gap-2 uppercase hover:text-gray-300 hover:border-gray-300 flex text-center justify-center items-center transition ease-in-out rounded-md border-[1px] border-white px-2 py-2"
                }
                to={"/admin"}
              >
                Dashboard <FontAwesomeIcon icon={faUserGear} />
              </Link>
            )}
            <div
              className={
                "cursor-pointer uppercase hover:text-gray-300 hover:border-gray-300 transition ease-in-out"
              }
              onClick={() => setMenuVisible(!menuVisible)}
            >
              <img
                src={import.meta.env.VITE_BACKEND_URI + "/" + user?.avatar}
                alt={"avatar"}
                width={40}
                height={40}
                className={"rounded-full aspect-square object-cover bg-white"}
              />
              {menuVisible && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                  <Link
                    to={`/user/${user.id}`}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faUser} /> PROFILE
                  </Link>
                  <Link
                    to={`/user/${user.id}/settings`}
                    className={
                      "block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    <FontAwesomeIcon icon={faGear} /> SETTINGS
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faSignOut} /> LOGOUT
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              className={
                "uppercase hover:text-gray-300 hover:border-gray-300 transition ease-in-out"
              }
              to={"/auth/login"}
            >
              Login
            </Link>
            <Link
              className={
                "uppercase hover:text-gray-300 hover:border-gray-300 transition ease-in-out rounded-md border-[1px] border-white px-4 py-2"
              }
              to={"/auth/register"}
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
