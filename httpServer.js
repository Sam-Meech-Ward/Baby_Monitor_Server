const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
var bcrypt = require('bcrypt');

let videoURL = "ws://192.168.1.71:8000/live/monitor.flv";

module.exports = (app) => {

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_SESSION_KEY || 'cookie-session-key']
  }));

  app.set('view engine', 'ejs');

  app.get('/', (req, res) => {
    if (process.env.MAIN_USER_USERNAME && (req.session.username === process.env.MAIN_USER_USERNAME)) {
      res.render('index', {videoURL});
      return;
    }
    res.render('login', {badDetails: false});
  });

  app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userPassword = process.env.MAIN_USER_PASSWORD;
    const userUsername = process.env.MAIN_USER_USERNAME;
    console.log(username, userUsername, password, userPassword);
    if (userUsername && userPassword && username === userUsername && bcrypt.compareSync(password, userPassword)) {
      req.session.username = username;
      res.redirect('/');
      return;
    }

    res.render('login', {badDetails: true});
  });

  app.post('/video-url', (req, res) => {
    // The pi will have to send this url to the server when it start streaming
    videoURL = req.body.wsURL;
    res.send({videoURL});
  })

  // app.use(express.static('public'));


  // const httpServer = http.createServer(app);
  // httpServer.listen(3333);
  // exports.httpServer = httpServer;

  // let httpsServer;
  // if (process.env.SSL_ONLY) {
  //   const privateKey  = fs.readFileSync('./privatekey.pem', 'utf8');
  //   const certificate = fs.readFileSync('./certificate.pem', 'utf8');
  //   const credentials = {key: privateKey, cert: certificate};
  //   httpsServer = https.createServer(credentials, app);
  //   exports.httpsServer = httpsServer;
  // }


  // exports.start = () => {
  //   httpServer.listen(3333);
  //   if (httpsServer) {
  //     httpsServer.listen(3443);
  //   }
  // };
};