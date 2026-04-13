import React, { useEffect, useRef, useState } from 'react';
import HammerNailsLoader from './HammerNailsLoader';

/**
 * Construction-themed preloader with a looping hammer + nail animation.
 * - Uses window "load" event when available
 * - Fades out smoothly and unmounts after transition
 * - Optional percentage indicator (default on)
 */
export default function Preloader({
  enabled = true,
  showProgress = true,
  minVisibleMs = 700,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(enabled);
  const [progress, setProgress] = useState(0);
  const mountTimeRef = useRef(Date.now());

  useEffect(() => {
    setShouldRender(enabled);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    if (!shouldRender) return;

    let progressTimer;
    if (showProgress) {
      progressTimer = window.setInterval(() => {
        setProgress((p) => {
          if (isLoaded) return 100;
          const next = p + Math.max(1, Math.round((96 - p) / 10));
          return Math.min(next, 96);
        });
      }, 140);
    }

    const finish = () => setIsLoaded(true);

    // If the page is already loaded (fast cache), don’t wait for an event.
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });

    return () => {
      window.removeEventListener('load', finish);
      if (progressTimer) window.clearInterval(progressTimer);
    };
  }, [enabled, showProgress, isLoaded, shouldRender]);

  useEffect(() => {
    if (!enabled) return;
    if (!isLoaded) return;

    setProgress(100);

    const elapsed = Date.now() - mountTimeRef.current;
    const waitMs = Math.max(0, minVisibleMs - elapsed);

    const t = window.setTimeout(() => setIsFadingOut(true), waitMs);
    return () => window.clearTimeout(t);
  }, [enabled, isLoaded, minVisibleMs]);

  if (!enabled || !shouldRender) return null;

  return (
    <div
      className={[
        'fixed inset-0 z-[9999] grid place-items-center',
        'bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900',
        'text-white',
        'transition-opacity duration-500 ease-out',
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100',
      ].join(' ')}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      onTransitionEnd={(e) => {
        if (e.propertyName !== 'opacity') return;
        if (!isFadingOut) return;
        setShouldRender(false);
      }}
    >
      <div className="w-[min(560px,calc(100vw-48px))] rounded-[28px] border border-white/10 bg-white/5 p-7 shadow-[0_18px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[18px] font-black tracking-[0.22em]">ELITE</span>
          <span className="text-[10px] font-extrabold tracking-[0.35em] text-white/70">
            CONSTRUCTION
          </span>
        </div>

        <div className="mt-5 flex justify-center">
          <HammerNailsLoader className="select-none" />
        </div>

        <div className="mt-4 grid gap-3">
          <div className="text-center font-bold text-white/85">
            Building your experience…
          </div>

          {showProgress && (
            <div className="flex items-center gap-3">
              <div className="h-2.5 flex-1 overflow-hidden rounded-full border border-white/10 bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-[width] duration-200 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="w-12 text-right text-sm font-black tracking-wider text-white/90">
                {progress}%
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

