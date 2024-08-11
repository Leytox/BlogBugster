import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetPostQuery } from "../../features/posts/postsApiSlice.js";
import { selectUser } from "../../features/auth/authSlice.js";
import "ckeditor5/ckeditor5-content.css";
import Loader from "../../components/Loader.jsx";
import { setLocation } from "../../features/location/locationSlice.js";

const Post = () => {
  const [commentAreaActive, setCommentAreaActive] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const { id } = useParams();

  const { data, error, isLoading } = useGetPostQuery(id);

  useEffect(() => {
    if (id) dispatch(setLocation("Post"));
  }, [id, dispatch]);

  useEffect(() => {
    if (error) navigate("/not-found");
  }, [error, navigate]);

  if (isLoading)
    return (
      <div className={"h-screen flex justify-center items-center"}>
        <Loader />
      </div>
    );

  if (error) return null;

  return (
    <div className="min-h-screen flex flex-col px-24 mt-16 gap-12 max-lg:px-8 max-md:px-6 max-sm:px-0">
      <div className="max-lg:hidden z-0 fixed left-10 top-56 flex flex-col justify-center items-center gap-10">
        <button className="text-2xl">👍 {data?.post?.likes}</button>
        <button className="text-2xl">🔁</button>
        <button className="text-2xl">🔔</button>
      </div>
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
            <div className={"flex flex-col gap-4"}>
              <h1 className="text-6xl font-bold mb-4 text-start w-full">
                {data?.post?.title}
              </h1>
              <div className={"flex flex-row items-center mb-4 gap-2"}>
                <img
                  src={
                    import.meta.env.VITE_BACKEND_URI +
                    "/" +
                    data?.post?.author?.profilePic
                  }
                  alt={data?.post?.author?.name + "'s avatar"}
                  width={48}
                  height={48}
                />
                <div>
                  <p className={"text-gray-700"}>{data?.post?.author?.name}</p>
                  <p className={"text-gray-600"}>
                    {data?.post?.author?.subscribers?.length === 0
                      ? 0 + " Subscribers"
                      : data?.post?.author?.subscribers?.length > 1
                        ? data?.post?.author?.subscribers?.length +
                          " Subscribers"
                        : 1 + " Subscriber"}
                  </p>
                </div>
              </div>
              <div className="max-lg:flex flex-row hidden items-center gap-2">
                <button className="btn-gradient w-40 text-lg max-sm:w-32">
                  Like 👍 {data?.post?.likes}
                </button>
                <button className="btn-gradient w-40 text-lg max-sm:w-32">
                  Share 🔁
                </button>
                <button className="btn-gradient w-40 text-lg max-sm:w-32">
                  Sub 🔔
                </button>
              </div>
            </div>
            <div
              className={
                "flex flex-row gap-4 items-end justify-start max-lg:ml-0"
              }
            >
              <p className="text-gray-500 mb-4">
                Category:{" "}
                {data?.post?.category.at(0).toUpperCase() +
                  data?.post?.category.slice(1)}
              </p>
              <p className="text-gray-500 mb-4">
                Tags:{" "}
                {data?.post?.tags.map((tag) => (
                  <span key={tag} className="bg-gray-200 p-1 rounded-md mr-2">
                    #{tag}
                  </span>
                ))}
              </p>
              <p className="text-gray-500 mb-4">
                Date: {new Date(data?.post?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <img
            src={import.meta.env.VITE_BACKEND_URI + "/" + data?.post?.image}
            alt={data?.post?.title}
            className="max-w-[500px] max-sm:max-w-full rounded-md shadow-2xl"
          />
        </div>
        <hr className={"border-[1px] border-gray-300 my-10"} />
        <div
          className="ck-content break-words mb-4"
          dangerouslySetInnerHTML={{
            __html: data?.post?.content,
          }}
        />
        <hr className={"border-[1px] border-gray-300 my-10"} />
      </div>
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-4">
          {data?.post?.comments.length === 0
            ? "No Comments"
            : data?.post?.comments.length === 1
              ? "1 Comment"
              : data?.post?.comments.length + " Comments"}{" "}
          💬
        </h2>
        {user ? (
          <form>
            <textarea
              onFocus={() => setCommentAreaActive(true)}
              className="border-b-2 border-b-gray-300 w-full outline-none min-h-6 resize-none p-4"
              placeholder="Write a comment..."
            />
            {commentAreaActive && (
              <div className="flex flex-row gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setCommentAreaActive(false)}
                  className="btn-transparent"
                >
                  Cancel
                </button>
                <button type="button" className="btn-gradient">
                  Comment 💬
                </button>
              </div>
            )}
          </form>
        ) : (
          <Link to={"/auth/login"}>
            <button className={"btn"}>Log in to left a comment</button>
          </Link>
        )}
        {data?.post?.comments.map((comment) => (
          <div
            key={comment._id}
            className="flex flex-col gap-4 p-4 border-2 border-gray-100 rounded-xl"
          >
            <div className="flex flex-row items-center gap-4">
              <img
                src={
                  import.meta.env.VITE_BACKEND_URI +
                  "/" +
                  comment.author.profilePic
                }
                alt={comment.author.name + "'s avatar"}
                width={48}
                height={48}
              />
              <div>
                <p className="text-xl font-bold">{comment.author.name}</p>
                <p className="text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-lg">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
