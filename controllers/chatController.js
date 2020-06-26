const path = require("path");
const crypto = require("crypto");

const logger = require("./../utils/logger");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const ChatRoom = require("./../models/chatRoomModel");
const User = require("./../models/userModel");
const Chat = require("../models/chatModel");

const scriptName = path.basename(__filename);

exports.postMessage = catchAsync(async (req, res, next) => {
  logger.debug(`${scriptName}, postMessage, (req, res, next)`);
  const chatRoomHandle = req.body.chatRoomHandle;
  const message = req.body.message;

  if (!chatRoomHandle)
    next(new AppError("Please provide a correct chatroom id.", 403));
  const currentChatRoom = await ChatRoom.findOne({ chatRoomHandle });
  if (!currentChatRoom)
    next(new AppError("Please provide correct chatroom and user id.", 403));

  const currentMessage = await Chat.create({
    chatRoomId: currentChatRoom.id,
    userId: req.user.id,
    userHandle: req.user.handle,
    message,
    chatRoomHandle,
    expiresAt: currentChatRoom.expiresAt,
  });

  res.status(201).json({
    status: "success",
    data: { currentMessage },
  });
});

exports.getChatRoomChat = catchAsync(async (req, res, next) => {
  logger.debug(`${scriptName}, getChatRoomChat, (req, res, next)`);
  const chatRoomHandle = req.params.chatRoomHandle;
  if (!chatRoomHandle)
    next(new AppError("Please provide correct chatroom id", 403));

  const currentChatRoom = await ChatRoom.findOne({ chatRoomHandle });
  if (!currentChatRoom)
    next(new AppError("Please provide correct chatroom and user id.", 403));

  const messages = await Chat.find({ chatRoomHandle });
  res.status(201).json({
    status: "success",
    data: {
      messages,
    },
  });
});
