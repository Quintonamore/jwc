import React from "react";

class NewGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameName: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const stateCpy = {};
    Object.assign(stateCpy, this.state);
    stateCpy.gameName = event.target.value;
    this.setState(stateCpy);
  }

  handleSubmit(event) {
    event.preventDefault();
    const newGameObject = {
      action: "newGame",
      gameName: this.state.gameName,
    };
    this.props.ws.send(JSON.stringify(newGameObject));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          value={this.state.gameName}
          placeholder="Game Name"
          onChange={this.handleChange}
        />
        <input type="submit" value="New Game" />
      </form>
    );
  }
}

export default NewGame;
