const Http = require('http');
const Https = require('https');
const WebSocket = require('ws');
const Express = require('express');
const basicAuth = require('basic-auth-connect');

const Logger = console;

const config = {
  port: 8000, 
  sport: 8443, 
  webroot: 'public', 
  mediaroot: 'media'
};

const server = {
  config,
  createApp() {
    this.app = Express();

    this.app.use(Express.static(this.config.webroot));
    this.app.use(Express.static(this.config.mediaroot));

    return this.app;
  },
  createHTTPServers(https) {
    this.httpServer = Http.createServer(this.app);
  
      /**
       * ~ openssl genrsa -out privatekey.pem 1024
       * ~ openssl req -new -key privatekey.pem -out certrequest.csr 
       * ~ openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
       */
      if (https) {
        let options = {
          key: Fs.readFileSync(https.key),
          cert: Fs.readFileSync(https.cert)
        };
        this.httpsServer = Https.createServer(options, app);
      }
  },
  run(wsOnConnect) {
    this.httpServer.listen(this.config.port, () => {
      Logger.log(`Node Media Http Server started on port: ${this.config.port}`);
    });
  
    this.httpServer.on('error', (e) => {
      Logger.error(`Node Media Http Server ${e}`);
    });
  
    this.httpServer.on('close', () => {
      Logger.log('Node Media Http Server Close.');
    });
  
    this.wsServer = new WebSocket.Server({ server: this.httpServer });
  
    this.wsServer.on('connection', (ws, req) => {
      req.nmsConnectionType = 'ws';
      wsOnConnect(req, ws);
    });
  
    this.wsServer.on('listening', () => {
      Logger.log(`Node Media WebSocket Server started on port: ${this.config.port}`);
    });
    this.wsServer.on('error', (e) => {
      Logger.error(`Node Media WebSocket Server ${e}`);
    });
  
    if (this.httpsServer) {
      this.httpsServer.listen(this.sport, () => {
        Logger.log(`Node Media Https Server started on port: ${this.config.sport}`);
      });
  
      this.httpsServer.on('error', (e) => {
        Logger.error(`Node Media Https Server ${e}`);
      });
  
      this.httpsServer.on('close', () => {
        Logger.log('Node Media Https Server Close.');
      });
  
      this.wssServer = new WebSocket.Server({ server: this.httpsServer });
  
      this.wssServer.on('connection', (ws, req) => {
        req.nmsConnectionType = 'ws';
        wsOnConnect(req, ws);
      });
  
      this.wssServer.on('listening', () => {
        Logger.log(`Node Media WebSocketSecure Server started on port: ${this.config.sport}`);
      });
      this.wssServer.on('error', (e) => {
        Logger.error(`Node Media WebSocketSecure Server ${e}`);
      });
    }
  }
}

module.exports = server;