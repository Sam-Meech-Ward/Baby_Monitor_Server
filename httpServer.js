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
  videoURL = req.body.wsURL;
  res.send({videoURL});
})

app.use(express.static('public'));

exports.start = () => {
  app.listen(3333);
};