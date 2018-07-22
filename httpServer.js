const express = require('express');

exports = (nodeMediaPrivateKey) => {
  const app = express();

  app.use(express.static('public'));

  const start = () => {
    app.listen(3333);
  };

  return {start};
};