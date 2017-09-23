"use strict";
exports.__esModule = true;
var loggerhythm_1 = require("../dist/commonjs/loggerhythm");
var defaultLogger = new loggerhythm_1.Logger();
var l1 = new loggerhythm_1.Logger('logger1');
var l2 = new loggerhythm_1.Logger('logger2');
var l3 = new loggerhythm_1.Logger('logger3');
var l4 = new loggerhythm_1.Logger('logger4');
l1.subscribe(function (loglevel, namespace, message) {
    console.log('l1');
});
loggerhythm_1.Logger.subscribe(function (loglevel, namespace, message) {
    console.log('global');
});

var meta = {
    hallo: 'welt',
    lelelel: {
        log: {
            im: {
                log: 'hallo 123 456 789'
            }
        }
    }
};
meta.test = meta.lelelel;
meta.test123 = meta;
meta.lelelel.test1234 = meta.lelelel;
l2.info('info l2');
l2.warn('warn l2');
l2.error('error l2');
l2.error('someError', new Error('hello'));
loggerhythm_1.Logger.setLogLevel('warn');
l3.info('info not logged');
l3.warn('warn logged');
loggerhythm_1.Logger.setLogLevel('silly');
l4.verbose('verbose logged');
l4.info('info logged');
l4.warn('warn logged');
l4.error('error logged', meta);
