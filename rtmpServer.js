const { NodeMediaServer } = require('node-media-server');
 
const config = {
  rtmp: {
    port: 4000,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
};
 
exports.start = () => {
  var nms = new NodeMediaServer(config)
  nms.run();
};