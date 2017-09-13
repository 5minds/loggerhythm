import * as winston from 'winston';

require('./setup').defaults();
class Loggerhythm {

  private _namespace: string;

  get namespace() {
    return this._namespace;
  }

  constructor(namespace: string = '') {

    this._namespace = namespace;
    Object.keys((<any> winston).levels).forEach((loglevelName: string) => {
      this._createLogFunction(loglevelName);
    });
  }

  _createLogFunction(name, color?) {
    this[name] = function logfunction(message, obj) {
      const msg = `[${this.namespace}] ${message}`;
      const parameters = [name, msg].concat(Array.prototype.slice.call(arguments, 1)); //eslint-disable-line
      winston.log.apply(winston, parameters); //eslint-disable-line
    };
  }
}

export const createLogger = (namespace) => {
  return new Loggerhythm(namespace);
};
