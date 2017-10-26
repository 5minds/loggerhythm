import {Chalk, default as chalk} from 'chalk';
import * as util from 'util';

import {ILogFunction, ILoggerhythmHook, ILoggerSubscription, ILogSettings, LogLevel} from './interfaces';

// fallback for browsers
let stdoutWrite: ILogFunction = console.log;
let stderrWrite: ILogFunction = console.log;

const stdPipesAreAvaliable: boolean = process !== undefined &&
                                      process.stdout !== undefined &&
                                      process.stderr !== undefined;
if (stdPipesAreAvaliable) {
  const inspectOptions: any = {depth: null, colors: true};

  const objectToString: (input: any) => any = (input: any): any => {
    if (typeof input === 'string' || typeof input === 'number') {
      return input;
    }

    return util.inspect(input, inspectOptions);
  };

  stdoutWrite = (prefix: string, message: string, ...logObjects: Array<any>): void => {
    // for-of are usually slower than regular for-loops (see https://jsperf.com/for-of-vs-for-loop)
    // tslint:disable-next-line:prefer-for-of
    for (let index: number = 0; index < logObjects.length; index++) {
      message = `${message} ${objectToString(logObjects[index])}`;
    }

    // template-strings are a little slower, when it comes to pure string
    // concatination (see benchmarks/benchmark_string_concat.js)
    // tslint:disable-next-line:prefer-template
    process.stdout.write(prefix + message + '\n');
  };

  stderrWrite = (prefix: string, message: string, ...logObjects: Array<any>): void => {
    // tslint:disable-next-line:prefer-for-of
    for (let index: number = 0; index < logObjects.length; index++) {
      message = `${message} ${objectToString(logObjects[index])}`;
    }

    // tslint:disable-next-line:prefer-template
    process.stderr.write(prefix + message + '\n');
  };
}

const namespaceColorBaseHue: number = 180;
const logSettings: ILogSettings = {
  [LogLevel.ERROR]: {colorFunction: chalk.red, logFunction: stderrWrite},
  [LogLevel.WARN]: {colorFunction: chalk.yellow, logFunction: stdoutWrite},
  [LogLevel.INFO]: {colorFunction: chalk.blue, logFunction: stdoutWrite},
  [LogLevel.VERBOSE]: {colorFunction: chalk.gray, logFunction: stdoutWrite},
};

const subscribers: Array<ILoggerhythmHook> = [];

export class Logger {

  private _namespace: string;
  private subscribers: Array<ILoggerhythmHook> = [];
  private namespaces: Array<string>;
  private namespaceStrings: {[loglevel: string]: string} = {};

  public get namespace(): string {
    return this._namespace;
  }

  constructor(namespace: string = '', parentNamespaces: Array<string> = []) {
    this.namespaces = parentNamespaces.concat(namespace);
    this._namespace = namespace;
    const coloredNamespaces = this.namespaces.map((namespace: string, index: number) => {
      return chalk.hwb(namespaceColorBaseHue - index*30, 0, 0)(namespace);
    })

    const baseNamespaceColor = chalk.hwb(namespaceColorBaseHue, 0, 0);
    const coloredNamespace = (`${chalk.dim('[')}${coloredNamespaces.join(chalk.dim(':'))}${chalk.dim(']')}`);
    for (const logLevel in logSettings) {
      this.namespaceStrings[logLevel] = ` - ${logSettings[logLevel].colorFunction(logLevel)}: ${coloredNamespace} `;
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

  public static createLogger(namespace?: string, parentNamespaces?: Array<string>): Logger {
    return new Logger(namespace, parentNamespaces);
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

  public createChildLogger(namespace?: string): Logger {
    return Logger.createLogger(namespace, this.namespaces);
  }

  public error(message: string, ...logObjects: Array<any>): void {
    this._log(LogLevel.ERROR, message, ...logObjects);
  }

  public warn(message: string, ...logObjects: Array<any>): void {
    this._log(LogLevel.WARN, message, ...logObjects);
  }

  public info(message: string, ...logObjects: Array<any>): void {
    this._log(LogLevel.INFO, message, ...logObjects);
  }

  public verbose(message: string, ...logObjects: Array<any>): void {
    this._log(LogLevel.VERBOSE, message, ...logObjects);
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

    logSettings[logLevel].logFunction(new Date().toISOString() + this.namespaceStrings[logLevel], message, ...logObjects);
  }
}
