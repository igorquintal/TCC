var mongoose = require('mongoose');

var ScheduleSchema = new mongoose.Schema({
  hour_begin: {
    type: Number,
    required: true,
    min: 0,
    max: 24
  },
  minute_begin: {
    type: Number,
    required: true,
    min: 0,
    max: 59
  },
  hour_end: {
    type: Number,
    required: true,
    min: 0,
    max: 24
  },
  minute_end: {
    type: Number,
    required: true,
    min: 0,
    max: 59
  },
  days_begin: {
    type: [Number],
    default: [0,1,2,3,4,5,6]
  },
  days_end: {
    type: [Number],
    default: [0,1,2,3,4,5,6]
  },
  name: {
    type: String,
    required: true,
    unique: true
  }
});

var Schedule = mongoose.model('Schedule', ScheduleSchema);

module.exports = {Schedule};
