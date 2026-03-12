"use client";

import { useEffect, useState } from "react";
import styles from "./Confetti.module.css";

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  delay: number;
  size: number;
  shape: "circle" | "square" | "star";
  drift: number;
  duration: number;
}

const COLORS = [
  "#FF6B6B", "#FF8E53", "#FFD93D", "#FFED4E",
  "#6BCB77", "#4ECDC4", "#4D96FF", "#9B59B6",
  "#FF69B4", "#00D2FF", "#FF4757", "#FFA502",
];

export default function Confetti({ count = 60 }: { count?: number }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const generated: ConfettiPiece[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.8,
      size: 7 + Math.random() * 12,
      shape: (["circle", "square", "star"] as const)[Math.floor(Math.random() * 3)],
      drift: -50 + Math.random() * 100,
      duration: 1.5 + Math.random() * 2,
    }));
    setPieces(generated);
  }, [count]);

  return (
    <div className={styles.confettiContainer}>
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`${styles.piece} ${styles[piece.shape]}`}
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.shape !== "star" ? piece.color : "transparent",
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            width: piece.size,
            height: piece.size,
            ["--drift" as string]: `${piece.drift}px`,
            textShadow: piece.shape === "star" ? `0 0 4px ${piece.color}` : "none",
            color: piece.color,
          }}
        >
          {piece.shape === "star" ? "\u2726" : ""}
        </div>
      ))}
    </div>
  );
}
