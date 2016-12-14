const winston = require('winston');

winston.add(
  winston.transports.File, {
    filename: 'sltweeter.log',
    level: 'info',
    json: false,
    eol: '\n',
    timestamp: true,
  }
);

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { timestamp: true });

module.exports = winston;
