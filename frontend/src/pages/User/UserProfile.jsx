import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../../features/location/locationSlice.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader.jsx";
import { useGetUserQuery } from "../../features/users/usersApiSlice.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faBan,
  faBell,
  faCircleInfo,
  faClipboard,
  faDashboard,
  faGear,
  faPencil,
  faPeopleGroup,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { selectUser } from "../../features/auth/authSlice.js";
import UserPosts from "./UserPosts.jsx";
import AdditionalInfoWindow from "../../components/AdditionalInfoWindow.jsx";
import { copyToClipboard } from "../../services/index.js";
import UserAbout from "./UserAbout.jsx";

const UserProfile = () => {
  const [tab, setTab] = useState("Posts");
  const [searchActive, setSearchActive] = useState(false);
  const [additionalInfoVisible, setAdditionalInfoVisible] = useState(false);
  const [about, setAbout] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data, error, isLoading, refetch } = useGetUserQuery(id);
  const { user } = useSelector(selectUser);

  useEffect(() => {
    dispatch(setLocation("Profile"));
    if (error) navigate("/not-found");
  }, [dispatch, error, navigate]);

  useEffect(() => {
    refetch();
  }, [id, refetch]);

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );

  return (
    <main className="min-h-screen py-8 px-32 max-sm:px-2 max-sm:py-2 max-md:px-20 max-lg:px-24 max-xl:px-28">
      {additionalInfoVisible && (
        <AdditionalInfoWindow
          setIsAdditionalInfoWindowShown={setAdditionalInfoVisible}
          user={data.user}
        />
      )}
      <div className={"flex justify-between pb-4 max-sm:w-full"}>
        <div className="flex flex-col gap-6 max-sm:w-full">
          <div className={"flex gap-6 items-center max-sm:justify-center"}>
            <img
              src={import.meta.env.VITE_BACKEND_URI + "/" + data.user.avatar}
              alt={`${data.user.name}'s avatar`}
              className="w-48 h-48 max-sm:w-32 max-sm:h-32 rounded-full aspect-square object-cover bg-white"
            />
            <div className={"flex flex-col gap-1"}>
              <h1 className="text-4xl font-bold mt-4">{data.user.name}</h1>
              <div
                className={"flex gap-1 text-gray-600 text-lg max-sm:text-sm"}
              >
                <p
                  onClick={() => copyToClipboard(id)}
                  className={"cursor-pointer hover:underline"}
                >
                  <FontAwesomeIcon icon={faClipboard} /> Copy ID
                </p>
                ·
                <p>
                  <FontAwesomeIcon icon={faPeopleGroup} />{" "}
                  {data.user.subscribers} Subscriber
                  {data.user.subscribers > 1 || data.user.subscribers === 0
                    ? "s"
                    : ""}
                </p>
              </div>
              <h2
                className={
                  "text-lg italic text-gray-600 hover:cursor-pointer hover:text-gray-700 w-fit hover:underline"
                }
                onClick={() => setAdditionalInfoVisible(true)}
              >
                <FontAwesomeIcon icon={faCircleInfo} /> More info...
              </h2>
              {user?.id.toString() !== id ? (
                <button className="gradient text-white px-4 py-2 rounded-md hover:text-gray-200 transition-colors max-sm:hidden">
                  Subscribe <FontAwesomeIcon icon={faBell} />
                </button>
              ) : (
                <div className={"flex gap-4 max-sm:text-sm"}>
                  <Link to={`/user/dashboard`}>
                    <button className={"btn-gradient rounded-xl py-0"}>
                      <FontAwesomeIcon icon={faDashboard} /> Dashboard
                    </button>
                  </Link>
                  <Link to={`/user/${id}/settings`} className={"w-fit"}>
                    <button className={"btn-gradient rounded-xl py-0"}>
                      <FontAwesomeIcon icon={faGear} /> Settings
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          {user?.id.toString() !== id && (
            <button className="gradient text-white text-xl py-4 rounded-md hover:text-gray-200 transition-colors sm:hidden">
              Subscribe <FontAwesomeIcon icon={faBell} />
            </button>
          )}
          {data.user.ban.status && (
            <p className="text-lg text-red-600 mt-4">
              <FontAwesomeIcon icon={faBan} /> Banned: {data.user.ban.date}
            </p>
          )}
        </div>
      </div>
      <div
        className={
          "flex items-start gap-6 max-sm:justify-center font-oswald uppercase max-sm:text-sm max-sm:gap-4"
        }
      >
        <h2
          className={`text-lg font-semibold text-center border-b-4 transition-all duration-100 hover:border-b-gray-500 hover:cursor-pointer
           ${tab === "Posts" ? "border-b-gray-700 text-black hover:border-b-gray-900" : "border-b-transparent text-gray-500"}`}
          onClick={() => {
            setTab("Posts");
            setSearchActive(false);
          }}
        >
          <FontAwesomeIcon icon={faPencil} /> Posts
        </h2>
        <h2
          className={`text-lg font-semibold text-center border-b-4 transition-all duration-100 hover:border-b-gray-500 hover:cursor-pointer
           ${tab === "About" ? "border-b-gray-700 hover:border-b-gray-900 text-black" : "border-b-transparent text-gray-500"}`}
          onClick={() => {
            setTab("About");
            setSearchActive(false);
          }}
        >
          <FontAwesomeIcon icon={faAddressCard} /> About
        </h2>
        <div className={"flex gap-2"}>
          <h2
            className={`text-xl font-bold text-center border-b-4 transition-all duration-100 hover:border-b-gray-500 hover:cursor-pointer
             ${searchActive ? "border-b-gray-700 hover:border-b-gray-900 text-black" : "border-b-transparent text-gray-500"}`}
            onClick={() => {
              setSearchActive(true);
            }}
          >
            <FontAwesomeIcon icon={faSearch} />
          </h2>
          {searchActive && (
            <input
              type="text"
              className={
                "mt-1 outline outline-0 bg-transparent text-black border-b-2 border-b-gray-700 w-64 px-2 max-sm:w-32 max-sm:px-1"
              }
              placeholder={"Search posts..."}
              autoFocus={true}
            />
          )}
        </div>
      </div>
      <hr className={"border-gray-300"} />
      <div>{tab === "Posts" && <UserPosts userid={id} />}</div>
      <div>
        {tab === "About" && (
          <UserAbout about={about || data.user.about} setAbout={setAbout} />
        )}
      </div>
    </main>
  );
};

export default UserProfile;
