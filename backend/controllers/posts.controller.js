import Post from "../models/post.model.js";
import Tag from "../models/tag.model.js";
import { isValidObjectId } from "mongoose";

const getPost = async (req, res) => {
  console.log(req.params.id);
  try {
    if (!req.params.id) return res.status(404).json({ message: "Not found" });
    if (!isValidObjectId(req.params.id))
      return res.status(404).json({ message: "Not found" });
    const post = await Post.findById(req.params.id, null, null).populate(
      "author",
      "-password",
    );
    if (!post) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ post, message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Something went wrong" });
  }
};

const getPosts = async (req, res) => {
  const { page, limit } = req.query;
  try {
    const posts = await Post.find({}, null, null);
    return res.status(200).json({ posts, message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Something went wrong" });
  }
};

const createPost = async (req, res) => {
  let { title, content, category, tags, author } = req.body;
  const image = req.file;
  tags = tags.split(",");
  try {
    if (author !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });
    const tagIds = await Promise.all(
      tags.map(async (tagName) => {
        let tag = await Tag.findOne({ name: tagName }, null, null);
        if (!tag) {
          tag = new Tag({ name: tagName, category });
          await tag.save();
        }
        return tag.name;
      }),
    );

    const newPost = new Post({
      title,
      content,
      category,
      tags: tagIds,
      image: image.path,
      author,
    });
    await newPost.save();
    return res.status(201).json({ id: newPost._id, message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(409).json({ message: "Something went wrong" });
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;
  try {
    await Post.findByIdAndUpdate(id, post, null);
    return res.status(308).json({ message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(409).json({ message: "Something went wrong" });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await Post.findByIdAndDelete(id, null);
    return res.status(200).json({ message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(409).json({ message: "Something went wrong" });
  }
};

export default { getPost, getPosts, createPost, updatePost, deletePost };
