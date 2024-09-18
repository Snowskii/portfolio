import React, { useState } from "react";
import "./CreateGame.css";
import { useNavigate } from "react-router-dom";

type CreateGameProps = {
  img: string;
};

const CreateGame: React.FC<CreateGameProps> = ({ img }) => {
  const [player1Input, setPlayer1Input] = useState("");
  const [player2Input, setPlayer2Input] = useState("");
  const [player3Input, setPlayer3Input] = useState("");
  const [playerCount, setPlayerCount] = useState("2 Players");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const createSession = () => {
    const player1Trimmed = player1Input.trim();
    const player2Trimmed = player2Input.trim();
    const player3Trimmed = player3Input.trim();


    if (playerCount === "2 Players") {
      if (!player1Trimmed || !player2Trimmed) {
        setErrorMessage("Please fill out both player names.");
        return;
      }

      setErrorMessage("");
      navigate("/bangtheduelgenerator/game-generator", {
        state: { player1: player1Trimmed, player2: player2Trimmed },
      });
    } else if (playerCount === "3 Players") {
      if (!player1Trimmed || !player2Trimmed || !player3Trimmed) {
        setErrorMessage("Please fill out all three player names.");
        return;
      }

      setErrorMessage("");
      navigate("/bangtheduelgenerator/game-generator", {
        state: {
          player1: player1Trimmed,
          player2: player2Trimmed,
          player3: player3Trimmed,
        },
      });
    }

    return;
  };

  const handlePlayerCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerCount(e.target.value);
  };

  return (
    <div className="container">
      <div className="logo">
        <img src={img} alt="Game Logo" />
      </div>
      <div className="player-count">
        <h2>Choose Player Count</h2>
        <label>
          <input
            type="radio"
            name="playerCount"
            value="2 Players"
            onChange={handlePlayerCountChange}
            checked={playerCount === "2 Players"}
          />
          2 Players
        </label>
        <label>
          <input
            type="radio"
            name="playerCount"
            value="3 Players"
            onChange={handlePlayerCountChange}
            checked={playerCount === "3 Players"}
          />
          3 Players
        </label>
      </div>
      <div className="player-container">
        <div className="player">
          <label htmlFor="player1">Player 1</label>
          <input
            type="text"
            id="player1"
            name="player1"
            placeholder="Name"
            value={player1Input}
            onChange={(e) => setPlayer1Input(e.target.value)}
          />
        </div>
        <div className="player">
          <label htmlFor="player2">Player 2</label>
          <input
            type="text"
            id="player2"
            name="player2"
            placeholder="Name"
            value={player2Input}
            onChange={(e) => setPlayer2Input(e.target.value)}
          />
        </div>
        {playerCount === "3 Players" && (
          <div className="player">
            <label htmlFor="player3">Player 3</label>
            <input
              type="text"
              id="player3"
              name="player3"
              placeholder="Name"
              value={player3Input}
              onChange={(e) => setPlayer3Input(e.target.value)}
            />
          </div>
        )}
      </div>

      {errorMessage && <div className="error">{errorMessage}</div>}

      <div className="create-session">
        <button onClick={createSession}>Create a session</button>
      </div>
    </div>
  );
};

export default CreateGame;
