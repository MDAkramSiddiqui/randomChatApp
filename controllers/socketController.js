const path = require("path");

const catchAsync = require("./../utils/catchAsync");
const logger = require("./../utils/logger");
const AppError = require("./../utils/appError");
const chatRoomController = require("./chatRoomController");
const chatController = require("./chatController");

const scriptName = path.basename(__filename);

exports.deleteChatRoom = (data) => {
  console.log("socket/deleteChatRoom", data);
};

exports.leaveChatRoom = (data) => {
  console.log("socket/leaveChatRoom", data);
};

exports.postMessage = (data) => {
  console.log("socket/postMessage", data);
};

exports.joinRoom = (data) => {
  console.log("socket/joinRoom", data);
};
