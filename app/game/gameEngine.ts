import { CardData, Difficulty, DIFFICULTY_CONFIG, GameState, Player } from "./types";
import { Theme } from "./types";

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createCards(theme: Theme, difficulty: Difficulty): CardData[] {
  const config = DIFFICULTY_CONFIG[difficulty];
  const pairsNeeded = config.pairsNeeded;

  const selectedItems = theme.items.slice(0, pairsNeeded);

  const cards: CardData[] = [];
  let id = 0;

  for (const item of selectedItems) {
    const base = {
      themeItemId: item.id,
      label: item.label,
      emoji: item.emoji,
      ...(item.color ? { color: item.color } : {}),
      ...(item.shape ? { shape: item.shape } : {}),
      ...(item.image ? { image: item.image } : {}),
      isFlipped: false,
      isMatched: false,
    };
    cards.push({ ...base, id: id++ });
    cards.push({ ...base, id: id++ });
  }

  return shuffle(cards);
}

export function createInitialState(
  cards: CardData[],
  player1Name: string,
  player2Name: string
): GameState {
  return {
    cards,
    players: [
      { name: player1Name, pairs: 0 },
      { name: player2Name, pairs: 0 },
    ],
    currentPlayerIndex: 0,
    flippedCardIds: [],
    isChecking: false,
    isGameOver: false,
    matchAnimation: null,
  };
}

export function flipCard(state: GameState, cardId: number): GameState {
  if (state.isChecking) return state;
  if (state.flippedCardIds.length >= 2) return state;

  const card = state.cards.find((c) => c.id === cardId);
  if (!card || card.isFlipped || card.isMatched) return state;

  const newCards = state.cards.map((c) =>
    c.id === cardId ? { ...c, isFlipped: true } : c
  );

  const newFlipped = [...state.flippedCardIds, cardId];

  return {
    ...state,
    cards: newCards,
    flippedCardIds: newFlipped,
    isChecking: newFlipped.length === 2,
  };
}

export function checkMatch(state: GameState): GameState {
  if (state.flippedCardIds.length !== 2) return state;

  const [firstId, secondId] = state.flippedCardIds;
  const first = state.cards.find((c) => c.id === firstId)!;
  const second = state.cards.find((c) => c.id === secondId)!;

  const isMatch = first.themeItemId === second.themeItemId;

  if (isMatch) {
    const newCards = state.cards.map((c) =>
      c.id === firstId || c.id === secondId
        ? { ...c, isMatched: true, isFlipped: true }
        : c
    );

    const newPlayers: [Player, Player] = [...state.players] as [Player, Player];
    newPlayers[state.currentPlayerIndex] = {
      ...newPlayers[state.currentPlayerIndex],
      pairs: newPlayers[state.currentPlayerIndex].pairs + 1,
    };

    const allMatched = newCards.every((c) => c.isMatched);

    return {
      ...state,
      cards: newCards,
      players: newPlayers,
      flippedCardIds: [],
      isChecking: false,
      isGameOver: allMatched,
      matchAnimation: [firstId, secondId],
    };
  }

  // No match - flip cards back
  const newCards = state.cards.map((c) =>
    c.id === firstId || c.id === secondId
      ? { ...c, isFlipped: false }
      : c
  );

  const nextPlayerIndex: 0 | 1 = state.currentPlayerIndex === 0 ? 1 : 0;

  return {
    ...state,
    cards: newCards,
    players: state.players,
    currentPlayerIndex: nextPlayerIndex,
    flippedCardIds: [],
    isChecking: false,
    matchAnimation: null,
  };
}
