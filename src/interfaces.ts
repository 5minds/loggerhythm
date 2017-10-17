import * as chalk from 'chalk';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  VERBOSE = 'verbose',
}

export interface ILogFunction {
  (message: string, ...logObjects: Array<any>): void;
}

export interface ILoggerhythmHook {
  (logLevel: LogLevel, namespace: string, message: string, ...logObjects: Array<any>): void;
}

export interface ILoggerSubscription {
  dispose(): void;
}

export interface ILogSettings {
  [loglevel: string]: {
    colorFunction: chalk.ChalkChain, logFunction: ILogFunction,
  };
}
