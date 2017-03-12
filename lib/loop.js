var mongoose = require('mongoose')
  , debug = require('debug')('lelylan')
  , _ = require('underscore');

var Event        = require('../app/models/jobs/event')
  , User         = require('../app/models/people/user')
  , Application  = require('../app/models/people/application')
  , AccessToken  = require('../app/models/people/access_token');


// find the valid tokens associated to property-udpated events
exports.execute = function(io) {
  Event.db.db.executeDbCommand({"convertToCapped": "events", size: 10000000, max:1000})
  Event.find({ websocket_processed: false, event: 'property-update' })
    .tailable().stream().on('data', function(collection) { findTokens(collection, io) });
}

// return all valid access tokens and notifies the apps using them
var findTokens = function(event, io) {

  // find the subscriptions related to the resource owner active tokens
  var emit = function(err, tokens) {
    if (err) { console.log("Error", err.message) }
    debug('Found out', tokens.length, 'access tokens');

    _.each(tokens, function(token) {
      room = token.token

      // avoid the emitting for tokens that are not used from a web client
      if (io.sockets.manager.rooms['/' + room]) {
        io.sockets.in(room).emit('update', { data: event.data, token: event.token });
      }
    });

    event.websocket_processed = true;
    event.save();
  }

  // find the access token that belongs to the user (valid clients)
  debug('Processing event', event.resource_id);
  event.findAccessTokens(emit);
}
