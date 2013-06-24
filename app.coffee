mongoose = require('mongoose')
express  = require('express')
app      = express()
server   = require('http').createServer(app)
io       = require('socket.io').listen(server)


# -----------------
# Socket.io server
# -----------------

app.configure ->
  app.use(express.static(__dirname + '/app/assets/javascripts'))
  app.use(express.static(__dirname + '/app/assets'))

io.configure ->
  io.set("transports", ["xhr-polling"])
  io.set("polling duration", 10)

app.get '/', (req, res) ->
  res.sendfile(__dirname + '/index.html')

app.put '/test', (request, response) ->
  io.sockets.emit('token-1', { data: require('./spec/fixtures/device.json') });
  response.json({});

io.sockets.on 'connection', (socket) ->
  socket.emit('connected');

server.listen(process.env.PORT)


# --------------
# Realtime loop
# --------------

_loop = require './lib/loop'
_loop.execute()
