const socket = require("socket.io");
const http = require("http");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const socketController = require("./controllers/socketController");
const mongoose = require("mongoose");
const app = require("./app");

if (process.env.NODE_ENV === "development") {
  const DB = process.env.DATABASE.replace(
    "<password>",
    process.env.DATABASE_PASSWORD
  ).replace("<database>", process.env.DATABASE_DEV);
  mongoose
    .connect(DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then((res) => console.log("Connected to Dev Database."))
    .catch((err) => console.error(err));
} else if (process.env.NODE_ENV === "production") {
  const DB = process.env.DATABASE.replace(
    "<password>",
    process.env.DATABASE_PASSWORD
  ).replace("<database>", process.env.DATABASE_PROD);
  mongoose
    .connect(DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then((res) => console.log("Connected to Prod Database."))
    .catch((err) => console.error(err));
} else {
  console.log("Unknown Environment");
}

const PORT = process.env.PORT || 8000;
// const server = http.createServer(app);
const server = app.listen(PORT, () => {
  console.log(`Connected to PORT ${PORT}.`);
});

const io = socket.listen(server);

// io.use((socket, next) => {
//   next();
// })
io.on("connection", (socket) => {
  // socket.handshake.headers.cookie

  console.log("Connected", socket.id);
  io.emit("connected", socket.id);

  socket.on("joinRoom", (room) => {
    socketController.joinRoom(room);
    socket.join(room);
    socket.broadcast.in(room).emit("roomJoined", room);
  });

  socket.on("deleteChatRoom", (room) => {
    socketController.deleteChatRoom(room);
    // io.emit("customEmit", room);
    socket.broadcast.in(room).emit("roomDeleted", room);
  });

  socket.on("leaveChatRoom", (room) => {
    socketController.leaveChatRoom(room);
  });

  socket.on("newMessage", (data) => {
    socketController.postMessage(data);
    socket.broadcast.in(data.chatRoomHandle).emit("newMessage", data.message);
  });
});
