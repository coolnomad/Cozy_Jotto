import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'cozyjotto:music';
const DEFAULT_TRACK = 'audio/A Cup Of Coffee_DJ Okawari_Libyus Music Sound History 2004-2010.mp3';

const getInitialState = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return localStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
};

export default function MusicToggle() {
  const audioRef = useRef(null);
  const [isOn, setIsOn] = useState(getInitialState);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, isOn ? 'on' : 'off');
    } catch {
      // Ignore storage errors (private mode, etc.)
    }
  }, [isOn]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.4;

    if (isOn) {
      if (audio.readyState === 0) {
        audio.load();
      }
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isOn]);

  const handleToggle = () => {
    setIsOn((prev) => {
      const next = !prev;
      const audio = audioRef.current;
      if (audio) {
        audio.loop = true;
        audio.volume = 0.4;
        if (next) {
          if (audio.readyState === 0) {
            audio.load();
          }
          audio.play().catch(() => {});
        } else {
          audio.pause();
        }
      }
      return next;
    });
  };

  const label = isOn ? 'Music on' : 'Music off';
  const baseUrl = import.meta.env.BASE_URL || '/';
  const src = encodeURI(`${baseUrl}${DEFAULT_TRACK}`);

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={handleToggle}
        className="px-3 py-1.5 text-xs sm:text-sm font-medium text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-full border border-amber-200 transition-colors"
        aria-label="Toggle music"
      >
        {label}
      </button>
      <audio ref={audioRef} src={src} preload="auto" />
    </div>
  );
}
