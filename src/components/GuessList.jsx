export default function GuessList({ guesses, maxGuesses = 6 }) {
  if (guesses.length === 0) {
    return (
      <div className="text-center py-10 px-4 text-amber-800 bg-amber-50/80 border border-amber-200 rounded-2xl shadow-inner">
        <p className="text-lg font-semibold">No guesses yet</p>
        <p className="text-sm opacity-80 mt-1">Enter a 5-letter word to begin</p>
      </div>
    );
  }

  return (
    <div className="space-y-2" role="list" aria-label="Your guesses">
      {guesses.map((guess, index) => (
        <GuessItem
          key={index}
          guess={guess}
          number={index + 1}
          isLast={index === guesses.length - 1}
        />
      ))}
      {guesses.length < maxGuesses && (
        <div className="text-center text-sm text-amber-600 mt-4">
          {maxGuesses - guesses.length} guesses remaining
        </div>
      )}
    </div>
  );
}

function GuessItem({ guess, number, isLast }) {
  const { word, matches } = guess;
  const isCorrect = matches === 5;

  return (
    <div
      role="listitem"
      className={`
        flex items-center gap-4 p-3 sm:p-4 rounded-xl
        transition-all duration-300
        ${isCorrect
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300'
          : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
        }
        ${isLast ? 'shadow-md' : 'shadow-sm'}
      `}
    >
      <span
        className={`
          w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold
          ${isCorrect ? 'bg-green-200 text-green-800' : 'bg-amber-100 text-amber-700'}
        `}
        aria-hidden="true"
      >
        {number}
      </span>
      <span
        className="flex-1 font-mono text-xl tracking-widest font-bold text-amber-900"
        aria-label={`Guess ${number}: ${word}`}
      >
        {word}
      </span>
      <div className="flex items-center gap-2">
        <MatchIndicator matches={matches} />
        <span
          className={`
            text-lg font-bold
            ${isCorrect ? 'text-green-600' : 'text-amber-600'}
          `}
          aria-label={`${matches} out of 5 letters match`}
        >
          {matches}/5
        </span>
      </div>
    </div>
  );
}

function MatchIndicator({ matches }) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`
            w-2 h-2 rounded-full transition-colors duration-300
            ${i < matches ? 'bg-green-500' : 'bg-gray-300'}
          `}
        />
      ))}
    </div>
  );
}
