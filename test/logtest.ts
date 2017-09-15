import {Logger, LogLevel} from '../dist/commonjs/loggerhythm';

const defaultLogger: Logger = new Logger();

const l1: Logger = new Logger('logger1');
const l2: Logger = new Logger('logger2');
const l3: Logger = new Logger('logger3');
const l4: Logger = new Logger('logger4');

l1.subscribe((loglevel: LogLevel, namespace: string, message: string) => {
  console.log('l1');
});

Logger.subscribe((loglevel: LogLevel, namespace: string, message: string) => {
  console.log('global');
});

defaultLogger.debug('hello default');

l1.debug('hello l1');
l1.debug('hello l1', 1, 2);
l1.debug('hello l1', {v1: 1, v2: 2});
l1.debug('hello l1', 1);

const meta: any = {
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
l2.error('someError', new Error('hello'));
l2.critical('crit l2');

Logger.setLogLevel('warn');

l3.debug('debug not logged');
l3.info('info not logged');
l3.warn('warn logged');
l3.error('error logged');
l3.critical('crit logged');

Logger.setLogLevel('silly');

l4.silly('silly logged');
l4.debug('debug logged');
l4.verbose('verbose logged');
l4.info('info logged');
l4.warn('warn logged');
l4.error('error logged', meta);
l4.critical('crit logged');
