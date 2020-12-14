const WebSocket = require('ws');
const crypto = require('crypto');

// Server init and Games Map init
const wss = new WebSocket.Server({ port: 8080 });
const games = new Map();

function generateIdNameList() {
  const idNameList = [];
  for (key of games.keys()) {
    const tempGame = games.get(key);
    idNameList.push({id: key, ...tempGame});
  }
  return idNameList;
}


wss.on('connection', function connection(ws) {

  /**
   * Expecting a newGameObj JSON with the following properties
   *  gameName  - string
   */
  function newGame(gameInfo) {
    const id = crypto.randomBytes(16).toString("hex");
    gameInfo.createdAt = Date.now();
    gameInfo.countries = [];
    gameInfo.users = [];
    delete gameInfo.action;
    games.set(id, gameInfo);
    sendGames();
  }

  function sendGames() {
    ws.send(JSON.stringify(generateIdNameList()));
  }

  function modify(data) {
    games.set(data.id, data);
  }

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    const data = JSON.parse(message);
    switch (data.action) {
      case 'newGame':
        newGame(data);
      case 'refresh':
        sendGames();
        break;
      case 'modify':
        modify(data);
      default:
        sendGames();
        break;
    }
  });

  // On successful connection send server list
  ws.send(JSON.stringify(generateIdNameList()));
});
