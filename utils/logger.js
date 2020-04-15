const chalk = require("chalk");

class logger {
  static debug(val) {
    if (process.env.NODE_ENV === "development")
      console.log(chalk.hex("#eae200")(`[DEBUG] ${val}`));
  }
  static info(val) {
    console.log(chalk.hex("#05fd02")(`[INFO] ${val}`));
  }
  static warn(val) {
    console.log(chalk.hex("#ff7f5b")(`[WARN] ${val}`));
  }
  static error(val, err) {
    console.log(chalk.hex("#ff001d")(`[ERROR] ${val}`));
    if (process.env.NODE_ENV === "development")
      console.log(chalk.hex("#ff001d")(`--->>> ${err.stack}`));
  }
}

module.exports = logger;
