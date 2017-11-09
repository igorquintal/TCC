var mongoose = require('mongoose');

var TelegramSchema = new mongoose.Schema({
  chat_id: {
    type: String,
    unique: true,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String
  },
  active: {
    type: Boolean,
    default: false
  },
  user_id: {
    type: String
  }
});

var Telegram = mongoose.model('Telegram', TelegramSchema);

module.exports = {Telegram};
