const path = require('path');

const Http = require('http');
const Https = require('https');
const WebSocket = require('ws');
const Express = require('express');

const config = {
  port: 8000, 
  sport: 8443, 
  webroot: path.join(__dirname, '../public'), 
  mediaroot: path.join(__dirname, '../media')
};

const httpServers = {
  config,
  createApp() {
    this.app = Express();

    this.app.use(Express.static(this.config.webroot));
    this.app.use(Express.static(this.config.mediaroot));

    return this.app;
  },
  createHTTPServers(httpsOptions) {
    this.httpServer = Http.createServer(this.app);
  
    if (!httpsOptions) {
      return;
    }
    /**
     * ~ openssl genrsa -out privatekey.pem 1024
     * ~ openssl req -new -key privatekey.pem -out certrequest.csr 
     * ~ openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
     */
    this.httpsServer = Https.createServer(httpsOptions, app);
  },
  run({ wsOnConnect }) {
    this.httpServer.listen(this.config.port, () => {
      console.log(`Node Media Http Server started on port: ${this.config.port}`);
    });
  
    this.wsServer = new WebSocket.Server({ server: this.httpServer });
  
    this.wsServer.on('connection', (ws, req) => {
      wsOnConnect(ws, req);
    });
  
    if (!this.httpsServer) {
      return;
    }
    this.httpsServer.listen(this.sport, () => {
      console.log(`Node Media Https Server started on port: ${this.config.sport}`);
    });

    this.wssServer = new WebSocket.Server({ server: this.httpsServer });

    this.wssServer.on('connection', (ws, req) => {
      wsOnConnect(ws, req);
    });
  }
}

module.exports = httpServers;