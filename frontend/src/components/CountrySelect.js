import React from "react";
import "./CountrySelect.css";

const countries = [
  "Japan",
  "USA",
  "France",
  "Japan 2",
  "Spain",
  "Morocco",
  "Country Name 7",
  "Country Music Star Bob Dylan",
];

class CountrySelect extends React.Component {
  constructor(props) {
    super(props);
    const ordering = [];
    for (let i = 0; i < props.countries.length; i++) {
      ordering.push(0);
    }
    this.state = {
      vote: null,
      ordering: ordering,
    };
  }

  vote(country) {
    this.setState({ vote: country, ordering: this.state.ordering });
    this.props.updateSelection(country);
  }

  onChange(newValue, index) {
    const stateCpy = {};
    Object.assign(stateCpy, this.state);
    stateCpy.ordering[index] = newValue;
    this.setState(stateCpy);
  }

  endRace() {
    const countriesToSort = this.props.countries.slice();
    countriesToSort.sort((a, b) => {
      const indexOfA = this.props.countries.indexOf(a);
      const indexOfB = this.props.countries.indexOf(b);
      return this.state.ordering[indexOfA] - this.state.ordering[indexOfB];
    });
    const modifyObject = {
      action: "calculate",
      results: countriesToSort,
    };
    this.props.ws.send(JSON.stringify(modifyObject));
  }

  render() {
    // Build Country List
    const gameMaster = this.props.gameMaster;
    const countryList = [];
    const generateJSXListItem = (country, index) => {
      const ordering = gameMaster ? (
        <input
          type="number"
          value={this.state.ordering[index]}
          onChange={(ev) => this.onChange(ev.target.value, index)}
        />
      ) : null;
      return countryList.push(
        <div
          key={index}
          className={this.state.vote === country ? "selected" : ""}
          onClick={() => this.vote(country)}
        >
          {ordering} {country}
        </div>
      );
    };
    if (this.props.countries) {
      this.props.countries.forEach(generateJSXListItem);
    } else {
      countries.forEach(generateJSXListItem);
    }
    return (
      <div className="countries">
        {countryList}
        {gameMaster ? (
          <button type="submit" onClick={() => this.endRace()}>
            End Race
          </button>
        ) : null}
      </div>
    );
  }
}

export default CountrySelect;
