const fs = require('fs');

const https = {
  key: process.env.SSL_PRIVATE_KEY || '../cert/privatekey.pem',
  cert: process.env.SSL_CERTIFICATE || '../cert/certificate.pem',
};

const options = () => {
  return {
    key: fs.readFileSync(https.key),
    cert: fs.readFileSync(https.cert)
  };
};

exports.useSSL = process.env.USE_SSL;
exports.options = options;
