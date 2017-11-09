const log = require('./../log/siren');

var sirenClass = {};
module.exports = sirenClass;

const bot = require('./../telegram/bot');

var siren = false;

/*Ativa a sirene caso tenha uma ocorrencia no alarme*/
var activateAlarmSiren = function() {
  siren = true;
  log.activateAlarmSiren();
};

/*Desativa a pois o alarme foi desativado -- REMOVER*/
var deactivateAlarmSiren = function() {
  siren = false;
  log.deactivateAlarmSiren();
};

/*Ativa a sirene via telegram*/
var activateTelegramSiren = function(first, last) {
  console.log(first);
  console.log(last);
  setTimeout(() => {
    siren = true;
    log.activateTelegramSiren(first, last)
  },10000);
};

/*Desativa a sirene via telegram*/
var deactivateTelegramSiren= function(first, last) {
  siren = false;
  log.deactivateTelegramSiren(first, last)
};

/*Ativa a sirene via keypad*/
var activateKeypadSiren = function(password) {
  if(checkKeypadPassword(password)) {
    siren = true;
    log.activateKeypadSiren()
    bot.sendNotificationSirenActivateKeypad(name);
    setTimeout(() => {
      siren = true;
    },10000);
  }
};

/*Desativa a sirene via keypad*/
var deactivateKeypadSiren = function(password) {
  if(checkKeypadPassword(password)) {
    siren = false;
    log.deactivateKeypadSiren();
    bot.sendNotificationSirenDeactivateKeypad(name);
  }
};

var checkKeypadPassword = function(password) {
  settings.find().then((settings) => {
    if (settings[0].keypad_password == SHA256(password)) {
      return true;
    }
    return false;
  });
};

sirenClass.activateAlarmSiren = activateAlarmSiren;
sirenClass.deactivateAlarmSiren = deactivateAlarmSiren;
sirenClass.activateTelegramSiren = activateTelegramSiren;
sirenClass.deactivateTelegramSiren = deactivateTelegramSiren;
sirenClass.activateKeypadSiren = activateKeypadSiren;
sirenClass.deactivateKeypadSiren = deactivateKeypadSiren;
