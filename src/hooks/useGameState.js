import { useState, useCallback, useEffect } from 'react';
import { useStorage, STORAGE_KEYS } from './useStorage';
import { getDailyWord, getRandomWord, getTodayDateString } from '../utils/dailyWord';
import { fetchRandomZenWord } from '../utils/zenWord';
import { countMatches, validateGuess, checkGameOver } from '../utils/gameLogic';

const MAX_GUESSES = 10;

function createInitialGameState(mode) {
  const today = getTodayDateString();
  return {
    mode,
    targetWord: mode === 'daily' ? getDailyWord() : null,
    guesses: [],
    isGameOver: false,
    isWon: false,
    dateString: today,
    gameStartTime: Date.now(),
    scratchpad: {},
    isFetchingWord: mode !== 'daily',
  };
}

export function useGameState(mode, onGameComplete) {
  const { getItem, setItem } = useStorage();
  const [isValidating, setIsValidating] = useState(false);

  // Load or initialize game state
  const [gameState, setGameState] = useState(() => {
    const storageKey = mode === 'daily' ? STORAGE_KEYS.GAME_STATE_DAILY : STORAGE_KEYS.GAME_STATE_ZEN;
    const saved = getItem(storageKey);
    const today = getTodayDateString();

    if (saved) {
      // For daily mode, check if it's still the same day
      if (mode === 'daily') {
        if (saved.dateString === today) {
          return { ...saved, scratchpad: saved.scratchpad || {}, isFetchingWord: false };
        }
        // New day, start fresh
        return createInitialGameState(mode);
      }
      // For zen mode, restore saved state
      return {
        ...saved,
        scratchpad: saved.scratchpad || {},
        isFetchingWord: !saved.targetWord,
      };
    }

    return createInitialGameState(mode);
  });

  // Persist game state
  useEffect(() => {
    const storageKey = mode === 'daily' ? STORAGE_KEYS.GAME_STATE_DAILY : STORAGE_KEYS.GAME_STATE_ZEN;
    setItem(storageKey, gameState);
  }, [gameState, mode, setItem]);

  // Check if daily already played today
  const canPlay = useCallback(() => {
    if (mode !== 'daily') return true;
    const today = getTodayDateString();
    return gameState.dateString === today && !gameState.isGameOver;
  }, [mode, gameState]);

  // Check if daily was completed today
  const hasPlayedToday = useCallback(() => {
    if (mode !== 'daily') return false;
    const today = getTodayDateString();
    return gameState.dateString === today && gameState.isGameOver;
  }, [mode, gameState]);

  // Fetch a new Zen word if needed
  useEffect(() => {
    let isActive = true;

    const ensureZenWord = async () => {
      if (mode !== 'zen' || gameState.targetWord) return;
      setGameState(prev => ({ ...prev, isFetchingWord: true }));

      try {
        const word = await fetchRandomZenWord();
        if (!isActive) return;
        setGameState(prev => ({
          ...prev,
          targetWord: word,
          isFetchingWord: false,
        }));
      } catch (error) {
        console.error('Failed to fetch Zen word, falling back to local list.', error);
        if (!isActive) return;
        setGameState(prev => ({
          ...prev,
          targetWord: getRandomWord(),
          isFetchingWord: false,
        }));
      }
    };

    ensureZenWord();
    return () => { isActive = false; };
  }, [mode, gameState.targetWord]);

  // Make a guess
  const makeGuess = useCallback(async (word) => {
    const normalizedWord = word.toUpperCase().trim();

    if (!gameState.targetWord) {
      return { success: false, error: 'Fetching a word, please try again in a moment.' };
    }

    // Validate
    setIsValidating(true);
    let error = null;
    try {
      error = await validateGuess(normalizedWord, gameState.guesses);
    } finally {
      setIsValidating(false);
    }
    if (error) {
      return { success: false, error };
    }

    // Calculate matches
    const matches = countMatches(normalizedWord, gameState.targetWord);

    // Create new guess
    const newGuess = { word: normalizedWord, matches };
    const newGuesses = [...gameState.guesses, newGuess];

    // Check game over
    const { isOver, isWon } = checkGameOver(newGuesses, gameState.targetWord, MAX_GUESSES);

    // Update state
    setGameState(prev => ({
      ...prev,
      guesses: newGuesses,
      isGameOver: isOver,
      isWon,
    }));

    // Notify completion
    if (isOver && onGameComplete) {
      onGameComplete(isWon, newGuesses.length);
    }

    return { success: true, matches, isGameOver: isOver, isWon };
  }, [gameState, onGameComplete]);

  // Reset game (for Zen mode or new daily)
  const resetGame = useCallback(() => {
    const newState = createInitialGameState(mode);
    setGameState(newState);
  }, [mode]);

  // Switch mode (preserves state for each mode)
  const switchMode = useCallback((newMode) => {
    const storageKey = newMode === 'daily' ? STORAGE_KEYS.GAME_STATE_DAILY : STORAGE_KEYS.GAME_STATE_ZEN;
    const saved = getItem(storageKey);
    const today = getTodayDateString();

    if (saved) {
      if (newMode === 'daily') {
        if (saved.dateString === today) {
          setGameState({ ...saved, scratchpad: saved.scratchpad || {}, isFetchingWord: false });
          return;
        }
      } else {
        setGameState({
          ...saved,
          scratchpad: saved.scratchpad || {},
          isFetchingWord: !saved.targetWord,
        });
        return;
      }
    }

    setGameState(createInitialGameState(newMode));
  }, [getItem]);

  const cycleScratchpad = useCallback((letter) => {
    setGameState(prev => {
      const current = prev.scratchpad?.[letter] ?? 0;
      const next = (current + 1) % 4;
      return {
        ...prev,
        scratchpad: { ...prev.scratchpad, [letter]: next },
      };
    });
  }, []);

  return {
    gameState,
    makeGuess,
    resetGame,
    switchMode,
    canPlay,
    hasPlayedToday,
    maxGuesses: MAX_GUESSES,
    cycleScratchpad,
    isValidating,
  };
}
