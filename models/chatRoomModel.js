const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const { Schema } = mongoose;

const chatRoomSchema = new Schema({
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
  encryptPassword: {
    type: Boolean,
    default: true,
  },
});

chatRoomSchema.pre(/^find/, function (next) {
  this.populate({
    path: "owner",
    select: "handle",
  }).populate({
    path: "users",
    select: "handle",
  });

  next();
});

chatRoomSchema.pre("save", async function (next) {
  if (!this.encryptPassword) return next();

  this.chatRoomPassword = await bcryptjs.hash(this.chatRoomPassword, 12);
  this.encryptPassword = false;
  next();
});

chatRoomSchema.methods.checkPassword = function (
  enteredPassword,
  chatRoomPassword
) {
  return bcryptjs.compare(enteredPassword, chatRoomPassword);
};

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = ChatRoom;
