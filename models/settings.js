var mongoose = require('mongoose');

var SettingsSchema = new mongoose.Schema({
  keypad_password_alarm: {
    type: String,
    unique: true
  },
  keypad_password_siren: {
    type: String,
    unique: true
  },
  alarm_status: {
    type: Boolean,
    default: false
  },
  telegram_api_key: {
    type: String,
    unique: true
  },
  ip_camera_link: {
    type: String,
    unique: true
  },
  darksky_location: {
    type: String,
    unique:true
  }
});

var Settings = mongoose.model('Settings', SettingsSchema);

module.exports = {Settings};
