import React from "react";

class NewCountry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryName: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.state.countryName = event.target.value;
    this.setState(this.state);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.gameData.countries.push(this.state.countryName);
    const modifyObject = {
      action: "modify",
      ...this.props.gameData,
    };
    this.props.ws.send(JSON.stringify(modifyObject));

    // Reset Country Name Input
    this.setState({ countryName: "" });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="New Country"
          onChange={this.handleChange}
        />
      </form>
    );
  }
}

export default NewCountry;
