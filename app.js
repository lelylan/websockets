var express = require('express')
  , app     = express()
  , server  = require('http').createServer(app)
  , io      = require('socket.io').listen(server);

server.listen(process.env.PORT);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.put('/update', function (request, response) {
  console.log('Request received');
  var json = { id: 2 };

  io.sockets.emit('devices:update', json);
  response.json(json);
});


app.configure(function() {
  app.use(express.static(__dirname + '/app/assets/javascripts'));
  app.use(express.static(__dirname + '/app/assets'));
});

io.sockets.on('connection', function (socket) {
  socket.emit('devices:update', { id: '1' });
});
