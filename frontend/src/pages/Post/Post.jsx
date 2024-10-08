import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  useCreateCommentMutation,
  useGetPostQuery,
  useLikePostMutation,
  useUnlikePostMutation,
} from "../../features/posts/postsApiSlice.js";
import { selectUser } from "../../features/auth/authSlice.js";
import "ckeditor5/ckeditor5-content.css";
import Loader from "../../components/Loader.jsx";
import { setLocation } from "../../features/location/locationSlice.js";
import { toast } from "react-toastify";
import { useGetAccountQuery } from "../../features/account/accountApiSlice.js";
import {
  useSubscribeMutation,
  useUnsubscribeMutation,
} from "../../features/users/usersApiSlice.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBellSlash,
  faCalendar,
  faClock,
  faComment,
  faEye,
  faLink,
  faList,
  faPen,
  faShare,
  faSignIn,
  faTags,
  faThumbsDown,
  faThumbsUp,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import CommentCard from "../../components/CommentCard.jsx";
import TimeAgo from "javascript-time-ago";
import OverlayWindow from "../../components/OverlayWindow.jsx";
import {
  faFacebook,
  faMastodon,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { copyToClipboard } from "../../services/index.js";

const timeAgo = new TimeAgo("en-US");

const Post = () => {
  const [commentAreaActive, setCommentAreaActive] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isShareWindowShown, setIsShareWindowShown] = useState(false);
  const [isAuthWindowShown, setIsAuthWindowShown] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isSubscribeLoading, setIsSubscribeLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const { id } = useParams();
  const { data, error, isLoading, refetch } = useGetPostQuery(id);
  const userData = useGetAccountQuery(undefined, {
    skip: !user,
  });
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [subscribe] = useSubscribeMutation();
  const [unsubscribe] = useUnsubscribeMutation();
  const [comment] = useCreateCommentMutation();

  const handleLike = useCallback(async () => {
    if (!user) {
      setIsAuthWindowShown(true);
      return;
    }
    try {
      setIsLikeLoading(true);
      await likePost(id).unwrap();
      await userData.refetch();
      await refetch();
      toast.success("Post liked");
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    } finally {
      setIsLikeLoading(false);
    }
  }, [id, likePost, refetch, user, userData]);

  const handleUnlike = useCallback(async () => {
    try {
      setIsLikeLoading(true);
      await unlikePost(id).unwrap();
      await userData.refetch();
      await refetch();
      toast.success("Post unliked");
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    } finally {
      setIsLikeLoading(false);
    }
  }, [id, refetch, unlikePost, userData]);

  const handleSubscribe = useCallback(async () => {
    if (!user) {
      setIsAuthWindowShown(true);
      return;
    }
    try {
      setIsSubscribeLoading(true);
      await subscribe(data.post.author._id).unwrap();
      await userData.refetch();
      await refetch();
      toast.success("Subscribed");
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    } finally {
      setIsSubscribeLoading(false);
    }
  }, [data?.post.author._id, refetch, subscribe, user, userData]);

  const handleUnsubscribe = useCallback(async () => {
    try {
      setIsSubscribeLoading(true);
      await unsubscribe(data.post.author._id).unwrap();
      await userData.refetch();
      await refetch();
      toast.success("Unsubscribed");
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    } finally {
      setIsSubscribeLoading(false);
    }
  }, [data?.post.author._id, refetch, unsubscribe, userData]);

  const handleCreateComment = useCallback(async () => {
    try {
      if (commentBody.length < 10) {
        toast.error("Comment must be at least 10 characters long");
        return;
      }
      await comment({
        id,
        body: { content: commentBody },
      }).unwrap();
      await refetch();
      setCommentAreaActive(false);
      setCommentBody("");
      toast.success("Comment created");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while creating the comment");
    }
  }, [comment, commentBody, id, refetch]);

  useEffect(() => {
    if (id) dispatch(setLocation("Post"));
    if (userData.data) {
      const isPostLiked = userData.data?.user?.likes.includes(id);
      const isUserSubscribed = userData.data?.user?.subscriptions.includes(
        data?.post.author._id,
      );
      setIsLiked(isPostLiked);
      setIsSubscribed(isUserSubscribed);
    }
    if (error) navigate("/not-found");
  }, [id, data, dispatch, error, navigate, userData?.data]);

  if (isLoading)
    return (
      <div className={"h-screen flex justify-center items-center"}>
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col px-24 mt-16 gap-12 max-lg:px-8 max-md:px-6 max-sm:px-0">
      <div className="max-lg:hidden z-0 fixed left-10 top-56 flex flex-col justify-center items-center gap-10">
        {data?.post.author._id === user?.id && (
          <Link
            to={`/posts/${id}/edit`}
            className={
              "w-fit text-2xl transition-all hover:scale-125 cursor-pointer"
            }
          >
            <FontAwesomeIcon icon={faPen} />
          </Link>
        )}
        {data?.post.author._id !== user?.id && (
          <div className={"flex flex-col gap-10"}>
            <button
              disabled={isLikeLoading}
              className={`text-2xl flex flex-col ${isLiked ? "border-b-blue-500 border-b-2" : ""}`}
              onClick={
                user
                  ? isLiked
                    ? () => handleUnlike()
                    : () => handleLike()
                  : () => handleLike()
              }
            >
              <FontAwesomeIcon
                icon={isLiked ? faThumbsDown : faThumbsUp}
                className={"transition-all hover:scale-125 cursor-pointer"}
              />{" "}
              <span>{data?.post.likes === 0 ? "" : data?.post.likes}</span>
            </button>
            <button
              disabled={isSubscribeLoading}
              className={`text-2xl ${isSubscribed ? "border-b-blue-500 border-b-2" : ""}`}
              onClick={
                user
                  ? isSubscribed
                    ? () => handleUnsubscribe()
                    : () => handleSubscribe()
                  : () => handleSubscribe()
              }
            >
              <FontAwesomeIcon
                icon={isSubscribed ? faBellSlash : faBell}
                className={"transition-all hover:scale-125 cursor-pointer"}
              />
            </button>
          </div>
        )}

        <button
          className="text-2xl"
          onClick={() => setIsShareWindowShown(true)}
        >
          <FontAwesomeIcon
            icon={faShare}
            className={"transition-all hover:scale-125 cursor-pointer"}
          />
        </button>
      </div>
      {isAuthWindowShown && (
        <OverlayWindow setIsOverlayWindowShown={setIsAuthWindowShown}>
          <h2 className="text-3xl font-bold text-center">Login to account</h2>
          <p className="text-center">
            {" "}
            Please login to your account to continue
          </p>
          <div className={"w-full flex flex-col items-center gap-2"}>
            <Link to={"/auth/login"} className={"w-full"}>
              <button className={"btn w-full"}>Login</button>
            </Link>
            <p className="text-center"> Don&apos;t have an account?</p>
            <Link to={"/auth/register"} className={"w-full"}>
              <button className={"btn  w-full"}>Register</button>
            </Link>
          </div>
        </OverlayWindow>
      )}
      {isShareWindowShown && (
        <OverlayWindow setIsOverlayWindowShown={setIsShareWindowShown}>
          <h2 className="text-3xl font-bold text-center">Share</h2>
          <div className="flex justify-center items-center gap-12">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
              target="_blank"
              className="text-4xl transition-all hover:scale-125"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
              target="_blank"
              className="text-4xl transition-all hover:scale-125"
            >
              <FontAwesomeIcon icon={faXTwitter} />
            </a>
            <a
              href={`https://mastodon.social/share?text=${window.location.href}`}
              target="_blank"
              className="text-4xl transition-all hover:scale-125"
            >
              <FontAwesomeIcon icon={faMastodon} />
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
                copyToClipboard(window.location.href);
              }}
            />
          </div>
        </OverlayWindow>
      )}
      <div className="flex flex-col gap-4 p-8 max-sm:px-4">
        <div
          className={
            "flex flex-row justify-evenly max-xl:flex-col max-xl:justify-center max-xl:items-center"
          }
        >
          <div
            className={
              "w-fit flex flex-col gap-4 justify-center items-start max-xl:items-center max-sm:w-full"
            }
          >
            <div className={"flex flex-col gap-2 max-sm:items-center"}>
              <h1 className="text-6xl font-bold mb-4 text-center w-full break-all max-sm:text-4xl">
                {data?.post.title}
              </h1>
              <div className={"flex flex-row items-center mb-4 gap-2"}>
                <img
                  src={
                    import.meta.env.VITE_BACKEND_URI +
                    "/" +
                    data?.post.author.avatar
                  }
                  alt={data?.post.author.name + "'s avatar"}
                  width={48}
                  height={48}
                  className={
                    "rounded-full aspect-square object-cover border-[1px] border-black"
                  }
                />
                <div>
                  <Link
                    to={`/user/${data?.post.author._id}`}
                    className={"w-fit"}
                  >
                    <p className={"text-gray-700 w-fit hover:text-blue-500"}>
                      {data?.post.author.name}
                    </p>
                  </Link>
                  <p className={"text-gray-600 gap-2 flex items-center"}>
                    <FontAwesomeIcon icon={faUserGroup} />
                    {`${data?.post.author.subscribers} Subscriber${data?.post.author.subscribers === 1 ? "" : "s"}`}
                  </p>
                </div>
              </div>
              <div className="max-lg:flex flex-row hidden items-center gap-2">
                {user?.id !== data?.post.author._id && (
                  <div className={"flex gap-2"}>
                    <button
                      disabled={isLikeLoading}
                      className="btn-gradient w-40 text-md max-sm:w-28"
                      onClick={
                        user
                          ? isLiked
                            ? () => handleUnlike()
                            : () => handleLike()
                          : () => handleLike()
                      }
                    >
                      <FontAwesomeIcon
                        icon={isLiked ? faThumbsDown : faThumbsUp}
                      />{" "}
                      {data?.post.likes}
                    </button>
                    <button
                      disabled={isSubscribeLoading}
                      className="btn-gradient w-40 text-sm max-sm:w-32"
                      onClick={
                        user
                          ? isSubscribed
                            ? () => handleUnsubscribe()
                            : () => handleSubscribe()
                          : () => handleSubscribe()
                      }
                    >
                      Subscribe{" "}
                      <FontAwesomeIcon
                        icon={isSubscribed ? faBellSlash : faBell}
                      />
                    </button>
                  </div>
                )}
                {data?.post.author._id === user?.id && (
                  <Link
                    to={`/posts/${id}/edit`}
                    className="btn-gradient w-40 max-sm:w-32 text-center"
                  >
                    Edit <FontAwesomeIcon icon={faPen} />
                  </Link>
                )}
                <button
                  className="btn-gradient w-40 text-md max-sm:w-28"
                  onClick={() => setIsShareWindowShown(true)}
                >
                  <FontAwesomeIcon icon={faShare} /> Share
                </button>
              </div>
            </div>
            <div
              className={
                "flex flex-row gap-4  max-lg:ml-0 flex-wrap justify-center"
              }
            >
              <p className="text-gray-500 mb-4">
                <FontAwesomeIcon icon={faEye} /> Views: {data?.post?.views}
              </p>
              <p className="text-gray-500 mb-4">
                <FontAwesomeIcon icon={faList} /> Category:{" "}
                {data?.post?.category.at(0).toUpperCase() +
                  data?.post?.category.slice(1)}
              </p>
              <p className="text-gray-500 mb-4">
                <FontAwesomeIcon icon={faTags} /> Tags:{" "}
                {data?.post?.tags.map((tag) => (
                  <span
                    key={tag.toString()}
                    className="bg-gray-200 p-1 rounded-md mr-2"
                  >
                    #{tag}
                  </span>
                ))}
              </p>
              <p className="text-gray-500 mb-4">
                <FontAwesomeIcon icon={faCalendar} />{" "}
                {data?.post.createdAt &&
                  timeAgo.format(new Date(data?.post.createdAt))}
              </p>
              <p className="text-gray-500 mb-4">
                <FontAwesomeIcon icon={faClock} /> {data?.post?.readTime} min
                read
              </p>
            </div>
          </div>
          <img
            src={import.meta.env.VITE_BACKEND_URI + "/" + data?.post.image}
            alt={data?.post?.title}
            className="max-w-[500px] max-sm:max-w-full rounded-md shadow-2xl"
          />
        </div>
        <div
          className="ck-content break-words mb-4 my-10"
          dangerouslySetInnerHTML={{
            __html: data?.post.content,
          }}
        />
      </div>
      <div className="p-8 flex flex-col gap-8">
        <h2 className="text-3xl font-bold mb-4">
          Comments <FontAwesomeIcon icon={faComment} />
        </h2>
        {user ? (
          <form>
            <textarea
              onFocus={() => setCommentAreaActive(true)}
              className="border-b-2 border-b-gray-300 w-full outline-none min-h-6 resize-none p-4"
              placeholder="Write a comment..."
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
            />
            {commentAreaActive && (
              <div className="flex flex-row gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCommentAreaActive(false);
                    setCommentBody("");
                  }}
                  className="btn-transparent gap-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-gradient gap-2"
                  onClick={handleCreateComment}
                >
                  <FontAwesomeIcon icon={faComment} /> Comment
                </button>
              </div>
            )}
          </form>
        ) : (
          <Link to={"/auth/login"}>
            <button className={"btn"}>
              <FontAwesomeIcon icon={faSignIn} /> Log in to comment
            </button>
          </Link>
        )}
        {data?.post.comments
          .slice()
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              postId={id}
              creatorId={data?.post.author._id}
              refetch={refetch}
              currentUser={userData?.data?.user}
            />
          ))}
      </div>
    </div>
  );
};

export default Post;
