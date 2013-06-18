var mongoose = require('mongoose')
  , db = mongoose.createConnection (process.env.MONGOLAB_JOBS_URL);

var AccessToken  = require('../people/access_token');

var eventSchema = new mongoose.Schema({
  resource_owner_id: mongoose.Schema.Types.ObjectId,
  resource_id: mongoose.Schema.Types.ObjectId,
  resource: String,
  event: String,
  source: String,
  data: mongoose.Schema.Types.Mixed,
  realtime_processed: { type: Boolean, default: false }
});


// Find the access tokens that belong to the user (valid clients)
// See http://stackoverflow.com/questions/13279992/complex-mongodb-query-with-multiple-or/13280188
eventSchema.methods.findAccessTokens = function(callback) {
  if (process.env.DEBUG) { console.log('DEBUG: searching for tokens') }

  AccessToken.find({
    resource_owner_id: this.resource_owner_id,
    revoked_at: undefined,
    $and: [
      { $or: [{ scopes: /resources/i }, { scopes: new RegExp(this.resource,'i') }] },
      { $or: [{ device_ids: { $size: 0 } }, { device_ids: this.resource_id }] }
    ]
  }, callback);
}

module.exports = db.model('event', eventSchema);
