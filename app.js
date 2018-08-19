const nodeMediaPrivateKey = process.env.NODE_MEDIA_PRIVATE_KEY || 'privateKey';

const httpServer = require('./httpServer');
const wsServer = require('./wsServer');
const mediaServer = require('./mediaServer')(nodeMediaPrivateKey);

httpServer.start();
mediaServer.start();
wsServer.start();