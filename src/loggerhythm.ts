import * as winston from 'winston';

export enum LogLevel {
  CRITICAL = 'critical',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}

export interface ILoggerhythmHook {
  (logLevel: LogLevel, namespace: string, message: string, ...data: Array<any>): void;
}

function defaultSetup(): void {
  winston.remove(winston.transports.Console);
  winston.add(winston.transports.Console, {
    stderrLevels: [LogLevel.WARN, LogLevel.ERROR, LogLevel.CRITICAL],
    colorize: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    timestamp: true,
    prettyPrint: true,
  });

  winston.setLevels({
    critical: 0,
    error: 1,
    warn: 2,
    info: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  });

  winston.addColors({
    critical: 'red',
    error: 'magenta',
    warn: 'yellow',
    info: 'green',
    verbose: 'gray',
    debug: 'blue',
    silly: 'cyan',
  });

  if (process.env.NODE_ENV === 'production') {
    (<any> winston).level = LogLevel.INFO;
  } else {
    (<any> winston).level = LogLevel.DEBUG;
  }

  // tslint:disable-next-line
  (<any> winston.default.transports.console).depth = 10;
}

const logCallbacks: Array<ILoggerhythmHook> = [];

defaultSetup();
export class Logger {

  private _namespace: string;
  private _logCallbacks: Array<ILoggerhythmHook> = [];

  public get namespace(): string {
    return this._namespace;
  }

  constructor(namespace: string = '') {
    this._namespace = namespace;
  }

  public static onLog(callback: ILoggerhythmHook): void {
    logCallbacks.push(callback);
  }

  public static setLogLevel(loglevel: string): void {
    (<any> winston).level = loglevel;
  }

  public static setMaxObjectLogDepth(maxDepth: number): void {
    (<any> winston.default.transports.console).depth = maxDepth;
  }

  public critical(message: string, ...logParameter: Array<any>): void {
    this._log(LogLevel.CRITICAL, message, logParameter);
  }

  public error(message: string, ...logParameter: Array<any>): void {
    this._log(LogLevel.ERROR, message, ...logParameter);
  }

  public warn(message: string, ...logParameter: Array<any>): void {
    this._log(LogLevel.WARN, message, ...logParameter);
  }

  public info(message: string, ...logParameter: Array<any>): void {
    this._log(LogLevel.INFO, message, ...logParameter);
  }

  public verbose(message: string, ...logParameter: Array<any>): void {
    this._log(LogLevel.VERBOSE, message, ...logParameter);
  }

  public debug(message: string, ...logParameter: Array<any>): void {
    this._log(LogLevel.DEBUG, message, ...logParameter);
  }

  public silly(message: string, ...logParameter: Array<any>): void {
    this._log(LogLevel.SILLY, message, ...logParameter);
  }

  private _log(logLevel: LogLevel, message: string, ...logObjects: Array<any>): void {
    // tslint:disable-next-line
    for (let callbackIndex = 0; callbackIndex < logCallbacks.length; callbackIndex++) {
      logCallbacks[callbackIndex](logLevel, this.namespace, message, ...logObjects);
    }

    // tslint:disable-next-line
    for (let callbackIndex = 0; callbackIndex < this._logCallbacks.length; callbackIndex++) {
      this._logCallbacks[callbackIndex](logLevel, this.namespace, message, ...logObjects);
    }

    const msg: string = `[${this.namespace}] ${message}`;
    winston.log(logLevel, msg, ...logObjects);
  }

  public onLog(callback: ILoggerhythmHook): void {
    this._logCallbacks.push(callback);
  }
}
