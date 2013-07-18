var mongoose = require('mongoose')
  , express  = require('express')
  , app      = express()
  , server   = require('http').createServer(app)
  , io       = require('socket.io').listen(server, { log: !!process.env.SCOKET_IO_LOG })
  , debug    = require('debug')('lelylan');


// Websocket and express app

app.configure(function() {
  app.use(express.static(__dirname + '/app/assets/javascripts'))
  app.use(express.static(__dirname + '/app/assets'))
});

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html')
});

app.put('/test', function(request, response) {
  io.sockets.in('token-1').emit('update', { data: require('./test/fixtures/device.json') });
  response.json({});
});

io.sockets.on('connection', function(socket) {
  socket.on('subscribe', function(room) {
    debug('Subscribing room', room);
    socket.join(room);
  });

  socket.emit('connected');
});

server.listen(process.env.NODE_PORT, function() {
  debug('Websocket worker up and running on port', process.env.NODE_PORT);

  // if run as root, downgrade to the owner of this file
  if (process.getuid() === 0)
    require('fs').stat(__filename, function(err, stats) {
      if (err) return console.log(err)
      process.setuid(stats.uid);
    });
});


server.listen(process.env.NODE_PORT);


// Realtime loop

var _loop = require('./lib/loop');
_loop.execute(io);


module.export = { io: io, app: app };
