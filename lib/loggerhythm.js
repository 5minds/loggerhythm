'use strict';

const winston = require('winston');
const setup = require('./setup.js');

setup.defaults();
class Loggerhythm {

  get namespace() {
    return this._namespace;
  }

  get setup() {
    return setup;
  }

  constructor(namespace) {

    this._namespace = namespace || '';

    for (const i in winston.levels) { //eslint-disable-line
      this._createLogFunction(winston.levels[i], i);
    }
  }

  _createLogFunction(loglevel, name, color) {

    this[name] = function logfunction(message, obj) {

      const msg = `[${this.namespace}] ${message}`;
      const parameter = [name, msg].concat(Array.prototype.slice.call(arguments, 1)); //eslint-disable-line
      winston.log.apply(winston, parameter); //eslint-disable-line
    };
  }

}

const createInstance = (namespace) => {
  return new Loggerhythm(namespace);
};

module.exports = createInstance;
