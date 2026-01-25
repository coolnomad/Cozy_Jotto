const KEY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const STATE_CLASSES = [
  'bg-amber-50 text-amber-900 border-amber-200',
  'bg-emerald-300 text-emerald-900 border-emerald-400',
  'bg-amber-300 text-amber-900 border-amber-400',
  'bg-rose-300 text-rose-900 border-rose-400',
];

const STATE_LABELS = ['default', 'green', 'yellow', 'red'];

export default function ScratchpadKeyboard({ keyStates, onCycle }) {
  return (
    <div className="space-y-3">
      <div className="text-center text-amber-700 font-medium">
        Scratchpad
      </div>
      <div className="space-y-2">
        {KEY_ROWS.map((row) => (
          <div key={row.join('')} className="flex justify-center gap-2">
            {row.map((letter) => {
              const stateIndex = keyStates[letter] ?? 0;
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => onCycle(letter)}
                  className={`w-9 h-10 sm:w-10 sm:h-11 rounded-lg border font-semibold shadow-sm transition-colors ${STATE_CLASSES[stateIndex]}`}
                  aria-label={`${letter} key: ${STATE_LABELS[stateIndex]}`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
