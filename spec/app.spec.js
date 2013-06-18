var nock = require('nock')
  , fs = require('fs')
  , helper = require('./helper')
  , loop = require('../app/lib/loop.js');

var Factory = require('factory-lady');

require('./factories/jobs/event');
require('./factories/people/user');
require('./factories/people/application');
require('./factories/people/access_token');

loop.execute()

var assert = require("assert")
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})
