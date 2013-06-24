_loop = require './lib/loop'

console.log 'DEBUG: websocket worker up and running' if process.env.DEBUG
_loop.execute()
