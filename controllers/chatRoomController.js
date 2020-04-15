const path = require("path");
const crypto = require("crypto");

const logger = require("./../utils/logger");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const ChatRoom = require("./../models/chatRoomModel");

const scriptName = path.basename(__filename);

exports.createRoom = catchAsync(async (req, res, next) => {
  logger.debug(`${scriptName}, createRoom(), { req, res, next }`);

  const chatRoomHandle = crypto.randomBytes(6).toString("hex");
  const chatRoomPassword = crypto.randomBytes(3).toString("hex");

  const currentChatRoom = await ChatRoom.create({
    chatRoomHandle,
    chatRoomPassword,
    owner: req.user.id,
    users: [req.user.id],
  });

  // const currentChatRoom = {};
  console.log(req.user);
  return res.status(req.statusCode || 200).json({
    status: "success",
    data: currentChatRoom,
  });
});

exports.joinRoom = catchAsync(async (req, res, next) => {
  logger.debug(`${scriptName}, joinRoom(), { req, res, next }`);

  if (!req.body.chatRoomHandle || !req.body.chatRoomPassword)
    next(
      new AppError("Please enter a valid ChatRoom handle or password.", 400)
    );

  const currentChatRoom = await ChatRoom.findOne({
    chatRoomHandle: req.body.chatRoomHandle,
    chatRoomPassword: req.body.chatRoomPassword,
  });

  if (!currentChatRoom)
    next(new AppError("Please enter a valid ChatRoom handle.", 400));

  let usersArr = currentChatRoom.users;
  usersArr.push(req.user);
  currentChatRoom.users = usersArr;
  await currentChatRoom.save();

  res.status(201).json({
    status: "sucess",
    data: currentChatRoom,
  });
});

exports.getAllChatRooms = catchAsync(async (req, res, next) => {
  const chatRooms = await ChatRoom.find();
  res.status(201).json({
    status: "success",
    results: chatRooms.length,
    data: {
      chatRooms,
    },
  });
});
