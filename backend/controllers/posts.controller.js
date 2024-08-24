import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Tag from "../models/tag.model.js";
import {isValidObjectId} from "mongoose";
import * as fs from "node:fs";
import jwt from "jsonwebtoken";

const getPost = async (req, res) => {
  const {access_token} = req.cookies;
  try {
    if (!req.params.id) return res.status(404).json({message: "Not found"});
    if (!isValidObjectId(req.params.id))
      return res.status(404).json({message: "Not found"});
    const post = await Post.findById(req.params.id, null, null)
        .populate(
            "author",
            "-password -__v -_about -email -createdAt -updatedAt -likes -subscriptions -social -about",
        )
        .populate("comments.author", "_id avatar ban isAdmin name");
    if (!post) return res.status(404).json({message: "Not found"});
    if (access_token) {
      const decoded = jwt.verify(access_token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.id, null, null);
      if (user && post.author._id.toString() !== user._id.toString()) {
        post.views += 1;
        await post.save();
      }
    }
    return res.status(200).json({post, message: "Successes"});
  } catch (error) {
    console.log(error);
    return res.status(404).json({message: "Something went wrong"});
  }
};

const getPosts = async (req, res) => {
  const {page, limit} = req.query;
  const skip = (page - 1) * limit;
  try {
    const posts = await Post.find({}, null, null).skip(skip).limit(limit);
    return res.status(200).json({posts, message: "Successes"});
  } catch (error) {
    console.log(error);
    return res.status(404).json({message: "Something went wrong"});
  }
};

const getUserPosts = async (req, res) => {
  const {userid} = req.params;
  const {page, limit} = req.query;
  const skip = (page - 1) * limit;
  try {
    const posts = await Post.find({author: userid}, null, null)
        .skip(skip)
        .limit(limit).select("title views createdAt image readTime");
    return res.status(200).json({posts, message: "Successes"});
  } catch (error) {
    console.log(error);
    return res.status(404).json({message: "Something went wrong"});
  }
};

const createPost = async (req, res) => {
  let {title, content, category, tags, author} = req.body;
  const image = req.file;
  tags = tags.split(",");
  try {
    if (author !== req.user.id)
      return res.status(403).json({message: "Forbidden"});
    const tagIds = await Promise.all(
        tags.map(async (tagName) => {
          let tag = await Tag.findOne({name: tagName}, null, null);
          if (!tag) {
            tag = new Tag({name: tagName.toLowerCase(), category});
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
      readTime: Math.ceil(content.length / 7 / 200)
    });
    await newPost.save();
    return res.status(201).json({id: newPost._id, message: "Successes"});
  } catch (error) {
    console.log(error);
    return res.status(409).json({message: "Something went wrong"});
  }
};

const updatePost = async (req, res) => {
  const {id} = req.params;
  let {title, content, category, tags} = req.body;
  const image = req.file;
  tags = tags.split(",");
  console.log(req.body, req.params, req.file);
  try {
    const candidate = await Post.findById(id, null, null);
    if (candidate.author.toString() !== req.user.id)
      return res.status(403).json({message: "Forbidden"});
    const tagIds = await Promise.all(
        tags.map(async (tagName) => {
          let tag = await Tag.findOne({name: tagName}, null, null);
          if (!tag) {
            tag = new Tag({name: tagName.toLowerCase(), category});
            await tag.save();
          }
          return tag.name;
        }),
    );
    await Post.findByIdAndUpdate(
        id,
        {
          title,
          content,
          category,
          tags: tagIds,
          image: image ? image.path : candidate.image,
          readTime: Math.ceil(content.length / 7 / 200)
        },
        null,
    );
    image ? fs.unlinkSync(candidate.image) : null;
    return res.status(200).json({message: "Successes"});
  } catch (error) {
    console.log(error);
    return res.status(409).json({message: "Something went wrong"});
  }
};

const deletePost = async (req, res) => {
  const {id} = req.params;
  try {
    const post = await Post.find(id, null, null);
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({message: "Forbidden"});
    fs.unlinkSync(post.image);
    await Post.findByIdAndDelete(id, null);
    return res.status(200).json({message: "Successes"});
  } catch (error) {
    console.log(error);
    return res.status(409).json({message: "Something went wrong"});
  }
};

const likePost = async (req, res) => {
  const {id} = req.params;
  try {
    const post = await Post.findById(id, null, null);
    if (!post) return res.status(404).json({message: "Not found"});
    if (post.author._id.toString() === req.user.id)
      return res
          .status(403)
          .json({message: "Forbidden. Cannot like own post"});
    const user = await User.findById(req.user.id, null, null);
    if (user.likes.includes(id))
      return res.status(403).json({message: "Already liked"});
    await Post.findByIdAndUpdate(id, {likes: post.likes + 1}, null);
    await User.findByIdAndUpdate(req.user.id, {$push: {likes: id}}, null);
    return res.status(200).json({message: "Successes"});
  } catch (error) {
    console.log(error);
    return res.status(409).json({message: "Something went wrong"});
  }
};

const unlikePost = async (req, res) => {
  const {id} = req.params;
  try {
    const post = await Post.findById(id, null, null);
    if (!post) return res.status(404).json({message: "Not found"});
    const user = await User.findById(req.user.id, null, null);
    if (!user.likes.includes(id))
      return res.status(403).json({message: "Not liked"});
    await Post.findByIdAndUpdate(id, {likes: post.likes - 1}, null);
    await User.findByIdAndUpdate(req.user.id, {$pull: {likes: id}}, null);
    return res.status(200).json({message: "Successes"});
  } catch (error) {
    console.log(error);
    return res.status(409).json({message: "Something went wrong"});
  }
};

const createComment = async (req, res) => {
  const {id} = req.params;
  const {content} = req.body;
  try {
    await Post.findByIdAndUpdate(
        id,
        {$push: {comments: {content, author: req.user.id}}},
        null,
    );
    return res.status(201).json({message: "Successes"});
  } catch (error) {
    console.log(error);
    return res.status(409).json({message: "Something went wrong"});
  }
};

const updateComment = async (req, res) => {
  const {id, commentId} = req.params;
  const {content} = req.body;
  try {
    await Post.findOneAndUpdate(
        {_id: id, "comments._id": commentId},
        {$set: {"comments.$.content": content}},
        null,
    );
    return res.status(308).json({message: "Successes"});
  } catch (error) {
    console.log(error);
    return res.status(409).json({message: "Something went wrong"});
  }
};

const deleteComment = async (req, res) => {
  const {id, commentId} = req.params;
  try {
    await Post.findByIdAndUpdate(
        id,
        {$pull: {comments: {_id: commentId}}},
        null,
    );
    return res.status(200).json({message: "Successes"});
  } catch (error) {
    console.log(error);
    return res.status(409).json({message: "Something went wrong"});
  }
};

const likeComment = async (req, res) => {
  const {id, commentId} = req.params;
  try {
    await Post.findOneAndUpdate(
        {_id: id, "comments._id": commentId},
        {$inc: {"comments.$.likes": 1}},
        null,
    );
    return res.status(308).json({message: "Successes"});
  } catch (error) {
    console.log(error);
    return res.status(409).json({message: "Something went wrong"});
  }
};

const unlikeComment = async (req, res) => {
  const {id, commentId} = req.params;
  try {
    await Post.findOneAndUpdate(
        {_id: id, "comments._id": commentId},
        {$inc: {"comments.$.likes": -1}},
        null,
    );
    return res.status(308).json({message: "Successes"});
  } catch (error) {
    console.log(error);
    return res.status(409).json({message: "Something went wrong"});
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
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
};
