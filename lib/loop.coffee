mongoose = require 'mongoose'
underscore = require 'underscore'

Event        = require '../app/models/jobs/event'
User         = require '../app/models/people/user'
Application  = require '../app/models/people/application'
AccessToken  = require '../app/models/people/access_token'


console.log 'LELYLAN DEBUG: websocket worker up and running' if process.env.DEBUG

# Find the valid tokens associated to property-udpated events
exports.execute = (io) ->
  Event.find({ websocket_processed: false, event: 'property-update' })
  .tailable().stream().on('data', (collection) -> findTokens collection, io)

# Returns all valid access tokens and notifies the apps using them
findTokens = (event, io) ->

  # Set a closure to get the access of event between the callbacks
  ( (event) ->

    # Find the subscriptions related to the resource owner active tokens
    emit = (err, tokens) ->
      console.log "LELYLAN ERROR", err.message if (err)
      console.log 'LELYLAN DEBUG: refreshing', tokens.length, 'dashboards' if process.env.DEBUG
      underscore.each tokens, (token) ->
        io.sockets.emit(token.token, event)
      setWebsocketProcessed()

    # Set the websocket_processed field to true
    setWebsocketProcessed = ->
      event.websocket_processed = true
      event.save()

    # Find the access token that belongs to the user (valid clients)
    console.log 'LELYLAN DEBUG: processing event related to resource', event.resource_id if process.env.DEBUG
    event.findAccessTokens(emit)

  )(event)
