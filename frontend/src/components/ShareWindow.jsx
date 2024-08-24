import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLink, faX} from "@fortawesome/free-solid-svg-icons";
import {faFacebook, faMastodon, faXTwitter,} from "@fortawesome/free-brands-svg-icons";
import PropTypes from "prop-types";
import {copyToClipboard} from "../services/index.js";

const ShareWindow = ({setIsShareWindowShown}) => {
  return (
      <div
          className="fixed inset-0 z-50 bg-black bg-opacity-25 flex justify-center items-center"
          onClick={(e) => {
            if (
                e.target.id === "share-window" ||
                e.target.parentElement.id === "share-window" ||
                e.target.parentElement.parentElement.id === "share-window" ||
                e.target.parentElement.parentElement.parentElement.id ===
                "share-window"
            )
              return;
            setIsShareWindowShown(false);
          }}
      >
        <div
            className="w-[500px] h-72 bg-white rounded-xl flex flex-col justify-between p-8 pb-16"
            id="share-window"
        >
          <FontAwesomeIcon
              icon={faX}
              className="absolute text-red-500 hover:text-red-700 hover:scale-125 cursor-pointer"
              onClick={() => setIsShareWindowShown(false)}
          />
          <h2 className="text-3xl font-bold text-center">Share</h2>
          <div className="flex justify-center items-center gap-12">
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                target="_blank"
                className="text-4xl transition-all hover:scale-125"
            >
              <FontAwesomeIcon icon={faFacebook}/>
            </a>
            <a
                href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
                target="_blank"
                className="text-4xl transition-all hover:scale-125"
            >
              <FontAwesomeIcon icon={faXTwitter}/>
            </a>
            <a
                href={`https://mastodon.social/share?text=${window.location.href}`}
                target="_blank"
                className="text-4xl transition-all hover:scale-125"
            >
              <FontAwesomeIcon icon={faMastodon}/>
            </a>
          </div>
          <div className="bg-gray-300 p-1 italic rounded-md flex justify-between border-2 border-gray-400 items-center">
            <p className={"text-gray-500 text-xl"}>
              {window.location.href.substring(0, 35) + "..."}
            </p>
            <FontAwesomeIcon
                icon={faLink}
                className="text-3xl text-white transition-all duration-300 hover:text-gray-300 cursor-pointer rounded-full gradient p-2"
                onClick={() => {
                  copyToClipboard(window.location.href)
                }}
            />
          </div>
        </div>
      </div>
  );
};

ShareWindow.propTypes = {
  setIsShareWindowShown: PropTypes.func.isRequired,
};

export default ShareWindow;
