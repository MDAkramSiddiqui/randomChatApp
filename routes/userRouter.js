const router = require("express").Router();

const userController = require("../controllers/userController");

const responseBuilder = require("./../utils/responseBuilder");

router.get("/create-handle", userController.createUser);
router.post("/login", userController.login);

// router.get("/remove-expired", userController.removeExpired);

router.use(userController.protect);

router.get(
  "/logout",
  userController.restrictTo("admin"),
  userController.logout
);

router.delete(
  "/leave",
  userController.restrictTo("user"),
  userController.leave
);

module.exports = router;
