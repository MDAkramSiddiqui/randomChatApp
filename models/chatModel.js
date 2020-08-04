const mongoose = require('mongoose');

const { Schema } = mongoose;

const chatSchema = new Schema({
  chatRoomId: {
    type: mongoose.Schema.ObjectId,
    ref: 'ChatRoom',
  },
  chatRoomHandle: String,
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  userHandle: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  expiresAt: {
    type: Date,
  },
});

// Message Format
/**
 * time-/-userid-/-message
 */

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
