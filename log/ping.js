var fs = require('fs');
var format = require('string-format');
var strings = require('./strings');
var _ = require('lodash');

/*Log recorrente do sistema*/
var logRecurrentPing = function(devices) {

  devices = _.partition(devices, (device => device.status == true));

  var date = new Date();
  fs.appendFileSync(`./log/ping/${date.toDateString()}.txt`, format(strings.ping_01, {time:date.toLocaleString()}));

  if(devices[1].length == 0) {
    fs.appendFileSync(`./log/ping/${date.toDateString()}.txt`, strings.ping_02);
    return;
  }

  fs.appendFileSync(`./log/ping/${date.toDateString()}.txt`, strings.ping_03);

  devices[0].forEach((device) => {
    fs.appendFileSync(`./log/ping/${date.toDateString()}.txt`, format(strings.ping_05, {name:device.name, ip:device.ip}));
  });

  fs.appendFileSync(`./log/ping/${date.toDateString()}.txt`, strings.ping_04);

  devices[1].forEach((device) => {
    fs.appendFileSync(`./log/ping/${date.toDateString()}.txt`, format(strings.ping_05, {name:device.name, ip:device.ip}));
  });
};

/*Log solicitado pelo Telegram*/
var logTelegramPing = function(devices, first, last) {

  devices = _.partition(devices, (device => device.status == true));

  var date = new Date();
  fs.appendFileSync(`./log/ping/${date.toDateString()}.txt`, format(strings.ping_telegram_01, {time:date.toLocaleString(), first, last}));

  if(devices[1].length == 0) {
    fs.appendFileSync(`./log/ping/${date.toDateString()}.txt`, strings.ping_02);
    return;
  }

  fs.appendFileSync(`./log/ping/${date.toDateString()}.txt`, strings.ping_03);

  devices[0].forEach((device) => {
    fs.appendFileSync(`./log/ping/${date.toDateString()}.txt`, format(strings.ping_05, {name:device.name, ip:device.ip}));
  });

  fs.appendFileSync(`./log/ping/${date.toDateString()}.txt`, strings.ping_04);

  devices[1].forEach((device) => {
    fs.appendFileSync(`./log/ping/${date.toDateString()}.txt`, format(strings.ping_05, {name:device.name, ip:device.ip}));
  });
};
module.exports = {logRecurrentPing, logTelegramPing};
