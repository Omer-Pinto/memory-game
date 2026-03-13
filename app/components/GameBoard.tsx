"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GameSetup, GameState, DIFFICULTY_CONFIG } from "../game/types";
import { checkMatch, createCards, createInitialState, flipCard } from "../game/gameEngine";
import { themes } from "../themes";
import {
  playMatchSound,
  playMismatchSound,
  playComboSound,
  playVictorySound,
  playFlipSound,
} from "../game/soundEngine";
import Card from "./Card";
import ScoreBoard from "./ScoreBoard";
import PlayerTurnIndicator from "./PlayerTurnIndicator";
import GameOverScreen from "./GameOverScreen";
import Confetti from "./Confetti";
import styles from "./GameBoard.module.css";

interface GameBoardProps {
  setup: GameSetup;
  onPlayAgain: () => void;
}

const ENCOURAGEMENTS = [
  "\u05DB\u05DC \u05D4\u05DB\u05D1\u05D5\u05D3!",
  "\u05DE\u05D3\u05D4\u05D9\u05DD!",
  "\u05E2\u05E9\u05D9\u05EA\u05DD \u05D0\u05EA \u05D6\u05D4!",
  "\u05E0\u05E4\u05DC\u05D0!",
  "\u05E1\u05D5\u05E4\u05E8!",
  "\u05D9\u05E9!",
  "\u05E4\u05E0\u05D8\u05E1\u05D8\u05D9!",
  "\u05D1\u05E8\u05D0\u05D1\u05D5!",
  "\u05D5\u05D0\u05D5!",
  "\u05D9\u05D5\u05E4\u05D9!",
];

const MISMATCH_ENCOURAGEMENTS = [
  "\u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1!",
  "\u05DB\u05DE\u05E2\u05D8!",
  "\u05E7\u05E8\u05D5\u05D1!",
  "\u05E0\u05D9\u05E1\u05D9\u05D5\u05DF \u05D8\u05D5\u05D1!",
  "\u05D4\u05DE\u05E9\u05D9\u05DB\u05D5!",
  "\u05D0\u05EA\u05DD \u05D9\u05DB\u05D5\u05DC\u05D9\u05DD!",
  "\u05E0\u05D9\u05E1\u05D9\u05D5\u05DF \u05D9\u05E4\u05D4!",
];

const COMBO_MESSAGES = [
  "",
  "",
  "\u05E7\u05D5\u05DE\u05D1\u05D5 2x!",
  "\u05E7\u05D5\u05DE\u05D1\u05D5 3x!",
  "4x \u05DE\u05D3\u05D4\u05D9\u05DD!",
  "5x \u05DE\u05D8\u05D5\u05E8\u05E3!",
  "\u05D1\u05DC\u05EA\u05D9 \u05E0\u05D9\u05EA\u05DF \u05DC\u05E2\u05E6\u05D9\u05E8\u05D4!",
];

const MISMATCH_VIEWING_TIME = 1000;
const TURN_ANNOUNCEMENT_TIME = 3000;
const MATCH_ANIMATION_TIME = 1200;
const MATCH_COOLDOWN_TIME = 1500;

const PARTICLE_COLORS = [
  "rgba(255,107,107,0.15)", "rgba(255,215,61,0.15)", "rgba(107,203,119,0.15)",
  "rgba(77,150,255,0.15)", "rgba(155,89,182,0.15)", "rgba(255,142,83,0.15)",
  "rgba(0,210,255,0.12)", "rgba(255,105,180,0.12)",
];

export default function GameBoard({ setup, onPlayAgain }: GameBoardProps) {
  const theme = themes.find((t) => t.id === setup.themeId)!;
  const config = DIFFICULTY_CONFIG[setup.difficulty];

  const [gameState, setGameState] = useState<GameState>(() => {
    const cards = createCards(theme, setup.difficulty);
    return createInitialState(cards, setup.player1Name, setup.player2Name);
  });

  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiCount, setConfettiCount] = useState(40);
  const [turnAnnouncement, setTurnAnnouncement] = useState<string | null>(null);
  const [encouragement, setEncouragement] = useState<string | null>(null);
  const [matchCooldown, setMatchCooldown] = useState(false);
  const [totalStars, setTotalStars] = useState(0);
  const [streak, setStreak] = useState(0);
  const [comboMessage, setComboMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [milestoneMessage, setMilestoneMessage] = useState<string | null>(null);
  const [cardsEntered, setCardsEntered] = useState(false);
  const [screenFlash, setScreenFlash] = useState(false);
  const [revealAll, setRevealAll] = useState(false);
  const prevPlayerRef = useRef(gameState.currentPlayerIndex);
  const halfwayShownRef = useRef(false);
  const totalPairs = config.pairsNeeded;

  // Card entrance + announce first player
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setCardsEntered(true), 100));

    // Announce first player's turn after cards enter
    timers.push(setTimeout(() => {
      const firstName = setup.player1Name.trim() || "\u05E9\u05D7\u05E7\u05DF 1";
      setTurnAnnouncement(`${firstName}, \u05D4\u05EA\u05D5\u05E8 \u05E9\u05DC\u05DA!`);
      setTimeout(() => setTurnAnnouncement(null), TURN_ANNOUNCEMENT_TIME);
    }, 800));

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [setup.difficulty, setup.player1Name]);

  useEffect(() => {
    if (prevPlayerRef.current !== gameState.currentPlayerIndex) {
      const name = gameState.players[gameState.currentPlayerIndex].name;
      setTurnAnnouncement(`${name}, \u05D4\u05EA\u05D5\u05E8 \u05E9\u05DC\u05DA!`);
      const timer = setTimeout(() => setTurnAnnouncement(null), TURN_ANNOUNCEMENT_TIME);
      prevPlayerRef.current = gameState.currentPlayerIndex;
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayerIndex, gameState.players]);

  useEffect(() => {
    if (gameState.flippedCardIds.length === 2 && gameState.isChecking) {
      const timer = setTimeout(() => {
        setGameState((prev) => {
          const result = checkMatch(prev);
          if (result.matchAnimation) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            setTotalStars((s) => s + 1);

            if (newStreak >= 2) {
              playComboSound();
            } else {
              playMatchSound();
            }

            if (newStreak >= 2) {
              const comboIdx = Math.min(newStreak, COMBO_MESSAGES.length - 1);
              setComboMessage(COMBO_MESSAGES[comboIdx]);
              setConfettiCount(40 + newStreak * 20);
              setTimeout(() => setComboMessage(null), 2000);
            } else {
              setConfettiCount(40);
            }

            setIsShaking(true);
            setScreenFlash(true);
            setTimeout(() => setIsShaking(false), 500);
            setTimeout(() => setScreenFlash(false), 400);

            const totalFound = result.players[0].pairs + result.players[1].pairs;
            const halfwayTarget = Math.floor(totalPairs / 2);
            if (totalFound === halfwayTarget && !halfwayShownRef.current) {
              halfwayShownRef.current = true;
              setMilestoneMessage("\u05D1\u05D0\u05DE\u05E6\u05E2!");
              setConfettiCount(80);
              setTimeout(() => setMilestoneMessage(null), 2500);
            }

            setShowConfetti(true);
            setMatchCooldown(true);
            const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
            setEncouragement(msg);
            setTimeout(() => setShowConfetti(false), 2500);
            setTimeout(() => setEncouragement(null), 2000);
            setTimeout(() => setMatchCooldown(false), MATCH_COOLDOWN_TIME);
          } else {
            playMismatchSound();
            playFlipSound();
            setStreak(0);
            const msg = MISMATCH_ENCOURAGEMENTS[Math.floor(Math.random() * MISMATCH_ENCOURAGEMENTS.length)];
            setEncouragement(msg);
            setTimeout(() => setEncouragement(null), 1500);
          }
          return result;
        });
      }, MISMATCH_VIEWING_TIME);
      return () => clearTimeout(timer);
    }
  }, [gameState.flippedCardIds, gameState.isChecking, streak]);

  useEffect(() => {
    if (gameState.matchAnimation) {
      const timer = setTimeout(() => {
        setGameState((prev) => ({ ...prev, matchAnimation: null }));
      }, MATCH_ANIMATION_TIME);
      return () => clearTimeout(timer);
    }
  }, [gameState.matchAnimation]);

  const handleCardClick = useCallback(
    (cardId: number) => {
      if (gameState.isChecking || gameState.isGameOver) return;
      const card = gameState.cards.find((c) => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched) return;

      playFlipSound();
      setGameState((prev) => flipCard(prev, cardId));
    },
    [gameState.isChecking, gameState.isGameOver, gameState.cards]
  );

  if (gameState.isGameOver) {
    return (
      <GameOverScreen
        players={gameState.players}
        onPlayAgain={onPlayAgain}
      />
    );
  }

  return (
    <div className={styles.container}>
      {screenFlash && <div className={styles.screenFlash} />}
      <div className={styles.particles}>
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              left: `${(i * 6.5) % 100}%`,
              animationDuration: `${8 + (i % 5) * 3}s`,
              animationDelay: `${(i * 1.3) % 8}s`,
              width: `${14 + (i % 4) * 12}px`,
              height: `${14 + (i % 4) * 12}px`,
              backgroundColor: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
            }}
          />
        ))}
      </div>

      {showConfetti && <Confetti count={confettiCount} />}

      {turnAnnouncement && (
        <div className={styles.turnAnnouncement}>
          <span className={styles.turnText} dir="rtl">{turnAnnouncement}</span>
        </div>
      )}

      {encouragement && (
        <div className={styles.encouragement}>
          <span className={styles.encouragementText} dir="rtl">{encouragement}</span>
        </div>
      )}

      {comboMessage && (
        <div className={styles.comboOverlay}>
          <span className={styles.comboText} dir="rtl">{comboMessage}</span>
        </div>
      )}

      {milestoneMessage && (
        <div className={styles.milestoneOverlay}>
          <span className={styles.milestoneText} dir="rtl">{milestoneMessage}</span>
        </div>
      )}

      <div className={styles.header}>
        <h2 className={styles.themeName} dir="rtl">{theme.name}</h2>
        {totalStars > 0 && (
          <div className={styles.starCounter}>
            {"*".repeat(Math.min(totalStars, 10)).split("").map((_, i) => (
              <span key={i} className={styles.starItem}>&#11088;</span>
            ))}
          </div>
        )}
        <button
          className={`${styles.revealButton} ${revealAll ? styles.revealButtonActive : ""}`}
          onClick={() => { playFlipSound(); setRevealAll((v) => !v); }}
          title={revealAll ? "\u05D4\u05E1\u05EA\u05E8 \u05D4\u05DB\u05DC" : "\u05D2\u05DC\u05D4 \u05D4\u05DB\u05DC"}
        >
          {revealAll ? "\uD83D\uDE48 \u05D4\u05E1\u05EA\u05E8" : "\uD83D\uDC41\uFE0F \u05D2\u05DC\u05D4 \u05D4\u05DB\u05DC"}
        </button>
      </div>

      <PlayerTurnIndicator
        players={gameState.players}
        currentPlayerIndex={gameState.currentPlayerIndex}
        icons={[setup.player1Icon, setup.player2Icon]}
      />

      <ScoreBoard players={gameState.players} totalPairs={totalPairs} />

      <div
        className={`${styles.grid} ${isShaking ? styles.gridShake : ""}`}
        style={{
          gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
          gridTemplateRows: `repeat(${config.rows}, 1fr)`,
          ["--grid-cols" as string]: config.cols,
          ["--grid-rows" as string]: config.rows,
        }}
      >
        {gameState.cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            onClick={handleCardClick}
            disabled={gameState.isChecking}
            isMatchAnimating={gameState.matchAnimation?.includes(card.id) ?? false}
            entranceDelay={cardsEntered ? index * 30 : -1}
            forceFlip={revealAll}
          />
        ))}
      </div>
    </div>
  );
}
