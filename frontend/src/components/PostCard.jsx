import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faExternalLink, faShare,} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import {copyToClipboard} from "../services/index.js";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

const PostCard = ({post}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
      <Link
          to={`/posts/${post._id}`}
          className="w-[320px] rounded-lg overflow-hidden relative"
          onMouseEnter={() => {
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
      >
        <div className="relative">
          <img
              src={import.meta.env.VITE_BACKEND_URI + "/" + post.image}
              alt={post.title}
              className={`w-full h-48 object-cover rounded-2xl transition-all duration-150 ${isHovered ? "brightness-50" : ""}`}
          />
          {isHovered && (
              <div className="absolute inset-0 flex items-center justify-center">
                <FontAwesomeIcon
                    icon={faExternalLink}
                    className="text-white text-3xl"
                />
              </div>
          )}
          <div
              className={"absolute inset-0 flex items-end justify-end text-white"}
          >
            <div className={"bg-black bg-opacity-60 p-1 rounded-tl-lg rounded-br-lg text-sm m-2"}>
              <FontAwesomeIcon icon={faClock}/>{" "}
              {post.readTime} min
            </div>
          </div>
        </div>
        <div className={"flex justify-between"}>
          <div className="mt-2">
            <h3 className="text-lg font-semibold">
              {post.title.length > 28
                  ? post.title.substring(0, 28) + "..."
                  : post.title}
            </h3>
            <div className={"text-sm flex justify-start gap-2 text-gray-500"}>
              <p className="mb-4">
                {/*<FontAwesomeIcon icon={post.views > 0 ? faEye : faEyeSlash}/>{" "}*/}
                {post.views === 1 ? `${post.views} view` : `${post.views} views`}
              </p>
              ·
              <p className="mb-4">
                {/*<FontAwesomeIcon*/}
                {/*    icon={*/}
                {/*      timeAgo.format(new Date(post.createdAt)).includes("minutes") ||*/}
                {/*      timeAgo.format(new Date(post.createdAt)).includes("minute") ||*/}
                {/*      timeAgo.format(new Date(post.createdAt)).includes("now")*/}
                {/*          ? faHourglassStart*/}
                {/*          : timeAgo*/}
                {/*              .format(new Date(post.createdAt))*/}
                {/*              .includes("hours") ||*/}
                {/*          timeAgo.format(new Date(post.createdAt)).includes("hour")*/}
                {/*              ? faHourglassHalf*/}
                {/*              : faHourglassEnd*/}
                {/*    }*/}
                {/*/>{" "}*/}
                {timeAgo.format(new Date(post.createdAt))}
              </p>
            </div>
          </div>
          <button onClick={() => copyToClipboard()}><FontAwesomeIcon icon={faShare} className={"z-50"}/></button>
        </div>
      </Link>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    views: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    readTime: PropTypes.number.isRequired,
  }).isRequired,
};

export default PostCard;
