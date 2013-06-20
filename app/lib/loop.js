var express  = require('express')
  , app      = express()
  , server   = require('http').createServer(app)
  , io       = require('socket.io').listen(server)
  , mongoose = require('mongoose');

var Event        = require('../models/jobs/event')
  , User         = require('../models/people/user')
  , Application  = require('../models/people/application')
  , AccessToken  = require('../models/people/access_token');

var _  = require('underscore');



/* ---------------- *
 * Socket.io server *
 * ---------------- */

server.listen(process.env.PORT);

// TODO move to a test section
app.configure(function() {
  app.use(express.static(__dirname + '/../app/assets/javascripts'));
  app.use(express.static(__dirname + '/../app/assets'));
});

// TODO move to a test section
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// TODO update to /test
app.put('/update', function (request, response) {
  io.sockets.emit('devices:update', { id: '1' });
  response.json({});
});

io.sockets.on('connection', function (socket) {
  socket.emit('devices:update', { id: '0' });
});



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
    io.sockets.emit('devices:update', { id: token, type: 'token loop' });
    event.realtime_processed = true;
    event.save();
  }

  // Everything starts here
  tokens();
};
