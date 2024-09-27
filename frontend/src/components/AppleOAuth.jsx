import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple } from "@fortawesome/free-brands-svg-icons";

const AppleOAuth = () => {
  return (
    <button
      className={"btn-transparent w-72 flex justify-between items-center"}
      type={"button"}
    >
      <FontAwesomeIcon icon={faApple} /> Continue with Apple
      <div></div>
    </button>
  );
};

export default AppleOAuth;
