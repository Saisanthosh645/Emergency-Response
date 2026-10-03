import React from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { sound } from '../../utils/audio';
import { 
  Lock, 
  LogIn, 
  ShieldAlert, 
  Smartphone, 
  Radio, 
  LayoutDashboard, 
  ShieldCheck, 
  ArrowRight,
  Globe
} from 'lucide-react';
import { Language } from '../../utils/i18n';

export const TemporaryLoggedOutScreen: React.FC = () => {
  const { 
    setTemporarilyLoggedOut, 
    setActiveRole, 
    currentLanguage, 
    setLanguage 
  } = useEmergency();

  const handleLogin = (role?: 'citizen' | 'responder' | 'admin') => {
    sound.playSuccessChime();
    if (role) {
      setActiveRole(role);
    }
    setTemporarilyLoggedOut(false);
  };

  const titles: Record<Language, { heading: string; sub: string; resume: string; prompt: string }> = {
    en: {
      heading: 'Temporarily Logged Out',
      sub: 'Session paused for privacy & data compliance (DPDP Act 2023). All sensitive records remain encrypted.',
      resume: 'Log In / Resume Session',
      prompt: 'Select your role to resume operations immediately:'
    },
    hi: {
      heading: 'अस्थायी रूप से लॉग आउट',
      sub: 'गोपनीयता और डेटा सुरक्षा (DPDP अधिनियम 2023) के लिए सत्र रोका गया है। आपका डेटा सुरक्षित है।',
      resume: 'पुनः लॉगिन करें / सत्र जारी रखें',
      prompt: 'तुरंत सत्र जारी रखने के लिए अपनी भूमिका चुनें:'
    },
    te: {
      heading: 'తాత్కాలికంగా లాగ్ అవుట్ అయ్యారు',
      sub: 'గోప్యతా చట్టం (DPDP Act 2023) ప్రకారం సెషన్ తాత్కాలికంగా పాజ్ చేయబడింది. మీ సమాచారం సురక్షితం.',
      resume: 'తిరిగి లాగిన్ అవ్వండి',
      prompt: 'వెంటనే ప్లాట్‌ఫారమ్‌ను ఉపయోగించడానికి మీ పాత్రను ఎంచుకోండి:'
    },
    mr: {
      heading: 'तात्पुरते लॉग आउट झाले',
      sub: 'डेटा गोपनीयता (DPDP कायदा २०२३) अंतर्गत सत्र तात्पुरते थांबवले आहे. सर्व डेटा कूटबद्ध आहे.',
      resume: 'पुन्हा लॉगिन करा / सत्र सुरू करा',
      prompt: 'त्वरित सुरू करण्यासाठी आपली भूमिका निवडा:'
    }
  };

  const t = titles[currentLanguage] || titles.en;

  return (
    <div className="min-h-screen w-full bg-radial from-[#131b2e] via-[#090d16] to-[#04060a] text-white flex flex-col justify-between p-4 sm:p-8 select-none relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-4xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-red-600/40">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-black tracking-tight text-white uppercase font-sans">
              PULSE<span className="text-red-500">GRID</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Greater Hyderabad Emergency Grid
            </div>
          </div>
        </div>

        {/* Language selector in lock screen */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs">
          <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
          {([
            { code: 'en', label: 'EN' },
            { code: 'hi', label: 'हिन्दी' },
            { code: 'te', label: 'తెలుగు' },
            { code: 'mr', label: 'मराठी' }
          ] as const).map(l => (
            <button
              key={l.code}
              onClick={() => {
                sound.playButtonTap();
                setLanguage(l.code as Language);
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                currentLanguage === l.code
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Lock Card */}
      <main className="relative z-10 max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-[#0b101d]/90 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 flex flex-col items-center text-center">
          
          {/* Animated Lock Icon */}
          <div className="relative mb-5">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
              <Lock className="w-8 h-8" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0b101d]" />
          </div>

          {/* Heading */}
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2 font-sans">
            {t.heading}
          </h1>

          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            {t.sub}
          </p>

          {/* User Profile Snapshot */}
          <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3 mb-6 text-left">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
              alt="Sai Santhosh"
              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-700 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">Sai Santhosh</div>
              <div className="text-[11px] text-slate-400 font-mono truncate">raminisaisanthosh@gmail.com</div>
              <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Verified Citizen • Hyderabad Metro</span>
              </div>
            </div>
          </div>

          {/* Primary 1-Click Login Button */}
          <button
            onClick={() => handleLogin()}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl shadow-red-600/30 active:scale-[0.98] transition flex items-center justify-center gap-2 group mb-4"
          >
            <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            <span>{t.resume}</span>
            <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition" />
          </button>

          {/* Role Choice Divider */}
          <div className="w-full border-t border-slate-800/80 my-2 pt-4">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2.5">
              {t.prompt}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleLogin('citizen')}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-red-500/40 text-[11px] font-semibold text-slate-300 hover:text-white flex flex-col items-center gap-1 transition active:scale-95"
              >
                <Smartphone className="w-4 h-4 text-red-400" />
                <span>Citizen</span>
              </button>

              <button
                onClick={() => handleLogin('responder')}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-[11px] font-semibold text-slate-300 hover:text-white flex flex-col items-center gap-1 transition active:scale-95"
              >
                <Radio className="w-4 h-4 text-amber-400" />
                <span>Responder</span>
              </button>

              <button
                onClick={() => handleLogin('admin')}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 text-[11px] font-semibold text-slate-300 hover:text-white flex flex-col items-center gap-1 transition active:scale-95"
              >
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                <span>Command</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Security Badges */}
      <footer className="relative z-10 max-w-md w-full mx-auto text-center py-2">
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>DPDP Act 2023 Compliant • Ephemeral Session Lock</span>
        </div>
      </footer>

    </div>
  );
};
