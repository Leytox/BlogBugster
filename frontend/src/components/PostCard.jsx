import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faExternalLink,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { copyToClipboard } from "../services/index.js";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

const PostCard = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={"w-[320px] rounded-lg overflow-hidden relative"}>
      <Link
        to={`/posts/${post._id}`}
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
            <div
              className={
                "bg-black bg-opacity-60 p-1 rounded-tl-lg rounded-br-lg text-sm m-2"
              }
            >
              <FontAwesomeIcon icon={faClock} /> {post.readTime} min
            </div>
          </div>
        </div>
      </Link>

      <div className={"flex justify-between mt-2 gap-4"}>
        {post.author && (
          <Link to={`/user/${post.author._id}`}>
            <img
              src={import.meta.env.VITE_BACKEND_URI + "/" + post.author.avatar}
              alt={"avatar"}
              width={64}
              height={64}
              className={
                "rounded-full border-[1px] border-black aspect-square object-cover bg-white"
              }
            />
          </Link>
        )}
        <Link
          to={`/posts/${post._id}`}
          onMouseEnter={() => {
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
          className={"w-full"}
        >
          <div className={"flex gap-3 items-center"}>
            <div>
              <h3 className="font-semibold">
                {post.title.length > 28
                  ? post.title.substring(0, 28) + "..."
                  : post.title}
              </h3>
              {post.author && (
                <p className={"text-gray-500 text-sm"}>{post.author.name}</p>
              )}
              <div className={"text-sm flex justify-start gap-2 text-gray-500"}>
                <p>
                  {post.views === 1
                    ? `${post.views} view`
                    : `${post.views} views`}
                </p>
                ·<p>{timeAgo.format(new Date(post.createdAt))}</p>
              </div>
            </div>
          </div>
        </Link>
        <div className={"flex items-start"}>
          <button
            onClick={() => copyToClipboard()}
            className={"hover:scale-110 transition-transform"}
          >
            <FontAwesomeIcon icon={faShare} />
          </button>
        </div>
      </div>
    </div>
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
    author: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default PostCard;
