"use client";

import { Player } from "../game/types";
import styles from "./ScoreBoard.module.css";

interface ScoreBoardProps {
  players: [Player, Player];
  totalPairs: number;
}

export default function ScoreBoard({ players, totalPairs }: ScoreBoardProps) {
  const foundPairs = players[0].pairs + players[1].pairs;
  const progress = totalPairs > 0 ? (foundPairs / totalPairs) * 100 : 0;

  return (
    <div className={styles.scoreBoard}>
      <div className={styles.progressWrap}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={styles.progressText}>
          {foundPairs} / {totalPairs} {"\u05D6\u05D5\u05D2\u05D5\u05EA \u05E0\u05DE\u05E6\u05D0\u05D5"}
        </span>
      </div>
    </div>
  );
}
