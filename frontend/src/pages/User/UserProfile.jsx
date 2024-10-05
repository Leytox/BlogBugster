import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader.jsx";
import {
  useGetUserQuery,
  useSubscribeMutation,
  useUnsubscribeMutation,
} from "../../features/users/usersApiSlice.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faAddressCard,
  faBan,
  faBell,
  faBellSlash,
  faClipboard,
  faEnvelope,
  faGear,
  faGlobe,
  faInfoCircle,
  faPencil,
  faPeopleGroup,
  faTrash,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { selectUser, setAvatar } from "../../features/auth/authSlice.js";
import UserPosts from "./UserPosts.jsx";
import { copyToClipboard } from "../../services/index.js";
import UserAbout from "./UserAbout.jsx";
import {
  useDeleteAvatarMutation,
  useGetAccountQuery,
  useUploadAvatarMutation,
} from "../../features/account/accountApiSlice.js";
import { toast } from "react-toastify";
import UserSubscriptions from "./UserSubscriptions.jsx";
import {
  faFacebook,
  faGithub,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import OverlayWindow from "../../components/OverlayWindow.jsx";

const UserProfile = () => {
  const [tab, setTab] = useState("Posts");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [additionalInfoVisible, setAdditionalInfoVisible] = useState(false);
  const [about, setAbout] = useState("");
  const [isSubscribeLoading, setIsSubscribeLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data, error, isLoading, refetch } = useGetUserQuery(id);
  const { user } = useSelector(selectUser);
  const userData = useGetAccountQuery(undefined, {
    skip: !user,
  });
  const [uploadImage] = useUploadAvatarMutation();
  const [deleteImage] = useDeleteAvatarMutation();
  const [subscribe] = useSubscribeMutation();
  const [unsubscribe] = useUnsubscribeMutation();

  useEffect(() => {
    if (error) navigate("/not-found");
  }, [error, navigate]);

  useEffect(() => {
    refetch();
  }, [id, refetch]);

  useEffect(() => {
    setTab("Posts");
  }, [id]);

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("avatar", file);
      await uploadImage(formData);
      const user = await refetch();
      dispatch(setAvatar(user.data?.user.avatar));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    }
  };

  const handleDeleteImage = async () => {
    if (window.confirm("Are you sure you want to delete your avatar?")) {
      await deleteImage();
      const user = await refetch();
      dispatch(setAvatar(user.data?.user.avatar));
    }
  };

  const handleSubscribe = useCallback(async () => {
    try {
      setIsSubscribeLoading(true);
      await subscribe(id).unwrap();
      await refetch();
      setIsSubscribed(true);
      toast.success("Subscribed");
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    } finally {
      setIsSubscribeLoading(false);
    }
  }, [id, refetch, subscribe]);

  const handleUnsubscribe = useCallback(async () => {
    try {
      setIsSubscribeLoading(true);
      await unsubscribe(id).unwrap();
      await refetch();
      setIsSubscribed(false);
      toast.success("Unsubscribed");
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    } finally {
      setIsSubscribeLoading(false);
    }
  }, [id, refetch, unsubscribe]);

  useEffect(() => {
    if (userData.data) {
      const isUserSubscribed = userData.data?.user?.subscriptions.includes(id);
      setIsSubscribed(isUserSubscribed);
    }
  }, [id, userData.data]);

  useEffect(() => {
    refetch();
  }, [tab, refetch]);

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );

  return (
    <main className="min-h-screen py-8 px-32 max-sm:px-2 max-sm:py-2 max-md:px-20 max-lg:px-24 max-xl:px-28">
      {additionalInfoVisible && (
        <OverlayWindow setIsOverlayWindowShown={setAdditionalInfoVisible}>
          <h2 className="text-3xl font-bold text-center">Details</h2>
          <div className={"flex h-full flex-col gap-2"}>
            <Link to={window.location.href}>
              <p className="text-md text-gray-600">
                <FontAwesomeIcon icon={faGlobe} />{" "}
                {window.location.href.replace("http://", "")}
              </p>
            </Link>
            <p className="text-md text-gray-600">
              <FontAwesomeIcon icon={faEnvelope} />{" "}
              <a href={`mailto:${data.user.email}`}>{data.user.email}</a>
            </p>
            <p className={"text-md text-gray-600"}>
              <FontAwesomeIcon icon={faPeopleGroup} /> {data.user.subscribers}{" "}
              Subscriber
              {data.user.subscribers > 1 || data.user.subscribers === 0
                ? "s"
                : ""}
            </p>
            <p className={"text-md text-gray-600"}>
              <FontAwesomeIcon icon={faInfoCircle} /> Registration:{" "}
              {new Date(data.user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col justify-center gap-2">
            {data.user.social.facebook ||
            data.user.social.twitter ||
            data.user.social.linkedin ||
            data.user.social.github ? (
              <h2 className={"text-xl mt-2 font-bold text-center"}>Social</h2>
            ) : (
              ""
            )}
            <div
              className={
                "flex flex-row gap-2 justify-center items-center text-center"
              }
            >
              {data.user.social.facebook && (
                <a
                  href={data.user.social.facebook}
                  target="_blank"
                  className="text-5xl text-blue-700 hover:text-blue-900"
                >
                  <FontAwesomeIcon icon={faFacebook} />{" "}
                </a>
              )}
              {data.user.social.twitter && (
                <a
                  href={data.user.social.twitter}
                  target="_blank"
                  className="text-5xl text-black"
                >
                  <FontAwesomeIcon icon={faXTwitter} />{" "}
                </a>
              )}
              {data.user.social.linkedin && (
                <a
                  href={data.user.social.linkedin}
                  target="_blank"
                  className="text-5xl text-blue-800 hover:text-blue-900"
                >
                  <FontAwesomeIcon icon={faLinkedin} />{" "}
                </a>
              )}
              {data.user.social.github && (
                <a
                  href={data.user.social.github}
                  target="_blank"
                  className="text-5xl text-gray-700 hover:text-gray-900"
                >
                  <FontAwesomeIcon icon={faGithub} />{" "}
                </a>
              )}
            </div>
          </div>
        </OverlayWindow>
      )}
      <div className={"flex justify-between pb-4 max-sm:w-full"}>
        <div className="flex flex-col gap-6 max-sm:w-full">
          <div className={"flex gap-6 items-center max-sm:justify-center"}>
            <div className="relative w-fit">
              {user?.id.toString() === id && (
                <span
                  className="absolute rounded-full text-4xl inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <FontAwesomeIcon icon={faAdd} />
                </span>
              )}
              <img
                src={import.meta.env.VITE_BACKEND_URI + "/" + data?.user.avatar}
                alt={`${data?.user.name}'s avatar`}
                className="w-48 h-48 max-sm:w-32 max-sm:h-32 rounded-full aspect-square object-cover bg-white border-[1px] border-black"
              />
              <input
                type="file"
                accept={".png, .jpg, .jpeg"}
                id="fileInput"
                className="hidden"
                onChange={handleImageUpload}
                alt={"image"}
              />
              {user?.id.toString() === id &&
                user.avatar !== "uploads/users/default.png" && (
                  <FontAwesomeIcon
                    onClick={() => handleDeleteImage()}
                    icon={faTrash}
                    className="text-white bg-gray-600 p-3 rounded-full absolute right-3 bottom-3 hover:bg-gray-700 cursor-pointer"
                  />
                )}
            </div>
            <div className={"flex flex-col gap-4"}>
              <div className={"flex gap-2 items-end"}>
                <h1 className="text-4xl font-bold mt-4">{data?.user.name}</h1>
                <h2
                  className={
                    "text-4xl italic text-gray-600 cursor-pointer hover:text-gray-700 hover:scale-110 transition-transform"
                  }
                  onClick={() => setAdditionalInfoVisible(true)}
                >
                  ...
                </h2>
              </div>
              <div
                className={"flex gap-2 text-gray-600 text-lg max-sm:text-sm"}
              >
                <p
                  onClick={() => copyToClipboard(id)}
                  className={"cursor-pointer hover:underline"}
                  title={"Copy id of this user"}
                >
                  <FontAwesomeIcon icon={faClipboard} /> Copy ID
                </p>
                ·
                <p>
                  <FontAwesomeIcon icon={faPeopleGroup} />{" "}
                  {data?.user.subscribers} Subscriber
                  {data?.user.subscribers > 1 || data?.user.subscribers === 0
                    ? "s"
                    : ""}
                </p>
              </div>
              {user?.id.toString() !== id ? (
                <button
                  disabled={isSubscribeLoading}
                  className="gradient text-white px-4 py-2 rounded-md hover:text-gray-200 transition-colors max-sm:hidden"
                  onClick={
                    user
                      ? isSubscribed
                        ? () => handleUnsubscribe()
                        : () => handleSubscribe()
                      : () => handleSubscribe()
                  }
                >
                  Subscribe{" "}
                  <FontAwesomeIcon icon={isSubscribed ? faBellSlash : faBell} />
                </button>
              ) : (
                <div className={"flex max-sm:text-sm"}>
                  <Link to={`/user/${id}/settings`} className={"w-fit"}>
                    <button className={"btn rounded-xl py-0"}>
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
          {data?.user.ban.status && (
            <p className="text-lg text-red-600 mt-4">
              <FontAwesomeIcon icon={faBan} /> Banned in{" "}
              {new Date(data?.user.ban.date.toString()).toLocaleDateString()}
              <br />
              Reason: {data?.user.ban.reason}
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
          onClick={() => setTab("Posts")}
        >
          <FontAwesomeIcon icon={faPencil} /> Posts
        </h2>
        <h2
          className={`text-lg font-semibold text-center border-b-4 transition-all duration-100 hover:border-b-gray-500 hover:cursor-pointer
           ${tab === "About" ? "border-b-gray-700 hover:border-b-gray-900 text-black" : "border-b-transparent text-gray-500"}`}
          onClick={() => setTab("About")}
        >
          <FontAwesomeIcon icon={faAddressCard} /> About
        </h2>
        <h2
          className={`text-lg font-semibold text-center border-b-4 transition-all duration-100 hover:border-b-gray-500 hover:cursor-pointer
           ${tab === "Subscriptions" ? "border-b-gray-700 hover:border-b-gray-900 text-black" : "border-b-transparent text-gray-500"}`}
          onClick={() => setTab("Subscriptions")}
        >
          <FontAwesomeIcon icon={faUserGroup} /> Subscriptions
        </h2>
      </div>
      <hr className={"border-gray-300"} />
      <div className={"py-4"}>
        {tab === "Posts" ? (
          <UserPosts userid={id} />
        ) : tab === "About" ? (
          <UserAbout about={data?.user.about || about} setAbout={setAbout} />
        ) : (
          <UserSubscriptions />
        )}
      </div>
    </main>
  );
};

export default UserProfile;
