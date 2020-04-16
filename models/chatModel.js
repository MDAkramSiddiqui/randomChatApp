const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema({
  chatRoom: {
    type: mongoose.Schema.objectId,
    ref: "ChatRoom",
    unique: true,
  },
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

//Message Format
/**
 * time-/-userid-/-message
 */

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
