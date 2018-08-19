const nodeMediaPrivateKey = process.env.NODE_MEDIA_PRIVATE_KEY || 'privateKey';

const server = require('./HTTP/server');
const app = server.createApp();

const mediaServer = require('./mediaServer');
mediaServer(nodeMediaPrivateKey, app);

const httpServer = require('./httpServer');
httpServer(app);

// const wsServer = require('./wsServer');
// wsServer.start();

server.createHTTPServers();

mediaServer.run();
server.run({ wsOnConnect: mediaServer.httpServer.onConnect.bind(mediaServer.httpServer) });