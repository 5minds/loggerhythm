const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;
const util = require('util')

const loglevel = 'info'
const namespace = 'benchmark'
const message = 'Lorem ipsum dolor sit amet, consetetur sadipscing'
const newline = '\n';

const prepared = ` - ${loglevel}: [${namespace}] `;

suite
.add('template-string', () => {
  const msg = `${new Date().toISOString()} - ${loglevel}: [${namespace}] ${message}`;

})
.add('util.format', () => {
  const msg = util.format('%s - %s: [%s] %s', new Date().toISOString(), loglevel, namespace, message);
})
.add('template-string prepared', () => {
  const msg = `${new Date().toISOString()}${prepared}${message}`;
})
.add('util.format prepared', () => {
  const msg = util.format('%s%s%s', new Date().toISOString(), prepared, message);
})
.add('concat prepared', () => {
  const msg = new Date().toISOString() + prepared + message;
})
.add('add newline string', () => {
  const msg = new Date().toISOString() + '\n';
})
.add('add newline var', () => {
  const msg = new Date().toISOString() + newline;
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('result', this.map((test) => {
    return `${test.name}: ${parseInt(test.hz)}`;
  }));
})

  suite.run();
