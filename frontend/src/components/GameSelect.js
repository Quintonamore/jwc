import React from "react";
import "./GameSelect.css";

function GameSelect(props) {
  const renderGameList = [];
  for (let game of props.gameList) {
    renderGameList.push(
      <div onClick={() => props.selectGame(game)} key={game.id}>
        {game.gameName}
      </div>
    );
  }
  return <div className="games">{renderGameList}</div>;
}

export default GameSelect;
