import React from 'react';
import Counter from './components/Counter';
import CountrySelect from './components/CountrySelect';
import UserSelect from './components/UserSelect';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toDrink: 5,
      toGive: 2
    };
  }

  decrimentDrinks = () => {
    if (this.state.toGive <= 0) return;
    this.setState(state => { return {toDrink: state.toDrink, toGive: state.toGive - 1}});
  }

  render() {
    return (
      <div className="App">
        <Counter toDrink={this.state.toDrink} toGive={this.state.toGive}/>
        <div className="user-country-container">
          <CountrySelect/>
          <UserSelect giveDrink={this.decrimentDrinks}/>
        </div>
      </div>
    );
  }
}

export default App;
