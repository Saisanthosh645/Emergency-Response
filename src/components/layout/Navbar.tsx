import React, { useState, useRef, useEffect } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { TRANSLATIONS, Language } from '../../utils/i18n';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { 
  ShieldAlert, 
  Smartphone, 
  Radio, 
  LayoutDashboard, 
  Play, 
  ShieldCheck, 
  Globe, 
  Wifi, 
  WifiOff,
  LogOut,
  ChevronDown,
  Check
} from 'lucide-react';

// ─── Language metadata ────────────────────────────────────────────────────────
const LANGUAGES: { code: Language; label: string; native: string; flag: string }[] = [
  { code: 'en', label: 'English',  native: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi',    native: 'हिन्दी',   flag: '🇮🇳' },
  { code: 'te', label: 'Telugu',   native: 'తెలుగు',   flag: '🏛️' },
  { code: 'mr', label: 'Marathi',  native: 'मराठी',   flag: '🟠' },
];

// ─── Language Dropdown ────────────────────────────────────────────────────────
const LanguagePicker: React.FC = () => {
  const { currentLanguage, setLanguage } = useEmergency();
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find(l => l.code === currentLanguage) ?? LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setOpen(false);
  };

  return (
    <div ref={dropRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-150 ${
          open
            ? 'bg-slate-800 border-slate-600 text-white'
            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
        }`}
        title="Change language"
      >
        <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="hidden sm:inline font-medium">{current.native}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 z-[9000] w-44 bg-[#0c1120] border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-3 py-2 border-b border-slate-800 flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase">Language</span>
          </div>

          {/* Options */}
          <div className="p-1.5 space-y-0.5">
            {LANGUAGES.map(lang => {
              const isActive = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left text-xs transition-all duration-100 ${
                    isActive
                      ? 'bg-red-600/20 border border-red-500/30 text-white'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <div>
                      <div className="font-bold text-[11px]">{lang.native}</div>
                      <div className="text-[9px] text-slate-500 font-mono">{lang.label}</div>
                    </div>
                  </div>
                  {isActive && <Check className="w-3 h-3 text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export const Navbar: React.FC<{ onShowLanding: () => void; isLanding: boolean }> = ({ onShowLanding, isLanding }) => {
  const { 
    activeRole, 
    setActiveRole, 
    currentLanguage,
    isTemporarilyLoggedOut,
    setTemporarilyLoggedOut,
    isOfflineMode, 
    setIsOfflineMode,
    incidents 
  } = useEmergency();

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const activeCount = incidents.filter(i => i.status !== 'Resolved').length;

  return (
    <nav className="sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800 px-4 py-2 flex items-center justify-between">
      {/* Brand & Landing Trigger */}
      <div 
        onClick={onShowLanding}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black tracking-tight text-white uppercase font-sans">
              LIFELINE <span className="text-red-500">INDIA</span>
            </span>
            <span className="text-[9px] bg-red-950/80 text-red-300 font-mono font-bold px-1.5 py-0.2 rounded border border-red-800/60">
              HYDERABAD
            </span>
          </div>
          <div className="text-[9px] text-slate-400 font-mono hidden sm:block">
            Hyperlocal Emergency Response • Under 60s
          </div>
        </div>
      </div>

      {/* Role Switcher Pills */}
      <div className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => { setActiveRole('citizen'); }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition ${
            activeRole === 'citizen' && !isLanding
              ? 'bg-red-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{t.roleCitizen}</span>
        </button>

        <button
          onClick={() => { setActiveRole('responder'); }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition ${
            activeRole === 'responder' && !isLanding
              ? 'bg-red-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>{t.roleResponder}</span>
        </button>

        <button
          onClick={() => { setActiveRole('admin'); }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition relative ${
            activeRole === 'admin' && !isLanding
              ? 'bg-red-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>{t.roleAdmin}</span>
          {activeCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
          )}
        </button>

        <button
          onClick={() => { setActiveRole('demo'); }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition ${
            activeRole === 'demo' && !isLanding
              ? 'bg-amber-600 text-white shadow'
              : 'text-amber-400 hover:text-amber-300'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{t.roleDemo}</span>
        </button>

        <button
          onClick={() => { setActiveRole('privacy'); }}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition ${
            activeRole === 'privacy' && !isLanding
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Trust</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        
        {/* Offline Simulator Button */}
        <button
          onClick={() => setIsOfflineMode(!isOfflineMode)}
          title={isOfflineMode ? 'Disable offline simulation' : 'Simulate low-connectivity offline mode'}
          className={`p-1.5 rounded-lg border text-xs transition ${
            isOfflineMode 
              ? 'bg-rose-950 text-rose-300 border-rose-500 animate-pulse' 
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
          }`}
        >
          {isOfflineMode ? <WifiOff className="w-3.5 h-3.5 text-rose-400" /> : <Wifi className="w-3.5 h-3.5" />}
        </button>

        {/* ── Language Picker Dropdown ── */}
        <LanguagePicker />

        {/* In-App PWA Install */}
        <PWAInstallButton />

        {/* Temporary Logout Button */}
        <button
          onClick={() => {
            setTemporarilyLoggedOut(true);
          }}
          title="Temporarily Log Out"
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-white text-xs font-semibold transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};
