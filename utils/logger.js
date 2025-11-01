// utils/logger.js
const log4js = require('log4js');

log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: { 
      type: 'file', 
      filename: 'logs/app.log', 
      maxLogSize: 5 * 1024 * 1024, 
      backups: 3, 
      compress: true 
    }
  },
  categories: {
    default: { appenders: ['console', 'file'], level: 'info' }
  }
});

const logger = log4js.getLogger();

module.exports = logger;
