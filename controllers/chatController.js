const path = require('path');

const logger = require('../utils/logger');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const ChatRoom = require('../models/chatRoomModel');
const Chat = require('../models/chatModel');

const scriptName = path.basename(__filename);

exports.postMessage = catchAsync(async (req, res, next) => {
  logger.info({ file: scriptName, fn: 'postMessage()', args: 'REQ | RES | NEXT' });
  const { chatRoomHandle } = req.body;
  const { message } = req.body;

  if (!chatRoomHandle) next(new AppError('Please provide a correct chatroom id.', 403));
  const currentChatRoom = await ChatRoom.findOne({ chatRoomHandle });
  if (!currentChatRoom) next(new AppError('Please provide correct chatroom and user id.', 403));

  const currentMessage = await Chat.create({
    chatRoomId: currentChatRoom.id,
    userId: req.user.id,
    userHandle: req.user.handle,
    message,
    chatRoomHandle,
    expiresAt: currentChatRoom.expiresAt,
  });

  res.status(201).json({
    status: 'success',
    data: { currentMessage },
  });
});

exports.getChatRoomChat = catchAsync(async (req, res, next) => {
  logger.info({ file: scriptName, fn: 'getChatRoomChat()', args: 'REQ | RES | NEXT' });

  const { chatRoomHandle } = req.params;
  if (!chatRoomHandle) next(new AppError('Please provide correct chatroom id', 403));

  const currentChatRoom = await ChatRoom.findOne({ chatRoomHandle });
  if (!currentChatRoom) next(new AppError('Please provide correct chatroom and user id.', 403));

  const messages = await Chat.find({ chatRoomHandle });
  res.status(201).json({
    status: 'success',
    data: {
      messages,
    },
  });
});
