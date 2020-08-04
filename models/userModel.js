const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  handle: {
    type: String,
    required: [true, 'User name is required'],
  },
  password: {
    type: String,
    default: undefined,
  },
  role: {
    type: String,
    default: 'user',
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  expiresAt: {
    type: Date,
    default: Date.now() + 25 * 60 * 60 * 1000,
  },
  chatRooms: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'ChatRoom',
    },
  ],
});

userSchema.pre('save', async function (next) {
  if (this.password) {
    this.password = await bcryptjs.hash(this.password, 12);
  }
  next();
});

userSchema.methods.checkExpired = function () {
  if (this.expiresAt.getTime() - 15 * 60 * 1000 <= Date.now()) {
    if (this.active) {
      this.active = false;
      this.save();
    }
    return true;
  }
  return false;
};

userSchema.methods.checkPassword = function (enteredPassword, userPassword) {
  return bcryptjs.compare(enteredPassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
