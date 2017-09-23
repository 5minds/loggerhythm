const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

var logloop = function(message, ...parameter) {
  let logString = message
  for (let i = 0; i < parameter.length; i++) {
    logString = `${logString}${parameter[i].toString()}`;
  }
}

var logmap = function(message, ...parameter) {
  const logString = `${message}${parameter.map((param) => param.toString())}`
}

var logfixed = function(message, param1, param2, param3, param4, param5) {
  let logString = message
  if (param1 !== undefined) logString = `${logString}${param1.toString()}`;
  if (param2 !== undefined) logString = `${logString}${param2.toString()}`;
  if (param3 !== undefined) logString = `${logString}${param3.toString()}`;
  if (param4 !== undefined) logString = `${logString}${param4.toString()}`;
  if (param5 !== undefined) logString = `${logString}${param5.toString()}`;
}


var logfixedorder = function(message, param1, param2, param3, param4, param5) {
  let logString = message
  if (param1 !== undefined) {
    logString = `${logString}${param1.toString()}`;
    if (param2 !== undefined) {
      logString = `${logString}${param2.toString()}`;
      if (param3 !== undefined) {
        logString = `${logString}${param3.toString()}`;
        if (param4 !== undefined) {
          logString = `${logString}${param4.toString()}`;
          if (param5 !== undefined) {
            logString = `${logString}${param5.toString()}`;
          }
        }
      }
    }
  }
}

var logoptimal = function(message, ...parameter) {
  let logString = message
  if (parameter.length > 0) {
    for (let i = 0; i < parameter.length; i++) {
      logString = `${logString}${parameter[i].toString()}`;
    }
  }
}

var logfixedadd = function(message, param1, param2, param3, param4, param5) {
  let logString = message
  if (param1 !== undefined) logString += param1.toString();
  if (param2 !== undefined) logString += param2.toString();
  if (param3 !== undefined) logString += param3.toString();
  if (param4 !== undefined) logString += param4.toString();
  if (param5 !== undefined) logString += param5.toString();
}

const message = 'myFancyMessage'
const param1 = {'objectKey': ['some', 'value']};
const param2 = 'test';
const param3 = 120;
const param4 = ['a', 'b', 'c', {'d': 'e'}];
const param5 = 'some somewhat longer string, but it\'s not that bad yet';

suite.add('logloop0', () => {
  logloop(message);
})
.add('logloop2', () => {
  logloop(message, param1, param2);
})
.add('logloop4', () => {
  logloop(message, param1, param2, param3, param4);
})
.add('logloop5', () => {
  logloop(message, param1, param2, param3, param4, param5);
})
.add('logmap0', () => {
  logmap(message);
})
.add('logmap2', () => {
  logmap(message, param1, param2);
})
.add('logmap4', () => {
  logloop(message, param1, param2, param3, param4);
})
.add('logmap5', () => {
  logmap(message, param1, param2, param3, param4, param5);
})
.add('logfixed0', () => {
  logfixed(message);
})
.add('logfixed2', () => {
  logfixed(message, param1, param2);
})
.add('logfixed4', () => {
  logfixed(message, param1, param2, param3, param4);
})
.add('logfixed5', () => {
  logfixed(message, param1, param2, param3, param4, param5);
})
.add('logfixedadd0', () => {
  logfixedadd(message);
})
.add('logfixedadd2', () => {
  logfixedadd(message, param1, param2);
})
.add('logfixedadd4', () => {
  logfixedadd(message, param1, param2, param3, param4);
})
.add('logfixedadd5', () => {
  logfixedadd(message, param1, param2, param3, param4, param5);
})
.add('logfixedorder0', () => {
  logfixedorder(message);
})
.add('logfixedorder2', () => {
  logfixedorder(message, param1, param2);
})
.add('logfixedorder4', () => {
  logfixedorder(message, param1, param2, param3, param4);
})
.add('logfixedorder5', () => {
  logfixedorder(message, param1, param2, param3, param4, param5);
})
.add('direct0', () => {
  let logString = message;
  if (param1 !== undefined) {}
})
.add('direct2', () => {
  let logString = message;
  if (param1 !== undefined) {
    logString = `${logString}${param1.toString()}`;
    if (param2 !== undefined) {
      logString = `${logString}${param2.toString()}`;
      if (param3 !== undefined) {
      }
    }
  }
})
.add('direct4', () => {
  let logString = message;
  if (param1 !== undefined) {
    logString = `${logString}${param1.toString()}`;
    if (param2 !== undefined) {
      logString = `${logString}${param2.toString()}`;
      if (param3 !== undefined) {
        logString = `${logString}${param3.toString()}`;
        if (param4 !== undefined) {
          logString = `${logString}${param4.toString()}`;
          if (param5 !== undefined) {
          }
        }
      }
    }
  }
})
.add('direct5', () => {
  let logString = message;
  if (param1 !== undefined) {
    logString = `${logString}${param1.toString()}`;
    if (param2 !== undefined) {
      logString = `${logString}${param2.toString()}`;
      if (param3 !== undefined) {
        logString = `${logString}${param3.toString()}`;
        if (param4 !== undefined) {
          logString = `${logString}${param4.toString()}`;
          if (param5 !== undefined) {
            logString = `${logString}${param5.toString()}`;
          }
        }
      }
    }
  }
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
/*
.on('complete', function() {
  console.log('result', this.map(test) => {
    return `${test.name}: ${test.}`
  });
})
*/
.run();
