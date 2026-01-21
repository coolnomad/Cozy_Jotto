This is not a PRD. It is an **execution contract + repair mandate**.

---

# Cozy Jotto — Codex Repair Instructions

## TASK

You are fixing an **existing Cozy Jotto implementation** so that it **fully matches the intended spec and works correctly**.

The codebase already exists.
Your job is to **inspect, diagnose, and minimally modify** it until the acceptance criteria below are satisfied.

**Do not rewrite the app. Do not redesign. Do not add features.**

---

## OPERATING MODE (IMPORTANT)

* You MUST first **read and understand the existing codebase**
* Identify **why it does not work**
* Apply **minimal, targeted fixes**
* Preserve existing structure unless it is provably broken
* Prefer **small diffs over rewrites**

If something is ambiguous:

* Choose the **simplest fix**
* Leave a brief comment explaining the assumption

---

## HARD CONSTRAINTS (NON-NEGOTIABLE)

### Stack

* React + Vite
* JavaScript (no TypeScript)
* Tailwind CSS (utility classes only)
* No backend
* No network calls
* No routing libraries
* No state management libraries
* No new dependencies of any kind

### Files

* Modify **only files under `src/`**
* Do NOT add new top-level folders
* Do NOT add config files unless absolutely required to fix a build break

### Scope

* Do NOT add future features
* Do NOT refactor for elegance
* Do NOT change UX unless required to fix incorrect behavior
* Do NOT introduce optional modes or flags

---

## INTENDED GAME BEHAVIOR (SOURCE OF TRUTH)

### Core Rules

* Secret word: exactly **5 letters**
* Guess: exactly **5 letters**
* For each guess, compute:

  * **Match count** = number of unique letters shared between guess and secret
  * Order does NOT matter
  * Duplicate letters count once

Example:

* Secret: `PORES`
* Guess: `APPLE`
* Matches: `P`, `E` → **2**

---

### Daily Puzzle Logic

* One word per calendar day
* Same word for all users on the same day
* Daily word is derived deterministically from date + word list
* Date is interpreted as **UTC calendar date**
* Changing system time mid-game does NOT reset an active game

---

### Game State

* Max guesses: **6**
* Game ends when:

  * Guess equals secret (win)
  * 6 guesses used (loss)
* After game end:

  * Input is disabled
  * Result is shown
  * Stats are updated exactly once

---

### Storage (localStorage)

All persistent state must use localStorage.

Required invariants:

* All stored words are **uppercase**
* Stored dates are **ISO YYYY-MM-DD (UTC)**

You may version keys if needed (e.g. `cozyjotto:v1:*`).

Do NOT store derived values (e.g. win %).

---

### Statistics

Persist:

* gamesPlayed
* wins
* currentStreak
* maxStreak

Rules:

* Stats update once per completed game
* Win/loss is recorded only after game ends
* Refreshing the page must not double-count

---

## ACCEPTANCE CRITERIA (STOP CONDITION)

You are DONE when all of the following are true:

1. `npm install && npm run dev` works
2. No console errors or warnings during play
3. Game correctly computes match counts
4. Daily word is stable across refreshes on same day
5. Stats persist correctly across reloads
6. Game cannot be replayed multiple times in one day
7. UI is usable on desktop and mobile
8. No features beyond those described exist

Once all criteria are met: **STOP. Do not continue refactoring.**

---

## REQUIRED WORKFLOW (FOLLOW THIS ORDER)

1. Inspect the repo structure
2. Identify broken or incorrect behavior
3. Trace issues to specific files/functions
4. Apply minimal fixes
5. Verify against acceptance criteria
6. Stop

---

## OUTPUT FORMAT

When responding:

* Use **unified diffs** or clearly labeled file edits
* Do NOT restate the entire codebase
* Do NOT include explanations longer than necessary
* If a fix is non-obvious, add a brief inline comment in code

---

## NON-GOALS (EXPLICITLY FORBIDDEN)

* Adding animations
* Adding settings
* Adding share buttons beyond what already exists
* Adding keyboard shortcuts beyond basic input
* Adding tests (unless required to diagnose a bug)
* Rewriting state logic “cleanly”

---

## MENTAL MODEL

You are a **repair engineer**, not an architect.

The design already exists.
Your job is to make reality match intent — **nothing more**.

---
