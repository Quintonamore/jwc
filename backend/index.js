const WebSocket = require('ws');
const crypto = require('crypto');

// Server init and Games Map init
const wss = new WebSocket.Server({ port: 8080 });
const games = new Map();
const users = [];
const THRESHOLD = 6400;
const CYRUS_REGEX = /cyrus/gmi;

function User(name, gameId) {
  this.name = name;
  this.gameId = gameId;
  this.selectedCountry = "";
  this.toGive = 0;
  this.toDrink = 0;
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
   * @param {Object} gameInfo
   */
  function newGame(gameInfo) {
    const id = crypto.randomBytes(16).toString("hex");
    gameInfo.createdAt = Date.now();
    gameInfo.countries = [];
    delete gameInfo.action;
    games.set(id, gameInfo);
    sendGames();
  }

  function generateIdNameList() {
    const idNameList = [];
    // User data is first value in array
    // Added here, because I am lazy & we're updating the client 100%
    idNameList.push(connectionUser);
    for (key of games.keys()) {
      const tempGame = games.get(key);
      idNameList.push({id: key, ...tempGame, users: users.filter(comp => comp.gameId === key)});
    }
    return idNameList;
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
    if (CYRUS_REGEX.test(data.name)) {
      connectionUser.toDrink += 2;
    }
    connectionUser.name = data.name;
  }

  function drink(data) {
    const target = users.find(comp => {
      if (!comp) return false;
      return comp.name === data.target && comp.gameId === connectionUser.gameId;
    });
    if (target) {
      connectionUser.toGive -= 1;
      target.toDrink += 1;
    }
  }

  function drank() {
    connectionUser.toDrink -= 1;
  }

  function vote(data) {
    connectionUser.selectedCountry = data.selectedCountry;
  }

  /**
   * Expecting an array of countries in winning order on results property.
   * Lol, only the first three matter.
   * @param {*} data 
   */
  function calculateDrinksFromRaceResults(data) {
    const gameParticipants = users.filter(comp => {
      if (!comp) return false;
      return comp.gameId === connectionUser.gameId;
    });
    const winnerWinnerChickenDinner = data.results[0];
    const secondIsTheBest = data.results[1];
    const hairyChest = data.results[2];

    gameParticipants.forEach(participant => {
      const choice = participant.selectedCountry;
      if (choice === winnerWinnerChickenDinner) participant.toGive += 5;
      if (choice === secondIsTheBest) participant.toGive += 3;
      if (choice === hairyChest) participant.toGive += 1;
    })
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
      case 'drink':
        drink(data);
        break;
      case 'drank':
        drank();
        break;
      case 'vote':
        vote(data);
        break;
      case 'calculate':
        calculateDrinksFromRaceResults(data);
        break;
      default:
        break;
    }
  });

  ws.on('close', function clear() {
    delete users[localIndex];
  });

  // On successful connection send server list
  sendGames();
});
