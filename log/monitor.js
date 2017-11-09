var fs = require('fs');
var format = require('string-format');
var strings = require('./strings');

var logOccurrence = function(name) {

  var date = new Date();
  fs.appendFileSync(`./log/monitor/${date.toDateString()}.txt`, format(strings.monitor, {time:date.toLocaleString(), name}));
};

module.exports = {logOccurrence};
