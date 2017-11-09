const log = require('./../log/alarm');

/*Criando uma referência para exportar*/
var alarmClass = {};
module.exports = alarmClass;

const siren = require('./../siren/siren');
const botChat = require('./../telegram/bot');
const {Settings} = require('./../models/settings');
const {Device} = require('./../models/device');
const {SHA256} = require('crypto-js');

/*Indicam se o alarme está ativo ou não. Alarme manual tem prioridade MAIOR*/
var scheduleAlarm = false;
var manualAlarm = false;

/*Ativa o alarme via Schedule e realiza log*/
var activateScheduleAlarm = function(name) {
  scheduleAlarm = true;
  log.activateScheduleAlarm(name);
  botChat.sendNotificationAlarmActivateSchedule(name);
};

/*Desativa o alarme via schedule, incluindo a sirene e faz o log*/
var deactivateScheduleAlarm = function() {
  scheduleAlarm = false;
  siren.deactivateAlarmSiren();
  log.deactivateScheduleAlarm();
  botChat.sendNotificationAlarmDeactivateSchedule();
};

/*Ativa o alarme MANUAL via telegram e registra o log*/
var activateTelegramAlarm = function(first, last, id) {
  setTimeout(() => {
    manualAlarm = true;
    log.activateTelegramAlarm(first, last)
  },10000);
};

/*Desativa o alarme via telegram*/
var deactivateTelegramAlarm = function(first, last, id) {
  manualAlarm = false;
  scheduleAlarm = false;
  siren.deactivateTelegramSiren();
  log.deactivateTelegramAlarm(first, last)
  botChat.sendNotificationAlarmDeactivateTelegram(id);
};

/*Ativa o alarme via keypad*/
var activateKeypadAlarm = function(password, hostname) {
  Device.findOneAndUpdate({hostname}, {last_activity: new Date()}).then((device) => {
    checkKeypadPassword(password).then((result) =>{
      if (result) {
        console.log('ATIVOU');
        manualAlarm = true;
        log.activateKeypadAlarm(device.name);
        botChat.sendNotificationAlarmActivateKeypad(device.name);
      } else {
        return;
      }
    });
  });
};

/*Desativa o alarme via keypad*/
var deactivateKeypadAlarm = function(password, hostname) {
  Device.findOneAndUpdate({hostname}, {last_activity: new Date()}).then((device) => {
    checkKeypadPassword(password).then((result) =>{
      if (result) {
        console.log('DESATIVOU');
        manualAlarm = false;
        log.deactivateKeypadAlarm(device.name)
        botChat.sendNotificationAlarmDeactivateKeypad(device.name);
      } else {
        return;
      }
    });
  });
};

/*Retorna o status do alarme. True ou False*/
var getStatus = function() {
  return (scheduleAlarm || manualAlarm);
};

var alert = function(device) {
  if(getStatus()) {
    siren.activateAlarmSiren();
    utils.logOccurrence(device.name);
    botChat.sendNotificationAlert(device.name);
  }
};

var checkKeypadPassword = function(password) {
  return new Promise((resolve, reject) => {
    Settings.find().then((settings) => {
      if (settings[0].keypad_password == SHA256(password)) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
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
