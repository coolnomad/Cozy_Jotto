import { DAILY_WORDS } from '../data/words';

/**
 * Get today's date string in UTC (YYYY-MM-DD format)
 */
export function getTodayDateString() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today.toISOString().split('T')[0];
}

/**
 * Generate a deterministic hash from a string
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit int
  }
  return Math.abs(hash);
}

/**
 * Get the daily word for a specific date
 * Everyone globally gets the same word for the same UTC day
 */
export function getDailyWord(dateString = getTodayDateString()) {
  const hash = hashString(dateString);
  const index = hash % DAILY_WORDS.length;
  return DAILY_WORDS[index];
}

/**
 * Get a random word for Zen mode
 */
export function getRandomWord() {
  const index = Math.floor(Math.random() * DAILY_WORDS.length);
  return DAILY_WORDS[index];
}

/**
 * Check if a date string is today (UTC)
 */
export function isToday(dateString) {
  return dateString === getTodayDateString();
}

/**
 * Check if a date string was yesterday (UTC)
 */
export function isYesterday(dateString) {
  const yesterday = new Date();
  yesterday.setUTCHours(0, 0, 0, 0);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  return dateString === yesterdayStr;
}

/**
 * Format date for display
 */
export function formatDateForDisplay(dateString) {
  const date = new Date(dateString + 'T00:00:00Z');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  });
}
