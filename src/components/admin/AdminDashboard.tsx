import React, { useState, useEffect } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { EmergencyMap } from '../map/EmergencyMap';
import { Incident, Responder, Hospital, AreaAlert } from '../../types';
import { sound } from '../../utils/audio';
import { 
  Activity, 
  AlertTriangle, 
  Flame, 
  HeartPulse, 
  Car, 
  ShieldAlert, 
  MapPin, 
  Users, 
  Radio, 
  FileText, 
  Download, 
  Sparkles, 
  CheckCircle, 
  Layers, 
  Clock, 
  Shield, 
  Hospital as HospitalIcon, 
  Filter, 
  Play, 
  Square, 
  RefreshCw,
  Search,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    incidents, 
    responders, 
    hospitals, 
    areaAlerts, 
    auditLogs, 
    smartDispatch, 
    updateIncidentStatus, 
    broadcastAreaAlert,
    escalateIncident,
    isCitySimulationRunning,
    toggleCitySimulation,
    resetToDemo 
  } = useEmergency();

  // Selected State
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(incidents[0] || null);
  const [selectedResponder, setSelectedResponder] = useState<Responder | null>(null);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [incidentFilter, setIncidentFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'map' | 'dispatch' | 'alerts' | 'analytics' | 'fraud' | 'samaritans' | 'audit'>('map');

  // Smart Dispatch Modal
  const [showDispatchModal, setShowDispatchModal] = useState<boolean>(false);
  const [dispatchIncident, setDispatchIncident] = useState<Incident | null>(null);

  // Official Incident Report Modal
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportIncident, setReportIncident] = useState<Incident | null>(null);

  // Area Alert Broadcast Modal
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>('Flash Flood Advisory: Durgam Cheruvu Outlet');
  const [alertDesc, setAlertDesc] = useState<string>('Heavy water stagnation near Inorbit Mall access ramp. Divert emergency ambulances via Mindspace flyover.');
  const [alertType, setAlertType] = useState<AreaAlert['type']>('Flood');
  const [alertRadius, setAlertRadius] = useState<number>(2.5);
  const [alertArea, setAlertArea] = useState<string>('Madhapur / Hitech City');

  // AI SitRep State
  const [sitrep, setSitrep] = useState<{
    headline: string;
    summary: string;
    criticalRecommendations: string[];
    generatedAt: string;
  } | null>(null);
  const [isGeneratingSitrep, setIsGeneratingSitrep] = useState<boolean>(false);

  // Fraud / Duplicate detection state
  const [fraudData, setFraudData] = useState<{
    clusters: Array<{ masterIncidentId: string; duplicateCount: number; clusterTitle: string; confidence: number; isSpamAlert: boolean }>;
    verdict: string;
    fraudScore: number;
  }>({
    clusters: [
      { masterIncidentId: 'INC-2026-HYD-041', duplicateCount: 3, clusterTitle: 'Cyber Towers Flyover Crash (Clustered 3 Caller Reports)', confidence: 96, isSpamAlert: false }
    ],
    verdict: 'Normal Operations: 1 High-Density Incident Clustered, 0 Pranks Flagged',
    fraudScore: 2.1
  });

  // Calculate live KPI metrics
  const activeCount = incidents.filter(i => i.status !== 'Resolved').length;
  const criticalCount = incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length;
  const availableRespondersCount = responders.filter(r => r.status === 'Available').length;
  const totalIcuBeds = hospitals.reduce((acc, h) => acc + h.availableIcuBeds, 0);

  // SLA Timers Check (Auto-escalate incidents unassigned for > 60s)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      incidents.forEach(inc => {
        if (inc.status === 'Reported' || inc.status === 'Verified') {
          const ageSeconds = (now - inc.timestamp) / 1000;
          if (ageSeconds > 60 && inc.escalationTier === 0) {
            escalateIncident(inc.id);
          }
        }
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [incidents, escalateIncident]);

  // Generate Daily Situation Report via server endpoint
  const handleGenerateSitrep = async () => {
    setIsGeneratingSitrep(true);
    try {
      const res = await fetch('/api/gemini/sitrep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: {
            totalIncidents: incidents.length,
            activeCount,
            criticalCount,
            avgResponseMinutes: 4.8,
            slaCompliancePercent: 94.2,
          },
          recentIncidents: incidents.slice(0, 5)
        })
      });
      const data = await res.json();
      if (data?.sitrep) {
        setSitrep(data.sitrep);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingSitrep(false);
    }
  };

  // Broadcast Geofenced Warning
  const handleCreateAreaAlert = (e: React.FormEvent) => {
    e.preventDefault();
    broadcastAreaAlert({
      title: alertTitle,
      description: alertDesc,
      type: alertType,
      radiusKm: alertRadius,
      area: alertArea,
      lat: 17.4420,
      lng: 78.3880
    });
    setShowAlertModal(false);
  };

  // Export CSV Data
  const handleExportCSV = () => {
    const headers = ['IncidentID', 'Type', 'Severity', 'Status', 'Location', 'Timestamp', 'AssignedResponder'];
    const rows = incidents.map(i => [
      i.id,
      i.type,
      i.severity,
      i.status,
      `"${i.location.address.replace(/"/g, '""')}"`,
      new Date(i.timestamp).toISOString(),
      i.assignedResponder?.name || 'Unassigned'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lifeline_Hyderabad_Incidents_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans select-none">
      
      {/* Top Header HUD */}
      <header className="h-14 border-b border-slate-800 bg-[#090d16] px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
            <h1 className="text-sm font-extrabold tracking-wider text-white uppercase font-mono">
              HYDERABAD METRO EMERGENCY COMMAND (EOC-14)
            </h1>
          </div>
          <span className="text-[10px] font-mono bg-slate-800/80 text-cyan-300 px-2 py-0.5 rounded border border-slate-700">
            LIVE MESH ACTIVE • 40+ UNITS ONLINE
          </span>
        </div>

        {/* Global Action HUD */}
        <div className="flex items-center gap-2 text-xs">
          {/* Simulation Toggle */}
          <button
            onClick={toggleCitySimulation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold font-mono text-xs transition border ${
              isCitySimulationRunning
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
            }`}
          >
            {isCitySimulationRunning ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isCitySimulationRunning ? 'PAUSE CITY SIM' : 'SIMULATE CITY'}</span>
          </button>

          {/* Area Broadcast Button */}
          <button
            onClick={() => setShowAlertModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white font-bold border border-red-500/30 transition shadow-lg shadow-red-600/20"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>BROADCAST GEOFENCE</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-[11px]"
            title="Export CSV Log"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          {/* Reset Demo */}
          <button
            onClick={resetToDemo}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700"
            title="Reset to Seed Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* KPI Ticker Ribbon */}
      <div className="bg-[#0b101c] border-b border-slate-800/80 px-4 py-2 grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 uppercase text-[10px]">Active Cases:</span>
          <span className="font-bold text-red-400 text-sm">{activeCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 uppercase text-[10px]">Critical SLA:</span>
          <span className="font-bold text-amber-400 text-sm">{criticalCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 uppercase text-[10px]">Avg Latency:</span>
          <span className="font-bold text-cyan-400 text-sm">42 sec</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 uppercase text-[10px]">Responders:</span>
          <span className="font-bold text-emerald-400 text-sm">{availableRespondersCount} Free</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 uppercase text-[10px]">City ICU Reserve:</span>
          <span className="font-bold text-emerald-300 text-sm">{totalIcuBeds} Beds</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 uppercase text-[10px]">SLA Target:</span>
          <span className="font-bold text-purple-400 text-sm">94.2%</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-[#090d16] border-b border-slate-800 px-4 flex gap-1 text-xs">
        {[
          { id: 'map', label: 'Tactical Map & Queue', icon: MapPin },
          { id: 'dispatch', label: 'Smart Dispatch Matrix', icon: ShieldAlert },
          { id: 'alerts', label: 'Geofenced Broadcasts', icon: Radio },
          { id: 'samaritans', label: 'Good Samaritan Network', icon: Users },
          { id: 'fraud', label: 'Duplicate & Fraud AI', icon: Sparkles },
          { id: 'analytics', label: 'Analytics & SitRep', icon: TrendingUp },
          { id: 'audit', label: 'Audit Log Ledger', icon: FileText },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 font-semibold transition ${
                isActive 
                  ? 'border-red-500 text-white bg-slate-800/40' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Control Room Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ================= TAB 1: TACTICAL MAP & QUEUE ================= */}
        {activeTab === 'map' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* Left Column: Active Incidents Table & Priority Queue */}
            <div className="w-full lg:w-[460px] border-r border-slate-800 flex flex-col bg-[#080c14] overflow-hidden">
              
              {/* Filter Bar */}
              <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Live Incident Queue ({incidents.length})
                </span>
                <div className="flex gap-1">
                  {['all', 'critical', 'active'].map(f => (
                    <button
                      key={f}
                      onClick={() => setIncidentFilter(f)}
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono transition ${
                        incidentFilter === f 
                          ? 'bg-red-600 text-white' 
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Incidents Scrollable List */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
                {incidents
                  .filter(inc => {
                    if (incidentFilter === 'critical') return inc.severity === 'Critical';
                    if (incidentFilter === 'active') return inc.status !== 'Resolved';
                    return true;
                  })
                  .map(inc => {
                    const isSelected = selectedIncident?.id === inc.id;
                    const elapsedSec = Math.floor((Date.now() - inc.timestamp) / 1000);
                    return (
                      <div
                        key={inc.id}
                        onClick={() => setSelectedIncident(inc)}
                        className={`p-3 cursor-pointer transition border-l-4 ${
                          isSelected
                            ? 'bg-slate-800/80 border-l-red-500'
                            : inc.severity === 'Critical'
                            ? 'hover:bg-slate-900/60 border-l-red-600/70 bg-red-950/10'
                            : 'hover:bg-slate-900/60 border-l-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              inc.severity === 'Critical' ? 'bg-red-500 animate-ping' : 'bg-amber-400'
                            }`} />
                            <span className="font-mono text-xs font-bold text-white">{inc.id}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({elapsedSec}s ago)</span>
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase border ${
                            inc.status === 'Resolved' 
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                              : inc.status === 'En Route'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-red-500/20 text-red-300 border-red-500/30'
                          }`}>
                            {inc.status}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-slate-200 mb-0.5">
                          {inc.severity} {inc.type}: {inc.location.area}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                          {inc.description}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>Unit: {inc.assignedResponder?.callSign || 'Unassigned'}</span>
                          {inc.status === 'Reported' || inc.status === 'Verified' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDispatchIncident(inc);
                                setShowDispatchModal(true);
                              }}
                              className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded font-bold"
                            >
                              Dispatch Now
                            </button>
                          ) : (
                            <span className="text-cyan-400">ETA: {inc.etaSeconds ? `${Math.round(inc.etaSeconds / 60)}m` : '0m'}</span>
                          )}
                        </div>

                        {/* Live SLA Response Tracker */}
                        <div className="flex items-center justify-between text-[9px] font-mono mt-1.5 pt-1 border-t border-slate-800/40">
                          <span className="text-slate-500">Dispatch SLA:</span>
                          <div className="flex items-center gap-1.5">
                            <span className={elapsedSec > 60 ? 'text-red-400 font-bold animate-pulse' : 'text-emerald-400'}>
                              {elapsedSec}s elapsed / 60s target
                            </span>
                            {inc.escalationTier > 0 && (
                              <span className="bg-red-950 text-red-300 px-1 rounded border border-red-800/80">
                                Tier {inc.escalationTier} Esc
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Bottom Quick Incident Detail */}
              {selectedIncident && (
                <div className="p-3 border-t border-slate-800 bg-slate-950/90 text-xs">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-white uppercase font-mono">
                      Selected: {selectedIncident.id}
                    </span>
                    <button
                      onClick={() => {
                        setDispatchIncident(selectedIncident);
                        setShowDispatchModal(true);
                      }}
                      className="text-[10px] text-cyan-400 underline font-mono hover:text-cyan-300"
                    >
                      Smart Score Breakdown
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-300 mb-1">
                    <span className="text-slate-500">Address:</span> {selectedIncident.location.address}
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      onClick={() => {
                        setReportIncident(selectedIncident);
                        setShowReportModal(true);
                      }}
                      className="px-2 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-[10px] rounded border border-cyan-800/60 font-semibold"
                    >
                      Form 112 Report
                    </button>
                    <button
                      onClick={() => escalateIncident(selectedIncident.id)}
                      className="px-2 py-1 bg-slate-800 hover:bg-red-950 text-red-300 text-[10px] rounded border border-slate-700"
                    >
                      Escalate (Tier {selectedIncident.escalationTier + 1})
                    </button>
                    <button
                      onClick={() => updateIncidentStatus(selectedIncident.id, 'Resolved', 'Marked resolved by Command Supervisor')}
                      className="px-2 py-1 bg-emerald-950 text-emerald-300 text-[10px] rounded border border-emerald-800/40"
                    >
                      Resolve Case
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Full Interactive Leaflet Map */}
            <div className="flex-1 flex flex-col relative h-[500px] lg:h-auto">
              <EmergencyMap
                incidents={incidents}
                responders={responders}
                hospitals={hospitals}
                areaAlerts={areaAlerts}
                selectedIncident={selectedIncident}
                selectedResponder={selectedResponder}
                onSelectIncident={(inc) => setSelectedIncident(inc)}
                onSelectResponder={(resp) => setSelectedResponder(resp)}
                showHeatmap={showHeatmap}
                interactive={true}
                drawRoute={true}
                className="w-full h-full"
              />

              {/* Map Floating HUD Controls */}
              <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition shadow-xl border backdrop-blur ${
                    showHeatmap 
                      ? 'bg-red-600 text-white border-red-500' 
                      : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 inline mr-1" />
                  {showHeatmap ? 'HEATMAP ON' : 'HEATMAP OFF'}
                </button>
              </div>

              {/* Responder Legend Strip */}
              <div className="absolute bottom-4 right-4 z-[400] bg-slate-950/90 backdrop-blur border border-slate-800 p-2.5 rounded-xl text-[10px] text-slate-300 space-y-1 font-mono shadow-2xl">
                <div className="font-bold text-white uppercase text-[9px] mb-1">Live Map Legend</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-600 inline-block"></span> Incident (Critical / High)</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span> Ambulance (ALS / BLS)</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-600 inline-block"></span> Fire Tender</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span> Police PCR / SHE Team</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block"></span> Hospital (Live ICU status)</div>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: SMART DISPATCH MATRIX ================= */}
        {activeTab === 'dispatch' && (
          <div className="flex-1 p-6 overflow-y-auto max-w-6xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                Smart Dispatch Scoring Engine
              </h2>
              <p className="text-xs text-slate-400">
                Automated multi-factor ranking: Distance (40%), ETA (25%), Skill Match (20%), Availability (15%). Manual override supported.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incidents.slice(0, 4).map(inc => {
                const scoring = smartDispatch(inc.id);
                return (
                  <div key={inc.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-mono font-bold text-red-400">{inc.id}</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                        {inc.severity} {inc.type}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white mb-1">{inc.location.address}</div>
                    <p className="text-xs text-slate-400 mb-3">{inc.description}</p>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-bold text-cyan-300">Recommended Unit</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">Score: {scoring.score}/100</span>
                      </div>
                      <div className="text-xs font-bold text-white">{scoring.recommendedResponder.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {scoring.recommendedResponder.callSign} • Base: {scoring.recommendedResponder.location.area}
                      </div>

                      {/* Score Breakdown Bars */}
                      <div className="mt-2 space-y-1 text-[9px] font-mono text-slate-400">
                        <div className="flex justify-between"><span>Distance Proximity (40pts)</span><span className="text-cyan-300">38 pts</span></div>
                        <div className="flex justify-between"><span>Skill/Equipment Match (20pts)</span><span className="text-cyan-300">20 pts</span></div>
                        <div className="flex justify-between"><span>Duty Availability (25pts)</span><span className="text-cyan-300">25 pts</span></div>
                      </div>
                    </div>

                    <button
                      onClick={() => smartDispatch(inc.id)}
                      className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold font-mono transition"
                    >
                      Authorize Instant Dispatch
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 3: GEOFENCED BROADCASTS ================= */}
        {activeTab === 'alerts' && (
          <div className="flex-1 p-6 overflow-y-auto max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-red-500" />
                  Hyperlocal Geofenced Area Warnings
                </h2>
                <p className="text-xs text-slate-400">
                  Broadcast targeted safety directives appearing instantly on citizens' devices inside the radius.
                </p>
              </div>
              <button
                onClick={() => setShowAlertModal(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow"
              >
                + New Geofence Alert
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {areaAlerts.map(alert => (
                <div key={alert.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono font-bold text-amber-400">{alert.id}</span>
                    <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded font-mono">
                      {alert.severity} • {alert.type}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{alert.title}</h3>
                  <p className="text-xs text-slate-300 mb-3">{alert.description}</p>
                  
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between text-[11px] font-mono text-slate-400">
                    <div>Zone: <span className="text-white font-bold">{alert.center.area}</span></div>
                    <div>Radius: <span className="text-cyan-400 font-bold">{alert.radiusKm} km</span></div>
                    <div>Status: <span className="text-emerald-400 font-bold">Active Broadcast</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: GOOD SAMARITAN NETWORK ================= */}
        {activeTab === 'samaritans' && (
          <div className="flex-1 p-6 overflow-y-auto max-w-5xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" />
                Good Samaritan Volunteer Network (Hyderabad)
              </h2>
              <p className="text-xs text-slate-400">
                Verified CPR-trained first-aiders, off-duty doctors, and universal blood donors pinged in the critical 3-minute window before the ambulance arrives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {responders.filter(r => r.type === 'Doctor Volunteer' || r.type === 'Blood Donor').map(vol => (
                <div key={vol.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-xs font-bold text-white">{vol.name}</div>
                      <div className="text-[10px] text-teal-300 font-mono">{vol.callSign}</div>
                    </div>
                    {vol.bloodGroup && (
                      <span className="text-xs font-black bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800">
                        {vol.bloodGroup}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-300 mb-2">
                    <span className="text-slate-500">Area:</span> {vol.location.area}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {vol.skills.map((skill, idx) => (
                      <span key={idx} className="text-[9px] bg-slate-950 px-1.5 py-0.5 rounded text-slate-400 border border-slate-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 flex items-center justify-between border-t border-slate-800 pt-2">
                    <span>Avg arrival: {vol.avgResponseMin}m</span>
                    <span>★ {vol.rating} ({vol.casesHandled} cases)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: DUPLICATE & FRAUD AI ================= */}
        {activeTab === 'fraud' && (
          <div className="flex-1 p-6 overflow-y-auto max-w-5xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                AI Incident Deduplication & Prank Detection
              </h2>
              <p className="text-xs text-slate-400">
                Clustering algorithm merges multiple independent caller reports of the same incident (e.g. Cyber Towers pileup) into one master incident, and flags prank call anomalies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs font-bold text-white uppercase font-mono mb-2">
                  Multi-Report Incident Clusters
                </div>
                <div className="space-y-3">
                  {fraudData.clusters.map(cluster => (
                    <div key={cluster.masterIncidentId} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-white">{cluster.clusterTitle}</span>
                        <span className="text-cyan-400 font-mono text-[10px]">{cluster.duplicateCount} Calls Merged</span>
                      </div>
                      <div className="text-slate-400 text-[11px] mb-2">
                        Clustered 3 independent caller reports into master ticket #{cluster.masterIncidentId}. Prevents dual ambulance over-dispatch.
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400">
                        AI Clustering Confidence: {cluster.confidence}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs font-bold text-white uppercase font-mono mb-2">
                  Prank & Anomaly Shield
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">City Fraud Risk Index:</span>
                    <span className="text-emerald-400 font-bold font-mono">3.2% (Minimal)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Caller ID Verification:</span>
                    <span className="text-cyan-400 font-bold font-mono">100% Mobile OTP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Suspicious Spoof Pings:</span>
                    <span className="text-slate-300 font-bold font-mono">0 Detected</span>
                  </div>
                  <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-[11px]">
                    Status: All 4 active incidents have verified GPS coordinates and cross-referenced cellular cell-towers.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: ANALYTICS & SITREP ================= */}
        {activeTab === 'analytics' && (
          <div className="flex-1 p-6 overflow-y-auto max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Analytics & AI Daily Situation Report (SitRep)
                </h2>
                <p className="text-xs text-slate-400">
                  Comprehensive performance diagnostics and Gemini-generated tactical executive summary.
                </p>
              </div>
              <button
                onClick={handleGenerateSitrep}
                disabled={isGeneratingSitrep}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingSitrep ? 'Analyzing with Gemini...' : 'Generate AI SitRep'}</span>
              </button>
            </div>

            {/* AI Generated SitRep Box */}
            {sitrep && (
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-cyan-400 font-mono uppercase">
                    AI SITUATION REPORT • {new Date(sitrep.generatedAt).toLocaleTimeString()}
                  </span>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                    Gemini 3.8 Flash
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mb-2">{sitrep.headline}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{sitrep.summary}</p>

                <div className="border-t border-slate-800 pt-3">
                  <div className="text-xs font-bold text-slate-400 uppercase font-mono mb-2">
                    Actionable Recommendations for Operations:
                  </div>
                  <ul className="space-y-1.5">
                    {sitrep.criticalRecommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-200">
                        <span className="text-cyan-400">▹</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Performance KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Response Time SLA (&lt;60s)</div>
                <div className="text-2xl font-black font-mono text-emerald-400 mt-1">94.2%</div>
                <div className="text-[10px] text-slate-500 mt-1">+3.8% faster than city average</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Average Wheel-Roll Latency</div>
                <div className="text-2xl font-black font-mono text-cyan-400 mt-1">4.8 min</div>
                <div className="text-[10px] text-slate-500 mt-1">Hitech City Corridor</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Good Samaritan Interventions</div>
                <div className="text-2xl font-black font-mono text-purple-400 mt-1">28</div>
                <div className="text-[10px] text-slate-500 mt-1">Pre-hospital CPR within 180s</div>
              </div>
            </div>

            {/* Responder Performance Leaderboard */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-xs font-bold text-white uppercase font-mono mb-3">
                Top Performing Responders (Leaderboard)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-mono">
                      <th className="pb-2">Unit / Name</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Base Sector</th>
                      <th className="pb-2">Avg Time</th>
                      <th className="pb-2">Rating</th>
                      <th className="pb-2">Cases</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {responders.slice(0, 6).map(resp => (
                      <tr key={resp.id} className="text-slate-300">
                        <td className="py-2.5 font-bold text-white">{resp.name} ({resp.callSign})</td>
                        <td className="py-2.5 text-cyan-300">{resp.type}</td>
                        <td className="py-2.5 text-slate-400">{resp.location.area}</td>
                        <td className="py-2.5 text-emerald-400">{resp.avgResponseMin}m</td>
                        <td className="py-2.5 text-amber-300">★ {resp.rating}</td>
                        <td className="py-2.5">{resp.casesHandled}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 7: AUDIT LOG LEDGER ================= */}
        {activeTab === 'audit' && (
          <div className="flex-1 p-6 overflow-y-auto max-w-5xl mx-auto space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Immutable Emergency Operations Audit Log
              </h2>
              <p className="text-xs text-slate-400">
                Cryptographically verifiable timestamped audit trail of dispatch orders, status changes, and escalations.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-hidden">
              <div className="divide-y divide-slate-800/60 max-h-[600px] overflow-y-auto font-mono text-xs">
                {auditLogs.map(log => (
                  <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          log.severity === 'critical' ? 'bg-red-500/20 text-red-300' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {log.action}
                        </span>
                        <span className="text-slate-400">by {log.actor}</span>
                        {log.incidentId && (
                          <span className="text-cyan-400">({log.incidentId})</span>
                        )}
                      </div>
                      <div className="text-slate-300 text-[11px] font-sans">{log.details}</div>
                    </div>
                    <div className="text-[10px] text-slate-500 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Smart Dispatch Re-assign Modal */}
      {showDispatchModal && dispatchIncident && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Smart Dispatch Override ({dispatchIncident.id})
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Select any responder from Hyderabad pool or execute auto-scoring recommendation.
            </p>
            
            <div className="space-y-2 max-h-60 overflow-y-auto mb-4 pr-1">
              {responders.filter(r => r.status === 'Available').slice(0, 5).map(resp => (
                <div 
                  key={resp.id}
                  onClick={() => {
                    smartDispatch(dispatchIncident.id, resp.id);
                    setShowDispatchModal(false);
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 cursor-pointer flex justify-between items-center transition"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{resp.name}</div>
                    <div className="text-[10px] text-slate-400">{resp.callSign} • {resp.location.area}</div>
                  </div>
                  <button className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded">
                    Assign
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowDispatchModal(false)}
              className="w-full py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Geofence Broadcast Creation Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              Issue Geofenced Area Broadcast
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Direct push notification to citizens located within target radius.
            </p>

            <form onSubmit={handleCreateAreaAlert} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase">Alert Title</label>
                <input
                  type="text"
                  value={alertTitle}
                  onChange={e => setAlertTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase">Directive / Instruction</label>
                <textarea
                  value={alertDesc}
                  onChange={e => setAlertDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Category</label>
                  <select
                    value={alertType}
                    onChange={e => setAlertType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="Flood">Flood / Waterlogging</option>
                    <option value="Fire">Fire Hazard</option>
                    <option value="Road Closure">Road Closure</option>
                    <option value="Traffic">Traffic Gridlock</option>
                    <option value="Toxic Hazard">Toxic Hazard</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Radius (km)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="15"
                    value={alertRadius}
                    onChange={e => setAlertRadius(parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl"
                >
                  Broadcast Warning Now
                </button>
                <button
                  type="button"
                  onClick={() => setShowAlertModal(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Incident Report Modal (Form 112-IN) */}
      {showReportModal && reportIncident && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <h3 className="text-sm font-black text-white uppercase font-mono tracking-wider">
                    OFFICIAL EMERGENCY INCIDENT DOSSIER • FORM 112-IN
                  </h3>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Telangana State Disaster Response & Emergency Command (EOC-14)
                </div>
              </div>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4 py-4 pr-1 text-xs">
              {/* Incident Header Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-[11px] font-mono">
                <div>
                  <div className="text-slate-500 text-[9px] uppercase">Incident ID</div>
                  <div className="font-bold text-white">{reportIncident.id}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[9px] uppercase">Severity / Type</div>
                  <div className="font-bold text-red-400">{reportIncident.severity} {reportIncident.type}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[9px] uppercase">Reported At</div>
                  <div className="font-bold text-slate-300">{new Date(reportIncident.timestamp).toLocaleTimeString()}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[9px] uppercase">Current Status</div>
                  <div className="font-bold text-emerald-400">{reportIncident.status}</div>
                </div>
              </div>

              {/* Citizen & Location */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Location & Geolocation Lock</div>
                <div className="text-white font-bold">{reportIncident.location.address}</div>
                <div className="text-[11px] font-mono text-slate-400">
                  Lat: {reportIncident.location.lat.toFixed(5)} • Lng: {reportIncident.location.lng.toFixed(5)} • Accuracy: ±{reportIncident.location.accuracyMeters || 6}m
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Caller: <span className="text-slate-200">{reportIncident.citizenName}</span> ({reportIncident.citizenPhone})
                </div>
              </div>

              {/* AI Clinical Assessment */}
              {reportIncident.aiTriage && (
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Gemini Multimodal Clinical Triage</span>
                    <span className="text-[10px] font-mono text-cyan-300">Confidence: {reportIncident.aiTriage.confidence}%</span>
                  </div>
                  <p className="text-slate-200 text-xs italic bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    "{reportIncident.aiTriage.patientConditionSummary}"
                  </p>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Generated First-Aid Instructions:</div>
                    <ul className="space-y-1">
                      {reportIncident.aiTriage.firstAidInstructions.map((inst, i) => (
                        <li key={i} className="text-slate-300 text-[11px] flex items-start gap-1.5">
                          <span className="text-red-400">▸</span> {inst}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Responder & Hospital Handover */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase mb-1">Assigned Response Fleet</div>
                  <div className="font-bold text-white">{reportIncident.assignedResponder?.name || 'Unassigned'}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Callsign: {reportIncident.assignedResponder?.callSign || 'N/A'} • Unit: {reportIncident.assignedResponder?.type || 'N/A'}
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase mb-1">Hospital Trauma Admission</div>
                  <div className="font-bold text-white">{reportIncident.assignedHospital?.name || 'Pending Handover'}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {reportIncident.assignedHospital ? `${reportIncident.assignedHospital.availableIcuBeds} ICU Beds Available • ${reportIncident.assignedHospital.area}` : 'Awaiting assignment'}
                  </div>
                </div>
              </div>

              {/* Audit Timeline */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 font-bold uppercase mb-2">Chronological Dispatch Timeline</div>
                <div className="space-y-1.5 font-mono text-[10px]">
                  {reportIncident.timeline.map((entry, i) => (
                    <div key={i} className="flex items-start justify-between border-b border-slate-900 pb-1">
                      <div className="text-slate-300">
                        <span className="text-cyan-400 font-bold">[{entry.status}]</span> {entry.note} ({entry.actor})
                      </div>
                      <div className="text-slate-500 shrink-0 ml-2">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / Save PDF Dossier</span>
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
