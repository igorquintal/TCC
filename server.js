/*Required libraries for the server to work as expected*/
const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const ip = require('ip').address();
const mac = require('getmac');
const hbs = require('hbs');
const multer = require('multer');
const axios = require('axios');

/*Custom modules required for database manipulation*/
const alarm = require('./alarm/alarm');
const {mongoose} = require('./db/mongoose');
const {Device} = require('./models/device');
const {Settings} = require('./models/settings');
const email = require('./email/email');
const scheduler = require('./scheduler/scheduler');
const user = require('./user/user');
const telegram = require('./telegram/telegram');
const ping = require('./sensors/ping');

/*Log Libraries*/
const monitorLog = require('./log/monitor');
const alarmLog = require('./log/alarm');
const sirenLog = require('./log/siren');
const utilsLog = require('./log/utils');

const siren = require('./siren/siren');

const {SHA256} = require('crypto-js');

const chatBot = require('./telegram/bot');

require('os').networkInterfaces()

/*Creating the express web app*/
var app = express();

hbs.registerPartials(__dirname + '\\views\\partials');
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '\\pictures'));

/*Defining the port for the server*/
const port = 3000;

/*Starting all necessary systems*/
scheduler.startAllSchedules();
setInterval(ping.recurrentPing, 120000);
telegram.startAll();

/*As we are going to use JSON*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

/*HBS helpers*/
hbs.registerHelper('deviceStatus', (text) => {
  return text ? 'Online' : 'Offline';
});

hbs.registerHelper('lastActivity', (text) => {
  return text ? text : 'Nenhuma atividade!';
});

hbs.registerHelper('encodeMyString',function(inputData){
    return new hbs.SafeString(inputData);
});

hbs.registerHelper('checkWeekDays',function(tagDay, days){
    return days.indexOf(tagDay) >= 0 ? 'checked' : '';
});

hbs.registerHelper('fixNumber',function(number){
    return number == 0 ? '00' : number;
});

/*----------------------------------------------------------------------------*/
/*----------------------------------FUNCIONANDO-------------------------------*/

/*FROM NODEMCU*/

app.get('/', (req, res) => {
  res.render('home.hbs', {pageName:'Home'});
})

/*Adiciona um novo dispositivo*/
app.post('/newDevice', (req, res) => {

  /*Getting informaton from the new device*/
  var body = _.pick(req.body, ['mac', 'name', 'behavior', 'ip', 'hostname']);
  var device = new Device(body);

  /*Saving the new information on the database*/
  device.save().then(() => {
    //email.registerNewDevice(body);
    res.status(200).send();
  }, (error) => {
    res.status(400).send();
  });
});

/*                         Alert devices                                      */
/*----------------------------------------------------------------------------*/
//OK
app.post('/alert', (req, res) => {

  alarm.alert();

  var hostname = req.body.hostname;

  Device.findOneAndUpdate({hostname}, {last_activity: new Date()}).then((device) => {
    monitorLog.logOccurrence(device.name);
    res.send('success');
  }, (e) => {
    console.log(e);
  })
});

//OK
app.post('/activateKeypadAlarm', (req, res) => {

  alarm.activateKeypadAlarm(req.body.password, req.body.hostname);
  res.send('success');
});

//OK
app.post('/deactivateKeypadAlarm', (req, res) => {

  alarm.deactivateKeypadAlarm(req.body.password, req.body.hostname);
  res.send('success');
});

//OK
app.post('/activateSiren', (req, res) => {

  siren.activateKeypadSiren(req.body.password);
  res.send('success');
});

//OK
app.post('/deactivateSiren', (req, res) => {

  siren.deactivateKeypadSiren(req.body.password);
  res.send('success');
});

//OK
app.get('/newDevice', (req, res) => {
  mac.getMac((err, macAddress) => {
    res.render('newDevice.hbs', {ip, macAddress, pageName:'Dispositivo'});
  })
});

//OK
app.get('/allDevices', (req, res) => {
  Device.find().then((devices) => {
    res.render('devices.hbs', {devices, pageName:'Dispositivos'});
  }, (e) => {
    console.log(`ERROR ${e}`);
  });
});

//OK
app.get('/device/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  Device.findOne({hostname}).then((device) => {
    if(device) {
      device.pageName = 'Dispositivo';
      res.render('device.hbs', device);
    } else {
      res.redirect('/allDevices');
    }
  })
});

//OK
app.post('/device/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  var name = req.body.name;
  var behavior = req.body.behavior;
  Device.findOneAndUpdate({hostname}, {name, behavior}).then(() => {
      res.redirect('/allDevices');
  });
});

//OK
app.get('/deleteDevice/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  Device.remove({hostname}).then((result) => {
    res.redirect('/allDevices');
  }, (e) => {
    res.send('ERROR');
  });
});

//OK
app.get('/allSchedules', (req, res) => {
  scheduler.getAllSchedules().then((schedules) => {
    res.render('schedules.hbs', {schedules, pageName:'Agendamentos'});
  })
});

//OK
app.get('/newSchedule', (req, res) => {
  res.render('newSchedule.hbs', {pageName:'Agendamento'});
});

//OK
app.post('/newSchedule', (req, res) => {
  var days_begin = (typeof req.body.days_begin == 'object') ? req.body.days_begin.map((digit) => {return parseInt(digit, 10);}) : req.body.days_begin;
  var days_end = (typeof req.body.days_end == 'object') ? req.body.days_end.map((digit) => {return parseInt(digit, 10);}) : req.body.days_end;
  var name = req.body.name;
  var begin = req.body.time_begin;
  var end = req.body.time_end;
  scheduler.defineNewSchedule({days_begin, days_end, begin, end, name}).then(() => {
    res.redirect('/allSchedules');
  })
});

//OK
app.get('/schedule/:name', (req, res) => {
  scheduler.getSchedule(req.params.name).then((schedule) => {
    schedule.pageName='Agendamento';
    res.render('schedule.hbs', schedule);
  })
});

//OK
app.get('/deleteSchedule/:name', (req, res) => {
  var name = req.params.name;
  scheduler.removeSchedule(name).then(() => {
    res.redirect('/allSchedules');
  })
});

//OK
app.get('/allUsers', (req, res) => {
    user.findAllUsers().then((users) => {
      res.render('users.hbs', {users, pageName:'Usuários'});
    });
});

//OK
app.get('/user/:name', (req, res) => {
  user.findUserByName(req.params.name).then((user) => {
    telegram.getAllTelegrams().then((telegrams) => {
      Device.find({category:'rfid'}).then((rfid) => {

        user.pageName = 'Usuário';

        if(user.chat_id) {
          user.display_telegram_1 = 'style="display:none"';
        } else {
          user.display_telegram_2 = 'style="display:none"';
        }

        if(user.card_id) {
          user.display_card_1 = 'style="display:none"';
        } else {
          user.display_card_2 = 'style="display:none"';
        }

        user.telegrams = telegrams.unregistered;
        user.rfid = rfid;
        res.render('user.hbs', user);
      });
    });
  });
});

//OK
app.get('/deleteUser/:name', (req, res) => {
  user.removeUser(req.params.name).then((user) => {
    res.redirect('/allUsers');
  });
});

var upload = multer({dest: __dirname + '\\pictures\\'});

//OK
app.get('/newUser', (req, res) => {
  Device.find({category: 'rfid'}).then((rfid) => {
    telegram.getAllTelegrams().then((telegrams) => {
      res.render('newUser.hbs', {rfid, pageName:'Novo usuário', telegrams:telegrams.unregistered});
    });
  });
});

//OK
app.post('/newUser', upload.single('image'), (req, res) => {
  user.newUser(req.body.name, req.file.filename).then(() => {
    res.redirect('/allUsers');
  });
});

//OK
app.post('/registerCard', (req, res) => {
  user.registerCard(req.body.keypad, req.body.user_id).then((data) => {
    res.send(String(data));
  }, (e) => {
    res.send('ERROR');
  });
});

//OK
app.get('/deleteCard/:name', (req, res) => {
  user.removeCard(req.params.name).then(() => {
    res.redirect('/user/' + req.params.name);
  });
});

//OK
app.post('/telegram', (req, res) => {
  telegram.assignTelegram(req.body.chat_id, req.body.user_id).then(() => {
    res.send('SUCCESS');
  });
});

//OK
app.get('/deleteTelegramUser/:name', (req, res) => {
  telegram.removeTelegramFromUser(req.params.name).then(() => {
    res.redirect('/user/' + req.params.name);
  });
});

app.get('/settings', (req, res) => {
  Settings.find().then((settings) => {
    res.render('settings.hbs', {
      telegramKey: settings[0].telegram_api_key,
      linkCamera: settings[0].ip_camera_link,
      weatherLocation: settings[0].darksky_location,
      pageName: 'Configurações'
    });
  });
});

app.post('/settingsKeypad', (req, res) => {
  res.redirect('/');
});

app.post('/settingsTelegram', (req, res) => {
  res.redirect('/');
});

app.post('/settingsCamera', (req, res) => {
  res.redirect('/');
});

app.post('/settingsWeather', (req, res) => {
  res.redirect('/');
});

app.get('/test', (req, res) => {
  console.log('mDNS FUNCIONANDO');
});

var server = app.listen(port, () => {
  console.log(`Started on port ${port}! ${ip}`);
});

// chatBot.bot.start();

module.exports = {app};
