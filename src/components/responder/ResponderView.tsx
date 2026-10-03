import React, { useState, useEffect, useMemo } from 'react';
import { useEmergency, calculateHaversineDistanceKm, generateTurnByTurnSteps } from '../../context/EmergencyContext';
import { sound, triggerHaptic } from '../../utils/audio';
import { TRANSLATIONS } from '../../utils/i18n';
import { EmergencyMap } from '../map/EmergencyMap';
import { IncidentStatus, NavigationTurnStep } from '../../types';
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
  Share2,
  ArrowLeft,
  Car,
  Check,
  Activity,
  Compass,
  ExternalLink,
  Zap,
  Users,
  Volume2,
  Mic,
  TrafficCone
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
    assignCoordinatingResponder,
    toggleGreenCorridor,
    sendChatMessage,
    setActiveRole,
    currentLanguage
  } = useEmergency();

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const currentResponder = responders.find(r => r.id === activeResponderId) || responders[0];

  const [isOnDuty, setIsOnDuty] = useState<boolean>(true);
  const [incomingAlertTimer, setIncomingAlertTimer] = useState<number>(30);
  const [hasDeclined, setHasDeclined] = useState<boolean>(false);
  const [chatText, setChatText] = useState<string>('');
  const [showNavigationDrawer, setShowNavigationDrawer] = useState<boolean>(false);
  const [showBackupModal, setShowBackupModal] = useState<boolean>(false);
  const [showEscalationModal, setShowEscalationModal] = useState<boolean>(false);
  const [isPttTalking, setIsPttTalking] = useState<boolean>(false);

  const assignedIncident = incidents.find(i => 
    (i.assignedResponderId === currentResponder.id || i.coordinatingResponders?.some(c => c.responderId === currentResponder.id)) && 
    i.status !== 'Resolved'
  ) || null;

  const pendingDispatchIncident = incidents.find(i => 
    i.status === 'Reported' || i.status === 'Verified'
  );

  useEffect(() => {
    let interval: any = null;
    if (pendingDispatchIncident && !assignedIncident && isOnDuty && !hasDeclined) {
      sound.playEmergencySiren(2.0);
      interval = setInterval(() => {
        setIncomingAlertTimer(prev => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [pendingDispatchIncident, assignedIncident, isOnDuty, hasDeclined]);

  const handleAcceptDispatch = () => {
    if (!pendingDispatchIncident) return;
    sound.playSuccessChime();
    triggerHaptic([100, 50, 200]);
    updateIncidentStatus(pendingDispatchIncident.id, 'Assigned', `${currentResponder.name} accepted dispatch`);
    setIncomingAlertTimer(30);
  };

  const handleDeclineDispatch = () => {
    setHasDeclined(true);
    setTimeout(() => setHasDeclined(false), 8000);
  };

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
    updateIncidentStatus(assignedIncident.id, next, `Responder status advanced to ${next}`);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || !assignedIncident) return;
    sendChatMessage(assignedIncident.id, chatText.trim(), 'responder', currentResponder.callSign);
    setChatText('');
  };

  // Push-To-Talk Radio Broadcast Simulation
  const handlePttBroadcast = () => {
    if (!assignedIncident) return;
    setIsPttTalking(true);
    sound.playRadioChirp();
    triggerHaptic([100, 50]);

    setTimeout(() => {
      setIsPttTalking(false);
      sound.playRadioChirp();
      const pttMessage = `Unit ${currentResponder.callSign}: [RADIO TRANSMISSION] Visual contact with approach corridor. Sirens on, priority clearance active.`;
      sendChatMessage(assignedIncident.id, pttMessage, 'responder', currentResponder.callSign);
    }, 1800);
  };

  // Turn-by-Turn Navigation Steps Calculation
  const navigationSteps = useMemo(() => {
    if (!assignedIncident) return [];
    const isHospitalPhase = assignedIncident.status === 'Hospitalizing';
    const targetLat = isHospitalPhase && assignedIncident.assignedHospital ? assignedIncident.assignedHospital.location.lat : assignedIncident.location.lat;
    const targetLng = isHospitalPhase && assignedIncident.assignedHospital ? assignedIncident.assignedHospital.location.lng : assignedIncident.location.lng;
    const targetName = isHospitalPhase && assignedIncident.assignedHospital ? assignedIncident.assignedHospital.name : assignedIncident.location.address;

    return generateTurnByTurnSteps(
      currentResponder.location.lat,
      currentResponder.location.lng,
      targetLat,
      targetLng,
      targetName,
      isHospitalPhase
    );
  }, [assignedIncident, currentResponder.location.lat, currentResponder.location.lng]);

  // Google Maps External GPS Link
  const googleMapsUrl = useMemo(() => {
    if (!assignedIncident) return '#';
    const isHospitalPhase = assignedIncident.status === 'Hospitalizing';
    const destLat = isHospitalPhase && assignedIncident.assignedHospital ? assignedIncident.assignedHospital.location.lat : assignedIncident.location.lat;
    const destLng = isHospitalPhase && assignedIncident.assignedHospital ? assignedIncident.assignedHospital.location.lng : assignedIncident.location.lng;
    return `https://www.google.com/maps/dir/?api=1&origin=${currentResponder.location.lat},${currentResponder.location.lng}&destination=${destLat},${destLng}&travelmode=driving`;
  }, [assignedIncident, currentResponder.location.lat, currentResponder.location.lng]);

  const realDistanceKm = useMemo(() => {
    if (!assignedIncident) return 0;
    return calculateHaversineDistanceKm(
      currentResponder.location.lat,
      currentResponder.location.lng,
      assignedIncident.location.lat,
      assignedIncident.location.lng
    );
  }, [assignedIncident, currentResponder.location.lat, currentResponder.location.lng]);

  return (
    <div className="w-full h-full bg-[#070b14] text-slate-100 flex flex-col overflow-hidden select-none">

      {/* ===== TOP NAV HEADER ===== */}
      <header className="h-14 bg-[#090d16] border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveRole('citizen')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.exitToDashboard}</span>
          </button>
          <div className="w-px h-5 bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isOnDuty ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-sm font-bold text-white tracking-wide">{currentResponder.name}</span>
            <span className="text-[10px] font-mono text-slate-400">{currentResponder.callSign} • {currentResponder.vehicleNo}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-slate-800/60 px-2 py-1 rounded border border-slate-700">
            TACTICAL TERMINAL
          </span>
          <select
            value={activeResponderId}
            onChange={e => setActiveResponderId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg text-[10px] text-cyan-300 px-2 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="RES-ALS-01">Paramedic Ravi (108 ALS)</option>
            <option value="RES-FIRE-15">Fire Captain (QRV Tender)</option>
            <option value="RES-POL-20">SHE Team Alpha (Patrol)</option>
            <option value="RES-SAM-29">Dr. Vikram (Good Samaritan)</option>
          </select>
          <button
            onClick={() => setIsOnDuty(!isOnDuty)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              isOnDuty 
                ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {isOnDuty ? t.online.toUpperCase() : t.offline.toUpperCase()}
          </button>
        </div>
      </header>

      {/* ===== INCOMING ALERT BANNER ===== */}
      {pendingDispatchIncident && !assignedIncident && isOnDuty && !hasDeclined && (
        <div className="mx-4 mt-3 rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-2 border-red-500/80 p-4 shadow-2xl shrink-0 animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-red-400 font-black text-sm uppercase tracking-wider">
              <ShieldAlert className="w-5 h-5 text-red-500 animate-bounce" />
              <span>NEW DISPATCH ALERT</span>
            </div>
            <div className="text-xs font-mono font-bold bg-red-600 text-white px-2.5 py-0.5 rounded-full">
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

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex overflow-hidden">

        {assignedIncident ? (
          <>
            {/* LEFT PANEL: Mission Control & Navigation */}
            <div className="w-[430px] shrink-0 flex flex-col overflow-y-auto border-r border-slate-800 p-4 space-y-3 bg-[#080c14]">

              {/* Mission Status Header */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs font-mono text-cyan-300 font-bold uppercase">
                      ACTIVE MISSION: {assignedIncident.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {assignedIncident.greenCorridorActive && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                        GREEN CORRIDOR
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                      assignedIncident.severity === 'Critical' 
                        ? 'bg-red-500/20 text-red-300 border-red-500/40' 
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {assignedIncident.severity}
                    </span>
                  </div>
                </div>
                
                <div className="text-sm font-bold text-white mb-1">
                  {assignedIncident.type}: {assignedIncident.location.address}
                </div>
                <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 mb-3">
                  {assignedIncident.aiTriage?.patientConditionSummary || assignedIncident.description}
                </p>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center mb-3">
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase font-mono">Distance</div>
                    <div className="text-sm font-mono font-bold text-white">{realDistanceKm} km</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase font-mono">ETA</div>
                    <div className="text-sm font-mono font-bold text-cyan-400">
                      {assignedIncident.etaSeconds ? `${Math.ceil(assignedIncident.etaSeconds / 60)} min` : 'Arrived'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase font-mono">Transit Speed</div>
                    <div className="text-sm font-mono font-bold text-emerald-400">
                      {assignedIncident.greenCorridorActive ? '58 km/h' : '42 km/h'}
                    </div>
                  </div>
                </div>

                {/* One-Tap Status Button */}
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
                  {assignedIncident.status === 'Arrived' && 'TAP: PATIENT STABILIZED / EN ROUTE TO ICU'}
                  {assignedIncident.status === 'Hospitalizing' && 'TAP: HOSPITAL HANDOVER / RESOLVED'}
                </button>
              </div>

              {/* ROUTE & TURN-BY-TURN GUIDANCE CARD */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                    <Compass className="w-4 h-4" />
                    <span>Turn-by-Turn Navigation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Primary Next Turn HUD */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold">
                    <Navigation className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                  <div className="flex-1 truncate">
                    <div className="text-xs font-bold text-white truncate">
                      {navigationSteps[1]?.instruction || navigationSteps[0]?.instruction}
                    </div>
                    <div className="text-[10px] text-cyan-400 font-mono">
                      In {navigationSteps[1]?.distanceMeters || 200}m • {navigationSteps[1]?.roadName || 'Main Corridor'}
                    </div>
                  </div>
                </div>

                {/* Turn Steps List */}
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {navigationSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/70 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[10px] font-mono text-slate-500 w-4">{idx + 1}.</span>
                        <span className="text-slate-300 truncate text-[11px]">{step.instruction}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{step.distanceMeters}m</span>
                    </div>
                  ))}
                </div>

                {/* Green Corridor Control Toggle */}
                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrafficCone className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200">Traffic Green Corridor</span>
                  </div>
                  <button
                    onClick={() => toggleGreenCorridor(assignedIncident.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      assignedIncident.greenCorridorActive
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{assignedIncident.greenCorridorActive ? 'ACTIVE (8 SIGNALS)' : 'ACTIVATE'}</span>
                  </button>
                </div>
              </div>

              {/* MULTI-UNIT COORDINATION CARD */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                    <Users className="w-4 h-4" />
                    <span>Coordinated Response Units</span>
                  </div>
                  <button
                    onClick={() => setShowBackupModal(true)}
                    className="text-[10px] text-cyan-400 font-bold hover:underline"
                  >
                    + Request Backup
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white text-[11px]">{currentResponder.name} (Primary)</div>
                      <div className="text-[10px] text-slate-400">{currentResponder.callSign} • {currentResponder.type}</div>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      Primary Lead
                    </span>
                  </div>

                  {assignedIncident.coordinatingResponders && assignedIncident.coordinatingResponders.map(c => (
                    <div key={c.responderId} className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white text-[11px]">{c.responder.name}</div>
                        <div className="text-[10px] text-slate-400">{c.responder.callSign} • {c.role}</div>
                      </div>
                      <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                        {c.responder.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* HOSPITAL HANDOVER */}
              {assignedIncident.assignedHospital && (
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                      <HospitalIcon className="w-4 h-4" />
                      <span>Designated Trauma Hospital</span>
                    </div>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/60 font-mono">
                      Beds Pre-Alerted
                    </span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-white">{assignedIncident.assignedHospital.name}</div>
                      <div className="text-[10px] text-slate-400">{assignedIncident.assignedHospital.area} • {assignedIncident.assignedHospital.specialistOnDuty}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-mono font-bold text-sm">{assignedIncident.assignedHospital.availableIcuBeds} ICU</div>
                      <div className="text-[9px] text-slate-400 font-mono">{assignedIncident.assignedHospital.availableVentilators} Vents</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIONS ROW: Push-To-Talk Radio, Escalate SLA, Call Citizen */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handlePttBroadcast}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition active:scale-95 ${
                    isPttTalking 
                      ? 'bg-red-600 text-white animate-pulse' 
                      : 'bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-200'
                  }`}
                >
                  <Radio className="w-4 h-4 mb-0.5 text-purple-400" />
                  <span className="text-[9px]">{isPttTalking ? 'TRANSMITTING' : 'Push-To-Talk'}</span>
                </button>

                <button
                  onClick={() => setShowEscalationModal(true)}
                  className="py-2.5 px-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-bold flex flex-col items-center justify-center transition active:scale-95"
                >
                  <AlertTriangle className="w-4 h-4 mb-0.5 text-red-400" />
                  <span className="text-[9px]">Escalate SLA</span>
                </button>

                <a
                  href={`tel:${assignedIncident.citizenPhone}`}
                  className="py-2.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold flex flex-col items-center justify-center transition active:scale-95"
                >
                  <Phone className="w-4 h-4 mb-0.5 text-emerald-400" />
                  <span className="text-[9px]">Call Citizen</span>
                </a>
              </div>

              {/* Chat Terminal */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
                <div className="text-[11px] font-bold text-slate-300 mb-2 font-mono flex items-center justify-between">
                  <span>Comms: Citizen & Dispatch</span>
                  <span className="text-[9px] text-cyan-400 font-normal">Encrypted Channel</span>
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1.5 text-xs mb-2">
                  {assignedIncident.chatMessages.map(msg => (
                    <div key={msg.id} className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[9px] text-cyan-400 font-mono">{msg.senderName}: </span>
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
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </div>

            </div>

            {/* RIGHT PANEL: Dynamic Leaflet Map with Route & HUD */}
            <div className="flex-1 relative overflow-hidden">
              <EmergencyMap
                incidents={[assignedIncident]}
                responders={[currentResponder]}
                hospitals={hospitals}
                selectedIncident={assignedIncident}
                center={[assignedIncident.location.lat, assignedIncident.location.lng]}
                zoom={14}
                interactive={true}
                drawRoute={true}
                className="w-full h-full"
              />

              {/* Navigation HUD Top Overlay */}
              <div className="absolute top-4 left-4 z-[400] bg-slate-950/90 backdrop-blur px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2 shadow-xl">
                <Navigation className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span className="font-semibold">{navigationSteps[1]?.instruction || navigationSteps[0]?.instruction}</span>
              </div>

              {/* Speed HUD Top Right Overlay */}
              <div className="absolute top-4 right-4 z-[400] bg-slate-950/90 backdrop-blur px-3 py-2 rounded-xl border border-slate-800 text-center shadow-xl">
                <div className="text-2xl font-black font-mono text-white leading-none">
                  {assignedIncident.greenCorridorActive ? 58 : 42}
                </div>
                <div className="text-[10px] text-slate-400 font-mono uppercase">km/h</div>
              </div>

              {/* Green Corridor Active Banner */}
              {assignedIncident.greenCorridorActive && (
                <div className="absolute top-16 left-4 z-[400] bg-emerald-950/90 border border-emerald-500/60 px-3 py-1.5 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-xl animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>TRAFFIC GREEN CORRIDOR ENGAGED — SIGNALS PRE-CLEARED</span>
                </div>
              )}

              {/* Bottom status bar on map */}
              <div className="absolute bottom-0 left-0 right-0 z-[400] bg-gradient-to-t from-slate-950/80 to-transparent p-4 flex items-end justify-between">
                <div className="bg-slate-950/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
                  <span className="text-slate-400">Status: </span>
                  <span className="text-cyan-300 font-bold font-mono">{assignedIncident.status.toUpperCase()}</span>
                </div>
                <div className="bg-slate-950/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
                  <span className="text-slate-400">ETA: </span>
                  <span className="text-amber-300 font-bold font-mono">
                    {assignedIncident.etaSeconds ? `${Math.ceil(assignedIncident.etaSeconds / 60)} min` : 'On Scene'}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ===== STANDBY / PATROL MODE ===== */
          <div className="flex-1 flex">
            <div className="w-[380px] shrink-0 border-r border-slate-800 p-6 flex flex-col justify-center bg-[#080c14]">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                  <Radio className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Patrolling Sector: {currentResponder.location.area}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Unit {currentResponder.callSign} is online and operational. GPS telemetry streaming to Hyderabad Central Command. You will be alerted automatically upon priority incident dispatch.
                  </p>
                </div>
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-mono mb-1">Sector</div>
                    <div className="font-semibold text-white truncate">{currentResponder.location.area}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-mono mb-1">Cases Handled</div>
                    <div className="font-semibold text-emerald-400 text-lg">{currentResponder.casesHandled}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-mono mb-1">Vehicle</div>
                    <div className="font-semibold text-white">{currentResponder.vehicleNo}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-mono mb-1">Unit Type</div>
                    <div className="font-semibold text-cyan-300">{currentResponder.type}</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono mb-2">Recent Sector Activity</div>
                  {incidents.filter(i => i.status === 'Resolved').slice(0, 3).map(inc => (
                    <div key={inc.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 mb-1.5">
                      <div>
                        <div className="text-xs font-bold text-slate-300">{inc.type}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{inc.location.area}</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800/50">
                        Resolved
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
              <EmergencyMap
                center={[currentResponder.location.lat, currentResponder.location.lng]}
                zoom={13}
                interactive={true}
                drawRoute={false}
                className="w-full h-full"
              />
              <div className="absolute top-4 left-4 z-[400] bg-slate-950/90 backdrop-blur px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">Standby Sector Patrol — Ready for Automatic Dispatch</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MULTI-UNIT BACKUP REQUEST MODAL */}
      {showBackupModal && assignedIncident && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Request Multi-Unit Backup
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Dispatch coordinated secondary units to {assignedIncident.location.address}:
            </p>

            <div className="space-y-2 mb-4">
              {responders.filter(r => r.id !== currentResponder.id).slice(0, 4).map(r => (
                <div key={r.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{r.name}</div>
                    <div className="text-[10px] text-slate-400">{r.type} • {r.status}</div>
                  </div>
                  <button
                    onClick={() => {
                      assignCoordinatingResponder(assignedIncident.id, r.id, `${r.type} Support`);
                      setShowBackupModal(false);
                    }}
                    className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[10px] font-bold transition"
                  >
                    Dispatch Unit
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowBackupModal(false)}
              className="w-full py-2 bg-slate-800 text-xs text-white rounded-xl font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* SLA ESCALATION MODAL */}
      {showEscalationModal && assignedIncident && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Escalate Incident SLA Tier
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Select escalation level for incident {assignedIncident.id}:
            </p>

            <div className="space-y-2 mb-4">
              <button
                onClick={() => {
                  escalateIncident(assignedIncident.id, 1, 'Expanded perimeter search');
                  setShowEscalationModal(false);
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs"
              >
                <div className="font-bold text-amber-400">Tier 1: Expand Dispatch Radius</div>
                <div className="text-[10px] text-slate-400">Widens responder pool to 10km grid</div>
              </button>

              <button
                onClick={() => {
                  escalateIncident(assignedIncident.id, 2, 'Zonal Supervisor paged');
                  setShowEscalationModal(false);
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs"
              >
                <div className="font-bold text-orange-400">Tier 2: Page Zonal Supervisor & Police PCR</div>
                <div className="text-[10px] text-slate-400">Alerts duty inspector and dispatches escort</div>
              </button>

              <button
                onClick={() => {
                  escalateIncident(assignedIncident.id, 3, 'Mass casualty alarm');
                  setShowEscalationModal(false);
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-red-500/40 text-xs"
              >
                <div className="font-bold text-red-400">Tier 3: Major Incident / ECC Siren Alarm</div>
                <div className="text-[10px] text-slate-400">Triggers citywide Disaster Command activation</div>
              </button>
            </div>

            <button
              onClick={() => setShowEscalationModal(false)}
              className="w-full py-2 bg-slate-800 text-xs text-white rounded-xl font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
