import React from 'react';

function GameSelect(props) {
    const renderGameList = [];
    for (let game of props.gameList) {
        renderGameList.push(<div onClick={() => props.selectGame(game)} key={game.id}>{game.name}</div>);
    }
    return <div>{renderGameList}</div>;
}

export default GameSelect;
