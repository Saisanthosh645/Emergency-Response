import React, { useState, useEffect, useRef } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { sound, triggerHaptic } from '../../utils/audio';
import { EmergencyMap } from '../map/EmergencyMap';
import { IncidentStatus } from '../../types';
import { 
  Radio, 
  Navigation, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  CheckCircle, 
  AlertCircle, 
  Hospital as HospitalIcon, 
  Phone, 
  Send, 
  Shield, 
  AlertTriangle,
  User,
  HeartPulse,
  Share2
} from 'lucide-react';

export const ResponderView: React.FC = () => {
  const { 
    responders, 
    incidents, 
    hospitals, 
    activeResponderId, 
    setActiveResponderId, 
    updateIncidentStatus,
    escalateIncident,
    sendChatMessage 
  } = useEmergency();

  const currentResponder = responders.find(r => r.id === activeResponderId) || responders[0];

  // Online / Offline duty status
  const [isOnDuty, setIsOnDuty] = useState<boolean>(true);

  // Incoming Alert 30-second timer
  const [incomingAlertTimer, setIncomingAlertTimer] = useState<number>(30);
  const [hasDeclined, setHasDeclined] = useState<boolean>(false);
  const [chatText, setChatText] = useState<string>('');

  // Find assigned incident for this responder
  const assignedIncident = incidents.find(i => 
    i.assignedResponderId === currentResponder.id && i.status !== 'Resolved'
  ) || null;

  // Unassigned critical incident awaiting acceptance
  const pendingDispatchIncident = incidents.find(i => 
    i.status === 'Reported' || i.status === 'Verified'
  );

  // Incoming alert timer countdown
  useEffect(() => {
    let interval: any = null;
    if (pendingDispatchIncident && !assignedIncident && isOnDuty && !hasDeclined) {
      sound.playEmergencySiren(2.0);
      interval = setInterval(() => {
        setIncomingAlertTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pendingDispatchIncident, assignedIncident, isOnDuty, hasDeclined]);

  // Handle Accept Dispatch
  const handleAcceptDispatch = () => {
    if (!pendingDispatchIncident) return;
    sound.playSuccessChime();
    triggerHaptic([100, 50, 200]);
    updateIncidentStatus(pendingDispatchIncident.id, 'Assigned', `${currentResponder.name} accepted dispatch`);
    setIncomingAlertTimer(30);
  };

  // Handle Decline
  const handleDeclineDispatch = () => {
    setHasDeclined(true);
    setTimeout(() => setHasDeclined(false), 8000);
  };

  // Status progression cycle
  const advanceStatus = () => {
    if (!assignedIncident) return;
    const current = assignedIncident.status;
    let next: IncidentStatus = 'En Route';
    if (current === 'Assigned') next = 'En Route';
    else if (current === 'En Route') next = 'Arrived';
    else if (current === 'Arrived') next = 'Hospitalizing';
    else if (current === 'Hospitalizing') next = 'Resolved';

    sound.playSuccessChime();
    triggerHaptic([100, 50, 100]);
    updateIncidentStatus(assignedIncident.id, next, `Responder status updated to ${next}`);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || !assignedIncident) return;
    sendChatMessage(assignedIncident.id, chatText.trim(), 'responder', currentResponder.callSign);
    setChatText('');
  };

  return (
    <div className="w-full max-w-xl mx-auto min-h-screen bg-[#070b14] text-slate-100 flex flex-col p-4 pb-20 select-none">
      
      {/* Top Terminal Bar */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-2xl mb-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isOnDuty ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            <h2 className="text-sm font-bold text-white tracking-wide truncate max-w-[200px]">
              {currentResponder.name}
            </h2>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            {currentResponder.callSign} • {currentResponder.vehicleNo}
          </div>
        </div>

        {/* Duty Toggle & Switcher */}
        <div className="flex items-center gap-2">
          {/* Switch Active Responder Profile */}
          <select
            value={activeResponderId}
            onChange={e => setActiveResponderId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-cyan-300 px-2 py-1 focus:outline-none"
          >
            <option value="RES-ALS-01">Paramedic Ravi (108 ALS)</option>
            <option value="RES-FIRE-15">Fire Captain (QRV Tender)</option>
            <option value="RES-POL-20">SHE Team Alpha (Patrol)</option>
            <option value="RES-SAM-29">Dr. Vikram (Good Samaritan)</option>
          </select>

          <button
            onClick={() => setIsOnDuty(!isOnDuty)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition shadow ${
              isOnDuty 
                ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {isOnDuty ? 'ON DUTY' : 'OFFLINE'}
          </button>
        </div>
      </div>

      {/* ================= INCOMING ALERT BANNER (30s TIMER) ================= */}
      {pendingDispatchIncident && !assignedIncident && isOnDuty && !hasDeclined && (
        <div className="mb-4 rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-2 border-red-500/80 p-4 shadow-2xl animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-red-400 font-black text-sm uppercase tracking-wider">
              <ShieldAlert className="w-5 h-5 text-red-500 animate-bounce" />
              <span>NEW DISPATCH ALERT</span>
            </div>
            <div className="text-xs font-mono font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
              {incomingAlertTimer}s to respond
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 mb-3 text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-white text-sm">
                {pendingDispatchIncident.severity} {pendingDispatchIncident.type}
              </span>
              <span className="text-[10px] font-mono text-cyan-400">{pendingDispatchIncident.id}</span>
            </div>
            <p className="text-slate-300 leading-snug">{pendingDispatchIncident.description}</p>
            <div className="mt-2 flex items-center gap-1.5 text-slate-400 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>{pendingDispatchIncident.location.address} (1.8 km away)</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAcceptDispatch}
              className="flex-1 py-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
            >
              ACCEPT DISPATCH ({incomingAlertTimer}s)
            </button>
            <button
              onClick={handleDeclineDispatch}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {/* ================= ACTIVE MISSION / EN ROUTE VIEW ================= */}
      {assignedIncident ? (
        <div className="space-y-4">
          
          {/* Mission Status Header Card */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-mono text-cyan-300 font-bold uppercase">
                  ACTIVE MISSION: {assignedIncident.id}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                assignedIncident.severity === 'Critical' ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {assignedIncident.severity}
              </span>
            </div>

            <div className="text-sm font-bold text-white mb-1">
              {assignedIncident.type}: {assignedIncident.location.address}
            </div>
            
            <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 mb-3">
              {assignedIncident.aiTriage?.patientConditionSummary || assignedIncident.description}
            </p>

            {/* Turn-by-Turn Telemetry */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center mb-3">
              <div>
                <div className="text-[9px] text-slate-500 uppercase font-mono">Distance</div>
                <div className="text-sm font-mono font-bold text-white">1.4 km</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-500 uppercase font-mono">ETA</div>
                <div className="text-sm font-mono font-bold text-cyan-400">
                  {assignedIncident.etaSeconds ? `${Math.round(assignedIncident.etaSeconds / 60)} min` : 'Arrived'}
                </div>
              </div>
              <div>
                <div className="text-[9px] text-slate-500 uppercase font-mono">Speed</div>
                <div className="text-sm font-mono font-bold text-emerald-400">48 km/h</div>
              </div>
            </div>

            {/* One-Tap Action Progression Button */}
            <button
              onClick={advanceStatus}
              className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition active:scale-95 ${
                assignedIncident.status === 'Assigned' 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : assignedIncident.status === 'En Route'
                  ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                  : assignedIncident.status === 'Arrived'
                  ? 'bg-teal-600 hover:bg-teal-500 text-white'
                  : assignedIncident.status === 'Hospitalizing'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {assignedIncident.status === 'Assigned' && 'TAP TO ROLL: START EN ROUTE'}
              {assignedIncident.status === 'En Route' && 'TAP: ARRIVED ON SCENE'}
              {assignedIncident.status === 'Arrived' && 'TAP: PATIENT STABILIZED / TRANSPORT TO ICU'}
              {assignedIncident.status === 'Hospitalizing' && 'TAP: COMPLETE MISSION / RETURN TO PATROL'}
            </button>
          </div>

          {/* Map with Route Polyline */}
          <div className="h-64 rounded-2xl overflow-hidden shadow-xl border border-slate-800 relative">
            <EmergencyMap
              incidents={[assignedIncident]}
              responders={[currentResponder]}
              hospitals={hospitals}
              selectedIncident={assignedIncident}
              center={[assignedIncident.location.lat, assignedIncident.location.lng]}
              zoom={14}
              interactive={true}
              drawRoute={true}
            />
            {/* Speed & Direction HUD */}
            <div className="absolute top-2 left-2 z-[400] bg-slate-950/90 backdrop-blur px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Turn right on Inorbit Mall Rd in 200m</span>
            </div>
          </div>

          {/* Hospital Aware Handover Card */}
          {assignedIncident.assignedHospital && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <HospitalIcon className="w-4 h-4" />
                  <span>Designated Destination Trauma Hospital</span>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/60 font-mono">
                  Beds Reserved
                </span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-white">{assignedIncident.assignedHospital.name}</div>
                  <div className="text-[10px] text-slate-400">{assignedIncident.assignedHospital.area} • {assignedIncident.assignedHospital.specialistOnDuty}</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-mono font-bold text-sm">
                    {assignedIncident.assignedHospital.availableIcuBeds} ICU
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    {assignedIncident.assignedHospital.availableVentilators} Vents
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Escalation & Backup Button */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => escalateIncident(assignedIncident.id)}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-red-950/80 border border-slate-800 hover:border-red-500/40 text-red-300 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>Request Backup / PCR</span>
            </button>

            <a
              href={`tel:${assignedIncident.citizenPhone}`}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call Citizen (Masked)</span>
            </a>
          </div>

          {/* 2-Way Chat Terminal */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
            <div className="text-[11px] font-bold text-slate-300 mb-2 font-mono">
              Comms Channel with Citizen & Dispatch
            </div>
            <div className="max-h-28 overflow-y-auto space-y-1.5 text-xs mb-2">
              {assignedIncident.chatMessages.map(msg => (
                <div key={msg.id} className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[9px] text-slate-400 font-mono">{msg.senderName}: </span>
                  <span className="text-slate-200">{msg.text}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendChat} className="flex gap-1.5">
              <input
                type="text"
                value={chatText}
                onChange={e => setChatText(e.target.value)}
                placeholder="Send tactical update..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>

        </div>
      ) : (
        /* Standby / Patrol Mode */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
            <Radio className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="text-base font-bold text-white">Patrolling Station Sector</h3>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Unit {currentResponder.callSign} is online. GPS telemetry streaming to Hyderabad Command Center. You will be alerted within 2 seconds of incident triage.
          </p>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 grid grid-cols-2 gap-4 w-full max-w-xs mt-2">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Sector</div>
              <div className="font-semibold text-white truncate">{currentResponder.location.area}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Cases Handled</div>
              <div className="font-semibold text-emerald-400">{currentResponder.casesHandled}</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
