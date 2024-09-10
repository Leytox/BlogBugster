import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setLocation } from "../../features/location/locationSlice.js";
import {
  logout,
  selectUser,
  setAvatar,
} from "../../features/auth/authSlice.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faFloppyDisk,
  faIdCard,
  faKey,
  faLock,
  faRecycle,
  faSignOut,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useDeleteAvatarMutation,
  useGetAccountQuery,
  useUpdateAccountMutation,
  useUploadAvatarMutation,
} from "../../features/account/accountApiSlice.js";
import Loader from "../../components/Loader.jsx";
import { toast } from "react-toastify";
import UserAbout from "./UserAbout.jsx";
import { CountryDropdown } from "react-country-region-selector";
import {
  faFacebook,
  faGithub,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

const UserSettings = () => {
  const [settingsGroup, setSettingsGroup] = useState("Profile");
  const [about, setAbout] = useState("");
  const [country, setCountry] = useState("");
  const [facebook, setFacebook] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const { id } = useParams();
  const { user } = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [uploadImage] = useUploadAvatarMutation();
  const [deleteImage] = useDeleteAvatarMutation();
  const { data, isLoading, refetch } = useGetAccountQuery();
  const [updateProfile] = useUpdateAccountMutation();
  const [deleteAccount] = useDeleteAccountMutation();
  const [changePassword] = useChangePasswordMutation();
  useEffect(() => {
    setAbout(data?.user.about || "");
    setCountry(data?.user.country || "");
    setFacebook(data?.user.social.facebook || "");
    setGithub(data?.user.social.github || "");
    setLinkedin(data?.user.social.linkedin || "");
    setTwitter(data?.user.social.twitter || "");
    refetch();
    if (user.id.toString() !== id) navigate("/");
    switch (settingsGroup) {
      case "Profile":
        dispatch(setLocation("Settings > Profile"));
        break;
      case "Account":
        dispatch(setLocation("Settings > Account"));
        break;
      case "Security":
        dispatch(setLocation("Settings > Security"));
        break;
      default:
        dispatch(setLocation("Settings > Profile"));
    }
  }, [
    data?.user.about,
    data?.user.country,
    data?.user.social,
    dispatch,
    id,
    navigate,
    refetch,
    settingsGroup,
    user,
    user.id,
  ]);

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      try {
        await deleteAccount();
        toast.success("Account deleted successfully");
        navigate("/");
        dispatch(logout());
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete account");
      }
    }
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("avatar", file);
      await uploadImage(formData);
      const user = await refetch();
      dispatch(setAvatar(user.data.user.avatar));
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
      dispatch(setAvatar(user.data.user.avatar));
    }
  };

  const handleUpdateProfile = async () => {
    const btn = document.getElementById("save-btn");
    btn.setAttribute("disabled", "true");
    try {
      await updateProfile({
        country,
        social: {
          facebook,
          github,
          linkedin,
          twitter,
        },
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      btn.removeAttribute("disabled");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (
      !window.confirm(
        "Are you sure you want to change your password? You need to relogin after changing the password.",
      )
    )
      return;
    const currentPassword = e.target.currentPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      await changePassword({ currentPassword, newPassword });
      dispatch(logout());
      toast.success("Password changed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to change password");
    }
  };
  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  return (
    <section className={"min-h-screen flex px-48"}>
      <div className={"flex flex-col border-r-2 w-1/5"}>
        <div className={"py-16"}>
          <div className={"flex gap-4 i items-center"}>
            <img
              src={import.meta.env.VITE_BACKEND_URI + "/" + data.user.avatar}
              alt={"test"}
              className="w-24 h-24 max-sm:w-24 max-sm:h-24 rounded-full aspect-square object-cover bg-white border-[1px] border-black"
            />
            <div>
              <h1 className={"text-lg font-semibold"}>{data.user.name}</h1>
              <Link
                className={"text-sm text-gray-600 font-normal hover:underline"}
                to={`/user/${user.id}`}
              >
                View Profile
              </Link>
            </div>
          </div>
          <ul className="flex flex-col gap-6 mt-4">
            <li
              onClick={() => setSettingsGroup("Profile")}
              className={`text-xl font-normal flex gap-4 items-center transition-colors duration-100 cursor-pointer 
              ${settingsGroup === "Profile" ? "text-[#002b99] " : " text-gray-700"}`}
            >
              <FontAwesomeIcon className={"w-6"} icon={faUser} />
              <p>Profile</p>
            </li>
            <li
              onClick={() => setSettingsGroup("Account")}
              className={`text-xl font-normal flex gap-4 items-center transition-colors duration-100 cursor-pointer 
              ${settingsGroup === "Account" ? "text-[#002b99]" : " text-gray-700"}`}
            >
              <FontAwesomeIcon className={"w-6"} icon={faIdCard} />
              <p>Account</p>
            </li>
            <li
              onClick={() => setSettingsGroup("Security")}
              className={`text-xl font-normal flex gap-4 items-center transition-colors duration-100 cursor-pointer 
              ${settingsGroup === "Security" ? "text-[#002b99]" : " text-gray-700"}`}
            >
              <FontAwesomeIcon className={"w-6"} icon={faLock} />
              <p>Security</p>
            </li>
          </ul>
        </div>
      </div>
      <div className={"py-12 pl-12 w-3/4"}>
        {settingsGroup === "Profile" ? (
          <div className={"flex flex-col gap-4"}>
            <div>
              <h1 className={"text-lg font-semibold"}>Common information</h1>
              <p className={"text-sm text-gray-500"}>
                Change your name, country, social links etc.
              </p>
            </div>
            <hr />
            <div>
              <h1 className={"text-lg font-semibold"}>Avatar</h1>
              <p className={"text-sm text-gray-500"}>
                Change your profile picture
              </p>
            </div>
            <div className="relative w-fit flex gap-4">
              <span
                className="absolute rounded-full text-4xl inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <FontAwesomeIcon icon={faAdd} />
              </span>
              <img
                src={import.meta.env.VITE_BACKEND_URI + "/" + data.user.avatar}
                alt={`${data.user.name}'s avatar`}
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
              {user.avatar !== "uploads/users/default.png" && (
                <FontAwesomeIcon
                  onClick={() => handleDeleteImage()}
                  icon={faTrash}
                  className="text-white bg-red-600 p-3 rounded-full absolute right-3 bottom-3 hover:bg-red-700 cursor-pointer"
                />
              )}
            </div>
            <hr />
            <div>
              <h1 className={"text-lg font-semibold"}>Social links</h1>
              <p className={"text-sm text-gray-500"}>
                Add your social links to your profile
              </p>
            </div>
            <div>
              <div className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="facebook"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <FontAwesomeIcon icon={faFacebook} /> Facebook
                  </label>
                  <input
                    type="text"
                    name="facebook"
                    id="facebook"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    className="outline outline-0 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="github"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <FontAwesomeIcon icon={faGithub} /> GitHub
                  </label>
                  <input
                    type="text"
                    name="github"
                    id="github"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="outline outline-0 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="linkedin"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
                  </label>
                  <input
                    type="text"
                    name="linkedin"
                    id="linkedin"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="outline outline-0 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="twitter"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <FontAwesomeIcon icon={faTwitter} /> Twitter
                  </label>
                  <input
                    type="text"
                    name="twitter"
                    id="twitter"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="outline outline-0 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
            </div>
            <hr />
            <div>
              <h1 className={"text-lg font-semibold"}>About</h1>
              <p className={"text-sm text-gray-500"}>Write about yourself</p>
            </div>
            <UserAbout about={data.user.about || about} setAbout={setAbout} />
            <hr />
            <div>
              <h1 className={"text-lg font-semibold"}>Country</h1>
              <p className={"text-sm text-gray-500"}>Change your country</p>
            </div>
            <CountryDropdown
              classes={"p-2 rounded"}
              value={country}
              onChange={(e) => setCountry(e)}
            />
            <hr />
            <button
              type={"button"}
              className={"btn"}
              id={"save-btn"}
              onClick={handleUpdateProfile}
            >
              <FontAwesomeIcon icon={faFloppyDisk} /> Save All
            </button>
          </div>
        ) : settingsGroup === "Account" ? (
          <div className={"flex flex-col gap-4"}>
            <div>
              <h1 className={"text-lg font-semibold"}>Account options</h1>
              <p className={"text-sm text-gray-500"}>
                Some account related options
              </p>
            </div>
            <hr />
            <div>
              <h1 className={"text-lg font-semibold"}>Logout from account</h1>
              <p className={"text-sm text-gray-500"}>
                Logout from current account, warning you need to login again!
              </p>
            </div>
            <button
              type={"button"}
              className={"btn"}
              onClick={() => {
                if (window.confirm("Are you sure you want to logout?")) {
                  dispatch(logout());
                  navigate("/");
                }
              }}
            >
              <FontAwesomeIcon icon={faSignOut} /> Logout
            </button>
            <hr />
            <div>
              <h1 className={"text-lg font-semibold"}>Delete Account</h1>
              <p className={"text-sm text-gray-500"}>
                Delete your account and all associated data with it
              </p>
            </div>
            <button
              type={"button"}
              className={"btn-danger"}
              onClick={handleDeleteAccount}
            >
              <FontAwesomeIcon icon={faTrash} /> Delete
            </button>
          </div>
        ) : (
          <div className={"flex flex-col gap-4"}>
            <div>
              <h1 className={"text-lg font-semibold"}>Security Options</h1>
              <p className={"text-sm text-gray-500"}>
                Change your password, enable 2FA etc.
              </p>
            </div>
            <hr />
            <div>
              <h1 className={"text-lg font-semibold"}>Change Password</h1>
              <p className={"text-sm text-gray-500"}>Change your password</p>
            </div>
            <hr />
            <form
              onSubmit={handleChangePassword}
              className="flex flex-col gap-4"
            >
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  required
                  className="outline outline-0 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  required
                  className="outline outline-0 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  className="outline outline-0 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <button type="submit" className="btn">
                <FontAwesomeIcon icon={faRecycle} /> Change
              </button>
            </form>
            <div>
              <h1 className={"text-lg font-semibold"}>
                Two Factor Authentication
              </h1>
              <p className={"text-sm text-gray-500"}>
                Enable 2FA for more security
              </p>
            </div>
            <hr />
            <button className={"btn bg-green-500 hover:bg-green-600"}>
              <FontAwesomeIcon icon={faKey} /> Set up 2FA
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserSettings;
