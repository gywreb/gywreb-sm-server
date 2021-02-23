const User = require("../database/models/User");
const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const _ = require("lodash");
const crypto = require("crypto");
const { EmailService } = require("../services/EmailService");

exports.register = asyncMiddleware(async (req, res, next) => {
  const { displayName, email, password } = req.body;

  // init email sending service
  EmailService.init();
  const confirmToken = crypto.randomBytes(20).toString("hex");
  const confirmTokenExtend = crypto.randomBytes(100).toString("hex");
  const confirmEmailToken = crypto
    .createHash("sha256")
    .update(confirmToken)
    .digest("hex");

  const newUser = new User({
    displayName,
    email,
    password,
    confirmEmailToken,
  });
  const user = await newUser.save();

  // confirm email token send
  if (user) {
    const confirmTokenCombined = `${confirmToken}.${confirmTokenExtend}`;
    const confirmUrl = `${process.env.FE_URL}/confirmemail?token=${confirmTokenCombined}`;

    await EmailService.sendEmail(
      email,
      "Confirm your email!",
      `Click the link below to finish your confirmation:\n\n${confirmUrl}`,
      next
    );
  }
  res
    .status(201)
    .json(
      new SuccessResponse(201, { user, message: "Please check your email!" })
    );
});

exports.login = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new ErrorResponse(404, "user not found"));
  const isMatched = await user.passwordValidation(password);
  if (!isMatched) return next(new ErrorResponse(400, "password is incorrect"));
  const token = User.genJwt(_.omit(user._doc, "password", "_id", "__v"));
  res.status(200).json(new SuccessResponse(200, token));
});
