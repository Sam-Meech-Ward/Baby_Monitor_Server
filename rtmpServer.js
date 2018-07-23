const { NodeMediaServer } = require('node-media-server');
 
module.exports = (nodeMediaPrivateKey) => {
  const config = {
    rtmp: {
      port: 4000,
      chunk_size: 60000,
      gop_cache: true,
      ping: 60,
      ping_timeout: 30
    },
    https: {
      port: 8443,
      key:'./privatekey.pem',
      cert:'./certificate.pem',
    },
    auth: {
      play: true,
      publish: true,
      secret: nodeMediaPrivateKey
    }
  };

  if (!process.env.SSL_ONLY) {
    config.http = {
      port: 8000,
      allow_origin: '*'
    };
  }

  const start = () => {
    var nms = new NodeMediaServer(config)
    nms.run();
  };

  return {start};
};
 
