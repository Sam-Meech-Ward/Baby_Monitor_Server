const express = require('express');

let videoURL = "ws://192.168.1.71:8000/live/monitor.flv";

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {videoURL});
});

app.post('/video/:url', (req, res) => {
  videoURL = res.params.url;
  res.json('index', {videoURL});
})

app.use(express.static('public'));

exports.start = () => {
  app.listen(3333);
};