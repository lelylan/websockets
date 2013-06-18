var nock   = require('nock')
  , fs     = require('fs')
  , helper = require('./helper')
  , loop   = require('../app/lib/loop.js')
  , assert = require('assert');

var Factory = require('factory-lady')
  , Event = require('../app/models/jobs/event');

require('./factories/jobs/event');
require('./factories/people/user');
require('./factories/people/application');
require('./factories/people/access_token');

loop.execute()


describe('new event', function() {

  var alice, bob, android, iphone, token, event;

  beforeEach(function() {
    helper.cleanDB();
    nock.cleanAll();
  });

  beforeEach(function(done) { Factory.create('user', function(doc) { alice = doc; done() }); });
  beforeEach(function(done) { Factory.create('user', function(doc) { bob   = doc; done() }); });
  beforeEach(function(done) { Factory.create('application', function(doc) { android = doc; done() }); });
  beforeEach(function(done) { Factory.create('application', function(doc) { iphone  = doc; done() }); });

  beforeEach(function(done) {
    Factory.create('access_token', {
      resource_owner_id: alice.id,
      application_id: android.id
    }, function(doc) { token = doc; done() })
  });

  beforeEach(function(done) {
    Factory.create('event', {
      resource_owner_id: alice.id,
    }, function(doc) { event = doc; done() })
  });

  it('sets event#realtime_processed field as true', function(done) {
    Event.findById(event.id, function(err, doc) {
      setTimeout(function() { assert.equal(event.realtime_processed, true) }, 10);
      done();
    });
  });
});
