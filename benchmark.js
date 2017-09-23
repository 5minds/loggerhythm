const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

const logger = require('./dist/commonjs/loggerhythm').Logger;
const l1 = new logger('logger1');

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

const error = new Error('someErrorMessage');

suite
.add('infomessage', () => {
  l1.info('info l1');
})
.add('errorMessage', () => {
  l1.error('error', error);
})
.add('objectLog', () => {
  l1.info('someObject', meta);
})
.add('multiParams', () => {
  l1.info('someObject', 'param1', 'param2', 'param3', 'param4', 'param5');
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('result', this.map((test) => {
    return `${test.name}: ${parseInt(test.hz)}`;
  }));
})
.run();
