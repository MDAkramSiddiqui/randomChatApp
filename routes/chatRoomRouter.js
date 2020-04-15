const router = require("express").Router();

const userController = require("./../controllers/userController");
const chatRoomController = require("./../controllers/chatRoomController");
const responseBuilder = require("./../utils/responseBuilder");

router.use(userController.protect);

router.get("/create-room", chatRoomController.createRoom);

router.post("/join-room", chatRoomController.joinRoom);

router
  .route("/")
  .get(userController.restrictTo("admin"), chatRoomController.getAllChatRooms);

module.exports = router;
