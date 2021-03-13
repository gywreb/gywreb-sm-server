const mongoose = require("mongoose");

const { Schema } = mongoose;

const TokenSchema = new Schema({
  userId: Schema.Types.ObjectId,
  email: String,
  token: String,
  expiredIn: Date,
});

module.exports = mongoose.model("Token", TokenSchema, "tokens");
