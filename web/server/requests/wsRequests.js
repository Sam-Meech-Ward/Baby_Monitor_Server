const WebSocket = require('ws');

let pi = null;
let streamStarted = false;

function startStream() {
  if (streamStarted) {
    return;
  }
  if (pi) {
    pi.send("start-stream");
  }
  streamStarted = true;
}

function endStream() {
  if (pi) {
    pi.send("end-stream");
  }
  streamStarted = false;
}

function connectedToClient(wss, ws) {
  startStream();

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  
  ws.on('close', function close() {
    console.log('disconnected', wss.clients.size);
    if (wss.clients.size === 1) {
      endStream();
    }
  });

  ws.on('error',  (error) => {
    console.log('AHHHHHHHHHHH socket error', error);
  });
}

function connectedToPi(wss, pi) {

  pi.on('message', function incoming(message) {
    console.log("message from pi", message);
  });

  pi.on('close', function close() {
    pi = null;
    endStream();
  });

  pi.on('error',  (error) => {
    console.log('AHHHHHHHHHHH pi error', error);
  });
}
 
exports.start = () => {
  const wss = new WebSocket.Server({ port: 5000 });
  
  wss.on('connection', function connection(ws, request) {
    
    console.log("Number of clients", wss.clients.size);

    // Pi must connect first
    const device = request.headers.xdevice;
    console.log('client ', device);
    if (device === 'RaspberryPi') {
      console.log("🤗");
      pi = ws;

      connectedToPi(wss, pi);
      return;
    }

    connectedToClient(wss, ws);
  });

  wss.on('error', (error) => {
    console.log("AHHHHHHHHHHH", error);
  });
};