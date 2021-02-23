const { ErrorResponse } = require("../models/ErrorResponse");

exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };

  // mongoose validation
  if (err.name === "ValidationError") {
    error = new ErrorResponse(400, {});
    for (let errorProp in err.errors) {
      error.message[errorProp] = err.errors[errorProp].message;
    }
  }

  // mongoose duplicate key
  if (err.code === 11000) {
    error = new ErrorResponse(400, {});
    for (let key in err.keyValue) {
      error.message[key] = `${err.keyValue[key]} is already existed`;
    }
  }

  console.log(err.name);
  console.log(err.errors);

  res.status(error.code || 500).json({
    success: false,
    code: error.code || 500,
    message: error.message || "server error",
  });

  next();
};

// module.exports = errorHandler;
