
let mediaRequests, httpServers;

exports.setup = () => {
  /** Setup **/
  httpServers = require('./httpServers');
  const expressApp = httpServers.createApp();

  mediaRequests = require('./requests/mediaRequests')(expressApp);
  require('./requests/basicRequests')(expressApp);

  // const wsServer = require('./wsServer');
  // wsServer.start();

  /** Create Servers **/

  const httpsOptions = require('./httpsOptions');
  const options = httpsOptions.useSSL ? httpsOptions.options() : null;
  httpServers.createHTTPServers(options);
};

/** Run Servers **/

exports.start = () => {
  mediaRequests.run();
  httpServers.run(
    { wsOnConnect: (ws, req) => {
      mediaRequests.httpServer.wsOnConnect(ws, req);
    }
  });
};