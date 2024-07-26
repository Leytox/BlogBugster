import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Button from "../../components/Button.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice.js";
import { useCreatePostMutation } from "../../features/posts/postsApiSlice.js";
import { modules } from "../../constants/index.js";
import { setLocation } from "../../features/location/locationSlice.js";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [showTags, setShowTags] = useState(false);
  const [isFormHidden, setIsFormHidden] = useState(false);
  const [preview, setPreview] = useState(false);
  const dispatch = useDispatch();
  dispatch(setLocation("New post"));
  const { user } = useSelector(selectUser);
  const [post] = useCreatePostMutation();
  const navigate = useNavigate();
  const editor = useRef();

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      if (tags.length < 1) {
        toast.error("Please add at least one tag");
        return;
      }
      if (contentLength < 512) {
        toast.error(
          `Please add more content, minimum length of content is 512 symbols, current is ${contentLength}`,
        );
        return;
      }
      if (!file) {
        toast.error("Please upload an image");
        return;
      }
      let form = new FormData();
      form.append("title", title);
      form.append("content", content);
      form.append("category", category);
      form.append("tags", tags);
      form.append("image", file);
      form.append("author", user.id);
      const res = await post(form).unwrap();
      toast.success("Post created successfully");
      navigate(`/post/${res.id}`);
    } catch (error) {
      console.log(error.data?.message || error.error);
      toast.error(error.data?.message || error.error);
    }
  };
  const handleImageUpload = (event) => {
    try {
      setFile(event.target.files[0]);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleAddTag = () => {
    if (tagInput.trim()) {
      if (tags.includes(tagInput.trim())) {
        toast.error("Tag already exists");
        return;
      }
      if (tags.length >= 8) {
        toast.error("You can only add up to 6 tags");
        return;
      }
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
      toast.success("Tag added successfully");
    }
  };
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    toast.success("Tag removed successfully");
  };

  let contentLength = editor.current?.getEditor().getLength();
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) setIsFormHidden(false);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main className={"h-screen flex flex-col"}>
      <form
        onSubmit={handleCreatePost}
        className={`${isFormHidden ? "h-24" : null} w-full bg-gray-800 p-3 flex flex-row justify-between gap-12 max-2xl:flex-col`}
      >
        <div
          className={`${isFormHidden ? "hidden" : "flex flex-row gap-8 justify-center items-center place-items-center max-xl:grid max-xl:grid-cols-2 max-lg:grid-cols-2 max-sm:flex max-sm:flex-col"} `}
        >
          <div className={"flex-col flex"}>
            <input
              required={true}
              minLength={8}
              maxLength={64}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder={"Title"}
              className={"input-transparent"}
            />
          </div>
          <div className={"flex-col flex"}>
            <select
              required={true}
              className={"input-transparent"}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value={""}>Select a category</option>
              <option value={"software"}>Software</option>
              <option value={"hardware"}>Hardware</option>
              <option value={"miscellaneous"}>Miscellaneous</option>
            </select>
          </div>
          <div className={"flex-row flex gap-2 w-72"}>
            <input
              type="text"
              placeholder="Add a tag"
              minLength={3}
              maxLength={20}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className={"input-transparent"}
            />
            <div className={"relative flex flex-row gap-4 right-16 text-white"}>
              <button
                type="button"
                onClick={handleAddTag}
                className={"text-2xl transition hover:text-gray-300"}
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setShowTags(!showTags)}
                className={"text-2xl rounded transition hover:text-gray-300 "}
              >
                ...
              </button>
            </div>
          </div>
          <div className={"flex flex-row items-center"}>
            <label
              className="bg-transparent transition border-r-4 border-l-2 border-b-4 border-t-[1px] w-72 items-center flex justify-center
             shadow-2xl border-white text-white hover:text-gray-300 hover:border-gray-300 cursor-pointer p-4 h-14 rounded"
            >
              {file ? file.name.substring(0, 22) + "..." : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={"hidden"}
              />
            </label>
            <button
              type={"button"}
              onClick={() => {
                setFile(null);
                toast.success("Image removed successfully");
              }}
              className={"text-red-500 text-xl relative right-6"}
            >
              {file ? "x" : null}
            </button>
          </div>
        </div>
        <div
          className={`${isFormHidden ? "hidden" : "flex-row flex justify-center items-center gap-4"}`}
        >
          <button
            onClick={() => setPreview(!preview)}
            type={"button"}
            title={"Preview"}
            className={
              `btn ${preview ? "bg-gray-400 scale-95 border-gray-400" : "scale-100"} w-24 bg-transparent transition border-r-4 border-l-2 border-b-4 border-t-[1px] shadow-2xl border-white text-white ` +
              "hover:bg-gray-500 hover:text-gray-300 hover:border-gray-300 font-normal"
            }
          >
            Preview
          </button>
          <Button
            title={"Create Post"}
            styles={
              "bg-transparent transition border-r-4 border-l-2 border-b-4 border-t-[1px] shadow-2xl border-white text-white " +
              "hover:bg-transparent hover:text-gray-300 hover:border-gray-300 font-normal"
            }
          />
        </div>
        <div
          className={"max-sm:flex w-full hidden justify-center items-center"}
        >
          <button
            type={"button"}
            onClick={() => setIsFormHidden(!isFormHidden)}
            className={`text-white text-2xl transition hover:text-gray-300 relative ${isFormHidden ? "top-3" : "top-2"}`}
          >
            {isFormHidden ? "Show" : "Hide"}
          </button>
        </div>
      </form>
      {preview ? (
        <div
          className={`h-[calc(100%-200px)] ${isFormHidden ? "h-full" : "max-2xl:h-[calc(100%-300px)] max-2xl:px-24 max-xl:px-0 max-xl:h-[calc(100%-400px)] max-lg:h-[calc(100%-500px)] max-md:h-[calc(100%-600px)] px-72"}`}
        >
          <h1
            className={`text-gray-200 italic text-6xl text-center ${contentLength > 1 || contentLength === undefined ? "hidden" : "mt-20"}`}
          >
            Preview...
          </h1>
          <div
            className={"blog-content text-xl w-full break-words"}
            id={"content-preview"}
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>
      ) : (
        <ReactQuill
          ref={editor}
          value={content}
          onChange={setContent}
          modules={modules}
          className={`h-[calc(100%-200px)] ${
            isFormHidden
              ? "h-full"
              : "max-2xl:h-[calc(100%-300px)] max-2xl:px-24" +
                " max-xl:px-0 max-xl:h-[calc(100%-400px)] max-lg:h-[calc(100%-500px)] max-md:h-[calc(100%-625px)] px-72"
          }`}
          placeholder={"Write something amazing..."}
        />
      )}
      {showTags && (
        <div
          className={
            "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          }
        >
          <div
            className={
              "bg-white p-4 rounded shadow-lg max-w-md w-full flex justify-center items-center flex-col"
            }
          >
            <h2 className={"text-xl font-bold mb-4"}>Tags</h2>
            <div className={"flex flex-wrap w-full"}>
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-gray-200 text-black p-2 rounded m-1 flex items-center"
                >
                  {tag}
                  <button
                    type={"button"}
                    onClick={() => handleRemoveTag(tag)}
                    className={"ml-2 text-red-500"}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowTags(!showTags)}
              className={"btn mt-4"}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default NewPost;
