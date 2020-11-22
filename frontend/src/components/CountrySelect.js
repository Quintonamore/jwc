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
  constructor(props) {
    super(props);
    this.state = {
      vote: null
    };
  }

  render() {
    // Build Country List
    const countryList = [];
    const generateJSXListItem = country => countryList.push(<div key={country} className={this.state.vote === country ? 'selected' : ''} onClick={() => this.setState({ vote: country })}>{country}</div>);
    if (this.props.countries) {
      this.props.countries.forEach(generateJSXListItem);
    } else {
      countries.forEach(generateJSXListItem);
    }
    return (
      <div className="countries">
        {countryList}
      </div>
    );
  }
}

export default CountrySelect;
