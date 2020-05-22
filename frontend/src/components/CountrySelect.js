import React from 'react';
import './CountrySelect.css';

const Countries = [
  "USA",
  "Japan",
  "Spain"
];

class CountrySelect extends React.Component {
  render() {
    return (
      <div class="countries"></div>
    );
  }
}

export default CountrySelect;
