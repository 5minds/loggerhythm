import * as winston from 'winston';
import {Defaults as defaults} from './defaults';

class Setup {

  public defaults(): Setup {

    return this._winstonConsoleTransport(defaults.winstonConsoleTransport)
      ._logLevels(defaults.logLevels)
      .logLevel(defaults.logLevel)
      .maxObjectLogDepth(10);
  }

  public logLevel(loglevel: string): Setup {
    (<any> winston).level = loglevel;
    return this;
  }

  public maxObjectLogDepth(maxDepth: number): Setup {
    (<any> winston.default.transports.console).depth = maxDepth;
    return this;
  }

  private _winstonConsoleTransport(transportSettings) {
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

export = new Setup();
