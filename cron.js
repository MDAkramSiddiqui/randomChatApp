const nodeCron = require('node-cron');

const logger = require('./utils/logger');
const catchAsync = require('./utils/catchAsync');
const User = require('./models/userModel');
const ChatRoom = require('./models/chatRoomModel');
const Chat = require('./models/chatModel');

const removeExpired = catchAsync(async () => {
  logger.debug('CronJOB, removeExpired(), { res, req, next }');
  const currentTime = new Date(Date.now()).toISOString();

  const userRemoved = await User.deleteMany({
    expiresAt: { $lte: currentTime },
  });

  const chatRoomsRemoved = await ChatRoom.deleteMany({
    expiresAt: { $lte: currentTime },
  });

  const messagesRemoved = await Chat.deleteMany({
    expiresAt: { $lte: currentTime },
  });

  logger.info(
    `${userRemoved.n} users removed, ${chatRoomsRemoved.n} ChatRooms removed, ${messagesRemoved.n} Messages Removed.`,
  );
});

exports.removeExpire = () => {
  nodeCron.schedule('*/30 * * * *', removeExpired);
};
