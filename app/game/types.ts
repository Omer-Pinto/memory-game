export interface ThemeItem {
  id: string;
  label: string;
  emoji: string;
}

export interface Theme {
  id: string;
  name: string;
  items: ThemeItem[];
}

export type Difficulty = "easy" | "medium" | "hard";

export interface DifficultyConfig {
  label: string;
  cols: number;
  rows: number;
  totalCards: number;
  pairsNeeded: number;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: { label: "Easy", cols: 4, rows: 4, totalCards: 16, pairsNeeded: 8 },
  medium: { label: "Medium", cols: 6, rows: 6, totalCards: 36, pairsNeeded: 18 },
  hard: { label: "Hard", cols: 8, rows: 8, totalCards: 64, pairsNeeded: 32 },
};

export interface CardData {
  id: number;
  themeItemId: string;
  label: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface Player {
  name: string;
  pairs: number;
}

export interface GameState {
  cards: CardData[];
  players: [Player, Player];
  currentPlayerIndex: 0 | 1;
  flippedCardIds: number[];
  isChecking: boolean;
  isGameOver: boolean;
  matchAnimation: number[] | null;
}

export interface GameSetup {
  player1Name: string;
  player2Name: string;
  themeId: string;
  difficulty: Difficulty;
}
