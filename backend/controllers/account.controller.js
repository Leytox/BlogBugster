import User from "../models/user.model.js";
import * as fs from "node:fs";

const getAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "-password -_id -__v", null);
    return res.status(200).json({ user, message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const updateAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, req.body, null);
    return res.status(200).json({ message: "Account updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const uploadImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, null);
    if (user.avatar !== "uploads/users/default.png")
      fs.unlinkSync(`./${user.avatar}`);
    await User.findByIdAndUpdate(
      req.user.id,
      { avatar: "uploads/users/" + req.file.filename },
      null,
    );
    return res.status(200).json({ message: "Image uploaded" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, null, null);
    if (user.avatar === "uploads/users/default.png")
      return res.status(400).json({ message: "No image to delete found" });
    if (user.avatar !== "uploads/users/default.png")
      fs.unlinkSync(`./${user.avatar}`);
    await User.findByIdAndUpdate(
      req.user.id, // user id
      { avatar: "uploads/users/default.png" },
      null,
    );
    return res.status(200).json({ message: "Image deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id, null);
    return res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default {
  getAccount,
  updateAccount,
  uploadImage,
  deleteImage,
  deleteAccount,
};
