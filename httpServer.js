const express = require('express');

let videoURL = "";

const app = express();

app.use('view engine', 'ejs');

app.get('/', (res, req) => {
  res.render('index', {videoURL});
});

app.post('/video/:url', (res, req) => {
  videoURL = res.params.url;
  res.json('index', {videoURL});
})

app.use(express.static('public'));

exports.start = () => {
  app.listen(3333);
};