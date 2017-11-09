/*Requiring necessary modeules*/
var fs = require('fs');
var nodemailer = require('nodemailer');
var hbs = require('handlebars');

/*----------------------------------------------------------------------------*/
/*Gets the HTML for Handlebars to compile*/
var getHTML = (filename) => {
  try {
    return html = fs.readFileSync(filename, "utf8");
  } catch (e) {
    console.log(e);
    return ('ERROR ON EMAIL SERVER! PLEASE, CHECK YOUR SYSTEM');
  }
};

/*----------------------------------------------------------------------------*/
/*Default variables*/
var HTML_newDevice = hbs.compile(getHTML('C:\\Users\\igor_\\Desktop\\Server-TCC\\server\\email\\templates\\new-device.html'));

/*----------------------------------------------------------------------------*/
/*This are default options, and should be defined ass such*/
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'smart.systems.email@gmail.com',
    pass: 'smartsystems2017'
  }
});

/*----------------------------------------------------------------------------*/
/*default options*/
var mailOptions = {
  from: 'smart.systems.email@gmail.com',
  to: 'igorquintalmendes@gmail.com',
  attachments: [{
        filename: 'smart.png',
        path: 'C:\\Users\\igor_\\Desktop\\Server-TCC\\server\\email\\templates\\smart.png',
        cid: 'unique@nodemailer.com' //same cid value as in the html img src
    }]
};

/*----------------------------------------------------------------------------*/
/*Function to handle each of the emails*/
var registerNewDevice = (data) => {

  mailOptions.subject = 'Smart Systems Update - A new device was added to your home network!';
  mailOptions.html = HTML_newDevice(data);
  sendMail(mailOptions);
};

/*----------------------------------------------------------------------------*/
/*Effectively sends the e-mail*/
var sendMail = (mailOptions) => {
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = {registerNewDevice};

/*TESTS*/
// registerNewDevice({
//   name: 'dispositivo',
//   behavior: 'sensor',
//   ip: '192.168.0.1',
//   mac:'aa:bb:cc:dd:ee'
// });
