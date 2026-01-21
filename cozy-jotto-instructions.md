# 🎯 Cozy Jotto - Complete Web Application Build Instructions

## Project Overview
Build a complete, production-ready word guessing game (Jotto) as a single-page React application with a cozy, warm aesthetic designed for morning coffee rituals.

---

## Technical Foundation

### Stack
- **Framework:** React 18+ with Vite
- **Styling:** Tailwind CSS (core utilities only, no custom config)
- **State Management:** React hooks (useState, useEffect, useCallback, useMemo)
- **Storage:** localStorage API (wrapped with error handling)
- **Language:** Modern JavaScript (ES6+)
- **Target Browsers:** Chrome, Safari, Firefox, Edge (last 2 versions)

### Project Structure
```
src/
├── App.jsx                 # Main app component with routing/mode logic
├── components/
│   ├── GameBoard.jsx       # Main game interface
│   ├── GuessInput.jsx      # Input field and submit button
│   ├── GuessList.jsx       # History of guesses with match counts
│   ├── StatsModal.jsx      # Statistics display
│   ├── HowToPlayModal.jsx  # Instructions
│   ├── ModeSelector.jsx    # Daily/Zen mode toggle
│   └── ShareButton.jsx     # Copy results to clipboard
├── hooks/
│   ├── useGameState.js     # Core game logic and state
│   ├── useStats.js         # Stats tracking and persistence
│   └── useStorage.js       # localStorage wrapper
├── utils/
│   ├── wordList.js         # Valid 5-letter words array
│   ├── dailyWord.js        # Deterministic daily word selection
│   ├── gameLogic.js        # Matching algorithm, validation
│   └── shareText.js        # Generate share format
├── data/
│   └── words.js            # Export of WORD_LIST and VALID_WORDS
└── main.jsx                # Entry point
```

---

## Core Requirements

### 1. Game Mechanics
- **Word Length:** Exactly 5 letters
- **Guess Limit:** 10 attempts per game
- **Validation:** Only accept valid English words from dictionary
- **Matching Logic:** Count letters that appear in target word (handle duplicates correctly)
- **Win Condition:** Exact match of all 5 letters
- **Loss Condition:** 10 guesses without winning

### 2. Daily Word System
**Approach:** Deterministic hash-based selection
- Everyone globally gets the same word each UTC day
- Word rotates at midnight UTC
- Prevent playing previous day's puzzle (localStorage tracking)
- ~500 word curated list for daily rotation
- Deterministic algorithm: hash date string → index into word list

### 3. Game Modes
**Daily Mode (default):**
- One puzzle per day
- Same word for all players globally
- Can only play once per day
- Contributes to stats and streaks

**Zen Mode:**
- Unlimited puzzles
- Random word selection from full word list
- Practice mode, no pressure
- Separate stats tracking (no streaks)

### 4. Stats Tracking
**Track separately for Daily and Zen:**
- Total games played
- Games won
- Win percentage
- Current streak (Daily only)
- Max streak (Daily only)
- Average guesses (when won)
- Guess distribution (1-10 guesses)

**Persistence:**
- localStorage with error handling
- Graceful degradation if storage fails
- Data structure allows future expansion

### 5. Share Functionality
**Format (spoiler-free):**
```
Cozy Jotto [Date]
Solved in 4/10 ☕

🟢🟢⚪⚪⚪
🟢🟢🟢⚪⚪
🟢🟢🟢🟢⚪
🟢🟢🟢🟢🟢
```
- Green circles = matches
- White circles = non-matches
- Copy to clipboard with fallback
- Show confirmation toast
- Don't reveal the actual word

### 6. UI/UX Requirements
**Visual Design:**
- Warm color palette: Amber, orange, cream, soft browns
- Gradient background: `from-amber-50 via-orange-50 to-red-50`
- Rounded corners throughout (`rounded-xl`, `rounded-2xl`)
- Soft shadows and borders
- Comfortable spacing (not cramped)
- Serif font for headings (built-in font-serif)
- Sans-serif for body text

**Responsive:**
- Mobile-first design
- Single column on mobile
- Comfortable touch targets (44px minimum)
- Works well on 320px to 1920px widths
- Test breakpoints: mobile (< 640px), tablet (640-1024px), desktop (> 1024px)

**Accessibility:**
- Keyboard navigation (Tab, Enter, Escape)
- Focus indicators
- ARIA labels for icons/buttons
- Semantic HTML
- Screen reader friendly

**States:**
- Loading states (if needed)
- Empty states (no guesses yet)
- Error states (invalid word, network issues)
- Success states (game won)
- Failure states (game lost)

---

## Detailed Specifications

### Data Structures

```javascript
// Game State
const gameState = {
  mode: 'daily' | 'zen',
  targetWord: string,        // The word to guess
  guesses: Array<{
    word: string,
    matches: number
  }>,
  isGameOver: boolean,
  isWon: boolean,
  lastPlayedDate: string,    // ISO date string for daily mode
  gameStartTime: number,     // timestamp
}

// Stats Structure
const stats = {
  daily: {
    gamesPlayed: number,
    gamesWon: number,
    currentStreak: number,
    maxStreak: number,
    guessDistribution: {
      1: number,
      2: number,
      // ... through 10
    },
    averageGuesses: number,
    lastPlayedDate: string,
  },
  zen: {
    gamesPlayed: number,
    gamesWon: number,
    averageGuesses: number,
    guessDistribution: {
      1: number,
      // ... through 10
    }
  }
}
```

### Algorithms

#### Letter Matching (Handle Duplicates Correctly)
```javascript
/**
 * Count matching letters between guess and target.
 * Each letter in target can only be matched once.
 * 
 * Examples:
 * - APPLE vs PLEAS → 2 (P, E)
 * - APPLE vs PEPPY → 3 (P, P, E)
 * - APPLE vs LLAMA → 2 (L, L from target)
 * - APPLE vs AAAAA → 1 (only one A in APPLE)
 */
function countMatches(guess, target) {
  const targetCounts = {};
  for (const char of target) {
    targetCounts[char] = (targetCounts[char] || 0) + 1;
  }
  
  let matches = 0;
  for (const char of guess) {
    if (targetCounts[char] > 0) {
      matches++;
      targetCounts[char]--;
    }
  }
  
  return matches;
}
```

#### Daily Word Selection (Deterministic)
```javascript
/**
 * Generate the same word for the same date globally.
 * Uses simple hash function for deterministic randomness.
 */
function getDailyWord(wordList) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const dateStr = today.toISOString().split('T')[0]; // "2026-01-14"
  
  // Simple hash
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit int
  }
  
  const index = Math.abs(hash) % wordList.length;
  return wordList[index];
}
```

#### Stats Calculation
```javascript
/**
 * Update stats after game completion
 */
function updateStats(mode, won, guessCount, lastDate, currentDate) {
  // Win percentage
  const winPercentage = (gamesWon / gamesPlayed) * 100;
  
  // Streak logic (Daily only)
  if (mode === 'daily') {
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (won) {
      if (lastDate === yesterdayStr || !lastDate) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  // Average guesses (only for wins)
  if (won) {
    averageGuesses = (averageGuesses * (gamesWon - 1) + guessCount) / gamesWon;
  }
  
  // Guess distribution
  guessDistribution[guessCount] = (guessDistribution[guessCount] || 0) + 1;
}
```

---

## Implementation Details

### Component Breakdown

#### App.jsx
- Root component
- Manages game mode state
- Conditionally renders GameBoard
- Provides modals (Stats, HowToPlay)
- Dark mode toggle (future feature, but structure for it)

#### GameBoard.jsx
- Main game container
- Integrates: GuessInput, GuessList, ModeSelector, ShareButton
- Displays game over states (win/loss)
- Shows guess counter (X/10)
- Handles game reset

#### GuessInput.jsx
- Controlled input (uppercase automatically)
- Submit button
- Enter key handling
- Input validation feedback
- Disable when game over
- Auto-focus on mount
- Clear after submit

#### GuessList.jsx
- Maps over guesses array
- Each item shows: word + match count
- Visual styling per guess
- Empty state when no guesses

#### StatsModal.jsx
- Accessible modal component
- Tabs for Daily vs Zen stats
- Display all stat metrics
- Guess distribution bar chart
- Close on Escape or click outside
- Prevent background scroll

#### HowToPlayModal.jsx
- Instructions for playing
- Example guess with visual
- Explain match counting
- Daily vs Zen difference
- Close button

#### ModeSelector.jsx
- Toggle between Daily and Zen
- Visual indicator of current mode
- Warn if switching mid-game (optional)

#### ShareButton.jsx
- Only show after game completion
- Generate share text
- Copy to clipboard
- Show "Copied!" confirmation toast
- Fallback for older browsers

### Hooks

#### useGameState.js
```javascript
export function useGameState(mode) {
  const [gameState, setGameState] = useState(() => initializeGame(mode));
  
  const makeGuess = useCallback((word) => {
    // Validation
    // Match counting
    // State update
    // Check win/loss conditions
  }, [gameState]);
  
  const resetGame = useCallback(() => {
    // New word
    // Clear guesses
    // Reset flags
  }, [mode]);
  
  return {
    gameState,
    makeGuess,
    resetGame,
    canPlay, // Check if daily already played
  };
}
```

#### useStats.js
```javascript
export function useStats() {
  const [stats, setStats] = useState(() => loadStats());
  
  const updateStats = useCallback((mode, won, guessCount) => {
    // Calculate new stats
    // Update streaks
    // Save to storage
  }, [stats]);
  
  const resetStats = useCallback(() => {
    // Confirmation needed
    // Clear all stats
  }, []);
  
  return {
    stats,
    updateStats,
    resetStats,
  };
}
```

#### useStorage.js
```javascript
export function useStorage() {
  const getItem = useCallback((key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return defaultValue;
    }
  }, []);
  
  const setItem = useCallback((key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      return false;
    }
  }, []);
  
  const removeItem = useCallback((key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      return false;
    }
  }, []);
  
  return { getItem, setItem, removeItem };
}
```

---

## Word Lists

### Daily Word List (~500 words)
Curated for:
- Common, recognizable words
- Family-friendly
- No obscure or archaic words
- Good variety of letter patterns
- Appropriate difficulty

**Examples:** APPLE, BREAD, CHAIR, DANCE, EAGLE, FLAME, GRAPE, HEART, IMAGE, JUICE, KNIFE, LEMON, MUSIC, NIGHT, OCEAN, PEACE, QUIET, RIVER, STONE, TABLE, UNDER, VOICE, WATER, YOUTH...

### Valid Words List (~5000+ words)
For validation:
- Include all daily words
- Common 5-letter English words
- Plural forms
- Past tenses
- Allow proper gameplay

**Implementation:**
```javascript
// data/words.js
export const DAILY_WORDS = [
  'APPLE', 'BREAD', 'CHAIR', // ... ~500 words
];

export const VALID_WORDS = new Set([
  ...DAILY_WORDS,
  'ABOUT', 'ABOVE', 'ABUSE', // ... thousands more
]);
```

---

## Error Handling

### Input Validation Errors
- Empty input → "Please enter a word"
- Not 5 letters → "Word must be exactly 5 letters"
- Contains numbers/special chars → "Word must contain only letters"
- Invalid word → "Not a valid English word"
- Duplicate guess → "You already guessed this word"
- Game over → Don't accept new guesses

### Storage Errors
- Gracefully degrade if localStorage unavailable
- Continue game without persistence
- Warn user (optional, non-intrusive)

### Edge Cases
- Midnight transition during gameplay (rare but possible)
- Browser back/forward navigation
- Tab visibility changes
- Page refresh mid-game (should preserve state)

---

## Accessibility Requirements

### Keyboard Navigation
- Tab through interactive elements
- Enter to submit guess
- Escape to close modals
- Arrow keys for mode selection (optional)

### Screen Readers
- ARIA labels for buttons with only icons
- Role="dialog" for modals
- Announce game state changes
- Describe match counts clearly

### Visual
- Minimum contrast ratios (WCAG AA)
- Focus indicators visible
- Text scalable
- No information conveyed by color alone

---

## Performance Considerations

### Optimizations
- useMemo for expensive calculations (if any)
- useCallback for event handlers passed to children
- Debounce input if needed (probably not necessary)
- Lazy load modals (optional)

### Bundle Size
- Keep it small (< 100KB minified)
- No unnecessary dependencies
- Tree-shake unused Tailwind classes

---

## Testing Scenarios

### Manual Test Cases
1. **Basic gameplay:**
   - Enter valid word → see match count
   - Enter invalid word → see error
   - Win game → see celebration
   - Lose game (10 guesses) → see reveal
   
2. **Daily mode:**
   - Play and win → cannot play again same day
   - Wait until midnight → new word available
   - Check stats update correctly
   
3. **Zen mode:**
   - Unlimited games
   - Different word each game
   - Stats tracked separately
   
4. **Stats:**
   - Win → streak increases
   - Loss → streak resets
   - Averages calculated correctly
   
5. **Share:**
   - Copy to clipboard works
   - Fallback works on older browsers
   - Format correct
   
6. **Edge cases:**
   - Duplicate letter handling (APPLE vs LLAMA)
   - Refresh page → state preserved
   - Clear localStorage → still works
   - Invalid input → handled gracefully

---

## UI Copy & Messaging

### Tone
- Warm, friendly, encouraging
- Never condescending
- Cozy morning ritual vibe
- Gentle humor okay

### Key Messages

**Win:**
"Nice work! ☕ You solved it in [X] guesses."

**Loss:**
"Good try! The word was [WORD]. Come back tomorrow for a new puzzle. ☕"

**Daily Already Played:**
"You've already played today's puzzle! Come back tomorrow for a new word, or try Zen mode for unlimited practice. ☕"

**Invalid Word:**
"Hmm, that's not a word I recognize. Try another!"

**Duplicate Guess:**
"You already tried that one!"

**How to Play:**
"Guess the 5-letter word in 10 tries. Each guess shows how many letters match the hidden word (including duplicates). The Daily puzzle is the same for everyone and resets at midnight UTC. Zen mode is for unlimited practice. Good luck! ☕"

---

## Styling Guidelines

### Color Palette
```javascript
// Primary colors
bg-amber-50, bg-orange-50, bg-red-50  // Backgrounds
text-amber-900, text-orange-900       // Text
border-amber-200, border-orange-200   // Borders

// Accents
bg-orange-400, bg-red-400             // Buttons
bg-green-100, text-green-800          // Success states
bg-red-100, text-red-800              // Error states

// Neutrals
bg-white, bg-gray-50                  // Cards
text-gray-700                         // Secondary text
```

### Spacing
- Use Tailwind spacing scale (4, 6, 8, 12, 16, 24...)
- Generous padding in cards (p-6, p-8)
- Comfortable margins between sections (mb-6, mb-8)

### Typography
- Headings: `font-serif text-4xl md:text-5xl`
- Body: `text-base md:text-lg`
- Small text: `text-sm`
- Input: `text-lg md:text-xl font-bold tracking-widest`

### Shadows & Effects
- Cards: `shadow-xl`
- Buttons: `shadow-md hover:shadow-lg`
- Modals: `backdrop-blur`
- Subtle gradients: `bg-gradient-to-r`

---

## Deployment Considerations

### Build Optimization
- `npm run build` should produce optimized bundle
- Environment variables for any config
- No console.logs in production

### Browser Compatibility
- ES6+ okay (modern browsers)
- Fetch API (native)
- localStorage (universal support)
- Clipboard API with fallback

---

## Future Enhancements (NOT in v1)

Document but don't implement:
- Dark mode toggle
- Time Attack mode
- Custom word lists
- User accounts
- Cloud sync
- Multiple languages
- Sound effects
- Animations
- Themes

---

## Acceptance Criteria

The application is complete when:

- ✅ Daily word rotates correctly at midnight UTC
- ✅ Can't replay same day's puzzle
- ✅ Zen mode allows unlimited games
- ✅ Stats track correctly for both modes
- ✅ Streaks calculate properly
- ✅ Share functionality works with fallback
- ✅ All validation works (length, characters, valid words)
- ✅ Letter matching handles duplicates correctly
- ✅ Responsive on mobile, tablet, desktop
- ✅ Keyboard accessible
- ✅ Error handling graceful
- ✅ localStorage persists state
- ✅ UI matches cozy aesthetic
- ✅ No console errors
- ✅ Loads in < 2 seconds on slow 3G

---

## Development Notes

### Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.3",
    "vite": "^4.4.0"
  }
}
```

### Commands
```bash
npm create vite@latest cozy-jotto -- --template react
cd cozy-jotto
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

### Tailwind Config
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## Final Notes

**This is a complete specification for a production-ready v1.0 web application.**

**What makes this special:**
- Thoughtfully designed for the "morning coffee ritual" use case
- Respects user time (one daily puzzle)
- Provides practice mode (Zen) without pressure
- Clean, cozy aesthetic
- Mobile-friendly
- Accessibility considered
- Stats motivate without stress
- Share feature encourages social engagement

**Success metrics:**
- User can complete a game in 5-10 minutes
- Interface feels warm and inviting
- No friction or confusion
- Works reliably across devices
- Performance feels instant

**When in doubt:**
- Choose simplicity over features
- Choose warmth over clinical precision
- Choose reliability over cleverness
- Choose shipping over perfection

---

**Build this with love. It's a gift for your wife and a portfolio piece for yourself. Make it something you're proud to show.** ☕