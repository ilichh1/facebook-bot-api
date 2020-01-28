const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  login: String,
  password: String,
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;