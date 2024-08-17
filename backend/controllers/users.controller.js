import User from "../models/user.model.js";
import Post from "../models/post.model.js";

const getUser = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id,
      "-password -likes -_id -__v -subscriptions -updatedAt",
      null,
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    const posts = await Post.find({ author: req.params.id }, null, null);
    return res.status(200).json({ user, posts, message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getUsers = async (req, res) => {
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;
  console.log(req.admin);
  try {
    const users = await User.find(
      null,
      "-password -subscriptions -likes -social -__v -updatedAt -createdAt",
      null,
    )
      .skip(skip)
      .limit(limit);
    if (!users) return res.status(404).json({ message: "Users not found" });
    return res.status(200).json({ users, message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const ban = async (req, res) => {
  const { reason } = req.body;
  try {
    const user = await User.findById(req.params.id, null, null);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isAdmin) return res.status(403).json({ message: "Forbidden" });
    user.ban.status = true;
    user.ban.reason = reason;
    user.ban.date = new Date.now();
    await user.save();
    return res.status(200).json({ message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const unban = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, null, null);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.ban.status === false)
      return res.status(403).json({ message: "User is not banned" });
    user.ban.status = false;
    user.ban.reason = null;
    user.ban.date = null;
    await user.save();
    return res.status(200).json({ message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const subscribe = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, null, null);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (req.params.id === req.user._id.toString())
      return res
        .status(403)
        .json({ message: "Forbidden. Cannot subscribe to yourself" });
    const currentUser = await User.findById(req.user._id, null, null);
    if (currentUser.subscriptions.includes(user._id))
      return res.status(403).json({ message: "Forbidden. Already subscribed" });
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { subscriptions: user._id } },
      null,
    );
    await User.findByIdAndUpdate(
      req.params.id,
      { subscribers: user.subscribers + 1 },
      null,
    );
    return res.status(200).json({ message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const unsubscribe = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, null, null);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (req.params.id === req.user._id.toString())
      return res
        .status(403)
        .json({ message: "Forbidden. Cannot unsubscribe from yourself" });
    const currentUser = await User.findById(req.user._id, null, null);
    if (!currentUser.subscriptions.includes(user._id))
      return res.status(403).json({ message: "Forbidden. Not subscribed yet" });
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { subscriptions: user._id } },
      null,
    );
    await User.findByIdAndUpdate(
      req.params.id,
      { subscribers: user.subscribers - 1 },
      null,
    );
    return res.status(200).json({ message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default { getUsers, getUser, subscribe, unsubscribe, ban, unban };
