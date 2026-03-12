"use client";

import { useEffect, useRef, useState } from "react";
import { Player } from "../game/types";
import styles from "./PlayerTurnIndicator.module.css";

interface PlayerTurnIndicatorProps {
  players: [Player, Player];
  currentPlayerIndex: 0 | 1;
}

const PLAYER_COLORS = [
  { bg: "linear-gradient(135deg, #FF6B6B, #FF8E53)", glow: "rgba(255, 107, 107, 0.5)" },
  { bg: "linear-gradient(135deg, #4D96FF, #6BCB77)", glow: "rgba(77, 150, 255, 0.5)" },
];

const AVATARS = ["&#129409;", "&#129412;"];

function AnimatedScore({ value, playerBg }: { value: number; playerBg: string }) {
  const [isBouncing, setIsBouncing] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value !== prevValue.current) {
      prevValue.current = value;
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <span
      className={`${styles.pairsCount} ${isBouncing ? styles.pairsBounce : ""}`}
      style={{ background: playerBg, WebkitBackgroundClip: "text", backgroundClip: "text" }}
    >
      {value}
    </span>
  );
}

export default function PlayerTurnIndicator({ players, currentPlayerIndex }: PlayerTurnIndicatorProps) {
  return (
    <div className={styles.indicator}>
      {players.map((player, i) => {
        const isActive = i === currentPlayerIndex;
        const colors = PLAYER_COLORS[i];
        return (
          <div
            key={i}
            className={`${styles.player} ${isActive ? styles.active : ""}`}
            style={{
              ["--player-bg" as string]: colors.bg,
              ["--player-glow" as string]: colors.glow,
            }}
          >
            <div className={styles.avatarWrap}>
              <span
                className={styles.avatar}
                dangerouslySetInnerHTML={{ __html: AVATARS[i] }}
              />
              {isActive && <div className={styles.activeRing} />}
            </div>
            <div className={styles.info}>
              <span className={styles.name} dir="auto">{player.name}</span>
              <div className={styles.pairsRow}>
                <AnimatedScore value={player.pairs} playerBg={colors.bg} />
                <span className={styles.pairsLabel}>{"\u05D6\u05D5\u05D2\u05D5\u05EA"}</span>
              </div>
            </div>
            {isActive && (
              <div className={styles.turnBadge} dir="rtl">{"\u05D4\u05EA\u05D5\u05E8 \u05E9\u05DC\u05DA!"}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
