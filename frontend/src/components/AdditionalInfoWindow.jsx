import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faGlobe, faInfoCircle, faPeopleGroup, faShare, faX,} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {faFacebook, faGithub, faLinkedin, faXTwitter,} from "@fortawesome/free-brands-svg-icons";
import PropTypes from "prop-types";
import {copyToClipboard} from "../services/index.js";

const AdditionalInfoWindow = ({setIsAdditionalInfoWindowShown, user}) => {
  return (
      <div
          className="fixed inset-0 z-50 bg-black bg-opacity-25 flex justify-center items-center"
          onClick={(e) => {
            if (
                e.target.id === "additional-info-window" ||
                e.target.parentElement.id === "additional-info-window" ||
                e.target.parentElement.parentElement.id ===
                "additional-info-window" ||
                e.target.parentElement.parentElement.parentElement.id ===
                "additional-info-window"
            )
              return;
            setIsAdditionalInfoWindowShown(false);
          }}
      >
        <div
            className="w-[500px] min-h-96 bg-white rounded-xl flex flex-col justify-between p-8"
            id="additional-info-window"
        >
          <FontAwesomeIcon
              icon={faX}
              className="absolute text-red-500 hover:text-red-700 hover:scale-125 cursor-pointer"
              onClick={() => setIsAdditionalInfoWindowShown(false)}
          />
          <h2 className="text-3xl font-bold text-center">Details</h2>
          <div className={"flex flex-col gap-4 my-6"}>
            <Link to={window.location.href}>
              <p className="text-md text-gray-600">
                <FontAwesomeIcon icon={faGlobe}/>{" "}
                {window.location.href.replace("http://", "")}
              </p>
            </Link>
            <p className="text-md text-gray-600">
              <FontAwesomeIcon icon={faEnvelope}/>{" "}
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </p>
            <p className={"text-md text-gray-600"}>
              <FontAwesomeIcon icon={faPeopleGroup}/> {user.subscribers}{" "}
              Subscriber
              {user.subscribers > 1 || user.subscribers === 0 ? "s" : ""}
            </p>
            <p className={"text-md text-gray-600"}>
              <FontAwesomeIcon icon={faInfoCircle}/> Registration:{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col justify-center gap-2">
            {user.social.facebook ||
            user.social.twitter ||
            user.social.linkedin ||
            user.social.github ? (
                <h2 className={"text-xl mt-4 font-bold text-center"}>Social</h2>
            ) : (
                ""
            )}
            <div
                className={
                  "flex flex-row gap-2 justify-center items-center text-center"
                }
            >
              {user.social.facebook && (
                  <a
                      href={user.social.facebook}
                      target="_blank"
                      className="text-2xl text-blue-700 hover:text-blue-900"
                  >
                    <FontAwesomeIcon icon={faFacebook}/>{" "}
                    <span className={"text-xl"}>Facebook</span>
                  </a>
              )}
              {user.social.twitter && (
                  <a
                      href={user.social.twitter}
                      target="_blank"
                      className="text-2xl text-black"
                  >
                    <FontAwesomeIcon icon={faXTwitter}/>{" "}
                    <span className={"text-xl"}>X(Twitter)</span>
                  </a>
              )}
              {user.social.linkedin && (
                  <a
                      href={user.social.linkedin}
                      target="_blank"
                      className="text-2xl text-blue-800 hover:text-blue-900"
                  >
                    <FontAwesomeIcon icon={faLinkedin}/>{" "}
                    <span className={"text-xl"}>LinkedIn</span>
                  </a>
              )}
              {user.social.github && (
                  <a
                      href={user.social.github}
                      target="_blank"
                      className="text-2xl text-gray-700 hover:text-gray-900"
                  >
                    <FontAwesomeIcon icon={faGithub}/>{" "}
                    <span className={"text-xl"}>Github</span>
                  </a>
              )}
            </div>
          </div>
          <button
              className={"btn"}
              onClick={() => {
                copyToClipboard(window.location.href)
              }}
          >
            <FontAwesomeIcon icon={faShare}/> Share author
          </button>
        </div>
      </div>
  );
};

AdditionalInfoWindow.propTypes = {
  setIsAdditionalInfoWindowShown: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    subscribers: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    social: PropTypes.shape({
      facebook: PropTypes.string,
      twitter: PropTypes.string,
      linkedin: PropTypes.string,
      github: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default AdditionalInfoWindow;
