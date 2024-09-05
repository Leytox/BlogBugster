import {
  faAngleDown,
  faAngleUp,
  faEdit,
  faReply,
  faThumbsDown,
  faThumbsUp,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateCommentMutation,
  useLikeCommentMutation,
  useLoadCommentRepliesQuery,
  useUnlikeCommentMutation,
  useUpdateCommentMutation,
} from "../features/posts/postsApiSlice.js";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice.js";
import TimeAgo from "javascript-time-ago";

const timeAgo = new TimeAgo("en-US");
const CommentCard = ({
  comment,
  postId,
  refetch,
  parentCommentId,
  creatorId,
  currentUser,
}) => {
  const [replyBody, setReplyBody] = useState("");
  const [replyActive, setReplyActive] = useState(false);
  const [editActive, setEditActive] = useState(false);
  const [editBody, setEditBody] = useState(comment.content.toString());
  const [loadedReplies, setLoadedReplies] = useState([]);
  const [repliesShown, setRepliesShown] = useState(false);
  const [isLiked, setIsLiked] = useState(
    currentUser?.commentLikes.includes(comment._id),
  );
  const [likes, setLikes] = useState(comment.likes);
  const [createComment] = useCreateCommentMutation();
  const [editComment] = useUpdateCommentMutation();
  const [likeComment] = useLikeCommentMutation();
  const [unlikeComment] = useUnlikeCommentMutation();
  const { data: replies, refetch: refetchReply } = useLoadCommentRepliesQuery({
    id: postId,
    commentId: comment._id,
  });

  useEffect(() => {}, []);

  const { user } = useSelector(selectUser);

  const handleLoadReplies = useCallback(() => {
    setLoadedReplies(replies);
  }, [replies]);

  const handleLikeComment = useCallback(async () => {
    try {
      await likeComment({ id: postId, commentId: comment._id }).unwrap();
      await refetch();
      await refetchReply();
      setIsLiked(true);
      setLikes((likes) => likes + 1);
      setRepliesShown(false);
      console.log("liked");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while liking the comment");
    }
  }, [likeComment, postId, comment._id, refetch, refetchReply]);

  const handleUnlikeComment = useCallback(async () => {
    try {
      await unlikeComment({ id: postId, commentId: comment._id }).unwrap();
      await refetch();
      await refetchReply();
      setIsLiked(false);
      setLikes((likes) => likes - 1);
      setRepliesShown(false);
      console.log("unliked");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while unliking the comment");
    }
  }, [unlikeComment, postId, comment._id, refetch, refetchReply]);

  const handleCreateComment = useCallback(async () => {
    try {
      if (replyBody.length < 10) {
        toast.error("Comment must be at least 10 characters long");
        return;
      }
      await createComment({
        id: postId,
        body: {
          content: replyBody,
          parentCommentId: comment._id,
        },
      }).unwrap();
      await refetch();
      await refetchReply();
      setReplyActive(false);
      setReplyBody("");
      setRepliesShown(false);
      toast.success("Comment created");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while creating the comment");
    }
  }, [replyBody, createComment, postId, comment._id, refetch, refetchReply]);

  const handleEditComment = useCallback(async () => {
    try {
      console.log(editBody);
      if (editBody.length < 10) {
        toast.error("Comment must be at least 10 characters long");
        return;
      }
      await editComment({
        id: postId,
        commentId: comment._id,
        body: {
          content: editBody,
        },
      }).unwrap();
      console.log(editBody);
      await refetch();
      await refetchReply();
      setEditActive(false);
      setRepliesShown(false);
      toast.success("Comment edited");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while editing the comment");
    }
  }, [comment._id, editBody, editComment, postId, refetch, refetchReply]);

  return (
    <div
      key={comment._id}
      className={`flex flex-col gap-4 py-4 px-8 rounded-xl break-all max-sm:px-2 max-sm:text-sm max-sm:gap-2`}
    >
      <div className={`flex flex-row items-center gap-2 max-sm:gap-1`}>
        <img
          src={import.meta.env.VITE_BACKEND_URI + "/" + comment.author.avatar}
          alt={comment.author.name + "'s avatar"}
          className={"rounded-full aspect-square object-cover"}
          width={48}
          height={48}
        />
        <div>
          <p
            className={`text-lg font-bold  w-fit ${
              creatorId === comment.author._id || comment.author.isAdmin
                ? comment.author.isAdmin
                  ? "px-2 text-white bg-gradient-to-r from-green-700 to-green-500 rounded-xl"
                  : "px-2 gradient rounded-xl"
                : ""
            }`}
          >
            {comment.author.name}
            {
              <span className="text-xs font-normal text-red-500">
                {comment.author.ban.status ? " (banned)" : ""}
              </span>
            }
          </p>
          <p className="text-gray-500">
            {timeAgo.format(new Date(comment.date))}
          </p>
        </div>
      </div>
      <div className={"flex flex-col gap-1"}>
        {!editActive ? (
          <p className="text-lg">{editBody}</p>
        ) : (
          <div className={"flex flex-col gap-4"}>
            <textarea
              onFocus={() => setEditActive(true)}
              className="border-b-2 border-b-gray-300 w-full outline-none min-h-6 resize-none p-4"
              placeholder="Reply to this comment..."
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
            />
            <div className="flex flex-row gap-4 mt-2">
              <button
                type="button"
                onClick={() => {
                  setEditActive(false);
                }}
                className="btn-transparent gap-2"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-gradient gap-2"
                onClick={handleEditComment}
              >
                <FontAwesomeIcon icon={faEdit} /> Edit
              </button>
            </div>
          </div>
        )}
        <div className={"flex gap-4 items-center"}>
          {comment.replies.length > 0 && (
            <button
              onClick={() => {
                if (repliesShown) {
                  setRepliesShown(false);
                  refetchReply();
                } else {
                  handleLoadReplies();
                  setRepliesShown(true);
                }
              }}
            >
              <FontAwesomeIcon icon={repliesShown ? faAngleUp : faAngleDown} />{" "}
              {repliesShown ? "Hide" : "Show"} replies ({comment.replies.length}
              )
            </button>
          )}
          {!editActive && (
            <div className={"flex gap-4"}>
              <p
                className={"cursor-pointer"}
                onClick={isLiked ? handleUnlikeComment : handleLikeComment}
              >
                <FontAwesomeIcon icon={isLiked ? faThumbsDown : faThumbsUp} />{" "}
                {likes}
              </p>
              <p
                className={"cursor-pointer hover:text-blue-500"}
                onClick={() => setReplyActive(!replyActive)}
              >
                <FontAwesomeIcon icon={faReply} /> Reply
              </p>
              {comment.author._id === user.id && (
                <div className={"flex gap-4"}>
                  <p
                    className={"cursor-pointer hover:text-yellow-500"}
                    onClick={() => setEditActive(true)}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </p>
                  <p
                    className={"cursor-pointer hover:text-red-500"}
                    onClick={() => {}}
                  >
                    {/*TODO: implement Delete functionality*/}
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        {replyActive && (
          <div className={"flex flex-col gap-4"}>
            <textarea
              onFocus={() => setReplyActive(true)}
              className="border-b-2 border-b-gray-300 w-full outline-none min-h-6 resize-none p-4"
              placeholder="Reply to this comment..."
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
            />
            <div className="flex flex-row gap-4 mt-2">
              <button
                type="button"
                onClick={() => {
                  setReplyActive(false);
                  setReplyBody("");
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
                <FontAwesomeIcon icon={faReply} /> Reply
              </button>
            </div>
          </div>
        )}
        {repliesShown &&
          loadedReplies?.replies?.map((reply) => (
            <CommentCard
              key={reply._id}
              comment={reply}
              postId={postId}
              refetch={refetchReply}
              parentCommentId={comment._id}
              creatorId={creatorId}
              currentUser={currentUser}
            />
          ))}
      </div>
    </div>
  );
};

export default CommentCard;
