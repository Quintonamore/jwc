import React from 'react';
import Counter from './components/Counter';
import CountrySelect from './components/CountrySelect';
import UserSelect from './components/UserSelect';
import './App.css';

function App() {
  return (
    <div className="App">
      <Counter toDrink="5" toGive="2"/>
      <div className="user-country-container">
        <CountrySelect/>
        <UserSelect/>
      </div>
    </div>
  );
}

export default App;
