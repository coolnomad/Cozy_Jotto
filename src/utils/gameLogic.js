import { VALID_WORDS } from '../data/words';

/**
 * Count matching letters between guess and target.
 * Counts each letter in the guess that appears in the target (duplicates count).
 */
export function countMatches(guess, target) {
  const targetSet = new Set(target.toUpperCase());
  const guessChars = guess.toUpperCase().split('');

  let matches = 0;
  guessChars.forEach((char) => {
    if (targetSet.has(char)) {
      matches += 1;
    }
  });

  return matches;
}

/**
 * Validate a guess and return error message if invalid
 * Returns null if valid
 */
export function validateGuess(guess, previousGuesses = []) {
  if (!guess || guess.trim() === '') {
    return 'Please enter a word';
  }

  const word = guess.toUpperCase().trim();

  if (word.length !== 5) {
    return 'Word must be exactly 5 letters';
  }

  if (!/^[A-Z]+$/.test(word)) {
    return 'Word must contain only letters';
  }

  if (!VALID_WORDS.has(word)) {
    return "Hmm, that's not a word I recognize. Try another!";
  }

  if (previousGuesses.some(g => g.word.toUpperCase() === word)) {
    return 'You already tried that one!';
  }

  return null;
}

/**
 * Check if the guess is correct (all 5 letters match)
 */
export function isCorrectGuess(guess, target) {
  return guess.toUpperCase() === target.toUpperCase();
}

/**
 * Check if game is over (won or used all guesses)
 */
export function checkGameOver(guesses, targetWord, maxGuesses = 10) {
  if (guesses.length === 0) {
    return { isOver: false, isWon: false };
  }

  const lastGuess = guesses[guesses.length - 1];
  const isWon = isCorrectGuess(lastGuess.word, targetWord);
  const isOver = isWon || guesses.length >= maxGuesses;

  return { isOver, isWon };
}
