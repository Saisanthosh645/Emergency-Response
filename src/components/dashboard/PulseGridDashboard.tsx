import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { EmergencyMap } from '../map/EmergencyMap';
import { sound, triggerHaptic } from '../../utils/audio';
import { Incident, Responder, Hospital, HospitalBedBooking, BloodBank, BloodReservation } from '../../types';
import { TRANSLATIONS } from '../../utils/i18n';
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
  ChevronRight,
  Download, 
  Share2, 
  MessageSquare, 
  Navigation,
  Layers,
  Building,
  Building2,
  Bed,
  Star,
  QrCode,
  Droplet,
  Truck,
  Snowflake,
  UserCheck,
  X,
  ExternalLink,
  Volume2,
  VolumeX,
  Filter,
  CheckCircle2,
  Info,
  Plus,
  Trash2,
  Activity,
  Radio,
  FileText,
  Heart,
  Globe,
  AlertTriangle,
  Zap,
  TrafficCone,
  Compass,
  Users,
  Printer,
  ShieldCheck,
  BarChart2,
  FileCheck,
  LogOut
} from 'lucide-react';

export const PulseGridDashboard: React.FC<{ onOpenSOS: () => void }> = ({ onOpenSOS }) => {
  const { 
    incidents, 
    responders, 
    hospitals, 
    hospitalBedBookings,
    bookHospitalBed,
    bloodBanks,
    bloodReservations,
    reserveBloodUnits,
    activeIncident, 
    updateIncidentStatus,
    activeRole,
    setActiveRole,
    currentLanguage,
    setLanguage,
    isTemporarilyLoggedOut,
    setTemporarilyLoggedOut,
    isOfflineMode,
    setIsOfflineMode,
    areaAlerts,
    auditLogs,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    assignCoordinatingResponder,
    reassignResponder,
    toggleGreenCorridor,
    sendEmergencySmsBroadcast,
    escalateIncident,
    privacySettings,
    maskPhoneNumber,
    maskName,
    calculateMilestoneMetrics,
    getIncidentSha256,
    logDataAccess,
    createEmergency,
    smartDispatch,
    citizenLocation,
    setActiveIncidentId
  } = useEmergency();

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const [broadcastSuccessToast, setBroadcastSuccessToast] = useState<string | null>(null);
  const [showCoordinationModal, setShowCoordinationModal] = useState<boolean>(false);

  // Navigation State
  const [activeSidebarTab, setActiveSidebarTab] = useState<'home' | 'map' | 'incidents' | 'history' | 'hospitals' | 'blood' | 'contacts' | 'settings'>('home');
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Hospital Beds / ICU Triage & Admissions State
  const [hospitalSearchQuery, setHospitalSearchQuery] = useState<string>('');
  const [hospitalCategoryFilter, setHospitalCategoryFilter] = useState<'all' | 'trauma' | 'clinic'>('all');
  const [selectedBookingHospital, setSelectedBookingHospital] = useState<Hospital | null>(null);
  const [activeBookingConfirmation, setActiveBookingConfirmation] = useState<HospitalBedBooking | null>(null);
  const [directPhoneModalHospital, setDirectPhoneModalHospital] = useState<Hospital | null>(null);

  // Bed Reservation Form State
  const [bookingPatientName, setBookingPatientName] = useState<string>('Sai Santhosh');
  const [bookingPatientPhone, setBookingPatientPhone] = useState<string>('+91 98490 22119');
  const [bookingPatientAge, setBookingPatientAge] = useState<string>('28');
  const [bookingPatientGender, setBookingPatientGender] = useState<string>('Male');
  const [bookingCondition, setBookingCondition] = useState<string>('Critical Trauma / Polytrauma');
  const [bookingBedType, setBookingBedType] = useState<'icu_ventilator' | 'cardiac_cicu' | 'hdu' | 'trauma_bay'>('icu_ventilator');
  const [bookingTransportMode, setBookingTransportMode] = useState<'ambulance' | 'private_vehicle' | 'need_dispatch'>('ambulance');
  const [bookingNotes, setBookingNotes] = useState<string>('SpO2 91%, BP 90/60, Blunt trauma from high speed collision');

  // National Blood Allocation & Cold-Chain Logistics State
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('O-');
  const [bloodSearchQuery, setBloodSearchQuery] = useState<string>('');
  const [selectedBloodBankForBooking, setSelectedBloodBankForBooking] = useState<BloodBank | null>(null);
  const [activeBloodReservationReceipt, setActiveBloodReservationReceipt] = useState<BloodReservation | null>(null);
  const [directPhoneModalBloodBank, setDirectPhoneModalBloodBank] = useState<BloodBank | null>(null);

  // Blood Reservation Form State
  const [bloodPatientName, setBloodPatientName] = useState<string>('Sai Santhosh');
  const [bloodPatientPhone, setBloodPatientPhone] = useState<string>('+91 98490 22119');
  const [bloodPatientHospital, setBloodPatientHospital] = useState<string>("St. John's General Emergency Trauma");
  const [bloodUnitsCount, setBloodUnitsCount] = useState<number>(2);
  const [bloodUrgencyLevel, setBloodUrgencyLevel] = useState<'Emergency STAT' | 'Urgent (Within 2 Hours)' | 'Scheduled Surgery'>('Emergency STAT');
  const [bloodDoctorName, setBloodDoctorName] = useState<string>('Dr. Rajesh Varma (Chief Transfusionist)');

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);

  // Modal States
  const [showTriageDetails, setShowTriageDetails] = useState<boolean>(false);
  const [showResponseDetails, setShowResponseDetails] = useState<boolean>(false);
  const [showNearbyServicesModal, setShowNearbyServicesModal] = useState<boolean>(false);
  const [showSafetyGuideModal, setShowSafetyGuideModal] = useState<boolean>(false);
  const [showAddContactModal, setShowAddContactModal] = useState<boolean>(false);

  // Incidents Tab Filter State
  const [incidentStatusFilter, setIncidentStatusFilter] = useState<string>('all');
  const [incidentSeverityFilter, setIncidentSeverityFilter] = useState<string>('all');
  const [incidentSearchQuery, setIncidentSearchQuery] = useState<string>('');
  const [selectedIncidentModal, setSelectedIncidentModal] = useState<Incident | null>(null);

  // History & Analytics Tab Filter & Modal State
  const [historySearchQuery, setHistorySearchQuery] = useState<string>('');
  const [historyTypeFilter, setHistoryTypeFilter] = useState<string>('all');
  const [historySeverityFilter, setHistorySeverityFilter] = useState<string>('all');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>('all');
  const [selectedDossierIncident, setSelectedDossierIncident] = useState<Incident | null>(null);
  const [verifiedShaIncidentId, setVerifiedShaIncidentId] = useState<string | null>(null);

  // 5-Second Hold SOS Console State & Handlers
  const [isHoldingSOS, setIsHoldingSOS] = useState<boolean>(false);
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [bookedAmbulanceModal, setBookedAmbulanceModal] = useState<{
    incident: Incident;
    responder: Responder;
    etaMinutes: number;
  } | null>(null);

  const holdStartTimeRef = useRef<number | null>(null);
  const holdRafRef = useRef<number | null>(null);
  const isHoldingRef = useRef<boolean>(false);
  const lastAudioTickRef = useRef<number>(0);

  const stopHoldingSOS = useCallback(() => {
    if (holdRafRef.current) {
      cancelAnimationFrame(holdRafRef.current);
      holdRafRef.current = null;
    }
    holdStartTimeRef.current = null;
    isHoldingRef.current = false;
    setIsHoldingSOS(false);
    setHoldProgress(0);
  }, []);

  const handleTriggerSOSComplete = useCallback(async () => {
    stopHoldingSOS();

    // 1. Play loud emergency ambulance air horn and sweeping siren!
    sound.playAmbulanceHorn(4.0);
    triggerHaptic([300, 100, 300, 100, 600]);

    // 2. Identify nearest available ambulance
    const nearestAmbulance = responders.find(r => r.type.includes('Ambulance') && r.status === 'Available') 
      || responders.find(r => r.type.includes('Ambulance')) 
      || responders[0];

    // 3. Create critical medical emergency with current citizen coordinates
    const newInc = await createEmergency({
      type: 'Medical',
      severity: 'Critical',
      description: 'HIGH-PRIORITY 5-SECOND SOS CONSOLE TRIGGER. Instant ALS Ambulance booking & dispatch activated.',
      citizenName: 'Sai Santhosh',
      citizenPhone: '+91 98480 12345',
      location: citizenLocation
    });

    // 4. Force immediate smart dispatch to nearest ambulance
    if (nearestAmbulance) {
      smartDispatch(newInc.id, nearestAmbulance.id);
    }

    if (setActiveIncidentId) {
      setActiveIncidentId(newInc.id);
    }

    // 5. Open Booking Notification Modal
    setBookedAmbulanceModal({
      incident: newInc,
      responder: nearestAmbulance,
      etaMinutes: 3
    });
  }, [responders, createEmergency, citizenLocation, smartDispatch, setActiveIncidentId, stopHoldingSOS]);

  const startHoldingSOS = useCallback(() => {
    if (isHoldingRef.current) return;
    isHoldingRef.current = true;
    setIsHoldingSOS(true);
    holdStartTimeRef.current = Date.now();
    lastAudioTickRef.current = 0;
    triggerHaptic([80]);
    sound.playCountdownTick(500);

    const checkStep = () => {
      if (!isHoldingRef.current || !holdStartTimeRef.current) return;
      const elapsed = Date.now() - holdStartTimeRef.current;
      const pct = Math.min(100, (elapsed / 5000) * 100);
      setHoldProgress(pct);

      // Play audio tick every ~480ms with increasing pitch
      if (elapsed - lastAudioTickRef.current >= 480) {
        lastAudioTickRef.current = elapsed;
        sound.playCountdownTick(500 + pct * 6);
        triggerHaptic([50]);
      }

      if (elapsed >= 5000) {
        handleTriggerSOSComplete();
      } else {
        holdRafRef.current = requestAnimationFrame(checkStep);
      }
    };

    holdRafRef.current = requestAnimationFrame(checkStep);
  }, [handleTriggerSOSComplete]);

  // Global Spacebar press-and-hold listener (when on home tab)
  useEffect(() => {
    if (activeSidebarTab !== 'home') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }
      if (e.code === 'Space' && !e.repeat && !isHoldingRef.current) {
        e.preventDefault();
        startHoldingSOS();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isHoldingRef.current) {
        e.preventDefault();
        stopHoldingSOS();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeSidebarTab, startHoldingSOS, stopHoldingSOS]);

  // Map Tab Layer Filter State
  const [mapLayer, setMapLayer] = useState<'all' | 'ambulances' | 'fire' | 'police' | 'hospitals'>('all');

  // Emergency Contacts Directory State
  const [personalContacts, setPersonalContacts] = useState([
    { id: 'pc1', name: 'Ramesh (Spouse)', phone: '+91 98480 12345', relation: 'Spouse' },
    { id: 'pc2', name: 'Dr. Sunita (Family Physician)', phone: '+91 94400 54321', relation: 'Doctor' },
    { id: 'pc3', name: 'Priya (Sister)', phone: '+91 99890 98765', relation: 'Family' },
  ]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Family');

  // Settings State
  const [isSirenTesting, setIsSirenTesting] = useState(false);
  const [proximityRadius, setProximityRadius] = useState<'1km' | '3km' | '5km' | '10km'>('3km');
  const [medicalId, setMedicalId] = useState({
    bloodGroup: 'O+',
    allergies: 'Penicillin, Dust mite sensitivity',
    emergencyContact: 'Ramesh (+91 98480 12345)',
    donorConsent: true
  });
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Active incident reference or fallback to Banjara Hills incident
  const currentInc = activeIncident || incidents[0];

  // Dynamic Incident Steps based on real status & live ETA
  const incidentSteps = useMemo(() => {
    const status = currentInc?.status || 'Reported';
    const statusOrder = ['Reported', 'Verified', 'Assigned', 'En Route', 'Arrived', 'Resolved'];
    const currentIdx = statusOrder.indexOf(status);

    const steps = [
      { label: 'Reported', key: 'Reported' },
      { label: 'Verified', key: 'Verified' },
      { label: 'Assigned', key: 'Assigned' },
      { label: 'En Route', key: 'En Route' },
      { label: 'Arrived', key: 'Arrived' },
      { label: 'Resolved', key: 'Resolved' },
    ];

    return steps.map((s, idx) => {
      let state: 'done' | 'current' | 'pending' = 'pending';
      let time = '';

      if (idx < currentIdx) {
        state = 'done';
        time = '✓';
      } else if (idx === currentIdx) {
        state = 'current';
        if (s.key === 'En Route' && currentInc?.etaSeconds) {
          const m = Math.floor(currentInc.etaSeconds / 60);
          const sec = currentInc.etaSeconds % 60;
          time = `ETA ${m}m ${sec < 10 ? '0' : ''}${sec}s`;
        } else {
          time = 'Active';
        }
      }

      return { label: s.label, time, state };
    });
  }, [currentInc?.status, currentInc?.etaSeconds]);

  // Filtered Responders for Map Layer Filter
  const filteredMapResponders = useMemo(() => {
    if (mapLayer === 'ambulances') return responders.filter(r => r.type === 'ALS Ambulance' || r.type === 'BLS Ambulance');
    if (mapLayer === 'fire') return responders.filter(r => r.type === 'Fire Tender');
    if (mapLayer === 'police') return responders.filter(r => r.type === 'Police PCR');
    if (mapLayer === 'hospitals') return [];
    return responders;
  }, [responders, mapLayer]);

  // Sirens test audio trigger
  const handleTestSiren = () => {
    if (isSirenTesting) {
      setIsSirenTesting(false);
    } else {
      setIsSirenTesting(true);
      sound.playEmergencySiren(2.5);
      triggerHaptic([100, 50, 100]);
      setTimeout(() => setIsSirenTesting(false), 3000);
    }
  };

  // Add Contact handler
  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    setPersonalContacts(prev => [
      ...prev,
      {
        id: `pc-${Date.now()}`,
        name: newContactName.trim(),
        phone: newContactPhone.trim(),
        relation: newContactRelation
      }
    ]);
    setNewContactName('');
    setNewContactPhone('');
    setShowAddContactModal(false);
    sound.playSuccessChime();
  };

  // Delete Contact handler
  const handleDeleteContact = (id: string) => {
    setPersonalContacts(prev => prev.filter(c => c.id !== id));
  };

  // Analytics & History Metrics
  const historyAnalytics = useMemo(() => {
    const total = incidents.length;
    const resolved = incidents.filter(i => i.status.toLowerCase() === 'resolved');
    
    // Milestones for all incidents
    const milestoneMap = new Map();
    incidents.forEach(inc => {
      milestoneMap.set(inc.id, calculateMilestoneMetrics(inc));
    });

    // Avg response seconds (from t0 to onScene or now)
    const validResponseTimes = incidents.map(i => milestoneMap.get(i.id)?.totalResponseSeconds || 320);
    const avgResponseSec = validResponseTimes.length > 0 
      ? Math.round(validResponseTimes.reduce((a, b) => a + b, 0) / validResponseTimes.length)
      : 310;
    
    const avgResponseMin = (avgResponseSec / 60).toFixed(1);

    // SLA compliance
    const slaMetCount = incidents.filter(i => milestoneMap.get(i.id)?.slaMet).length;
    const slaPercent = total > 0 ? ((slaMetCount / total) * 100).toFixed(1) : '100';

    // Hospital handovers
    const hospitalCount = incidents.filter(i => i.assignedHospital || (i.timeline && i.timeline.some(t => {
      const note = (t.note || '').toLowerCase();
      return note.includes('handover') || note.includes('admit') || note.includes('hospital');
    }))).length;

    // Response time distribution
    const under5Min = validResponseTimes.filter(t => t < 300).length;
    const fiveToEightMin = validResponseTimes.filter(t => t >= 300 && t <= 480).length;
    const overEightMin = validResponseTimes.filter(t => t > 480).length;

    // Type distribution
    const medicalCount = incidents.filter(i => i.type.toLowerCase().includes('med') || i.type.toLowerCase().includes('cardiac') || i.type.toLowerCase().includes('respiratory') || i.type.toLowerCase().includes('pediatric')).length;
    const fireCount = incidents.filter(i => i.type.toLowerCase().includes('fire') || i.type.toLowerCase().includes('hazard')).length;
    const accidentCount = incidents.filter(i => i.type.toLowerCase().includes('accident') || i.type.toLowerCase().includes('traffic')).length;
    const womenSafetyCount = incidents.filter(i => i.type.toLowerCase().includes('women') || i.type.toLowerCase().includes('sos') || i.type.toLowerCase().includes('distress')).length;

    return {
      total,
      resolvedCount: resolved.length,
      avgResponseMin,
      avgResponseSec,
      slaPercent,
      slaMetCount,
      hospitalCount,
      under5Min,
      fiveToEightMin,
      overEightMin,
      under5Pct: total ? Math.round((under5Min / total) * 100) : 0,
      fiveToEightPct: total ? Math.round((fiveToEightMin / total) * 100) : 0,
      overEightPct: total ? Math.round((overEightMin / total) * 100) : 0,
      medicalCount,
      fireCount,
      accidentCount,
      womenSafetyCount,
      milestoneMap
    };
  }, [incidents, calculateMilestoneMetrics]);

  // Filtered History Incidents
  const filteredHistoryIncidents = useMemo(() => {
    return incidents.filter(inc => {
      const q = historySearchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        inc.id.toLowerCase().includes(q) ||
        inc.type.toLowerCase().includes(q) ||
        inc.location.address.toLowerCase().includes(q) ||
        (inc.citizenName && inc.citizenName.toLowerCase().includes(q)) ||
        (inc.assignedResponder?.name && inc.assignedResponder.name.toLowerCase().includes(q)) ||
        inc.description.toLowerCase().includes(q)
      );

      const matchType = historyTypeFilter === 'all' || 
        inc.type.toLowerCase().includes(historyTypeFilter.toLowerCase());

      const matchSeverity = historySeverityFilter === 'all' || 
        inc.severity.toLowerCase() === historySeverityFilter.toLowerCase();

      const matchStatus = historyStatusFilter === 'all' || (
        historyStatusFilter === 'resolved' 
          ? inc.status.toLowerCase() === 'resolved' 
          : inc.status.toLowerCase() !== 'resolved'
      );

      return matchSearch && matchType && matchSeverity && matchStatus;
    });
  }, [incidents, historySearchQuery, historyTypeFilter, historySeverityFilter, historyStatusFilter]);

  // CSV Export for History
  const handleExportHistoryCSV = () => {
    const headers = [
      'Incident ID',
      'Emergency Type',
      'Severity',
      'Caller Identity',
      'Masked Phone',
      'Location Address',
      'Latitude',
      'Longitude',
      'Status',
      'Reported Time',
      'Response Seconds',
      'SLA Target Seconds',
      'SLA Compliant',
      'Primary Responder',
      'Receiving Hospital',
      'Cryptographic SHA256 Checksum'
    ];
    const rows = filteredHistoryIncidents.map(i => {
      const metrics = calculateMilestoneMetrics(i);
      const lat = (privacySettings.fuzzyResolvedLocation && i.status.toLowerCase() === 'resolved') 
        ? i.location.lat.toFixed(2) 
        : i.location.lat;
      const lng = (privacySettings.fuzzyResolvedLocation && i.status.toLowerCase() === 'resolved') 
        ? i.location.lng.toFixed(2) 
        : i.location.lng;
      return [
        i.id,
        i.type,
        i.severity,
        `"${maskName(i.citizenName)}"`,
        `"${maskPhoneNumber(i.citizenPhone)}"`,
        `"${i.location.address.replace(/"/g, '""')}"`,
        lat,
        lng,
        i.status,
        new Date(i.createdAt || i.timestamp || Date.now()).toISOString(),
        metrics.totalResponseSeconds,
        metrics.slaTargetSeconds,
        metrics.slaMet ? 'YES' : 'NO',
        `"${i.assignedResponder?.name || 'Unassigned'}"`,
        `"${i.assignedHospital?.name || 'None'}"`,
        metrics.cryptographicChecksum
      ];
    });
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Lifeline_Form112_Incident_Registry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logDataAccess('Audit Officer', 'EXPORT_INCIDENT_REGISTRY_CSV', `${filteredHistoryIncidents.length} Records`, 'Statutory Monthly EOC Compliance Audit');
  };

  // JSON Dossier Export for Individual Incident
  const handleExportIncidentJson = (incident: Incident) => {
    const metrics = calculateMilestoneMetrics(incident);
    const timeVal = incident.createdAt || incident.timestamp || Date.now();
    const payload = {
      formSpecification: 'Government of India MoHFW Form 112-IN Incident Dossier',
      incidentRecord: {
        id: incident.id,
        type: incident.type,
        severity: incident.severity,
        status: incident.status,
        createdAt: timeVal,
        timestampISO: new Date(timeVal).toISOString(),
        location: {
          address: incident.location.address,
          area: incident.location.area,
          lat: (privacySettings.fuzzyResolvedLocation && incident.status.toLowerCase() === 'resolved') ? Number(incident.location.lat.toFixed(2)) : incident.location.lat,
          lng: (privacySettings.fuzzyResolvedLocation && incident.status.toLowerCase() === 'resolved') ? Number(incident.location.lng.toFixed(2)) : incident.location.lng,
          accuracyMeters: incident.location.accuracyMeters
        },
        callerInfo: {
          name: maskName(incident.citizenName),
          phone: maskPhoneNumber(incident.citizenPhone),
          anonymizedUnderDPDP: privacySettings.maskCitizenName || privacySettings.anonymizePhone
        },
        description: incident.description,
        primaryResponder: incident.assignedResponder ? {
          id: incident.assignedResponder.id,
          name: incident.assignedResponder.name,
          callSign: incident.assignedResponder.callSign,
          type: incident.assignedResponder.type
        } : null,
        hospitalHandover: incident.assignedHospital ? {
          id: incident.assignedHospital.id,
          name: incident.assignedHospital.name,
          address: incident.assignedHospital.address
        } : null,
        milestones: metrics,
        timelineEvents: incident.timeline
      },
      auditSignature: {
        algorithm: 'HMAC-SHA256',
        checksum: metrics.cryptographicChecksum,
        certifiedTimestamp: Date.now()
      }
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Dossier_${incident.id}_AAR_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logDataAccess('EOC Registrar', 'EXPORT_AAR_DOSSIER_JSON', incident.id, 'Clinical Handover & Medico-Legal Archival');
  };

  // Search Results Calculation
  const searchResults = searchQuery.trim() ? {
    services: [
      { name: 'Care Hospital Emergency Desk', type: 'Hospital', phone: '040-61656565', dist: '1.2 km' },
      { name: 'Apollo Health City Trauma Center', type: 'Hospital', phone: '040-23607777', dist: '2.5 km' },
      { name: 'Banjara Hills Police Station', type: 'Police', phone: '100', dist: '1.8 km' },
      { name: 'Madhapur Fire & Rescue Station', type: 'Fire', phone: '101', dist: '3.1 km' },
      { name: '108 ALS Ambulance Sector 4', type: 'Ambulance', phone: '108', dist: '0.8 km' },
    ].filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.type.toLowerCase().includes(searchQuery.toLowerCase())),
    incidents: incidents.filter(i => 
      i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.location.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
  } : null;

  return (
    <div className="h-full bg-[#f0f2f5] text-slate-800 flex flex-col font-sans select-none overflow-hidden">
      
      {/* ================= 1. TOP HEADER ================= */}
      <header className="h-14 bg-white border-b border-slate-200 px-5 flex items-center justify-between z-30 sticky top-0 shadow-sm">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveSidebarTab('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            {/* ECG Pulse Heartbeat Icon */}
            <div className="w-8 h-8 rounded-xl bg-red-500/10 group-hover:bg-red-500/20 flex items-center justify-center text-red-600 transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-slate-900 leading-none">
                PULSE<span className="text-red-500">GRID</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-normal mt-0.5">
                {t.tagline}
              </div>
            </div>
          </button>

          {/* Language Switcher Pills - matching the screenshot */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {([{ code: 'en', label: 'English' }, { code: 'hi', label: 'हिन्दी (Hindi)' }, { code: 'te', label: 'తెలుగు (Telugu)' }, { code: 'mr', label: 'मराठी (Marathi)' }] as const).map(l => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  currentLanguage === l.code
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top Navbar Mesh Tabs - Translated */}
        <div className="hidden xl:flex items-center gap-0.5 text-xs">
          <button
            onClick={() => setActiveSidebarTab('home')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              activeSidebarTab === 'home'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
            <span>{t.tabs.emergencySOS}</span>
          </button>

          <button
            onClick={() => setActiveSidebarTab('hospitals')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              activeSidebarTab === 'hospitals'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.tabs.hospitalsER}</span>
          </button>

          <button
            onClick={() => setActiveSidebarTab('blood')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              activeSidebarTab === 'blood'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <Droplet className="w-3.5 h-3.5 text-red-500" />
            <span>{t.tabs.bloodMatcher}</span>
          </button>

          <button
            onClick={() => setActiveSidebarTab('map')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              activeSidebarTab === 'map'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 text-blue-500" />
            <span>{t.tabs.ambulanceFleet}</span>
          </button>

          <button
            onClick={() => setActiveSidebarTab('history')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              activeSidebarTab === 'history'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.tabs.careRecords}</span>
          </button>
        </div>

        {/* Center: Search Bar with Active Dropdown */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6 relative">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-red-500 focus:bg-white rounded-xl pl-10 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 transition focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(''); setShowSearchDropdown(false); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Live Search Instant Results Dropdown */}
          {showSearchDropdown && searchResults && (
            <div className="absolute top-11 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 max-h-80 overflow-y-auto">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 px-1">
                {t.emergencyFacilitiesHeader}
              </div>
              {searchResults.services.length > 0 ? (
                <div className="space-y-1.5 mb-3">
                  {searchResults.services.map(s => (
                    <div 
                      key={s.name}
                      onClick={() => {
                        setShowSearchDropdown(false);
                        setShowNearbyServicesModal(true);
                      }}
                      className="p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer border border-transparent hover:border-slate-100 transition"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                          {s.type[0]}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{s.name}</div>
                          <div className="text-[10px] text-slate-400">{s.type} • {s.dist} away</div>
                        </div>
                      </div>
                      <a 
                        href={`tel:${s.phone}`} 
                        onClick={e => e.stopPropagation()} 
                        className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg hover:bg-emerald-100"
                      >
                        {s.phone}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 px-2 py-1">No services found matching "{searchQuery}"</div>
              )}

              {searchResults.incidents.length > 0 && (
                <>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 px-1 border-t border-slate-100 pt-2">
                    Matching Incidents
                  </div>
                  <div className="space-y-1.5">
                    {searchResults.incidents.map(inc => (
                      <div 
                        key={inc.id}
                        onClick={() => {
                          setShowSearchDropdown(false);
                          setSelectedIncidentModal(inc);
                        }}
                        className="p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer border border-transparent hover:border-slate-100 transition"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900">{inc.type} - {inc.id}</div>
                          <div className="text-[10px] text-slate-500">{inc.location.address}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          inc.severity === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {inc.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Bell, User Profile */}
        <div className="flex items-center gap-2">
          
          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t.online}</span>
          </div>

          {/* Notification Bell with Toggle */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-84 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="font-bold text-slate-900">{t.activeNotifications}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-cyan-600 font-mono font-bold">
                      {notifications.filter(n => !n.read).length} {t.unread}
                    </span>
                    <button 
                      onClick={clearAllNotifications}
                      className="text-[10px] text-slate-400 hover:text-slate-600 underline"
                    >
                      {t.clear}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.incidentId) {
                          const found = incidents.find(i => i.id === n.incidentId);
                          if (found) setSelectedIncidentModal(found);
                        }
                      }}
                      className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition ${
                        n.severity === 'critical' ? 'bg-red-50/80 border-red-200' :
                        n.severity === 'high' ? 'bg-amber-50/80 border-amber-200' :
                        'bg-slate-50 border-slate-200'
                      } ${n.read ? 'opacity-60' : 'font-semibold'}`}
                    >
                      <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                        n.severity === 'critical' ? 'text-red-500' :
                        n.severity === 'high' ? 'text-amber-500' : 'text-blue-500'
                      }`} />
                      <div className="flex-1 truncate">
                        <div className="font-bold text-slate-900 truncate">{n.title}</div>
                        <div className="text-[11px] text-slate-600 leading-snug line-clamp-2">{n.message}</div>
                        <div className="text-[9px] text-slate-400 mt-1 font-mono">
                          {Math.round((Date.now() - n.timestamp) / 1000) < 60 ? t.justNow : `${Math.round((Date.now() - n.timestamp) / 60000)}${t.minsAgo}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition"
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
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="font-bold text-slate-900">Sai Santhosh</div>
                  <div className="text-[10px] text-slate-500 truncate">raminisaisanthosh@gmail.com</div>
                </div>

                <div className="py-1">
                  <div className="text-[10px] font-mono text-slate-400 px-3 py-1 uppercase">{t.switchPerspective}</div>
                  <button
                    onClick={() => { setActiveRole('citizen'); setShowProfileMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                  >
                    <span>{t.citizenDashboard}</span>
                    {activeRole === 'citizen' && <span className="text-emerald-500 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => { setActiveRole('responder'); setShowProfileMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                  >
                    <span>{t.responderTerminal}</span>
                    {activeRole === 'responder' && <span className="text-emerald-500 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => { setActiveRole('admin'); setShowProfileMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                  >
                    <span>{t.adminCommandCenter}</span>
                    {activeRole === 'admin' && <span className="text-emerald-500 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => { setActiveRole('demo'); setShowProfileMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-amber-600 font-bold"
                  >
                    <span>{t.guidedDemo}</span>
                  </button>
                  <button
                    onClick={() => { setActiveRole('privacy'); setShowProfileMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                  >
                    <span>{t.privacyTrustNav}</span>
                  </button>

                  {/* Temporary Log Out option in dropdown */}
                  <div className="pt-1.5 mt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        sound.playButtonTap();
                        setTemporarilyLoggedOut(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 flex items-center gap-2 text-rose-600 font-bold transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>
                        {currentLanguage === 'hi' ? 'लॉग आउट करें' :
                         currentLanguage === 'te' ? 'లాగ్ అవుట్' :
                         currentLanguage === 'mr' ? 'लॉग आउट करा' :
                         'Log Out'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dedicated Header Logout Button */}
          <button
            onClick={() => {
              sound.playButtonTap();
              setTemporarilyLoggedOut(true);
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition shadow-2xs hover:shadow-xs active:scale-95"
            title="Temporarily Log Out"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">
              {currentLanguage === 'hi' ? 'लॉग आउट' :
               currentLanguage === 'te' ? 'లాగ్ అవుట్' :
               currentLanguage === 'mr' ? 'लॉग आउट' :
               'Log Out'}
            </span>
          </button>

        </div>

      </header>

      {/* ================= 2. MAIN LAYOUT (SIDEBAR + CONTENT TABS) ================= */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Left Navigation Sidebar - Dark Navy */}
        <aside className="w-52 bg-[#0f1629] lg:flex hidden flex-col justify-between py-4 px-3 shrink-0">
          <nav className="space-y-0.5">
            {[
              { id: 'home', label: t.nav.home, icon: Home },
              { id: 'map', label: t.nav.liveMap, icon: MapPin },
              { id: 'incidents', label: t.nav.incidents, icon: AlertCircle },
              { id: 'hospitals', label: t.nav.hospitalBeds, icon: Bed, badge: t.liveBadge },
              { id: 'blood', label: t.nav.bloodMatcher, icon: Droplet, badge: t.liveStockBadge },
              { id: 'history', label: t.nav.history, icon: Clock },
              { id: 'contacts', label: t.nav.emergencyContacts, icon: Phone },
              { id: 'settings', label: t.nav.settings, icon: Settings },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeSidebarTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSidebarTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition ${
                    isActive 
                      ? 'bg-white/10 text-white font-semibold' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider font-mono ${
                      item.badge === 'LIVE' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Sidebar Card: Stay Safe */}
          <div className="mx-1 p-3.5 rounded-2xl bg-blue-600/10 border border-blue-500/20 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100">{t.staySafe}</div>
              <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                {t.staySafeDesc}
              </div>
            </div>
            <button 
              onClick={() => setShowSafetyGuideModal(true)}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 pt-1"
            >
              <span>{t.learnMore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* ================= TAB 1: HOME (3 COLUMNS GRID) ================= */}
        {activeSidebarTab === 'home' && (
          <main className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 bg-[#f0f2f5]">
            
            {/* COLUMN 1: LEFT PANEL - SOS Console + Emergency Contacts (3 cols) */}
            <div className="lg:col-span-3 overflow-y-auto p-4 space-y-3 border-r border-slate-200">
              
              {/* EMERGENCY CONSOLE: 5-Second Press & Hold SOS */}
              <div className="rounded-2xl bg-[#0a0f1e] border border-slate-800/80 p-4 shadow-xl relative overflow-hidden select-none">
                {/* Background ambient red glow when holding */}
                <div 
                  className={`absolute -top-12 -left-12 w-56 h-56 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 ${
                    isHoldingSOS ? 'bg-red-600/40 opacity-100' : 'bg-red-600/15 opacity-60'
                  }`}
                />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/70 border border-rose-900/50 text-rose-300 font-mono text-[9px] font-bold tracking-wider uppercase">
                    <ShieldAlert className="w-3 h-3 text-rose-400" />
                    <span>{t.emergencyConsole}</span>
                  </div>
                  {isHoldingSOS && (
                    <span className="text-[10px] font-mono text-amber-400 font-bold animate-pulse">
                      {Math.round(holdProgress)}%
                    </span>
                  )}
                </div>

                {/* Headline & Description */}
                <div className="relative z-10">
                  <h2 className="text-xl font-black text-white uppercase tracking-tight leading-none font-sans">
                    {t.emergencyHeadline}
                  </h2>
                  <h2 className="text-xl font-black text-red-400 uppercase tracking-tight leading-tight font-sans mt-0.5">
                    {t.pressHoldSOS}
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-sans">
                    {t.sosDescription}
                  </p>
                </div>

                {/* Active Mesh Pill */}
                <div className="relative z-10 mt-2.5 flex items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-900/40 border border-emerald-700/40 text-[9px] font-mono text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{t.activeMesh}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-900/40 border border-blue-700/40 text-[9px] font-mono text-blue-400 font-bold">
                    <span>{t.mesh}</span>
                  </div>
                </div>

                {/* Central Interactive Circular SOS Button */}
                <div className="relative z-10 py-4 flex flex-col items-center justify-center">
                  <div 
                    className="relative flex items-center justify-center cursor-pointer select-none group"
                    onMouseDown={startHoldingSOS}
                    onMouseUp={stopHoldingSOS}
                    onMouseLeave={stopHoldingSOS}
                    onTouchStart={startHoldingSOS}
                    onTouchEnd={stopHoldingSOS}
                    onTouchCancel={stopHoldingSOS}
                    role="button"
                    tabIndex={0}
                    aria-label="Hold SOS for 5 seconds to dispatch nearest ambulance"
                  >
                    {/* SVG Radial Progress Ring */}
                    <svg className="w-44 h-44 -rotate-90 pointer-events-none" viewBox="0 0 200 200">
                      <circle cx="100" cy="100" r="86" stroke="#3a1015" strokeWidth="8" fill="none" />
                      <circle 
                        cx="100" cy="100" r="86" 
                        stroke="#ef4444" strokeWidth="8" fill="none" 
                        strokeDasharray={2 * Math.PI * 86} 
                        strokeDashoffset={2 * Math.PI * 86 * (1 - holdProgress / 100)} 
                        strokeLinecap="round" 
                        className="transition-all duration-75"
                      />
                    </svg>

                    {/* Circular Red SOS Button Inner */}
                    <div className={`absolute w-36 h-36 rounded-full bg-gradient-to-br from-red-600 via-red-600 to-rose-700 flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-150 ${
                      isHoldingSOS 
                        ? 'scale-95 shadow-[0_0_60px_rgba(239,68,68,0.8)] ring-4 ring-red-400' 
                        : 'group-hover:scale-105 shadow-[0_0_40px_rgba(239,68,68,0.45)]'
                    }`}>
                      <div className="relative">
                        <svg className={`w-7 h-7 text-white ${isHoldingSOS ? 'animate-bounce' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2v2"/>
                          <path d="M4.93 4.93l1.41 1.41"/>
                          <path d="M19.07 4.93l-1.41 1.41"/>
                          <path d="M7 10a5 5 0 0 1 10 0v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6z"/>
                          <path d="M5 22h14"/>
                          <path d="M9 18h6"/>
                        </svg>
                        {isHoldingSOS && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300 animate-ping" />
                        )}
                      </div>
                      <span className="text-2xl font-black tracking-widest text-white mt-1 leading-none drop-shadow">SOS</span>
                      <span className={`text-[9px] font-mono font-bold tracking-wider uppercase mt-1 ${
                        isHoldingSOS ? 'text-amber-300 animate-pulse' : 'text-red-100'
                      }`}>
                        {isHoldingSOS 
                          ? `${(Math.max(0, 5 - (holdProgress / 100) * 5)).toFixed(1)} ${t.secondsLeft}` 
                          : t.holdForSeconds}
                      </span>
                    </div>
                  </div>

                  {/* Spacebar Instruction */}
                  <div className="text-[10px] font-mono text-slate-400 text-center mt-2.5 flex items-center justify-center gap-1.5">
                    <span>{t.orHold}</span>
                    <kbd className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200 font-bold text-[9px]">
                      Spacebar
                    </kbd>
                    <span>{t.forSeconds}</span>
                  </div>
                </div>

                {/* Location Assurance */}
                <div className="relative z-10 flex items-start gap-2 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/30">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  </span>
                  <span className="text-[10px] text-slate-400 leading-snug">{t.locationSharedNote}</span>
                </div>

                {/* Manual form reporting link */}
                <div className="relative z-10 mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">{t.needTriageReport}</span>
                  <button
                    onClick={onOpenSOS}
                    className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 text-[11px] transition"
                  >
                    <span>{t.formReporting}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Emergency Contacts Card */}
              <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <h3 className="text-xs font-bold text-slate-900">{t.nav.emergencyContacts}</h3>
                  </div>
                  <button 
                    onClick={() => setActiveSidebarTab('contacts')} 
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                  >
                    <span>{t.viewAll}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2">
                  {[
                    { name: t.police, phone: '100', icon: Shield, color: 'bg-blue-600 text-white' },
                    { name: t.ambulance, phone: '108', icon: HeartPulse, color: 'bg-emerald-600 text-white' },
                    { name: t.fire, phone: '101', icon: Flame, color: 'bg-red-500 text-white' },
                  ].map(c => {
                    const Icon = c.icon;
                    return (
                      <div key={c.phone} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl ${c.color} flex items-center justify-center shadow-xs`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{c.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{c.phone}</div>
                          </div>
                        </div>
                        <a
                          href={`tel:${c.phone}`}
                          className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition"
                          title={`Call ${c.name}`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* COLUMN 2: CENTER - Map + Progress + Nearby Services (5 cols) */}
            <div className="lg:col-span-6 overflow-y-auto flex flex-col border-r border-slate-200">
              
              {/* Map - Takes most of the space */}
              <div className="relative" style={{ height: '62%', minHeight: '340px' }}>
                {/* Map Label */}
                <div className="absolute top-3 left-3 z-[400] flex items-center gap-1.5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 text-[10px] font-semibold text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {t.liveGrid}
                  </div>
                </div>
                <EmergencyMap
                  incidents={incidents}
                  responders={responders}
                  hospitals={hospitals}
                  areaAlerts={areaAlerts}
                  selectedIncident={currentInc}
                  center={currentInc?.location ? [currentInc.location.lat, currentInc.location.lng] : [17.4215, 78.4310]}
                  zoom={13}
                  interactive={true}
                  drawRoute={true}
                  className="w-full h-full"
                />
              </div>

              {/* Response Progress + Nearby Services */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f0f2f5]">

                {/* Response Progress Stepper */}
                <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-slate-400" />
                      <h3 className="text-xs font-bold text-slate-900">{t.responseProgress}</h3>
                    </div>
                    <button 
                      onClick={() => setShowResponseDetails(true)}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                    >
                      <span>{t.viewDetails}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Dynamic Stepper Bar */}
                  <div className="relative px-2">
                    <div className="absolute top-3 left-4 right-4 h-0.5 bg-slate-200 z-0"></div>
                    <div className="flex justify-between items-start relative z-10">
                      {incidentSteps.map((step, idx) => {
                        const stepTimes = ['1:42 PM', '1:43 PM', '1:44 PM', '1:46 PM', '1:52 PM', ''];
                        return (
                          <div key={step.label} className="flex flex-col items-center text-center" style={{ minWidth: 48 }}>
                            {step.state === 'done' ? (
                              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
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
                            <span className="text-[9px] font-semibold text-slate-700 mt-1.5 leading-tight">{step.label}</span>
                            <span className={`text-[9px] font-mono leading-tight mt-0.5 ${
                              step.state === 'current' ? 'text-blue-600 font-bold' : 
                              step.state === 'done' ? 'text-slate-400' : 'text-slate-300'
                            }`}>
                              {step.state !== 'pending' ? stepTimes[idx] : ''}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Nearby Emergency Services */}
                <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <h3 className="text-xs font-bold text-slate-900">{t.nearbyServices}</h3>
                    </div>
                    <button 
                      onClick={() => setShowNearbyServicesModal(true)}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                    >
                      <span>{t.viewAll}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Services list */}
                    <div className="col-span-1 space-y-2">
                      {[
                        { name: t.cityHospital, status: t.openAllDay, dist: '1.2 km', icon: HeartPulse, color: 'bg-blue-500 text-white' },
                        { name: t.policeStation, status: t.openAllDay, dist: '2.4 km', icon: Shield, color: 'bg-blue-700 text-white' },
                        { name: t.fireStation, status: t.openAllDay, dist: '3.1 km', icon: Flame, color: 'bg-red-500 text-white' },
                      ].map(srv => {
                        const Icon = srv.icon;
                        return (
                          <div key={srv.name} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-xl ${srv.color} flex items-center justify-center shadow-xs shrink-0`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900">{srv.name}</div>
                                <div className="text-[10px] text-emerald-600 font-medium">{srv.status}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-mono text-slate-500 font-semibold">{srv.dist}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Help Card */}
                    <div className="col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-3 flex flex-col items-center justify-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <HeartPulse className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{t.quickHelp}</div>
                        <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{t.quickHelpDesc}</div>
                      </div>
                      <button
                        onClick={() => setShowSafetyGuideModal(true)}
                        className="mt-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-white border border-blue-200 rounded-lg px-3 py-1.5 transition hover:bg-blue-50"
                      >
                        {t.quickHelpLearnMore}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* COLUMN 3: RIGHT - Incident Details + AI Triage + Timeline (3 cols) */}
            <div className="lg:col-span-3 overflow-y-auto p-4 space-y-3 bg-[#f0f2f5]">
              
              {/* Top Incident Status Card */}
              <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {t.inProgress}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ID: {currentInc?.id || 'PG-293847'}
                  </span>
                </div>

                {/* Title & Location */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-500/30">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {currentInc?.type || t.medicalEmergency}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{currentInc?.location?.address || t.banjaraHills}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] font-bold uppercase bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        {currentInc?.severity || t.critical}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">14:42 • 12 Apr 2025</span>
                    </div>
                  </div>
                </div>

                {/* ETA & Distance with icons */}
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase font-mono">{t.etaLabel}</div>
                      <div className="text-xl font-black font-mono text-slate-900 tracking-tight leading-tight">
                        {currentInc?.etaSeconds ? `${Math.floor(currentInc.etaSeconds / 60)} ${t.mins}` : `06 ${t.mins}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Navigation className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase font-mono">{t.distanceLabel}</div>
                      <div className="text-xl font-black font-mono text-slate-900 tracking-tight leading-tight">1.8 km</div>
                    </div>
                  </div>
                </div>

                {/* Assigned Vehicle Strip */}
                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700">
                      {currentInc?.assignedResponder?.name || 'Medical Response Unit #MH-042'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    {t.enRoute}
                  </span>
                </div>
              </div>

              {/* AI-Assisted Triage Card */}
              <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                    <h3 className="text-xs font-bold text-slate-900">{t.aiAssistedTriage}</h3>
                  </div>
                  <button 
                    onClick={() => setShowTriageDetails(true)}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                  >
                    <span>{t.viewDetails}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 uppercase tracking-wide">{t.critical}</span>
                  <span className="text-[11px] font-semibold text-slate-700">{currentInc?.type || t.medicalEmergency}</span>
                </div>

                {/* Risk Indicators */}
                <div className="mb-3 space-y-1">
                  {[
                    t.possibleLossOfConsciousness,
                    t.roadsideLocation,
                    t.trafficExposure,
                  ].map(risk => (
                    <div key={risk} className="flex items-center gap-2 text-[11px] text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>

                {/* Recommended Response */}
                <div className="mb-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[9px] text-slate-400 uppercase font-mono font-medium mb-0.5">{t.recommendedResponse}</div>
                  <div className="text-xs font-bold text-slate-900">{t.advancedMedical}</div>
                </div>

                {/* Confidence Progress Bar */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-1.5">
                    <span>{t.confidence}</span>
                    <span className="font-bold text-slate-900">92%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>

              {/* Incident Timeline Card */}
              <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center gap-1.5 mb-4">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <h3 className="text-xs font-bold text-slate-900">{t.incidentTimeline}</h3>
                </div>
                
                <div className="relative pl-5 space-y-3">
                  <div className="absolute top-2 left-2 bottom-2 w-0.5 bg-slate-100"></div>

                  {(currentInc?.timeline || [
                    { note: t.emergencyReported, timestamp: Date.now() - 1200000 },
                    { note: t.locationConfirmed, timestamp: Date.now() - 1140000 },
                    { note: t.aiTriageCompleted, timestamp: Date.now() - 1080000 },
                    { note: t.responderAssigned, timestamp: Date.now() - 960000 },
                    { note: t.enRoute, timestamp: Date.now() - 840000 },
                    { note: t.arrivedAtLocation, timestamp: Date.now() - 480000 },
                  ]).slice(0, 6).map((step, idx) => {
                    const isDone = idx < 5;
                    const isEnRoute = idx === 4;
                    const dt = new Date(step.timestamp || Date.now());
                    const timeStr = dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div key={idx} className="relative z-10 flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 -ml-5">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white shadow-xs mt-0.5 ${
                            isEnRoute ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'
                          }`}>
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span className="text-[11px] font-semibold text-slate-700 leading-tight">{step.note}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">{timeStr}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </main>
        )}

        {/* ================= TAB 2: LIVE MAP (FULL-BLEED WITH TELEMETRY) ================= */}
        {activeSidebarTab === 'map' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
            {/* Map Top Control Bar */}
            <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  {t.activeResponseSector}
                </span>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                  42 {t.unitsOnline}
                </span>
              </div>

              {/* Layer Filters */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {[
                  { id: 'all', label: t.allUnits },
                  { id: 'ambulances', label: t.alsAmbulance },
                  { id: 'fire', label: t.fireTenders },
                  { id: 'police', label: t.policePatrols },
                  { id: 'hospitals', label: t.hospitals },
                ].map(l => (
                  <button
                    key={l.id}
                    onClick={() => setMapLayer(l.id as any)}
                    className={`px-3 py-1 rounded-lg transition ${
                      mapLayer === l.id ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              <button
                onClick={onOpenSOS}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{t.triggerSOS}</span>
              </button>
            </div>

            {/* Map Content Container with Floating telemetry */}
            <div className="flex-1 relative overflow-hidden">
              <EmergencyMap
                incidents={incidents}
                responders={filteredMapResponders}
                hospitals={mapLayer === 'ambulances' || mapLayer === 'fire' || mapLayer === 'police' ? [] : hospitals}
                areaAlerts={areaAlerts}
                selectedIncident={currentInc}
                center={currentInc?.location ? [currentInc.location.lat, currentInc.location.lng] : [17.4215, 78.4310]}
                zoom={14}
                interactive={true}
                drawRoute={true}
                className="w-full h-full"
              />

              {/* Floating Active Units Telemetry Card */}
              <div className="absolute top-4 left-4 z-[400] w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-900">Active Dispatches</span>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">
                    Live Telemetry
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Unit #MH-042 (108 ALS)</div>
                      <div className="text-[10px] text-slate-500 font-mono">Banjara Hills • Speed 48 km/h</div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      ETA 6m
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Tender QRV-15 (Fire)</div>
                      <div className="text-[10px] text-slate-500 font-mono">Madhapur Substation • Standing by</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Available
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">SHE Team Patrol Alpha</div>
                      <div className="text-[10px] text-slate-500 font-mono">Cyber Towers Sector • Patrolling</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      On Route
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 3: INCIDENTS HUB ================= */}
        {activeSidebarTab === 'incidents' && (
          <div className="flex-1 flex flex-col overflow-y-auto p-6 bg-[#f8fafc] space-y-5">
            {/* Header & Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">{t.incidentsTitle}</h1>
                <p className="text-xs text-slate-500 mt-0.5">{t.incidentsSubtitle}</p>
              </div>

              {/* Stats Counters */}
              <div className="flex items-center gap-3">
                <div className="px-3.5 py-2 bg-white rounded-xl border border-slate-200 shadow-xs text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{t.total}</div>
                  <div className="text-sm font-black text-slate-900">{incidents.length}</div>
                </div>
                <div className="px-3.5 py-2 bg-white rounded-xl border border-slate-200 shadow-xs text-center">
                  <div className="text-[10px] text-red-500 font-bold uppercase">{t.filterCritical}</div>
                  <div className="text-sm font-black text-red-600">
                    {incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length}
                  </div>
                </div>
                <div className="px-3.5 py-2 bg-white rounded-xl border border-slate-200 shadow-xs text-center">
                  <div className="text-[10px] text-emerald-600 font-bold uppercase">{t.filterResolved}</div>
                  <div className="text-sm font-black text-emerald-600">
                    {incidents.filter(i => i.status === 'Resolved').length}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700">{t.statusLabel}</span>
                {['all', 'Reported', 'Assigned', 'En Route', 'Resolved'].map(st => (
                  <button
                    key={st}
                    onClick={() => setIncidentStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      incidentStatusFilter === st 
                        ? 'bg-blue-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'all' ? t.filterAll : (t.statusSteps[st as keyof typeof t.statusSteps] || st)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={incidentSearchQuery}
                  onChange={e => setIncidentSearchQuery(e.target.value)}
                  placeholder={t.filterByIdOrAddress}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Incident Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incidents
                .filter(i => incidentStatusFilter === 'all' || i.status === incidentStatusFilter)
                .filter(i => !incidentSearchQuery.trim() || 
                  i.id.toLowerCase().includes(incidentSearchQuery.toLowerCase()) ||
                  i.location.address.toLowerCase().includes(incidentSearchQuery.toLowerCase()) ||
                  i.type.toLowerCase().includes(incidentSearchQuery.toLowerCase())
                )
                .map(inc => (
                  <div key={inc.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-slate-500">{inc.id}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            inc.severity === 'Critical' 
                              ? 'bg-red-50 text-red-600 border border-red-200' 
                              : 'bg-amber-50 text-amber-600 border border-amber-200'
                          }`}>
                            {inc.severity}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            inc.status === 'Resolved' 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                              : 'bg-blue-50 text-blue-600 border border-blue-200'
                          }`}>
                            {inc.status}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{t.types[inc.type as keyof typeof t.types] || inc.type} {t.emergencyWord}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{inc.description}</p>

                      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{inc.location.address}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">{t.assignedUnit}</div>
                        <div className="font-bold text-slate-800">{inc.assignedResponder?.name || t.smartDispatching}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedIncidentModal(inc)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                        >
                          {t.viewDetails}
                        </button>
                        <button
                          onClick={() => {
                            setActiveSidebarTab('home');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold transition flex items-center gap-1"
                        >
                          <span>{t.trackLive}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        )}

        {/* ================= TAB 4: HISTORY & AUDIT ARCHIVE ================= */}
        {activeSidebarTab === 'history' && (
          <div className="flex-1 flex flex-col overflow-y-auto p-6 bg-[#f8fafc] space-y-6">
            
            {/* Header & Export Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">{t.historyTitle}</h1>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-bold">
                    {t.form112Standard}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.historySubtitle}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleExportHistoryCSV}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition active:scale-95 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.exportRegistryCsv}</span>
                </button>
              </div>
            </div>

            {/* Performance Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-[10px] text-slate-400 uppercase font-bold font-mono">{t.resolvedCases}</div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {historyAnalytics.resolvedCount} <span className="text-xs font-medium text-slate-400 font-sans">/ {historyAnalytics.total}</span>
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{historyAnalytics.total > 0 ? Math.round((historyAnalytics.resolvedCount / historyAnalytics.total) * 100) : 100}% {t.resolutionRate}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-[10px] text-slate-400 uppercase font-bold font-mono">{t.avgResponseLatency}</div>
                <div className="text-2xl font-black text-blue-600 mt-1">
                  {historyAnalytics.avgResponseMin} <span className="text-xs font-medium text-slate-500 font-sans">{t.mins}</span>
                </div>
                <div className="text-[10px] text-blue-500 font-semibold mt-1">
                  ~{historyAnalytics.avgResponseSec}{t.secs} {t.nationalBenchmark}
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-[10px] text-slate-400 uppercase font-bold font-mono">{t.goldenHourSLA}</div>
                <div className="text-2xl font-black text-emerald-600 mt-1">
                  {historyAnalytics.slaPercent}%
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                  {historyAnalytics.slaMetCount} {t.casesWithinTarget}
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-[10px] text-slate-400 uppercase font-bold font-mono">{t.hospitalErHandovers}</div>
                <div className="text-2xl font-black text-purple-600 mt-1">
                  {historyAnalytics.hospitalCount} <span className="text-xs font-medium text-slate-400 font-sans">{t.casesWord}</span>
                </div>
                <div className="text-[10px] text-purple-600 font-semibold mt-1">
                  {t.icuCathLabRes}
                </div>
              </div>
            </div>

            {/* Visual Analytical Breakdown Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Response Time Distribution */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">{t.milestoneDist}</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{t.totalAnalyzed} {historyAnalytics.total}</span>
                </div>

                <div className="space-y-2.5 pt-1">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700">{t.optimalImmediate}</span>
                      <span className="font-mono font-bold text-emerald-600">{historyAnalytics.under5Min} {t.casesWord} ({historyAnalytics.under5Pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${historyAnalytics.under5Pct}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700">{t.withinTargetSla}</span>
                      <span className="font-mono font-bold text-blue-600">{historyAnalytics.fiveToEightMin} {t.casesWord} ({historyAnalytics.fiveToEightPct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${historyAnalytics.fiveToEightPct}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700">{t.heavyCongestion}</span>
                      <span className="font-mono font-bold text-amber-600">{historyAnalytics.overEightMin} {t.casesWord} ({historyAnalytics.overEightPct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${historyAnalytics.overEightPct}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Category Distribution */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">{t.categoryBreakdown}</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{t.eocMetro}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-red-50/70 border border-red-100">
                    <div className="text-[10px] font-mono uppercase text-red-600 font-bold">{t.medicalCardiac}</div>
                    <div className="text-lg font-black text-slate-900 mt-0.5">{historyAnalytics.medicalCount} {t.casesWord}</div>
                    <div className="text-[10px] text-slate-500">{t.medicalCardiacSub}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-100">
                    <div className="text-[10px] font-mono uppercase text-orange-600 font-bold">{t.fireHazmat}</div>
                    <div className="text-lg font-black text-slate-900 mt-0.5">{historyAnalytics.fireCount} {t.casesWord}</div>
                    <div className="text-[10px] text-slate-500">{t.fireHazmatSub}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                    <div className="text-[10px] font-mono uppercase text-blue-600 font-bold">{t.highwayAccidents}</div>
                    <div className="text-lg font-black text-slate-900 mt-0.5">{historyAnalytics.accidentCount} {t.casesWord}</div>
                    <div className="text-[10px] text-slate-500">{t.highwayAccidentsSub}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100">
                    <div className="text-[10px] font-mono uppercase text-purple-600 font-bold">{t.womenSafetySos}</div>
                    <div className="text-lg font-black text-slate-900 mt-0.5">{historyAnalytics.womenSafetyCount} {t.casesWord}</div>
                    <div className="text-[10px] text-slate-500">{t.womenSafetySosSub}</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ID, caller name, location address, or responder..."
                  value={historySearchQuery}
                  onChange={e => setHistorySearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                />
                {historySearchQuery && (
                  <button 
                    onClick={() => setHistorySearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Selectors */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={historyTypeFilter}
                  onChange={e => setHistoryTypeFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Emergency Types</option>
                  <option value="medical">Medical / Cardiac</option>
                  <option value="accident">Accident / Road</option>
                  <option value="fire">Fire &amp; Rescue</option>
                  <option value="women">Women Safety SOS</option>
                  <option value="disaster">Disaster / Weather</option>
                </select>

                <select
                  value={historySeverityFilter}
                  onChange={e => setHistorySeverityFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <select
                  value={historyStatusFilter}
                  onChange={e => setHistoryStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="resolved">Resolved Only</option>
                  <option value="active">Active Only</option>
                </select>

                {(historySearchQuery || historyTypeFilter !== 'all' || historySeverityFilter !== 'all' || historyStatusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setHistorySearchQuery('');
                      setHistoryTypeFilter('all');
                      setHistorySeverityFilter('all');
                      setHistoryStatusFilter('all');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Historical Incident & Form 112 Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">Form 112-IN Incident Records</span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-semibold">
                    {filteredHistoryIncidents.length} matching
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>SHA-256 Ledger Notarized</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-mono text-[10px] uppercase">
                    <tr>
                      <th className="py-3 px-4">{t.incidentId}</th>
                      <th className="py-3 px-4">{t.type} &amp; {t.severity}</th>
                      <th className="py-3 px-4">Caller Identity (DPDP)</th>
                      <th className="py-3 px-4">Incident Location</th>
                      <th className="py-3 px-4">{t.status}</th>
                      <th className="py-3 px-4">{t.responseTime}</th>
                      <th className="py-3 px-4">{t.assignedUnit}</th>
                      <th className="py-3 px-4 text-right">{t.viewDossier}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredHistoryIncidents.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400 font-mono text-xs">
                          No emergency incident records match your selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredHistoryIncidents.map(inc => {
                        const m = calculateMilestoneMetrics(inc);
                        const mins = Math.floor(m.totalResponseSeconds / 60);
                        const secs = m.totalResponseSeconds % 60;
                        const isResolved = inc.status.toLowerCase() === 'resolved';

                        return (
                          <tr key={inc.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-4">
                              <div className="font-mono font-bold text-slate-900">{inc.id}</div>
                              <div className="text-[10px] font-mono text-slate-400 truncate max-w-[100px]" title={m.cryptographicChecksum}>
                                {m.cryptographicChecksum.slice(0, 18)}...
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-900">{inc.type}</div>
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase mt-0.5 ${
                                inc.severity.toLowerCase() === 'critical' 
                                  ? 'bg-red-50 text-red-600 border border-red-200' 
                                  : 'bg-amber-50 text-amber-600 border border-amber-200'
                              }`}>
                                {inc.severity}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-medium text-slate-800">{maskName(inc.citizenName)}</div>
                              <div className="text-[10px] font-mono text-slate-400">{maskPhoneNumber(inc.citizenPhone)}</div>
                            </td>

                            <td className="py-3 px-4 max-w-xs">
                              <div className="truncate text-slate-800 font-medium">{inc.location.address}</div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {privacySettings.fuzzyResolvedLocation && isResolved ? 'Centroid Fuzzed' : `${inc.location.lat.toFixed(4)}, ${inc.location.lng.toFixed(4)}`}
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isResolved 
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                                  : 'bg-blue-50 text-blue-600 border border-blue-200 animate-pulse'
                              }`}>
                                {inc.status}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-mono font-bold text-slate-900">
                                {mins}m {secs < 10 ? '0' : ''}{secs}s
                              </div>
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                m.slaMet 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {m.slaMet ? '✓ Within SLA' : '! Extended SLA'}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-xs">
                              <div className="font-medium text-slate-800">
                                {inc.assignedResponder?.name || 'Smart CAD'}
                              </div>
                              <div className="text-[10px] text-purple-600 font-medium truncate max-w-[140px]">
                                {inc.assignedHospital?.name || 'On-Scene Stabilization'}
                              </div>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedDossierIncident(inc)}
                                  className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Form 112</span>
                                </button>
                                <button
                                  onClick={() => handleExportIncidentJson(inc)}
                                  title="Export Incident JSON"
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 5: EMERGENCY CONTACTS DIRECTORY ================= */}
        {activeSidebarTab === 'contacts' && (
          <div className="flex-1 flex flex-col overflow-y-auto p-6 bg-[#f8fafc] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">{t.emergencyDirTitle}</h1>
                <p className="text-xs text-slate-500 mt-0.5">{t.emergencyDirSubtitle}</p>
              </div>

              <button
                onClick={() => setShowAddContactModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{t.addEmergencyContactBtn}</span>
              </button>
            </div>

            {/* National 24/7 Helplines */}
            <div>
              <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
                {t.govtHelplinesTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: t.unifiedEmergencyName, num: '112', color: 'bg-red-500 text-white', desc: t.unifiedEmergencyDesc },
                  { name: t.medicalAmbulanceName, num: '108', color: 'bg-emerald-600 text-white', desc: t.medicalAmbulanceDesc },
                  { name: t.policeControlName, num: '100', color: 'bg-blue-600 text-white', desc: t.policeControlDesc },
                  { name: t.fireRescueName, num: '101', color: 'bg-rose-600 text-white', desc: t.fireRescueDesc },
                  { name: t.womenSafetyName, num: '1091', color: 'bg-purple-600 text-white', desc: t.womenSafetyDesc },
                  { name: t.childlineName, num: '1098', color: 'bg-amber-600 text-white', desc: t.childlineDesc },
                  { name: t.disasterMgmtName, num: '1070', color: 'bg-teal-600 text-white', desc: t.disasterMgmtDesc },
                  { name: t.cyberCrimeName, num: '1930', color: 'bg-indigo-600 text-white', desc: t.cyberCrimeDesc },
                ].map(h => (
                  <div key={h.num} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl ${h.color} flex items-center justify-center font-bold text-xs shadow-xs`}>
                        {h.num}
                      </div>
                      <a
                        href={`tel:${h.num}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{t.dialBtn}</span>
                      </a>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{h.name}</div>
                      <div className="text-[11px] text-slate-500 leading-snug mt-0.5">{h.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live SOS SMS Alert Broadcast Simulator */}
            <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 p-4 rounded-2xl border border-purple-200 shadow-xs flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-slate-900">{t.smsGatewayTitle}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {t.smsGatewayDesc}
                </div>
              </div>
              <button
                onClick={() => {
                  const res = sendEmergencySmsBroadcast(currentInc.id);
                  setBroadcastSuccessToast(res.message);
                  setTimeout(() => setBroadcastSuccessToast(null), 6000);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95"
              >
                {t.simulateSmsBtn}
              </button>
            </div>

            {broadcastSuccessToast && (
              <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-xs text-emerald-900 font-medium animate-in fade-in">
                <div className="font-bold text-emerald-800 mb-0.5">{t.smsPayloadTitle}</div>
                <div className="font-mono text-[11px]">{broadcastSuccessToast}</div>
              </div>
            )}

            {/* Personal Emergency Contacts Section */}
            <div>
              <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
                {t.myContactsTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {personalContacts.map(pc => (
                  <div key={pc.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                        {pc.name[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{pc.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{pc.phone}</div>
                        <span className="text-[9px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.5 rounded">
                          {pc.relation}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${pc.phone}`}
                        className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteContact(pc.id)}
                        className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 6: SETTINGS & SAFETY PREFERENCES ================= */}
        {activeSidebarTab === 'settings' && (
          <div className="flex-1 flex flex-col overflow-y-auto p-6 bg-[#f8fafc] space-y-6 max-w-4xl">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">{t.platformSettingsTitle}</h1>
              <p className="text-xs text-slate-500 mt-0.5">{t.platformSettingsSubtitle}</p>
            </div>

            {settingsSavedToast && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t.settingsSavedMessage}</span>
              </div>
            )}

            {/* Language Selection */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{t.interfaceLanguage}</div>
                  <div className="text-[11px] text-slate-500">{t.languageDesc}</div>
                </div>
                <div className="flex gap-2">
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'hi', label: 'हिन्दी (Hindi)' },
                    { code: 'te', label: 'తెలుగు (Telugu)' },
                    { code: 'mr', label: 'मराठी (Marathi)' }
                  ].map(l => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        currentLanguage === l.code ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Audio Alerts & Siren Test */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{t.audioAlerts}</div>
                  <div className="text-[11px] text-slate-500">{t.audioAlertsDesc}</div>
                </div>
                <button
                  onClick={handleTestSiren}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                    isSirenTesting 
                      ? 'bg-red-600 text-white animate-pulse' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isSirenTesting ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-red-500" />}
                  <span>{isSirenTesting ? t.stopSiren : t.testSiren}</span>
                </button>
              </div>
            </div>

            {/* Low-Connectivity SMS Fallback */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{t.offlineModeTitle}</div>
                  <div className="text-[11px] text-slate-500">{t.offlineModeDesc}</div>
                </div>
                <button
                  onClick={() => setIsOfflineMode(!isOfflineMode)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    isOfflineMode ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isOfflineMode ? t.offlineActiveBadge : t.onlineModeBadge}
                </button>
              </div>
            </div>

            {/* Geofence Alerts Radius */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{t.geofenceTitle}</div>
                  <div className="text-[11px] text-slate-500">{t.geofenceDesc}</div>
                </div>
                <div className="flex gap-2">
                  {['1km', '3km', '5km', '10km'].map(r => (
                    <button
                      key={r}
                      onClick={() => setProximityRadius(r as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        proximityRadius === r ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Medical Emergency ID Profile */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-slate-900">{t.medicalProfileTitle}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{t.encryptedLocally}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">{t.bloodGroup}</label>
                  <select
                    value={medicalId.bloodGroup}
                    onChange={e => setMedicalId({ ...medicalId, bloodGroup: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  >
                    <option value="O+">O+ ({t.universalDonor})</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                    <option value="A-">A-</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">{t.knownAllergies}</label>
                  <input
                    type="text"
                    value={medicalId.allergies}
                    onChange={e => setMedicalId({ ...medicalId, allergies: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setSettingsSavedToast(true);
                  setTimeout(() => setSettingsSavedToast(false), 3000);
                  sound.playSuccessChime();
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                {t.saveMedicalProfileBtn}
              </button>
            </div>

          </div>
        )}

        {/* ================= TAB 7: HOSPITAL BEDS / ICU TRIAGE & ADMISSIONS ================= */}
        {activeSidebarTab === 'hospitals' && (
          <main className="flex-1 overflow-y-auto bg-[#070b14] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6 select-none">
            {/* Top Navigation Breadcrumb & Title Bar */}
            <div>
              <button
                onClick={() => setActiveSidebarTab('home')}
                className="text-slate-400 hover:text-white text-[11px] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 transition pb-3"
              >
                <span>{t.exitToDashboard}</span>
              </button>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase font-sans">
                      {t.icuTriageTitle}
                    </h1>
                  </div>
                  <p className="text-xs md:text-sm text-slate-400 mt-1">
                    {t.icuTriageSubtitle}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a1820] border border-emerald-900/60 text-emerald-400 text-[11px] font-mono font-bold tracking-wider self-start md:self-auto">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>{t.heuristicsFilter}</span>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar matching screenshot */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="relative flex-1 max-w-xl">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={hospitalSearchQuery}
                  onChange={e => setHospitalSearchQuery(e.target.value)}
                  placeholder={t.searchHospitals}
                  className="w-full bg-[#0c1220] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                />
                {hospitalSearchQuery && (
                  <button
                    onClick={() => setHospitalSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Pills matching screenshot */}
              <div className="flex items-center gap-1.5 bg-[#0c1220] p-1 rounded-xl border border-slate-800 shrink-0">
                <button
                  onClick={() => setHospitalCategoryFilter('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
                    hospitalCategoryFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.allFacilities}
                </button>
                <button
                  onClick={() => setHospitalCategoryFilter('trauma')}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
                    hospitalCategoryFilter === 'trauma'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.traumaHospitals}
                </button>
                <button
                  onClick={() => setHospitalCategoryFilter('clinic')}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
                    hospitalCategoryFilter === 'clinic'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.urgentClinics}
                </button>
              </div>
            </div>

            {/* Hospital Cards Grid (2 Columns matching user screenshot) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
              {hospitals
                .filter(h => {
                  const q = hospitalSearchQuery.toLowerCase();
                  const matchesSearch = !q || 
                    h.name.toLowerCase().includes(q) ||
                    h.area.toLowerCase().includes(q) ||
                    (h.address && h.address.toLowerCase().includes(q)) ||
                    (h.categoryTag && h.categoryTag.toLowerCase().includes(q)) ||
                    h.traumaLevel.toLowerCase().includes(q);
                  
                  const isClinic = h.facilityType === 'clinic' || h.name.toLowerCase().includes('clinic');
                  const isTrauma = h.facilityType === 'trauma' || h.traumaLevel.toLowerCase().includes('trauma');

                  if (hospitalCategoryFilter === 'trauma') return matchesSearch && isTrauma;
                  if (hospitalCategoryFilter === 'clinic') return matchesSearch && isClinic;
                  return matchesSearch;
                })
                .map(hospital => {
                  const badgeTag = hospital.categoryTag || (hospital.traumaLevel === 'Level 1 Trauma' ? 'LEVEL 1 TRAUMA' : 'GENERAL ER');
                  const starRating = hospital.rating || 4.8;
                  const proximity = hospital.proximityKm ? `${hospital.proximityKm} km` : '2.4 km';
                  const waitTime = hospital.waitTimeMin ? `${hospital.waitTimeMin} min` : '8 min';
                  const isLowBedAlert = hospital.availableIcuBeds <= 3;

                  return (
                    <div 
                      key={hospital.id}
                      className="bg-[#0c1220] border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 transition flex flex-col justify-between shadow-xl relative overflow-hidden"
                    >
                      {/* Top Pill Badges: Specialty Tag & Star Rating */}
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 font-mono text-[10px] font-bold tracking-wider uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            {badgeTag}
                          </span>

                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-950/40 border border-amber-800/40 text-amber-400 font-mono text-[11px] font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {starRating}
                          </span>
                        </div>

                        {/* Hospital Name & Address */}
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-wide mt-3.5">
                          {hospital.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{hospital.address || `${hospital.area}, Metro Hub`}</span>
                        </div>
                      </div>

                      {/* Recessed Stat Box: Proximity, ICU Beds, Wait Time */}
                      <div className="bg-[#070b14]/80 border border-slate-800/80 rounded-xl p-3 my-4 grid grid-cols-3 gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">{t.proximityLabel}</span>
                          <div className="text-xs font-bold text-white flex items-center gap-1">
                            <Navigation className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{proximity}</span>
                          </div>
                        </div>

                        <div className="space-y-0.5 border-l border-slate-800/80 pl-2">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">{t.icuBedsLabel}</span>
                          <div className={`text-xs font-bold flex items-center gap-1 ${isLowBedAlert ? 'text-amber-400' : 'text-emerald-400'}`}>
                            <Bed className="w-3 h-3 shrink-0" />
                            <span>{hospital.availableIcuBeds} {t.availableWord}</span>
                          </div>
                        </div>

                        <div className="space-y-0.5 border-l border-slate-800/80 pl-2">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">{t.erWaitTimeLabel}</span>
                          <div className="text-xs font-bold text-white flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{waitTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Row: Call Button + Book Priority Bed Button */}
                      <div className="flex items-center gap-2.5 pt-1">
                        <button
                          onClick={() => setDirectPhoneModalHospital(hospital)}
                          title={`Direct Emergency Desk: ${hospital.emergencyPhone}`}
                          className="w-11 h-11 rounded-xl bg-[#141d2e] border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center shrink-0 transition"
                        >
                          <Phone className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedBookingHospital(hospital);
                            setBookingPatientName('Sai Santhosh');
                          }}
                          className="flex-1 h-11 bg-[#059669] hover:bg-[#047857] active:bg-[#065f46] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-950/60"
                        >
                          <span>{t.bookPriorityBed}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Active Bed Reservations List (if user has booked beds) */}
            {hospitalBedBookings.length > 0 && (
              <div className="mt-8 bg-[#0c1220] border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold text-white uppercase tracking-wider">{t.activeBedReservations}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-900/60 px-2 py-0.5 rounded-full">
                    {hospitalBedBookings.length} {t.activeCount}
                  </span>
                </div>

                <div className="space-y-3">
                  {hospitalBedBookings.slice(0, 4).map(bk => (
                    <div 
                      key={bk.id}
                      className="p-3.5 rounded-xl bg-[#070b14] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{bk.hospitalName}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-400 text-[10px] font-mono font-bold">
                            {bk.status}
                          </span>
                        </div>
                        <div className="text-slate-400 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span>{t.patientLabel} <b className="text-slate-200">{bk.patientName}</b></span>
                          <span>{t.bypassTokenLabel} <b className="font-mono text-emerald-400">{bk.token}</b></span>
                          <span>{t.bayLabel} <b className="text-slate-200">{bk.erBayAssigned}</b></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setActiveBookingConfirmation(bk)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                        >
                          {t.viewPassBtn}
                        </button>
                        <button
                          onClick={() => {
                            setActiveSidebarTab('map');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>{t.mapRouteBtn}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        )}

        {/* ================= TAB 8: NATIONAL BLOOD ALLOCATION & COLD-CHAIN ================= */}
        {activeSidebarTab === 'blood' && (
          <main className="flex-1 overflow-y-auto bg-[#070b14] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6 select-none">
            {/* Top Navigation Breadcrumb & Title Bar */}
            <div>
              <button
                onClick={() => setActiveSidebarTab('home')}
                className="text-slate-400 hover:text-white text-[11px] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 transition pb-3"
              >
                <span>{t.exitToDashboard}</span>
              </button>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                    </span>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase font-sans">
                      {t.nationalBloodTitle}
                    </h1>
                  </div>
                  <p className="text-xs md:text-sm text-slate-400 mt-1">
                    {t.nationalBloodSubtitle}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1b0d10] border border-red-900/60 text-red-400 text-[11px] font-mono font-bold tracking-wider self-start md:self-auto">
                  <Truck className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                  <span>{t.coldChainSecuredBadge}</span>
                </div>
              </div>
            </div>

            {/* Filter Section matching screenshot */}
            <div className="bg-[#0c1220] border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  <span>{t.filterByBloodGroup}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-0.5 rounded-full">
                  {t.liveBiomarkerTelemetry}
                </span>
              </div>

              {/* 8 Blood Group Buttons matching screenshot */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => {
                  const isSelected = selectedBloodGroup === group;
                  return (
                    <button
                      key={group}
                      onClick={() => {
                        setSelectedBloodGroup(group);
                        sound.playNotificationBeep();
                      }}
                      className={`h-11 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#dc2626] text-white shadow-lg shadow-red-950/80 ring-2 ring-red-500/60 scale-[1.02]'
                          : 'bg-[#0f1422] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {group}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Blood Banks Grid (2 Columns matching user screenshot) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
              {bloodBanks
                .filter(bb => {
                  const q = bloodSearchQuery.toLowerCase();
                  return !q || bb.name.toLowerCase().includes(q) || bb.area.toLowerCase().includes(q);
                })
                .map(bloodBank => {
                  const availableUnits = bloodBank.inventory[selectedBloodGroup] || 0;
                  const isDepleted = availableUnits === 0;

                  return (
                    <div
                      key={bloodBank.id}
                      className="bg-[#0c1220] border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 transition flex flex-col justify-between shadow-xl relative overflow-hidden"
                    >
                      {/* Top Row: Name and Distance Pill */}
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                              {bloodBank.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span className="truncate">{bloodBank.address}</span>
                            </div>
                          </div>

                          <span className="bg-[#141b2d] border border-slate-800 text-slate-300 text-[11px] font-mono px-2.5 py-1 rounded-lg shrink-0">
                            {bloodBank.distanceKm} km
                          </span>
                        </div>
                      </div>

                      {/* Recessed Stat Box matching screenshot */}
                      <div className="bg-[#070b14]/80 border border-slate-800/80 rounded-xl p-4 my-4 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                            {t.availableReserveUnits} ({selectedBloodGroup})
                          </span>
                          <div className={`text-2xl sm:text-3xl font-black mt-1 ${isDepleted ? 'text-slate-500' : 'text-red-500'}`}>
                            {availableUnits} Bags
                          </div>
                        </div>

                        <div>
                          {isDepleted ? (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-red-400 bg-red-950/40 border border-red-900/50 px-2.5 py-1 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                              DEPLETED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-1 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              VERIFIED STOCK
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom Action Row: Call Button + Reserve Button */}
                      <div className="flex items-center gap-2.5 pt-1">
                        <button
                          onClick={() => setDirectPhoneModalBloodBank(bloodBank)}
                          title={`Direct Blood Bank Desk: ${bloodBank.phone}`}
                          className="w-11 h-11 rounded-xl bg-[#141d2e] border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center shrink-0 transition"
                        >
                          <Phone className="w-4 h-4" />
                        </button>

                        {isDepleted ? (
                          <button
                            disabled
                            className="flex-1 h-11 bg-[#220d11] border border-red-950/60 text-slate-500 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                          >
                            <span>{t.reserveColdChainBtn}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedBloodBankForBooking(bloodBank);
                              setBloodUnitsCount(Math.min(2, availableUnits));
                            }}
                            className="flex-1 h-11 bg-[#dc2626] hover:bg-[#b91c1c] active:bg-[#991b1b] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-red-950/80"
                          >
                            <span>{t.reserveColdChainBtn}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Active Cold-Chain Blood Dispatches List (if any reservations exist) */}
            {bloodReservations.length > 0 && (
              <div className="mt-8 bg-[#0c1220] border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-bold text-white uppercase tracking-wider">
                      {t.activeBloodDispatches}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-red-400 bg-red-950/50 border border-red-900/60 px-2 py-0.5 rounded-full">
                    {bloodReservations.length} Units In-Transit
                  </span>
                </div>

                <div className="space-y-3">
                  {bloodReservations.slice(0, 4).map(res => (
                    <div
                      key={res.id}
                      className="p-3.5 rounded-xl bg-[#070b14] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{res.bloodBankName}</span>
                          <span className="px-2 py-0.5 rounded bg-red-900/50 text-red-400 text-[10px] font-mono font-bold">
                            {res.unitsCount} Bags ({res.bloodGroup})
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400 text-[10px] font-mono">
                            Temp: {res.temperatureCelsius}°C
                          </span>
                        </div>
                        <div className="text-slate-400 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span>Patient: <b className="text-slate-200">{res.patientName}</b></span>
                          <span>Dispatch Token: <b className="font-mono text-red-400">{res.token}</b></span>
                          <span>Hospital: <b className="text-slate-200">{res.patientHospital}</b></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setActiveBloodReservationReceipt(res)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                        >
                          View Pass
                        </button>
                        <button
                          onClick={() => setActiveSidebarTab('map')}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-1"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Track Courier</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        )}

      </div>

      {/* ================= MODAL 1: AI CLINICAL TRIAGE ANALYSIS ================= */}
      {showTriageDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setShowTriageDetails(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t.incidentDispatchDetails}</h3>
                <div className="text-[11px] text-slate-500">Gemini 2.5 Flash Emergency Medical Model • 92% Confidence</div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-semibold text-slate-600">Classification</span>
                <span className="font-bold text-red-600 bg-red-100 px-2.5 py-0.5 rounded-full">
                  Severe Trauma / Road Collision
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-600 block mb-1">Identified Clinical Risk Factors:</span>
                <ul className="space-y-1 text-slate-700 pl-4 list-disc">
                  <li>Blunt head trauma with transient loss of consciousness (GCS score &lt; 12)</li>
                  <li>Active high-traffic roadside exposure on flyover ramp</li>
                  <li>Potential cervical spine injury: Strict immobilization requested</li>
                </ul>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-600">Prescribed Protocol</span>
                <span className="font-mono font-bold text-slate-900">ALS Trauma Protocol 4B</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-600">Designated Facility</span>
                <span className="font-bold text-blue-600">Care Hospital (Level-1 Trauma)</span>
              </div>
            </div>

            <button
              onClick={() => setShowTriageDetails(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: RESPONSE TELEMETRY & PROGRESS ================= */}
      {showResponseDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setShowResponseDetails(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t.liveTelemetry}</h3>
                <div className="text-[11px] text-slate-500">Unit #MH-042 • Live GPS Breadcrumb Tracking</div>
              </div>
            </div>

            {/* Telemetry Metric Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Current Speed</div>
                <div className="text-lg font-black text-slate-900 font-mono mt-0.5">48 km/h</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Distance Left</div>
                <div className="text-lg font-black text-blue-600 font-mono mt-0.5">1.8 km</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">GPS Accuracy</div>
                <div className="text-lg font-black text-emerald-600 font-mono mt-0.5">±4m</div>
              </div>
            </div>

            {/* Milestone Chronology */}
            <div className="space-y-2 text-xs">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Chronological Dispatch Milestones</div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between text-slate-700">
                  <span>14:32:00</span>
                  <span className="font-bold">SOS Beacon Initiated via Citizen Portal</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>14:32:15</span>
                  <span>Geofence GPS verified (±6m accuracy)</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>14:33:02</span>
                  <span>AI Triage rated CRITICAL (Head Trauma)</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>14:34:10</span>
                  <span>Smart Dispatch assigned Unit #MH-042</span>
                </div>
                <div className="flex justify-between text-blue-600 font-bold">
                  <span>14:34:40</span>
                  <span>En route on Green Corridor corridor</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowResponseDetails(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: NEARBY SERVICES DIRECTORY ================= */}
      {showNearbyServicesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setShowNearbyServicesModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t.nearbyServices}</h3>
                <div className="text-[11px] text-slate-500">{t.emergencyFacilitiesHeader}</div>
              </div>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {[
                { name: 'Care Hospital Banjara Hills', type: 'Level-1 Trauma Center', beds: '12 ICU Beds', dist: '1.2 km', phone: '+91 40 6165 6565' },
                { name: 'Apollo Health City Jubilee Hills', type: 'Tertiary Emergency Care', beds: '18 ICU Beds', dist: '2.5 km', phone: '+91 40 2360 7777' },
                { name: 'Yashoda Hospitals Somajiguda', type: 'Cardio-Thoracic Trauma', beds: '8 ICU Beds', dist: '3.4 km', phone: '+91 40 4567 4567' },
                { name: 'Banjara Hills Police Station', type: 'Law Enforcement', beds: '4 Patrols Standing By', dist: '1.8 km', phone: '100' },
                { name: 'Madhapur Fire Substation', type: 'Fire & Rescue', beds: '2 Heavy Tenders Ready', dist: '3.1 km', phone: '101' },
                { name: 'Red Cross Regional Blood Bank', type: 'Blood Bank', beds: 'All Groups Available', dist: '4.0 km', phone: '+91 40 2763 3087' },
              ].map(fac => (
                <div key={fac.name} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{fac.name}</div>
                    <div className="text-[10px] text-slate-500">{fac.type} • <span className="text-emerald-600 font-bold">{fac.beds}</span></div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{fac.dist} away</div>
                  </div>
                  <a
                    href={`tel:${fac.phone}`}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowNearbyServicesModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: STAY SAFE GUIDELINES ================= */}
      {showSafetyGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setShowSafetyGuideModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t.safetyGuideHeading}</h3>
                <div className="text-[11px] text-slate-500">Official Hyderabad Emergency Dispatch Guidelines</div>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-red-50 rounded-2xl border border-red-100">
                <div className="font-bold text-red-900 mb-1">Cardiac Arrest (Hands-Only CPR)</div>
                <div className="text-red-700 leading-relaxed">
                  Push hard and fast in the center of the chest at 100-120 beats per minute (to the beat of Stayin' Alive). Do not stop until paramedics arrive.
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="font-bold text-blue-900 mb-1">Severe Bleeding & Road Accidents</div>
                <div className="text-blue-700 leading-relaxed">
                  Apply firm direct pressure with a clean cloth. Do not move an injured person if spinal damage is suspected unless imminent fire danger exists.
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="font-bold text-amber-900 mb-1">Good Samaritan Protection Act</div>
                <div className="text-amber-700 leading-relaxed">
                  Under Indian Supreme Court guidelines, citizens helping victims cannot be harassed by police, detained at hospitals, or forced to pay deposits.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSafetyGuideModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: ADD CONTACT ================= */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setShowAddContactModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t.addNewContact}</h3>
                <div className="text-[11px] text-slate-500">{t.contactsAlerted}</div>
              </div>
            </div>

            <form onSubmit={handleAddContact} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">{t.name}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh (Spouse)"
                  value={newContactName}
                  onChange={e => setNewContactName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t.phone}</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98480 12345"
                  value={newContactPhone}
                  onChange={e => setNewContactPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t.relation}</label>
                <select
                  value={newContactRelation}
                  onChange={e => setNewContactRelation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                >
                  <option value="Family">Family / Parent</option>
                  <option value="Spouse">Spouse / Partner</option>
                  <option value="Doctor">Physician / Doctor</option>
                  <option value="Friend">Friend / Colleague</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 6: INCIDENT INSPECTOR MODAL ================= */}
      {selectedIncidentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setSelectedIncidentModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedIncidentModal.type} Incident</h3>
                <div className="text-[11px] text-slate-500 font-mono">{selectedIncidentModal.id}</div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{t.severity}</span>
                <span className={`font-bold px-2 py-0.5 rounded-full ${
                  selectedIncidentModal.severity === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {selectedIncidentModal.severity}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{t.status}</span>
                <span className="font-bold text-blue-600">{selectedIncidentModal.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{t.distanceLabel}</span>
                <span className="font-bold text-slate-800 truncate max-w-xs">{selectedIncidentModal.location.address}</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block mb-0.5">Description:</span>
                <p className="text-slate-700 leading-relaxed">{selectedIncidentModal.description}</p>
              </div>
            </div>

            {/* Tactical Action Tools: Multi-Unit Coordination, Green Corridor, SLA Escalation, Google Maps */}
            <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
              
              {/* Traffic Green Corridor Bar */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <TrafficCone className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Traffic Green Corridor</div>
                    <div className="text-[10px] text-slate-500">Pre-empts traffic signals along transit corridor</div>
                  </div>
                </div>
                <button
                  onClick={() => toggleGreenCorridor(selectedIncidentModal.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    selectedIncidentModal.greenCorridorActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{selectedIncidentModal.greenCorridorActive ? 'ENGAGED' : 'ENGAGE'}</span>
                </button>
              </div>

              {/* Multi-Unit Coordination: Secondary Units */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="font-bold text-slate-900 text-xs">Coordinated Units</span>
                  </div>
                  <button
                    onClick={() => setShowCoordinationModal(true)}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    + Dispatch Secondary Unit
                  </button>
                </div>
                <div className="text-[11px] text-slate-600">
                  Primary: <strong>{selectedIncidentModal.assignedResponder?.name || 'Unassigned'}</strong>
                  {selectedIncidentModal.coordinatingResponders && selectedIncidentModal.coordinatingResponders.length > 0 && (
                    <span className="ml-2 text-purple-700 font-semibold">
                      • Backup: {selectedIncidentModal.coordinatingResponders.map(c => `${c.responder.callSign} (${c.role})`).join(', ')}
                    </span>
                  )}
                </div>
              </div>

              {/* SLA Escalation Bar */}
              <div className="p-2.5 rounded-xl bg-red-50/60 border border-red-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-red-900 text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    <span>SLA Escalation Tier: {selectedIncidentModal.escalationTier || 0}</span>
                  </div>
                  <div className="text-[10px] text-red-700">Widens dispatch radius & alerts Zonal Police Inspector</div>
                </div>
                <button
                  onClick={() => escalateIncident(selectedIncidentModal.id)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shadow-xs transition active:scale-95"
                >
                  Escalate Tier
                </button>
              </div>

              {/* Navigation link */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedIncidentModal.location.lat},${selectedIncidentModal.location.lng}&travelmode=driving`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Open Navigation in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>

            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedIncidentModal(null);
                  setActiveSidebarTab('home');
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition"
              >
                {t.trackLive}
              </button>
              <button
                onClick={() => setSelectedIncidentModal(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FORM 112-IN AFTER-ACTION REPORT & DOSSIER MODAL ================= */}
      {selectedDossierIncident && (() => {
        const m = calculateMilestoneMetrics(selectedDossierIncident);
        const mins = Math.floor(m.totalResponseSeconds / 60);
        const secs = m.totalResponseSeconds % 60;
        const targetMins = Math.floor(m.slaTargetSeconds / 60);
        const isShaVerified = verifiedShaIncidentId === selectedDossierIncident.id;

        return (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 relative space-y-6 max-h-[92vh] overflow-y-auto font-sans">
              
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedDossierIncident(null);
                  setVerifiedShaIncidentId(null);
                }}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Official Document Header */}
              <div className="border-b-2 border-slate-900 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg font-mono">
                      112
                    </div>
                    <div>
                      <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">
                        Government of India • Ministry of Health &amp; Family Welfare
                      </div>
                      <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                        FORM 112-IN: Emergency After-Action Incident Dossier
                      </h2>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full uppercase">
                      Statutory Audit Record
                    </span>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">
                      ISO 27001 &amp; DPDP Compliant
                    </div>
                  </div>
                </div>

                {/* Key Summary Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-2xl p-3 border border-slate-200 mt-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Incident ID</span>
                    <span className="font-mono font-black text-slate-900">{selectedDossierIncident.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Emergency Category</span>
                    <span className="font-bold text-slate-900">{selectedDossierIncident.type}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Severity Classification</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      selectedDossierIncident.severity.toLowerCase() === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {selectedDossierIncident.severity}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Reported Timestamp</span>
                    <span className="font-mono font-medium text-slate-700">
                      {new Date(selectedDossierIncident.createdAt || selectedDossierIncident.timestamp || Date.now()).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Milestone Timeline Table (T0 to T6) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wide flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    Response Milestone Latency Delta (T0 to T6)
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      Target SLA: &le; {targetMins}m 00s
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      m.slaMet ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {m.slaMet ? '✓ SLA Target Met' : '! SLA Target Exceeded'}
                    </span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono text-slate-500 uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Milestone Code</th>
                        <th className="py-2.5 px-3">Operational Event</th>
                        <th className="py-2.5 px-3">Absolute Time</th>
                        <th className="py-2.5 px-3">Elapsed Delta</th>
                        <th className="py-2.5 px-3">Audit Verifier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      <tr>
                        <td className="py-2 px-3 font-bold text-blue-600">T0</td>
                        <td className="py-2 px-3 font-sans font-medium text-slate-800">Distress Signal Received</td>
                        <td className="py-2 px-3 text-slate-600">{new Date(m.t0_callReceived).toLocaleTimeString()}</td>
                        <td className="py-2 px-3 text-slate-400">0s (Baseline)</td>
                        <td className="py-2 px-3 font-sans text-slate-500">Telecom CTI Inbound</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-blue-600">T1</td>
                        <td className="py-2 px-3 font-sans font-medium text-slate-800">Clinical AI Triage &amp; EMD Grade</td>
                        <td className="py-2 px-3 text-slate-600">{new Date(m.t1_triageVerified).toLocaleTimeString()}</td>
                        <td className="py-2 px-3 text-emerald-600 font-bold">+{Math.round((m.t1_triageVerified - m.t0_callReceived) / 1000)}s</td>
                        <td className="py-2 px-3 font-sans text-slate-500">Gemini Triage Engine</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-blue-600">T2</td>
                        <td className="py-2 px-3 font-sans font-medium text-slate-800">CAD Dispatch Lock &amp; Unit Alert</td>
                        <td className="py-2 px-3 text-slate-600">{new Date(m.t2_unitDispatched).toLocaleTimeString()}</td>
                        <td className="py-2 px-3 text-emerald-600 font-bold">+{Math.round((m.t2_unitDispatched - m.t0_callReceived) / 1000)}s</td>
                        <td className="py-2 px-3 font-sans text-slate-500">Lifeline Smart CAD</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-blue-600">T3</td>
                        <td className="py-2 px-3 font-sans font-medium text-slate-800">Wheels Rolling (En Route Transit)</td>
                        <td className="py-2 px-3 text-slate-600">{new Date(m.t3_wheelsRolling).toLocaleTimeString()}</td>
                        <td className="py-2 px-3 text-emerald-600 font-bold">+{Math.round((m.t3_wheelsRolling - m.t0_callReceived) / 1000)}s</td>
                        <td className="py-2 px-3 font-sans text-slate-500">MDT Mobile Terminal</td>
                      </tr>
                      <tr className="bg-blue-50/50">
                        <td className="py-2 px-3 font-bold text-blue-800">T4</td>
                        <td className="py-2 px-3 font-sans font-bold text-blue-900">On-Scene Arrival (Primary Response)</td>
                        <td className="py-2 px-3 text-blue-900 font-bold">
                          {m.t4_onSceneArrival ? new Date(m.t4_onSceneArrival).toLocaleTimeString() : 'In Progress'}
                        </td>
                        <td className="py-2 px-3 text-blue-700 font-black">
                          {mins}m {secs < 10 ? '0' : ''}{secs}s
                        </td>
                        <td className="py-2 px-3 font-sans text-blue-800 font-bold">Geofence GPS Lock</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-purple-600">T5</td>
                        <td className="py-2 px-3 font-sans font-medium text-slate-800">Trauma Center / Hospital Handover</td>
                        <td className="py-2 px-3 text-slate-600">
                          {m.t5_hospitalHandover ? new Date(m.t5_hospitalHandover).toLocaleTimeString() : 'Stabilized On-Scene'}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {m.t5_hospitalHandover ? `+${Math.round((m.t5_hospitalHandover - m.t0_callReceived) / 60000)}m` : 'N/A'}
                        </td>
                        <td className="py-2 px-3 font-sans text-slate-500">ER Registrar Biometric</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-emerald-600">T6</td>
                        <td className="py-2 px-3 font-sans font-medium text-slate-800">Incident Cleared &amp; Closed</td>
                        <td className="py-2 px-3 text-slate-600">
                          {m.t6_incidentResolved ? new Date(m.t6_incidentResolved).toLocaleTimeString() : 'Active Response'}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {m.t6_incidentResolved ? `+${Math.round((m.t6_incidentResolved - m.t0_callReceived) / 60000)}m` : 'In Field'}
                        </td>
                        <td className="py-2 px-3 font-sans text-slate-500">Incident Commander</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Operational & Clinical Detail Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* Caller & Location Privacy Protected */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Citizen &amp; Location Record</span>
                    <span className="text-[9px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                      DPDP Masked
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Citizen / Caller:</span>
                    <span className="font-bold text-slate-800 font-mono">{maskName(selectedDossierIncident.citizenName)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">VoIP Relay Phone:</span>
                    <span className="font-bold text-blue-600 font-mono">{maskPhoneNumber(selectedDossierIncident.citizenPhone)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Incident Address:</span>
                    <span className="font-medium text-slate-800">{selectedDossierIncident.location.address}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">GPS Telemetry Precision:</span>
                    <span className="font-mono text-slate-600">
                      {privacySettings.fuzzyResolvedLocation && selectedDossierIncident.status.toLowerCase() === 'resolved' 
                        ? `Centroid Fuzzed (${selectedDossierIncident.location.lat.toFixed(2)}, ${selectedDossierIncident.location.lng.toFixed(2)})`
                        : `WGS84 High Precision (${selectedDossierIncident.location.lat.toFixed(5)}, ${selectedDossierIncident.location.lng.toFixed(5)})`}
                    </span>
                  </div>
                </div>

                {/* Tactical Units & Hospital Bed Reservation */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Resource Allocation</span>
                    <span className="text-[9px] font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-bold">
                      CAD Notarized
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Primary Dispatched Unit:</span>
                    <span className="font-bold text-slate-800">
                      {selectedDossierIncident.assignedResponder?.name || 'Smart CAD Unit'} ({selectedDossierIncident.assignedResponder?.callSign || 'HYD-ALS-01'})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Receiving Emergency Facility:</span>
                    <span className="font-bold text-purple-700">
                      {selectedDossierIncident.assignedHospital?.name || 'On-Scene Stabilization & Local Clinic'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Traffic Signal Green Corridor:</span>
                    <span className={`font-bold ${selectedDossierIncident.greenCorridorActive ? 'text-emerald-600' : 'text-slate-600'}`}>
                      {selectedDossierIncident.greenCorridorActive ? 'ENGAGED (Pre-cleared Corridor)' : 'STANDARD TRANSIT'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Clinical Triage Description:</span>
                    <p className="text-slate-700 italic mt-0.5 leading-relaxed font-sans">{selectedDossierIncident.description}</p>
                  </div>
                </div>

              </div>

              {/* Cryptographic Tamper-Evident SHA-256 Seal */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                      Cryptographic Evidence Seal (HMAC-SHA256)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Immutable Chain-of-Custody
                  </span>
                </div>

                <div className="bg-black/50 p-2.5 rounded-xl font-mono text-[11px] text-cyan-300 break-all select-all border border-slate-800">
                  {m.cryptographicChecksum}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <div className="text-[10px] text-slate-400">
                    {isShaVerified ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        CERTIFIED VALID: Cryptographic checksum matches Telangana State Disaster Management ledger.
                      </span>
                    ) : (
                      <span>Click to verify signature integrity against emergency ledger.</span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setVerifiedShaIncidentId(selectedDossierIncident.id);
                      logDataAccess('Auditor', 'VERIFY_HMAC_SHA256', selectedDossierIncident.id, 'Medico-Legal Authenticity Validation');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                      isShaVerified 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700'
                    }`}
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>{isShaVerified ? 'Verified Authentic' : 'Verify Integrity'}</span>
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Protected under <strong>Good Samaritan Act</strong> &amp; <strong>DPDP Act 2023</strong>.
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{t.incidentDossierTitle}</span>
                  </button>

                  <button
                    onClick={() => handleExportIncidentJson(selectedDossierIncident)}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t.exportJson}</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedDossierIncident(null);
                      setVerifiedShaIncidentId(null);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                  >
                    {t.close}
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* MULTI-UNIT COORDINATION MODAL */}
      {showCoordinationModal && selectedIncidentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-5 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                {t.assignedUnit}
              </h3>
              <button onClick={() => setShowCoordinationModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>
            <p className="text-xs text-slate-500">
              Select available mobile responder to coordinate with primary unit on {selectedIncidentModal.id}:
            </p>
            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {responders.filter(r => r.id !== selectedIncidentModal.assignedResponderId).map(r => (
                <div key={r.id} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{r.name}</div>
                    <div className="text-[10px] text-slate-500">{r.callSign} • {r.type} ({r.status})</div>
                  </div>
                  <button
                    onClick={() => {
                      assignCoordinatingResponder(selectedIncidentModal.id, r.id, `${r.type} Escort`);
                      setShowCoordinationModal(false);
                      setSelectedIncidentModal(prev => prev ? {
                        ...prev,
                        coordinatingResponders: [
                          ...(prev.coordinatingResponders || []),
                          { responderId: r.id, responder: { ...r, status: 'Dispatched' }, role: `${r.type} Escort` }
                        ]
                      } : null);
                    }}
                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-[10px]"
                  >
                    Assign Coordinated
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowCoordinationModal(false)}
              className="w-full py-2 bg-slate-100 text-xs font-semibold rounded-xl text-slate-700"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* ================= AMBULANCE BOOKED & DISPATCHED MODAL ================= */}
      {bookedAmbulanceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0b0f19] border-2 border-red-500/80 rounded-3xl shadow-[0_0_80px_rgba(239,68,68,0.4)] p-6 relative space-y-5 text-white animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setBookedAmbulanceModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header with Pulsing Horn & Beacon */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse shrink-0">
                <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/><path d="M7 10a5 5 0 0 1 10 0v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6z"/><path d="M5 22h14"/><path d="M9 18h6"/>
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-red-400 uppercase bg-red-950/80 border border-red-800/80 px-2 py-0.5 rounded-full">
                    EMERGENCY BOOKED
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    HORN SIGNAL ACTIVE
                  </span>
                </div>
                <h3 className="text-xl font-black tracking-tight text-white mt-1">
                  {t.emergencyDispatchTitle}
                </h3>
                <p className="text-xs text-slate-400">
                  {t.sosTriggered}
                </p>
              </div>
            </div>

            {/* Dispatched Vehicle & Driver Telemetry Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Assigned Unit</div>
                  <div className="text-base font-black text-white font-mono flex items-center gap-2">
                    <span>{bookedAmbulanceModal.responder.callSign}</span>
                    <span className="text-[10px] font-sans font-bold bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded-full">
                      {bookedAmbulanceModal.responder.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Live ETA</div>
                  <div className="text-2xl font-black font-mono text-emerald-400 tracking-tight animate-pulse">
                    ~{bookedAmbulanceModal.etaMinutes}m 45s
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-slate-500 block">Lead Paramedic:</span>
                  <span className="font-bold text-slate-200">{bookedAmbulanceModal.responder.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Emergency Comms:</span>
                  <a href={`tel:${bookedAmbulanceModal.responder.phone}`} className="font-mono font-bold text-cyan-400 hover:underline">
                    {bookedAmbulanceModal.responder.phone}
                  </a>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-800/60">
                  <span className="text-slate-500 block">Destination Pickup:</span>
                  <span className="font-medium text-slate-300">{bookedAmbulanceModal.incident.location.address}</span>
                </div>
              </div>

              {/* Traffic Corridor Notice */}
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-900/50 flex items-center gap-2 text-[11px] text-emerald-300">
                <TrafficCone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pre-clearing traffic signal corridor along Hitech City flyover</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                onClick={() => {
                  setBookedAmbulanceModal(null);
                  setActiveSidebarTab('home');
                }}
                className="w-full sm:flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-red-900/40"
              >
                <Navigation className="w-4 h-4" />
                <span>{t.trackLive}</span>
              </button>
              <a
                href={`tel:${bookedAmbulanceModal.responder.phone}`}
                className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t.callResponder}</span>
              </a>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL: PRIORITY HOSPITAL BED RESERVATION ================= */}
      {selectedBookingHospital && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0c1220] rounded-3xl border border-slate-700/80 shadow-2xl p-6 relative space-y-5 text-slate-100 my-8">
            <button
              onClick={() => setSelectedBookingHospital(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                  {selectedBookingHospital.categoryTag || 'LEVEL 1 TRAUMA'}
                </span>
                <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {selectedBookingHospital.rating || 4.8}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                {selectedBookingHospital.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {selectedBookingHospital.address || `${selectedBookingHospital.area}, Metro Hub`}
              </p>
            </div>

            {/* Live Availability Pill Banner */}
            <div className="bg-[#070b14] border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Bed className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-emerald-400">{selectedBookingHospital.availableIcuBeds} ICU Beds Available</div>
                  <div className="text-[10px] text-slate-400">Queue bypass priority gate enabled</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-mono uppercase">ER Wait</div>
                <div className="text-xs font-bold text-slate-200">{selectedBookingHospital.waitTimeMin || 8} min</div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="space-y-4 text-xs">
              {/* Patient Demographics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">{t.patientLabel}</label>
                  <input
                    type="text"
                    value={bookingPatientName}
                    onChange={e => setBookingPatientName(e.target.value)}
                    placeholder="Patient Name"
                    className="w-full bg-[#141d2e] border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">{t.contactNumber}</label>
                  <input
                    type="text"
                    value={bookingPatientPhone}
                    onChange={e => setBookingPatientPhone(e.target.value)}
                    placeholder="+91 Phone"
                    className="w-full bg-[#141d2e] border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">{t.name}</label>
                  <input
                    type="number"
                    value={bookingPatientAge}
                    onChange={e => setBookingPatientAge(e.target.value)}
                    className="w-full bg-[#141d2e] border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">{t.medicalId}</label>
                  <select
                    value={bookingPatientGender}
                    onChange={e => setBookingPatientGender(e.target.value)}
                    className="w-full bg-[#141d2e] border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Clinical Condition / Triage */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">{t.reasonAdmission}</label>
                <select
                  value={bookingCondition}
                  onChange={e => setBookingCondition(e.target.value)}
                  className="w-full bg-[#141d2e] border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="Critical Trauma / Polytrauma">Critical Trauma / Polytrauma (High-Speed Road Collision)</option>
                  <option value="Acute STEMI / Cardiac Arrest">Acute STEMI / Cardiac Arrest / Chest Pain</option>
                  <option value="Acute Hypoxic Respiratory Failure">Acute Hypoxic Respiratory Failure (Needs Mechanical Ventilator)</option>
                  <option value="Acute Cerebrovascular Stroke">Acute Cerebrovascular Stroke (Thrombolysis Window)</option>
                  <option value="Pediatric Emergency / Severe Shock">Pediatric Emergency / Severe Shock</option>
                  <option value="Severe Burns / Inhalation Injury">Severe Burns / Inhalation Injury</option>
                  <option value="General Acute Emergency">General Acute Emergency</option>
                </select>
              </div>

              {/* Bed Type Selection */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">{t.bedCategory}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'icu_ventilator', label: 'ICU + Ventilator', desc: 'Mechanical ventilator & invasive monitor' },
                    { id: 'cardiac_cicu', label: 'Cardiac ICU (CICU)', desc: 'Cath-lab standby & pacing support' },
                    { id: 'hdu', label: 'High Dependency (HDU)', desc: 'Semi-intensive step-down telemetry' },
                    { id: 'trauma_bay', label: 'Trauma Resus Bay', desc: 'Level 1 trauma resuscitation suite' },
                  ].map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBookingBedType(b.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        bookingBedType === b.id
                          ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-xs'
                          : 'bg-[#141d2e] border-slate-700/80 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>{b.label}</span>
                        {bookingBedType === b.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{b.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Transport Mode */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">{t.emergencyWord}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ambulance', label: 'Via Ambulance', desc: '108 / Lifeline' },
                    { id: 'private_vehicle', label: 'Private Vehicle', desc: 'Self-transport' },
                    { id: 'need_dispatch', label: 'Dispatch Ambulance', desc: 'Auto-dispatch' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setBookingTransportMode(t.id as any)}
                      className={`p-2 rounded-xl border text-center transition ${
                        bookingTransportMode === t.id
                          ? 'bg-emerald-950/50 border-emerald-500 text-white'
                          : 'bg-[#141d2e] border-slate-700/80 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold text-xs">{t.label}</div>
                      <div className="text-[9px] text-slate-400">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">{t.incidentDispatchDetails}</label>
                <input
                  type="text"
                  value={bookingNotes}
                  onChange={e => setBookingNotes(e.target.value)}
                  placeholder="e.g. SpO2 92%, BP 100/70, known allergies..."
                  className="w-full bg-[#141d2e] border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedBookingHospital(null)}
                className="w-1/3 py-3 bg-[#141d2e] hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs transition"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!selectedBookingHospital) return;
                  const newBooking = bookHospitalBed({
                    hospitalId: selectedBookingHospital.id,
                    hospitalName: selectedBookingHospital.name,
                    patientName: bookingPatientName || 'Sai Santhosh',
                    patientPhone: bookingPatientPhone || '+91 98490 22119',
                    patientAge: bookingPatientAge || '28',
                    patientGender: bookingPatientGender || 'Male',
                    condition: bookingCondition,
                    bedType: bookingBedType,
                    transportMode: bookingTransportMode,
                    notes: bookingNotes
                  });

                  // If user also requested ambulance dispatch, auto dispatch nearest unit
                  if (bookingTransportMode === 'need_dispatch') {
                    createEmergency({
                      type: 'Medical',
                      severity: 'Critical',
                      description: `ICU Bed Transfer to ${selectedBookingHospital.name}: ${bookingCondition} (${bookingPatientName})`,
                      citizenName: bookingPatientName,
                      citizenPhone: bookingPatientPhone
                    }).then(inc => {
                      smartDispatch(inc.id);
                    });
                  }

                  setSelectedBookingHospital(null);
                  setActiveBookingConfirmation(newBooking);
                }}
                className="flex-1 py-3 bg-[#059669] hover:bg-[#047857] active:bg-[#065f46] text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/80"
              >
                <Check className="w-4 h-4" />
                <span>{t.confirmBedBooking}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PRIORITY ADMISSION PASS CONFIRMATION ================= */}
      {activeBookingConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0c1220] rounded-3xl border border-emerald-500/50 shadow-2xl p-6 relative space-y-5 text-slate-100">
            <button
              onClick={() => setActiveBookingConfirmation(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Top Success Badge */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                  FAST-TRACK PRE-ARRIVAL RESERVATION
                </span>
                <h3 className="text-lg font-bold text-white tracking-wide mt-1">
                  {t.priorityPassTitle}
                </h3>
              </div>
            </div>

            {/* Admission Pass Ticket */}
            <div className="bg-[#070b14] border border-slate-800 rounded-2xl p-4.5 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Hospital Hub</span>
                  <span className="font-bold text-white text-sm">{activeBookingConfirmation.hospitalName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Bypass Token</span>
                  <span className="font-black font-mono text-emerald-400 text-sm">{activeBookingConfirmation.token}</span>
                </div>
              </div>

              {/* QR Code and Queue Bypass Directive */}
              <div className="flex items-center gap-4 bg-[#0c1220] p-3 rounded-xl border border-slate-800/80">
                {/* Simulated QR Code Graphic */}
                <div className="w-20 h-20 bg-white rounded-lg p-1.5 flex flex-col justify-between shrink-0 shadow-md">
                  <div className="flex justify-between">
                    <div className="w-4 h-4 bg-slate-900 rounded-xs"></div>
                    <div className="w-4 h-4 bg-slate-900 rounded-xs"></div>
                  </div>
                  <div className="grid grid-cols-4 gap-0.5 p-1">
                    <div className="w-2 h-2 bg-slate-900"></div>
                    <div className="w-2 h-2 bg-slate-400"></div>
                    <div className="w-2 h-2 bg-slate-900"></div>
                    <div className="w-2 h-2 bg-slate-900"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-4 h-4 bg-slate-900 rounded-xs"></div>
                    <div className="w-3 h-3 bg-emerald-600 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="flex-1 space-y-1 text-xs">
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                    Queue Bypass Directive
                  </div>
                  <div className="font-bold text-slate-200">
                    {activeBookingConfirmation.erBayAssigned}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Scan token at emergency entrance barrier gate for instant green corridor clearance.
                  </div>
                </div>
              </div>

              {/* Patient & Doctor Meta */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Patient</span>
                  <span className="font-bold text-slate-200">{activeBookingConfirmation.patientName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">On-Call Attending</span>
                  <span className="font-bold text-slate-200">{activeBookingConfirmation.leadPhysician}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Triage Indication</span>
                  <span className="text-slate-300">{activeBookingConfirmation.condition}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                onClick={() => {
                  setActiveBookingConfirmation(null);
                  setActiveSidebarTab('map');
                }}
                className="w-full sm:flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/80"
              >
                <Navigation className="w-4 h-4" />
                <span>{t.mapRouteBtn}</span>
              </button>
              <button
                onClick={() => {
                  setActiveBookingConfirmation(null);
                }}
                className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DIRECT HOSPITAL HOTLINE ================= */}
      {directPhoneModalHospital && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0c1220] rounded-3xl border border-slate-700 shadow-2xl p-6 relative space-y-4 text-slate-100 text-center">
            <button
              onClick={() => setDirectPhoneModalHospital(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                {directPhoneModalHospital.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.directEmergencyDesk}
              </p>
            </div>

            <div className="p-3 bg-[#070b14] border border-slate-800 rounded-2xl">
              <div className="text-[10px] text-slate-400 font-mono uppercase">24/7 Hotline</div>
              <div className="text-lg font-black font-mono text-emerald-400 mt-0.5 tracking-wider">
                {directPhoneModalHospital.emergencyPhone}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Specialist: <b className="text-slate-200">{directPhoneModalHospital.specialistOnDuty}</b>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={`tel:${directPhoneModalHospital.emergencyPhone}`}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/80"
              >
                <Phone className="w-4 h-4" />
                <span>{t.callDirect}</span>
              </a>
              <button
                onClick={() => setDirectPhoneModalHospital(null)}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: BLOOD UNIT RESERVATION ================= */}
      {selectedBloodBankForBooking && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0c1220] rounded-3xl border border-red-800/80 shadow-2xl p-6 relative space-y-5 text-slate-100 my-8">
            <button
              onClick={() => setSelectedBloodBankForBooking(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-red-950/80 border border-red-800 text-red-400 font-mono text-[10px] font-bold uppercase">
                  ACTIVE COLD-CHAIN DEPOT
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedBloodBankForBooking.distanceKm} km away
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                {selectedBloodBankForBooking.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {selectedBloodBankForBooking.address}
              </p>
            </div>

            {/* Live Availability Pill Banner */}
            <div className="bg-[#070b14] border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 font-black text-sm">
                  {selectedBloodGroup}
                </div>
                <div>
                  <div className="font-bold text-white">
                    {selectedBloodBankForBooking.inventory[selectedBloodGroup] || 0} Units Available in Cold Reserve
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Automated temperature tracking (2°C - 6°C)
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 font-mono text-[10px] font-bold">
                VERIFIED STOCK
              </span>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              {/* Demographics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">{t.patientLabel}</label>
                  <input
                    type="text"
                    value={bloodPatientName}
                    onChange={e => setBloodPatientName(e.target.value)}
                    placeholder="Patient Name"
                    className="w-full bg-[#141d2e] border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">{t.contactNumber}</label>
                  <input
                    type="text"
                    value={bloodPatientPhone}
                    onChange={e => setBloodPatientPhone(e.target.value)}
                    placeholder="+91 Phone"
                    className="w-full bg-[#141d2e] border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              {/* Destination Hospital */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">{t.destinationHospital}</label>
                <input
                  type="text"
                  value={bloodPatientHospital}
                  onChange={e => setBloodPatientHospital(e.target.value)}
                  placeholder="e.g. Fortis Emergency Hospital, Bannerghatta Road"
                  className="w-full bg-[#141d2e] border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Units to Reserve Stepper */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                  {t.unitsNeeded} ({selectedBloodGroup})
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map(num => {
                    const maxAvail = selectedBloodBankForBooking.inventory[selectedBloodGroup] || 0;
                    const disabled = num > maxAvail;
                    return (
                      <button
                        key={num}
                        type="button"
                        disabled={disabled}
                        onClick={() => setBloodUnitsCount(num)}
                        className={`h-11 rounded-xl border text-center transition font-bold text-xs ${
                          bloodUnitsCount === num
                            ? 'bg-red-600 border-red-500 text-white shadow-md'
                            : disabled
                            ? 'bg-[#101420] border-slate-800 text-slate-600 cursor-not-allowed'
                            : 'bg-[#141d2e] border-slate-700/80 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {num} {num === 1 ? 'Bag' : 'Bags'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Urgency Classification */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">{t.urgencyLevel}</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'Emergency STAT', label: 'Emergency STAT', desc: 'Direct code red dispatch' },
                    { id: 'Urgent (Within 2 Hours)', label: 'Urgent (<2 Hrs)', desc: 'Pre-surgery reserve' },
                    { id: 'Scheduled Surgery', label: 'Scheduled', desc: 'Elective hold' },
                  ].map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setBloodUrgencyLevel(u.id as any)}
                      className={`p-2 rounded-xl border text-center transition ${
                        bloodUrgencyLevel === u.id
                          ? 'bg-red-950/60 border-red-500 text-white shadow-xs'
                          : 'bg-[#141d2e] border-slate-700/80 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold text-xs">{u.label}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{u.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cold-Chain Logistics Assurance Box */}
              <div className="p-3 bg-[#070b14] border border-slate-800 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Snowflake className="w-4 h-4" />
                </div>
                <div className="text-[11px] leading-snug">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>Active Cold-Chain Protocol Locked</span>
                    <span className="text-[10px] text-emerald-400 font-mono">3.4°C Target</span>
                  </div>
                  <div className="text-slate-400 text-[10px] mt-0.5">
                    Automated GPS telemetry with real-time temperature log sensor during transit.
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedBloodBankForBooking(null)}
                className="w-1/3 py-3 bg-[#141d2e] hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs transition"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!selectedBloodBankForBooking) return;
                  const newRes = reserveBloodUnits({
                    bloodBankId: selectedBloodBankForBooking.id,
                    bloodBankName: selectedBloodBankForBooking.name,
                    bloodGroup: selectedBloodGroup,
                    unitsCount: bloodUnitsCount,
                    patientName: bloodPatientName || 'Sai Santhosh',
                    patientPhone: bloodPatientPhone || '+91 98490 22119',
                    patientHospital: bloodPatientHospital || "St. John's General Emergency Trauma",
                    urgencyLevel: bloodUrgencyLevel
                  });

                  setSelectedBloodBankForBooking(null);
                  setActiveBloodReservationReceipt(newRes);
                }}
                className="flex-1 py-3 bg-[#dc2626] hover:bg-[#b91c1c] active:bg-[#991b1b] text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-red-950/80"
              >
                <Check className="w-4 h-4" />
                <span>{t.confirmBloodReservation}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: COLD-CHAIN DISPATCH RECEIPT PASS ================= */}
      {activeBloodReservationReceipt && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0c1220] rounded-3xl border border-red-600/50 shadow-2xl p-6 relative space-y-5 text-slate-100">
            <button
              onClick={() => setActiveBloodReservationReceipt(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Top Success Badge */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 bg-red-950/80 border border-red-800/80 px-2 py-0.5 rounded-full">
                  COLD-CHAIN LOGISTICS ENGAGED
                </span>
                <h3 className="text-lg font-bold text-white tracking-wide mt-1">
                  {t.reserveBloodModalTitle}
                </h3>
              </div>
            </div>

            {/* Transit Pass Ticket */}
            <div className="bg-[#070b14] border border-slate-800 rounded-2xl p-4.5 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Blood Depot</span>
                  <span className="font-bold text-white text-sm">{activeBloodReservationReceipt.bloodBankName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Dispatch Token</span>
                  <span className="font-black font-mono text-red-400 text-sm">{activeBloodReservationReceipt.token}</span>
                </div>
              </div>

              {/* QR Code and Cold-Chain Telemetry */}
              <div className="flex items-center gap-4 bg-[#0c1220] p-3 rounded-xl border border-slate-800/80">
                {/* Simulated QR Code Graphic */}
                <div className="w-20 h-20 bg-white rounded-lg p-1.5 flex flex-col justify-between shrink-0 shadow-md">
                  <div className="flex justify-between">
                    <div className="w-4 h-4 bg-slate-900 rounded-xs"></div>
                    <div className="w-4 h-4 bg-slate-900 rounded-xs"></div>
                  </div>
                  <div className="grid grid-cols-4 gap-0.5 p-1">
                    <div className="w-2 h-2 bg-slate-900"></div>
                    <div className="w-2 h-2 bg-red-600"></div>
                    <div className="w-2 h-2 bg-slate-900"></div>
                    <div className="w-2 h-2 bg-slate-900"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-4 h-4 bg-slate-900 rounded-xs"></div>
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
                  </div>
                </div>

                <div className="flex-1 space-y-1 text-xs">
                  <div className="text-[10px] font-mono text-red-400 font-bold uppercase flex items-center justify-between">
                    <span>Active Telemetry Sensor</span>
                    <span className="text-emerald-400 font-bold">{activeBloodReservationReceipt.temperatureCelsius}°C</span>
                  </div>
                  <div className="font-bold text-slate-200">
                    {activeBloodReservationReceipt.unitsCount} Bags of {activeBloodReservationReceipt.bloodGroup} (Red Cell Concentrate)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Assigned: <b className="text-slate-300">{activeBloodReservationReceipt.coldChainCourierAssigned}</b>
                  </div>
                </div>
              </div>

              {/* Patient & Hospital Details */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Recipient Patient</span>
                  <span className="font-bold text-slate-200">{activeBloodReservationReceipt.patientName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Urgency</span>
                  <span className="font-bold text-red-400">{activeBloodReservationReceipt.urgencyLevel}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Receiving Hospital</span>
                  <span className="text-slate-300 font-semibold">{activeBloodReservationReceipt.patientHospital}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                onClick={() => {
                  setActiveBloodReservationReceipt(null);
                  setActiveSidebarTab('map');
                }}
                className="w-full sm:flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-red-950/80"
              >
                <Navigation className="w-4 h-4" />
                <span>{t.activeBloodDispatches}</span>
              </button>
              <button
                onClick={() => {
                  setActiveBloodReservationReceipt(null);
                }}
                className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DIRECT BLOOD BANK HOTLINE ================= */}
      {directPhoneModalBloodBank && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0c1220] rounded-3xl border border-red-800 shadow-2xl p-6 relative space-y-4 text-slate-100 text-center">
            <button
              onClick={() => setDirectPhoneModalBloodBank(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                {directPhoneModalBloodBank.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.directEmergencyDesk}
              </p>
            </div>

            <div className="p-3 bg-[#070b14] border border-slate-800 rounded-2xl">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Emergency Transfusion Line</div>
              <div className="text-lg font-black font-mono text-red-400 mt-0.5 tracking-wider">
                {directPhoneModalBloodBank.phone}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Location: <b className="text-slate-200">{directPhoneModalBloodBank.address}</b>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={`tel:${directPhoneModalBloodBank.phone}`}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-red-950/80"
              >
                <Phone className="w-4 h-4" />
                <span>{t.callDirect}</span>
              </a>
              <button
                onClick={() => setDirectPhoneModalBloodBank(null)}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
