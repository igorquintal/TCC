var fs = require('fs');
var format = require('string-format');
var strings = require('./strings');

/*Log quando alarme é ativado por agendamento*/
var activateScheduleAlarm = function(name) {

  var date = new Date();
  fs.appendFileSync(`./log/alarms/${date.toDateString()}.txt`, format(strings.activate_schedule_alarm, {time:date.toLocaleString(), name}));
};

/*Log quando o alarme é desativado por agendamento*/
var deactivateScheduleAlarm = function(name) {

  var date = new Date();
  fs.appendFileSync(`./log/alarms/${date.toDateString()}.txt`, format(strings.deactivate_schedule_alarm, {time:date.toLocaleString(), name}));
};

/*Alarme ativado via Telegram*/
var activateTelegramAlarm = function(first, last) {

  var date = new Date();
  fs.appendFileSync(`./log/alarms/${date.toDateString()}.txt`, format(strings.activate_telegram_alarm, {
    time:date.toLocaleString(),
    first,
    last
  }));
};

/*Alarme desativado via telegram*/
var deactivateTelegramAlarm = function(first, last) {

  var date = new Date();
  fs.appendFileSync(`./log/alarms/${date.toDateString()}.txt`, format(strings.deactivate_telegram_alarm, {
    time:date.toLocaleString(),
    first,
    last
  }));
};

/*Alarme ativado via keypad*/
var activateKeypadAlarm = function(name) {

  var date = new Date();
  fs.appendFileSync(`./log/alarms/${date.toDateString()}.txt`, format(strings.activate_keypad_alarm, {
    time:date.toLocaleString(),
    name
  }));
};

/*Alarme desativado via keypad*/
var deactivateKeypadAlarm = function(name) {

  var date = new Date();
  fs.appendFileSync(`./log/alarms/${date.toDateString()}.txt`, format(strings.deactivate_keypad_alarm, {
    time:date.toLocaleString(),
    name
  }));
};

module.exports = {
  activateScheduleAlarm,
  deactivateScheduleAlarm,
  activateTelegramAlarm,
  deactivateTelegramAlarm,
  activateKeypadAlarm,
  deactivateKeypadAlarm
};
