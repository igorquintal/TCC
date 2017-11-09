const {mongoose} = require('./../db/mongoose');
const {Device} = require('./../models/device');
const ping = require('ping');
const _ = require('lodash');
const logPing = require('./../log/ping');
var ObjectId = require('mongodb').ObjectID;

var devicesStatus;

/*Retorna todos os devices online e todos os offlines*/
var listAllByStatus = function() {
  return new Promise((resolve, reject) => {
    Device.find().then((devices) => {
      devices = _.partition(devices, (device => device.status == true));
      resolve({
         online : devices[0],
        offline : devices[1]
      });
    }, (e) => {
      console.log('ERROR');
    });
  });
};

/*Realiza o ping em todos os dispositivos*/
var pingAll = function() {
  return new Promise((resolve, reject) => {
    Device.find().then((devices) => {
      Promise.all(devices.map(pingDevice)).then((data) => {
        Promise.all(data.map(updateEach)).then(() => {
          // logPing();
          resolve(devices);
        }, (e) => {
          console.log(e);
        });
      });
    }, (e) => {
      console.log(e);
    });
  });
};

/*Promise de ping para cada dispositivo*/
var pingDevice = function(device) {
  return new Promise((resolve, reject) => {
      ping.sys.probe(device.ip, (isAlive) => {
        device.status = isAlive;
        resolve(device);
      });
  });
};

var updateEach = function(device) {
  return new Promise ((resolve) => {
    Device.update({"_id": ObjectId(device._id)}, {"$set": {"status": device.status }}).then((result) => {
      resolve();
    }, (e) => {
      console.log(e);
    });
  });
};

/*Realiza ping do telegram*/
var pingFromTelegram = function(first, last) {
  return new Promise((resolve) => {
    pingAll().then((devices) => {
      logPing.logTelegramPing(devices, first, last);
      resolve(devices);
    });
  });
};

/*Realiza ping recorrente do sistema*/
var recurrentPing = function() {
  return new Promise((resolve) => {
    pingAll().then((devices) => {
      logPing.logRecurrentPing(devices);
      resolve(devices);
    });
  });
};

// pingAll().then((devices) => {
//   console.log(devices);
// });

// pingAll().then((devices) => {
//   console.log(devices);
// });
//
// var test = function() {
//   Device.find().then((devices) => {
//     Device.update({"_id": ObjectId(devices[0]._id)}, {"$set": {"hostname": "A" }}).then((result) => {
//       console.log(devices);
//       console.log(result);
//     })
//   });
// };
//
// test();

module.exports = {
  pingAll,
  pingFromTelegram,
  recurrentPing,
  listAllByStatus
};

// var device = {
//   "_id" : "59d66a4c82150a316cb8fb77",
//   "status" : false
// };
//
// Device.update({"_id": ObjectId(device._id)}, {"$set": {"status": device.status }}).then((result) => {
//   console.log(result);
// }, (e) => {
//   console.log(e);
// });

// hosts.forEach( function(host) {
//     ping.sys.probe(host, function(isAlive){
//         var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
//         // console.log(msg);
//         console.log(isAlive);
//     });
// });

// pingAll();
