import { useState, useCallback, useEffect } from 'react';
import { useStorage, STORAGE_KEYS } from './useStorage';
import { getTodayDateString, isYesterday } from '../utils/dailyWord';

const initialStats = {
  daily: {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
    averageGuesses: 0,
    lastPlayedDate: null,
    lastWonDate: null,
  },
  zen: {
    gamesPlayed: 0,
    gamesWon: 0,
    guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
    averageGuesses: 0,
  }
};

export function useStats() {
  const { getItem, setItem } = useStorage();
  const [stats, setStats] = useState(() => {
    const saved = getItem(STORAGE_KEYS.STATS);
    return saved ? { ...initialStats, ...saved } : initialStats;
  });

  // Persist stats whenever they change
  useEffect(() => {
    setItem(STORAGE_KEYS.STATS, stats);
  }, [stats, setItem]);

  const updateStats = useCallback((mode, won, guessCount) => {
    setStats(prevStats => {
      const modeStats = { ...prevStats[mode] };
      const today = getTodayDateString();

      // Update basic counts
      modeStats.gamesPlayed += 1;
      if (won) {
        modeStats.gamesWon += 1;
      }

      // Update guess distribution
      if (won) {
        modeStats.guessDistribution = {
          ...modeStats.guessDistribution,
          [guessCount]: (modeStats.guessDistribution[guessCount] || 0) + 1
        };

        // Update average guesses (only for wins)
        const totalWonGames = modeStats.gamesWon;
        const previousAvg = modeStats.averageGuesses || 0;
        modeStats.averageGuesses = totalWonGames === 1
          ? guessCount
          : ((previousAvg * (totalWonGames - 1)) + guessCount) / totalWonGames;
      }

      // Handle streaks (Daily mode only)
      if (mode === 'daily') {
        const lastWonDate = modeStats.lastWonDate;

        if (won) {
          // Check if this continues a streak
          if (lastWonDate && isYesterday(lastWonDate)) {
            modeStats.currentStreak += 1;
          } else if (lastWonDate === today) {
            // Already played today, don't change streak
          } else {
            // Start new streak
            modeStats.currentStreak = 1;
          }
          modeStats.maxStreak = Math.max(modeStats.maxStreak, modeStats.currentStreak);
          modeStats.lastWonDate = today;
        } else {
          // Lost - reset current streak
          modeStats.currentStreak = 0;
        }

        modeStats.lastPlayedDate = today;
      }

      return {
        ...prevStats,
        [mode]: modeStats
      };
    });
  }, []);

  const resetStats = useCallback(() => {
    setStats(initialStats);
  }, []);

  const getWinPercentage = useCallback((mode) => {
    const modeStats = stats[mode];
    if (modeStats.gamesPlayed === 0) return 0;
    return Math.round((modeStats.gamesWon / modeStats.gamesPlayed) * 100);
  }, [stats]);

  return {
    stats,
    updateStats,
    resetStats,
    getWinPercentage,
  };
}
