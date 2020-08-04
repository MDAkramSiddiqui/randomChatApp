const router = require('express').Router();

const userController = require('../controllers/userController');
const chatController = require('../controllers/chatController');

router.use(userController.protect);

router.get('/:chatRoomHandle/get-all-chats', chatController.getChatRoomChat);
router.post('/post-message', chatController.postMessage);

module.exports = router;
