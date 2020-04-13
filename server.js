const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const mongoose = require("mongoose");
const app = require("./app");

if (process.env.NODE_ENV === "development") {
  const DB = process.env.DATABASE.replace(
    "<password>",
    process.env.DATABASE_PASSWORD
  ).replace("<database>", process.env.DATABASE_DEV);
  mongoose
    .connect(DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then((res) => console.log("Connected to Dev Database."))
    .catch((err) => console.error(err));
} else if (process.env.NODE_ENV === "production") {
  const DB = process.env.DATABASE.replace(
    "<password>",
    process.env.DATABASE_PASSWORD
  ).replace("<database>", process.env.DATABASE_PROD);
  mongoose
    .connect(DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then((res) => console.log("Connected to Prod Database."))
    .catch((err) => console.error(err));
} else {
  console.log("Unknown Environment");
}

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Connected to PORT ${PORT}.`);
});
