import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";

const FacebookOAuth = () => {
  return (
    <button
      className={"btn-transparent w-72 flex justify-between items-center"}
      type={"button"}
    >
      <FontAwesomeIcon icon={faFacebook} /> Continue with Facebook
      <div></div>
    </button>
  );
};

export default FacebookOAuth;
