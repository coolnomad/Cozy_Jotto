import { useState, useCallback } from 'react';
import { ToastProvider } from './components/Toast';
import ModeSelector from './components/ModeSelector';
import GameBoard from './components/GameBoard';
import HowToPlayModal from './components/HowToPlayModal';
import StatsModal from './components/StatsModal';
import MusicToggle from './components/MusicToggle';
import ScratchpadKeyboard from './components/ScratchpadKeyboard';
import { useGameState } from './hooks/useGameState';
import { useStats } from './hooks/useStats';

function AppContent() {
  const [mode, setMode] = useState('daily');
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const { stats, updateStats, getWinPercentage } = useStats();

  const handleGameComplete = useCallback((isWon, guessCount) => {
    updateStats(mode, isWon, guessCount);
  }, [mode, updateStats]);

  const {
    gameState,
    makeGuess,
    resetGame,
    switchMode,
    hasPlayedToday,
    maxGuesses,
    cycleScratchpad,
  } = useGameState(mode, handleGameComplete);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    switchMode(newMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/60 to-rose-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-lg border-b border-amber-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowHowToPlay(true)}
              className="p-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-lg transition-colors"
              aria-label="How to play"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 tracking-tight">
              Cozy Jotto
            </h1>

            <div className="flex items-center gap-2">
              <MusicToggle />
              <button
                onClick={() => setShowStats(true)}
                className="p-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-lg transition-colors"
                aria-label="View statistics"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Mode selector */}
          <ModeSelector
            mode={mode}
            onModeChange={handleModeChange}
          />

          {/* Game card */}
          <div
            id="game-panel"
            role="tabpanel"
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-amber-100 p-6 sm:p-8"
          >
            <GameBoard
              gameState={gameState}
              onGuess={makeGuess}
              onNewGame={resetGame}
              maxGuesses={maxGuesses}
              mode={mode}
              hasPlayedToday={hasPlayedToday()}
            />
          </div>

          <ScratchpadKeyboard
            keyStates={gameState.scratchpad || {}}
            onCycle={cycleScratchpad}
          />

          {/* Coffee decoration */}
          <div className="text-center text-amber-300 select-none" aria-hidden="true">
            ☕ ☕ ☕
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-amber-600 text-sm px-4">
        <p className="max-w-3xl mx-auto">A cozy word game for your morning ritual</p>
      </footer>

      {/* Modals */}
      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        stats={stats}
        getWinPercentage={getWinPercentage}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
