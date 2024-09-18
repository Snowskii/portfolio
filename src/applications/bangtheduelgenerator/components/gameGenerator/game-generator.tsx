import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./GameGenerator.css";

interface Result {
  game: string;
  player1: string;
  player2: string;
  player3?: string;
  player1Generation: string;
  player2Generation: string;
  player3Generation?: string;
  winner: string;
  timestamp: string;
}

const GameGeneratorScreen: React.FC = () => {
  const [player1, setPlayer1] = useState<string>("");
  const [player2, setPlayer2] = useState<string>("");
  const [player3, setPlayer3] = useState<string>("");
  const [game, setGame] = useState<string>("");
  const [player1Generation, setPlayer1Generation] = useState<string>("");
  const [player2Generation, setPlayer2Generation] = useState<string>("");
  const [player3Generation, setPlayer3Generation] = useState<string>("");
  const [selectedWinner, setSelectedWinner] = useState<string>("");
  const [results, setResults] = useState<Result[]>([]);

  const location = useLocation();
  const state = location.state as {
    player1: string;
    player2: string;
    player3?: string;
  };
  const navigate = useNavigate();

  const generateRandomNumbers = useCallback((): string => {
    const length = game.includes("Reinforcements") ? 18 : 12;
    const numbers = Array.from({ length }, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers
      .slice(0, 4)
      .sort((a, b) => a - b)
      .join(", ");
  }, [game]);

  const generateAnotherGame = useCallback(() => {
    const gameTypes = [
      "Reinforcements - Sheriffs vs Bandits",
      "Reinforcements - Bandits vs Sheriffs",
      "Sheriffs vs Bandits",
      "Sheriffs vs Renegades",
      "Bandits vs Sheriffs",
      "Bandits vs Renegades",
      "Renegades vs Sheriffs",
      "Renegades vs Bandits",
    ];

    const randomGameType =
      gameTypes[Math.floor(Math.random() * gameTypes.length)];

    const newPlayer1Generation = generateRandomNumbers();
    const newPlayer2Generation = generateRandomNumbers();
    const newPlayer3Generation = state.player3 ? generateRandomNumbers() : "";

    // Set state
    setGame(randomGameType);
    setPlayer1Generation(newPlayer1Generation);
    setPlayer2Generation(newPlayer2Generation);
    setPlayer3Generation(state.player3 ? newPlayer3Generation : "");
    setSelectedWinner("");

    // Save to localStorage
    const generatedData = {
      game: randomGameType,
      player1Generation: newPlayer1Generation,
      player2Generation: newPlayer2Generation,
      player3Generation: state.player3 ? newPlayer3Generation : "",
    };
    saveToLocalStorage("generatedData", generatedData);

    // Reset radio buttons
    document.querySelectorAll('input[name="winner"]').forEach((radio) => {
      (radio as HTMLInputElement).checked = false;
    });
  }, [generateRandomNumbers, state.player3]);

  useEffect(() => {
    setPlayer1(state.player1 || "Unknown Player 1");
    setPlayer2(state.player2 || "Unknown Player 2");
    setPlayer3(state.player3 || "Unknown Player 3");

    // Load results and generated data from localStorage
    const savedResults = localStorage.getItem("gameResults");
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }

    const savedGeneratedData = localStorage.getItem("generatedData");
    if (savedGeneratedData) {
      const data = JSON.parse(savedGeneratedData);
      setGame(data.game);
      setPlayer1Generation(data.player1Generation);
      setPlayer2Generation(data.player2Generation);
      setPlayer3Generation(data.player3Generation);
    } else {
      generateAnotherGame(); // Generate a new game if no data is found in local storage
    }
  }, [state, generateAnotherGame]);

  const saveToLocalStorage = (key: string, data: unknown): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save to localStorage with key "${key}":`, error);
    }
  };

  const handleWinnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedWinner(e.target.value);
  };

  const saveCurrentResult = (timestamp: string) => {
    if (selectedWinner) {
      const newResult: Result = {
        game,
        player1,
        player2,
        player3: player3 !== "Unknown Player 3" ? player3 : undefined,
        player1Generation,
        player2Generation,
        player3Generation:
          player3 !== "Unknown Player 3" ? player3Generation : undefined,
        winner: selectedWinner,
        timestamp,
      };
      setResults((prevResults) => {
        const updatedResult = [...prevResults, newResult];
        saveToLocalStorage("gameResults", updatedResult);
        return updatedResult;
      });
    }
  };

  const endSession = () => {
    if (results.length === 0) {
      navigate("/");
      return;
    }

    const timestamp = new Date().toISOString();
    saveCurrentResult(timestamp);

    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `game-results-${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);

    // Clear local storage
    localStorage.removeItem("gameResults");
    localStorage.removeItem("generatedData");

    setResults([]);
    navigate("/");
  };

  const reloadPage = () => {
    const timestamp = new Date().toISOString();
    saveCurrentResult(timestamp);
    generateAnotherGame();
  };

  return (
    <div className="game-container">
      <h1>Game</h1>
      <div className="player-container">
        <div className="player">
          <p>Player 1: {player1}</p>
        </div>
        <div className="player">
          <p>Player 2: {player2}</p>
        </div>
        {player3 !== "Unknown Player 3" && (
          <div className="player">
            <p>Player 3: {player3}</p>
          </div>
        )}
      </div>
      <div className="generated-game">
        <p>Game: {game}</p>
      </div>
      <div className="generated-characters">
        <p>Player 1: {player1Generation}</p>
        <p>Player 2: {player2Generation}</p>
        {player3 !== "Unknown Player 3" && <p>Player 3: {player3Generation}</p>}
      </div>
      <div className="winner">
        <p>Choose the winner:</p>
        <label>
          <input
            type="radio"
            name="winner"
            value="player1"
            onChange={handleWinnerChange}
            checked={selectedWinner === "player1"}
          />
          {player1}
        </label>
        <label>
          <input
            type="radio"
            name="winner"
            value="player2"
            onChange={handleWinnerChange}
            checked={selectedWinner === "player2"}
          />
          {player2}
        </label>
        {player3 !== "Unknown Player 3" && (
          <label>
            <input
              type="radio"
              name="winner"
              value="player3"
              onChange={handleWinnerChange}
              checked={selectedWinner === "player3"}
            />
            {player3}
          </label>
        )}
      </div>
      {!selectedWinner && <div className="error">Who is the winner?</div>}
      <div className="generate-another-game">
        <button onClick={reloadPage} disabled={!selectedWinner}>
          Generate another game
        </button>
        <button onClick={endSession}>End Session and Save Results</button>
      </div>
    </div>
  );
};

export default GameGeneratorScreen;
