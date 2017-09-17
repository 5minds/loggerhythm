'use strict';

const should = require('should');

const Logger = require('../dist/commonjs/loggerhythm').Logger;

describe('Loggerhythm#constructor', () => {

  let logger;

  beforeEach(() => {
    logger = new Logger();
  });

  it('sould check if the logger exists', () => {

    should.exist(logger);
  });
});
