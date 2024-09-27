import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const GoogleOAuth = () => {
  return (
    <button
      className={"btn-transparent w-72 flex justify-between items-center"}
      type={"button"}
    >
      <FontAwesomeIcon icon={faGoogle} /> Continue with Google
      <div></div>
    </button>
  );
};

export default GoogleOAuth;
