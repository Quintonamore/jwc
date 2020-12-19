import React from "react";
import "./Counter.css";
import mug from "../images/beer_mug.png";

class Counter extends React.Component {
  render() {
    return (
      <div className="counter-container">
        <div className="to-drink">
          <span>{this.props.toDrink} to Drink</span>
          <img
            className="drink-logo"
            src={mug}
            alt="Click me to drink!"
            onClick={this.props.decrementOwn}
          />
        </div>
        <div className="to-give">{this.props.toGive} to Give</div>
      </div>
    );
  }
}

export default Counter;
