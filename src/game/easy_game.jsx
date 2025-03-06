import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import GameBoard from "../components/game_board.jsx";
import "./game.css";

import { GameContext } from "../game_context";

function NormalGame() {
    const {
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
    } = useContext(GameContext); 

    useEffect(() => {
        if (gameStarted) {
            localStorage.setItem("battleshipGameState", JSON.stringify({
                playerBoard, aiBoard, playerShips, aiShips,
                playerTurn, gameStarted, elapsedTime,
                playerShipsDestroyed, aiShipsDestroyed
            }));
        }
    }, [playerBoard, aiBoard, playerShips, aiShips, playerTurn, gameStarted, elapsedTime, playerShipsDestroyed, aiShipsDestroyed]);
    

    useEffect(() => {
        const savedGame = localStorage.getItem("battleshipGameState");
    
        if (savedGame) {
            const state = JSON.parse(savedGame);
            setPlayerBoard(state.playerBoard);
            setAIBoard(state.aiBoard);
            setPlayerShips(state.playerShips);
            setAIShips(state.aiShips);
            setPlayerTurn(state.playerTurn);
            setGameStarted(state.gameStarted);
            setElapsedTime(state.elapsedTime);
            setPlayerShipsDestroyed(state.playerShipsDestroyed);
            setAiShipsDestroyed(state.aiShipsDestroyed);
        }
    }, []);

    useEffect(() => {
        if (gameOver) {
            localStorage.removeItem("battleshipGameState");
        }
    }, [gameOver]);
    

    useEffect(() => {
        let timer;
    
        if (gameStarted && !gameOver) {
            setTimerRunning(true);
            timer = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            setTimerRunning(false);
            clearInterval(timer);
        }
    
        return () => clearInterval(timer);
    }, [gameStarted, gameOver]);


    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const startGame = () => {
        setGameStarted(true);
        setPlayerTurn(true);
        placeShips();
        setElapsedTime(0);
        setPlayerShipsDestroyed(0);
        setAiShipsDestroyed(0);
    }


    const placeShips = () => {
        const placeShipsOnBoard = (board) => {
            let ships = [];

            for (let size of SHIPS_SIZES) {
                let placed = false;
                while (!placed) {
                    let row = Math.floor(Math.random() * GRID_SIZE);
                    let col = Math.floor(Math.random() * GRID_SIZE);
                    let direction = Math.random() > 0.5 ? "H" : "V"; 

                    if (canPlaceShip(board, row, col, size, direction)) {
                        board = applyShipToBoard(board, row, col, size, direction);
                        ships.push({ row, col, size, direction, hits: 0 });
                        placed = true;
                    }
                }
            }

            return { board, ships };
        }

        let playerBoard = emptyBoard();
        let aiBoard = emptyBoard();
    
        const playerPlacement = placeShipsOnBoard(playerBoard);
        const aiPlacement = placeShipsOnBoard(aiBoard);
    
        setPlayerBoard(playerPlacement.board);
        setAIBoard(aiPlacement.board);
        setPlayerShips(playerPlacement.ships);
        setAIShips(aiPlacement.ships);
    }


    const canPlaceShip = (board, row, col, size, direction) => {
        if (direction === "H") {
            if (col + size > GRID_SIZE) return false;
            for (let i = 0; i < size; i++) {
              if (board[row][col + i] !== null) return false;
            }
          } else {
            if (row + size > GRID_SIZE) return false;
            for (let i = 0; i < size; i++) {
              if (board[row + i][col] !== null) return false;
            }
        }
        return true;
    }

    const applyShipToBoard = (board, row, col, size, direction) => {

        let newBoard = board.map(row => [...row]);

        for (let i = 0; i < size; i++) {
            if (direction === "H") {
                newBoard[row][col + i] = "S"; 
            } else {
                newBoard[row + i][col] = "S";
            }
        }
        return newBoard;
    };
    

    const handleAttack = (row, col) => {

        if (!playerTurn) {
            // console.log("Blocked: Not player's turn");
            return;
        }


        const newAIBoard = aiBoard.map(row => [...row]); 
        newAIBoard[row][col] = aiBoard[row][col] === "S" ? "H" : "X"; 
        setAIBoard(newAIBoard);

        let hitShip = aiShips.find(ship => {
            return (ship.direction === "H" && ship.row === row && ship.col <= col && col < ship.col + ship.size) ||
                   (ship.direction === "V" && ship.col === col && ship.row <= row && row < ship.row + ship.size);
        });

        if (hitShip) {
            hitShip.hits += 1;
        }

        const isShipDestroyed = hitShip && hitShip.hits >= hitShip.size;

        if (isShipDestroyed) {
            console.log("🚢 AI Ship Destroyed!");
            setAiShipsDestroyed(prev => prev + 1);
        }

        if (aiShips.every(ship => ship.hits >= ship.size)) {
            setGameOver(true);
        }
    };

    const resetGame = () => {
        console.log("Resetting game");
        localStorage.removeItem("battleshipGameState"); 
        setGameOver(false);
        setGameStarted(false);
        setPlayerBoard(emptyBoard());  
        setAIBoard(emptyBoard());      
        setPlayerShips([]);
        setAIShips([]);
        setElapsedTime(0);
        setPlayerShipsDestroyed(0);
        setAiShipsDestroyed(0);
    };


    return (
        <div className="game-container">
            <h1>Free Play Mode</h1>
            <p>Play against Stupid AI, AI does not attack!</p>

            <div className="scoreboard">
                <p>🚢 Player Ships Destroyed: {playerShipsDestroyed}</p>
                <p>💥 AI Ships Destroyed: {aiShipsDestroyed}</p>
                <p className="Timer">⏳ Time: {formatTime(elapsedTime)}</p>
            </div>

            {!gameStarted && <button className="start-button" onClick={startGame}>Start Game</button>}
            {gameOver && <h2 className="game-over-message">Game Over! {playerShips.every(ship => ship.hits >= ship.size) ? "AI Wins!" : "Player Wins!"}</h2>}

            
            <div className="game-boards">
                <div className="board-wrapper">
                    <h2>Player Board</h2>
                    <GameBoard isPlayer={true} board={playerBoard} gameStarted={gameStarted} />
                </div>

                <div className="board-wrapper">
                    <h2>AI Board</h2>
                    <GameBoard isPlayer={false} board={aiBoard} gameStarted={gameStarted} onAttack={handleAttack} playerTurn={playerTurn} />

                </div>
            </div>

            <div className="buttons-container">
                <button className="reset-button" onClick={resetGame} disabled={!gameStarted}>Reset Game</button>
                <Link to="/">
                    <button className="back-button">Back to Home</button>
                </Link>
            </div>
        </div>
    );
}

export default NormalGame;

