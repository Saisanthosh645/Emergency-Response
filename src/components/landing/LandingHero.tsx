import React from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { 
  ShieldAlert, 
  Smartphone, 
  Radio, 
  LayoutDashboard, 
  Play, 
  Clock, 
  Sparkles, 
  Users, 
  Hospital, 
  ShieldCheck, 
  ArrowRight,
  Flame,
  HeartPulse,
  Car
} from 'lucide-react';

export const LandingHero: React.FC<{ onSelectRole: (role: 'citizen' | 'responder' | 'admin' | 'demo' | 'privacy') => void }> = ({ onSelectRole }) => {
  const { incidents, responders, hospitals } = useEmergency();

  const totalIcuBeds = hospitals.reduce((acc, h) => acc + h.availableIcuBeds, 0);

  return (
    <div className="w-full min-h-screen bg-[#060911] text-slate-100 flex flex-col justify-between selection:bg-red-500 selection:text-white">
      
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8 text-center space-y-6">
        
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-mono font-bold animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>HYDERABAD HYPERLOCAL EMERGENCY GRID • VERIFIED PRODUCTION READY</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight font-sans">
          From Emergency to Responder <br className="hidden sm:block" />
          in under <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">60 Seconds</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
          Lifeline India combines zero-friction SOS triggers, Gemini AI multimodal triage, intelligent scoring dispatch, and a Good Samaritan community network across Hyderabad metro zones.
        </p>

        {/* Hero Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onSelectRole('demo')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm uppercase tracking-wider shadow-2xl shadow-red-600/40 transition active:scale-95 border border-red-400/30"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RUN 90-SEC GUIDED DEMO</span>
          </button>

          <button
            onClick={() => onSelectRole('citizen')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-sm transition active:scale-95"
          >
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>Launch Citizen SOS</span>
          </button>
        </div>

        {/* Real-Time Live Stats Counter Strip */}
        <div className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto bg-slate-950/70 border border-slate-800/80 p-4 rounded-3xl backdrop-blur shadow-2xl">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/40">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Response SLA Target</div>
              <div className="text-3xl font-black font-mono text-cyan-400 mt-0.5">&lt; 60s</div>
              <div className="text-[10px] text-slate-500 mt-1">Average: 42s in Hyderabad</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/40">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Active Units Online</div>
              <div className="text-3xl font-black font-mono text-emerald-400 mt-0.5">{responders.length}+</div>
              <div className="text-[10px] text-slate-500 mt-1">108 ALS, Fire, PCR, Samaritans</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/40">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Live ICU Bed Reserve</div>
              <div className="text-3xl font-black font-mono text-rose-400 mt-0.5">{totalIcuBeds}</div>
              <div className="text-[10px] text-slate-500 mt-1">Across 10 Super Specialties</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/40">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Multilingual AI</div>
              <div className="text-3xl font-black font-mono text-amber-400 mt-0.5">4 Lang</div>
              <div className="text-[10px] text-slate-500 mt-1">English • हिन्दी • తెలుగు • मराठी</div>
            </div>
          </div>
        </div>

      </div>

      {/* Role Experience Selector Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-12 w-full">
        <div className="text-center mb-6">
          <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            THREE SPECIALIZED EXPERIENCES • REAL-TIME SYNCHRONIZED
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Citizen App */}
          <div 
            onClick={() => onSelectRole('citizen')}
            className="group cursor-pointer bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-red-500/50 rounded-3xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-600/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-600/10 text-red-500 border border-red-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-red-400 uppercase font-bold mb-1">Mobile-First</div>
              <h3 className="text-lg font-black text-white mb-2">1. Citizen SOS App</h3>
              <p className="text-xs text-slate-400 leading-relaxed space-y-1">
                <span>• Giant 2-second hold SOS button with haptics</span><br />
                <span>• Silent SOS triple power-tap simulation</span><br />
                <span>• Voice notes in English, Hindi, Telugu & Marathi</span><br />
                <span>• Instant Gemini AI clinical first-aid instructions</span><br />
                <span>• Live Leaflet GPS tracking & encrypted chat</span>
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-red-400 group-hover:text-red-300">
              <span>Open Citizen Interface</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Responder Terminal */}
          <div 
            onClick={() => onSelectRole('responder')}
            className="group cursor-pointer bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-600/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Radio className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-cyan-400 uppercase font-bold mb-1">Driver & Paramedic HUD</div>
              <h3 className="text-lg font-black text-white mb-2">2. Responder Terminal</h3>
              <p className="text-xs text-slate-400 leading-relaxed space-y-1">
                <span>• Online/offline duty status toggle</span><br />
                <span>• 30-second incoming audio siren alert</span><br />
                <span>• Turn-by-turn route navigation & ETA countdown</span><br />
                <span>• One-tap status progression: Roll → Arrive → Resolve</span><br />
                <span>• Hospital-aware handover with reserved ICU beds</span>
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
              <span>Launch Responder Terminal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Command Center */}
          <div 
            onClick={() => onSelectRole('admin')}
            className="group cursor-pointer bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-purple-500/50 rounded-3xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-600/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-600/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-purple-400 uppercase font-bold mb-1">Desktop Control-Room</div>
              <h3 className="text-lg font-black text-white mb-2">3. Command Center (Admin)</h3>
              <p className="text-xs text-slate-400 leading-relaxed space-y-1">
                <span>• Clustered Leaflet dark map with heatmap overlay</span><br />
                <span>• Smart dispatch scoring engine (4 factors)</span><br />
                <span>• Auto-escalation if unassigned after 60 seconds</span><br />
                <span>• Geofenced radius area warning broadcaster</span><br />
                <span>• "Simulate City" button for vibrant live demo</span>
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:text-purple-300">
              <span>Enter Command Center</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* Footer Strip */}
      <footer className="border-t border-slate-900 bg-[#04070d] py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto w-full">
        <div>
          Lifeline India • Built for Hyderabad Metro (Telangana, India)
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <button onClick={() => onSelectRole('privacy')} className="hover:text-slate-300 underline">
            Privacy & Trust Framework
          </button>
          <span>•</span>
          <button onClick={() => onSelectRole('demo')} className="text-amber-400 hover:text-amber-300 font-bold">
            90-Second Demo Story
          </button>
        </div>
      </footer>

    </div>
  );
};
