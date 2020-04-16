const nodeCron = require("node-cron");
const userController = require("./controllers/userController");

exports.removeExpire = () => {
  nodeCron.schedule("*/15 * * * *", userController.removeExpired);
};
