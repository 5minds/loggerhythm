import * as chalk from 'chalk';
import * as util from 'util';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  VERBOSE = 'verbose',
}

interface ILogFunction {
  (message: string, ...parameter: Array<any>): void;
}
// fallback for browsers
let stdoutWrite: ILogFunction = console.log;
let stderrWrite: ILogFunction = console.log;
let objectToString: (input: any) => any = (input: string): any => {
  return input;
};

const stdoutIsAvaliable: boolean = process !== undefined &&
                                   process.stdout !== undefined &&
                                   process.stderr !== undefined;
if (stdoutIsAvaliable) {
  const inspectOptions: any = {
    depth: null,
    colors: true,
  };

  stdoutWrite = (message: string): void => {
    process.stdout.write(`${message}\n`);
  };
  stderrWrite = (message: string): void => {
    process.stderr.write(`${message}\n`);
  };
  objectToString = (input: any): any => {
    if (typeof input === 'string') {
      return input;
    }

    if (typeof input === 'number') {
      return input;
    }

    return util.inspect(input, inspectOptions);
  };
}

const logSettings: any = {
  [LogLevel.ERROR]: {colorFunction: chalk.red, logFunction: stderrWrite},
  [LogLevel.WARN]: {colorFunction: chalk.yellow, logFunction: stdoutWrite},
  [LogLevel.INFO]: {colorFunction: chalk.blue, logFunction: stdoutWrite},
  [LogLevel.VERBOSE]: {colorFunction: chalk.gray, logFunction: stdoutWrite},
};

export interface ILoggerhythmHook {
  (logLevel: LogLevel, namespace: string, message: string, ...parameter: Array<any>): void;
}

export interface ILoggerSubscription {
  dispose(): void;
}

const subscribers: Array<ILoggerhythmHook> = [];

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

  public error(message: string, ...parameter: Array<any>): void {
    this._log(LogLevel.ERROR, message, ...parameter);
  }

  public warn(message: string, ...parameter: Array<any>): void {
    this._log(LogLevel.WARN, message, ...parameter);
  }

  public info(message: string, ...parameter: Array<any>): void {
    this._log(LogLevel.INFO, message, ...parameter);
  }

  public verbose(message: string, ...parameter: Array<any>): void {
    this._log(LogLevel.VERBOSE, message, ...parameter);
  }

  private _log(logLevel: LogLevel, message: string, ...parameter: Array<any>): void {

    // tslint:disable-next-line
    for (let callbackIndex = 0; callbackIndex < subscribers.length; callbackIndex++) {
      subscribers[callbackIndex](logLevel, this.namespace, message, ...parameter);
    }

    // tslint:disable-next-line
    for (let callbackIndex = 0; callbackIndex < this.subscribers.length; callbackIndex++) {
      this.subscribers[callbackIndex](logLevel, this.namespace, message, ...parameter);
    }

    for (let i = 0; i < parameter.length; i++) {
      message = `${message} ${objectToString(parameter[i])}`;
    }

    const msg: string = `${new Date().toISOString()} - ${logSettings[logLevel].colorFunction(logLevel)}: [${this.namespace}] ${message}`;
    logSettings[logLevel].logFunction(msg);
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
