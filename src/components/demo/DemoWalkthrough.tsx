import React, { useState, useEffect } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { TRANSLATIONS } from '../../utils/i18n';
import { sound } from '../../utils/audio';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldAlert, 
  Radio, 
  HeartPulse, 
  Hospital, 
  TrendingUp, 
  MapPin 
} from 'lucide-react';

interface DemoStep {
  title: string;
  subtitle: string;
  role: 'citizen' | 'responder' | 'admin';
  description: string;
  actionLabel: string;
  icon: any;
  durationMs: number;
}

export const DemoWalkthrough: React.FC = () => {
  const { 
    createEmergency, 
    updateIncidentStatus, 
    smartDispatch, 
    setActiveRole, 
    resetToDemo,
    activeIncident,
    currentLanguage
  } = useEmergency();

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const steps: DemoStep[] = [
    {
      title: '1. Citizen Triggers SOS',
      subtitle: 'Road Accident near Cyber Towers Flyover',
      role: 'citizen',
      description: 'Citizen Karthik presses and holds the giant SOS button. High-precision GPS locks in at Cyber Towers, Hitech City with 5-meter accuracy.',
      actionLabel: 'Simulate Citizen SOS Press',
      icon: Radio,
      durationMs: 12000
    },
    {
      title: '2. Gemini AI Triage & First-Aid',
      subtitle: 'Sub-second Clinical Assessment',
      role: 'citizen',
      description: 'Gemini AI evaluates the trauma severity as CRITICAL (96% confidence). It immediately generates 3 step-by-step bleeding control instructions in Marathi/Telugu/Hindi/English and alerts nearby Good Samaritans.',
      actionLabel: 'View AI Triage & First Aid',
      icon: Sparkles,
      durationMs: 12000
    },
    {
      title: '3. Smart Dispatch & Scoring',
      subtitle: 'Optimal Unit Selected in < 5 Seconds',
      role: 'admin',
      description: 'Command Center scoring engine ranks 40+ units: Unit 108-HYD-ALS-01 scores 98/100 based on 1.4km distance, cardiac equipment, and available paramedic crew.',
      actionLabel: 'Authorize Smart Dispatch',
      icon: ShieldAlert,
      durationMs: 12000
    },
    {
      title: '4. Responder Accepts & Rolls',
      subtitle: 'En Route with Real-Time ETA',
      role: 'responder',
      description: 'Paramedic Ravi on unit 108 ALS acknowledges alert on terminal. Siren activated, live turn-by-turn route draws on dark Leaflet map, citizen tracking updates in real-time.',
      actionLabel: 'Responder Rolls En Route',
      icon: HeartPulse,
      durationMs: 14000
    },
    {
      title: '5. Hospital-Aware ICU Reservation',
      subtitle: 'Live Trauma Bed Sync',
      role: 'admin',
      description: 'System automatically queries 10 Hyderabad hospitals and reserves an ICU bay and trauma team at AIG Hospitals (8 available ICU beds), bypassing crowded casualty desks.',
      actionLabel: 'Verify Hospital Handover',
      icon: Hospital,
      durationMs: 12000
    },
    {
      title: '6. On-Scene Arrival & Stabilization',
      subtitle: 'Patient Stabilized & Transferred',
      role: 'responder',
      description: 'Paramedic arrives on scene, applies cervical collar and trauma dressing, transfers patient safely to hospital trauma bay, and marks incident resolved.',
      actionLabel: 'Complete Mission Resolution',
      icon: CheckCircle2,
      durationMs: 14000
    },
    {
      title: '7. Analytics & Situation Report Updated',
      subtitle: 'SLA Recorded: 42s Total Latency',
      role: 'admin',
      description: 'Incident permanently logged to immutable audit ledger. Response time KPI updates to 94.2% SLA compliance and Gemini compiles daily operational SitRep.',
      actionLabel: 'Review Updated Command SitRep',
      icon: TrendingUp,
      durationMs: 14000
    }
  ];

  const currentStep = steps[currentStepIndex];

  // Auto-play timer
  useEffect(() => {
    let interval: any = null;
    let timer: any = null;

    if (isPlaying) {
      const stepDuration = currentStep.durationMs;
      const start = Date.now();

      interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const p = Math.min(100, (elapsed / stepDuration) * 100);
        setProgressPercent(p);
      }, 100);

      timer = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          executeStepAction(currentStepIndex);
          setCurrentStepIndex(prev => prev + 1);
          setProgressPercent(0);
        } else {
          setIsPlaying(false);
          sound.playSuccessChime();
        }
      }, stepDuration);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentStepIndex]);

  const executeStepAction = (idx: number) => {
    sound.playWarningBeep();
    if (idx === 0) {
      // Step 1: Trigger citizen SOS
      setActiveRole('citizen');
      createEmergency({
        type: 'Accident',
        description: 'Two-wheeler and cab collision on Cyber Towers flyover ramp. Heavy bleeding, rider semi-conscious.',
        location: {
          lat: 17.4485,
          lng: 78.3745,
          address: 'Cyber Towers Flyover Ramp, Hitech City, Hyderabad',
          area: 'Hitech City'
        }
      });
    } else if (idx === 1) {
      setActiveRole('citizen');
    } else if (idx === 2) {
      setActiveRole('admin');
      if (activeIncident) smartDispatch(activeIncident.id);
    } else if (idx === 3) {
      setActiveRole('responder');
      if (activeIncident) updateIncidentStatus(activeIncident.id, 'En Route');
    } else if (idx === 4) {
      setActiveRole('admin');
    } else if (idx === 5) {
      setActiveRole('responder');
      if (activeIncident) updateIncidentStatus(activeIncident.id, 'Resolved');
    } else if (idx === 6) {
      setActiveRole('admin');
    }
  };

  const handleNext = () => {
    executeStepAction(currentStepIndex);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setProgressPercent(0);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setProgressPercent(0);
    }
  };

  const handleRestart = () => {
    resetToDemo();
    setCurrentStepIndex(0);
    setProgressPercent(0);
    setIsPlaying(false);
    setActiveRole('citizen');
  };

  return (
    <div className="w-full h-full bg-[#070b14] text-slate-100 overflow-y-auto flex flex-col">
      
      {/* Demo Header */}
      <div className="bg-[#090d16] border-b border-slate-800 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveRole('citizen')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition pr-4 border-r border-slate-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            <span>{t.back}</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <h1 className="text-sm font-black tracking-wide text-white uppercase font-mono">
                90-SECOND HACKATHON LIVE DEMO
              </h1>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {t.fromTo}
            </p>
          </div>
        </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg ${
                isPlaying 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'PAUSE AUTO-RUN' : 'AUTO RUN (90s)'}</span>
            </button>

            <button
              onClick={handleRestart}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Reset Demo Scenario"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Inner content wrapper */}
        <div className="flex-1 p-6 max-w-4xl mx-auto w-full">

        {/* Step Progress Bar */}
        <div className="bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 mb-6">
          <div 
            className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${((currentStepIndex + progressPercent/100) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step Navigator Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-1.5 mb-6">
          {steps.map((st, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentStepIndex(i);
                setProgressPercent(0);
                setActiveRole(st.role);
              }}
              className={`p-2 rounded-xl border text-left transition ${
                currentStepIndex === i 
                  ? 'bg-red-950/60 border-red-500 text-white shadow-lg' 
                  : i < currentStepIndex 
                  ? 'bg-slate-900 border-slate-800 text-emerald-400' 
                  : 'bg-slate-950 border-slate-800/80 text-slate-500'
              }`}
            >
              <div className="text-[9px] font-mono uppercase font-bold truncate">Step {i + 1}</div>
              <div className="text-[10px] font-bold truncate">{st.title.split('. ')[1]}</div>
            </button>
          ))}
        </div>

        {/* Active Step Feature Showcase Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800">
              Active App Role: {currentStep.role.toUpperCase()} VIEW
            </span>
            <span className="text-xs font-mono text-slate-400">
              {currentStepIndex + 1} of {steps.length}
            </span>
          </div>

          <h2 className="text-2xl font-black text-white mb-1 tracking-tight">
            {currentStep.title}
          </h2>
          <div className="text-sm font-semibold text-red-400 mb-3 font-mono">
            {currentStep.subtitle}
          </div>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl mb-6">
            {currentStep.description}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleNext}
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-600/30 transition active:scale-95"
            >
              <span>{currentStep.actionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveRole(currentStep.role)}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
            >
              Jump to {currentStep.role === 'citizen' ? 'Citizen' : currentStep.role === 'responder' ? 'Responder' : 'Admin'} Screen
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Step Nav Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
        <button
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 text-xs font-semibold"
        >
          Previous Step
        </button>

        <div className="text-xs font-mono text-slate-500">
          Target Response SLA: &lt; 60 seconds
        </div>

        <button
          onClick={handleNext}
          disabled={currentStepIndex === steps.length - 1}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white disabled:opacity-40 text-xs font-semibold"
        >
          Next Step
        </button>
      </div>

    </div>
  );
};
