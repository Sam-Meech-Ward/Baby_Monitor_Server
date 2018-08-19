const NodeMediaServer  = require('../NodeMediaServer/NodeMediaServer');
const nodeMediaPrivateKey = process.env.NODE_MEDIA_PRIVATE_KEY || 'privateKey';

module.exports = (app) => {
  const config = {
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 60,
      ping_timeout: 30
    },
    auth: {
      play: true,
      publish: true,
      secret: nodeMediaPrivateKey
    }
  };

  const mediaServer = Object.create(NodeMediaServer);
  mediaServer.setupMediaServer(config);
  mediaServer.setupHTTPServer(config, app);
  
  return mediaServer;
};
 
