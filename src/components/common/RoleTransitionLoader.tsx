import React, { useEffect, useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// RoleTransitionLoader — Brief overlay shown when switching between roles
// (citizen / responder / admin / demo / privacy)
// ─────────────────────────────────────────────────────────────────────────────

const ROLE_META: Record<string, { label: string; color: string; bg: string; icon: string; sub: string }> = {
  citizen: {
    label: 'Citizen SOS Mode',
    sub: 'Loading emergency dispatch portal…',
    icon: '📱',
    color: 'from-red-600 to-rose-600',
    bg: 'bg-red-500/10 border-red-500/20',
  },
  responder: {
    label: 'Responder Terminal',
    sub: 'Activating field operations HUD…',
    icon: '🚑',
    color: 'from-cyan-600 to-teal-600',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
  },
  admin: {
    label: 'Command Center',
    sub: 'Initializing dispatch AI & heatmap layer…',
    icon: '🛡️',
    color: 'from-purple-600 to-indigo-600',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
  demo: {
    label: '90-Second Demo',
    sub: 'Loading guided walkthrough scenario…',
    icon: '▶️',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  privacy: {
    label: 'Privacy & Trust',
    sub: 'Loading DPDP 2023 compliance view…',
    icon: '🔒',
    color: 'from-emerald-600 to-green-600',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
};

interface RoleTransitionLoaderProps {
  role: string;
  onComplete: () => void;
}

export const RoleTransitionLoader: React.FC<RoleTransitionLoaderProps> = ({ role, onComplete }) => {
  const [isFading, setIsFading] = useState(false);
  const meta = ROLE_META[role] ?? ROLE_META['citizen'];

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFading(true), 700);
    const doneTimer = setTimeout(() => onComplete(), 1100);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9998] bg-[#050810]/95 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Role icon card */}
        <div className={`w-20 h-20 rounded-3xl border ${meta.bg} flex items-center justify-center text-4xl shadow-2xl`}>
          {meta.icon}
        </div>

        {/* Role name */}
        <div className="text-center">
          <div className={`text-xl font-black text-white font-sans bg-gradient-to-r ${meta.color} bg-clip-text text-transparent`}>
            {meta.label}
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1">{meta.sub}</div>
        </div>

        {/* Animated dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3].map(i => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${meta.color} animate-bounce opacity-80`}
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>

        {/* Horizontal scan bar */}
        <div className="w-48 h-0.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${meta.color} rounded-full`}
            style={{ animation: 'role-scan 0.8s ease-out forwards' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes role-scan {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
};
