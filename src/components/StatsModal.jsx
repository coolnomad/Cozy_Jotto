import { useState, useEffect, useRef } from 'react';

export default function StatsModal({ isOpen, onClose, stats, getWinPercentage }) {
  const [activeTab, setActiveTab] = useState('daily');
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap and prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const currentStats = stats[activeTab];
  const winPercentage = getWinPercentage(activeTab);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-enter"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto modal-content-enter"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 id="stats-title" className="text-2xl font-serif font-bold text-amber-900">
              Statistics
            </h2>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tab selector */}
          <div className="flex gap-2 mb-6" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'daily'}
              onClick={() => setActiveTab('daily')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'daily'
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Daily
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'zen'}
              onClick={() => setActiveTab('zen')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'zen'
                  ? 'bg-orange-100 text-orange-900'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Zen
            </button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <StatBox label="Played" value={currentStats.gamesPlayed} />
            <StatBox label="Win %" value={`${winPercentage}%`} />
            {activeTab === 'daily' && (
              <>
                <StatBox label="Current Streak" value={currentStats.currentStreak} />
                <StatBox label="Max Streak" value={currentStats.maxStreak} />
              </>
            )}
            <StatBox
              label="Avg Guesses"
              value={currentStats.averageGuesses ? currentStats.averageGuesses.toFixed(1) : '-'}
            />
            <StatBox label="Won" value={currentStats.gamesWon} />
          </div>

          {/* Guess distribution */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Guess Distribution</h3>
            <GuessDistribution distribution={currentStats.guessDistribution} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="bg-amber-50 rounded-xl p-4 text-center">
      <div className="text-2xl font-bold text-amber-900">{value}</div>
      <div className="text-sm text-amber-700">{label}</div>
    </div>
  );
}

function GuessDistribution({ distribution }) {
  const maxValue = Math.max(...Object.values(distribution), 1);

  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9 ,10].map(num => {
        const value = distribution[num] || 0;
        const percentage = (value / maxValue) * 100;

        return (
          <div key={num} className="flex items-center gap-2">
            <span className="w-4 text-sm text-gray-600 text-right">{num}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-end px-2 transition-all duration-500"
                style={{ width: `${Math.max(percentage, value > 0 ? 10 : 0)}%` }}
              >
                {value > 0 && (
                  <span className="text-xs font-bold text-white">{value}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
