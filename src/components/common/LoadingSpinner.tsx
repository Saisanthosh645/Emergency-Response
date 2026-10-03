import React from 'react';

// ─────────────────────────────────────────────
// Shared mini spinner variants used site-wide
// ─────────────────────────────────────────────

type SpinnerVariant = 'pulse' | 'radar' | 'ecg' | 'dots' | 'helix';

interface LoadingSpinnerProps {
  variant?: SpinnerVariant;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = 'radar',
  size = 'md',
  label,
  className = '',
}) => {
  const sizeMap = { sm: 28, md: 44, lg: 72 };
  const px = sizeMap[size];

  if (variant === 'radar') {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
        <div style={{ width: px, height: px }} className="relative flex items-center justify-center">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="absolute inset-0 rounded-full border border-red-500/60 animate-ping"
              style={{ animationDelay: `${i * 0.4}s`, animationDuration: '1.6s' }}
            />
          ))}
          <span className="w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500/60 z-10" />
        </div>
        {label && <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">{label}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
        <div style={{ width: px, height: px }} className="relative flex items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-red-600/20 animate-ping" style={{ animationDuration: '1s' }} />
          <span className="w-3/5 h-3/5 rounded-full bg-gradient-to-br from-red-500 to-rose-600 shadow-xl shadow-red-500/50 animate-pulse" />
        </div>
        {label && <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">{label}</span>}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        {label && <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">{label}</span>}
      </div>
    );
  }

  if (variant === 'ecg') {
    // ECG line animation via SVG stroke-dashoffset
    return (
      <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
        <svg
          width={px * 2.5}
          height={px * 0.7}
          viewBox="0 0 110 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <polyline
            points="0,15 20,15 25,5 30,25 35,2 40,28 45,15 110,15"
            stroke="#f87171"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="160"
            strokeDashoffset="160"
            className="ecg-animate"
          />
          <style>{`
            .ecg-animate {
              animation: ecg-draw 1.8s ease-in-out infinite;
            }
            @keyframes ecg-draw {
              0%   { stroke-dashoffset: 160; opacity: 1; }
              60%  { stroke-dashoffset: 0;   opacity: 1; }
              80%  { stroke-dashoffset: 0;   opacity: 0.7; }
              100% { stroke-dashoffset: 160; opacity: 0; }
            }
          `}</style>
        </svg>
        {label && <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">{label}</span>}
      </div>
    );
  }

  if (variant === 'helix') {
    // Double helix DNA-style spinner using CSS
    return (
      <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
        <div style={{ width: px, height: px }} className="relative">
          <style>{`
            @keyframes helix-a { 0%,100%{transform:translateX(-4px) scaleX(1)} 50%{transform:translateX(4px) scaleX(-1)} }
            @keyframes helix-b { 0%,100%{transform:translateX(4px) scaleX(-1)} 50%{transform:translateX(-4px) scaleX(1)} }
            .hx-a { animation: helix-a 1.2s ease-in-out infinite; }
            .hx-b { animation: helix-b 1.2s ease-in-out infinite; }
          `}</style>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 flex gap-1"
              style={{ top: `${i * 18}%`, transform: 'translateX(-50%)', animationDelay: `${i * 0.1}s` }}
            >
              <span className="hx-a w-2 h-2 rounded-full bg-red-400 shadow-sm shadow-red-400/40" style={{ animationDelay: `${i * 0.12}s` }} />
              <span className="hx-b w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/40" style={{ animationDelay: `${i * 0.12}s` }} />
            </div>
          ))}
        </div>
        {label && <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">{label}</span>}
      </div>
    );
  }

  return null;
};
