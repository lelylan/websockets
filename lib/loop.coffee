mongoose = require 'mongoose'

Event        = require '../app/models/jobs/event'
User         = require '../app/models/people/user'
Application  = require '../app/models/people/application'
AccessToken  = require '../app/models/people/access_token'


# Find the valid tokens associated to property-udpated events
exports.execute = ->
  Event.find({ websocket_processed: false, event: 'property-update' })
  .tailable().stream().on('data', (collection) -> findTokens collection)

# Returns all valid access tokens and notifies the apps using them
findTokens = (event) ->

  # Set a closure to get the access of event between the callbacks
  ( (event) ->

    # Find the subscriptions related to the resource owner active tokens
    emit = (err, tokens) ->
      console.log "ERROR", err.message if (err)
      console.log 'DEBUG: number of access tokens to refresh', tokens.length if process.env.DEBUG
      #setWebsocketProcessed()

    # Set the websocket_processed field to true
    #setWebsocketProcessed = ->
      #event.websocket_processed = true; event.save()


    # Find the access token that belongs to the user (valid clients)
    console.log 'DEBUG: processing event related to resource', event.resource_id if process.env.DEBUG
    event.findAccessTokens(emit)

  )(event)
