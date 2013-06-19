var mongoose     = require('mongoose')
  , Event        = require('../models/jobs/event')
  , User         = require('../models/people/user')
  , Application  = require('../models/people/application')
  , AccessToken  = require('../models/people/access_token');

var _ = require('underscore');


/* ------------- *
 * Realtime loop *
 * ------------- */

// Find the valid tokens associated to each event
exports.execute = function() {
  console.log('DEBUG:', 'loop activated');

  Event.find({ realtime_processed: false }).tailable().stream()
    .on('data', function(collection) { findTokens(collection) });
}

// Returns all valid tokens for the resource for the dashboard app
var findTokens = function(event) {

  // Find all acces tokens that should e notified
  var tokens = function() {
    event.findAccessTokens(stream);
  }

  // Send the notification to the authorized clients
  var stream = function(err, tokens) {
    tokens = _.map(tokens, function(token){ return token.token });
    if (process.env.DEBUG) { console.log('TOKENS:', tokens) }
    event.realtime_processed = true;
    event.save();
  }

  tokens();
};
