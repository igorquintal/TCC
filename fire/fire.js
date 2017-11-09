// const log = require('./../log/alarm');

/*Criando uma referência para exportar*/
var fireClass = {};
module.exports = fireClass;

// const siren = require('./../siren/siren');
// const botChat = require('./../telegram/bot');
const {Settings} = require('./../models/settings');
const {Device} = require('./../models/device');
const {SHA256} = require('crypto-js');

var fireAlarm = false;

/*Retorna o status do alarme. True ou False*/
var getStatus = function() {
  return (fireAlarm);
};

/*Ativa a sirene de incêncio*/
var activateFireSirenKeypad = function() {
  fireAlarm = true;
  /*CHAMAR SIRENE*/
  /*LOG*/
};

/*Desativar a sirene de incêncio*/
var deactivateFireSirenKeypad = function() {
  fireAlarm = false;
  /*CHAMAR SIRENE*/
  /*LOG*/
};

/*Desativar via Telegram*/
var deactivateFireSirenTelegram = function() {
  fireAlarm = false;
  /*CHAMAR SIRENE*/
  /*LOG*/
};

/*Ativar em caso de incêndio*/
var activateFireSiren = function() {
  /*CHAMAR SIRENE*/
  /*LOG*/
  fireAlarm = true;
};

/*Exportando tudo na referência do mesmo objeto do module.exports*/
alarmClass.activateScheduleAlarm = activateScheduleAlarm;
alarmClass.deactivateScheduleAlarm = deactivateScheduleAlarm;
alarmClass.activateTelegramAlarm = activateTelegramAlarm;
alarmClass.deactivateTelegramAlarm = deactivateTelegramAlarm;
alarmClass.activateKeypadAlarm = activateKeypadAlarm;
alarmClass.deactivateKeypadAlarm = deactivateKeypadAlarm;
alarmClass.getStatus = getStatus;
alarmClass.alert = alert;
alarmClass.checkKeypadPassword = checkKeypadPassword;
