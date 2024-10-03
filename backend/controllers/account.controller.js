import User from "../models/user.model.js";
import * as fs from "node:fs";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

const getAccount = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id,
      "about country social isTwoFactorEnabled avatar name likes subscriptions commentLikes",
      null,
    );
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

const verifyPassword = async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findById(req.user.id, "password", null);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });
    return res.status(200).json({ message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const generate2FAToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "isTwoFactorEnabled", null);
    if (user.isTwoFactorEnabled)
      return res.status(403).json({ message: "2FA Already Enabled" });
    const secret = speakeasy.generateSecret({ name: "BlogBugster" });
    QRCode.toDataURL(secret.otpauth_url, async (error, dataUrl) => {
      if (error)
        return res.status(500).json({ message: "Something went wrong" });
      return res.json({
        message: "2FA enabled",
        qrCode: dataUrl,
        secret: secret.base32,
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const enable2FA = async (req, res) => {
  const { token, secret } = req.body;
  try {
    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
    });
    if (!verified)
      return res
        .status(400)
        .json({ message: "Invalid token, please try again" });
    const user = await User.findById(req.user.id, "isTwoFactorEnabled", null);
    if (user.isTwoFactorEnabled)
      return res.status(403).json({ message: "2FA Already Enabled" });
    await User.findByIdAndUpdate(
      req.user.id,
      { twoFactorSecret: secret, isTwoFactorEnabled: true },
      null,
    );
    return res.json({ message: "2FA enabled" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const disable2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "isTwoFactorEnabled", null);
    if (!user.isTwoFactorEnabled)
      return res.status(403).json({ message: "2FA is not enabled" });
    await User.findByIdAndUpdate(
      req.user.id,
      { twoFactorSecret: "", isTwoFactorEnabled: false },
      null,
    );
    return res.status(200).json({ message: "2FA disabled" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "password", null);
    if (!bcrypt.compareSync(req.body.currentPassword, user.password))
      return res.status(400).json({ message: "Incorrect password" });
    const newPassword = bcrypt.hashSync(req.body.newPassword, 12);
    await User.findByIdAndUpdate(req.user.id, { password: newPassword }, null);
    return res.status(200).json({ message: "Password updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "avatar", null);
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

const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "avatar", null);
    if (user.avatar === "uploads/users/default.png")
      return res.status(400).json({ message: "No image to delete found" });
    if (user.avatar !== "uploads/users/default.png")
      fs.unlinkSync(`./${user.avatar}`);
    await User.findByIdAndUpdate(
      req.user.id,
      { avatar: "uploads/users/default.png" },
      null,
    );
    return res.status(200).json({ message: "Image deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//#TODO
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
  uploadAvatar,
  generate2FAToken,
  enable2FA,
  disable2FA,
  verifyPassword,
  changePassword,
  deleteAvatar,
  deleteAccount,
};
