const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatBoxSchema = new Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Review must belong to a user"],
  },
  chatRoomHandle: {
    type: String,
    required: [true, "Chat Room handle is required."],
    unique: true,
  },
  chatRoomPassword: {
    type: String,
    required: [true, "Chat Room Password is required."],
  },
  users: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  messages: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  expiresAt: {
    type: Date,
    default: Date.now() + 10 * 60 * 1000,
  },
});

chatBoxSchema.pre(/^find/, function (next) {
  this.populate({
    path: "owner",
    select: "handle",
  }).populate({
    path: "users",
    select: "handle",
  });

  next();
});

const ChatBox = mongoose.model("ChatBox", chatBoxSchema);

module.exports = ChatBox;
