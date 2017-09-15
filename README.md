# Loggerhythm
A [winston](https://github.com/winstonjs/winston)-wrapper to log in a
[debug](https://github.com/visionmedia/debug)-like manner including namespaces

## Usage
Loggerhythm exports a Logger-class, whose instances have different log-functions for different log-levels.
the avaliable loglevels are:

0. critical
1. error
2. warn
3. info
4. verbose
5. debug
6. silly

***critical* and *error* log to `stderr`, everything else logs to `stdout`!**

#### Example

```javascript
const Logger = require('loggerhythm').Logger;
// import {Logger} from 'loggerhythm'; // for TypeScript

const logger = new Logger('readme-namespace')
logger.info('foo');
logger.warn('bar');
```

The output would look like this (the different log-leves use different colors):

```
2016-08-30T14:06:33.751Z - info:     [readme-namespace] foo
2016-08-30T14:06:33.752Z - warn:     [readme-namespace] bar
```

## Methods
### Static
The Logger-Class has static methods, that can be used to *globally* set loggerhythm-config and register global log-hooks:

```TypeScript
const Logger = require('loggerhythm').Logger;
const Loglevel = require('loggerhythm').LogLevel;
// import {Logger, LogLevel} from 'loggerhythm'; // for TypeScript

// Set the loglevel to only log warnings, errors and critical-logs
Logger.setLogLevel(LogLevel.WARN);

// Set the max. log-depth
Logger.setMaxObjectLogDepth(3);

// get informed about all Logs everywhere
const subscription = Logger.subscribe((logLevel, namespace, message, ...logObjects) => {
  // do stuff
});

// do stuff

// unsubscribe
subscription.dispose();
```

### Instance-methods
The Instances of the Logger-class have a log-method for every loglevel and a subscribe-method to get informed about
logs of that instance

```TypeScript
const Logger = require('loggerhythm').Logger;
// import {Logger} from 'loggerhythm'; // for TypeScript

const logger = new Logger('readme-namespace');

// get informed about all the logs of that instance
const subscription = Logger.subscribe((logLevel, namespace, message, ...logObjects) => {
  // namespace will always be 'readme-namespace' here
  // do stuff
});

logger.critical('critical log');
logger.error('error-log', new Error('hello'));
logger.warn('warning-log');
logger.info('have some info', {v1: 1, v2: 2, test: ['some', 'test', 'array']});
logger.verbose('some', 'more detailed', 'info');
logger.debug('denug-log');
logger.silly('some stupidly verbose log');

// do stuff

// unsubscribe
subscription.dispose();
```
