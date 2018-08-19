const  _NodeMediaServer  = require('node-media-server').NodeMediaServer;
const NodeMediaHTTPServer = require('./NodeMediaHTTPServer');

const NodeMediaServer = {
  setupMediaServer(config) {
    this.mediaServer = new _NodeMediaServer(config);
  },
  setupHTTPServer(config, app) {
    this.httpServer = new NodeMediaHTTPServer(config, app);
  },
  run() {
    this.mediaServer.run();
    this.httpServer.run();
  },
  stop() {
    this.mediaServer.stop();
    this.httpServer.stop();
  }
} 

module.exports = NodeMediaServer;
