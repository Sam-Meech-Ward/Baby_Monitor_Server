const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');

let videoURL = "ws://192.168.1.71:8000/live/monitor.flv";

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {videoURL});
});

app.post('/video-url', (req, res) => {
  // The pi will have to send this url to the server when it start streaming
  videoURL = req.body.wsURL;
  res.send({videoURL});
})

app.use(express.static('public'));

exports.start = () => {
  const privateKey  = fs.readFileSync('./privatekey.pem', 'utf8');
  const certificate = fs.readFileSync('./certificate.pem', 'utf8');
  const credentials = {key: privateKey, cert: certificate};

  const httpServer = http.createServer(app);
  const httpsServer = https.createServer(credentials, app);

  httpServer.listen(3333);
  httpsServer.listen(3443);
};