"use client";

import { useState } from "react";
import { Difficulty, GameSetup } from "../game/types";
import { themes } from "../themes";
import styles from "./SetupScreen.module.css";

interface SetupScreenProps {
  onStart: (setup: GameSetup) => void;
  defaultPlayer1Name?: string;
  defaultPlayer2Name?: string;
}

const DIFFICULTIES: { key: Difficulty; label: string; desc: string; icon: string }[] = [
  { key: "easy", label: "\u05E7\u05DC", desc: "4 x 4", icon: "\u2B50" },
  { key: "medium", label: "\u05D1\u05D9\u05E0\u05D5\u05E0\u05D9", desc: "6 x 6", icon: "\uD83D\uDD25" },
  { key: "hard", label: "\u05E7\u05E9\u05D4", desc: "8 x 8", icon: "\u26A1" },
];

export default function SetupScreen({ onStart, defaultPlayer1Name, defaultPlayer2Name }: SetupScreenProps) {
  const [player1Name, setPlayer1Name] = useState(defaultPlayer1Name || "");
  const [player2Name, setPlayer2Name] = useState(defaultPlayer2Name || "");
  const [themeId, setThemeId] = useState(themes[0].id);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      player1Name: player1Name.trim() || "\u05E9\u05D7\u05E7\u05DF 1",
      player2Name: player2Name.trim() || "\u05E9\u05D7\u05E7\u05DF 2",
      themeId,
      difficulty,
    });
  };

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.floatingEmojis}>
        {["&#127775;", "&#127752;", "&#127880;", "&#127881;", "&#11088;", "&#127775;"].map((emoji, i) => (
          <span
            key={i}
            className={styles.floatingEmoji}
            style={{ animationDelay: `${i * 0.4}s`, left: `${10 + i * 15}%` }}
            dangerouslySetInnerHTML={{ __html: emoji }}
          />
        ))}
      </div>
      <div className={styles.titleWrap}>
        <h1 className={styles.title}>{"\u05DE\u05E9\u05D7\u05E7 \u05D6\u05D9\u05DB\u05E8\u05D5\u05DF"}</h1>
        <p className={styles.subtitle}>{"\u05DE\u05E6\u05D0\u05D5 \u05D0\u05EA \u05DB\u05DC \u05D4\u05D6\u05D5\u05D2\u05D5\u05EA!"}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.playersRow}>
          <div className={styles.playerField}>
            <div className={styles.playerIcon}>&#129409;</div>
            <input
              className={styles.input}
              type="text"
              placeholder={"\u05E9\u05D7\u05E7\u05DF 1"}
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              maxLength={15}
              dir="auto"
            />
          </div>
          <span className={styles.vs}>{"\u05E0\u05D2\u05D3"}</span>
          <div className={styles.playerField}>
            <div className={styles.playerIcon}>&#129412;</div>
            <input
              className={styles.input}
              type="text"
              placeholder={"\u05E9\u05D7\u05E7\u05DF 2"}
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              maxLength={15}
              dir="auto"
            />
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.sectionLabel}>{"\u05D1\u05D7\u05E8\u05D5 \u05E0\u05D5\u05E9\u05D0"}</label>
          <div className={styles.themeGrid}>
            {themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={`${styles.themeOption} ${themeId === theme.id ? styles.themeSelected : ""}`}
                onClick={() => setThemeId(theme.id)}
              >
                <span className={styles.themeEmoji}>
                  {theme.items.slice(0, 3).map((item) => item.emoji).join("")}
                </span>
                <span className={styles.themeName}>{theme.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.sectionLabel}>{"\u05E8\u05DE\u05EA \u05E7\u05D5\u05E9\u05D9"}</label>
          <div className={styles.difficultyRow}>
            {DIFFICULTIES.map((d) => (
              <button
                key={d.key}
                type="button"
                className={`${styles.difficultyOption} ${difficulty === d.key ? styles.difficultySelected : ""}`}
                onClick={() => setDifficulty(d.key)}
              >
                <span className={styles.diffIcon}>{d.icon}</span>
                <span className={styles.diffLabel}>{d.label}</span>
                <span className={styles.diffDesc}>{d.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className={styles.startButton}>
          <span className={styles.startText}>{"\u05D4\u05EA\u05D7\u05D9\u05DC\u05D5 \u05DC\u05E9\u05D7\u05E7!"}</span>
          <span className={styles.startArrow}>&larr;</span>
        </button>
      </form>
    </div>
  );
}
