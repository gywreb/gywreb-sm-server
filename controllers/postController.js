const Post = require("../database/models/Post");
const User = require("../database/models/User");
const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const { ErrorResponse } = require("../models/ErrorResponse");
const { SuccessResponse } = require("../models/SuccessResponse");

exports.getPosts = asyncMiddleware(async (req, res, next) => {
  const posts = await Post.find()
    .populate("author", "following followers notifications.author")
    .populate("likes")
    .populate({ path: "comments", options: { sort: { createAt: "desc" } } })
    .sort({ createAt: "desc" });
  if (!posts) return next(new ErrorResponse(404, "posts not found"));
  res.status(200).json(new SuccessResponse(200, posts));
});

exports.getPost = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findOne({ _id: id })
    .populate("author", "following followers")
    .populate("likes")
    .populate({ path: "comments", options: { sort: { createAt: "desc" } } })
    .sort({ createAt: "desc" });
  if (!post) return next(new ErrorResponse(404, "post not found"));
  res.status(200).json(new SuccessResponse(200, post));
});

exports.createPost = asyncMiddleware(async (req, res, next) => {
  const { caption } = req.body;

  const newPost = new Post({
    caption,
    author: req.user._doc._id,
    image: req.file ? req.file.filename : null,
  });

  const post = await newPost.save();

  await User.findOneAndUpdate({ _id: author }, { $push: { posts: post.id } });

  res.status(201).json(new SuccessResponse(201, post));
});
