import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  Incident, 
  Responder, 
  Hospital, 
  AreaAlert, 
  AuditLogItem, 
  EmergencyType, 
  SeverityLevel, 
  IncidentStatus,
  AITriageResult,
  ChatMessage 
} from '../types';
import { SEED_HOSPITALS, SEED_RESPONDERS, INITIAL_INCIDENTS, SEED_AREA_ALERTS } from '../data/seedData';
import { sound, triggerHaptic } from '../utils/audio';
import { Language } from '../utils/i18n';

interface EmergencyContextType {
  incidents: Incident[];
  responders: Responder[];
  hospitals: Hospital[];
  areaAlerts: AreaAlert[];
  auditLogs: AuditLogItem[];
  activeIncident: Incident | null;
  activeIncidentId: string | null;
  setActiveIncidentId: (id: string | null) => void;
  activeResponderId: string;
  setActiveResponderId: (id: string) => void;
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  isOfflineMode: boolean;
  setIsOfflineMode: (offline: boolean) => void;
  offlineQueueCount: number;
  activeRole: 'citizen' | 'responder' | 'admin' | 'demo' | 'privacy';
  setActiveRole: (role: 'citizen' | 'responder' | 'admin' | 'demo' | 'privacy') => void;
  isCitySimulationRunning: boolean;
  toggleCitySimulation: () => void;
  createEmergency: (data: {
    type?: EmergencyType;
    description: string;
    location?: { lat: number; lng: number; address: string; area: string; accuracyMeters?: number };
    isSilent?: boolean;
    citizenName?: string;
    citizenPhone?: string;
  }) => Promise<Incident>;
  updateIncidentStatus: (incidentId: string, newStatus: IncidentStatus, note?: string) => void;
  smartDispatch: (incidentId: string, responderId?: string) => { recommendedResponder: Responder; score: number };
  sendChatMessage: (incidentId: string, text: string, sender: 'citizen' | 'responder' | 'dispatcher', senderName: string) => void;
  broadcastAreaAlert: (data: { title: string; description: string; type: AreaAlert['type']; radiusKm: number; area: string; lat: number; lng: number }) => void;
  escalateIncident: (incidentId: string) => void;
  resetToDemo: () => void;
  activeAlertForCitizen: AreaAlert | null;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

const STORAGE_KEYS = {
  INCIDENTS: 'lifeline_incidents_v1',
  RESPONDERS: 'lifeline_responders_v1',
  HOSPITALS: 'lifeline_hospitals_v1',
  ALERTS: 'lifeline_alerts_v1',
  LOGS: 'lifeline_logs_v1',
  OFFLINE_QUEUE: 'lifeline_offline_queue_v1',
};

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
      return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
    } catch {
      return INITIAL_INCIDENTS;
    }
  });

  const [responders, setResponders] = useState<Responder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESPONDERS);
      return saved ? JSON.parse(saved) : SEED_RESPONDERS;
    } catch {
      return SEED_RESPONDERS;
    }
  });

  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HOSPITALS);
      return saved ? JSON.parse(saved) : SEED_HOSPITALS;
    } catch {
      return SEED_HOSPITALS;
    }
  });

  const [areaAlerts, setAreaAlerts] = useState<AreaAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
      return saved ? JSON.parse(saved) : SEED_AREA_ALERTS;
    } catch {
      return SEED_AREA_ALERTS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'log-1', timestamp: Date.now() - 150000, action: 'SYSTEM_BOOT', actor: 'Hyderabad ECC', details: 'Initialized Lifeline India 14-Zone Metro Grid', severity: 'info' },
      { id: 'log-2', timestamp: Date.now() - 140000, incidentId: 'INC-2026-HYD-041', action: 'DISPATCH_TRIGGERED', actor: 'Smart Dispatch', details: 'Assigned 108-HYD-ALS-01 to Cyber Towers incident (Score 98)', severity: 'info' }
    ];
  });

  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(INITIAL_INCIDENTS[0]?.id || null);
  const [activeResponderId, setActiveResponderId] = useState<string>('RES-ALS-01');
  const [currentLanguage, setLanguage] = useState<Language>('en');
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<Incident[]>([]);
  const [activeRole, setActiveRole] = useState<'citizen' | 'responder' | 'admin' | 'demo' | 'privacy'>('citizen');
  const [isCitySimulationRunning, setIsCitySimulationRunning] = useState<boolean>(false);

  // BroadcastChannel for instant cross-tab sync
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Sync to localStorage whenever state updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
    } catch {}
  }, [incidents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESPONDERS, JSON.stringify(responders));
    } catch {}
  }, [responders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(areaAlerts));
    } catch {}
  }, [areaAlerts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
    } catch {}
  }, [auditLogs]);

  // Set up BroadcastChannel
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channelRef.current = new BroadcastChannel('lifeline_india_channel');
      channelRef.current.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'SYNC_ALL') {
          if (payload.incidents) setIncidents(payload.incidents);
          if (payload.responders) setResponders(payload.responders);
          if (payload.areaAlerts) setAreaAlerts(payload.areaAlerts);
          if (payload.auditLogs) setAuditLogs(payload.auditLogs);
        } else if (type === 'NEW_INCIDENT') {
          setIncidents(prev => [payload, ...prev.filter(i => i.id !== payload.id)]);
          sound.playEmergencySiren(2.0);
        } else if (type === 'UPDATE_INCIDENT') {
          setIncidents(prev => prev.map(i => i.id === payload.id ? payload : i));
        } else if (type === 'UPDATE_RESPONDERS') {
          setResponders(payload);
        } else if (type === 'NEW_CHAT') {
          setIncidents(prev => prev.map(inc => {
            if (inc.id === payload.incidentId) {
              return { ...inc, chatMessages: [...inc.chatMessages, payload.message] };
            }
            return inc;
          }));
        } else if (type === 'NEW_ALERT') {
          setAreaAlerts(prev => [payload, ...prev]);
          sound.playWarningBeep();
        }
      };
    }

    // Storage event fallback for older browsers / webkit
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.INCIDENTS && e.newValue) {
        setIncidents(JSON.parse(e.newValue));
      }
      if (e.key === STORAGE_KEYS.RESPONDERS && e.newValue) {
        setResponders(JSON.parse(e.newValue));
      }
      if (e.key === STORAGE_KEYS.ALERTS && e.newValue) {
        setAreaAlerts(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      channelRef.current?.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const broadcastEvent = (type: string, payload: any) => {
    try {
      channelRef.current?.postMessage({ type, payload });
    } catch {}
  };

  const addAuditLog = useCallback((action: string, actor: string, details: string, severity: 'info' | 'warning' | 'critical' = 'info', incidentId?: string) => {
    const item: AuditLogItem = {
      id: `log-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      timestamp: Date.now(),
      action,
      actor,
      details,
      severity,
      incidentId
    };
    setAuditLogs(prev => [item, ...prev.slice(0, 49)]);
  }, []);

  // Compute Active Incident
  const activeIncident = incidents.find(i => i.id === activeIncidentId) || incidents[0] || null;

  // Compute active area alert near citizen location
  const activeAlertForCitizen = areaAlerts.find(a => a.active) || null;

  // 1. Create Emergency SOS
  const createEmergency = async (data: {
    type?: EmergencyType;
    description: string;
    location?: { lat: number; lng: number; address: string; area: string; accuracyMeters?: number };
    isSilent?: boolean;
    citizenName?: string;
    citizenPhone?: string;
  }): Promise<Incident> => {
    const incidentId = `INC-2026-HYD-${String(Math.floor(Math.random() * 900) + 100)}`;
    const loc = data.location || {
      lat: 17.4485,
      lng: 78.3745,
      address: 'Cyber Towers Flyover, Hitech City, Hyderabad',
      area: 'Hitech City',
      accuracyMeters: 5
    };

    triggerHaptic([200, 100, 200, 100, 400]);
    sound.playEmergencySiren(2.0);

    // Call server AI triage
    let triage: AITriageResult = {
      emergencyType: data.type || 'Medical',
      severity: data.isSilent ? 'Critical' : 'High',
      confidence: 95,
      recommendedResponder: data.isSilent ? 'SHE Team Police PCR' : 'ALS Ambulance & Traffic Unit',
      firstAidInstructions: [
        'Move to safe illuminated location if threat exists.',
        'Keep phone silent, emergency coordinates are actively transmitted to Police HQ.',
        'Wait for covert confirmation or patrol car beacon.'
      ],
      detectedLanguage: currentLanguage,
      patientConditionSummary: data.isSilent ? 'Silent Distress Beacon Triggered' : 'Immediate emergency assistance dispatched'
    };

    try {
      const res = await fetch('/api/gemini/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: data.description || (data.isSilent ? 'Silent SOS triggered via triple power-tap' : 'Emergency reported'),
          category: data.type,
          language: currentLanguage,
          location: loc
        })
      });
      const json = await res.json();
      if (json?.triage) {
        triage = json.triage;
      }
    } catch (err) {
      console.warn('Using local triage fallback');
    }

    const newIncident: Incident = {
      id: incidentId,
      type: triage.emergencyType || data.type || 'Medical',
      severity: triage.severity || 'High',
      status: 'Reported',
      citizenName: data.citizenName || (data.isSilent ? 'Anonymous Citizen (Silent SOS)' : 'Citizen (Verified Mobile)'),
      citizenPhone: data.citizenPhone || '+91 98480 •••••',
      description: data.description || (data.isSilent ? 'Silent SOS distress beacon' : 'Emergency reported via Citizen App'),
      location: loc,
      timestamp: Date.now(),
      aiTriage: triage,
      goodSamaritansAlerted: triage.severity === 'Critical' ? 3 : 1,
      timeline: [
        { status: 'Reported', timestamp: Date.now(), note: `SOS triggered with GPS precision (${loc.address})`, actor: 'Citizen Mobile App' },
        { status: 'Verified', timestamp: Date.now() + 1000, note: `AI Triage: ${triage.severity} ${triage.emergencyType} (${triage.confidence}% confidence)`, actor: 'Gemini AI Engine' }
      ],
      chatMessages: [
        { id: `msg-${Date.now()}-1`, sender: 'dispatcher', senderName: 'Hyderabad Central Dispatch', text: `Emergency ${incidentId} logged. Triage severity: ${triage.severity}. Assigning nearest responder unit.`, timestamp: Date.now() }
      ],
      escalationTier: 0,
      offlineQueued: isOfflineMode
    };

    if (isOfflineMode) {
      setOfflineQueue(prev => [...prev, newIncident]);
      addAuditLog('OFFLINE_QUEUE_STORED', 'Offline Service Worker', `Incident ${incidentId} queued in local storage; SMS payload generated`, 'warning', incidentId);
    } else {
      setIncidents(prev => [newIncident, ...prev]);
      setActiveIncidentId(incidentId);
      broadcastEvent('NEW_INCIDENT', newIncident);
      addAuditLog('SOS_REPORTED', 'Citizen', `New ${newIncident.severity} ${newIncident.type} incident at ${loc.area}`, 'critical', incidentId);

      // Trigger automatic smart dispatch after 1.5 seconds for instant gratification in demo!
      setTimeout(() => {
        smartDispatch(incidentId);
      }, 1500);
    }

    return newIncident;
  };

  // 2. Smart Dispatch Scoring Function
  const smartDispatch = (incidentId: string, specificResponderId?: string) => {
    const inc = incidents.find(i => i.id === incidentId);
    if (!inc) return { recommendedResponder: responders[0], score: 90 };

    // Scoring function: distance (40%), ETA (25%), skill match (20%), workload (15%)
    let bestResponder = responders[0];
    let highestScore = -1;

    const availableResponders = responders.filter(r => r.status === 'Available');
    const pool = availableResponders.length > 0 ? availableResponders : responders;

    if (specificResponderId) {
      const found = responders.find(r => r.id === specificResponderId);
      if (found) bestResponder = found;
    } else {
      pool.forEach(resp => {
        // Calculate Euclidean distance approximation in km
        const dLat = (resp.location.lat - inc.location.lat) * 111;
        const dLng = (resp.location.lng - inc.location.lng) * 105;
        const distKm = Math.sqrt(dLat * dLat + dLng * dLng);

        // Distance score (closer is better, max 40 points)
        const distScore = Math.max(0, 40 - distKm * 4);

        // Skill / Type match (20 points)
        let skillScore = 10;
        if (inc.type === 'Medical' && (resp.type === 'ALS Ambulance' || resp.type === 'Doctor Volunteer')) skillScore = 20;
        if (inc.type === 'Accident' && (resp.type === 'ALS Ambulance' || resp.type === 'Police PCR')) skillScore = 20;
        if (inc.type === 'Fire' && resp.type === 'Fire Tender') skillScore = 20;
        if (inc.type === 'Women Safety' && resp.callSign.includes('SHE')) skillScore = 25;

        // Availability (25 points)
        const availScore = resp.status === 'Available' ? 25 : 5;

        // Workload / Rating (15 points)
        const loadScore = Math.min(15, (resp.rating / 5) * 15);

        const totalScore = Math.round(distScore + skillScore + availScore + loadScore);
        if (totalScore > highestScore) {
          highestScore = totalScore;
          bestResponder = resp;
        }
      });
    }

    // Assign nearest hospital with available ICU
    const bestHospital = hospitals.slice().sort((a, b) => b.availableIcuBeds - a.availableIcuBeds)[0];

    // Compute route polyline from responder to citizen
    const stepsCount = 5;
    const polyline: [number, number][] = [];
    for (let s = 0; s <= stepsCount; s++) {
      const ratio = s / stepsCount;
      const lat = bestResponder.location.lat + (inc.location.lat - bestResponder.location.lat) * ratio;
      const lng = bestResponder.location.lng + (inc.location.lng - bestResponder.location.lng) * ratio;
      polyline.push([lat, lng]);
    }

    const updatedInc: Incident = {
      ...inc,
      status: 'Assigned',
      assignedResponderId: bestResponder.id,
      assignedResponder: bestResponder,
      assignedHospitalId: bestHospital.id,
      assignedHospital: bestHospital,
      etaSeconds: Math.floor(Math.random() * 60) + 120, // 2-3 mins
      routePolyline: polyline,
      timeline: [
        ...inc.timeline,
        {
          status: 'Assigned',
          timestamp: Date.now(),
          note: `Assigned ${bestResponder.name} (${bestResponder.callSign}). Score: ${highestScore > 0 ? highestScore : 95}/100. Destination Hospital: ${bestHospital.name} (${bestHospital.availableIcuBeds} ICU beds ready).`,
          actor: 'Smart Dispatch Engine'
        }
      ],
      chatMessages: [
        ...inc.chatMessages,
        {
          id: `msg-${Date.now()}`,
          sender: 'dispatcher',
          senderName: 'Command Center',
          text: `Unit ${bestResponder.callSign} has accepted dispatch. Real-time ETA calculated.`,
          timestamp: Date.now()
        }
      ]
    };

    setIncidents(prev => prev.map(i => i.id === incidentId ? updatedInc : i));
    setResponders(prev => prev.map(r => r.id === bestResponder.id ? { ...r, status: 'Dispatched', currentIncidentId: incidentId } : r));
    broadcastEvent('UPDATE_INCIDENT', updatedInc);
    addAuditLog('DISPATCH_ASSIGNED', 'Smart Dispatch Engine', `Assigned ${bestResponder.name} to ${incidentId} (Score: ${highestScore})`, 'info', incidentId);
    sound.playWarningBeep();

    return { recommendedResponder: bestResponder, score: highestScore > 0 ? highestScore : 94 };
  };

  // 3. Update Incident Status
  const updateIncidentStatus = (incidentId: string, newStatus: IncidentStatus, note?: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== incidentId) return inc;

      const updatedTimeline = [
        ...inc.timeline,
        {
          status: newStatus,
          timestamp: Date.now(),
          note: note || `Status updated to ${newStatus}`,
          actor: inc.assignedResponder ? inc.assignedResponder.name : 'Dispatcher'
        }
      ];

      let updatedEta = inc.etaSeconds;
      if (newStatus === 'En Route') updatedEta = 90;
      if (newStatus === 'Arrived') updatedEta = 0;
      if (newStatus === 'Resolved') {
        updatedEta = 0;
        sound.playSuccessChime();
      }

      const updated = {
        ...inc,
        status: newStatus,
        etaSeconds: updatedEta,
        timeline: updatedTimeline
      };

      broadcastEvent('UPDATE_INCIDENT', updated);
      addAuditLog(`STATUS_${newStatus.toUpperCase()}`, 'Responder / Command', `${inc.id} moved to ${newStatus}. ${note || ''}`, newStatus === 'Resolved' ? 'info' : 'warning', inc.id);
      return updated;
    }));

    // If resolved, free up the responder
    if (newStatus === 'Resolved') {
      const inc = incidents.find(i => i.id === incidentId);
      if (inc && inc.assignedResponderId) {
        setResponders(prev => prev.map(r => r.id === inc.assignedResponderId ? { ...r, status: 'Available', currentIncidentId: undefined } : r));
      }
    }
  };

  // 4. Send In-App Chat
  const sendChatMessage = (incidentId: string, text: string, sender: 'citizen' | 'responder' | 'dispatcher', senderName: string) => {
    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      sender,
      senderName,
      text,
      timestamp: Date.now()
    };

    setIncidents(prev => prev.map(inc => {
      if (inc.id !== incidentId) return inc;
      const updated = { ...inc, chatMessages: [...inc.chatMessages, newMsg] };
      broadcastEvent('NEW_CHAT', { incidentId, message: newMsg });
      return updated;
    }));
    sound.playWarningBeep();
  };

  // 5. Broadcast Area Alert (Geofenced)
  const broadcastAreaAlert = (data: {
    title: string;
    description: string;
    type: AreaAlert['type'];
    radiusKm: number;
    area: string;
    lat: number;
    lng: number;
  }) => {
    const alert: AreaAlert = {
      id: `ALERT-HYD-${Date.now().toString().slice(-4)}`,
      title: data.title,
      description: data.description,
      type: data.type,
      severity: 'Emergency',
      center: { lat: data.lat, lng: data.lng, area: data.area },
      radiusKm: data.radiusKm,
      active: true,
      issuedAt: Date.now(),
      expiresAt: Date.now() + 4 * 3600000
    };

    setAreaAlerts(prev => [alert, ...prev]);
    broadcastEvent('NEW_ALERT', alert);
    addAuditLog('AREA_BROADCAST_ISSUED', 'Disaster Command', `Broadcast alert: ${alert.title} across ${alert.radiusKm}km in ${alert.center.area}`, 'critical');
    sound.playWarningBeep();
  };

  // 6. Escalate Incident (SLA > 60s rule)
  const escalateIncident = (incidentId: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== incidentId) return inc;
      const nextTier = (inc.escalationTier || 0) + 1;
      const updatedTimeline = [
        ...inc.timeline,
        {
          status: inc.status,
          timestamp: Date.now(),
          note: `AUTO-ESCALATION TIER ${nextTier}: Search radius widened to 10km. Hyderabad Zonal Supervisor & Police Control Room paged!`,
          actor: 'SLA Escalation Engine'
        }
      ];
      addAuditLog(`ESCALATION_TIER_${nextTier}`, 'SLA Sentinel', `Incident ${inc.id} escalated due to response window deadline`, 'critical', inc.id);
      sound.playWarningBeep();
      return { ...inc, escalationTier: nextTier, timeline: updatedTimeline };
    }));
  };

  // 7. City Simulation Pulse (Hyderabad Spawner)
  const simIntervalRef = useRef<any>(null);
  const toggleCitySimulation = () => {
    if (isCitySimulationRunning) {
      clearInterval(simIntervalRef.current);
      setIsCitySimulationRunning(false);
      addAuditLog('SIMULATION_STOPPED', 'Command Operator', 'City life simulation paused', 'info');
    } else {
      setIsCitySimulationRunning(true);
      addAuditLog('SIMULATION_STARTED', 'Command Operator', 'Spawning live dynamic traffic and incidents across Hyderabad zones', 'warning');

      simIntervalRef.current = setInterval(() => {
        // Randomly nudge 2 responders towards their destinations or simulate small GPS drift
        setResponders(prev => prev.map(r => {
          if (r.status === 'En Route' || r.status === 'Dispatched') {
            const latDrift = (Math.random() - 0.5) * 0.001;
            const lngDrift = (Math.random() - 0.5) * 0.001;
            return {
              ...r,
              location: {
                ...r.location,
                lat: r.location.lat + latDrift,
                lng: r.location.lng + lngDrift
              }
            };
          }
          return r;
        }));

        // Randomly decrement ETAs for En Route incidents
        setIncidents(prev => prev.map(inc => {
          if (inc.status === 'En Route' && inc.etaSeconds && inc.etaSeconds > 10) {
            return { ...inc, etaSeconds: Math.max(0, inc.etaSeconds - 5) };
          }
          return inc;
        }));
      }, 3000);
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  // 8. Reset to clean demo state
  const resetToDemo = () => {
    setIncidents(INITIAL_INCIDENTS);
    setResponders(SEED_RESPONDERS);
    setHospitals(SEED_HOSPITALS);
    setAreaAlerts(SEED_AREA_ALERTS);
    setActiveIncidentId(INITIAL_INCIDENTS[0].id);
    localStorage.clear();
    addAuditLog('DEMO_RESET', 'Administrator', 'All incidents and responders restored to seed state', 'info');
  };

  return (
    <EmergencyContext.Provider
      value={{
        incidents,
        responders,
        hospitals,
        areaAlerts,
        auditLogs,
        activeIncident,
        activeIncidentId,
        setActiveIncidentId,
        activeResponderId,
        setActiveResponderId,
        currentLanguage,
        setLanguage,
        isOfflineMode,
        setIsOfflineMode,
        offlineQueueCount: offlineQueue.length,
        activeRole,
        setActiveRole,
        isCitySimulationRunning,
        toggleCitySimulation,
        createEmergency,
        updateIncidentStatus,
        smartDispatch,
        sendChatMessage,
        broadcastAreaAlert,
        escalateIncident,
        resetToDemo,
        activeAlertForCitizen
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) throw new Error('useEmergency must be used within EmergencyProvider');
  return context;
};
