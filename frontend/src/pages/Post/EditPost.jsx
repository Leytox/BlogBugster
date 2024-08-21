import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice.js";
import {
  useGetPostQuery,
  useUpdatePostMutation,
} from "../../features/posts/postsApiSlice.js";
import { setLocation } from "../../features/location/locationSlice.js";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Alignment,
  Autoformat,
  Base64UploadAdapter,
  BlockQuote,
  Bold,
  CKFinder,
  CKFinderUploadAdapter,
  ClassicEditor,
  CloudServices,
  Code,
  CodeBlock,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalLine,
  HtmlEmbed,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SpecialCharacters,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faEye,
  faEyeSlash,
  faMinus,
  faPlus,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "../../components/Loader.jsx";

const EditPost = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetPostQuery(id);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [showTags, setShowTags] = useState(false);
  const [isFormHidden, setIsFormHidden] = useState(false);
  const [preview, setPreview] = useState(true);
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const [updatePost] = useUpdatePostMutation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setLocation("Edit Post"));
    if (data) {
      setTitle(data.post.title);
      setContent(data.post.content);
      setCategory(data.post.category);
      setTags(data.post.tags);
    }
  }, [dispatch, data, user.id, navigate]);

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    try {
      if (tags.length < 1) {
        toast.error("Please add at least one tag");
        return;
      }
      if (content.length < 512) {
        toast.error(
          `Please add more content, minimum length of content is 512 symbols, current is ${content.length}`,
        );
        return;
      }
      let form = new FormData();
      form.append("title", title);
      form.append("content", content);
      form.append("category", category);
      form.append("tags", tags);
      form.append("author", user.id);
      if (file) form.append("image", file);
      await updatePost({ id, body: form }).unwrap();
      toast.success("Post updated successfully");
      navigate(`/posts/${id}`);
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
      if (tags.length >= 6) {
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

  useEffect(() => {
    const handleResize = () =>
      window.innerWidth >= 640 && setIsFormHidden(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading)
    return (
      <div className={"h-screen flex justify-center items-center"}>
        <Loader />
      </div>
    );

  return (
    <main className={"min-h-screen flex flex-col"}>
      <form
        onSubmit={handleUpdatePost}
        className={`${isFormHidden ? "h-24" : null} w-full bg-gray-800 p-3 flex flex-row justify-between gap-12 max-2xl:flex-col max-sm:gap-6`}
      >
        <div
          className={`${isFormHidden ? "hidden" : "flex flex-row gap-8 justify-center items-center place-items-center max-xl:grid max-xl:grid-cols-2 max-lg:grid-cols-2 max-sm:flex max-sm:flex-col max-sm:gap-6"} `}
        >
          <div className={"flex-col flex"}>
            <input
              required={true}
              minLength={8}
              maxLength={64}
              onChange={(e) => setTitle(e.target.value)}
              value={title}
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
          <div className={"flex-row flex w-72"}>
            <input
              type="text"
              placeholder="Add a tag"
              minLength={3}
              maxLength={20}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && tagInput.length > 3 && handleAddTag()
              }
              className={"input-transparent"}
            />
            <div className={"relative flex flex-row gap-4 right-24 text-white"}>
              {tagInput.length > 2 && (
                <div className={"flex flex-row gap-4"}>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className={"text-2xl transition hover:text-gray-300"}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTagInput("")}
                    className={"text-2xl transition hover:text-gray-300"}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                </div>
              )}
              {tags?.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowTags(!showTags)}
                  className={"text-2xl rounded transition hover:text-gray-300"}
                >
                  <FontAwesomeIcon icon={faAngleRight} />
                </button>
              )}
            </div>
          </div>
          <div className={"flex flex-row items-center"}>
            <label
              className="bg-transparent transition border-[1px] w-72 items-center flex justify-center
            border-white text-white hover:text-gray-300 hover:border-gray-300 cursor-pointer p-4 h-14 rounded gap-2"
            >
              {file ? file.name.substring(0, 18) + "..." : "Upload Image"}
              <FontAwesomeIcon icon={faUpload} />
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
            className={`btn-transparent gap-2 ${preview ? "bg-gray-400 scale-95 border-gray-400" : "scale-100"} w-28 text-white py-4`}
          >
            Preview <FontAwesomeIcon icon={preview ? faEye : faEyeSlash} />
          </button>
          <button className={"btn-transparent text-white py-4 gap-2"}>
            Update Post <FontAwesomeIcon icon={faPlus} />
          </button>
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
      <div
        className={
          "mt-4 mb-2 px-48 max-2xl:24px max-xl:px-16 max-lg:px-12 max-md:px-4 max-sm:px-2"
        }
      >
        {preview ? (
          <div>
            <h1
              className={`text-gray-200 italic text-6xl text-center ${content.length > 1 ? "hidden" : "mt-20"}`}
            >
              Preview...
            </h1>
            <div
              className={"break-words ck-content"}
              id={"content-preview"}
              dangerouslySetInnerHTML={{ __html: content }}
            ></div>
          </div>
        ) : (
          <CKEditor
            editor={ClassicEditor}
            config={{
              toolbar: {
                items: [
                  "heading",
                  "|",
                  "bold",
                  "italic",
                  "underline",
                  "strikethrough",
                  "link",
                  "bulletedList",
                  "numberedList",
                  "|",
                  "blockQuote",
                  "insertTable",
                  "mediaEmbed",
                  "undo",
                  "redo",
                  "|",
                  "imageUpload",
                  "imageStyle:inline",
                  "imageStyle:block",
                  "imageStyle:side",
                  "linkImage",
                  "imageTextAlternative",
                  "|",
                  "alignment:left",
                  "alignment:center",
                  "alignment:right",
                  "alignment:justify",
                  "|",
                  "removeFormat",
                  "specialCharacters",
                  "highlight",
                  "horizontalLine",
                  "htmlEmbed",
                  "code",
                  "codeBlock",
                  "fontBackgroundColor",
                  "fontColor",
                  "fontFamily",
                  "fontSize",
                  "subscript",
                  "superscript",
                  "todoList",
                  "underline",
                  "undo",
                ],
              },
              plugins: [
                Alignment,
                Autoformat,
                BlockQuote,
                Bold,
                CKFinder,
                CKFinderUploadAdapter,
                Base64UploadAdapter,
                CloudServices,
                Essentials,
                FontBackgroundColor,
                FontColor,
                FontFamily,
                FontSize,
                Heading,
                Highlight,
                HorizontalLine,
                HtmlEmbed,
                Code,
                CodeBlock,
                Image,
                ImageCaption,
                ImageResize,
                ImageStyle,
                ImageToolbar,
                ImageUpload,
                Indent,
                IndentBlock,
                Italic,
                Link,
                List,
                MediaEmbed,
                Paragraph,
                PasteFromOffice,
                RemoveFormat,
                SpecialCharacters,
                Strikethrough,
                Subscript,
                Superscript,
                Table,
                TableToolbar,
                TextTransformation,
                TodoList,
                Underline,
                Undo,
                LinkImage,
              ],
              heading: {
                options: [
                  {
                    model: "paragraph",
                    title: "Paragraph",
                    class: "ck-heading_paragraph",
                  },
                  {
                    model: "heading1",
                    view: "h1",
                    title: "Heading 1",
                    class: "ck-heading_heading1",
                  },
                  {
                    model: "heading2",
                    view: "h2",
                    title: "Heading 2",
                    class: "ck-heading_heading2",
                  },
                  {
                    model: "heading3",
                    view: "h3",
                    title: "Heading 3",
                    class: "ck-heading_heading3",
                  },
                  {
                    model: "heading4",
                    view: "h4",
                    title: "Heading 4",
                    class: "ck-heading_heading4",
                  },
                ],
              },
              image: {
                toolbar: [
                  "imageTextAlternative",
                  "|",
                  "imageStyle:inline",
                  "imageStyle:block",
                  "imageStyle:side",
                  "linkImage",
                ],
              },
              alignment: {
                options: ["left", "center", "right", "justify"],
              },
              initialData: content,
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setContent(data);
            }}
          />
        )}
      </div>
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

export default EditPost;
