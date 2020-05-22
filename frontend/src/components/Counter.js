import React from 'react';
import './Counter.css';

class Counter extends React.Component {
  render() {
    return (
      <div className="counter-container">
        <div className="to-drink">{this.props.toDrink} to Drink</div>
        <div className="to-give">{this.props.toGive} to Give</div>
      </div>
    );
  }
}

export default Counter;
