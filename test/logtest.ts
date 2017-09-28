import {Logger, LogLevel} from '../dist/commonjs/loggerhythm';

const defaultLogger: Logger = Logger.createLogger();

const l1: Logger = Logger.createLogger('logger1');
const l2: Logger = Logger.createLogger('logger2');
const l3: Logger = Logger.createLogger('logger3');
const l4: Logger = Logger.createLogger('logger4');

l1.subscribe((loglevel: LogLevel, namespace: string, message: string) => {
  console.log('l1');
});

Logger.subscribe((loglevel: LogLevel, namespace: string, message: string) => {
  console.log('global');
});

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

l2.info('info l2');
l2.warn('warn l2');
l2.error('error l2');
l2.error('someError', new Error('hello'));

l3.info('info not logged');
l3.warn('warn logged');
l3.error('error logged');

l4.verbose('verbose logged');
l4.info('info logged');
l4.warn('warn logged');
l4.error('error logged', meta);
