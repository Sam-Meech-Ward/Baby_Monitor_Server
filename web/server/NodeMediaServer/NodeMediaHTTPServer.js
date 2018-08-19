//
//  Created by Mingliang Chen on 17/8/1.
//  illuspas[a]gmail.com
//  Copyright (c) 2018 Nodemedia. All rights reserved.
//


const Fs = require('fs');

const { NodeFlvSession,
  context,
  streamsRoute,
  serverRoute } = require('node-media-server');

class NodeHttpServer {
  constructor(config, app) {
    this.config = config;
    const allowOrigin = '*';

    app.all(['*.m3u8', '*.ts', '*.mpd', '*.m4s', '*.mp4'], (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', allowOrigin);
      next();
    });


    app.all('*.flv', (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', allowOrigin);
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'range');
        res.end();
        return;
      }
      if (Fs.existsSync(this.mediaroot + req.url)) {
        res.setHeader('Access-Control-Expose-Headers', 'Content-Length');
        next();
        return;
      }
      req.nmsConnectionType = 'http';
      this.onConnect(req, res);
    });

    app.use('/api/streams', streamsRoute(context));
    app.use('/api/server', serverRoute(context));

  }

  run() {
    context.nodeEvent.on('postPlay', (id, args) => {
      context.stat.accepted++;
    });

    context.nodeEvent.on('postPublish', (id, args) => {
      context.stat.accepted++;
    });

    context.nodeEvent.on('doneConnect', (id, args) => {
      let session = context.sessions.get(id);
      let socket = session instanceof NodeFlvSession ? session.req.socket : session.socket;
      context.stat.inbytes += socket.bytesRead;
      context.stat.outbytes += socket.bytesWritten;
    });
  }

  stop() {
    this.httpServer.close();
    if (this.httpsServer) {
      this.httpsServer.close();
    }
    context.sessions.forEach((session, id) => {
      if (session instanceof NodeFlvSession) {
        session.req.destroy();
        context.sessions.delete(id);
      }
    });
  }

  wsOnConnect(ws, req) {
    req.nmsConnectionType = 'ws';
    wsOnConnect(req, ws);
  }


  onConnect(req, res) {
    let session = new NodeFlvSession(this.config, req, res);
    session.run();
  }
}

module.exports = NodeHttpServer