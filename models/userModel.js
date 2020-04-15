const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  handle: {
    type: String,
    required: [true, "User name is required"],
  },
  password: {
    type: String,
    default: undefined,
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

userSchema.pre("save", async function (next) {
  if (this.password) {
    this.password = await bcryptjs.hash(this.password, 12);
  }
  next();
});

userSchema.methods.checkExpired = function () {
  return this.expiresAt.getTime() <= Date.now();
};

userSchema.methods.checkPassword = function (enteredPassword, userPassword) {
  return bcryptjs.compare(enteredPassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
