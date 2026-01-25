import { useState, useRef, useEffect } from 'react';

export default function GuessInput({ onGuess, disabled = false, error = null }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  // Auto-focus on mount and when re-enabled
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled || !value.trim()) return;

    const result = await onGuess(value);
    if (result?.success) {
      setValue('');
    }
  };

  const handleChange = (e) => {
    // Only allow letters, convert to uppercase
    const newValue = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
    // Limit to 5 characters
    setValue(newValue.slice(0, 5));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && value.length === 5) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Enter a 5-letter word"
            maxLength={5}
            aria-label="Enter your guess"
            aria-describedby={error ? 'guess-error' : undefined}
            aria-invalid={error ? 'true' : 'false'}
            className={`
              flex-1 px-4 py-3 text-lg font-bold tracking-widest uppercase text-center
              bg-white/90 border-2 rounded-xl shadow-inner
              placeholder:text-gray-400 placeholder:font-normal placeholder:tracking-normal placeholder:normal-case
              focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400
              disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
              transition-all duration-200
              ${error ? 'border-red-300 bg-red-50' : 'border-amber-200'}
            `}
          />
          <button
            type="submit"
            disabled={disabled || value.length !== 5}
            aria-label="Submit guess"
            className={`
              px-6 py-3 rounded-xl font-semibold text-white
              shadow-md hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md
              transition-all duration-200
              ${value.length === 5 && !disabled
                ? 'bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500'
                : 'bg-gray-300'
              }
            `}
          >
            Guess
          </button>
        </div>
        {error && (
          <p
            id="guess-error"
            className="text-red-600 text-sm font-medium px-1"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
