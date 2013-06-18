var express  = require('express')
  , app      = express()
  , server   = require('http').createServer(app)
  , io       = require('socket.io').listen(server)
  , mongoose = require('mongoose');

var Event        = require('./app/models/jobs/event')
  , User         = require('./app/models/people/user')
  , Application  = require('./app/models/people/application')
  , AccessToken  = require('./app/models/people/access_token');


/*
 * Express and Socket.io server
 */

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

server.listen(process.env.PORT);


/*
 * Realtime logics
 */

// Find the valid tokens associated to each event
(function() {
  console.log("Entering Loop Process");

  Event.find({ realtime_processed: false })
    .tailable()
    .stream()
    .on('data', function(collection) { findTokens(collection) });
})();

var findTokens = function(event) {
  console.log('Event inserted in capped collection');
};

//# Execute all HTTP callbacks related to events created from users that
//# have subscribed to third party applications with some subscriptions.
//# In other words if a user has a valid access token to a specific app
//# and that app has a subscription that should call an HTTP callback, we
//# have to make it.
//findTokens = (event, attempts = 0) ->

  //# Set a closure to get the access of event between the callbacks
  //( (event) ->

    //# Find the subscriptions related to the resource owner active tokens
    //findSubscriptions = (err, tokens) ->
      //console.log "ERROR", err.message if (err)
      //console.log 'DEBUG: access tokens found', tokens.length if process.env.DEBUG

      //setCallbackProcessed() if tokens.length == 0
      //event.findSubscriptions(tokens, fireCallbacks) if tokens.length != 0


    //# Organize the subscriptions callbacks
    //fireCallbacks = (err, subscriptions) ->
      //console.log "ERROR", err.message if (err)
      //console.log 'DEBUG: subscriptions found', subscriptions.length if process.env.DEBUG

      //setCallbackProcessed()     if subscriptions.length == 0
      //findClient(subscription)   for subscription in subscriptions


    //# Find the application secret (needed for the 'X-Hub-Signature')
    //findClient = (subscription) ->
      //console.log 'DEBUG: searching for client' if process.env.DEBUG

      //Application.findById subscription.client_id, (err, doc) ->
        //console.log "ERROR", err.message if (err)
        //console.log 'DEBUG: client found with id', doc.id if process.env.DEBUG

        //event.client = doc
        //sendCallback subscription


    //# Send the callback for single subscription
    //sendCallback = (subscription) ->
      //options = { uri: subscription.callback_uri, method: 'POST', headers: getHeaders(event, subscription), json: payload(event, subscription) }

      //request options, (err, response, body) ->
        //console.log 'DEBUG: webhook sent to', subscription.callback_uri if process.env.DEBUG
        //if err
          //console.log 'ERROR', err.message
        //else
          //setCallbackProcessed()   if (response.statusCode >= 200 && response.statusCode <= 299)
          //scheduleFailedCallback() if (response.statusCode >= 300 && response.statusCode <= 599)


    //# Schedule the failed HTTP request to the future
    //scheduleFailedCallback = ->
      //console.log 'DEBUG: webhook failed to', subscription.callback_uri if process.env.DEBUG
      //if attempts < settings.max_attempts
        //setTimeout ( -> findTokens event, attempts + 1 ), (Math.pow 3, attempts) * 1000
      //else
        //setCallbackProcessed()


    //# Create the payload to send to the subscribed service
    //payload = (event, subscription) ->
      //{ subscription: { id: subscription.id }, nonce: uuid.v4(), resource: event.resource, event: event.event, data: event.data }


    //# Create the headers to send to the subscribed service
    //getHeaders = (event, subscription) ->
      //shasum  = crypto.createHmac("sha1", event.client.secret);
      //content = payload(event, subscription)
      //shasum.update JSON.stringify(content)
      //{ 'X-Hub-Signature': shasum.digest('hex'), 'Content-Type': 'application/json' }


    //# Set the callback_processed field to true
    //setCallbackProcessed = ->
      //event.callback_processed = true; event.save()


    //# EVERYTHING STARTS HERE ->
    //# Find the access token that belongs to the user (valid clients)
    //console.log 'DEBUG: processing event related to resource', event.resource_id if process.env.DEBUG
    //event.findAccessTokens(findSubscriptions)

  //)(event)

