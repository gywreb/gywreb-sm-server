const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    comment: {
      type: String,
      required: [true, "comment is required"],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema, "comments");
