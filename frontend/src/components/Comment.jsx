import PropTypes from "prop-types";

const CommentCard = ({ comment }) => {
  return (
    <div key={comment._id} className="flex flex-col gap-4 p-4 rounded-xl">
      <div className="flex flex-row items-center gap-4">
        <img
          src={import.meta.env.VITE_BACKEND_URI + "/" + comment.author.avatar}
          alt={comment.author.name + "'s avatar"}
          width={48}
          height={48}
        />
        <div>
          <p className="text-xl font-bold">{comment.author.name}</p>
          <p className="text-gray-500">
            {new Date(comment.date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <p className="text-lg">{comment.content}</p>
    </div>
  );
};

CommentCard.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    author: PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    date: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
};

export default CommentCard;
