var mongoose = require('mongoose')
  , express  = require('express')
  , app      = express()
  , server   = require('http').createServer(app)
  , io       = require('socket.io').listen(server);

var Event        = require('./app/models/jobs/event')
  , User         = require('./app/models/people/user')
  , Application  = require('./app/models/people/application')
  , AccessToken  = require('./app/models/people/access_token');

var _  = require('underscore');



/* ---------------- *
 * Socket.io server *
 * ---------------- */

app.configure(function() {
  app.use(express.static(__dirname + '/app/assets/javascripts'));
  app.use(express.static(__dirname + '/app/assets'));
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// TODO better test logics
app.put('/update', function (request, response) {
  io.sockets.emit('devices:update', { id: '1' });
  response.json({});
});

// TODO better connection logics
io.sockets.on('connection', function (socket) {
  socket.emit('devices:update', { id: '0' });
});

server.listen(process.env.PORT);



/* ------------- *
 * Realtime loop *
 * ------------- */

// Find the valid tokens associated to each event
Event.find({ realtime_processed: false }).tailable().stream()
  .on('data', function(collection) { findTokens(collection) });

// Returns all valid access tokens and notifies the apps using them
var findTokens = function(event) {

  // Find all acces tokens to notify
  var tokens = function() {
    event.findAccessTokens(stream);
  }

  // Send the notification to the authorized clients
  var stream = function(err, tokens) {
    _.each(tokens, function(token) {
      console.log('DEBUG:', 'a new event has been raised', token.token);
      io.sockets.emit('devices:update', { id: token.token, type: 'loop' });
    });
    event.realtime_processed = true;
    event.save();
  }

  tokens();
};

