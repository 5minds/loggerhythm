# Loggerhythm
A [winston](https://github.com/winstonjs/winston)-wrapper to log in a
[debug](https://github.com/visionmedia/debug)-like manner including namespaces

## Usage
Loggerhythm exports a Logger-class, whose instances have different log-functions for different log-levels.
the avaliable loglevels are:

1. error
2. warn
3. info
4. verbose

***error* logs to `stderr`, everything else logs to `stdout`!**

#### Example

```javascript
const Logger = require('loggerhythm').Logger;
// import {Logger} from 'loggerhythm'; // for TypeScript

const logger = new Logger('readme-namespace');
// alias: logger = logger.createLogger('readme-namespace');

logger.info('foo');
```

The output would look like this (the different log-leves use different colors):

```
2016-08-30T14:06:33.751Z - info:     [readme-namespace] foo
2016-08-30T14:06:33.752Z - warn:     [readme-namespace] bar
```

## Methods
### Static
The Logger-Class has static methods, that can be used to *globally* set loggerhythm-config and register global log-hooks:

```javascript
const Logger = require('loggerhythm').Logger;
// import {Logger, LogLevel} from 'loggerhythm'; // for TypeScript

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

```javascript
const Logger = require('loggerhythm').Logger;
// import {Logger} from 'loggerhythm'; // for TypeScript

const logger = Logger.createLogger('readme-namespace');

// get informed about all the logs of that instance
const subscription = Logger.subscribe((logLevel, namespace, message, ...logObjects) => {
  // namespace will always be 'readme-namespace' here
  // do stuff
});

logger.error('error-log', new Error('hello'));
logger.warn('warning-log');
logger.info('have some info', {v1: 1, v2: 2, test: ['some', 'test', 'array']});
logger.verbose('some', 'more detailed', 'info');

// this loggers namespace will be 'readme-namespace:child-logger-lamespace'
const logger2 = logger.createChildLogger('child-logger-lamespace');

// do stuff

// unsubscribe
subscription.dispose();
```
