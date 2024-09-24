import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Tag from "../models/tag.model.js";
import Comment from "../models/comment.model.js";
import { isValidObjectId } from "mongoose";
import * as fs from "node:fs";
import jwt from "jsonwebtoken";
import jsdom from "jsdom";

const getPost = async (req, res) => {
  const { access_token } = req.cookies;
  try {
    if (!req.params.id) return res.status(404).json({ message: "Not found" });
    if (!isValidObjectId(req.params.id))
      return res.status(404).json({ message: "Not found" });
    const post = await Post.findById(req.params.id, null, null)
      .populate(
        "author",
        "-password -__v -_about -email -createdAt -updatedAt -likes -subscriptions -social -about",
      )
      .populate({
        path: "comments",
        populate: [
          {
            path: "author",
            select: "avatar name isAdmin ban",
          },
        ],
      });
    if (!post) return res.status(404).json({ message: "Not found" });
    if (access_token) {
      const decoded = jwt.verify(access_token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.id, null, null);
      if (user && post.author._id.toString() !== user._id.toString())
        if (!user.views.includes(post._id)) {
          post.views += 1;
          user.views.push(post._id);
          await post.save();
          await user.save();
        }
    }
    return res.status(200).json({ post, message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Something went wrong" });
  }
};

const getPosts = async (req, res) => {
  const { page, limit, category, sortOrder, searchTerm } = req.query;
  const skip = (page - 1) * limit;

  try {
    let query = {};
    if (searchTerm) query.title = { $regex: searchTerm, $options: "i" };
    if (category && category !== "all") query.category = category;
    const posts = await Post.find(query, null, null)
      .select("-content -comments")
      .populate("author", "avatar _id name")
      .skip(skip)
      .sort({ createdAt: sortOrder === "new" ? -1 : 1 })
      .limit(limit);

    const total = await Post.countDocuments(query);

    return res.status(200).json({ posts, total, message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Something went wrong" });
  }
};

const getUserPosts = async (req, res) => {
  const { userid } = req.params;
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;
  try {
    const posts = await Post.find({ author: userid }, null, null)
      .skip(skip)
      .limit(limit)
      .select("title views createdAt image readTime");
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
          tag = new Tag({ name: tagName.toLowerCase(), category });
          await tag.save();
        }
        return tag.name;
      }),
    );
    const { JSDOM } = jsdom;
    const dom = new JSDOM(content);
    const doc = dom.window.document;

    let figures = doc.querySelectorAll("figure");
    figures.forEach((figure) => figure.remove());

    let modifiedContent = doc.documentElement.outerHTML;

    const newPost = new Post({
      title,
      content,
      category,
      tags: tagIds,
      image: image.path,
      author,
      readTime: Math.ceil(modifiedContent.length / 7 / 200),
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
  let { title, content, category, tags } = req.body;
  const image = req.file;
  tags = tags.split(",");
  console.log(req.body);
  try {
    const candidate = await Post.findById(id, null, null);
    if (candidate.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });
    const tagIds = await Promise.all(
      tags.map(async (tagName) => {
        let tag = await Tag.findOne({ name: tagName }, null, null);
        if (!tag) {
          tag = new Tag({ name: tagName.toLowerCase(), category });
          await tag.save();
        }
        return tag.name;
      }),
    );

    const { JSDOM } = jsdom;
    const dom = new JSDOM(content);
    const doc = dom.window.document;

    let figures = doc.querySelectorAll("figure");
    figures.forEach((figure) => figure.remove());

    let modifiedContent = doc.documentElement.outerHTML;

    await Post.findByIdAndUpdate(
      id,
      {
        title,
        content,
        category,
        tags: tagIds,
        image: image ? image.path : candidate.image,
        readTime: Math.ceil(modifiedContent.length / 7 / 200),
      },
      null,
    );
    image ? fs.unlinkSync(candidate.image) : null;
    return res.status(200).json({ message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(409).json({ message: "Something went wrong" });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.find(id, null, null);
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });
    fs.unlinkSync(post.image);
    await Post.findByIdAndDelete(id, null);
    return res.status(200).json({ message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(409).json({ message: "Something went wrong" });
  }
};

const likePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id, null, null);
    if (!post) return res.status(404).json({ message: "Not found" });
    if (post.author._id.toString() === req.user.id)
      return res
        .status(403)
        .json({ message: "Forbidden. Cannot like own post" });
    const user = await User.findById(req.user.id, null, null);
    if (user.likes.includes(id))
      return res.status(403).json({ message: "Already liked" });
    await Post.findByIdAndUpdate(id, { likes: post.likes + 1 }, null);
    await User.findByIdAndUpdate(req.user.id, { $push: { likes: id } }, null);
    return res.status(200).json({ message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(409).json({ message: "Something went wrong" });
  }
};

const unlikePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id, null, null);
    if (!post) return res.status(404).json({ message: "Not found" });
    const user = await User.findById(req.user.id, null, null);
    if (!user.likes.includes(id))
      return res.status(403).json({ message: "Not liked" });
    await Post.findByIdAndUpdate(id, { likes: post.likes - 1 }, null);
    await User.findByIdAndUpdate(req.user.id, { $pull: { likes: id } }, null);
    return res.status(200).json({ message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(409).json({ message: "Something went wrong" });
  }
};

const getCommentReplies = async (req, res) => {
  const { commentId } = req.params;
  try {
    const replies = await Comment.find(
      { replyTo: commentId },
      null,
      null,
    ).populate("author", "avatar name isAdmin ban");
    return res.status(200).json({ replies, message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Something went wrong" });
  }
};

const createComment = async (req, res) => {
  const { id } = req.params;
  const { content, parentCommentId } = req.body;
  try {
    const comment = new Comment({
      content,
      author: req.user.id,
      replyTo: parentCommentId ? parentCommentId : null,
    });
    await comment.save();
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(
        parentCommentId,
        { $push: { replies: comment._id } },
        null,
      );
    } else {
      await Post.findByIdAndUpdate(
        id,
        { $push: { comments: comment._id } },
        null,
      );
    }
    return res.status(201).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(409).json({ message: "Something went wrong" });
  }
};

const likeComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId, null, null);
    if (!comment) return res.status(404).json({ message: "Not found" });
    if (comment.author._id.toString() === req.user.id)
      return res
        .status(403)
        .json({ message: "Forbidden. Cannot like own comment" });
    const user = await User.findById(req.user.id, null, null);
    if (user.commentLikes.includes(commentId))
      return res.status(403).json({ message: "Already liked" });
    await Comment.findByIdAndUpdate(
      commentId,
      { likes: comment.likes + 1 },
      null,
    );
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { commentLikes: commentId } },
      null,
    );
    return res.status(200).json({ message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(409).json({ message: "Something went wrong" });
  }
};

const unlikeComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId, null, null);
    if (!comment) return res.status(404).json({ message: "Not found" });
    const user = await User.findById(req.user.id, null, null);
    if (!user.commentLikes.includes(commentId))
      return res.status(403).json({ message: "Not liked" });
    await Comment.findByIdAndUpdate(
      commentId,
      { likes: comment.likes - 1 },
      null,
    );
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { commentLikes: commentId } },
      null,
    );
    return res.status(200).json({ message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(409).json({ message: "Something went wrong" });
  }
};

const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  try {
    await Comment.findByIdAndUpdate(commentId, { content }, null);
    return res.status(200).json({ message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(409).json({ message: "Something went wrong" });
  }
};

const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId, null, null);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    // Delete all replies to the comment
    await Comment.deleteMany({ replyTo: commentId }, null);
    if (comment.replyTo)
      await Comment.findByIdAndUpdate(
        comment.replyTo,
        { $pull: { replies: commentId } },
        null,
      );
    // Delete the top-level comment
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } }, null);
    await Comment.findByIdAndDelete(commentId, null);

    return res.status(200).json({ message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(409).json({ message: "Something went wrong" });
  }
};

export default {
  getPost,
  getPosts,
  getUserPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getCommentReplies,
  createComment,
  likeComment,
  unlikeComment,
  updateComment,
  deleteComment,
};
