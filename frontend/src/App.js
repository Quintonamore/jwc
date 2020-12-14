import React from "react";
import Counter from "./components/Counter";
import CountrySelect from "./components/CountrySelect";
import UserSelect from "./components/UserSelect";
import GameSelect from "./components/GameSelect";
import NewGame from "./components/NewGame";
import NewCountry from "./components/NewCountry";
import "./App.css";

class App extends React.Component {
  ws = new WebSocket("ws://localhost:8080");

  constructor(props) {
    super(props);
    this.state = {
      globalGameList: [],
      isGameOwner: false,
      gameId: "",
      toDrink: 0,
      toGive: 0,
    };
  }

  componentDidMount() {
    this.ws.onmessage = (ev) => {
      const globalGameList = JSON.parse(ev.data);
      const stateCpy = {};
      Object.assign(stateCpy, this.state);
      stateCpy.globalGameList = globalGameList;
      this.setState(stateCpy);
      console.log(globalGameList);
    };
  }

  decrimentDrinks = () => {
    if (this.state.toGive <= 0) return;
    this.setState((state) => {
      return { toDrink: state.toDrink, toGive: state.toGive - 1 };
    });
  };

  selectGame = (game) => {
    const stateCpy = {};
    Object.assign(stateCpy, this.state);
    stateCpy.gameId = game.id;
    this.setState(stateCpy);
  };

  getSelectedGameData = () => {
    return this.state.globalGameList.find(
      (toCheck) => toCheck.id === this.state.gameId
    );
  };

  getPropertyFromGame = (property, backup) => {
    if (this.state.gameId) return this.getSelectedGameData()[property];
    else return backup;
  };

  fetchCountries = () => {
    return this.getPropertyFromGame("countries", []);
  };

  fetchUsers = () => {
    return this.getPropertyFromGame("users", []);
  };

  render() {
    const gamePage = (
      <div>
        <Counter toDrink={this.state.toDrink} toGive={this.state.toGive} />
        <div className="user-country-container">
          <CountrySelect countries={this.fetchCountries()} />
          <UserSelect
            users={this.fetchUsers()}
            giveDrink={this.decrimentDrinks}
          />
        </div>
        <div className="settings-bin">
          <NewCountry ws={this.ws} gameData={this.getSelectedGameData()} />
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
