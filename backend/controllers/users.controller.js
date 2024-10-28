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
    const posts = await Post.find(
      { author: req.params.id },
      "-content -__v -updatedAt -comments",
      null,
    );
    return res.status(200).json({ user, posts, message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getUserSubscriptions = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id, "_id subscriptions", null)
      .select("subscriptions")
      .populate("subscriptions", "avatar name _id");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res
      .status(200)
      .json({ message: "Success", subscriptions: user.subscriptions });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getUsers = async (req, res) => {
  const { page, limit, searchTerm, sortOrder } = req.query;
  console.log(page, limit, searchTerm);
  const skip = (page - 1) * limit;
  try {
    let query = {};
    if (searchTerm) query.name = { $regex: searchTerm, $options: "i" };
    const users = await User.find(
      query,
      " _id avatar name subscribers ban",
      null,
    )
      .skip(skip)
      .sort({ createdAt: sortOrder === "new" ? -1 : 1 })
      .limit(limit);
    const total = await User.countDocuments(query);
    return res.status(200).json({ users, total, message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const ban = async (req, res) => {
  const { reason } = req.body;
  try {
    const user = await User.findById(req.params.id, "isAdmin ban", null);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isAdmin) return res.status(403).json({ message: "Forbidden" });
    if (user.ban.status)
      return res.status(403).json({ message: "User is already banned" });
    await User.findByIdAndUpdate(
      req.params.id,
      { ban: { status: true, reason, date: Date.now() } },
      null,
    );
    return res.status(200).json({ message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const unban = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "isAdmin ban", null);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.ban.status)
      return res.status(403).json({ message: "User is not banned" });
    await User.findByIdAndUpdate(
      req.params.id,
      { ban: { status: false, reason: null, date: null } },
      null,
    );
    return res.status(200).json({ message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const subscribe = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "_id subscribers", null);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (req.params.id === req.user._id.toString())
      return res
        .status(403)
        .json({ message: "Forbidden. Cannot subscribe to yourself" });
    const currentUser = await User.findById(
      req.user._id,
      "_id subscriptions",
      null,
    );
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
    const user = await User.findById(req.params.id, "_id subscribers", null);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (req.params.id === req.user._id.toString())
      return res
        .status(403)
        .json({ message: "Forbidden. Cannot unsubscribe from yourself" });
    const currentUser = await User.findById(
      req.user._id,
      "_id subscriptions",
      null,
    );
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

export default {
  getUsers,
  getUser,
  getUserSubscriptions,
  subscribe,
  unsubscribe,
  ban,
  unban,
};
