var mongoose = require('mongoose')
  , express  = require('express')
  , app      = express()
  , server   = require('http').createServer(app)
  , io       = require('socket.io').listen(server);


// -----------------
// Socket.io server
// -----------------

app.configure(function() {
  app.use(express.static(__dirname + '/app/assets/javascripts'))
  app.use(express.static(__dirname + '/app/assets'))
});

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html')
});

app.put('/test', function(request, response) {
  io.sockets.emit('token-1', { data: require('./spec/fixtures/device.json') });
  response.json({});
});

io.sockets.on('connection', function(socket) {
  socket.emit('connected');
});

server.listen(process.env.PORT);


// --------------
// Realtime loop
// --------------

var _loop = require('./lib/loop');
_loop.execute(io);
