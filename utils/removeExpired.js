const path = require("path");

const logger = require("./logger");
const catchAsync = require("./catchAsync");
const User = require("./../models/userModel");
const ChatRoom = require("./../models/chatRoomModel");
const Chat = require("./../models/chatModel");

const scriptName = path.basename(__filename);

exports.removeExpired = catchAsync(async (req, res, next) => {
  logger.info(`${scriptName}, removeExpired(), { res, req, next }`);
  const result = await User.updateMany(
    {
      expiredAt: { $st: new Date(Date.now()) },
    },
    { active: false }
  );
  res.status(200).json({
    status: "success",
    result,
  });
});
