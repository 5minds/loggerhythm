'use strict';

class Defaults {

  static get logLevel() {
    if (process.env.NODE_ENV === 'production') {
      return 'info';
    }
    return 'debug';
  }

  static get winstonConsoleTransport() {
    return {
      stderrLevels: ['warn', 'error', 'critial'],
      colorize: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      timestamp: true,
      prettyPrint: true,
    };
  }

  static get logLevels() {
    return {
      critical: {level: 0, color: 'red'},
      error: {level: 1, color: 'magenta'},
      warn: {level: 2, color: 'yellow'},
      info: {level: 3, color: 'green'},
      verbose: {level: 4, color: 'gray'},
      debug: {level: 5, color: 'blue'},
      silly: {level: 6, color: 'cyan'},
    };
  }

}

module.exports = Defaults;
