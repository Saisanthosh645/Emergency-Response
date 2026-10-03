import React from 'react';
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
  LogOut
} from 'lucide-react';

export const Navbar: React.FC<{ onShowLanding: () => void; isLanding: boolean }> = ({ onShowLanding, isLanding }) => {
  const { 
    activeRole, 
    setActiveRole, 
    currentLanguage, 
    setLanguage, 
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

      {/* Right Controls: Language, Offline Toggle, PWA Install */}
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

        {/* Multilingual Selector */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <Globe className="w-3 h-3 text-slate-400 ml-1.5 mr-1" />
          {(['en', 'hi', 'te', 'mr'] as Language[]).map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold uppercase transition ${
                currentLanguage === lang 
                  ? 'bg-red-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिन्दी' : lang === 'te' ? 'తెలుగు' : 'मराठी'}
            </button>
          ))}
        </div>

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
