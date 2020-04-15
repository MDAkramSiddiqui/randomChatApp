const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema({
  user: {
    type: mongoose.Schema.objectId,
    ref: "User",
    unique: true,
  },
  messages: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
