// const {mongoose} = require('./../db/mongoose');
const TeleBot =  require('telebot');
const strings = require('./strings');
const {Telegram} = require('./../models/telegram');
const ping = require('./../sensors/ping');
const _ = require('lodash');
const format = require('string-format');

const alarm = require('./../alarm/alarm');

const alarmLog = require('./../log/alarm');
const sirenLog = require('./../log/siren');
const utilsLog = require('./../log/utils');

const siren = require('./../siren/siren');
const schedule = require('./../scheduler/scheduler');
const {User} = require('./../models/user');

var activatedChats = [];

const bot = new TeleBot({
    token: '437934379:AAGXeV1zO5qPJgvvDTHHm-CiIHICbT0YsPY',
    usePlugins: ['namedButtons'],
    pluginConfig: {
        namedButtons: {
            buttons: strings.BUTTONS
        }
    }
});

const mainMenu = bot.keyboard([
    [strings.BUTTONS.sensors_btn.label],
    [strings.BUTTONS.siren_btn.label],
    [strings.BUTTONS.alarm_btn.label],
    [strings.BUTTONS.schedule_btn.label]
], {resize: true});

const sirenMenu = bot.keyboard([
    [strings.BUTTONS.activate_siren_btn.label],
    [strings.BUTTONS.deactivate_siren_btn.label],
    [strings.BUTTONS.main_menu_btn.label]
], {resize: true});

const alarmMenu = bot.keyboard([
    [strings.BUTTONS.activate_alarm_btn.label],
    [strings.BUTTONS.deactivate_alarm_btn.label],
    [strings.BUTTONS.main_menu_btn.label]
], {resize: true});

const idMenu = bot.keyboard([
  [strings.BUTTONS.require_id_btn.label]
], {resize: true});

// bot.on(['/start'], (msg) => {
//   bot.sendMessage(msg.from.id, strings.start_01).then(() => {
//     bot.sendMessage(msg.from.id, strings.start_02).then(()=> {
//       var user = new Bot({
//         chat_id : msg.from.id,
//         first_name : msg.from.first_name,
//         last_name : msg.from.last_name
//       });
//
//       user.save().then(() => {
//         bot.sendMessage(msg.from.id, strings.start_03, {replyMarkup:mainMenu});
//       }, (e) => {
//         console.log('ERROR');
//       });
//     });
//   });
// });

// var globalListOfUsers;
//
// var arrayOfUsers = function() {
//   return new Promise((resolve, reject) => {
//     User.find().then((users) => {
//       globalListOfUsers = users.map(user => user.name);
//       resolve(users.map(user => [user.name]));
//     });
//   });
// };
//
// bot.on(['/test'], (msg) => {
//   arrayOfUsers().then((users) => {
//     console.log(globalListOfUsers);
//     let replyMarkup = bot.keyboard(users, {resize: true});
//     bot.sendMessage(msg.from.id, `TECLADO`, {replyMarkup});
//   });
// });
//
// bot.on('/text', (msg) => {
//   bot.sendMessage(msg.from.id, 'USUÁRIO VÁLIDO', {replyMarkup:testKey}).then(() => {}, (e) => {console.log(e);});
// });


/*Funções auxiliares*/

/*Envia mensagem para todo os sensores que estão online*/
var sendOnline = function(devices, id) {
  return new Promise((resolve, reject) => {
    if (devices.length == 0) {
      bot.sendMessage(id, strings.sensors_06).then(() => {
        resolve();
      });
    } else {
      bot.sendMessage(id, strings.sensors_03).then(() => {
        devices.forEach((device) => {
          bot.sendMessage(id, format(strings.sensors_05, device)).then(() => {
            resolve();
          });
        });
      });
    }
  });
};

/*Envia mensagem para todos os sensores que estão offline*/
var sendOffline = function(devices, id) {
  return new Promise ((resolve, reject) => {
    if (devices.length == 0) {
      bot.sendMessage(id, strings.sensors_07).then(() => {
        resolve();
      });
    } else {
      bot.sendMessage(id, strings.sensors_04).then(() => {
        devices.forEach((device) => {
          bot.sendMessage(id, format(strings.sensors_05, device)).then(() => {
            resolve();
          });
        });
      });
    }
  });
};

/*verifica se o id do chat de um usuário é válido*/
var checkValidID = function(id) {
  return activatedChats.indexOf(String(id)) >= 0 ? true : false;
};

/*envia mensagem quando o ID não é válido*/
var notValid = function(id) {
  bot.sendMessage(id, format(strings.start_04, {id}), {replyMarkup:idMenu});
};

/*Adiciona um novo chat_id como válido*/
var validateChatId = function (id) {
  activatedChats.push(id);
};

/*Remove um chat_id que antes era válido*/
var invalidateChatId = function (id) {
  activatedChats.splice(activatedChats.indexOf(id));
};

/*Inicializa o vetor de chats*/
var startAll = function() {
  return new Promise((resolve, reject) => {
    Telegram.find({active:true}).then((chats) => {
      chats.forEach((chat) => activatedChats.push(chat.chat_id));
      resolve();
    });
  });
};

/*Escreve os dias da semana*/
var writeDays = function(days) {
  var string = '';
  if (days.includes(0)) {
    string += '\n-> Domingo';
  }
  if (days.includes(1)) {
    string += '\n-> Segunda-feira';
  }
  if (days.includes(2)) {
    string += '\n-> Terça-feira';
  }
  if (days.includes(3)) {
    string += '\n-> Quarta-feira';
  }
  if (days.includes(4)) {
    string += '\n-> Quinta-feira';
  }
  if (days.includes(5)) {
    string += '\n-> Sexta-feira';
  }
  if (days.includes(6)) {
    string += '\n-> Sábado';
  }
  return string;
}

/*Comandos*/

/*Iniciando um novo chat*/
bot.on(['/start'], (msg) => {
  bot.sendMessage(msg.from.id, strings.start_01).then(() => {
    bot.sendMessage(msg.from.id, strings.start_02).then(()=> {
      var telegram = new Telegram({
        chat_id : msg.from.id,
        first_name : msg.from.first_name,
        last_name : msg.from.last_name
      });

      telegram.save().then(() => {
        bot.sendMessage(msg.from.id, format(strings.start_03, {id:msg.from.id}), {replyMarkup:idMenu});
      }, (e) => {
        bot.sendMessage(msg.from.id, format(strings.start_03, {id:msg.from.id}), {replyMarkup:idMenu});
      });
    });
  });
});

/*Caso o usuário tenha esquecido seu ID*/
bot.on(['/requireID'], (msg) => {
    bot.sendMessage(msg.from.id, format(strings.start_04, {id:msg.from.id}), {replyMarkup:idMenu})
});

/*Apresenta main menu (deve estar logado)*/
bot.on(['/mainMenu'], (msg) => {
    if(checkValidID(msg.from.id)) {
      bot.sendMessage(msg.from.id, 'Menu princial:', {replyMarkup:mainMenu});
    } else {
      notValid(msg.from.id);
    }
});

//OK
/*Lista todos os sensores, realizando um ping eem cada um*/
bot.on(['/listSensors'], (msg) => {
  if(checkValidID(msg.from.id)) {
    bot.sendMessage(msg.from.id, strings.sensors_01).then(() => {
      bot.sendMessage(msg.from.id, strings.sensors_02).then(() => {
        ping.listAllByStatus().then((devices) => {
          sendOnline(devices.online, msg.from.id).then(() => {
            sendOffline(devices.offline, msg.from.id);
          });
        });
      });
    });
  } else {
    notValid(msg.from.id);
  }
});

//OK
/*Ativa o menu de sirene*/
bot.on(['/siren'], (msg) => {
  if(checkValidID(msg.from.id)) {
    bot.sendMessage(msg.from.id, strings.siren_01, {replyMarkup:sirenMenu});
  } else {
    notValid(msg.from.id);
  }
});

//OK
/*Ativa a sirene*/
bot.on(['/activateSiren'], (msg) => {
  if(checkValidID(msg.from.id)) {
    bot.sendMessage(msg.from.id, strings.siren_02, {replyMarkup:sirenMenu}).then(() => {
      siren.activateTelegramSiren(msg.from.first_name, msg.from.last_name);
      sendNotificationSirenActivateTelegram(msg.from.first_name, msg.from.last_name, msg.from.id);
    });
  } else {
    notValid(msg.from.id);
  }
});


//OK
/*Desastiva a sirene*/
bot.on(['/deactivateSiren'], (msg) => {
  if(checkValidID(msg.from.id)) {
    bot.sendMessage(msg.from.id, strings.siren_03, {replyMarkup:sirenMenu}).then(() => {
      siren.deactivateTelegramSiren(msg.from.first_name, msg.from.last_name);
    });
  } else {
    notValid(msg.from.id);
  }
});

//OK
/*Abre o menu de alarme no telegram*/
bot.on(['/alarm'], (msg) => {
  if(checkValidID(msg.from.id)) {
    bot.sendMessage(msg.from.id, format(strings.alarm_01, {status:alarm.getStatus() ? 'ATIVADO' : 'DESATIVADO'})).then(() => {
      bot.sendMessage(msg.from.id, strings.alarm_02, {replyMarkup:alarmMenu});
    });
  } else {
    notValid(msg.from.id);
  }
});

//OK
/*Ativa o alarme*/
bot.on(['/activateAlarm'], (msg) => {
  if(checkValidID(msg.from.id)) {
    bot.sendMessage(msg.from.id, strings.alarm_03, {replyMarkup:alarmMenu}).then(() => {
      bot.sendMessage(msg.from.id, strings.alarm_04, {replyMarkup:alarmMenu}).then(() => {
        alarm.activateTelegramAlarm(msg.from.first_name, msg.from.last_name, msg.from.id);
        sendNotificationAlarmActivateTelegram(msg.from.id);
      })
    });
  } else {
    notValid(msg.from.id);
  }
});

//OK
/*Desativar alarme*/
bot.on(['/deactivateAlarm'], (msg) => {
  if(checkValidID(msg.from.id)) {
    bot.sendMessage(msg.from.id, strings.alarm_05, {replyMarkup:alarmMenu}).then(() => {
      alarm.deactivateTelegramAlarm(msg.from.first_name, msg.from.last_name, msg.from.id);
    });
  } else {
    notValid(msg.from.id);
  }
});

//OK
/*Mostra todos os agendamentos*/
bot.on(['/schedules'], (msg) => {
  bot.sendMessage(msg.from.id, strings.schedule_01).then(() => {
    schedule.getAllSchedules().then((schedules) => {
      schedules.forEach((schedule) => {
        var name = schedule.name;
        var beginTime = schedule.hour_begin + ':' + (schedule.minute_begin == 0 ? '00' : schedule.minute_begin);
        var endTime = schedule.hour_end + ':' + (schedule.minute_end == 0 ? '00' : schedule.minute_end);
        var daysBegin = writeDays(schedule.days_begin);
        var daysEnd = writeDays(schedule.days_end);
        bot.sendMessage(msg.from.id, format(strings.schedule_02, {name, beginTime, endTime, daysBegin, daysEnd}) , {replyMarkup:mainMenu});
      })
    });
  });
});

var sendTest = function () {
    bot.sendMessage('176256611', 'O usuário Igor Quintal Mendes acabou de se identificar no leitor de nome "Portão principal". Segue sua foto registrada.', {replyMarkup:mainMenu}).then(() => {
      bot.sendPhoto('176256611', 'C:\\Users\\igor_\\Desktop\\Server-TCC\\server\\pictures\\da74e1b089a78274b26139c1278c07fa').then(() => {
        console.log('ok');
      }, (e) => {
        console.log(e);
      });
    })
  };


/*Notificações*/

/*Indica que a conta do Telegram foi aprovada com sucesso*/
var sendNotificationConfirmation = function(id, name) {
  bot.sendMessage(id, format(strings.ntf_confirmation_01, {name}) , {replyMarkup:mainMenu});
};

/*Indica que aconteceu uma ocorrência*/
var sendNotificationAlert = function(name) {
  Telegram.find().then((chats) => {
    chats.forEach((chat) => {
      bot.sendMessage(chat.chat_id, format(strings.ntf_alert_01, {name}) , {replyMarkup:mainMenu});
    });
  });
};

/*Indica que o alarme foi ativado por agendamento*/
var sendNotificationAlarmActivateSchedule = function(name) {
  Telegram.find().then((chats) => {
    chats.forEach((chat) => {
      bot.sendMessage(chat.chat_id, format(strings.ntf_alarm_01, {name}), {replyMarkup:mainMenu});
    });
  });
};

/*Indica que o alarme foi ativado via Telegram (envia para todo o resto das pessoas)*/
var sendNotificationAlarmActivateTelegram = function(id) {
  Telegram.find().then((chats) => {
    chats.forEach((chat) => {
      if(chat.chat_id != id) {
        bot.sendMessage(chat.chat_id, format(strings.ntf_alarm_02, {first:msg.from.first_name, last:msg.from.last_name}), {replyMarkup:mainMenu});
      }
    });
  });
};

/*Indica que alguém ativou o alarme via Keypad*/
var sendNotificationAlarmActivateKeypad = function(name) {
  Telegram.find().then((chats) => {
    chats.forEach((chat) => {
      bot.sendMessage(chat.chat_id, format(strings.ntf_alarm_03, {name}), {replyMarkup:mainMenu}).then(() =>{
        bot.sendMessage(chat.chat_id, strings.ntf_alarm_07, {replyMarkup:mainMenu});
      });
    });
  });
};

/*Indica que o alarme foi desativado por agendamento*/
var sendNotificationAlarmDeactivateSchedule = function() {
  Telegram.find().then((chats) => {
    chats.forEach((chat) => {
      bot.sendMessage(chat.chat_id, strings.ntf_alarm_04, {replyMarkup:mainMenu});
    });
  });
};

/*Indica que o alarme foi desativado via Telegram*/
var sendNotificationAlarmDeactivateTelegram = function(id) {
  Telegram.find().then((chats) => {
    chats.forEach((chat) => {
      if(chat.chat_id != id)
      bot.sendMessage(chat.chat_id, format(strings.ntf_alarm_05, {first:msg.from.first_name, last:msg.from.last_name}), {replyMarkup:mainMenu});
    });
  });
};

/*Indica que o alarme foi desativado via Keypad*/
var sendNotificationAlarmDeactivateKeypad = function(name) {
  Telegram.find().then((chats) => {
    chats.forEach((chat) => {
      bot.sendMessage(chat.chat_id, format(strings.ntf_alarm_06, {name}), {replyMarkup:mainMenu}).then(() =>{
        if (alarm.getStatus()) {
          bot.sendMessage(chat.chat_id, strings.ntf_alarm_07, {replyMarkup:mainMenu});
        } else {
          bot.sendMessage(chat.chat_id, strings.ntf_alarm_08, {replyMarkup:mainMenu});
        }
      });
    });
  });
};

/*Indica que a sirene foi ativada via Telegram*/
var sendNotificationSirenActivateTelegram = function(first, last, id) {
  Telegram.find().then((chats) => {
    chats.forEach((chat) => {
      if(chat.chat_id != id) {
        bot.sendMessage(chat.chat_id, format(strings.ntf_siren_01, {first, last}), {replyMarkup:mainMenu});
      }
    });
  });
};

/*Indica que a sirene foi ativada via Telegram*/
var sendNotificationSirenActivateKeypad = function() {
  Telegram.find().then((chats) => {
    chats.forEach((chat) => {
      bot.sendMessage(chat.chat_id, strings.ntf_siren_02, {replyMarkup:mainMenu});
    });
  });
};

/*Iniciando o bot*/
bot.start();

setTimeout(sendTest, 10000);

// bot.sendMessage("176256611", format(strings.ntf_alarm_01, {name:"Agendamento dias de semana"}), {replyMarkup:mainMenu}).then(() => {
//   bot.sendMessage("176256611", strings.ntf_alarm_07, {replyMarkup:mainMenu}).then(() => {
//     bot.sendMessage("176256611", format(strings.ntf_alarm_04, {name:"Agendamento fim de semana"}), {replyMarkup:mainMenu}).then(() =>{
//       bot.sendMessage("176256611", strings.ntf_alarm_08, {replyMarkup:mainMenu});
//     });
//   });
// });

// bot.sendMessage("176256611", format(strings.ntf_alarm_02, {first: 'Igor', last:'Quintal'}), {replyMarkup:mainMenu}).then(() => {
//     bot.sendMessage("176256611", format(strings.ntf_alarm_05, {first: 'Igor', last:'Quintal'}), {replyMarkup:mainMenu});
// });

// bot.sendMessage("176256611", format(strings.ntf_alarm_03, {name: 'Keypad do portão'}), {replyMarkup:mainMenu}).then(() => {
//     bot.sendMessage("176256611", format(strings.ntf_alarm_06, {name: 'Keypad do portão'}), {replyMarkup:mainMenu});
// });

// bot.sendMessage("176256611", format(strings.ntf_siren_01, {first: 'Igor', last:'Quintal'}), {replyMarkup:mainMenu}).then(() => {
//   bot.sendMessage("176256611", format(strings.ntf_siren_02, {name: 'Keypad portão de entrada'}), {replyMarkup:mainMenu}).then(() => {
//     bot.sendMessage("176256611", format(strings.ntf_siren_03, {first: 'Igor', last:'Quintal'}), {replyMarkup:mainMenu}).then(() =>{
//       bot.sendMessage("176256611", format(strings.ntf_siren_04, {name: 'Keypad portão de entrada'}), {replyMarkup:mainMenu});
//     });
//   });
// });

    // bot.sendMessage("176256611", format(strings.ntf_alert_01, {name: 'Sensor magnético - janela da cozinha'}), {replyMarkup:mainMenu});

module.exports = {
  sendNotificationAlert,
  sendNotificationAlarmActivateSchedule,
  sendNotificationAlarmActivateTelegram,
  sendNotificationAlarmActivateKeypad,
  sendNotificationAlarmDeactivateSchedule,
  sendNotificationAlarmDeactivateTelegram,
  sendNotificationAlarmDeactivateKeypad,
  sendNotificationSirenActivateTelegram,
  sendNotificationSirenActivateKeypad,
  validateChatId,
  sendNotificationConfirmation,
  bot
};
