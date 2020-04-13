const chalk = require("chalk");

class logger {
  static debug(val) {
    if (process.env.NODE_ENV === "development")
      console.log(chalk.hex("#eae200")(`[DEBUG] ${val}`));
  }
  static info(val) {
    console.log(chalk.hex("#03ed00")(`[INFO] ${val}`));
  }
  static warn(val) {
    console.log(chalk.hex("#ff7f5b")(`[WARN] ${val}`));
  }
  static error(val) {
    console.log(chalk.hex("#ff001d")(`[INFO] ${val}`));
  }
}

module.exports = logger;
