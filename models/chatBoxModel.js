const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatBoxSchema = new Schema({
  owner: {
    type: mongoose.Schema.objectId,
    ref: "User",
    required: [true, "Chat room required a owner."],
  },
  users: [
    {
      type: mongoose.Schema.objectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  expiresAt: {
    type: Date,
    default: Date.now() + 10 * 60 * 1000,
  },
});

const ChatBox = mongoose.model("ChatBox", chatBoxSchema);

module.exports = ChatBox;
