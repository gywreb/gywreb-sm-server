const Comment = require("../database/models/Comment");
const Post = require("../database/models/Post");
const User = require("../database/models/User");
const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const { SuccessResponse } = require("../models/SuccessResponse");

exports.createComment = asyncMiddleware(async (req, res, next) => {
  const { content, postId } = req.body;
  const newComment = new Comment({
    content,
    author: req.user._doc._id,
    post: postId,
  });

  const comment = await newComment.save();

  await User.findByIdAndUpdate(
    { _id: req.user._doc._id },
    { $push: { comment: comment._id } }
  );

  await Post.findByIdAndUpdate(
    { _id: postId },
    { $push: { comment: comment._id } }
  );

  res.status(200).json(new SuccessResponse(200, comment));
});

const updateComment = asyncMiddleware(async (req, res, next) => {
  const { newContent } = req.body;
  const { commentId } = req.params;

  const comment = await Comment.findOneAndUpdate(
    { _id: commentId },
    { content: newContent }
  );

  await User.findOneAndUpdate({});
});
