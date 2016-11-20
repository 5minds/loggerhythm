'use strict';

const winston = require('winston');
const defaults = require('./defaults');

class Setup {

  defaults() {

    return this._winstonConsoleTransport(defaults.winstonConsoleTransport)
      ._logLevels(defaults.logLevels)
      .logLevel(defaults.logLevel)
      .maxObjectLogDepth(10);
  }

  logLevel(loglevel) {
    winston.level = loglevel;
    return this;
  }

  maxObjectLogDepth(maxDepth) {
    winston.default.transports.console.depth = maxDepth;
    return this;
  }

  _winstonConsoleTransport(transportSettings) {
    winston.remove(winston.transports.Console);
    winston.add(winston.transports.Console, transportSettings);
    return this;
  }

  _logLevels(logLevels) {
    // Setting the avaliable log-levels only has an effect on loggers, that are created after this.
    // This could potentially lead to great confusion, as different logger-instances could have
    // different logger-functions, dependent on WHEN they were created. Because of this, loglevels
    // shouldn't be changed after the initial setup, thus this function is marked private.
    const levels = {};
    const colors = {};

    Object.keys(logLevels)
      .forEach((name) => {
        levels[name] = logLevels[name].level;
        colors[name] = logLevels[name].color;
      });

    winston.setLevels(levels);
    winston.addColors(colors);

    return this;
  }

}

module.exports = new Setup();
