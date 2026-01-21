export default function ModeSelector({ mode, onModeChange, disabled = false }) {
  return (
    <div className="flex justify-center" role="tablist" aria-label="Game mode">
      <div className="inline-flex bg-amber-100/80 border border-amber-200 rounded-xl p-1 shadow-inner backdrop-blur">
        <button
          role="tab"
          aria-selected={mode === 'daily'}
          aria-controls="game-panel"
          onClick={() => onModeChange('daily')}
          disabled={disabled}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${mode === 'daily'
              ? 'bg-white text-amber-900 shadow-md'
              : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Daily
          </span>
        </button>
        <button
          role="tab"
          aria-selected={mode === 'zen'}
          aria-controls="game-panel"
          onClick={() => onModeChange('zen')}
          disabled={disabled}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${mode === 'zen'
              ? 'bg-white text-amber-900 shadow-md'
              : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Zen
          </span>
        </button>
      </div>
    </div>
  );
}
