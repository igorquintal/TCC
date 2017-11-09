// const {mongoose} = require('./../db/mongoose');
const schedule = require('node-schedule');
const {Schedule} = require('./../models/schedule');
const alarm = require('./../alarm/alarm');
const telegram = require('./../telegram/bot')

var activeSchedules = [];

/*Funções auxiliares*/

/*Define o alarme como ativo*/
var activateSchedule = function(name) {
  activeSchedules.push(name);
};

/*Remove o schedule que foi adicionado*/
var deactivateschedule = function(name) {
  var index = activeSchedules.indexOf(name);
  if(index >= 0) {
    activeSchedules.splice(index);
  }
};

/*Verifica se um determinado agendamenteo está ativo*/
var verifyIfActive = function(name) {
  return activeSchedules.indexOf(name) >= 0 ? true : false;
};

/*Ativa/desativa alarme de acordo com agendamento*/

/*Ativa o alarme*/
var scheduleActivateAlarm = function(name) {
  // console.log('ATIVOU ALARME ' + name);
  activateSchedule(name);
  alarm.activateScheduleAlarm(name);
  bot.sendNotificationAlarmActivateSchedule(name);
};

/*Desativa o alarme*/
var scheduleDeactivateAlarm = function(name) {
  // console.log('DESATIVOU ALARME ' + name);
  deactivateschedule(name);
  if (activeSchedules.length > 0) {
      alarm.deactivateScheduleAlarm(name);
  }
};

/*Criação de novos agendamentos*/

/*Cria de fato o alarme no sistema. NÃO NO DB*/
var createAlarmScheduler = function(hour_begin, hour_end, minute_begin, minute_end, name, days_begin, days_end) {

    // console.log(hour_begin, hour_end, minute_begin, minute_end, name, days_begin, days_end);

    schedule.scheduleJob(`${name}_BEGIN`, {
      hour: hour_begin,
      minute: minute_begin,
      dayOfWeek: days_begin
    }, scheduleActivateAlarm.bind(null, name));

    schedule.scheduleJob(`${name}_END`, {
      hour: hour_end,
      minute: minute_end,
      dayOfWeek: days_end
    }, scheduleDeactivateAlarm.bind(null, name));
};

/*Cria um novo agendamento. APENAS NO DB. Depois será adicionado no sistema*/
var defineNewSchedule = function(scheduleObject) {
  return new Promise(function(resolve, reject) {

    var hour_begin = parseInt(scheduleObject.begin.split(':')[0]);
    var minute_begin = parseInt(scheduleObject.begin.split(':')[1]);

    var hour_end = parseInt(scheduleObject.end.split(':')[0]);
    var minute_end = parseInt(scheduleObject.end.split(':')[1]);

    var {name, days_begin, days_end} = scheduleObject;

    var newSchedule = Schedule({hour_begin, hour_end, minute_begin, minute_end, name, days_begin, days_end});

    newSchedule.save().then((object) => {
      createAlarmScheduler(hour_begin, hour_end, minute_begin, minute_end, name, days_begin, days_end);
      resolve();
    }, (e) => {
      console.log('ERROR ' + e);
    });
  });
};

/*Funções de manutenção dos agenadmentos*/

/*Retorna todos os agendamentos do sistema (ativos e inativos)*/
var getAllSchedules = function() {
  return new Promise(function(resolve, reject) {
    Schedule.find().then((allSchedules) => {
      resolve(allSchedules);
    });
  });
};

/*Apaga um determinado agendamento (inclusive do DB)*/
var removeSchedule = function(name) {
  return new Promise(function(resolve, reject) {
    scheduleDeactivateAlarm(name);
    schedule.scheduledJobs[name + '_BEGIN'].cancel();
    schedule.scheduledJobs[name + '_END'].cancel();
    Schedule.remove({name}).then((deletedSchedule) => {
      resolve();
    });
  });
};

/*Retorna as informações de um determinado agendamento*/
var getSchedule = function(name) {
  return new Promise(function(resolve, rejecct) {
    Schedule.findOne({name}).then((foundSchedule) => {
      resolve(foundSchedule);
    })
  });
};

/*Inicializa todos os agendamentos no DB. Utilizada para iniciar o sistema*/
var startAllSchedules = function() {
  Schedule.find().then((schedules) => {
    schedules.forEach((schedule) => {
      createAlarmScheduler(schedule.hour_begin, schedule.hour_end, schedule.minute_begin, schedule.minute_end, schedule.name, schedule.days_begin, schedule.days_end);
    });
  })
};

// /*Ativa todos os schedules de acordo com o necessário*/
// var activateAll = function() {
//   return new Promise((resolve, reject) => {
//     Schedule.find().then((schedules) => {
//       schedules.forEach((schedule) => {
//         if (shouldBegin(schedule) && shouldNotHaveEnded(schedule)) {
//           /*ATIVAR AQUI*/
//         };
//       });
//     });
//   });
// };

module.exports = {
  defineNewSchedule,
  getAllSchedules,
  removeSchedule,
  getSchedule,
  startAllSchedules
};









// cancelar os jobs, nao esquecer










var printAll = function() {

  console.log('ALARM BEGIN ' + alarmBegin);
  console.log('ALARM END ' + alarmEnd);
  console.log('ALARM ACTIVE ' + alarmActive);
  console.log('ALARM BY TIME ' + alarmByTime);
}
