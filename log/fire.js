var fs = require('fs');
var format = require('string-format');
var strings = require('./strings');

/*Sirene ativada devido ao alarme*/
var activateFireSirenKeypad = function() {

  var date = new Date();
  fs.appendFileSync(`./log/fire/${date.toDateString()}.txt`, format(strings.activate_keypad_fire, {time:date.toLocaleString()}));
};

var deactivateFireSirenKeypad = function() {

  var date = new Date();
  fs.appendFileSync(`./log/fire/${date.toDateString()}.txt`, format(strings.deactivate_keypad_fire, {time:date.toLocaleString()}));
};

var deactivateTelegramFireSiren = function(first, last) {

  var date = new Date();
  fs.appendFileSync(`./log/fire/${date.toDateString()}.txt`, format(strings.deactivate_telegram_fire, {
    time:date.toLocaleString(),
    first,
    last
  }));
};

var activateFireSiren = function(name) {

  var date = new Date();
  fs.appendFileSync(`./log/fire/${date.toDateString()}.txt`, format(strings.activate_fire, {
    time:date.toLocaleString(),
    name
  }));
};

module.exports = {
  activateFireSirenKeypad,
  deactivateFireSirenKeypad,
  deactivateTelegramFireSiren,
  activateFireSiren
};
