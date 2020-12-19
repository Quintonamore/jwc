import React from "react";
import Counter from "./components/Counter";
import CountrySelect from "./components/CountrySelect";
import UserSelect from "./components/UserSelect";
import GameSelect from "./components/GameSelect";
import NewGame from "./components/NewGame";
import NewCountry from "./components/NewCountry";
import SetName from "./components/SetName";
import "./App.css";

const USER = "jwc-user";
const GAME = "jwc-game";
const DRINKING = "jwc=drinks";
const TO_GIVE = "jwc-to-give";
const IS_PROD = process.env.NODE_ENV === "production";

class App extends React.Component {
  ws = new WebSocket(
    IS_PROD ? "ws://jwcserver.quinton.pizza:8080" : "ws://192.168.1.134:8080"
  );

  constructor(props) {
    super(props);
    const storageToDrink = sessionStorage.getItem(DRINKING);
    const storageToGive = sessionStorage.getItem(TO_GIVE);
    this.state = {
      globalGameList: [],
      isGameOwner: false,
      gameId: sessionStorage.getItem(GAME),
      userName: sessionStorage.getItem(USER),
      toDrink: storageToDrink ? storageToDrink : 0,
      toGive: storageToGive ? storageToGive : 0,
      gameMaster: false,
    };
  }

  componentDidMount() {
    this.ws.onmessage = (ev) => {
      const globalGameList = JSON.parse(ev.data);
      // Get server user data & delete from list
      const userUpdate = globalGameList.shift();
      const stateCpy = {};
      Object.assign(stateCpy, this.state);
      stateCpy.globalGameList = globalGameList;
      stateCpy.toDrink = userUpdate.toDrink;
      stateCpy.toGive = userUpdate.toGive;
      this.setState(stateCpy);
    };
    this.ws.onopen = (ev) => {
      if (this.state.userName) this.updateName(this.state.userName);
      if (
        this.state.gameId &&
        !this.state.globalGameList.find((p) => p.id === this.state.gameId)
      ) {
        const stateCpy = {};
        Object.assign(stateCpy, this.state);
        stateCpy.gameId = "";
        this.setState(stateCpy);
      }
    };
    this.ws.onclose = (ev) => {
      const stateCpy = {};
      Object.assign(stateCpy, this.state);
      stateCpy.gameId = "";
      stateCpy.globalGameList = [];
      this.setState(stateCpy);
    };
  }

  decrimentDrinks = (nameToGiveDrink) => {
    if (this.state.toGive <= 0) return;
    const modifyObject = {
      action: "drink",
      target: nameToGiveDrink,
    };
    this.ws.send(JSON.stringify(modifyObject));
  };

  decrementOwn = () => {
    if (this.state.toDrink <= 0) return;
    const modifyObject = {
      action: "drank",
    };
    this.ws.send(JSON.stringify(modifyObject));
  };

  clearCountries = () => {
    const selectedGame = this.getSelectedGameData();
    selectedGame.countries = [];

    const modifyObject = {
      action: "modify",
      ...selectedGame,
    };

    this.ws.send(JSON.stringify(modifyObject));
  };

  selectGame = (game) => {
    const stateCpy = {};
    Object.assign(stateCpy, this.state);
    stateCpy.gameId = game.id;
    sessionStorage.setItem(GAME, game.id);
    if (!game.users.length) {
      stateCpy.gameMaster = true;
    }
    this.setState(stateCpy);

    const modifyObject = {
      action: "joinGame",
      gameId: game.id,
    };
    this.ws.send(JSON.stringify(modifyObject));
  };

  getSelectedGameData = () => {
    return this.state.globalGameList.find(
      (toCheck) => toCheck.id === this.state.gameId
    );
  };

  getPropertyFromGame = (property, backup) => {
    try {
      return this.getSelectedGameData()[property];
    } catch (e) {
      return backup;
    }
  };

  fetchCountries = () => {
    return this.getPropertyFromGame("countries", []);
  };

  fetchUsers = () => {
    return this.getPropertyFromGame("users", []);
  };

  updateName = (userName) => {
    const stateCpy = {};
    Object.assign(stateCpy, this.state);
    stateCpy.userName = userName;
    sessionStorage.setItem(USER, userName);
    this.setState(stateCpy);

    const modifyObject = {
      action: "updateName",
      name: userName,
    };
    this.ws.send(JSON.stringify(modifyObject));
  };

  updateSelection = (countryName) => {
    const modifyObject = {
      action: "vote",
      selectedCountry: countryName,
    };
    this.ws.send(JSON.stringify(modifyObject));
  };

  render() {
    const gameMaster = this.state.gameMaster;
    const gamePage = (
      <div>
        <Counter
          toDrink={this.state.toDrink}
          toGive={this.state.toGive}
          decrementOwn={this.decrementOwn}
        />
        <div className="user-country-container">
          <CountrySelect
            gameMaster={gameMaster}
            countries={this.fetchCountries()}
            updateSelection={this.updateSelection}
            ws={this.ws}
          />
          <UserSelect
            users={this.fetchUsers()}
            giveDrink={this.decrimentDrinks}
          />
        </div>
        <div className="settings-bin">
          {gameMaster ? (
            <NewCountry ws={this.ws} gameData={this.getSelectedGameData()} />
          ) : null}
          <SetName name={this.state.userName} updateName={this.updateName} />
          {gameMaster ? (
            <button type="submit" onClick={() => this.clearCountries()}>
              Clear Countries
            </button>
          ) : null}
        </div>
      </div>
    );

    const setupPage = (
      <div>
        <GameSelect
          selectGame={this.selectGame}
          gameList={this.state.globalGameList}
        />
        <NewGame ws={this.ws} />
      </div>
    );

    const renderedPage = this.state.gameId ? gamePage : setupPage;

    return <div className="App">{renderedPage}</div>;
  }
}

export default App;
