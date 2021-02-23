const mongoose = require("mongoose");
const { Schema } = mongoose;

const FollowSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Follow", FollowSchema, "follows");
