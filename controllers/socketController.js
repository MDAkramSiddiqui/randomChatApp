const path = require('path');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const socketio = require('socket.io');

const catchAsync = require('../utils/catchAsync');
const logger = require('../utils/logger');
const User = require('../models/userModel');

const scriptName = path.basename(__filename);

exports.performSocketConnection = (server) => {
  logger.info({ file: scriptName, fn: 'performSocketConnection()', args: 'SERVER' });
  let allowSocketConnection = false;
  const io = socketio.listen(server);
  io.on(
    'connection',
    catchAsync(async (socket) => {
      const TOKEN_REGEX = /(?<=Bearer%20)[^ ,;\]})]*/g;
      const jwtToken = TOKEN_REGEX.exec(socket.handshake.headers.cookie);
      // console.log(socket.handshake.headers, '\n', jwtToken[0]);
      if (jwtToken) {
        const decoded = await promisify(jwt.verify)(jwtToken[0], process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);
        if (currentUser) allowSocketConnection = true;
      }

      if (allowSocketConnection) {
        logger.info(
          {
            file: scriptName,
            event: 'connection',
          },
          `Socket Connection Authenticated, connected to ${socket.id}`,
        );

        io.emit('connected', socket.id);

        socket.on('joinRoom', (room) => {
          logger.info(`Socket Joined Room ${room}`);
          socket.join(room);
          socket.broadcast.in(room).emit('roomJoined', room);
        });

        socket.on('deleteChatRoom', (room) => {
          socket.broadcast.in(room).emit('roomDeleted', room);
        });

        socket.on('leaveChatRoom', (room) => {
          socket.leave(room);
        });

        socket.on('newMessage', (data) => {
          socket.broadcast.in(data.chatRoomHandle).emit('newMessage', data.message);
        });
      } else {
        logger.info({ file: scriptName, event: 'connection' }, 'Socket Connection refused');
      }

      socket.on('disconnect', () => {
        allowSocketConnection = false;
        logger.info({ file: scriptName, event: 'disconnect' }, 'Socket Connection disconnected');
        socket.disconnect(0);
      });
    }),
  );
};
