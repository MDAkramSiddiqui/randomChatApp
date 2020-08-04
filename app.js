const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const chatRouter = require('./routes/chatRouter');
// const viewRouter = require("./routes/viewRouter");
const chatRoomRouter = require('./routes/chatRoomRouter');
const userRouter = require('./routes/userRouter');
const globalErrorHandler = require('./utils/globalErrorHandler');
const cronJob = require('./cron');
const logger = require('./utils/logger');

cronJob.removeExpire();

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(cors({ origin: ['http://toruoy.herokuapp.com', 'https://toruoy.herokuapp.com'], optionsSuccessStatus: 200 }));
app.options('*', cors());

app.use(express.json({ limit: '10Kb' }));
app.use(express.urlencoded({ extended: true, limit: '10Kb' }));
app.use(cookieParser());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.use("/", viewRouter);
app.use('/api/v1/chats', chatRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/chat-room', chatRoomRouter);

// For handling all the unknown routes
app.use('*', (req, res) => {
  // Later render a page here so that it displays 404 page not found
  logger.warn({ file: 'App', fn: 'HandlingUnknownRoutes()', args: { msg: 'Unknown route, please check it.' } });
  res.status(404).json({ status: 'Internal System failure' });
  // next();
});

app.use(globalErrorHandler);

module.exports = app;
