var mongoose = require('mongoose');

var DeviceSchema = new mongoose.Schema({
  mac: {
    type: String,
    unique: true,
    required: true,
    minlength: 17,
    maxlength: 17
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50
  },
  behavior: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 200
  },
  category: {
    type: String,
    required: true
  },
  hostname: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50
  },
  ip: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  },
  last_activity: {
    type: Date
  }
});

var Device = mongoose.model('Device', DeviceSchema);

module.exports = {Device};
