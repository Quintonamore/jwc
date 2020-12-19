import React from "react";
import "./UserSelect.css";

class UserSelect extends React.Component {
  render() {
    // Build User List
    const userList = [];
    this.props.users.forEach((user) =>
      userList.push(
        <div key={user.name} onClick={this.props.giveDrink}>
          {user.name}
        </div>
      )
    );
    return <div className="users">{userList}</div>;
  }
}

export default UserSelect;
