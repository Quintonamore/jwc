import React from 'react';
import './CountrySelect.css';

const countries = [
  "Japan",
  "USA",
  "France",
  "Japan 2",
  "Spain",
  "Morocco",
  "Country Name 7",
  "Country Music Star Bob Dylan"
];

class CountrySelect extends React.Component {
  constructor() {
    super();
    this.state = {
      vote: null
    };
  }

  render() {
    // Build Country List
    const countryList = [];
    countries.forEach(country => countryList.push(<div key={country} className={this.state.vote === country ? 'selected' : ''} onClick={() => this.setState({ vote: country })}>{country}</div>));
    return (
      <div className="countries">
        {countryList}
      </div>
    );
  }
}

export default CountrySelect;
