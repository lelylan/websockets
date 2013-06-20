var nock   = require('nock')
  , fs     = require('fs')
  , helper = require('./helper')
  , assert = require('assert');

var Factory = require('factory-lady')
  , Event = require('../app/models/jobs/event');

require('./factories/jobs/event');
require('./factories/people/user');
require('./factories/people/application');
require('./factories/people/access_token');


describe('new event', function() {

  var alice, bob, android, alice_token, bob_token, event;

  beforeEach(function() {
    helper.cleanDB();
    nock.cleanAll();
  });

  beforeEach(function(done) { Factory.create('user', function(doc) { alice = doc; done() }); });
  beforeEach(function(done) { Factory.create('user', function(doc) { bob   = doc; done() }); });
  beforeEach(function(done) { Factory.create('application', function(doc) { android = doc; done() }); });

  beforeEach(function(done) {
    Factory.create('access_token', {
      resource_owner_id: alice.id,
      application_id: android.id,
    }, function(doc) { alice_token = doc; done() })
  });

  beforeEach(function(done) {
    Factory.create('access_token', {
      resource_owner_id: bob.id,
      application_id: android.id,
      token: '2',
    }, function(doc) { bob_token = doc; done() })
  });

  beforeEach(function(done) {
    Factory.create('event', {
      resource_owner_id: alice.id,
    }, function(doc) { event = doc; done() })
  });

  it('sets event#realtime_processed field as true', function(done) {
    setTimeout(function() {
      Event.findById(event.id, function(err, doc) { assert.equal(doc.realtime_processed, true); done(); });
    }, 200);
  });
});
