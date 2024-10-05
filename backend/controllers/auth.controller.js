import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { genAccessToken, genRefreshToken } from "../utils/genTokens.js";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../utils/setCookies.js";
import transporter from "../utils/email.js";
import { randomUUID } from "crypto";
import speakeasy from "speakeasy";

const verify2FA = (token, secret) => {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
  });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ email }, "_id", null);
    if (user) return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      name,
      email,
      activationCode: Math.floor(1000 + Math.random() * 9000),
      password: hashedPassword,
    });
    return res.status(201).json({ message: "Successes" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  const { email, password, token } = req.body;
  try {
    const user = await User.findOne(
      { email },
      "_id password ban isActivated isTwoFactorEnabled twoFactorSecret name isAdmin avatar",
      null,
    );
    if (!user) return res.status(400).json({ message: "User does not exist" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });
    if (user.ban.status) {
      return res.status(403).json({
        banReason: user.ban,
        message: "User is banned",
      });
    }
    if (!user.isActivated)
      return res.status(403).json({
        message: "Please, activate your account",
        reason: "activation",
      });
    if (user.isTwoFactorEnabled) {
      if (token) {
        const isVerified = speakeasy.totp.verify({
          secret: user.twoFactorSecret,
          encoding: "base32",
          token,
        });
        if (!isVerified)
          return res.status(403).json({ message: "Incorrect token" });
      } else
        return res
          .status(403)
          .json({ message: "You need to verify your identity", reason: "2FA" });
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

const googleOAuth = async (req, res) => {
  const { name, email } = req.body;
  try {
    let user = await User.findOne(
      { email },
      "_id ban name isAdmin avatar",
      null,
    );
    if (!user) {
      const hashedPassword = bcrypt.hashSync(
        Math.random().toString(36).slice(-8),
        12,
      );
      await User.create({
        name,
        email,
        password: hashedPassword,
        isActivated: true,
	activationCode: "0000",
      });
    }
    if (user?.ban?.status) {
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
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const verifyViaEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }, "_id activationCode", null);
    if (!user) return res.status(404).json({ message: "User not found" });
    const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Activation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .container {
                background-color: #f9f9f9;
                border-radius: 5px;
                padding: 30px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            h1 {
                text-align: center;
                color: #001B60;
                margin-bottom: 20px;
            }
            .activation-code {
                font-size: 32px;
                font-weight: bold;
                color: #001B60;
                letter-spacing: 5px;
                text-align: center;
                margin: 30px 0;
                padding: 10px;
                background-color: #eef8ff;
                border-radius: 5px;
            }
            .footer {
                margin-top: 30px;
                font-size: 12px;
                color: white;
                padding: 8px;
                border-radius: 5px;
                background: #001B60;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Account Activation</h1>
            <p>Thank you for signing up! To activate your account, use the following activation code:</p>
            <div class="activation-code">${user.activationCode}</div>
            <p>If you didn't request this activation, ignore this email or contact our support team if you have any concerns.</p>
            <div class="footer">
                <p>This is an automated message, do not reply to this email.</p>
                <p>&copy; 2024 BlogBugster. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;

    const mailOptions = {
      from: process.env.GOOGLE_EMAIL,
      to: email,
      subject: "Account Activation Code",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Activation code sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const verifyAccount = async (req, res) => {
  const { activationCode, email } = req.body;
  try {
    const user = await User.findOne({ email }, "_id activationCode", null);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.activationCode !== Number(activationCode))
      return res.status(400).json({ message: "Invalid activation code" });
    await User.findByIdAndUpdate(user._id, { isActivated: true }, null);
    return res.status(200).json({ message: "Account successfully activated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }, "_id", null);
    if (!user) return res.status(404).json({ message: "User not found" });
    const resetToken = randomUUID();
    await User.findByIdAndUpdate(
      user._id,
      {
        resetPasswordToken: resetToken,
        resetPasswordExpires: Date.now() + 3600000,
      },
      null,
    );
    const resetURL = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;
    const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .container {
                background-color: #f9f9f9;
                border-radius: 5px;
                padding: 30px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #001B60;
                margin-bottom: 20px;
            }
            .reset-button a {
                color: white;
            }
            .reset-button {
                display: inline-block;
                font-size: 16px;
                font-weight: bold;
                color: #ffffff;
                background-color: #001B60;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .footer {
                margin-top: 30px;
                font-size: 12px;
                padding: 8px;
                border-radius: 5px;
                color: white;
                background: #001B60;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Password Reset Request</h1>
            <p>You are receiving this email because a password reset was requested for your account.</p>
            <p>To reset your password, click the button below:</p>
            <a href="${resetURL}" class="reset-button">Reset Password</a>
            <p>If the button above doesn't work, you can copy and paste the following link into your browser:</p>
            <p>${resetURL}</p>
            <p>If you did not request this password reset, ignore this email and your password will remain unchanged.</p>
            <div class="footer">
                <p>This is an automated message, do not reply to this email.</p>
                <p>&copy; 2024 Your Company Name. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;

    const mailOptions = {
      from: process.env.GOOGLE_EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ msg: "Password reset email sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const isValidToken = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ resetPasswordToken: token }, "_id", null);
    if (!user) return res.status(404).json({ message: "Token not found" });
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const resetPassword = async (req, res) => {
  const { newPassword, token } = req.body;
  try {
    const user = await User.findOne(
      {
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      },
      "_id email",
      null,
    );
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
      null,
    );
    const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Changed Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .container {
                background-color: #f9f9f9;
                border-radius: 5px;
                padding: 30px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #001B60;
                margin-bottom: 20px;
            }
            .highlight {
                font-weight: bold;
                color: #001B60;
            }
            .footer {
                margin-top: 30px;
                font-size: 12px;
                padding: 8px;
                border-radius: 5px;
                color: white;
                background: #001B60;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Password Changed Successfully</h1>
            <p>This is a confirmation that the password for your account <span class="highlight">${user.email}</span> has just been changed.</p>
            <p>If you did not make this change, contact our support team immediately.</p>
            <p>For security reasons, we recommend that you:</p>
            <ul>
                <li>Use unique passwords for all your online accounts</li>
                <li>Enable two-factor authentication where possible</li>
                <li>Regularly update your passwords</li>
            </ul>
            <div class="footer">
                <p>This is an automated message, do not reply to this email.</p>
                <p>&copy; 2024 Your Company Name. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;
    const mailOptions = {
      from: process.env.GOOGLE_EMAIL,
      to: user.email,
      subject: "Your password has been changed",
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
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
    await jwt.verify(
      refresh_token,
      process.env.JWT_REFRESH_SECRET,
      async (error, user) => {
        if (error)
          return res
            .status(401)
            .json({ message: "Token is not valid, please login" });
        const isExist = await User.findById(user.id, "_id", null);
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

export default {
  register,
  login,
  logout,
  refresh,
  googleOAuth,
  verifyViaEmail,
  verifyAccount,
  verify2FA,
  forgotPassword,
  isValidToken,
  resetPassword,
};
