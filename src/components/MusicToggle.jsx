import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'cozyjotto:music';
const DEFAULT_TRACK = 'audio/A Cup Of Coffee_DJ Okawari_Libyus Music Sound History 2004-2010.mp3';
const TARGET_VOLUME = 0.4;
const FADE_IN_MS = 400;

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
  const fadeRef = useRef(null);
  const [isOn, setIsOn] = useState(getInitialState);

  const startFadeIn = (audio) => {
    if (fadeRef.current) {
      cancelAnimationFrame(fadeRef.current);
    }

    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / FADE_IN_MS, 1);
      audio.volume = TARGET_VOLUME * progress;
      if (progress < 1) {
        fadeRef.current = requestAnimationFrame(tick);
      } else {
        fadeRef.current = null;
      }
    };

    fadeRef.current = requestAnimationFrame(tick);
  };

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
    audio.volume = TARGET_VOLUME;

    if (isOn) {
      if (audio.readyState === 0) {
        audio.load();
      }
      audio.volume = 0;
      audio.play().then(() => startFadeIn(audio)).catch(() => {});
    } else {
      if (fadeRef.current) {
        cancelAnimationFrame(fadeRef.current);
        fadeRef.current = null;
      }
      audio.pause();
    }
  }, [isOn]);

  const handleToggle = () => {
    setIsOn((prev) => {
      const next = !prev;
      const audio = audioRef.current;
      if (audio) {
        audio.loop = true;
        audio.volume = TARGET_VOLUME;
        if (next) {
          if (audio.readyState === 0) {
            audio.load();
          }
          audio.volume = 0;
          audio.play().then(() => startFadeIn(audio)).catch(() => {});
        } else {
          if (fadeRef.current) {
            cancelAnimationFrame(fadeRef.current);
            fadeRef.current = null;
          }
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
