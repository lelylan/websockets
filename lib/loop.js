var mongoose = require('mongoose')
  , _ = require('underscore');

var Event        = require('../app/models/jobs/event')
  , User         = require('../app/models/people/user')
  , Application  = require('../app/models/people/application')
  , AccessToken  = require('../app/models/people/access_token');


if (process.env.DEBUG) { console.log('LELYLAN DEBUG: websocket worker up and running') }

// Find the valid tokens associated to property-udpated events
exports.execute = function(io) {
  Event.find({ websocket_processed: false, event: 'property-update' })
    .tailable().stream().on('data', function(collection) { findTokens(collection, io) });
}

// Returns all valid access tokens and notifies the apps using them
var findTokens = function(event, io) {

  // Find the subscriptions related to the resource owner active tokens
  var emit = function(err, tokens) {
    if (err) { console.log("LELYLAN ERROR", err.message) }
    if (process.env.DEBUG) { console.log('LELYLAN DEBUG: refreshing', tokens.length, 'dashboards') }

    _.each(tokens, function(room) {
      console.log('Something was found')
      // to avoid the emit for tokens that are not used from a web client
      if (io.sockets.manager.rooms['/' + room]) {
        io.sockets.in('room').emit(event.token, { data: event.data, token: event.token });
      }
    });

    setWebsocketProcessed();
  }

  // Set the websocket_processed field to true
  var setWebsocketProcessed = function() {
    event.websocket_processed = true
    event.save()
  }

  // Find the access token that belongs to the user (valid clients)
  if (process.env.DEBUG) { console.log('LELYLAN DEBUG: processing event', event.resource_id) };
  event.findAccessTokens(emit)
}
