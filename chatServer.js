//app=require('http').createServer(function)
"use strict";
var app = require('express')();
var server = require('http').Server(app),
  io = require('socket.io')(server),
  fs = require('fs'),
  ejecutar = require('child_process').exec,
  util = require('util'),
  path = require('path'),
  nodemailer = require('nodemailer'),
  galleta = require('cookie-session'),
  bodyParser = require('body-parser');
const puerto = 3000;
const SMTPConnection = require("nodemailer/lib/smtp-connection");
const telegramBot = require('node-telegram-bot-api');
const token_Tele = '888713740:AAFUtHpzuizxjrmFNsRxCFbUSETwCpA9mAY';
const bot = new telegramBot(token_Tele, {
  polling: true
});

bot.onText(/^\/start/, function(msg) {
  console.log("MENSAJE: ", msg);
  var chatId = msg.chat.id;
  var username = msg.from.username;
  var firstName = msg.from.first_name;
  console.log("DATA: ", chatId, ' ', username, ' ', firstName);

  bot.sendMessage(chatId, `Hola,  ${firstName} soy un bot y mi nombre es Review4IU_1`)
})
bot.on('message', function(msg) {
  var Hola = "hola bot";
  var firstnameuser = msg.from.first_name;
  if (msg.text.toString().toLowerCase().includes(Hola)) {
    bot.sendMessage(msg.chat.id, "Hola " + firstnameuser + ", como estás?");
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
var expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 0.1); // 1 hour * 10% = 6min
app.use(galleta({
  name: 'galleta_sesion',
  keys: ['LNTV_1', 'LNTV_2'],
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'htts://app.lanubetv.net',
    path: 'nodeapp',
    expires: expiryDate
  }
}));
app.disable('x-powered-by');
//CONFIGURACIONES DEL MAIL
var transporter;
async function main() {
  let testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'cloudmail01.onducloud.com',
    port: 587,
    auth: {
      user: 'soporte@lanubetv.net',
      pass: 'Parad0ja16'
    },
    //authMethod:'NTLM',
    //secure:false,
    tls: {
      rejectUnauthorized: true
    },
    debug: true
  });
  /*transporter.sendMail({
      from: 'SOPORTE <soporte@lanubetv.net>', // sender address 👻
      to: "soporte@lanubetv.net, Carlos", // list of receivers
      subject: "Video Subido a la Plataforma ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>EXITE UN VIDEO DISPONIBLE EN LA PLATAFORMA<br><br>ATTE. <br><br>LA PLATAFORMA</b>" // html body
    })
    .then(exito => console.log('Exito_Mail: ', exito))
    .catch(error => console.log('Error_Mail: ', error))*/
  //console.log("Message sent: %s", info.messageId)
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview only available when sending through an Ethereal account
  //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
main().catch("Error Mail Send: ", console.error);

server.listen(puerto, () => {
  console.log("UploadFilesTempyVideo: ", puerto);
});

//****************REST******************************************
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/Upload.html')
})

app.get('/prueba', function(req, res) {
  console.log('Ruta de Prueba');
  res.send("Validación de prueba")
})

app.post('/notificacionVideo', (req, res) => {
  console.log("Variables: ", req.body);
  transporter.sendMail({
      from: 'SOPORTE <lanubetv2019@gmail.com>', // sender address 👻
      to: "soporte@lanubetv.net, Carlos", // list of receivers
      subject: "Video Subido a la Plataforma ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>EXITE UN VIDEO DISPONIBLE EN LA PLATAFORMA<br><br>ATTE. <br><br>LA PLATAFORMA</b>" // html body
    })
    .then(exito => console.log('Exito_Mail: ', exito))
    .catch(error => console.log('Error_Mail: ', error))
  res.send("Notificación Enviada")
})

//*************SOCKET CONNECTION**********************************
io.on('connection', function(socket) {
  console.log("DATA SOCKET: ", socket.id);
  socket.on('SendToServer', function(data) { //data contains the variables that we passed through in the html file
    console.log("NOMBRE: ", data.message);
    socket.emit('SendClient', {
      message: "SERVIDOR TE ENVIA UN MENSAJE DE RESPUESTA"
    })
  });
});
