/*----------------------------------------------------------------------------------------------------------------*/

/*SCHEDULE ALARM*/
var activate_schedule_alarm = 'O alarme foi ativado conforme agendamento {name}. Data: {time}.\n';
var deactivate_schedule_alarm = 'O alarme foi desativado conforme agendamento {name}. Data: {time}.\n\n';

/*MANUAL ALARM TELEGRAM*/
var activate_telegram_alarm = 'O alarme foi ativado por {first} {last} via Telegram. Data: {time}.\n';
var deactivate_telegram_alarm = 'O alarme foi desativado por {first} {last} via Telegram. Data: {time}.\n\n';

/*MANUAL ALARM TELEGRAM*/
var activate_keypad_alarm = 'O alarme foi ativado via Keypad {name}. Data: {time}.\n';
var deactivate_keypad_alarm = 'O alarme foi desativado via Keypad {name}. Data: {time}.\n\n';

/*----------------------------------------------------------------------------------------------------------------*/

/*SIREN ALARM*/
var activate_alarm_siren = 'A sirene foi ativada devido ao alarme. Data: {time}.\n';
var deactivate_alarm_siren = 'A sirene foi desativada devido ao alarme. Data: {time}.\n\n';

/*SIREN MANUAL TELEGRAM*/
var activate_telegram_siren = 'A sirene foi ativada por {first} {last} via Telegram. Data: {time}.\n';
var deactivate_telegram_siren = 'A sirene foi ativada por {first} {last} via Telegram. Data: {time}.\n\n';

/*SIREN MANUAL KEYPAD*/
var activate_keypad_siren = 'A sirene foi ativada via Keypad. Data: {time}.\n';
var deactivate_keypad_siren = 'A sirene foi ativada via Keypad. Data: {time}.\n\n';

var activate_keypad_fire = 'O alarme de incêndio foi acionado pelo keypad cadastrado com o nome {name}. Data: {time}.';
var deactivate_keypad_fire = 'O alarme de incêndio foi desligado pelo keypad cadastrado com o nome {name}. Data: {time}.';
var deactivate_telegram_fire = 'O alarme de incêndio foi desligado via Telegram por {first} {last}. Data: {time}.';
var activate_fire = 'O sensor {name} reportou um possível indício de incêndio. O alarme de incêndio foi ativado. Data: {time}.';

/*----------------------------------------------------------------------------------------------------------------*/

/*MONITOR*/
var monitor = 'Ocorrência detectada: Sensor {name} - Horário {time}\n';

/*----------------------------------------------------------------------------------------------------------------*/

/*PINGING SENSORS*/
var ping_01 = `\nRequisição de ping realizada. Data {time}\n`;
var ping_02 = '--> Todos os sensores registrados estão Online\n';
var ping_03 = '--> Sensores Online:\n';
var ping_04 = '--> Sensores Offline\n';
var ping_05 = '    --> Nome: {name}  IP: {ip}\n';

var ping_telegram_01 = `\nRequisição de ping realizada via Telegram por {first} {last}. Data {time}`;

/*----------------------------------------------------------------------------------------------------------------*/

var occurrence = '--> OCORRÊNCIA DETECTADA: Sensor {name} - Horário {time}. Sirene foi acionada!\n';
var break_line = '------------------------------------------------------------------------------\n';

module.exports = {
  activate_schedule_alarm,
  deactivate_schedule_alarm,
  activate_telegram_alarm,
  deactivate_telegram_alarm,
  activate_keypad_alarm,
  deactivate_keypad_alarm,
  activate_alarm_siren,
  deactivate_alarm_siren,
  activate_telegram_siren,
  deactivate_telegram_siren,
  activate_keypad_siren,
  deactivate_keypad_siren,
  ping_01,
  ping_02,
  ping_03,
  ping_04,
  ping_05,
  monitor,
  occurrence,
  break_line,
  ping_telegram_01
};
