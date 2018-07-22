const express = require('express');

const app = express();

app.use(express.static('public'));

exports.start = () => {
  app.listen(3333);
};