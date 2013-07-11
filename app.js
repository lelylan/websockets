var mongoose = require('mongoose')
  , express  = require('express')
  , app      = express()
  , server   = require('http').createServer(app)
  , io       = require('socket.io').listen(server);


// -----------------
// Socket.io server

io.sockets.on('connection', function(socket) {

  // add client to the room
  socket.on('subscribe', function(room) {
    socket.join(room);
    console.log('LELYLAN DEBUG: subscribing to', room);
    console.log('LELYLAN DEBUG: rooms', io.sockets.manager.rooms);
  });

  // remove client from the room
  socket.on('disconnect', function(room) {
    console.log('LELYLAN DEBUG: unsubscribing to', room);
    socket.leave(room);
  });

  socket.emit('connected');
});


// ---------------
// Express server

app.configure(function() {
  app.use(express.static(__dirname + '/app/assets/javascripts'))
  app.use(express.static(__dirname + '/app/assets'))
});

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html')
});

app.put('/test', function(request, response) {
  room = 'token-1';
  console.log('LELYLAN DEBUG: emitting message');
  io.sockets.in(room).emit('update', { data: require('./spec/fixtures/device.json') });
  response.json({});
});

server.listen(process.env.PORT);


// --------------
// Realtime loop
// --------------

var _loop = require('./lib/loop');
_loop.execute(io);
