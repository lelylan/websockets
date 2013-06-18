var express = require('express')
  , app     = express()
  , server  = require('http').createServer(app)
  , io      = require('socket.io').listen(server);

server.listen(process.env.PORT);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.configure(function() {
  app.use(express.static(__dirname + '/app/assets'));
});

io.sockets.on('connection', function (socket) {
  socket.emit('devices:update', { id: '1' });
});
