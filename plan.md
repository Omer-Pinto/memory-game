# Memory Game v2 — Improvement Plan

## Status

| # | Task                                      | Status      |
|---|-------------------------------------------|-------------|
| 1 | Remove unused game modes                  | Done        |
| 2 | Fix Colors mode (color+shape cards)       | Done        |
| 3 | Add Smurfs theme                          | In progress |
| 4 | Bug: success message blocks mouse         | Done        |
| 5 | Bug: player names reset on "another game" | Done        |

---

## Task 1 — Remove Unused Game Modes

Remove the following themes from `app/themes/index.ts` and any related UI references (e.g. dropdown options in `SetupScreen.tsx`):

- English Letters (אותיות באנגלית)
- Hebrew Letters (אותיות בעברית)
- Numbers (מספרים)
- Home Machines / Tools (מכשירים)

**Sub-tasks:**
1. Delete the theme entries from `app/themes/index.ts`
2. Verify `SetupScreen.tsx` dropdown no longer shows them
3. Ensure no leftover references in types or game engine

---

## Task 2 — Fix Colors Mode

The current Colors theme (צבעים) has problems:
- Shows non-color items (hearts, stars, snowflakes, etc.) instead of actual colors
- Hebrew labels show odd formatting like "pink(ורוד)" with mismatched emoji
- Cards should display **color + shape** so kids see a visual representation

**Data source:** `~/Downloads/colors_memory_game.md` — 32 entries, each with a Hebrew color name, HEX value, and a Hebrew shape name.

**Sub-tasks:**
1. Replace all 32 items in the Colors theme (`app/themes/index.ts`) using the data from the file
2. Each card should render as a **colored shape** (e.g. red circle, blue square) — not just an emoji
   - Use the HEX value for the fill color
   - Use an SVG or CSS shape matching the shape name (עיגול=circle, ריבוע=square, משולש=triangle, כוכב=star, לב=heart, etc.)
3. The card label should be the Hebrew color name (אדום, כחול, etc.)
4. When spoken via Web Speech API, pronounce the color name
5. For Easy (4×4 = 8 pairs), use items 1–8; Medium (6×6 = 18 pairs), use items 1–18; Hard (8×8 = 32 pairs), use all 32
6. Verify cards look correct and shapes render at appropriate size within the card

---

## Task 3 — Add Smurfs Theme (דרדסים)

Add a new "Smurfs" (דרדסים) theme featuring characters from the show, including known villains. This is expected to be the most popular mode — invest time to make it polished.

**Character sources:**
- Hebrew Wikipedia: https://he.wikipedia.org/wiki/הדרדסים_–_דמויות
- English Wikipedia: https://en.wikipedia.org/wiki/List_of_The_Smurfs_characters

**Sub-tasks:**
1. Research and select up to 32 Smurf characters (heroes + villains) from the wiki pages above
   - Use Hebrew names as labels
   - Include well-known characters: Papa Smurf (דרדס-פא), Smurfette (דרדסית), Brainy, Hefty, Jokey, Clumsy, Gargamel, Azrael, etc.
2. Add the theme to `app/themes/index.ts` with id, Hebrew label, and emoji for each character
   - Pick the most fitting emoji for each character (or a generic blue emoji if no good match)
3. Optionally fetch character images from the wiki pages to use as card faces instead of plain emoji
   - If using images, store URLs or download small versions to `public/images/smurfs/`
4. Add a theme icon/label in the setup screen dropdown
5. Ensure speech synthesis pronounces the Hebrew character names correctly
6. Test across all three difficulty levels (8, 18, 32 pairs)

---

## Task 4 — Bug Fix: Success Message Blocks Mouse Input

**Problem:** After a successful match (2 cards matched), a congratulatory message/animation appears. During this time, the mouse is blocked — the player cannot flip the next card until the message finishes. This is frustrating for eager players who want to keep going.

**Expected behavior:** The success message/animation should appear but **not** block card interaction. The player should be able to click the next card immediately while the message is still visible.

**Sub-tasks:**
1. Identify where the click-blocking happens in `GameBoard.tsx` (likely a state flag like `isAnimating` or `isChecking` that prevents clicks during the success feedback)
2. Decouple the success message display from the input-blocking logic — show the message with `pointer-events: none` or similar so it doesn't intercept clicks
3. Ensure the match celebration (confetti, sound, message) still plays but the board remains interactive
4. Verify that the game state transitions correctly even when the player clicks fast during celebrations

---

## Task 5 — Bug Fix: Player Names Reset on "Another Game"

**Problem:** When players finish a game and click "Another Game" (in `GameOverScreen.tsx`), the player names are cleared and the setup screen asks for them again. Names should persist so players can jump straight into a new round.

**Expected behavior:** Clicking "Another Game" should return to the setup screen with both player names pre-filled from the previous game.

**Sub-tasks:**
1. Trace the "Another Game" flow: `GameOverScreen` → parent `page.tsx` callback → state reset
2. Ensure `page.tsx` preserves `player1Name` and `player2Name` state when transitioning back to the setup screen
3. The setup screen should show the previous names as default values, editable if the player wants to change them
4. Theme and difficulty selections can optionally persist too (nice-to-have)
