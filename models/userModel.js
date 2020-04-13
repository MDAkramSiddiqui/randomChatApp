const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  handle: {
    type: String,
    required: [true, "User name is required"],
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  expiresAt: {
    type: Date,
    default: Date.now() + 24 * 60 * 60 * 1000,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
