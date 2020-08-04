// const http = require('http');

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const logger = require('./utils/logger');

dotenv.config({ path: './config.env' });

const socketController = require('./controllers/socketController');
const app = require('./app');

if (process.env.NODE_ENV === 'development') {
  const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD).replace(
    '<database>',
    process.env.DATABASE_DEV,
  );
  mongoose
    .connect(DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      logger.info({ file: 'APP' }, 'Connected to Database');
      app.emit('initServer');
    })
    .catch((err) => logger.error(err));
} else if (process.env.NODE_ENV === 'production') {
  const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD).replace(
    '<database>',
    process.env.DATABASE_PROD,
  );
  mongoose
    .connect(DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      logger.info({ file: 'APP' }, 'Connected to Database');
      app.emit('initServer');
    })
    .catch((err) => logger.info(err));
} else {
  logger.info({ file: 'APP' }, 'Unknown Envrionment');
}

const PORT = process.env.PORT || 8000;
// const server = http.createServer(app);
app.on('initServer', () => {
  const server = app.listen(PORT, () => {
    logger.info({ file: 'APP', fn: 'app.listen()', args: 'NONE' }, `Connected to Port: ${PORT}`);
  });

  socketController.performSocketConnection(server);
});
