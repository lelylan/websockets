var nock   = require('nock')
  , fs     = require('fs')
  , async  = require('async')
  , assert = require('assert')
  , helper = require('./helper');

var Factory = require('factory-lady')
  , Event = require('../app/models/jobs/event');

require('./factories/jobs/event');
require('./factories/people/user');
require('./factories/people/application');
require('./factories/people/access_token');


describe('when new event', function() {

  var alice, bob, android, alice_token, bob_token, event;

  beforeEach(function() {
    helper.cleanDB();
    nock.cleanAll();
  });

  beforeEach(function(done) { Factory.create('user', function(doc) { alice = doc; done() }); });
  beforeEach(function(done) { Factory.create('user', function(doc) { bob = doc; done() }); });
  beforeEach(function(done) { Factory.create('application', function(doc) { android = doc; done() }); });

  describe('when updates a device properties', function() {

    beforeEach(function(done) {
      Factory.create('access_token', {
        resource_owner_id: alice.id,
        application_id: android.id,
        token: 'token-android'
      }, function(doc) {
        alice_token = doc;
        done();
      });
    });

    beforeEach(function(done) {
      Factory.create('event', {
        resource_owner_id: alice.id,
      }, function(doc) {
        event = doc;
        done();
      });
    });

    it('sets event#websocket_processed field as true', function(done) {
			var result = {};

			async.until(
				function() {
					Event.findById(event.id, function(err, doc) { result = doc });
					return result.websocket_processed === true
				},
				function(callback) {
					setTimeout(callback, 10);
				}, done);
    });
  });

  describe('when creates a new device', function() {

    beforeEach(function(done) {
      Factory.create('access_token', {
        resource_owner_id: alice.id,
        application_id: android.id,
        token: 'token-android'
      }, function(doc) { alice_token = doc; done() })
    });

    beforeEach(function(done) {
      Factory.create('event', {
        resource_owner_id: alice.id,
        event: 'create'
      }, function(doc) { event = doc; done() })
    });

    it('leave event#websocket_processed field as false', function(done) {
			var result = {};

			async.until(
				function() {
					Event.findById(event.id, function(err, doc) { result = doc });
					return result.websocket_processed === false
				},
				function(callback) {
					setTimeout(callback, 10);
				}, done);
    });
  });
});
