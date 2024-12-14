const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const refreshtokenSchema = new Schema({
  username: { type: String },
  refresh_token: { type: String },
});

module.exports = mongoose.models.refreshtoken || mongoose.model("refreshtoken", refreshtokenSchema);
