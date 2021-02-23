const express = require("express");
const User = require("../database/models/User");
const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const { jwtAuth } = require("../middleware/jwtAuth");
const { SuccessResponse } = require("../models/SuccessResponse");
const router = express.Router();

router.get(
  "/",
  jwtAuth,
  asyncMiddleware(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json(new SuccessResponse(200, users));
  })
);

module.exports = router;
