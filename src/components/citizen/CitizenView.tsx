import React, { useState, useEffect, useRef } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { TRANSLATIONS } from '../../utils/i18n';
import { sound, triggerHaptic } from '../../utils/audio';
import { EmergencyType, EmergencyContact } from '../../types';
import { EmergencyMap } from '../map/EmergencyMap';
import { 
  AlertTriangle, 
  Flame, 
  HeartPulse, 
  Car, 
  ShieldAlert, 
  Radio, 
  Mic, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Shield, 
  WifiOff, 
  Send, 
  ChevronRight, 
  UserCheck, 
  ArrowLeft,
  Volume2,
  Hospital as HospitalIcon,
  Users,
  Check
} from 'lucide-react';

export const CitizenView: React.FC = () => {
  const { 
    currentLanguage, 
    createEmergency, 
    activeIncident, 
    updateIncidentStatus,
    sendChatMessage, 
    isOfflineMode, 
    setIsOfflineMode,
    activeAlertForCitizen,
    responders,
    hospitals
  } = useEmergency();

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // SOS Press-and-Hold State
  const [holdingProgress, setHoldingProgress] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const holdTimerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  // Form State
  const [selectedType, setSelectedType] = useState<EmergencyType>('Medical');
  const [descriptionText, setDescriptionText] = useState<string>('');
  const [isVoiceRecording, setIsVoiceRecording] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [showManualPinModal, setShowManualPinModal] = useState<boolean>(false);
  const [showNearbyServicesModal, setShowNearbyServicesModal] = useState<boolean>(false);
  const [showContactsModal, setShowContactsModal] = useState<boolean>(false);
  const [testSmsSuccess, setTestSmsSuccess] = useState<string | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>('Cyber Towers Flyover, Hitech City, Hyderabad');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number; accuracy: number }>({
    lat: 17.4485,
    lng: 78.3745,
    accuracy: 6
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<'locked' | 'searching' | 'denied'>('locked');
  const [showCallModal, setShowCallModal] = useState<boolean>(false);

  // Pre-seeded emergency contacts
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: 'c1', name: 'Ramesh (Spouse)', relationship: 'Spouse', phone: '+91 98480 12345', notifyOnSOS: true },
    { id: 'c2', name: 'Dr. Sunita (Family Doctor)', relationship: 'Doctor', phone: '+91 94400 54321', notifyOnSOS: true },
    { id: 'c3', name: 'Priya (Sister)', relationship: 'Sister', phone: '+91 99890 98765', notifyOnSOS: true }
  ]);
  const [newContactName, setNewContactName] = useState<string>('');
  const [newContactPhone, setNewContactPhone] = useState<string>('');

  // Auto-capture live device GPS on mount
  const captureLiveGPS = () => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      setIsLocating(true);
      setGpsStatus('searching');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const acc = Math.round(pos.coords.accuracy || 8);
          setCurrentCoords({ lat, lng, accuracy: acc });
          setGpsStatus('locked');
          setIsLocating(false);
          // Reverse geocode via free OpenStreetMap Nominatim or Hyderabad fallback
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
            .then(res => res.json())
            .then(data => {
              if (data && data.display_name) {
                const parts = data.display_name.split(',');
                const shortAddr = parts.slice(0, 3).join(',').trim();
                setCurrentAddress(shortAddr || data.display_name);
              }
            })
            .catch(() => {});
        },
        () => {
          setGpsStatus('locked');
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    }
  };

  useEffect(() => {
    captureLiveGPS();
  }, []);

  // Compute nearby responders sorted by distance to citizen
  const nearbyResponders = [...responders]
    .map(r => {
      const dLat = (r.location.lat - currentCoords.lat) * 111;
      const dLng = (r.location.lng - currentCoords.lng) * 105;
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      return { ...r, distanceKm: parseFloat(dist.toFixed(1)) };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 5);

  // Compute nearby hospitals sorted by distance to citizen
  const nearbyHospitals = [...hospitals]
    .map(h => {
      const dLat = (h.location.lat - currentCoords.lat) * 111;
      const dLng = (h.location.lng - currentCoords.lng) * 105;
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      return { ...h, distanceKm: parseFloat(dist.toFixed(1)) };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 4);

  // Send Test SMS alert to saved family contacts
  const handleTestSmsAlert = () => {
    sound.playWarningBeep();
    triggerHaptic([100, 50, 100]);
    setTestSmsSuccess(`SMS Alert Sent to ${contacts.length} Family Contacts: "Emergency Alert from Karthik at ${currentAddress}. Coordinates: ${currentCoords.lat.toFixed(4)}, ${currentCoords.lng.toFixed(4)}"`);
    setTimeout(() => setTestSmsSuccess(null), 5000);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    const newC: EmergencyContact = {
      id: `c-${Date.now()}`,
      name: newContactName.trim(),
      relationship: 'Emergency Contact',
      phone: newContactPhone.trim(),
      notifyOnSOS: true
    };
    setContacts(prev => [...prev, newC]);
    setNewContactName('');
    setNewContactPhone('');
  };

  // Handle SOS Hold
  const startHold = () => {
    setIsHolding(true);
    setHoldingProgress(0);
    sound.playCountdownTick(600);
    triggerHaptic([50]);

    let start = Date.now();
    const duration = 2000; // 2 seconds

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setHoldingProgress(progress);
      if (progress % 25 === 0) {
        sound.playCountdownTick(700 + progress * 3);
        triggerHaptic([40]);
      }
    }, 40);

    holdTimerRef.current = setTimeout(async () => {
      clearInterval(progressIntervalRef.current);
      setHoldingProgress(100);
      setIsHolding(false);
      triggerSOS(false);
    }, duration);
  };

  const cancelHold = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setIsHolding(false);
    setHoldingProgress(0);
  };

  // Trigger SOS
  const triggerSOS = async (isSilent: boolean = false) => {
    setIsSubmitting(true);
    try {
      await createEmergency({
        type: selectedType,
        description: descriptionText || (isSilent ? 'Silent SOS triggered via triple power-tap simulation' : `${selectedType} emergency reported`),
        location: {
          lat: currentCoords.lat,
          lng: currentCoords.lng,
          address: currentAddress,
          area: currentAddress.split(',')[0] || 'Hyderabad',
          accuracyMeters: currentCoords.accuracy
        },
        isSilent,
        citizenName: 'Karthik Rao',
        citizenPhone: '+91 98480 •••••'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Silent SOS Triple Tap Simulation
  const [silentTapCount, setSilentTapCount] = useState<number>(0);
  const handleSilentTap = () => {
    const next = silentTapCount + 1;
    setSilentTapCount(next);
    triggerHaptic([80]);
    if (next >= 3) {
      setSilentTapCount(0);
      triggerSOS(true);
    } else {
      setTimeout(() => setSilentTapCount(0), 1500);
    }
  };

  // Voice Note Simulation / Speech recognition
  const toggleVoiceRecording = () => {
    if (isVoiceRecording) {
      setIsVoiceRecording(false);
    } else {
      setIsVoiceRecording(true);
      sound.playCountdownTick(900);
      // Simulate real-time speech transcription
      setTimeout(() => {
        if (currentLanguage === 'hi') {
          setDescriptionText('साइबर टावर्स फ्लाईओवर पर दोपहिया वाहन दुर्घटना, बहुत खून बह रहा है, तुरंत एम्बुलेंस चाहिए।');
        } else if (currentLanguage === 'te') {
          setDescriptionText('సైబర్ టవర్స్ ఫ్లైఓవర్ వద్ద బైక్ ప్రమాదం జరిగింది, తీవ్ర రక్తస్రావం అవుతోంది, తక్షణమే అంబులెన్స్ పంపండి.');
        } else {
          setDescriptionText('Two-wheeler accident on Cyber Towers flyover ramp. Heavy bleeding, rider unconscious, need immediate ambulance!');
        }
        setIsVoiceRecording(false);
      }, 2500);
    }
  };

  // Chat sender
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeIncident) return;
    sendChatMessage(activeIncident.id, chatInput.trim(), 'citizen', 'Citizen Karthik');
    setChatInput('');
  };

  // Format ETA
  const formatEta = (secs?: number) => {
    if (!secs) return 'Calculating...';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#070b14] text-slate-100 flex flex-col pb-20 select-none">
      
      {/* Geofenced Area Warning Banner if Active */}
      {activeAlertForCitizen && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 px-4 py-2 flex items-center gap-2 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
          <div className="flex-1 truncate">
            <span className="font-bold">AREA ALERT:</span> {activeAlertForCitizen.title}
          </div>
        </div>
      )}

      {/* Low-Connectivity / Offline Banner */}
      {isOfflineMode && (
        <div className="bg-rose-950/80 border-b border-rose-500/30 px-4 py-2 flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-rose-400" />
            <span>Low-connectivity mode active (SMS Fallback)</span>
          </div>
          <button 
            onClick={() => setIsOfflineMode(false)}
            className="text-[10px] underline hover:text-white"
          >
            Go Online
          </button>
        </div>
      )}

      {/* Main View: Tracking View if Active Incident Exists, else SOS Creation View */}
      {activeIncident && activeIncident.status !== 'Resolved' ? (
        /* ================= ACTIVE LIVE TRACKING SCREEN ================= */
        <div className="flex-1 p-4 space-y-4 animate-in fade-in duration-300">
          
          {/* Header Status Card */}
          <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-xs font-mono font-bold tracking-wider text-red-400 uppercase">
                  {activeIncident.id}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                activeIncident.severity === 'Critical' ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {activeIncident.severity} {activeIncident.type}
              </span>
            </div>

            {/* ETA Countdown Display */}
            <div className="flex items-baseline justify-between py-2 border-y border-slate-800/80 my-2">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">{t.eta}</div>
                <div className="text-2xl font-black font-mono text-cyan-400 tracking-tight">
                  {formatEta(activeIncident.etaSeconds)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Assigned Unit</div>
                <div className="text-xs font-bold text-slate-200 truncate max-w-[170px]">
                  {activeIncident.assignedResponder?.name || 'Smart Dispatching...'}
                </div>
              </div>
            </div>

            {/* 6-Step Status Timeline */}
            <div className="mt-3 pt-1">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mb-2">
                <span>Timeline Status</span>
                <span className="text-emerald-400 font-bold">{activeIncident.status}</span>
              </div>
              <div className="flex items-center justify-between relative px-1">
                <div className="absolute top-2.5 left-2 right-2 h-0.5 bg-slate-800 z-0"></div>
                {['Reported', 'Verified', 'Assigned', 'En Route', 'Arrived', 'Resolved'].map((step, idx) => {
                  const stepIndex = ['Reported', 'Verified', 'Assigned', 'En Route', 'Arrived', 'Resolved'].indexOf(activeIncident.status);
                  const isDone = idx <= stepIndex;
                  const isCurrent = idx === stepIndex;
                  return (
                    <div key={step} className="flex flex-col items-center relative z-10">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        isCurrent 
                          ? 'bg-red-500 text-white ring-4 ring-red-500/20 scale-110' 
                          : isDone 
                          ? 'bg-emerald-500 text-black' 
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[8px] mt-1 text-center font-sans ${isCurrent ? 'text-white font-bold' : 'text-slate-500'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Leaflet Route Map */}
          <div className="h-56 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative">
            <EmergencyMap
              incidents={[activeIncident]}
              responders={activeIncident.assignedResponder ? [activeIncident.assignedResponder] : []}
              hospitals={activeIncident.assignedHospital ? [activeIncident.assignedHospital] : []}
              selectedIncident={activeIncident}
              center={[activeIncident.location.lat, activeIncident.location.lng]}
              zoom={14}
              interactive={true}
              drawRoute={true}
            />
          </div>

          {/* AI Triage & Immediate First-Aid Box */}
          {activeIncident.aiTriage && (
            <div className="rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/30 p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wide">
                  <HeartPulse className="w-4 h-4 text-red-400" />
                  <span>{t.firstAidHeading}</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                  AI Conf: {activeIncident.aiTriage.confidence}%
                </span>
              </div>
              <ul className="space-y-2 mt-2">
                {activeIncident.aiTriage.firstAidInstructions.map((instruction, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                    <span className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
              {activeIncident.goodSamaritansAlerted && (
                <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/20">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{activeIncident.goodSamaritansAlerted} Good Samaritan CPR volunteers alerted within 500m</span>
                </div>
              )}
            </div>
          )}

          {/* Action Row: Call Responder, Live Chat, WhatsApp Share */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setShowCallModal(true)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition active:scale-95"
            >
              <Phone className="w-4 h-4 text-emerald-400 mb-1" />
              <span className="text-[10px] font-semibold">{t.callResponder}</span>
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(`EMERGENCY: I triggered SOS on Lifeline India! Location: ${activeIncident.location.address}. Track live ETA: ${window.location.origin}`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition active:scale-95"
            >
              <Share2 className="w-4 h-4 text-emerald-500 mb-1" />
              <span className="text-[10px] font-semibold">Share WhatsApp</span>
            </a>

            <button
              onClick={() => updateIncidentStatus(activeIncident.id, 'Resolved', 'Citizen verified situation stabilized')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 hover:bg-emerald-950/80 border border-slate-800 hover:border-emerald-600/40 text-slate-200 transition active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-blue-400 mb-1" />
              <span className="text-[10px] font-semibold">Mark Resolved</span>
            </button>
          </div>

          {/* In-App Live Dispatch Chat */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3 shadow-lg">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800 text-xs font-bold text-slate-300">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Responder & Dispatch Channel</span>
            </div>
            <div className="max-h-36 overflow-y-auto space-y-2 pr-1 text-xs">
              {activeIncident.chatMessages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`p-2 rounded-xl text-xs ${
                    msg.sender === 'citizen' 
                      ? 'bg-blue-600/20 text-blue-200 ml-6 border border-blue-500/30' 
                      : 'bg-slate-950 text-slate-300 mr-6 border border-slate-800'
                  }`}
                >
                  <div className="text-[9px] font-mono text-slate-400 mb-0.5">{msg.senderName}</div>
                  <div>{msg.text}</div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendChat} className="mt-2 flex gap-1.5">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Message paramedic / dispatcher..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>

          {/* Hospital Aware Routing Info */}
          {activeIncident.assignedHospital && (
            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 flex items-center justify-between text-xs">
              <div>
                <div className="text-[10px] text-slate-400">Pre-Alerted Hospital</div>
                <div className="font-bold text-slate-200">{activeIncident.assignedHospital.name}</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">
                  {activeIncident.assignedHospital.availableIcuBeds} ICU beds & {activeIncident.assignedHospital.availableTraumaBeds} Trauma bays ready
                </div>
              </div>
              <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">
                {activeIncident.assignedHospital.area}
              </span>
            </div>
          )}

          {/* Privacy Note */}
          <div className="text-center text-[10px] text-slate-500 pt-2 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span>{t.privacyNotice}</span>
          </div>

        </div>
      ) : (
        /* ================= NEW SOS CREATION SCREEN ================= */
        <div className="flex-1 p-4 flex flex-col justify-between space-y-4">
          
          {/* Top Bar: Location & Silent SOS simulation */}
          <div>
            <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl mb-3 shadow">
              <div className="flex items-center gap-2 truncate">
                <MapPin className={`w-4 h-4 text-red-500 shrink-0 ${isLocating ? 'animate-spin text-cyan-400' : 'animate-pulse'}`} />
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-emerald-400 uppercase font-mono font-bold">
                      {isLocating ? 'Acquiring GPS...' : `GPS Lock (±${currentCoords.accuracy}m)`}
                    </span>
                    <span className="text-[9px] bg-slate-800 text-slate-400 font-mono px-1 rounded">No Key Needed</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 truncate">{currentAddress}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={captureLiveGPS}
                  title="Re-acquire live device GPS"
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono bg-emerald-950/60 hover:bg-emerald-900/60 px-2 py-1 rounded border border-emerald-800/40 transition active:scale-95"
                >
                  {isLocating ? 'Locating...' : 'Locate Me'}
                </button>
                <button
                  onClick={() => setShowManualPinModal(true)}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono bg-cyan-950/60 hover:bg-cyan-900/60 px-2 py-1 rounded border border-cyan-800/40 transition"
                >
                  {t.manualPin}
                </button>
              </div>
            </div>

            {/* Silent SOS Triple Power-Tap simulation trigger */}
            <div className="flex items-center justify-between bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/20 p-2.5 rounded-xl mb-4">
              <div>
                <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  {t.silentSos}
                </div>
                <div className="text-[10px] text-slate-400">{t.silentSosTip}</div>
              </div>
              <button
                onClick={handleSilentTap}
                className="text-xs font-bold bg-purple-600 hover:bg-purple-500 active:scale-95 px-3 py-1.5 rounded-lg text-white shadow"
              >
                {silentTapCount > 0 ? `Tap again (${3 - silentTapCount})` : 'Simulate 3x Tap'}
              </button>
            </div>

            {/* Emergency Type Selector */}
            <div className="mb-4">
              <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                {t.emergencyType}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { type: 'Medical' as EmergencyType, icon: HeartPulse, color: 'text-rose-400 border-rose-500/30' },
                  { type: 'Accident' as EmergencyType, icon: Car, color: 'text-amber-400 border-amber-500/30' },
                  { type: 'Fire' as EmergencyType, icon: Flame, color: 'text-orange-400 border-orange-500/30' },
                  { type: 'Women Safety' as EmergencyType, icon: ShieldAlert, color: 'text-pink-400 border-pink-500/30' },
                ].map(({ type, icon: Icon, color }) => (
                  <button
                    key={type}
                    onClick={() => { setSelectedType(type); triggerHaptic([30]); }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      selectedType === type
                        ? `bg-slate-800 ${color} ring-2 ring-red-500 shadow-lg scale-105`
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold text-center leading-tight">
                      {type === 'Women Safety' ? 'Women' : type}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Input or Text Input */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-3 mb-2 shadow">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-slate-400">AI Triage Input (EN / हिन्दी / తెలుగు)</span>
                <button
                  onClick={toggleVoiceRecording}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                    isVoiceRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isVoiceRecording ? t.voiceListening : t.voiceNote}</span>
                </button>
              </div>
              <textarea
                value={descriptionText}
                onChange={e => setDescriptionText(e.target.value)}
                placeholder={t.typeDescription}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none"
              />
            </div>
          </div>

          {/* ============ GIANT CENTRAL SOS BUTTON ============ */}
          <div className="flex flex-col items-center justify-center my-auto py-2">
            <div className="relative flex items-center justify-center">
              {/* Outer Pulsing Wave Rings */}
              <div className="absolute w-60 h-60 rounded-full bg-red-600/10 animate-ping pointer-events-none" />
              <div className="absolute w-48 h-48 rounded-full border border-red-500/20 animate-pulse pointer-events-none" />

              {/* Circular SVG Progress Ring */}
              <svg className="w-48 h-48 -rotate-90 transform pointer-events-none absolute">
                <circle
                  cx="96"
                  cy="96"
                  r="86"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800/80"
                  fill="transparent"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="86"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-red-500 transition-all duration-75"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 86}
                  strokeDashoffset={2 * Math.PI * 86 * (1 - holdingProgress / 100)}
                  strokeLinecap="round"
                />
              </svg>

              {/* The Actual Touch / Hold Button */}
              <button
                onMouseDown={startHold}
                onMouseUp={cancelHold}
                onMouseLeave={cancelHold}
                onTouchStart={startHold}
                onTouchEnd={cancelHold}
                disabled={isSubmitting}
                className={`w-38 h-38 rounded-full bg-gradient-to-b from-red-600 to-red-800 shadow-2xl flex flex-col items-center justify-center text-white font-extrabold transition-all duration-150 transform ${
                  isHolding ? 'scale-95 shadow-red-500/50' : 'hover:scale-105 active:scale-95'
                }`}
                style={{
                  boxShadow: isHolding ? '0 0 40px rgba(239, 68, 68, 0.8)' : '0 10px 30px rgba(220, 38, 38, 0.4)'
                }}
              >
                <span className="text-4xl font-black tracking-widest drop-shadow-md">SOS</span>
                <span className="text-[10px] font-sans font-bold tracking-wider uppercase mt-1 opacity-90">
                  {isHolding ? `${Math.round((2000 - (holdingProgress * 20)) / 100) / 10}s` : 'HOLD 2 SEC'}
                </span>
              </button>
            </div>

            <p className="mt-4 text-xs font-semibold text-slate-400 text-center">
              {isHolding ? t.sosHolding : t.sosButton}
            </p>
          </div>

          {/* Quick Action Drawer Pills: Nearby Services & Emergency Contacts */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => setShowNearbyServicesModal(true)}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-cyan-300 transition shadow"
            >
              <HospitalIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nearby Services ({nearbyResponders.length + nearbyHospitals.length})</span>
            </button>

            <button
              onClick={() => setShowContactsModal(true)}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-purple-300 transition shadow"
            >
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Contacts ({contacts.length} Alerted)</span>
            </button>
          </div>

          {/* Quick-Dial Helpline Numbers */}
          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">
              {t.quickDial}
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {[
                { label: '112', title: 'National' },
                { label: '108', title: 'Ambulance' },
                { label: '102', title: 'Mother/Child' },
                { label: '101', title: 'Fire' },
                { label: '100', title: 'Police' },
                { label: '1091', title: 'Women' },
              ].map(tile => (
                <a
                  key={tile.label}
                  href={`tel:${tile.label}`}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl p-2 text-center transition active:scale-90"
                >
                  <div className="text-xs font-mono font-bold text-red-400">{tile.label}</div>
                  <div className="text-[8px] text-slate-400 truncate">{tile.title}</div>
                </a>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Manual Pin Location Selector Modal */}
      {showManualPinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Adjust Emergency Location
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Select or confirm Hyderabad landmark for precision dispatch:
            </p>
            <div className="space-y-1.5 mb-4">
              {[
                'Cyber Towers Flyover, Hitech City, Hyderabad',
                'Road No 36, Jubilee Hills Checkpost, Hyderabad',
                'Durgam Cheruvu Cable Bridge Pedestrian Path, Madhapur',
                'Gachibowli Stadium Junction, Financial District',
                'Banjara Hills Road No 12 (near Care Hospital)'
              ].map(addr => (
                <button
                  key={addr}
                  onClick={() => {
                    setCurrentAddress(addr);
                    setShowManualPinModal(false);
                  }}
                  className="w-full text-left p-2 rounded-xl text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200"
                >
                  {addr}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowManualPinModal(false)}
              className="w-full py-2 bg-slate-800 text-xs text-white rounded-xl font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Call Responder Masked Phone Modal */}
      {showCallModal && activeIncident && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Encrypted Calling Gateway
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Calling Paramedic Ravi ({activeIncident.assignedResponder?.callSign || '108-ALS'}). Your personal phone number is securely masked.
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 mb-4">
              Connecting via Telephony Proxy: +91 40 •••• 108
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  sound.playSuccessChime();
                  setShowCallModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Simulate Call Answered
              </button>
              <button
                onClick={() => setShowCallModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                End
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nearby Services & Responders Modal */}
      {showNearbyServicesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HospitalIcon className="w-4 h-4 text-emerald-400" />
                Nearby Emergency Units (&lt; 3km)
              </h3>
              <button onClick={() => setShowNearbyServicesModal(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Nearest emergency responders & trauma hospitals relative to your live GPS coordinates:
            </p>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1 text-xs">
              <div>
                <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase mb-1.5">
                  Closest Hospitals with ICU Availability
                </div>
                <div className="space-y-1.5">
                  {nearbyHospitals.map(h => (
                    <div key={h.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white text-[11px]">{h.name}</div>
                        <div className="text-[10px] text-slate-400">{h.area} • {h.traumaLevel}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 font-bold font-mono">{h.availableIcuBeds} ICU</span>
                        <div className="text-[10px] text-cyan-300 font-mono">{h.distanceKm} km</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase mb-1.5">
                  Closest Available Mobile Responders
                </div>
                <div className="space-y-1.5">
                  {nearbyResponders.map(r => (
                    <div key={r.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white text-[11px]">{r.name}</div>
                        <div className="text-[10px] text-slate-400">{r.type} • {r.location.area}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-cyan-400 font-mono text-[10px] font-bold">{r.distanceKm} km away</span>
                        <div className="text-[9px] text-slate-500 font-mono">ETA: {Math.max(2, Math.round(r.distanceKm * 2))}m</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowNearbyServicesModal(false)}
              className="mt-3 w-full py-2 bg-slate-800 text-xs text-white rounded-xl font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Emergency Contacts & SMS Broadcast Modal */}
      {showContactsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                Emergency Family Contacts
              </h3>
              <button onClick={() => setShowContactsModal(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Saved trusted contacts who automatically receive SMS alerts with your live coordinates whenever SOS is pressed:
            </p>

            {testSmsSuccess && (
              <div className="mb-3 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-[11px] text-emerald-200">
                {testSmsSuccess}
              </div>
            )}

            <button
              onClick={handleTestSmsAlert}
              className="w-full mb-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow"
            >
              Simulate Live SMS Alert Broadcast
            </button>

            <div className="overflow-y-auto space-y-1.5 flex-1 pr-1 text-xs mb-3">
              {contacts.map(c => (
                <div key={c.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">{c.name}</div>
                    <div className="text-[10px] text-slate-400">{c.phone} • {c.relationship}</div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    SOS Active
                  </span>
                </div>
              ))}
            </div>

            {/* Add Contact Form */}
            <form onSubmit={handleAddContact} className="pt-2 border-t border-slate-800 space-y-1.5 text-xs">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Add New Trusted Contact</div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Name"
                  value={newContactName}
                  onChange={e => setNewContactName(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white"
                />
                <input
                  type="tel"
                  placeholder="+91 Phone"
                  value={newContactPhone}
                  onChange={e => setNewContactPhone(e.target.value)}
                  className="w-28 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white"
                />
                <button type="submit" className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg text-white font-bold">
                  +
                </button>
              </div>
            </form>

            <button
              onClick={() => setShowContactsModal(false)}
              className="mt-3 w-full py-2 bg-slate-800 text-xs text-white rounded-xl font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
