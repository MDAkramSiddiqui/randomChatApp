const router = require("express").Router();

const userHandleController = require("./../controllers/userHandleController");

const responseBuilder = require("./../utils/responseBuilder");

router.get(
  "/createHandle",
  userHandleController.createHandle,
  responseBuilder.defaultResponseBuilder
);
// router.post("/login");
// router.get("/logout");

module.exports = router;
