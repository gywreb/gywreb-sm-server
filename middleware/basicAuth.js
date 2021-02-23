const { ErrorResponse } = require("../models/ErrorResponse");

const basicAuth = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Basic")
  )
    token = req.headers.authorization.split(" ")[1];
  if (!token) return next(new ErrorResponse(401, "basic token is required"));
  const decode = new Buffer.from(token, "base64").toString();
  if (
    decode === `${process.env.BASICAUTH_USER}:${process.env.BASICAUTH_PASSWORD}`
  ) {
    next();
  } else return next(new ErrorResponse(401, "invalid token"));
};

module.exports = basicAuth;
