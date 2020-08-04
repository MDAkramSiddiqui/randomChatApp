const path = require('path');
const crypto = require('crypto');

const logger = require('../utils/logger');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const ChatRoom = require('../models/chatRoomModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

const scriptName = path.basename(__filename);

/**
 * createRoom Function :- Creates a room
 */

exports.createRoom = catchAsync(async (req, res, next) => {
  logger.info({ file: scriptName, fn: 'createRoom()', args: 'REQ | RES | NEXT' });

  if (!req.body.chatRoomHandle || !req.body.chatRoomPassword) {
    next(new AppError('Please provide a valid chatroom id/name and password.', 400));
  }

  const chatRoomHandle = `${req.body.chatRoomHandle}_${crypto.randomBytes(4).toString('hex')}`;

  const currentChatRoom = await ChatRoom.create({
    chatRoomHandle,
    chatRoomPassword: req.body.chatRoomPassword,
    owner: req.user.id,
  });

  // Pushing the current user id to the current chatroom
  currentChatRoom.users.addToSet(req.user.id);
  await currentChatRoom.save();

  // Pushing the current chatroom id to the current user
  const currentUser = await User.findById(req.user.id);
  currentUser.chatRooms.addToSet(currentChatRoom.id);
  await currentUser.save();

  return res.status(req.statusCode || 200).json({
    status: 'success',
    data: {
      chatRoomHandle: currentChatRoom.chatRoomHandle,
      owner: currentChatRoom.owner,
    },
  });
});

exports.joinRoom = catchAsync(async (req, res, next) => {
  logger.info({ file: scriptName, fn: 'joinRoom()', args: 'REQ | RES | NEXT' });

  if (!req.body.chatRoomHandle || !req.body.chatRoomPassword) {
    next(new AppError('Please enter a valid ChatRoom handle or password.', 401));
  }

  const currentChatRoom = await ChatRoom.findOne({
    chatRoomHandle: req.body.chatRoomHandle,
  });

  const currentCharRoomPasswordValidate = await currentChatRoom.checkPassword(
    req.body.chatRoomPassword,
    currentChatRoom.chatRoomPassword,
  );

  if (!currentChatRoom || !currentCharRoomPasswordValidate) {
    next(new AppError('Please enter a valid ChatRoom handle and password.', 401));
  }

  // Pushing the current user id to the current chatroom
  currentChatRoom.users.addToSet(req.user.id);
  await currentChatRoom.save();

  // Pushing the current chatroom id to the current user
  const currentUser = await User.findById(req.user.id);
  currentUser.chatRooms.addToSet(currentChatRoom.id);
  await currentUser.save();

  res.status(201).json({
    status: 'sucess',
    data: {
      owner: currentChatRoom.owner,
      chatRoomHandle: currentChatRoom.chatRoomHandle,
    },
  });
});

exports.leaveChatRoom = catchAsync(async (req, res, next) => {
  logger.info({ file: scriptName, fn: 'leaveChatRoom()', args: 'REQ | RES | NEXT' });

  if (!req.params.chatRoomId) next(new AppError('ChatRoom ID is Missing', 404));

  const currentChatRoom = await ChatRoom.findById(req.params.chatRoomId);
  const currentUser = await User.findById(req.user.id);

  if (!currentChatRoom || !currentUser) next(new AppError('Incorrect ChatRoom ID provided', 401));

  currentChatRoom.users.pull(req.user.id);
  await currentChatRoom.save();

  currentUser.chatRooms.pull(req.params.chatRoomId);
  await currentUser.save();

  res.status(201).json({
    status: 'success',
    data: { currentChatRoom },
  });
});

exports.deleteChatRoom = catchAsync(async (req, res, next) => {
  logger.info({ file: scriptName, fn: 'deleteChatRoom()', args: 'REQ | RES | NEXT' });

  if (!req.params.chatRoomId) next(new AppError('ChatRoom ID is Missing', 404));

  await Chat.deleteMany({ chatRoomId: req.params.chatRoomId });
  await ChatRoom.findByIdAndDelete(req.params.chatRoomId);

  res.status(204).json({
    status: 'success',
    data: {},
  });
});

// Only for admin
exports.getAllChatRooms = catchAsync(async (req, res) => {
  logger.info({ file: scriptName, fn: 'getAllChatRooms()', args: 'REQ | RES' });

  const chatRooms = await ChatRoom.find();
  res.status(201).json({
    status: 'success',
    results: chatRooms.length,
    data: {
      chatRooms,
    },
  });
});
