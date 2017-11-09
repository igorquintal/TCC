var fs = require('fs');
var format = require('string-format');
var strings = require('./strings');

/*Sirene ativada devido ao alarme*/
var activateAlarmSiren = function() {

  var date = new Date();
  fs.appendFileSync(`./log/sirens/${date.toDateString()}.txt`, format(strings.activate_alarm_siren, {time:date.toLocaleString()}));
};

var deactivateAlarmSiren = function() {

  var date = new Date();
  fs.appendFileSync(`./log/sirens/${date.toDateString()}.txt`, format(strings.deactivate_alarm_siren, {time:date.toLocaleString()}));
};

var activateTelegramSiren = function(first, last) {

  var date = new Date();
  fs.appendFileSync(`./log/sirens/${date.toDateString()}.txt`, format(strings.activate_telegram_siren, {
    time:date.toLocaleString(),
    first,
    last
  }));
};

var deactivateTelegramSiren = function(first, last) {

  var date = new Date();
  fs.appendFileSync(`./log/sirens/${date.toDateString()}.txt`, format(strings.deactivate_telegram_siren, {
    time:date.toLocaleString(),
    first,
    last
  }));
};

var activateKeypadSiren = function(name) {

  var date = new Date();
  fs.appendFileSync(`./log/sirens/${date.toDateString()}.txt`, format(strings.activate_keypad_siren, {
    time:date.toLocaleString(),
    name
  }));
};

var deactivateKeypadSiren = function(name) {

  var date = new Date();
  fs.appendFileSync(`./log/sirens/${date.toDateString()}.txt`, format(strings.deactivate_keypad_siren, {
    time:date.toLocaleString(),
    name
  }));
};

module.exports = {
  activateAlarmSiren,
  deactivateAlarmSiren,
  activateTelegramSiren,
  deactivateTelegramSiren,
  activateKeypadSiren,
  deactivateKeypadSiren
};
