"use client";

import { useState } from "react";
import { GameSetup } from "./game/types";
import SetupScreen from "./components/SetupScreen";
import GameBoard from "./components/GameBoard";

export default function Home() {
  const [gameSetup, setGameSetup] = useState<GameSetup | null>(null);
  const [savedNames, setSavedNames] = useState<{ player1: string; player2: string } | null>(null);

  const handleStart = (setup: GameSetup) => {
    setSavedNames({ player1: setup.player1Name, player2: setup.player2Name });
    setGameSetup(setup);
  };

  const handlePlayAgain = () => {
    setGameSetup(null);
  };

  if (!gameSetup) {
    return (
      <SetupScreen
        onStart={handleStart}
        defaultPlayer1Name={savedNames?.player1}
        defaultPlayer2Name={savedNames?.player2}
      />
    );
  }

  return (
    <GameBoard
      key={`${gameSetup.themeId}-${gameSetup.difficulty}-${Date.now()}`}
      setup={gameSetup}
      onPlayAgain={handlePlayAgain}
    />
  );
}
