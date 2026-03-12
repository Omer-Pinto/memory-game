"use client";

import { useState } from "react";
import { GameSetup } from "./game/types";
import SetupScreen from "./components/SetupScreen";
import GameBoard from "./components/GameBoard";

export default function Home() {
  const [gameSetup, setGameSetup] = useState<GameSetup | null>(null);

  const handleStart = (setup: GameSetup) => {
    setGameSetup(setup);
  };

  const handlePlayAgain = () => {
    setGameSetup(null);
  };

  if (!gameSetup) {
    return <SetupScreen onStart={handleStart} />;
  }

  return (
    <GameBoard
      key={`${gameSetup.themeId}-${gameSetup.difficulty}-${Date.now()}`}
      setup={gameSetup}
      onPlayAgain={handlePlayAgain}
    />
  );
}
