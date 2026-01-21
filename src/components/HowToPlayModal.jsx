import { useEffect, useRef } from 'react';

export default function HowToPlayModal({ isOpen, onClose }) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-enter"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-play-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto modal-content-enter"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 id="how-to-play-title" className="text-2xl font-serif font-bold text-amber-900">
              How to Play
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

          <div className="space-y-6 text-gray-700">
            <p>
              Guess the 5-letter word in 6 tries. Each guess shows how many unique letters match the hidden word.
            </p>

            <div className="bg-amber-50 rounded-xl p-4">
              <h3 className="font-semibold text-amber-900 mb-3">Example</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-bold tracking-widest bg-white px-3 py-1 rounded-lg">
                    CRANE
                  </span>
                  <span className="text-amber-700 font-medium">2/5</span>
                </div>
                <p className="text-sm text-amber-800">
                  This means 2 letters from your guess appear in the hidden word.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-amber-900">Matching Rules</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Letter position doesn't matter - just count matches</li>
                <li>Duplicate letters only count once per unique letter</li>
                <li>If the word is APPLE and you guess LLAMA, you get 2 matches (L and A)</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-amber-900">Game Modes</h3>
              <div className="grid gap-3">
                <div className="bg-amber-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 font-medium text-amber-900">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Daily
                  </div>
                  <p className="text-sm text-amber-700 mt-1">
                    One puzzle per day, same word for everyone. Tracks your streak!
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 font-medium text-orange-900">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Zen
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    Unlimited practice games. Perfect for honing your skills!
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-amber-600 font-medium">
              Good luck! ☕
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
