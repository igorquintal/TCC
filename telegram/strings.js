/*BUTTONS*/
const BUTTONS = {
    sensors_btn: {
        label: 'Listar todos os sensores',
        command: '/listSensors'
    },
    siren_btn: {
        label: 'Ativar/Desativar a sirene',
        command: '/siren'
    },
    alarm_btn: {
        label: 'Ativar/Desativar o alarme',
        command: '/alarm'
    },
    schedule_btn: {
      label: 'Verificar agendamentos',
      command: '/schedules'
    },
    activate_alarm_btn: {
        label: 'Ativar o alarme',
        command: '/activateAlarm'
    },
    deactivate_alarm_btn: {
        label: 'Desativar o alarme',
        command: '/deactivateAlarm'
    },
    activate_siren_btn: {
        label: 'Ativar a sirene',
        command: '/activateSiren'
    },
    deactivate_siren_btn: {
        label: 'Desativar a sirene',
        command: '/deactivateSiren'
    },
    main_menu_btn: {
      label: 'Menu principal',
      command: '/mainMenu'
    },
    require_id_btn: {
      label: 'Requisitar código de cadastro',
      command: '/requireID'
    }
};

/*STARTING BOT*/
var start_01 = `Olá, tudo bem? Bem vindo ao seu Bot de monitoramento Home Security System!`
var start_02 = `Seu sistema está sendo configurado para que possa ser monitorado aqui pelo Telegram. O processo não deve demorar muito, mas vamos te alertar quando tudo estiver pronto!`;
var start_03 = `Siga as instruções abaixo para efetuar o cadastro deste dispositivo:\n1 - Acesse o portal do seu sistema de segurança.\n2 - Selecione o painel de usuários e selecione um dos usuários.\n3 - Procure pela opção "Cadastrar Telegram" e selecione o código {id} no campo apropriado\n4 - Você receberá uma mensagem com a confirmação do processo!`;
var start_04 = `Este dispositivo ainda não foi cadastrado em seu sistema. Seu código de cadastro é {id}.`;
var start_05 = `Este dispositivo já está cadastrado. Verifique se ele está atribuído a um usuário no painel do sistema!`;

/*LISTING ALL SENSORS*/
var sensors_01 = `Estamos processando sua requisição! Pode levar alguns segundos!`;
var sensors_02 = 'Abaixo encontra-se a lista de todos os seus sensores registrados no sistema.';
var sensors_03 = 'Sensores que se encontram ONLINE:';
var sensors_04 = 'Sensores que se encontram OFFLINE:';
var sensors_05 = 'Nome: {name}\nIP: {ip}\nÚltima atividade: {last_activity}';
var sensors_06 = 'Nenhum dispositivo Online! Por favor, verifique sua rede!';
var sensors_07 = 'Nenhum dispositivo offline!';

/*SIREN OPTION*/
var siren_01 = 'Escolha uma das opções a seguir:';
var siren_02 = 'A sirene será ativada em 10 segundos!';
var siren_03 = 'Desligando a sirene!';

/*ALARM OPTION*/
var alarm_01 = 'No momento o alarme se encontra {status}!';
var alarm_02 = 'Escolha uma das opções a seguir:';
var alarm_03 = 'ATENÇÃO: uma vez que o alarme é ativado manualmente, ele deverá ser desativado também manualmente! Quaisquer agendamentos de alarme serão desativados momentaneamente!';
var alarm_04 = 'O alarme será ativado em 10 segundos!';
var alarm_05 = 'Alarme desligado!';

/*SCHEDULE OPTIONS*/
var schedule_01 = 'Os seguintes agendamentos estão ativos:'
var schedule_02 = 'Nome: {name}\n\nHorário de início: {beginTime}\nDias marcados: {daysBegin}\n\nHorário de término: {endTime}\nDias marcados: {daysEnd}';

var ntf_alarm_01 = 'O agendamento de nome "{name}" foi ativado!';
var ntf_alarm_02 = 'O sistema de alarme foi ativado devido a uma solicitação via Telegram por {first} {last}!';
var ntf_alarm_03 = 'O sistema de alarme foi ativado devido a uma solicitação via Keypad, cadastrado com o nome "{name}"!';
var ntf_alarm_04 = 'O agendamento de nome "{name}" foi desativado!';
var ntf_alarm_05 = 'O sistema de alarme foi desativado devido a uma solicitação via Telegram por {first} {last}!';
var ntf_alarm_06 = 'O sistema de alarme foi desativado devido a uma solicitação via Keypad, cadastrado com o nome "{name}"!';
var ntf_alarm_07 = 'O alarme se encontra LIGADO';
var ntf_alarm_08 = 'O alarme se encontra DESLIGADO';

var ntf_siren_01 = 'A sirene foi ativada devido a uma solicitação via Telegram por {first} {last}!';
var ntf_siren_02 = 'A sirene foi ativada devido a uma solicitação via Keypad, cadastrado com o nome "{name}"!';
var ntf_siren_03 = 'A sirene foi desativada devido a uma solicitação via Telegram por {first} {last}!';
var ntf_siren_04 = 'A sirene foi desativada devido a uma solicitação via Keypad, cadastrado com o nome "{name}"!';

var ntf_alert_01 = 'ATENÇÃO! O sensor {name} reportou uma ocorrência! O alarme será disparado em 10 segundos! Se você reconhece este evento, por favor, desarme o alarme!';

var ntf_confirmation_01 = 'Sua conta do Telegram foi aprovada para o usuário(a) {name}! Você agora tem autorização para utilizar este sistema!';

module.exports = {
  start_01,
  start_02,
  start_03,
  start_04,
  start_05,
  sensors_01,
  BUTTONS,
  sensors_01,
  sensors_02,
  sensors_03,
  sensors_04,
  sensors_05,
  sensors_06,
  sensors_07,
  siren_01,
  siren_02,
  siren_03,
  alarm_01,
  alarm_02,
  alarm_03,
  alarm_04,
  alarm_05,
  ntf_alarm_01,
  ntf_alarm_02,
  ntf_alarm_03,
  ntf_alarm_04,
  ntf_alarm_05,
  ntf_alarm_06,
  ntf_alarm_07,
  ntf_alarm_08,
  ntf_siren_01,
  ntf_siren_02,
  ntf_alert_01,
  ntf_confirmation_01,
  schedule_01,
  schedule_02,
  ntf_siren_03,
  ntf_siren_04
};
