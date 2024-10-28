import { Link, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setLocation } from "../../features/location/locationSlice.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faChartLine,
  faChevronLeft,
  faChevronRight,
  faCircleInfo,
  faGears,
  faScroll,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { selectUser } from "../../features/auth/authSlice.js";
import { useGetServerInfoQuery } from "../../features/server/serverApiSlice.js";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const user = useSelector(selectUser);
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop();

  const { isLoading, isError, fulfilledTimeStamp, startedTimeStamp } =
    useGetServerInfoQuery();
  return (
    <div
      className={`${isOpen ? "w-64" : "w-20"} bg-gray-800 text-white flex flex-col justify-between transition-all duration-300 relative`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-2 top-24 bg-gray-900 rounded-full px-1 py-24 hover:bg-gray-700"
      >
        <FontAwesomeIcon
          icon={isOpen ? faChevronLeft : faChevronRight}
          size="sm"
        />
      </button>

      <nav className="h-full flex flex-col justify-between p-4">
        <div>
          <div className="mb-8 flex items-center">
            <div className={"flex items-center gap-2"}>
              <div className="rounded-full gradient w-12 h-12 flex items-center justify-center">
                {user.user.name.slice(0, 2).toUpperCase()}
              </div>
              {isOpen && (
                <span className="ml-4 font-bold text-xl">{user.user.name}</span>
              )}
            </div>
          </div>

          <ul className="flex flex-col gap-4">
            {[
              { to: "overview", icon: faChartLine, label: "Overview" },
              { to: "users", icon: faUsers, label: "Users" },
              { to: "posts", icon: faScroll, label: "Posts" },
              { to: "bans", icon: faBan, label: "Bans" },
              { to: "settings", icon: faGears, label: "Settings" },
            ].map(({ to, icon, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`p-3 rounded-lg flex items-center transition-colors group relative
                    ${
                      currentPath === to
                        ? "bg-gray-700 text-white"
                        : "hover:bg-gray-700"
                    }`}
                >
                  <FontAwesomeIcon icon={icon} />
                  {isOpen && <span className="ml-3">{label}</span>}
                  {!isOpen && (
                    <div className="absolute left-14 bg-gray-900 text-white px-2 py-1 rounded invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all">
                      {label}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div>
        {!isError && (
          <div>
            <div className="absolute bottom-0 w-full">
              <div className="flex flex-col justify-center items-center gap-2 p-2 bg-gray-900 text-center">
                <div>
                  <span className="text-sm">Status: </span>
                  <span className="text-sm">
                    {isLoading
                      ? "Loading..."
                      : fulfilledTimeStamp > startedTimeStamp
                        ? "Online"
                        : "Offline"}
                  </span>
                </div>
                <span className="text-sm">
                  Response: {fulfilledTimeStamp - startedTimeStamp}ms{" "}
                  <FontAwesomeIcon
                    icon={faCircleInfo}
                    title={import.meta.env.VITE_BACKEND_URI}
                    className={"cursor-help hover:text-gray-400"}
                  />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLocation("Dashboard"));
  }, [dispatch]);

  return (
    <div className="min-h-[calc(100vh-80px)] flex">
      <Sidebar />
      <main className="flex-1 p-4 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
