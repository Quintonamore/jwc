import React from 'react';
import './Counter.css';

class Counter extends React.Component {
  render() {
    return (
      <div class="counter-container">
        <div class="to-drink">{this.props.toDrink} to Drink</div>
        <div class="to-give">{this.props.toGive} to Give</div>
      </div>
    );
  }
}

export default Counter;
