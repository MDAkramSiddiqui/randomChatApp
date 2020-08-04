const router = require('express').Router();

const userController = require('../controllers/userController');

router.get('/create-handle', userController.createUser);

// only admin knows this route
router.post('/login', userController.login);

// router.get("/remove-expired", userController.removeExpired);

router.use(userController.protect);

router.get('/my-chatrooms', userController.getMyChatRooms);
router.get('/me', userController.getMe);

router.delete('/leave', userController.restrictTo('user'), userController.leave);

router.get('/logout', userController.restrictTo('admin'), userController.logout);

module.exports = router;
