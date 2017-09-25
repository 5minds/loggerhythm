'use strict';

const logger = require('../dist/commonjs/loggerhythm').Logger;
const defaultLogger = logger.createLogger();

const l1 = logger.createLogger('logger1');
const l2 = logger.createLogger('logger2');
const l3 = logger.createLogger('logger3');
const l4 = logger.createLogger('logger4');

l1.subscribe((loglevel, namespace, message) => {
  console.log('l1')
})

const globalSubscription = logger.subscribe((loglevel, namespace, message) => {
  console.log('global')
})

const meta = {
  hallo: 'welt',
  lelelel: {
    log: {
      im: {
        log: 'hallo 123 456 789',
      },
    },
  },
};

meta.test = meta.lelelel;
meta.test123 = meta;
meta.lelelel.test1234 = meta.lelelel;

l2.info('info l2');
l2.warn('warn l2');
l2.error('error l2');
l2.error(new Error('hello'));

globalSubscription.dispose();

l3.info('info not logged');
l3.warn('warn logged');
l3.error('error logged');

l4.verbose('verbose logged');
l4.info('info logged');
l4.warn('warn logged');
l4.error('error logged', meta);
