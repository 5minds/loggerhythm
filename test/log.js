'use strict';

const logger = require('./../index');
const defaultLogger = require('./../index')();

const l1 = require('./../index')('logger1');
const l2 = require('./../index')('logger2');
const l3 = require('./../index')('logger3');
const l4 = require('./../index')('logger4');

defaultLogger.debug('hello default');

l1.debug('hello l1');
l1.debug('hello l1', 1, 2);
l1.debug('hello l1', {v1: 1, v2: 2});
l1.debug('hello l1', 1);

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

l2.debug('debug l2');
l2.info('info l2');
l2.warn('warn l2');
l2.error('error l2');
l2.error(new Error('hello'));
l2.critical('crit l2');

l3.setup.logLevel('warn');

l3.debug('debug not logged');
l3.info('info not logged');
l3.warn('warn logged');
l3.error('error logged');
l3.critical('crit logged');

logger.setup.logLevel('silly');

l4.silly('silly logged');
l4.debug('debug logged');
l4.verbose('verbose logged');
l4.info('info logged');
l4.warn('warn logged');
l4.error('error logged', meta);
l4.critical('crit logged');

