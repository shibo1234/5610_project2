import React, { createContext, useState } from "react";

const GameContext = createContext();

const GameProvider = ({ children }) => {
    const GRID_SIZE = 10;
    const SHIPS_SIZES = [5, 4, 3, 3, 2];
    const emptyBoard = () => Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));

    const [playerBoard, setPlayerBoard] = useState(emptyBoard());
    const [aiBoard, setAIBoard] = useState(emptyBoard());
    const [playerShips, setPlayerShips] = useState([]);
    const [aiShips, setAIShips] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [playerTurn, setPlayerTurn] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);

    const [playerShipsDestroyed, setPlayerShipsDestroyed] = useState(0);  
    const [aiShipsDestroyed, setAiShipsDestroyed] = useState(0);  



    return (
        <GameContext.Provider value={{
            playerBoard, setPlayerBoard,
            aiBoard, setAIBoard,
            playerShips, setPlayerShips,
            aiShips, setAIShips,
            gameOver, setGameOver,
            gameStarted, setGameStarted,
            playerTurn, setPlayerTurn,
            elapsedTime, setElapsedTime,
            timerRunning, setTimerRunning,

            playerShipsDestroyed, setPlayerShipsDestroyed,
            aiShipsDestroyed, setAiShipsDestroyed,
            
            GRID_SIZE,
            SHIPS_SIZES,
            emptyBoard
        }}>
            {children}
        </GameContext.Provider>
    );
};


export { GameContext, GameProvider};

