import { useState } from 'react';
import { generateShareText, copyToClipboard } from '../utils/shareText';
import { useToast } from './Toast';

export default function ShareButton({ guesses, isWon, dateString, mode }) {
  const [copying, setCopying] = useState(false);
  const { addToast } = useToast();

  const handleShare = async () => {
    if (copying) return;

    setCopying(true);
    const shareText = generateShareText(guesses, isWon, dateString, mode);

    const success = await copyToClipboard(shareText);

    if (success) {
      addToast('Copied to clipboard!', 'success');
    } else {
      addToast('Failed to copy. Try again!', 'error');
    }

    setCopying(false);
  };

  return (
    <button
      onClick={handleShare}
      disabled={copying}
      className={`
        flex items-center gap-2 px-6 py-3
        bg-gradient-to-r from-green-500 to-emerald-500
        hover:from-green-600 hover:to-emerald-600
        text-white font-semibold rounded-xl
        shadow-md hover:shadow-lg
        transition-all duration-200
        disabled:opacity-70 disabled:cursor-wait
      `}
      aria-label="Share your results"
    >
      {copying ? (
        <>
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Copying...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Results
        </>
      )}
    </button>
  );
}
