import { formatDateForDisplay } from './dailyWord';

/**
 * Generate share text for completed game
 * Format:
 * Cozy Jotto [Date]
 * Solved in 4/6 (or X/6 for losses)
 *
 * [emoji grid]
 */
export function generateShareText(guesses, isWon, dateString, mode = 'daily') {
  const maxGuesses = 10;
  const result = isWon ? guesses.length : 'X';

  // Build emoji grid
  const emojiGrid = guesses.map(guess => {
    const greenCircles = guess.matches;
    const whiteCircles = 5 - guess.matches;
    return '🟢'.repeat(greenCircles) + '⚪'.repeat(whiteCircles);
  }).join('\n');

  const dateDisplay = mode === 'daily'
    ? formatDateForDisplay(dateString)
    : 'Zen Mode';

  const lines = [
    `Cozy Jotto ${dateDisplay}`,
    `${isWon ? 'Solved' : 'Failed'} in ${result}/${maxGuesses} ☕`,
    '',
    emojiGrid
  ];

  return lines.join('\n');
}

/**
 * Copy text to clipboard with fallback
 * Returns true if successful, false otherwise
 */
export async function copyToClipboard(text) {
  // Try modern Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback:', err);
    }
  }

  // Fallback for older browsers
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback clipboard copy failed:', err);
    return false;
  }
}
