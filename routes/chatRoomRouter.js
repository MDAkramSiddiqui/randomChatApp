const router = require('express').Router();

const userController = require('../controllers/userController');
const chatRoomController = require('../controllers/chatRoomController');

router.use(userController.protect);

router.post('/create-room', chatRoomController.createRoom);

router.post('/join-room', chatRoomController.joinRoom);

router.get('/leave/:chatRoomId', chatRoomController.leaveChatRoom);

router.delete('/delete/:chatRoomId', chatRoomController.deleteChatRoom);

router.route('/').get(userController.restrictTo('admin'), chatRoomController.getAllChatRooms);

module.exports = router;
