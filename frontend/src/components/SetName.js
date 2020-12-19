import React from "react";

class SetName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: props.name,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    // Maybe debounce this, Q
    const newName = event.target.value;
    this.setState({ userName: newName });
    this.props.updateName(newName);
  }

  render() {
    return (
      <form>
        <input
          type="text"
          value={this.state.userName}
          placeholder="User Name"
          onChange={this.handleChange}
        />
      </form>
    );
  }
}

export default SetName;
