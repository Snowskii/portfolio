import React, { useEffect, useState } from "react";
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
  const state = location.state as { player1: string; player2: string; player3?: string };
  const navigate = useNavigate();

  useEffect(() => {
    setPlayer1(state.player1 || "Unknown Player 1");
    setPlayer2(state.player2 || "Unknown Player 2");
    setPlayer3(state.player3 || "Unknown Player 3");
    generateAnotherGame();
  }, [state]);

  const generateRandomNumbers = (): string => {
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
  };

  const generateAnotherGame = () => {
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

    setGame(randomGameType);
    setPlayer1Generation(generateRandomNumbers());
    setPlayer2Generation(generateRandomNumbers());
    setPlayer3Generation(state.player3 ? generateRandomNumbers() : "");
    setSelectedWinner("");

    // Reset radio buttons
    document.querySelectorAll('input[name="winner"]').forEach((radio) => {
      (radio as HTMLInputElement).checked = false;
    });
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
      setResults((prevResults) => [...prevResults, newResult]);
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
