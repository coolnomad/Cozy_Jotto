import { useState } from 'react';
import GuessInput from './GuessInput';
import GuessList from './GuessList';
import ShareButton from './ShareButton';
import { useToast } from './Toast';

export default function GameBoard({
  gameState,
  onGuess,
  onNewGame,
  maxGuesses,
  mode,
  hasPlayedToday,
  isValidating,
}) {
  const { addToast } = useToast();
  const [inputError, setInputError] = useState(null);

  const { guesses, isGameOver, isWon, targetWord, dateString, isFetchingWord } = gameState;
  const guessesUsed = guesses.length;
  const guessesRemaining = Math.max(maxGuesses - guessesUsed, 0);
  const isInputDisabled = isGameOver || isValidating || isFetchingWord;

  const handleGuess = async (word) => {
    setInputError(null);
    const result = await onGuess(word);

    if (!result.success) {
      setInputError(result.error);
      addToast(result.error, 'error');
      return;
    }

    // Clear any previous error
    setInputError(null);

    if (result.isWon) {
      addToast(`Nice work! You solved it in ${guesses.length + 1} guesses!`, 'success', 5000);
    } else if (result.isGameOver) {
      addToast(`The word was ${targetWord}. Better luck next time!`, 'info', 5000);
    }

    return result;
  };

  // Show "already played today" message for daily mode
  if (mode === 'daily' && hasPlayedToday && isGameOver) {
    return (
      <div className="space-y-6">
        <GameOverMessage
          isWon={isWon}
          targetWord={targetWord}
          guessCount={guesses.length}
          mode={mode}
        />
        <GuessList guesses={guesses} maxGuesses={maxGuesses} />
        <div className="flex flex-col items-center gap-4">
          <ShareButton
            guesses={guesses}
            isWon={isWon}
            dateString={dateString}
            mode={mode}
          />
          <p className="text-center text-amber-700 text-sm">
            Come back tomorrow for a new puzzle, or try Zen mode for unlimited practice!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isGameOver ? (
        <>
          <GameOverMessage
            isWon={isWon}
            targetWord={targetWord}
            guessCount={guesses.length}
            mode={mode}
          />
          <GuessList guesses={guesses} maxGuesses={maxGuesses} />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ShareButton
              guesses={guesses}
              isWon={isWon}
              dateString={dateString}
              mode={mode}
            />
            {mode === 'zen' && (
              <button
                onClick={onNewGame}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-amber-500 hover:to-orange-500 transition-all duration-200"
              >
                Play Again
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-2 bg-orange-100/80 px-4 py-2 rounded-full border border-orange-200 shadow-inner text-orange-900 font-semibold">
                <span>Guesses</span>
                <span className="px-3 py-1 bg-white/80 rounded-full shadow-sm font-mono tracking-widest">
                  {guessesUsed}/{maxGuesses}
                </span>
              </div>
            </div>
            <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl shadow-md backdrop-blur-sm">
              <p className="text-amber-900 font-semibold text-center text-lg">
                Guess the 5-letter word in {maxGuesses} tries.
              </p>
              <p className="text-amber-700 text-sm text-center mt-1">
                Each guess shows how many letters are in the hidden word.
              </p>
              {(isFetchingWord || isValidating) && (
                <p className="text-amber-700 text-sm text-center mt-2">
                  {isFetchingWord ? 'Fetching a fresh word...' : 'Checking your guess...'}
                </p>
              )}
              <div className="mt-3 flex flex-col sm:flex-row justify-center gap-2 text-sm text-amber-700">
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 border border-amber-100 shadow-inner">
                  <span className="text-lg">­🔤</span>
                  <span>Duplicates count</span>
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 border border-amber-100 shadow-inner">
                  <span className="text-lg">⏳</span>
                  <span>{guessesRemaining} {guessesRemaining === 1 ? 'guess' : 'guesses'} left</span>
                </span>
              </div>
            </div>
          </div>
          <GuessInput
            onGuess={handleGuess}
            disabled={isInputDisabled}
            error={inputError}
          />
          <GuessList guesses={guesses} maxGuesses={maxGuesses} />
        </>
      )}
    </div>
  );
}

function GameOverMessage({ isWon, targetWord, guessCount, mode }) {
  if (isWon) {
    return (
      <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-md">
        <div className="text-4xl mb-2">☕</div>
        <h2 className="text-2xl font-serif text-green-800 font-bold">
          Nice work!
        </h2>
        <p className="text-green-700 mt-2">
          You solved it in {guessCount} {guessCount === 1 ? 'guess' : 'guesses'}!
        </p>
      </div>
    );
  }

  return (
    <div className="text-center p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 shadow-md">
      <div className="text-4xl mb-2">☕</div>
      <h2 className="text-2xl font-serif text-amber-800 font-bold">
        Good try!
      </h2>
      <p className="text-amber-700 mt-2">
        The word was <span className="font-bold font-mono tracking-wider">{targetWord}</span>
      </p>
      <p className="text-amber-600 text-sm mt-2">
        {mode === 'daily'
          ? "Come back tomorrow for a new puzzle."
          : "Try another word!"}
      </p>
    </div>
  );
}
