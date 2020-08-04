const path = require('path');
const logger = require('./logger');

const scriptName = path.basename(__filename);

class responseBuilder {
  static async defaultResponseBuilder(req, res) {
    logger.info(`${scriptName}, defaultResponseBuilder(), { err, req, res, next }`);

    return res.status(req.statusCode || 200).json({
      status: 'success',
      data: res.data,
    });
  }
}

module.exports = responseBuilder;
