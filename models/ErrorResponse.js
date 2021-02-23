exports.ErrorResponse = class ErrorResponse {
  constructor(code, message) {
    this.success = true;
    this.code = code;
    this.message = message;
  }
};
