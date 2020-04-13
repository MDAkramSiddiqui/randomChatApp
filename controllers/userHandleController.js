const path = require("path");
const logger = require("./../utils/logger");
const AppError = require("./../utils/appError");
const userHandleUseCase = require("./../usecases/userHandleUseCase");

const scriptName = path.basename(__filename);

class userHandleController {
  static async createHandle(req, res, next) {
    try {
      logger.debug(`${scriptName}, createHandle(), {req, res, next}`);
      const currentUser = await userHandleUseCase.createHandle();
      req.data = {};
      req.data.user = currentUser;
      res.locals.user = currentUser;
      next();
    } catch (err) {
      next(new AppError(err.message, 500));
    }
  }
}

module.exports = userHandleController;
