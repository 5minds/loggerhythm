'use strict';

const should = require('should');

const create_instance = require("../index");

describe('Loggerhythm#constructor', () => {

  let logger;

  beforeEach(() => {
    logger = create_instance();
  });

  it('sould check if the logger exists', () => {

    should.exist(logger);
  });
});
