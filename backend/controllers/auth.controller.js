import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { genAccessToken, genRefreshToken } from "../utils/genTokens.js";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../utils/setCookies.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ email }, null, null);
    if (user) return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({ message: "Successes" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }, null, null);
    if (!user) return res.status(400).json({ message: "User does not exist" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });
    if (user.ban.status) {
      console.log({ banReason: user.ban, message: "User is banned" });
      return res.status(403).json({
        banReason: user.ban,
        message: "User is banned",
      });
    }
    const access_token = genAccessToken(user);
    const refresh_token = genRefreshToken(user);
    setAccessTokenCookie(res, access_token);
    setRefreshTokenCookie(res, refresh_token);
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
      },
      message: "Successes",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const logout = async (req, res) => {
  return res
    .cookie("access_token", "", {
      httpOnly: true,
      maxAge: new Date(0),
      sameSite: "strict",
      path: "/",
    })
    .cookie("refresh_token", "", {
      httpOnly: true,
      maxAge: new Date(0),
      sameSite: "strict",
      path: "/",
    })
    .status(200)
    .json({ message: "Logged out" });
};

const refresh = async (req, res) => {
  const { refresh_token } = req.cookies;
  try {
    if (!refresh_token)
      return res.status(401).json({ message: "No token, please login" });
    jwt.verify(
      refresh_token,
      process.env.JWT_REFRESH_SECRET,
      async (err, user) => {
        if (err)
          return res
            .status(401)
            .json({ message: "Token is not valid, please login" });
        const isExist = await User.findById(user.id, null, null);
        if (!isExist)
          return res
            .status(400)
            .json({ message: "User does not exist, please register" });
        const access_token = genAccessToken(user);
        setAccessTokenCookie(res, access_token);
        return res.status(200).json({ message: "Success" });
      },
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default { register, login, logout, refresh };
