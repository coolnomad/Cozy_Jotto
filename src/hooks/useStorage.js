import { useCallback } from 'react';

const STORAGE_KEYS = {
  GAME_STATE_DAILY: 'cozy-jotto-daily-game',
  GAME_STATE_ZEN: 'cozy-jotto-zen-game',
  STATS: 'cozy-jotto-stats',
};

export { STORAGE_KEYS };

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

  return { getItem, setItem, removeItem, STORAGE_KEYS };
}
