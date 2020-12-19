const WebSocket = require('ws');
const crypto = require('crypto');

// Server init and Games Map init
const wss = new WebSocket.Server({ port: 8080 });
const games = new Map();
const users = [];
const THRESHOLD = 6400;

function User(name, gameId) {
  this.name = name;
  this.gameId = gameId
}

function generateIdNameList() {
  const idNameList = [];
  for (key of games.keys()) {
    const tempGame = games.get(key);
    idNameList.push({id: key, ...tempGame, users: users.filter(comp => comp.gameId === key)});
  }
  return idNameList;
}

wss.on('connection', function connection(ws) {

  const connectionUser = new User("", "");
  users.push(connectionUser);
  const localIndex = users.length - 1;

  setInterval(() => {
    if(ws.bufferedAmount < THRESHOLD) sendGames();
  }, 1000);

  /**
   * Expecting a newGameObj JSON with the following properties
   *  gameName  - string
   */
  function newGame(gameInfo) {
    const id = crypto.randomBytes(16).toString("hex");
    gameInfo.createdAt = Date.now();
    gameInfo.countries = [];
    delete gameInfo.action;
    games.set(id, gameInfo);
    sendGames();
  }

  function sendGames() {
    ws.send(JSON.stringify(generateIdNameList()));
  }

  function modify(data) {
    delete data.users;
    games.set(data.id, data);
  }

  function joinGame(data) {
    connectionUser.gameId = data.gameId;
  }

  function updateName(data) {
    connectionUser.name = data.name;
  }

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    const data = JSON.parse(message);
    switch (data.action) {
      case 'newGame':
        newGame(data);
        break;
      case 'joinGame':
        joinGame(data);
        break;
      case 'modify':
        modify(data);
        break;
      case 'updateName':
        updateName(data);
        break;
      default:
        break;
    }
    sendGames();
  });

  ws.on('close', function clear() {
    delete users[localIndex];
  });

  // On successful connection send server list
  sendGames();
});
