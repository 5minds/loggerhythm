import * as chalk from 'chalk';
import * as util from 'util';

import {ILogFunction, ILoggerhythmHook, ILoggerSubscription, LogLevel} from './interfaces';

// fallback for browsers
let stdoutWrite: ILogFunction = console.log;
let stderrWrite: ILogFunction = console.log;

const stdoutIsAvaliable: boolean = process !== undefined &&
                                   process.stdout !== undefined &&
                                   process.stderr !== undefined;
if (stdoutIsAvaliable) {
  const inspectOptions: any = {depth: null, colors: false};

  const objectToString = (input: any): any => {
    if (typeof input === 'string' || typeof input === 'number') {
      return input;
    }

    return util.inspect(input, inspectOptions);
  };

  stdoutWrite = (prefix: string, message: string, ...parameter: Array<any>): void => {
    for (let i = 0; i < parameter.length; i++) {
      message = `${message} ${objectToString(parameter[i])}`;
    }

    process.stdout.write(prefix + message + '\n');
  };
  stderrWrite = (prefix: string, message: string, ...parameter: Array<any>): void => {
    for (let i = 0; i < parameter.length; i++) {
      message = `${message} ${objectToString(parameter[i])}`;
    }

    process.stderr.write(prefix + message + '\n');
  };
}

const logSettings: any = {
  [LogLevel.ERROR]: {colorFunction: chalk.red, logFunction: stderrWrite},
  [LogLevel.WARN]: {colorFunction: chalk.yellow, logFunction: stdoutWrite},
  [LogLevel.INFO]: {colorFunction: chalk.blue, logFunction: stdoutWrite},
  [LogLevel.VERBOSE]: {colorFunction: chalk.gray, logFunction: stdoutWrite},
};

const subscribers: Array<ILoggerhythmHook> = [];

export class Logger {

  private _namespace: string;
  private subscribers: Array<ILoggerhythmHook> = [];
  private namespaceStrings: {[loglevel: string]: string} = {};

  public get namespace(): string {
    return this._namespace;
  }

  constructor(namespace: string = '') {
    this._namespace = namespace;
    for (const logLevel in logSettings) {
      this.namespaceStrings[logLevel] = ` - ${logSettings[logLevel].colorFunction(logLevel)}: [${namespace}] `;
    }
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

    logSettings[logLevel].logFunction(new Date().toISOString() + this.namespaceStrings[logLevel], message, ...parameter);
  }
}
