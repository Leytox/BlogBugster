import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    activationCode: {},
    about: {
      type: String,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    ban: {
      status: {
        type: Boolean,
        default: false,
      },
      reason: {
        type: String,
        default: null,
      },
      date: {
        type: Date,
        default: null,
      },
    },
    avatar: {
      type: String,
      default: "uploads/users/default.png",
    },
    social: {
      facebook: {
        type: String,
        default: null,
      },
      twitter: {
        type: String,
        default: null,
      },
      github: {
        type: String,
        default: null,
      },
      linkedin: {
        type: String,
        default: null,
      },
    },
    country: {
      type: String,
      default: null,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    views: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    commentLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    subscriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    subscribers: {
      type: Number,
      default: 0,
    },
    twoFactorSecret: {
      type: String,
      default: null,
    },
    isTwoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorBackupCodes: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
