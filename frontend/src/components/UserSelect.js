import React from 'react';
import './UserSelect.css';

const users = [
  "Q",
  "Erika",
  "Michael",
  "Brando n",
  "Bobbie",
  "Alex",
  "Alex 2",
  "Matthew",
  "CHLoe",
  "Elise",
  "Alan Jackson",
  "Lefty Frizzel",
  "Merle Haggard"
];

class UserSelect extends React.Component {
  render() {
    // Build User List
    const userList = [];
    users.forEach(user => userList.push(<div key={user}>{user}</div>));
    return (
      <div className="users">
        {userList}
      </div>
    );
  }
}

export default UserSelect;
