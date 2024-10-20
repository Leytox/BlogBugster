import User from "../models/user.model.js";
import Post from "../models/post.model.js";

const getMetrics = async (req, res) => {
  try {
    const postsOverTime = await Post.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const postsCategories = await Post.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const usersOverTime = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const bansOverTime = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$ban.date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      postsOverTime,
      postsCategories,
      usersOverTime,
      bansOverTime,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching metrics", error });
  }
};

export default { getMetrics };
