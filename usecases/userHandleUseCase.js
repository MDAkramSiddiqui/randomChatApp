const path = require("path");
const crypto = require("crypto");
const requestClient = require("request-promise");

const logger = require("./../utils/logger");
const User = require("./../models/userModel");

const scriptName = path.basename(__filename);

class userHandle {
  async createHandle(req, res, next) {
    logger.debug(`${scriptName}, createHandle(), {req, res, next}`);
    //API to get random names
    const username = (
      await requestClient({
        uri: "http://names.drycodes.com/1",
        json: true,
        headers: { "user-agent": "Request-Promise" },
      })
    )[0];

    // console.log(username);

    const handle = `${username}_${crypto.randomBytes(3).toString("hex")}`;
    return User.create({ handle });
  }
}

module.exports = new userHandle();
