const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    displayName: {
      type: String,
      required: [true, "display name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      min: [8, "password must be at least 8 characters"],
    },
    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },
    confirmEmailToken: {
      type: String,
    },
    phone: {
      type: Number,
    },
    birthday: {
      type: Date,
    },
    location: {
      type: String,
    },
    image: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    // posts: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Post",
    //   },
    // ],
    // comments: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Comment",
    //   },
    // ],
    // likes: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Like",
    //   },
    // ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Follow",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "Follow",
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) next();
  try {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.passwordValidation = async function (pasword) {
  return await bcrypt.compare(pasword, this.password);
};

UserSchema.statics.genJwt = function (payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("User", UserSchema, "users");
