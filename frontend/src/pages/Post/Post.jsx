import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {
  useCreateCommentMutation,
  useGetPostQuery,
  useLikePostMutation,
  useUnlikePostMutation,
} from "../../features/posts/postsApiSlice.js";
import {selectUser} from "../../features/auth/authSlice.js";
import "ckeditor5/ckeditor5-content.css";
import Loader from "../../components/Loader.jsx";
import {setLocation} from "../../features/location/locationSlice.js";
import {toast} from "react-toastify";
import {useGetAccountQuery} from "../../features/account/accountApiSlice.js";
import {useSubscribeMutation, useUnsubscribeMutation,} from "../../features/users/usersApiSlice.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBellSlash,
  faCalendar,
  faClock,
  faComment,
  faList,
  faShare,
  faSignIn,
  faTags,
  faThumbsDown,
  faThumbsUp,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import CommentCard from "../../components/Comment.jsx";
import ShareWindow from "../../components/ShareWindow.jsx";
import AuthWindow from "../../components/AuthWindow.jsx";
import TimeAgo from "javascript-time-ago";

const timeAgo = new TimeAgo("en-US");


const Post = () => {
  const [commentAreaActive, setCommentAreaActive] = useState(false);
  const [likes, setLikes] = useState(0);
  const [subscribers, setSubscribers] = useState(0);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isShareWindowShown, setIsShareWindowShown] = useState(false);
  const [isAuthWindowShown, setIsAuthWindowShown] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user} = useSelector(selectUser);
  const {id} = useParams();
  const {data, error, isLoading, refetch} = useGetPostQuery(id);
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
      await likePost(id).unwrap();
      setLikes(likes + 1);
      setIsLiked(true);
      toast.success("Post liked");
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    }
  }, [id, likePost, likes, user]);

  const handleUnlike = useCallback(async () => {
    try {
      await unlikePost(id).unwrap();
      setLikes(likes - 1);
      setIsLiked(false);
      toast.success("Post unliked");
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    }
  }, [id, likes, unlikePost]);

  const handleSubscribe = useCallback(async () => {
    if (!user) {
      setIsAuthWindowShown(true);
      return;
    }
    try {
      await subscribe(data.post.author._id).unwrap();
      setSubscribers((prev) => prev + 1);
      setIsSubscribed(true);
      toast.success("Subscribed");
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    }
  }, [data, subscribe, user]);

  const handleUnsubscribe = useCallback(async () => {
    try {
      await unsubscribe(data.post.author._id).unwrap();
      setSubscribers((prev) => prev - 1);
      setIsSubscribed(false);
      toast.success("Unsubscribed");
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    }
  }, [data, unsubscribe]);

  const handleCreateComment = useCallback(async () => {
    try {
      if (commentBody.length < 10) {
        toast.error("Comment must be at least 10 characters long");
        return;
      }
      await comment({
        id,
        body: {content: commentBody},
      }).unwrap();
      toast.success("Comment created");
      setComments((prev) => [
        ...prev,
        {content: commentBody, author: user, date: new Date()},
      ]);
      setCommentAreaActive(false);
      setCommentBody("");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while creating the comment");
    }
  }, [comment, commentBody, id, user]);

  useEffect(() => {
    if (data) {
      setLikes(data.post.likes);
      setSubscribers(data.post.author.subscribers);
      setComments(data.post.comments);
      if (userData.data) {
        const isPostLiked = userData.data?.user?.likes.includes(id);
        const isUserSubscribed = userData.data?.user?.subscriptions.includes(
            data.post.author._id,
        );
        setIsLiked(isPostLiked);
        setIsSubscribed(isUserSubscribed);
      }
      if (id) dispatch(setLocation("Post"));
    }
    if (error) navigate("/not-found");
  }, [id, data, dispatch, error, navigate, userData.data]);

  useEffect(() => {
    refetch();
  }, [id, refetch]);

  if (isLoading)
    return (
        <div className={"h-screen flex justify-center items-center"}>
          <Loader/>
        </div>
    );

  return (
      <div className="min-h-screen flex flex-col px-24 mt-16 gap-12 max-lg:px-8 max-md:px-6 max-sm:px-0">
        <div className="max-lg:hidden z-0 fixed left-10 top-56 flex flex-col justify-center items-center gap-10">
          <button
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
            <span>{likes}</span>
          </button>
          <button
              className="text-2xl"
              onClick={() => setIsShareWindowShown(true)}
          >
            <FontAwesomeIcon
                icon={faShare}
                className={"transition-all hover:scale-125 cursor-pointer"}
            />
          </button>
          <button
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
        {isAuthWindowShown && (
            <AuthWindow setIsAuthWindowShown={setIsAuthWindowShown}/>
        )}
        {isShareWindowShown && (
            <ShareWindow setIsShareWindowShown={setIsShareWindowShown}/>
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
              <div className={"flex flex-col gap-2"}>
                <h1 className="text-6xl font-bold mb-4 text-start w-full">
                  {data?.post?.title}
                </h1>
                <div className={"flex flex-row items-center mb-4 gap-2"}>
                  <img
                      src={
                          import.meta.env.VITE_BACKEND_URI +
                          "/" +
                          data?.post?.author?.avatar
                      }
                      alt={data?.post?.author?.name + "'s avatar"}
                      width={48}
                      height={48}
                      className={
                        "rounded-full shadow-2xl border-black border-[1px]"
                      }
                  />
                  <div>
                    <Link
                        to={`/user/${data?.post?.author?._id}`}
                        className={"w-fit"}
                    >
                      <p className={"text-gray-700 w-fit hover:text-blue-500"}>
                        {data?.post?.author?.name}
                      </p>
                    </Link>
                    <p className={"text-gray-600 gap-2 flex items-center"}>
                      <FontAwesomeIcon icon={faUserGroup}/>
                      {`${subscribers} Subscriber${subscribers === 1 ? "" : "s"}`}
                    </p>
                  </div>
                </div>
                <div className="max-lg:flex flex-row hidden items-center gap-2">
                  <button
                      className="btn-gradient w-40 text-md max-sm:w-28"
                      onClick={
                        user
                            ? isLiked
                                ? () => handleUnlike()
                                : () => handleLike()
                            : () => handleLike()
                      }
                  >
                    <FontAwesomeIcon icon={isLiked ? faThumbsDown : faThumbsUp}/>{" "}
                    {likes}
                  </button>
                  <button
                      className="btn-gradient w-40 text-md max-sm:w-28"
                      onClick={() => setIsShareWindowShown(true)}
                  >
                    <FontAwesomeIcon icon={faShare}/>
                  </button>
                  <button
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
                    <FontAwesomeIcon icon={isSubscribed ? faBellSlash : faBell}/>
                  </button>
                </div>
              </div>
              <div
                  className={
                    "flex flex-row gap-4  max-lg:ml-0 flex-wrap justify-center"
                  }
              >
                <p className="text-gray-500 mb-4">
                  <FontAwesomeIcon icon={faList}/> Category:{" "}
                  {data?.post?.category.at(0).toUpperCase() +
                      data?.post?.category.slice(1)}
                </p>
                <p className="text-gray-500 mb-4">
                  <FontAwesomeIcon icon={faTags}/> Tags:{" "}
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
                  <FontAwesomeIcon icon={faCalendar}/>{" "}
                  {timeAgo.format(new Date(data?.post?.createdAt))}
                </p>
                <p className="text-gray-500 mb-4"><FontAwesomeIcon icon={faClock}/> {data?.post?.readTime} min read</p>

              </div>
            </div>
            <img
                src={import.meta.env.VITE_BACKEND_URI + "/" + data?.post?.image}
                alt={data?.post?.title}
                className="max-w-[500px] max-sm:max-w-full rounded-md shadow-2xl"
            />
          </div>
          <div
              className="ck-content break-words mb-4 my-10"
              dangerouslySetInnerHTML={{
                __html: data?.post?.content,
              }}
          />
        </div>
        <div className="p-8 flex flex-col gap-8">
          <h2 className="text-3xl font-bold mb-4">
            {comments.length === 0
                ? "No Comments"
                : comments.length === 1
                    ? "1 Comment"
                    : comments.length + " Comments"}{" "}
            <FontAwesomeIcon icon={faComment}/>
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
                          onClick={() => setCommentAreaActive(false)}
                          className="btn-transparent gap-2"
                      >
                        Cancel
                      </button>
                      <button
                          type="button"
                          className="btn-gradient gap-2"
                          onClick={handleCreateComment}
                      >
                        Comment
                      </button>
                    </div>
                )}
              </form>
          ) : (
              <Link to="/auth/login">
                <button className={"btn"}>
                  <FontAwesomeIcon icon={faSignIn}/> Log in to comment
                </button>
              </Link>
          )}
          {comments.map((comment) => (
              <CommentCard key={comment._id} comment={comment}/>
          ))}
        </div>
      </div>
  );
};

export default Post;
