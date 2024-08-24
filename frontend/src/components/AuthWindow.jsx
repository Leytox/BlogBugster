import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const AuthWindow = ({ setIsAuthWindowShown }) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-25 flex justify-center items-center"
      onClick={(e) => {
        if (
          e.target.id === "auth-window" ||
          e.target.parentElement.id === "auth-window" ||
          e.target.parentElement.parentElement.id === "auth-window" ||
          e.target.parentElement.parentElement.parentElement.id ===
            "auth-window"
        )
          return;
        setIsAuthWindowShown(false);
      }}
    >
      <div
        className="w-[500px] h-96 bg-white rounded-xl flex flex-col justify-between p-8 pb-16"
        id="auth-window"
      >
        <FontAwesomeIcon
          icon={faX}
          className="absolute text-red-500 hover:text-red-700 hover:scale-125 cursor-pointer"
          onClick={() => setIsAuthWindowShown(false)}
        />
        <h2 className="text-3xl font-bold text-center">Login to account</h2>
        <p className="text-center"> Please login to your account to continue</p>
        <div className={"w-full flex flex-col items-center gap-2"}>
          <Link to="auth/login" className={"w-full"}>
            <button className={"btn w-full"}>Login</button>
          </Link>
          <p className="text-center"> Don&apos;t have an account?</p>
          <Link to="auth/register" className={"w-full"}>
            <button className={"btn  w-full"}>Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
AuthWindow.propTypes = {
  setIsAuthWindowShown: PropTypes.func.isRequired,
};
export default AuthWindow;
