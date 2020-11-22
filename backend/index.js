const WebSocket = require('ws');
const crypto = require('crypto');

// Server init and Games Map init
const wss = new WebSocket.Server({ port: 8080 });
const games = new Map();

games.set('lol', { gameName: 'howdy', password: 'shoot', countries: ['Sexytown']});

function generateIdNameList() {
  const idNameList = [];
  for (key of games.keys()) {
    idNameList.push({id: key, name: games.get(key).gameName});
  }
  return idNameList;
}

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  /**
   * Expecting a newGameObj JSON with the following properties
   *  gameName  - string
   *  countries - array
   *  password  - string
   */
  ws.on('new', function incoming(newGameObj) {
    const gameInfo = JSON.parse(newGameObj);
    const id = crypto.randomBytes(16).toString("hex");
    games.set(id, gameInfo);
  });

  ws.on('getgames', function incoming(message) {
    ws.send(JSON.stringify(generateIdNameList()));
  });

  ws.send(JSON.stringify(generateIdNameList()));
});
