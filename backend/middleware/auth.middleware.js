import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const userProtect = async (req, res, next) => {
  const { access_token } = req.cookies;
  if (!access_token) return res.status(401).json({ message: "Unauthorized" });
  else {
    try {
      const decoded = jwt.verify(access_token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.id, null, null).select("ban");
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      if (user.ban.isBanned)
        return res
          .status(403)
          .json({ message: "User is banned", reason: user.ban.reason });
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
  }
};

export const adminProtect = async (req, res, next) => {
  const { access_token } = req.cookies;
  if (!access_token) return res.status(401).json({ message: "Unauthorized" });
  else {
    try {
      const decoded = jwt.verify(access_token, process.env.JWT_ACCESS_SECRET);
      const admin = await User.findById(decoded.id, null, null).select(
        "-password, -subscriptions",
      );
      if (!admin) return res.status(401).json({ message: "Unauthorized" });
      if (admin.isAdmin) {
        req.admin = admin;
        next();
      } else return res.status(403).json({ message: "Forbidden" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Unauthorized, invalid token" });
    }
  }
};
