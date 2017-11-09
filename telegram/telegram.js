const {mongoose} = require('./../db/mongoose');
const {Telegram} = require('./../models/telegram');
const {User} = require('./../models/user');
const bot = require('./bot');
const _ = require('lodash');

var getAllTelegrams = function() {
  return new Promise((resolve, reject) => {
    Telegram.find().then((telegrams) => {
      telegrams = _.partition(telegrams, (telegram => telegram.active == true));
      resolve({
         registered : telegrams[0],
        unregistered : telegrams[1]
      });
    });
  });
};

var getTelegramByID = function(chat_id) {
  return new Promise((resolve, reject) => {
    Telegram.find(chat_id).then((telegram) => {
      resolve(telegram);
    });
  });
};

var removeTelegram = function(chat_id) {
  return new Promise((resolve, reject) => {
    Telegram.remove({chat_id}).then(() => {
      resolve();
    });
  });
};

var removeTelegramFromUser = function(name) {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({name}, {chat_id : ''}).then((user) => {
      Telegram.findOneAndUpdate({chat_id:user.chat_id}, {active:false}).then((telegram) => {
        resolve();
      });
    });
  });
};

var assignTelegram = function(chat_id, user_id) {
  return new Promise((resolve, reject) => {
    Telegram.findOneAndUpdate({chat_id}, {active:true, user_id}).then(() => {
      User.findOneAndUpdate({_id: mongoose.Types.ObjectId(user_id)}, {chat_id}).then((user) => {
        bot.validateChatId(chat_id);
        bot.sendNotificationConfirmation(chat_id, user.name);
        resolve();
      });
    });
  });
};

/*Reinicia o sistema do telegram*/
var startAll = function() {
  Telegram.find().then((chats) => {
    chats.forEach((chat) => {
      if (chat.active) {
        bot.validateChatId(chat.chat_id);
      };
    });
  });
};

module.exports = {
  getAllTelegrams,
  getTelegramByID,
  removeTelegram,
  assignTelegram,
  removeTelegramFromUser,
  startAll
};
