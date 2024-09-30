import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { toast } from "react-toastify";
import { useGoogleOAuthMutation } from "../features/auth/authApiSlice.js";
import { setUser } from "../features/auth/authSlice.js";
import { useDispatch } from "react-redux";

const GoogleOAuth = () => {
  const dispatch = useDispatch();
  const [googleOAuth] = useGoogleOAuthMutation();
  const handleGoogleOAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await googleOAuth({
        name: result.user.displayName,
        email: result.user.email,
      }).unwrap();
      dispatch(setUser(res.user));
      toast.success("Logged in with Google");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      className={"btn-transparent w-72 flex justify-between items-center"}
      type={"button"}
      onClick={handleGoogleOAuth}
    >
      <FontAwesomeIcon icon={faGoogle} /> Continue with Google
      <div></div>
    </button>
  );
};

export default GoogleOAuth;
