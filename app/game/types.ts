export interface ThemeItem {
  id: string;
  label: string;
  emoji: string;
  color?: string;
  shape?: string;
  image?: string;
}

export interface Theme {
  id: string;
  name: string;
  image?: string;
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
  color?: string;
  shape?: string;
  image?: string;
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

export interface PlayerIcon {
  emoji: string;
  label: string;
  image?: string;
}

export const PLAYER_ICONS: PlayerIcon[] = [
  { emoji: "\uD83E\uDD81", label: "\u05D0\u05E8\u05D9\u05D4" },       // 🦁 אריה
  { emoji: "\uD83E\uDD84", label: "\u05D7\u05D3 \u05E7\u05E8\u05DF" }, // 🦄 חד קרן
  { emoji: "\uD83D\uDC32", label: "\u05D3\u05E8\u05E7\u05D5\u05DF" },  // 🐲 דרקון
  { emoji: "\uD83E\uDD8B", label: "\u05E4\u05E8\u05E4\u05E8" },       // 🦋 פרפר
  { emoji: "\uD83E\uDD85", label: "\u05E0\u05E9\u05E8" },             // 🦅 נשר
  { emoji: "\uD83D\uDC3A", label: "\u05D6\u05D0\u05D1" },             // 🐺 זאב
  { emoji: "\uD83E\uDD8A", label: "\u05E9\u05D5\u05E2\u05DC" },       // 🦊 שועל
  { emoji: "\uD83D\uDC2D", label: "\u05DE\u05D9\u05E7\u05D9 \u05DE\u05D0\u05D5\u05E1", image: "/assets/images/mickey-mouse.jpg" }, // מיקי מאוס
  { emoji: "\uD83D\uDC31", label: "\u05D7\u05EA\u05D5\u05DC" },       // 🐱 חתול
  { emoji: "\uD83C\uDF80", label: "\u05DE\u05D9\u05E0\u05D9 \u05DE\u05D0\u05D5\u05E1", image: "/assets/images/minnie-mouse-round.jpg" }, // מיני מאוס
  { emoji: "\uD83E\uDDB8", label: "\u05D2\u05D9\u05D1\u05D5\u05E8 \u05E2\u05DC" },  // 🦸 גיבור על
  { emoji: "\uD83E\uDD77", label: "\u05E0\u05D9\u05E0\u05D2\'\u05D4" },   // 🥷 נינג'ה
];

export interface GameSetup {
  player1Name: string;
  player2Name: string;
  player1Icon: string;
  player2Icon: string;
  themeId: string;
  difficulty: Difficulty;
}
