const path = require("path");
const logger = require("./logger");

class responseBuilder {
  static async defaultResponseBuilder(req, res) {
    res.status(req.statusCode || 200).json({
      status: "success",
      data: req.data,
    });
  }
}

module.exports = responseBuilder;
