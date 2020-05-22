import React from 'react';
import Counter from './components/Counter';
import CountrySelect from './components/CountrySelect';
import './App.css';

function App() {
  return (
    <div className="App">
      <Counter toDrink="5" toGive="2"/>
      <CountrySelect/>
    </div>
  );
}

export default App;
