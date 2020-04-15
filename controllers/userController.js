const path = require("path");
const crypto = require("crypto");
const requestClient = require("request-promise");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const logger = require("./../utils/logger");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const User = require("./../models/userModel");
const ChatRoom = require("./../models/chatRoomModel");

const scriptName = path.basename(__filename);

const signToken = (id) => {
  logger.debug(`${scriptName}, signToken(), { id }`);

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, req, res) => {
  logger.debug(
    `${scriptName}, createAndSendToken(), { user, statusCode, req, res }`
  );

  const token = signToken(user.id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // secure: req.secure,
  });

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.createUser = catchAsync(async (req, res, next) => {
  logger.debug(`${scriptName}, createUser(), { req, res, next }`);
  const username = (
    await requestClient({
      uri: "http://names.drycodes.com/1",
      json: true,
      headers: { "user-agent": "Request-Promise" },
    })
  )[0];

  const handle = `${username}_${crypto.randomBytes(3).toString("hex")}`;
  const currentUser = await User.create({ handle });

  createAndSendToken(currentUser, 201, req, res);
});

exports.leave = catchAsync(async (req, res, next) => {
  logger.debug(`${scriptName}, leave(), { req, res, next }`);

  await User.findByIdAndDelete(req.user.id);
  await ChatRoom.deleteMany({ owner: req.user.id });
  //Delete Messages too

  res.cookie("jwt", "leave-out", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
});

exports.login = catchAsync(async (req, res, next) => {
  logger.debug(`${scriptName}, login(), { req, res, next }`);

  if (!req.body.handle || !req.body.password) {
    next(new AppError("Please provide a handle and password.", 401));
  }

  const admin = await User.findOne({
    handle: req.body.handle,
  });

  if (
    !admin ||
    !(await admin.checkPassword(req.body.password, admin.password))
  ) {
    next(new AppError("Please provide a valid handle and password.", 401));
  }

  createAndSendToken(admin, 201, req, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  logger.debug(`${scriptName}, logout(), { req, res, next }`);

  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
});

exports.isLoggedIn = async (req, res, next) => {
  logger.debug(`${scriptName}, isLoggedIn(), { req, res, next }`);

  if (res.cookie.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      const currentUser = await User.findById(decoded.id);

      if (!currentUser) return next();

      if (currentUser.checkExpired()) return next();

      res.locals.user = currentUser;

      return next();
    } catch (err) {
      return next();
    }
  }
  return next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    logger.debug(`${scriptName}, restrictTo(), { req, res, next }`);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.protect = catchAsync(async (req, res, next) => {
  logger.debug(`${scriptName}, protect(), { req, res, next }`);

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("Your handle has expired, kindly create a new handle.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("This User No longer exist kindly create a New Handle.", 401)
    );
  }

  if (currentUser.checkExpired()) {
    return next(
      new AppError("This User No longer exist kindly create a New Handle.", 401)
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});
