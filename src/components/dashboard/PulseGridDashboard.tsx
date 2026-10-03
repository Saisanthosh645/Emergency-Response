import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { EmergencyMap } from '../map/EmergencyMap';
import { sound, triggerHaptic } from '../../utils/audio';
import { 
  ShieldAlert, 
  Home, 
  MapPin, 
  AlertCircle, 
  Clock, 
  Phone, 
  Settings, 
  Shield, 
  Bell, 
  Search, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Car, 
  Flame, 
  HeartPulse, 
  ChevronDown, 
  Download, 
  Share2, 
  MessageSquare, 
  Navigation,
  Layers,
  Building,
  UserCheck
} from 'lucide-react';

export const PulseGridDashboard: React.FC<{ onOpenSOS: () => void }> = ({ onOpenSOS }) => {
  const { 
    incidents, 
    responders, 
    hospitals, 
    activeIncident, 
    updateIncidentStatus,
    activeRole,
    setActiveRole 
  } = useEmergency();

  const [activeSidebarTab, setActiveSidebarTab] = useState<'home' | 'map' | 'incidents' | 'history' | 'contacts' | 'settings'>('home');
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showTriageDetails, setShowTriageDetails] = useState<boolean>(false);
  const [showResponseDetails, setShowResponseDetails] = useState<boolean>(false);

  // Active incident reference or fallback to Banjara Hills incident
  const currentInc = activeIncident || incidents[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans select-none">
      
      {/* ================= 1. TOP HEADER ================= */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-30 sticky top-0 shadow-xs">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {/* ECG Pulse Heartbeat Icon */}
            <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-slate-900 leading-none">
                PULSE<span className="text-red-500">GRID</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-normal mt-0.5">
                Hyperlocal Emergency Response
              </div>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search location, incident or service..."
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-red-500 focus:bg-white rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 transition focus:outline-none"
            />
          </div>
        </div>

        {/* Right: Online Status, Bell, User Profile */}
        <div className="flex items-center gap-4">
          
          {/* Status Badge */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online</span>
          </div>

          {/* Notification Bell */}
          <button className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 transition">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
                alt="Sai Santhosh"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
              />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">Sai Santhosh</div>
                <div className="text-[10px] text-slate-500 leading-tight">Citizen</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown Menu for Role Switching */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="font-bold text-slate-900">Sai Santhosh</div>
                  <div className="text-[10px] text-slate-500 truncate">raminisaisanthosh@gmail.com</div>
                </div>

                <div className="py-1">
                  <div className="text-[10px] font-mono text-slate-400 px-3 py-1 uppercase">Switch Perspective</div>
                  <button
                    onClick={() => { setActiveRole('citizen'); setShowProfileMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                  >
                    <span>Citizen Dashboard</span>
                    {activeRole === 'citizen' && <span className="text-emerald-500 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => { setActiveRole('responder'); setShowProfileMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                  >
                    <span>Responder Terminal</span>
                    {activeRole === 'responder' && <span className="text-emerald-500 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => { setActiveRole('admin'); setShowProfileMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                  >
                    <span>Admin Command Center</span>
                    {activeRole === 'admin' && <span className="text-emerald-500 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => { setActiveRole('demo'); setShowProfileMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-amber-600 font-bold"
                  >
                    <span>90-Sec Guided Demo</span>
                  </button>
                  <button
                    onClick={() => { setActiveRole('privacy'); setShowProfileMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                  >
                    <span>Privacy & Trust</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </header>

      {/* ================= 2. MAIN LAYOUT (SIDEBAR + 3 COLUMNS) ================= */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-56 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between p-4 shrink-0">
          <nav className="space-y-1">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'map', label: 'Live Map', icon: MapPin },
              { id: 'incidents', label: 'Incidents', icon: AlertCircle },
              { id: 'history', label: 'History', icon: Clock },
              { id: 'contacts', label: 'Emergency Contacts', icon: Phone },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeSidebarTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSidebarTab(item.id as any);
                    if (item.id === 'map') onOpenSOS();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-bold' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Sidebar Card: Stay Safe */}
          <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Stay Safe</div>
              <div className="text-[11px] text-slate-500 leading-snug mt-0.5">
                Be prepared. Know your nearby emergency services.
              </div>
            </div>
            <button 
              onClick={() => setActiveRole('privacy')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1"
            >
              <span>Learn more</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* Center Canvas: 3 Columns Grid matching screenshot */}
        <main className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* ================= COLUMN 1: LEFT SIDE ACTIONS (3 cols) ================= */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Need Help? Emergency Trigger Card */}
            <div className="rounded-2xl bg-gradient-to-br from-rose-50/80 via-white to-red-50/40 border border-rose-100 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-500 mb-3 shadow-xs">
                  <Bell className="w-6 h-6 animate-pulse" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
                  Need Help?
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Tell us what happened. We'll help coordinate the nearest available response.
                </p>
              </div>

              <button
                onClick={onOpenSOS}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 active:scale-95 transition"
              >
                <span>Report an Emergency</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Emergency Contacts Card */}
            <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900">Emergency Contacts</h3>
                <button onClick={onOpenSOS} className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">
                  View all
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'Police', phone: '100', icon: Shield, color: 'bg-blue-600 text-white' },
                  { name: 'Ambulance', phone: '108', icon: HeartPulse, color: 'bg-emerald-600 text-white' },
                  { name: 'Fire', phone: '101', icon: Flame, color: 'bg-red-500 text-white' },
                ].map(c => {
                  const Icon = c.icon;
                  return (
                    <div key={c.phone} className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl ${c.color} flex items-center justify-center shadow-xs`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{c.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{c.phone}</div>
                        </div>
                      </div>
                      <a
                        href={`tel:${c.phone}`}
                        className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Nearby Emergency Services Card */}
            <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900">Nearby Emergency Services</h3>
                <button onClick={onOpenSOS} className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">
                  View all
                </button>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: 'City Hospital', status: 'Open • 24/7', dist: '1.2 km', icon: HeartPulse, color: 'bg-blue-600 text-white' },
                  { name: 'Police Station', status: 'Open • 24/7', dist: '2.4 km', icon: Shield, color: 'bg-blue-600 text-white' },
                  { name: 'Fire Station', status: 'Open • 24/7', dist: '3.1 km', icon: Flame, color: 'bg-red-500 text-white' },
                ].map(srv => {
                  const Icon = srv.icon;
                  return (
                    <div key={srv.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl ${srv.color} flex items-center justify-center shadow-xs`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{srv.name}</div>
                          <div className="text-[10px] text-emerald-600 font-medium">{srv.status}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 font-semibold">{srv.dist}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Incidents Card */}
            <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-900">Recent Incidents</h3>
                <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">
                  View all
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Road Accident</div>
                    <div className="text-[10px] text-slate-400">2 hours ago • Banjara Hills</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Resolved
                </span>
              </div>
            </div>

          </div>

          {/* ================= COLUMN 2: CENTER MAP & PROGRESS (6 cols) ================= */}
          <div className="lg:col-span-6 space-y-4 flex flex-col">
            
            {/* The Map Component with CartoDB Voyager Light Style */}
            <div className="h-[490px] rounded-2xl overflow-hidden shadow-xs border border-slate-200 bg-white relative">
              <EmergencyMap
                center={[17.4215, 78.4310]} // Banjara Hills, Hyderabad
                zoom={14}
                interactive={true}
                drawRoute={true}
                className="w-full h-full"
              />
            </div>

            {/* Response Progress Stepper matching screenshot */}
            <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-900">Response Progress</h3>
                <button 
                  onClick={() => setShowResponseDetails(!showResponseDetails)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                >
                  <span>View details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* 7-Step Stepper Bar */}
              <div className="relative px-2">
                {/* Horizontal Progress connecting bar */}
                <div className="absolute top-3 left-4 right-4 h-0.5 bg-slate-200 z-0"></div>
                <div className="absolute top-3 left-4 w-4/6 h-0.5 bg-emerald-500 z-0"></div>

                <div className="flex justify-between items-start relative z-10">
                  {[
                    { label: 'Reported', time: '14:32', state: 'done' },
                    { label: 'Location Confirmed', time: '14:32', state: 'done' },
                    { label: 'AI Triage', time: '14:33', state: 'done' },
                    { label: 'Responder Assigned', time: '14:34', state: 'done' },
                    { label: 'En Route', time: 'ETA 6 min', state: 'current' },
                    { label: 'Arrived', time: '', state: 'pending' },
                    { label: 'Resolved', time: '', state: 'pending' },
                  ].map((step, idx) => (
                    <div key={step.label} className="flex flex-col items-center text-center max-w-[70px]">
                      {step.state === 'done' ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : step.state === 'current' ? (
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md ring-4 ring-blue-100 animate-pulse">
                          <Car className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-slate-800 mt-1.5 leading-tight">{step.label}</span>
                      {step.time && (
                        <span className={`text-[9px] font-mono leading-tight mt-0.5 ${step.state === 'current' ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                          {step.time}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* ================= COLUMN 3: RIGHT INCIDENT & AI CARD (3 cols) ================= */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Top Incident Status Card */}
            <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                  In Progress
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Incident ID: PG-293847
                </span>
              </div>

              {/* Title & Location */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-500/30">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Medical Emergency
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Banjara Hills, Hyderabad</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] font-bold uppercase bg-red-100 text-red-600 px-2 py-0.2 rounded-full">
                      Critical
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">14:32 • 12 Apr 2025</span>
                  </div>
                </div>
              </div>

              {/* ETA & Distance Telemetry Grid */}
              <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-100 my-2">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-medium">ETA</div>
                  <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">06 min</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-medium">Distance</div>
                  <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">1.8 km</div>
                </div>
              </div>

              {/* Assigned Vehicle Strip */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Car className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px]">Medical Response Unit #MH-042</span>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  En Route
                </span>
              </div>
            </div>

            {/* AI-Assisted Triage Card */}
            <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>AI-Assisted Triage</span>
                </div>
                <button 
                  onClick={() => setShowTriageDetails(!showTriageDetails)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                >
                  <span>View details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-[11px] font-bold text-slate-800">Medical emergency</span>
                <span className="text-[9px] font-bold uppercase bg-red-100 text-red-600 px-2 py-0.2 rounded-full">
                  Critical
                </span>
              </div>

              {/* Risk Indicators */}
              <div className="mb-3">
                <div className="text-[10px] text-slate-400 uppercase font-mono font-medium mb-1">Risk indicators</div>
                <ul className="text-[11px] text-slate-600 space-y-0.5 leading-snug">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                    <span>Possible loss of consciousness</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                    <span>Roadside location</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                    <span>Traffic exposure</span>
                  </li>
                </ul>
              </div>

              {/* Recommended Response */}
              <div className="mb-3">
                <div className="text-[10px] text-slate-400 uppercase font-mono font-medium mb-0.5">Recommended response</div>
                <div className="text-xs font-bold text-slate-900">Advanced medical response</div>
              </div>

              {/* Confidence Progress Bar */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-1">
                  <span>Confidence</span>
                  <span className="font-bold text-slate-900">92%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full w-[92%]" />
                </div>
              </div>
            </div>

            {/* Incident Timeline Card */}
            <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 mb-3">Incident Timeline</h3>
              
              <div className="relative pl-6 space-y-3.5">
                {/* Vertical connecting line */}
                <div className="absolute top-2 left-2.5 bottom-2 w-0.5 bg-slate-100 z-0"></div>

                {[
                  { title: 'Emergency reported', time: '14:32', icon: Shield, bg: 'bg-emerald-500 text-white' },
                  { title: 'Location confirmed', time: '14:32', icon: Check, bg: 'bg-emerald-500 text-white' },
                  { title: 'AI triage completed', time: '14:33', icon: Check, bg: 'bg-emerald-500 text-white' },
                  { title: 'Responder assigned', time: '14:34', icon: Car, bg: 'bg-emerald-500 text-white' },
                  { title: 'En route', time: 'ETA 6 min', icon: Car, bg: 'bg-blue-600 text-white' },
                ].map(step => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="relative z-10 flex items-start justify-between">
                      <div className="flex items-start gap-2.5 -ml-6">
                        <div className={`w-5 h-5 rounded-full ${step.bg} flex items-center justify-center shadow-xs shrink-0 ring-4 ring-white`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 leading-tight">{step.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{step.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </main>
      </div>

    </div>
  );
};
