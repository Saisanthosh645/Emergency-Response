import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useEmergency, calculateHaversineDistanceKm } from '../../context/EmergencyContext';
import { TRANSLATIONS } from '../../utils/i18n';
import { sound, triggerHaptic } from '../../utils/audio';
import { EmergencyType, EmergencyContact, SeverityLevel } from '../../types';
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
  Check,
  Plus,
  AlertCircle,
  Navigation,
  Bell,
  ArrowRight,
  Zap,
  Ambulance
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
    hospitals,
    citizenLocation,
    setCitizenLocation,
    escalateIncident,
    sendEmergencySmsBroadcast,
    toggleGreenCorridor
  } = useEmergency();

  const [smsSentFeedback, setSmsSentFeedback] = useState<string | null>(null);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // View Mode: 'create' = Report SOS Form, 'tracking' = Live Mission Telemetry
  const [viewMode, setViewMode] = useState<'create' | 'tracking'>('create');

  // SOS Press-and-Hold State
  const [holdingProgress, setHoldingProgress] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const holdTimerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  // Form State
  const [selectedType, setSelectedType] = useState<EmergencyType>('Medical');
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel>('Critical');
  const [descriptionText, setDescriptionText] = useState<string>('');
  const [isVoiceRecording, setIsVoiceRecording] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [showManualPinModal, setShowManualPinModal] = useState<boolean>(false);
  const [showNearbyServicesModal, setShowNearbyServicesModal] = useState<boolean>(false);
  const [showContactsModal, setShowContactsModal] = useState<boolean>(false);
  const [testSmsSuccess, setTestSmsSuccess] = useState<string | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>(citizenLocation.address);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number; accuracy: number }>({
    lat: citizenLocation.lat,
    lng: citizenLocation.lng,
    accuracy: citizenLocation.accuracyMeters || 6
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

  // Location updater syncing local and global context
  const handleLocationUpdate = (lat: number, lng: number, address: string, accuracy: number = 5) => {
    setCurrentCoords({ lat, lng, accuracy });
    setCurrentAddress(address);
    setCitizenLocation({
      lat,
      lng,
      address,
      area: address.split(',')[0] || 'Hyderabad',
      accuracyMeters: accuracy
    });
  };

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
          setGpsStatus('locked');
          setIsLocating(false);
          // Reverse geocode
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
            .then(res => res.json())
            .then(data => {
              if (data && data.display_name) {
                const parts = data.display_name.split(',');
                const shortAddr = parts.slice(0, 3).join(',').trim();
                handleLocationUpdate(lat, lng, shortAddr || data.display_name, acc);
              } else {
                handleLocationUpdate(lat, lng, `Hyderabad GPS (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`, acc);
              }
            })
            .catch(() => {
              handleLocationUpdate(lat, lng, `Hyderabad GPS (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`, acc);
            });
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

  // Compute nearby responders dynamically using exact Haversine distance
  const nearbyResponders = useMemo(() => {
    return [...responders]
      .map(r => {
        const distKm = calculateHaversineDistanceKm(currentCoords.lat, currentCoords.lng, r.location.lat, r.location.lng);
        const etaMins = Math.max(1, Math.round((distKm / 35) * 60));
        return { ...r, distanceKm: distKm, etaMins };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [responders, currentCoords.lat, currentCoords.lng]);

  // Compute nearby hospitals dynamically using exact Haversine distance
  const nearbyHospitals = useMemo(() => {
    return [...hospitals]
      .map(h => {
        const distKm = calculateHaversineDistanceKm(currentCoords.lat, currentCoords.lng, h.location.lat, h.location.lng);
        const etaMins = Math.max(2, Math.round((distKm / 35) * 60));
        return { ...h, distanceKm: distKm, etaMins };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [hospitals, currentCoords.lat, currentCoords.lng]);

  // AI Emergency Type & Severity Classification Engine
  const aiClassification = useMemo(() => {
    const text = descriptionText.toLowerCase().trim();
    if (!text || text.length < 4) return null;

    let suggestedType: EmergencyType = selectedType;
    let suggestedSeverity: SeverityLevel = selectedSeverity;
    let confidence = 88;

    if (
      text.includes('unconscious') || 
      text.includes('cardiac') || 
      text.includes('not breathing') || 
      text.includes('heavy bleeding') || 
      text.includes('severe head') || 
      text.includes('chest pain') || 
      text.includes('crushed') ||
      text.includes('stroke')
    ) {
      suggestedSeverity = 'Critical';
      suggestedType = text.includes('crash') || text.includes('hit') || text.includes('bike') || text.includes('car') ? 'Accident' : 'Medical';
      confidence = 98;
    } else if (text.includes('fire') || text.includes('smoke') || text.includes('cylinder') || text.includes('blast') || text.includes('explosion')) {
      suggestedType = 'Fire';
      suggestedSeverity = text.includes('trapped') || text.includes('cylinder') || text.includes('building') ? 'Critical' : 'High';
      confidence = 96;
    } else if (text.includes('follow') || text.includes('harass') || text.includes('stalk') || text.includes('alone') || text.includes('threat') || text.includes('danger')) {
      suggestedType = 'Women Safety';
      suggestedSeverity = text.includes('attack') || text.includes('grabbed') ? 'Critical' : 'High';
      confidence = 95;
    } else if (text.includes('accident') || text.includes('crash') || text.includes('rider') || text.includes('collision')) {
      suggestedType = 'Accident';
      suggestedSeverity = text.includes('bleed') || text.includes('injured') ? 'High' : 'Moderate';
      confidence = 92;
    }

    if (suggestedType === selectedType && suggestedSeverity === selectedSeverity) {
      return null; // Already matches user selection
    }

    return { suggestedType, suggestedSeverity, confidence };
  }, [descriptionText, selectedType, selectedSeverity]);

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
    const duration = 2000;

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
        severity: selectedSeverity,
        description: descriptionText || (isSilent ? 'Silent SOS triggered via triple power-tap simulation' : `${selectedType} emergency reported (${selectedSeverity} severity)`),
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
      setViewMode('tracking');
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

  const recognitionRef = useRef<any>(null);

  // Voice Note Recording (Web Speech API with graceful multilingual fallback)
  const fallbackVoiceNote = () => {
    setTimeout(() => {
      if (currentLanguage === 'hi') {
        setDescriptionText('साइबर टावर्स फ्लाईओवर पर दोपहिया वाहन दुर्घटना, बहुत खून बह रहा है, तुरंत एम्बुलेंस चाहिए।');
      } else if (currentLanguage === 'te') {
        setDescriptionText('సైబర్ టవర్స్ ఫ్లైఓవర్ వద్ద బైక్ ప్రమాదం జరిగింది, తీవ్ర రక్తస్రావం అవుతోంది, తక్షణమే అంబులెన్స్ పంపండి.');
      } else if (currentLanguage === 'mr') {
        setDescriptionText('सायबर टॉवर्स उड्डाणपुलावर दुचाकीचा अपघात, खूप रक्तस्त्राव होत आहे, त्वरित रुग्णवाहिका हवी आहे.');
      } else {
        setDescriptionText('Two-wheeler accident on Cyber Towers flyover ramp. Heavy bleeding, rider unconscious, need immediate ambulance!');
      }
      setIsVoiceRecording(false);
    }, 2200);
  };

  const toggleVoiceRecording = () => {
    if (isVoiceRecording) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsVoiceRecording(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsVoiceRecording(true);
    sound.playCountdownTick(900);

    const langMap: Record<string, string> = {
      hi: 'hi-IN',
      te: 'te-IN',
      mr: 'mr-IN',
      en: 'en-IN'
    };

    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        recognition.lang = langMap[currentLanguage] || 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript.trim()) {
            setDescriptionText(transcript);
          }
        };

        recognition.onerror = () => {
          fallbackVoiceNote();
        };

        recognition.onend = () => {
          setIsVoiceRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch {
        // Fallback below
      }
    }

    fallbackVoiceNote();
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
    <div className="w-full max-w-md mx-auto bg-[#070b14] text-slate-100 flex flex-col pb-6 select-none">
      
      {/* Geofenced Area Warning Banner if Active */}
      {activeAlertForCitizen && (
        <div className="bg-gradient-to-r from-amber-950/90 via-red-950/80 to-slate-900 border-b border-amber-500/50 px-4 py-3 text-xs text-amber-200 animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 font-black text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
              <span>GEOFENCED EMERGENCY HAZARD IN YOUR AREA</span>
            </div>
            <span className="text-[9px] font-mono bg-amber-500/20 px-2 py-0.5 rounded text-amber-300 border border-amber-500/40">
              Radius: {activeAlertForCitizen.radiusKm} km
            </span>
          </div>
          <div className="text-[11px] text-slate-100 font-semibold">
            {activeAlertForCitizen.title}: {activeAlertForCitizen.description}
          </div>
          <div className="flex items-center justify-between text-[10px] text-amber-400 font-mono pt-1">
            <span>Epicenter: {activeAlertForCitizen.center.area}</span>
            <span>Distance: ~{calculateHaversineDistanceKm(currentCoords.lat, currentCoords.lng, activeAlertForCitizen.center.lat, activeAlertForCitizen.center.lng)} km</span>
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

      {/* Top Mode Switcher Bar */}
      {activeIncident && activeIncident.status !== 'Resolved' && (
        <div className="px-4 pt-3 flex gap-2">
          <button
            onClick={() => setViewMode('create')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              viewMode === 'create'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Report New SOS</span>
          </button>
          <button
            onClick={() => setViewMode('tracking')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              viewMode === 'tracking'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="truncate">Live Track ({activeIncident.id})</span>
          </button>
        </div>
      )}

      {/* Main View: Tracking View or SOS Creation View */}
      {viewMode === 'tracking' && activeIncident && activeIncident.status !== 'Resolved' ? (
        /* ================= ACTIVE LIVE TRACKING SCREEN ================= */
        <div className="flex-1 p-4 space-y-4 animate-in fade-in duration-300">
          
          {/* Quick Action: Report Another Emergency */}
          <div className="flex justify-between items-center pb-1">
            <button
              onClick={() => setViewMode('create')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5 text-red-400" />
              <span>Report Another Incident</span>
            </button>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              Live Mission Active
            </span>
          </div>
          
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

            {/* Live Ticking ETA Countdown Display */}
            <div className="flex items-baseline justify-between py-2 border-y border-slate-800/80 my-2">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">{t.eta}</div>
                <div className="text-2xl font-black font-mono text-cyan-400 tracking-tight flex items-center gap-1.5">
                  <Clock className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>{formatEta(activeIncident.etaSeconds)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Assigned Unit</div>
                <div className="text-xs font-bold text-slate-200 truncate max-w-[170px]">
                  {activeIncident.assignedResponder?.name || 'Smart Dispatching...'}
                </div>
                <div className="text-[10px] font-mono text-emerald-400">
                  {activeIncident.assignedResponder?.callSign}
                </div>
              </div>
            </div>

            {/* 6-Step Status Timeline */}
            <div className="mt-3 pt-1">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mb-2">
                <span>Real-Time Status Progression</span>
                <span className="text-emerald-400 font-bold uppercase">{activeIncident.status}</span>
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

          {/* Dynamic Live Leaflet Map */}
          <div className="h-60 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative">
            <EmergencyMap
              incidents={[activeIncident]}
              responders={responders}
              hospitals={hospitals}
              areaAlerts={activeAlertForCitizen ? [activeAlertForCitizen] : []}
              selectedIncident={activeIncident}
              userLocation={{ lat: currentCoords.lat, lng: currentCoords.lng, accuracy: currentCoords.accuracy }}
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

          {/* Incident Escalation Alert Banner */}
          {((activeIncident.escalationLevel ?? activeIncident.escalationTier ?? 0) > 0) && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-red-950/80 border border-red-500/60 shadow-lg shadow-red-950/50">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse shrink-0" />
                <div>
                  <div className="text-xs font-bold text-red-200">
                    Tier {activeIncident.escalationLevel ?? activeIncident.escalationTier} SLA Escalation Active
                  </div>
                  <div className="text-[10px] text-red-300">
                    {(activeIncident.escalationLevel ?? activeIncident.escalationTier) === 1 && 'Search perimeter expanded + Multi-agency standby.'}
                    {(activeIncident.escalationLevel ?? activeIncident.escalationTier) === 2 && 'Zonal Supervisor paged + Police PCR escort dispatched.'}
                    {(activeIncident.escalationLevel ?? activeIncident.escalationTier) >= 3 && 'Disaster Command & City Emergency Operations Siren engaged.'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-600 font-mono font-bold text-white uppercase shrink-0">
                Tier {activeIncident.escalationLevel ?? activeIncident.escalationTier}
              </span>
            </div>
          )}

          {/* Traffic Green Corridor Pre-emption Banner */}
          {activeIncident.greenCorridorActive && (
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs shadow-lg shadow-emerald-950/40">
              <Zap className="w-5 h-5 text-emerald-400 animate-pulse shrink-0" />
              <div>
                <div className="font-bold text-emerald-300">Traffic Green Corridor Engaged</div>
                <div className="text-[10px] text-emerald-400/90">
                  Hyderabad Traffic Police pre-empted signals along transit route for zero-stoppage arrival.
                </div>
              </div>
            </div>
          )}

          {/* Coordinated Secondary Responders Badge */}
          {activeIncident.coordinatingResponders && activeIncident.coordinatingResponders.length > 0 && (
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-blue-500/30 text-xs">
              <div className="flex items-center justify-between text-blue-300 font-semibold mb-2">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Coordinated Backup Units ({activeIncident.coordinatingResponders.length})</span>
                </span>
                <span className="text-[9px] font-mono text-emerald-400 uppercase bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Multi-Unit Sync
                </span>
              </div>
              <div className="space-y-1.5">
                {activeIncident.coordinatingResponders.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-950/70 p-2 rounded-xl border border-slate-800 text-[11px]">
                    <div className="flex items-center gap-2">
                      <Ambulance className="w-3.5 h-3.5 text-cyan-400" />
                      <div>
                        <span className="font-medium text-slate-200">{item.responder?.name || 'Tactical Unit'}</span>
                        <span className="text-[9px] text-slate-400 ml-1.5">({item.responder?.callSign})</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-cyan-400 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {item.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live SMS Sent Feedback Notification */}
          {smsSentFeedback && (
            <div className="p-2.5 rounded-xl bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{smsSentFeedback}</span>
            </div>
          )}

          {/* Action Row: Call Responder, SMS Broadcast, GPS Route, WhatsApp, Escalate, Mark Resolved */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setShowCallModal(true)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition active:scale-95"
            >
              <Phone className="w-4 h-4 text-emerald-400 mb-1" />
              <span className="text-[10px] font-semibold">{t.callResponder}</span>
            </button>

            <button
              onClick={() => {
                sendEmergencySmsBroadcast(activeIncident.id);
                sound.playAlert();
                triggerHaptic([40, 40, 80]);
                setSmsSentFeedback('Encrypted SMS broadcast dispatched to all 3 emergency contacts with live GPS telemetry.');
                setTimeout(() => setSmsSentFeedback(null), 6000);
              }}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition active:scale-95"
            >
              <Bell className="w-4 h-4 text-amber-400 mb-1" />
              <span className="text-[10px] font-semibold">Alert Family (SMS)</span>
            </button>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${activeIncident.location.lat},${activeIncident.location.lng}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition active:scale-95"
            >
              <Navigation className="w-4 h-4 text-cyan-400 mb-1" />
              <span className="text-[10px] font-semibold">GPS Route</span>
            </a>

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
              onClick={() => {
                escalateIncident(activeIncident.id, undefined, 'Citizen flagged urgent situation degradation on ground');
                triggerHaptic([60, 60, 100]);
              }}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 hover:bg-red-950/60 border border-slate-800 hover:border-red-500/50 text-slate-200 transition active:scale-95"
            >
              <AlertTriangle className="w-4 h-4 text-red-400 mb-1" />
              <span className="text-[10px] font-semibold">Escalate Backup</span>
            </button>

            <button
              onClick={() => updateIncidentStatus(activeIncident.id, 'Resolved', 'Citizen verified situation stabilized')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 hover:bg-emerald-950/80 border border-slate-800 hover:border-emerald-600/40 text-slate-200 transition active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-blue-400 mb-1" />
              <span className="text-[10px] font-semibold">Mark Resolved</span>
            </button>
          </div>

          {/* In-App Live Dispatch Chat with Real Automated Paramedic Responses */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3 shadow-lg">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800 text-xs font-bold text-slate-300">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Live Responder & Dispatch Channel</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Unit Connected
              </span>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1 text-xs">
              {activeIncident.chatMessages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`p-2.5 rounded-xl text-xs ${
                    msg.sender === 'citizen' 
                      ? 'bg-blue-600/20 text-blue-200 ml-6 border border-blue-500/30' 
                      : 'bg-slate-950 text-slate-200 mr-6 border border-slate-800'
                  }`}
                >
                  <div className="text-[9px] font-mono text-cyan-400 mb-0.5">{msg.senderName}</div>
                  <div>{msg.text}</div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendChat} className="mt-2.5 flex gap-1.5">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask paramedic (e.g., 'How to stop bleeding?', 'Where are you?')..."
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
                <div className="text-[10px] text-slate-400">Pre-Alerted Emergency Hospital</div>
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
        /* ================= 5-STEP EMERGENCY INCIDENT REPORT FORM ================= */
        <div className="flex-1 p-4 space-y-4">
          
          {/* STEP 1: SELECT EMERGENCY TYPE */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center text-[10px] font-bold">1</span>
                Emergency Type
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Select incident type</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { type: 'Medical' as EmergencyType, label: 'Medical', icon: HeartPulse, color: 'text-rose-400 border-rose-500/40 bg-rose-950/20' },
                { type: 'Accident' as EmergencyType, label: 'Accident', icon: Car, color: 'text-amber-400 border-amber-500/40 bg-amber-950/20' },
                { type: 'Fire' as EmergencyType, label: 'Fire', icon: Flame, color: 'text-orange-400 border-orange-500/40 bg-orange-950/20' },
                { type: 'Women Safety' as EmergencyType, label: 'Women', icon: ShieldAlert, color: 'text-pink-400 border-pink-500/40 bg-pink-950/20' },
              ].map(({ type, label, icon: Icon, color }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => { setSelectedType(type); triggerHaptic([30]); }}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                    selectedType === type
                      ? `bg-slate-800 ${color} ring-2 ring-red-500 shadow-lg scale-102 font-bold`
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-[11px] font-bold">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: DESCRIBE WHAT HAPPENED */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center text-[10px] font-bold">2</span>
                Describe What Happened
              </span>
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
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
              placeholder="e.g. Two-wheeler collision on flyover, heavy bleeding, patient unconscious..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-red-500 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none resize-none transition"
            />

            {/* AI Classification Suggestion Pill */}
            {aiClassification && (
              <div className="bg-cyan-950/40 border border-cyan-500/40 rounded-xl p-2.5 flex items-center justify-between text-xs animate-in fade-in">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase flex items-center gap-1">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    AI Triage Suggestion ({aiClassification.confidence}% match)
                  </span>
                  <div className="text-[11px] text-slate-200 mt-0.5">
                    Classified as <strong className="text-white">{aiClassification.suggestedSeverity} {aiClassification.suggestedType}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSeverity(aiClassification.suggestedSeverity);
                    setSelectedType(aiClassification.suggestedType);
                    triggerHaptic([30]);
                  }}
                  className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[10px] font-bold shrink-0 shadow transition active:scale-95"
                >
                  Apply
                </button>
              </div>
            )}

            {/* Quick symptom tags for 1-tap fast reporting */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {(selectedType === 'Medical' ? ['Loss of consciousness', 'Severe chest pain', 'Heavy bleeding', 'Breathing difficulty'] :
                selectedType === 'Accident' ? ['Multi-vehicle crash', 'Pedestrian hit', 'Rider down', 'Trapped in vehicle'] :
                selectedType === 'Fire' ? ['Building smoke', 'Gas cylinder leak', 'Trapped occupants', 'Electrical spark'] :
                ['Being followed', 'Transit harassment', 'Threat of assault', 'Immediate rescue']
              ).map(chip => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setDescriptionText(prev => prev ? `${prev}, ${chip}` : chip);
                    triggerHaptic([20]);
                  }}
                  className="text-[10px] bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-700 px-2 py-0.5 rounded-lg transition active:scale-95"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 3: SHARE CURRENT LOCATION & NEARBY SERVICES IDENTIFICATION */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center text-[10px] font-bold">3</span>
                Automatic Location Capture
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={captureLiveGPS}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-800/40 transition active:scale-95"
                >
                  {isLocating ? 'Pinging GPS...' : 'Locate Me'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowManualPinModal(true)}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-800/40 transition"
                >
                  Landmarks
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800/80">
              <MapPin className={`w-4 h-4 text-red-500 shrink-0 ${isLocating ? 'animate-spin text-cyan-400' : 'animate-pulse'}`} />
              <div className="truncate flex-1">
                <div className="text-xs font-semibold text-slate-200 truncate">{currentAddress}</div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  Coordinates: {currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)} (±{currentCoords.accuracy}m)
                </div>
              </div>
            </div>

            {/* Nearby Responder & Hospital Identification Card */}
            <div className="bg-slate-950/90 rounded-xl p-2.5 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Ambulance className="w-3.5 h-3.5" />
                  Nearby Emergency Units Identified
                </span>
                <button
                  type="button"
                  onClick={() => setShowNearbyServicesModal(true)}
                  className="text-cyan-400 hover:underline"
                >
                  View All ({nearbyResponders.length + nearbyHospitals.length})
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <div className="text-[9px] text-slate-400 uppercase">Closest Responder</div>
                  <div className="font-bold text-slate-200 text-[11px] truncate">
                    {nearbyResponders[0]?.callSign || '108-HYD-ALS-01'}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono">
                    {nearbyResponders[0]?.distanceKm} km • ETA {nearbyResponders[0]?.etaMins}m
                  </div>
                </div>

                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <div className="text-[9px] text-slate-400 uppercase">Nearest Trauma Center</div>
                  <div className="font-bold text-slate-200 text-[11px] truncate">
                    {nearbyHospitals[0]?.name || 'Apollo Jubilee'}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    {nearbyHospitals[0]?.availableIcuBeds} ICU Beds • {nearbyHospitals[0]?.distanceKm} km
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* STEP 4: SELECT SEVERITY */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center text-[10px] font-bold">4</span>
                Select Severity Level
              </span>
              <span className="text-[10px] font-mono text-slate-400">Controls Dispatch Speed</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { level: 'Critical' as SeverityLevel, label: 'Critical', desc: 'Immediate Threat', color: 'bg-red-500/20 text-red-300 border-red-500/60 ring-2 ring-red-500' },
                { level: 'High' as SeverityLevel, label: 'High', desc: 'Urgent Dispatch', color: 'bg-amber-500/20 text-amber-300 border-amber-500/60 ring-2 ring-amber-500' },
                { level: 'Moderate' as SeverityLevel, label: 'Moderate', desc: 'Stable / Injured', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/60 ring-2 ring-yellow-500' },
                { level: 'Low' as SeverityLevel, label: 'Low', desc: 'Minor Assistance', color: 'bg-blue-500/20 text-blue-300 border-blue-500/60 ring-2 ring-blue-500' },
              ].map(({ level, label, desc, color }) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => { setSelectedSeverity(level); triggerHaptic([30]); }}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center transition ${
                    selectedSeverity === level
                      ? `${color} shadow-lg font-bold`
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold leading-tight">{label}</span>
                  <span className="text-[8px] text-slate-400 leading-tight mt-0.5">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 5: SUBMIT REPORT */}
          <div className="pt-2 space-y-2.5">
            <button
              type="button"
              onClick={() => triggerSOS(false)}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-98 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition disabled:opacity-50"
            >
              <Bell className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : 'animate-bounce'}`} />
              <span>{isSubmitting ? 'Dispatching Nearest Responders...' : 'SUBMIT EMERGENCY REPORT NOW'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {/* Hold to SOS & Silent Options */}
            <div className="flex gap-2">
              <button
                type="button"
                onMouseDown={startHold}
                onMouseUp={cancelHold}
                onMouseLeave={cancelHold}
                onTouchStart={startHold}
                onTouchEnd={cancelHold}
                className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold flex items-center justify-center gap-1.5 transition text-[11px]"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>{isHolding ? `Holding (${Math.round((2000 - (holdingProgress * 20)) / 100) / 10}s)...` : 'Or Hold 2s SOS'}</span>
              </button>

              <button
                type="button"
                onClick={handleSilentTap}
                className="flex-1 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 font-bold flex items-center justify-center gap-1.5 transition text-[11px]"
              >
                <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>{silentTapCount > 0 ? `Tap again (${3 - silentTapCount})` : 'Silent SOS (3x Tap)'}</span>
              </button>
            </div>
          </div>

          {/* Quick Helpline Numbers Footer */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5 text-center">
              Direct Emergency Helplines
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {[
                { label: '112', title: 'National' },
                { label: '108', title: 'Ambulance' },
                { label: '101', title: 'Fire' },
                { label: '100', title: 'Police' },
              ].map(tile => (
                <a
                  key={tile.label}
                  href={`tel:${tile.label}`}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl py-1.5 transition active:scale-95"
                >
                  <div className="text-xs font-mono font-bold text-red-400">{tile.label}</div>
                  <div className="text-[8px] text-slate-400">{tile.title}</div>
                </a>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Manual Pin Location Selector Modal with Real Coordinates */}
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
                { address: 'Cyber Towers Flyover, Hitech City, Hyderabad', lat: 17.4485, lng: 78.3745 },
                { address: 'Road No 36, Jubilee Hills Checkpost, Hyderabad', lat: 17.4319, lng: 78.4073 },
                { address: 'Durgam Cheruvu Cable Bridge Pedestrian Path, Madhapur', lat: 17.4345, lng: 78.3885 },
                { address: 'Gachibowli Stadium Junction, Financial District', lat: 17.4400, lng: 78.3489 },
                { address: 'Banjara Hills Road No 12 (near Care Hospital)', lat: 17.4156, lng: 78.4350 }
              ].map(loc => (
                <button
                  key={loc.address}
                  onClick={() => {
                    handleLocationUpdate(loc.lat, loc.lng, loc.address, 5);
                    setShowManualPinModal(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 transition"
                >
                  <div className="font-semibold text-white">{loc.address.split(',')[0]}</div>
                  <div className="text-[10px] text-slate-400">{loc.address}</div>
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
              Calling Paramedic ({activeIncident.assignedResponder?.callSign || '108-ALS'}). Your personal phone number is securely masked.
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
                Nearby Emergency Units (&lt; 5km)
              </h3>
              <button onClick={() => setShowNearbyServicesModal(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Nearest emergency responders & trauma hospitals calculated dynamically from your GPS coordinates ({currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}):
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
                        <div className="text-[10px] text-cyan-300 font-mono">{h.distanceKm} km (ETA {h.etaMins}m)</div>
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
                        <div className="text-[9px] text-slate-500 font-mono">ETA: ~{r.etaMins}m</div>
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
