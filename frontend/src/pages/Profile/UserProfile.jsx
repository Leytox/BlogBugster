import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setLocation} from "../../features/location/locationSlice.js";
import {Link, useNavigate, useParams} from "react-router-dom";
import Loader from "../../components/Loader.jsx";
import {useGetUserQuery} from "../../features/users/usersApiSlice.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faBan,
  faBell,
  faClipboard,
  faDashboard,
  faGear,
  faPencil,
  faPeopleGroup,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import {selectUser} from "../../features/auth/authSlice.js";
import UserPosts from "./UserPosts.jsx";
import AdditionalInfoWindow from "../../components/AdditionalInfoWindow.jsx";
import {copyToClipboard} from "../../services/index.js";
import UserAbout from "./UserAbout.jsx";

const UserProfile = () => {
  const [tab, setTab] = useState("Posts");
  const [searchActive, setSearchActive] = useState(false);
  const [additionalInfoVisible, setAdditionalInfoVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id} = useParams();
  const {data, error, isLoading, refetch} = useGetUserQuery(id);
  const {user} = useSelector(selectUser);

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
          <Loader/>
        </div>
    );

  return (
      <main className="min-h-screen py-8 px-32 max-sm:p-0 max-md:px-20 max-lg:px-24 max-xl:px-28">
        {additionalInfoVisible && (
            <AdditionalInfoWindow
                setIsAdditionalInfoWindowShown={setAdditionalInfoVisible}
                user={data.user}
            />
        )}
        <div className={"flex justify-between p-6 max-sm:w-full"}>
          <div className="flex flex-col gap-6 max-sm:w-full">
            <div className={"flex gap-6 items-center max-sm:justify-center"}>
              <img
                  src={import.meta.env.VITE_BACKEND_URI + "/" + data.user.avatar}
                  alt={`${data.user.name}'s avatar`}
                  className="w-48 h-48 max-sm:w-32 max-sm:h-32 rounded-full bg-white"
              />
              <div className={"flex flex-col gap-1"}>
                <h1 className="text-4xl font-bold mt-4">{data.user.name}</h1>
                <div className={"flex gap-2 text-gray-600 text-lg"}>
                  <p
                      onClick={() => copyToClipboard(id)}
                      className={"cursor-pointer hover:underline"}
                  >
                    <FontAwesomeIcon icon={faClipboard}/> Copy ID
                  </p>
                  ·
                  <p>
                    <FontAwesomeIcon icon={faPeopleGroup}/>{" "}
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
                  More info...
                </h2>
                {user?.id.toString() !== id ? (
                    <button
                        className="gradient text-white px-4 py-2 rounded-md hover:text-gray-200 transition-colors max-sm:hidden">
                      Subscribe <FontAwesomeIcon icon={faBell}/>
                    </button>
                ) : (
                    <Link to={`/user/dashboard`} className={"w-fit"}>
                      <button className={"btn-gradient"}>
                        <FontAwesomeIcon icon={faDashboard}/> Dashboard
                      </button>
                    </Link>
                )}
              </div>
            </div>
            {user?.id.toString() !== id && (
                <button
                    className="gradient text-white text-xl py-4 rounded-md hover:text-gray-200 transition-colors sm:hidden">
                  Subscribe <FontAwesomeIcon icon={faBell}/>
                </button>
            )}
            {data.user.ban.status && (
                <p className="text-lg text-red-600 mt-4">
                  <FontAwesomeIcon icon={faBan}/> Banned: {data.user.ban.date}
                </p>
            )}
          </div>
          {user && user?.id.toString() === id && (
              <Link
                  to={`/user/${id}/preferences`}
                  className={
                    "max-md:hidden text-gray-600 hover:text-gray-700 transition-colors"
                  }
              >
                <FontAwesomeIcon icon={faGear} size="2x"/>
              </Link>
          )}
        </div>
        <div
            className={
              "flex items-start gap-6 max-sm:justify-center font-oswald uppercase"
            }
        >
          <h2
              className={`text-lg font-semibold text-center max-sm:text-xl border-b-4 transition-all duration-100 hover:border-b-gray-500 hover:cursor-pointer
           ${tab === "Posts" ? "border-b-gray-700 text-black hover:border-b-gray-900" : "border-b-transparent text-gray-500"}`}
              onClick={() => {
                setTab("Posts");
                setSearchActive(false);
              }}
          >
            <FontAwesomeIcon icon={faPencil}/> Posts
          </h2>
          <h2
              className={`text-lg font-semibold text-center max-sm:text-xl border-b-4 transition-all duration-100 hover:border-b-gray-500 hover:cursor-pointer
           ${tab === "About" ? "border-b-gray-700 hover:border-b-gray-900 text-black" : "border-b-transparent text-gray-500"}`}
              onClick={() => {
                setTab("About");
                setSearchActive(false);
              }}
          >
            <FontAwesomeIcon icon={faAddressCard}/> About
          </h2>
          <div className={"flex gap-2"}>
            <h2
                className={`text-xl font-bold text-center max-sm:text-xl border-b-4 transition-all duration-100 hover:border-b-gray-500 hover:cursor-pointer
             ${searchActive ? "border-b-gray-700 hover:border-b-gray-900 text-black" : "border-b-transparent text-gray-500"}`}
                onClick={() => {
                  setSearchActive(true);
                }}
            >
              <FontAwesomeIcon icon={faSearch}/>
            </h2>
            {searchActive && (
                <input
                    type="text"
                    className={
                      "mt-1 outline outline-0 bg-transparent text-black border-b-2 border-b-gray-700 w-64 max-sm:w-48 px-2"
                    }
                    placeholder={"Search posts..."}
                    autoFocus={true}
                />
            )}
          </div>
        </div>
        <hr className={"border-gray-300"}/>
        <div>{tab === "Posts" && <UserPosts userid={id}/>}</div>
        <div>{tab === "About" && <UserAbout about={data.user.about}/>}</div>
      </main>
  );
};

export default UserProfile;
