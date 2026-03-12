"use client";

import { CardData } from "../game/types";
import styles from "./Card.module.css";

interface CardProps {
  card: CardData;
  onClick: (id: number) => void;
  disabled: boolean;
  isMatchAnimating: boolean;
  entranceDelay?: number;
}

export default function Card({ card, onClick, disabled, isMatchAnimating, entranceDelay = -1 }: CardProps) {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick(card.id);
    }
  };

  const isOpen = card.isFlipped || card.isMatched;
  const hasEntered = entranceDelay >= 0;

  return (
    <div
      className={`${styles.cardContainer} ${isOpen ? styles.flipped : ""} ${isMatchAnimating ? styles.matchedCard : ""} ${card.isMatched && !isMatchAnimating ? styles.matchedPermanent : ""} ${hasEntered ? styles.cardEntered : styles.cardHidden}`}
      style={{
        "--idle-delay": `${(card.id * 0.2) % 3}s`,
        "--entrance-delay": hasEntered ? `${entranceDelay}ms` : "0ms",
      } as React.CSSProperties}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={isOpen ? card.label : "Hidden card"}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          <span className={styles.starIcon}>&#10024;</span>
        </div>
        <div className={styles.cardBack}>
          <span className={styles.emoji}>{card.emoji}</span>
          <span className={styles.label} dir="rtl">{card.label}</span>
        </div>
      </div>
    </div>
  );
}
