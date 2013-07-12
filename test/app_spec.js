// TODO refactoring
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

var io = require('socket.io-client')
  , socketURL = 'http://0.0.0.0:' + process.env.NODE_PORT
  , options = {
		  transports: ['websocket'],
			'force new connection': true
		};

require('../app');


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
				token: 'token-alice'
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
				token: 'token-alice'
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


	describe("connect",function(){

		it('Should broadcast new user to all users', function(done){
			var aliceClient = io.connect(socketURL, options);

			// TODO Add this to a before filter os use sync (probably the only solution)
			aliceClient.on('connect', function(data) {
				aliceClient.emit('subscribe', 'token-alice');
				var bobClient = io.connect(socketURL, options);

				bobClient.on('connect', function(data) {
					bobClient.emit('subscribe', 'token-bob');

					aliceClient.on('update', function() { done() });
					bobClient.on('update', function()   { done() }); // if called would raise an error

					Factory.create('access_token', {
						resource_owner_id: alice.id,
						application_id: android.id,
						token: 'token-alice'
					}, function(doc) {
						alice_token = doc;

						Factory.create('event', { resource_owner_id: alice.id	}, function(doc) {
							console.log('EVENT CREATED');
						});
					});
				});
			});
		});
	});

});


