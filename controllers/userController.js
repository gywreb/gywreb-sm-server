const User = require("../database/models/User");
const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const { SuccessResponse } = require("../models/SuccessResponse");

exports.getAllUser = asyncMiddleware(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(new SuccessResponse(200, users));
});
