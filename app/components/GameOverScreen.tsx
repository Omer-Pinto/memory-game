"use client";

import { useEffect } from "react";
import { Player } from "../game/types";
import { playVictorySound } from "../game/soundEngine";
import Confetti from "./Confetti";
import styles from "./GameOverScreen.module.css";

interface GameOverScreenProps {
  players: [Player, Player];
  onPlayAgain: () => void;
}

export default function GameOverScreen({ players, onPlayAgain }: GameOverScreenProps) {
  useEffect(() => {
    playVictorySound();
  }, []);

  const sorted = [...players].sort((a, b) => b.pairs - a.pairs);
  const isTie = sorted[0].pairs === sorted[1].pairs;
  const winner = isTie ? null : sorted[0];

  return (
    <div className={styles.overlay}>
      <Confetti count={120} />
      <div className={styles.modal} dir="rtl">
        <div className={styles.trophy}>&#127942;</div>
        <h1 className={styles.title}>
          {isTie ? "\u05EA\u05D9\u05E7\u05D5!" : `${winner!.name} \u05E0\u05D9\u05E6\u05D7!`}
        </h1>

        <div className={styles.scores}>
          {sorted.map((player, i) => (
            <div key={i} className={`${styles.scoreRow} ${i === 0 && !isTie ? styles.winner : ""}`}>
              <div className={styles.rank}>
                {i === 0 && !isTie ? "\uD83E\uDD47" : i === 1 && !isTie ? "\uD83E\uDD48" : "\uD83E\uDD1D"}
              </div>
              <span className={styles.playerName}>{player.name}</span>
              <div className={styles.pairsBadge}>
                <span className={styles.pairsNumber}>{player.pairs}</span>
                <span className={styles.pairsWord}>{"\u05D6\u05D5\u05D2\u05D5\u05EA"}</span>
              </div>
            </div>
          ))}
        </div>

        <button className={styles.playAgain} onClick={onPlayAgain}>
          {"\u05E9\u05D7\u05E7\u05D5 \u05E9\u05D5\u05D1"} &#8635;
        </button>
      </div>
    </div>
  );
}
