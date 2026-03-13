"use client";

import { useState } from "react";
import { GameSetup } from "./game/types";
import SetupScreen from "./components/SetupScreen";
import GameBoard from "./components/GameBoard";

export default function Home() {
  const [gameSetup, setGameSetup] = useState<GameSetup | null>(null);
  const [savedSetup, setSavedSetup] = useState<{ player1: string; player2: string; icon1: string; icon2: string } | null>(null);

  const handleStart = (setup: GameSetup) => {
    setSavedSetup({ player1: setup.player1Name, player2: setup.player2Name, icon1: setup.player1Icon, icon2: setup.player2Icon });
    setGameSetup(setup);
  };

  const handlePlayAgain = () => {
    setGameSetup(null);
  };

  if (!gameSetup) {
    return (
      <SetupScreen
        onStart={handleStart}
        defaultPlayer1Name={savedSetup?.player1}
        defaultPlayer2Name={savedSetup?.player2}
        defaultPlayer1Icon={savedSetup?.icon1}
        defaultPlayer2Icon={savedSetup?.icon2}
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
