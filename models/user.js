var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
    unique: true
  },
  photo: {
    type: String
  },
  last_activity: {
    type: Date,
  },
  card_id: {
    type: String
  },
  chat_id: {
    type: String
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
