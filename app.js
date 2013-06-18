var express  = require('express')
  , app      = express()
  , server   = require('http').createServer(app)
  , io       = require('socket.io').listen(server)
  , mongoose = require('mongoose');

var loop         = require('./app/lib/loop.js')
  , Event        = require('./app/models/jobs/event')
  , User         = require('./app/models/people/user')
  , Application  = require('./app/models/people/application')
  , AccessToken  = require('./app/models/people/access_token');



/* ---------------- *
 * Socket.io server *
 * ---------------- */

server.listen(process.env.PORT);

// TODO move to a test section
app.configure(function() {
  app.use(express.static(__dirname + '/app/assets/javascripts'));
  app.use(express.static(__dirname + '/app/assets'));
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

loop.execute();
