var fs = require('fs');
var format = require('string-format');
var strings = require('./strings');
var _ = require('lodash');

var logOccurrence = function(name) {
  var date = new Date();
  fs.appendFileSync(`./log/alarms/${date.toDateString()}.txt`, format(strings.occurrence, {
    time:date.toLocaleString(),
    name
  }));
};

var pingOccurrence = function(devices) {
  var date = new Date();
  devices = _.partition(devices, (device => device.status == true))
  if (devices[1].length) {
    fs.appendFileSync(`./log/ping/${date.toDateString()}.txt`, strings.ping_03);
    devices[0].forEach((device) => {
      fs.appendFileSync(`./log/ping/${date.toDateString()}.txt`, format(strings.ping_05, device));
    });
    fs.appendFileSync(`./log/ping/${date.toDateString()}.txt`, strings.ping_04);
    devices[1].forEach((device) => {
      fs.appendFileSync(`./log/ping/${date.toDateString()}.txt`, format(strings.ping_05, device));
    });
  } else {
    fs.appendFileSync(`./log/ping/${date.toDateString()}.txt`, strings.ping_02);
  }
};

module.exports = {
  logOccurrence,
  pingOccurrence
};
