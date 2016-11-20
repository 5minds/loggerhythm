# Loggerhythm
A [winston](https://github.com/winstonjs/winston)-wrapper to log in a
[debug](https://github.com/visionmedia/debug)-like manner including namespaces

## Usage
Loggerhythm exports a function, which requires a namespace and returns the
logger-class. This class has different log-functions for different log-levels.
By default, the avaliable loglevels are:

- critical
- error
- warn
- info
- verbose
- debug
- silly

#### Example

```javascript
const logger = require('loggerhythm')('readme-namespace');

logger.info('foo');
logger.warn('bar');
```

The output would look like this (the different log-leves use different colors):

```
2016-08-30T14:06:33.751Z - info:     [readme-namespace] foo
2016-08-30T14:06:33.752Z - warn:     [readme-namespace] bar
```

## Methods
alongside the different log-methods you have (within setup) the setLevel-method
to tell the module, what the minimal loglevel is a message needs to have to be
logged. This setting is global, and will effect all loggers. You also have this
method, if you only require loggerhythm, without giving it a namespace, although
you **cannot** use these non-namespaced instances to log things.

```javascript
const logger = require('loggerhythm')('readme-namespace');

logger.setup.setLevel('warn');
logger.info('foo');
logger.warn('bar');
```
or

```javascript
const logger = require('loggerhythm')('readme-namespace');
const someOtherLogger = require('loggerhythm');

someOtherLogger.setup.setLevel('warn');
logger.info('foo');
logger.warn('bar');
```
will output:

```
2016-08-30T14:14:48.520Z - warn:     [readme-namespace] bar
```

## Todo

Loggerhythm can not yet log to files, only to the console. It is planned that
logs can be stored to files independent of the DEBUG-environment-variable. With
that, you could get a complete, persistent log, aswell as the DEBUG-filtered
console-output.
