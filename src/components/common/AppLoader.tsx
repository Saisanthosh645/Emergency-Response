import React, { useEffect, useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// AppLoader — Full-screen cinematic splash shown on first app boot
// Shows an animated emergency radar grid scan with live status lines,
// then fades out and calls onComplete() once the sequence finishes.
// ─────────────────────────────────────────────────────────────────────────────

interface AppLoaderProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { label: 'INITIALIZING PULSEGRID CORE ENGINE', delay: 0 },
  { label: 'LOADING HYDERABAD EMERGENCY GRID DATA', delay: 300 },
  { label: 'CONNECTING TO 108 ALS DISPATCH NETWORK', delay: 600 },
  { label: 'SYNCING REAL-TIME ICU BED INVENTORY', delay: 900 },
  { label: 'ACTIVATING GEMINI AI TRIAGE MODULE', delay: 1200 },
  { label: 'DPDP 2023 CRYPTOGRAPHIC KEYS VERIFIED', delay: 1500 },
  { label: 'MULTILINGUAL NEURAL LAYER ONLINE', delay: 1800 },
  { label: 'ALL SYSTEMS OPERATIONAL — LAUNCHING', delay: 2100 },
];

export const AppLoader: React.FC<AppLoaderProps> = ({ onComplete }) => {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reveal boot lines one by one
    BOOT_LINES.forEach((line, idx) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, idx]);
        setProgress(Math.round(((idx + 1) / BOOT_LINES.length) * 100));
      }, line.delay);
    });

    // Start fade out after all lines shown
    const fadeTimer = setTimeout(() => setIsFading(true), 2500);

    // Notify parent after fade completes
    const doneTimer = setTimeout(() => onComplete(), 3100);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#04060e] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-600/5 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-rose-500/8 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Radar rings */}
      <div className="relative flex items-center justify-center mb-10">
        {[120, 90, 60, 36].map((size, i) => (
          <span
            key={i}
            className="absolute rounded-full border border-red-500/25 animate-ping"
            style={{
              width: size,
              height: size,
              animationDuration: `${2 + i * 0.5}s`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

        {/* Center icon */}
        <div className="relative z-10 w-16 h-16 rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 flex items-center justify-center shadow-2xl shadow-red-600/50">
          {/* Heartbeat SVG icon */}
          <svg width="34" height="24" viewBox="0 0 34 24" fill="none" className="text-white">
            <polyline
              points="0,12 6,12 9,4 12,20 15,1 18,23 21,12 34,12"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="90"
              strokeDashoffset="90"
              style={{ animation: 'ecg-boot 1.5s ease-in-out infinite' }}
            />
            <style>{`
              @keyframes ecg-boot {
                0%   { stroke-dashoffset: 90; opacity:1; }
                55%  { stroke-dashoffset: 0;  opacity:1; }
                80%  { stroke-dashoffset: 0;  opacity:0.6; }
                100% { stroke-dashoffset: 90; opacity:0; }
              }
            `}</style>
          </svg>
          {/* Animated corner blink */}
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#04060e] animate-pulse" />
        </div>
      </div>

      {/* Brand */}
      <div className="text-center mb-8">
        <div className="text-2xl font-black text-white tracking-tight font-sans">
          Lifeline <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">India</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 tracking-[0.3em] uppercase mt-1">
          Hyderabad Hyperlocal Emergency Grid
        </div>
      </div>

      {/* Boot log terminal */}
      <div className="w-full max-w-sm mx-4 bg-slate-950/80 border border-slate-800/60 rounded-2xl p-4 font-mono text-[10px] space-y-1.5 mb-6 min-h-[130px]">
        {BOOT_LINES.map((line, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 transition-all duration-300 ${
              visibleLines.includes(idx) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                idx === BOOT_LINES.length - 1 && visibleLines.includes(idx)
                  ? 'bg-emerald-400 animate-pulse'
                  : visibleLines.includes(idx)
                  ? 'bg-cyan-400'
                  : 'bg-slate-700'
              }`}
            />
            <span
              className={
                idx === BOOT_LINES.length - 1 && visibleLines.includes(idx)
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400'
              }
            >
              {line.label}
            </span>
            {visibleLines.includes(idx) && idx < BOOT_LINES.length - 1 && (
              <span className="text-emerald-500 ml-auto">OK</span>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm mx-4">
        <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full transition-all duration-300 ease-out shadow-lg shadow-red-500/30"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-[9px] font-mono text-slate-500">
          <span>BOOT SEQUENCE</span>
          <span className="text-red-400 font-bold">{progress}%</span>
        </div>
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
          style={{ animation: 'scan-line 3s linear infinite' }}
        />
      </div>

      <style>{`
        @keyframes scan-line {
          0%   { top: 0%; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
