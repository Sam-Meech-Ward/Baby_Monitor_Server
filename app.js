const nodeMediaPrivateKey = process.env.NODE_MEDIA_PRIVATE_KEY || 'privateKey';

const httpServer = require('./httpServer');
const rtmpServer = require('./rtmpServer')(nodeMediaPrivateKey);

httpServer.start();
rtmpServer.start();