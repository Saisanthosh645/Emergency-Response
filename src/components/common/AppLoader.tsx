import React, { useEffect, useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// AppLoader — Minimal cinematic splash. Clean, fast, 1.8s total.
// ─────────────────────────────────────────────────────────────────────────────

interface AppLoaderProps {
  onComplete: () => void;
}

export const AppLoader: React.FC<AppLoaderProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0); // 0 = enter, 1 = progress, 2 = fade
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar quickly
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 5;
      });
    }, 40);

    // Start fade
    const fadeTimer = setTimeout(() => setStep(2), 1600);
    // Done
    const doneTimer = setTimeout(() => onComplete(), 2100);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#04060e] flex flex-col items-center justify-center gap-8 transition-opacity duration-600 ${
        step === 2 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Radar rings */}
      <div className="relative flex items-center justify-center">
        {[96, 66, 42].map((size, i) => (
          <span
            key={i}
            className="absolute rounded-full border border-red-500/30 animate-ping"
            style={{ width: size, height: size, animationDuration: `${1.6 + i * 0.4}s`, animationDelay: `${i * 0.3}s` }}
          />
        ))}

        {/* Logo center */}
        <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-2xl shadow-red-600/40">
          <svg width="28" height="20" viewBox="0 0 34 22" fill="none">
            <polyline
              points="0,11 7,11 10,3 13,19 16,0 19,21 22,11 34,11"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="90"
              strokeDashoffset="90"
              style={{ animation: 'ecg-splash 1.4s ease-in-out infinite' }}
            />
            <style>{`
              @keyframes ecg-splash {
                0%   { stroke-dashoffset: 90; opacity: 1; }
                55%  { stroke-dashoffset: 0;  opacity: 1; }
                85%  { stroke-dashoffset: 0;  opacity: 0.5; }
                100% { stroke-dashoffset: 90; opacity: 0; }
              }
            `}</style>
          </svg>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#04060e] animate-pulse" />
        </div>
      </div>

      {/* Brand name */}
      <div className="text-center">
        <div className="text-xl font-black text-white tracking-tight">
          Lifeline <span className="bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">India</span>
        </div>
        <div className="text-[10px] font-mono text-slate-500 tracking-[0.25em] uppercase mt-1">
          Hyderabad Emergency Grid
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-48">
        <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
