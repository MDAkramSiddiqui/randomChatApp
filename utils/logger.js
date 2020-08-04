const pino = require('pino');
const stringify = require('json-stringify');
const loggerConfig = require('../config/loggerConfig');

const filterKeys = ['password'];

function initLogger() {
  return pino({
    prettyPrint: loggerConfig,
  });
}

// (?<=password:([^.,\]})]*))|(?<=pwd:([^.,\]})]*)) we can use this pattern also which will
// form a single regex and we can use that regex only once
function filterMsg(meta) {
  let filteredMeta = typeof meta === 'object' ? stringify(meta) : meta;
  let regex = '';
  const regexCommon = '[^.,\\]}]*';
  filterKeys.forEach((key) => {
    regex = `${key}${regexCommon}`;
    regex = new RegExp(regex, 'gmi');
    filteredMeta = filteredMeta.replace(regex, `${key}":"**[SECRET]**"`);
  });
  return filteredMeta;
}

const logger = initLogger();

module.exports = {
  debug(meta, message) {
    const formattedMsg = `${stringify(message) || ''} ${filterMsg(meta)}`;
    logger.debug(formattedMsg);
  },

  info(meta, message) {
    const formattedMsg = `${stringify(message) || ''} ${filterMsg(meta)}`;
    logger.info(formattedMsg);
  },

  warn(meta, message) {
    const formattedMsg = `${stringify(message) || ''} ${filterMsg(meta)}`;
    logger.warn(formattedMsg);
  },

  error(meta, message) {
    const formattedMsg = `${stringify(message) || ''} ${filterMsg(meta)}`;
    logger.error(formattedMsg);
  },
};
