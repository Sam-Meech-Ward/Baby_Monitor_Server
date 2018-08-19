const nodeMediaPrivateKey = process.env.NODE_MEDIA_PRIVATE_KEY || 'privateKey';


const server = require('./HTTP/server');
const app = server.createApp();
const mediaServer = require('./mediaServer')(nodeMediaPrivateKey, app);



const httpServer = require('./httpServer');
// const wsServer = require('./wsServer');

httpServer(app);
// wsServer.start();

server.createHTTPServers();
server.run(mediaServer.httpServer.onConnect.bind(mediaServer.httpServer));