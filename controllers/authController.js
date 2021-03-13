const User = require("../database/models/User");
const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const _ = require("lodash");
const crypto = require("crypto");
const { EmailService } = require("../services/EmailService");
const jwt = require("jsonwebtoken");
const Token = require("../database/models/Token");

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
  if (!user.isEmailConfirmed)
    return next(new ErrorResponse(400, "Please confirm your email"));

  const isMatched = await user.passwordValidation(password);
  if (!isMatched) return next(new ErrorResponse(400, "password is incorrect"));

  const token = User.genJwt(_.omit(user._doc, "password", "_id", "__v"));

  const refresh_token = jwt.sign(
    _.omit(user._doc, "password", "_id", "__v"),
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const salt = crypto.randomBytes(20).toString("hex");

  const hashToken = crypto
    .createHash("sha256")
    .update(refresh_token)
    .digest("hex");

  req.session.refresh_token = hashToken;
  // save refresh token in db(redis or mongodb)

  res
    .status(200)
    .json(new SuccessResponse(200, { token, refresh_token: hashToken }));
});

exports.confirmEmail = asyncMiddleware(async (req, res, next) => {
  const { token } = req.query;
  if (!token) return next(new ErrorResponse(400, "invalid token"));
  const confirmToken = token.split(".")[0];
  const confirmEmailToken = crypto
    .createHash("sha256")
    .update(confirmToken)
    .digest("hex");

  const user = await User.findOneAndUpdate(
    { confirmEmailToken, isEmailConfirmed: false },
    { confirmEmailToken: null, isEmailConfirmed: true }
  );
  if (!user) return next(new ErrorResponse(400, "invalid token"));
  res.status(200).json(new SuccessResponse(200, "Your email is confirmed"));
});

exports.getCurrentUser = (req, res, next) => {
  if (!req.user) return next(new ErrorResponse(401, "unauthorized"));
  res.status(200).json(new SuccessResponse(200, req.user));
};

exports.resetPassword = asyncMiddleware(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return next(new ErrorResponse(404, `user with email: ${email} not found`));

  // generate token
  const token = crypto.randomBytes(20).toString("hex");

  // hash token and save to database
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  await Token.findOneAndUpdate(
    { email },
    {
      userId: user._id,
      email,
      token: hashedToken,
      expiredIn: Date.now() + 1000 * 60,
    },
    { upsert: true }
  );

  // send token to user email
  EmailService.init();

  await EmailService.sendEmail(
    email,
    "Reset Password",
    `Click this link to reset your password: \n\n${process.env.FE_URL}/resetPassword?token=${token}`,
    next
  );

  res
    .status(200)
    .json(
      new SuccessResponse(
        200,
        "PLease check your email for reset password process"
      )
    );
});

exports.updatePassword = asyncMiddleware(async (req, res, next) => {
  const { token } = req.body;

  const hashToken = crypto.createHash("sha256").update(token).digest("hex");

  const dbToken = await Token.findOne({
    token: hashToken,
    expiredIn: { $gt: Date.now() },
  });

  if (!dbToken) return next(new ErrorResponse(400, "invalid token"));

  res.status(200).json(new SuccessResponse(200, "ok"));
});
