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

export interface ILoggerSubscription {
  dispose(): void;
}

function defaultSetup(): void {
  winston.remove(winston.transports.Console);
  winston.add(winston.transports.Console, {
    stderrLevels: [LogLevel.ERROR, LogLevel.CRITICAL],
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

const subscribers: Array<ILoggerhythmHook> = [];

defaultSetup();
export class Logger {

  private _namespace: string;
  private subscribers: Array<ILoggerhythmHook> = [];

  public get namespace(): string {
    return this._namespace;
  }

  constructor(namespace: string = '') {
    this._namespace = namespace;
  }

  public static subscribe(callback: ILoggerhythmHook): ILoggerSubscription {
    subscribers.push(callback);

    const subscription: ILoggerSubscription = {
      dispose(): void {
        const subscriptionIndex: number = subscribers.indexOf(callback);
        if (subscriptionIndex !== -1) {
          subscribers.splice(subscriptionIndex, 1);
        }
      },
    };

    return subscription;
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
    for (let callbackIndex = 0; callbackIndex < subscribers.length; callbackIndex++) {
      subscribers[callbackIndex](logLevel, this.namespace, message, ...logObjects);
    }

    // tslint:disable-next-line
    for (let callbackIndex = 0; callbackIndex < this.subscribers.length; callbackIndex++) {
      this.subscribers[callbackIndex](logLevel, this.namespace, message, ...logObjects);
    }

    const msg: string = `[${this.namespace}] ${message}`;
    winston.log(logLevel, msg, ...logObjects);
  }

  public subscribe(callback: ILoggerhythmHook): ILoggerSubscription {
    this.subscribers.push(callback);

    const subscription: ILoggerSubscription = {
      dispose(): void {
        const subscriptionIndex: number = this.subscribers.indexOf(callback);
        if (subscriptionIndex !== -1) {
          this.subscribers.splice(subscriptionIndex, 1);
        }
      },
    };

    return subscription;
  }
}
