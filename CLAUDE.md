
# Kids Memory Game – Development Guide for Claude Code

## Goal

Build a browser-based memory card game for kids using:

- Next.js (App Router)
- React
- TypeScript
- CSS animations

The game must be colorful, interactive, and simple for children (ages ~3–7).

---

# Game Overview

Classic memory game rules:

1. Cards are placed face down in a grid.
2. Player flips two cards.
3. If they match:
   - they remain open
   - player gets another turn
4. If they do not match:
   - cards flip back
   - turn passes to the other player
5. Game ends when all pairs are found.
6. Player with most pairs wins.

---

# Two Player Mode

Game must support two players with names.

Before the game starts players enter:

- Player 1 name
- Player 2 name

During gameplay:

Display whose turn it is and how many pairs each player has.

When turn switches the game should announce:

"{playerName}, your turn!"

Voice can use Web Speech API or simple audio playback.

---

# Themes

The game supports multiple themes.

Each theme defines:

- id
- label
- image
- sound

Themes:

Animals
- Cow (moo)
- Dog (woof)
- Cat (meow)
- Lion (roar)

Home Machines
- Oven
- Washing machine
- Vacuum cleaner
- Blender

Human Faces
- Grandpa
- Grandma
- Baby
- Mom
- Dad

Colors
- Red
- Blue
- Green
- Yellow

Numbers
- 1–10

Hebrew Letters
- Aleph–Tav

English Letters
- A–Z

Family Members
- Mom
- Dad
- Brother
- Sister
- Grandpa
- Grandma

When a card flips:

- play the associated sound
- optionally pronounce the word.

---

# Game Setup Screen

Before starting the game the user selects:

- Player 1 name
- Player 2 name
- Theme
- Difficulty

Difficulty determines grid size:

Easy → 4x4  
Medium → 6x6  
Hard → 8x8  

---

# UX Requirements

The game should feel lively and engaging.

Card Animation
- Use 3D flip animation.

Match Feedback
- confetti animation
- happy sound

Mismatch Feedback
- small "oops" sound
- cards flip back after delay

Game End
- celebration animation
- announce winner
- show scoreboard

Example:

Michael: 5 pairs  
Emilia: 3 pairs

---

# Suggested Project Structure

/app

/components
- Card
- GameBoard
- ScoreBoard
- PlayerTurnIndicator
- ThemeSelector

/game
- gameEngine.ts
- turnManager.ts

/themes
- animals.ts
- letters-hebrew.ts
- letters-english.ts
- numbers.ts

/assets
/images
/sounds

---

# Game Logic Constraints

Rules to enforce:

1. Only two cards may be flipped simultaneously
2. Disable clicks during animations
3. Maintain player turns
4. Track matched pairs
5. Detect game completion

State can be managed using React state or reducer.

---

# Accessibility

Design for children:

- large cards
- bright colors
- simple layout
- big text

---

# Performance

Avoid unnecessary re-renders.

Prefer CSS animations instead of heavy animation libraries.

---

# Development Phases

Phase 1
Basic board and card flipping

Phase 2
Matching logic

Phase 3
Two-player turn system

Phase 4
Themes and sound effects

Phase 5
Animations and polish

---

# Optional Enhancements

Optional improvements:

- Timer mode
- Single player vs computer
- Star reward system
- Background music
- Emoji theme

---

# Coding Guidelines

Prefer:

- small reusable components
- clear TypeScript types
- readable code

Avoid unnecessary dependencies.

---

# Implementation Rule

If something is unclear:

Make a reasonable design decision and continue implementing.

Do not stop waiting for clarification unless implementation is blocked.
