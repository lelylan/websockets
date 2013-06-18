var mongoose     = require('mongoose')
  , Event        = require('../models/jobs/event')
  , User         = require('../models/people/user')
  , Application  = require('../models/people/application')
  , AccessToken  = require('../models/people/access_token');


/* ------------- *
 * Realtime loop *
 * ------------- */

// Find the valid tokens associated to each event
exports.execute = function() {
  console.log('info:', 'loop activated');

  Event.find({ realtime_processed: false }).tailable().stream()
    .on('data', function(collection) { findTokens(collection) });
}

var findTokens = function(event) {
  console.log('info: event created');
  event.realtime_processed = true;
  event.save();
};
