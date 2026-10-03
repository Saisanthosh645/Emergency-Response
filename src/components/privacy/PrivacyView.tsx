import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Trash2, 
  Clock, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle,
  Smartphone,
  PhoneCall,
  Database,
  KeyRound,
  FileSignature,
  Eye,
  RefreshCw,
  HardDriveDownload,
  AlertTriangle,
  History,
  Check,
  Radio,
  Search,
  ExternalLink
} from 'lucide-react';

import { useEmergency } from '../../context/EmergencyContext';
import { TRANSLATIONS } from '../../utils/i18n';

export const PrivacyView: React.FC = () => {
  const { 
    setActiveRole, 
    privacySettings, 
    updatePrivacySettings, 
    dataAccessLogs, 
    logDataAccess, 
    purgeAllUserData,
    maskPhoneNumber,
    maskName,
    incidents,
    currentLanguage
  } = useEmergency();

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const [searchLog, setSearchLog] = useState('');
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);
  const [testAccessType, setTestAccessType] = useState<'HOSPITAL' | 'POLICE' | 'DISPATCHER'>('HOSPITAL');
  const [showToast, setShowToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3500);
  };

  const handleSimulateDataAccess = () => {
    if (testAccessType === 'HOSPITAL') {
      logDataAccess(
        'Yashoda ER Trauma Desk',
        'TRIAGE_VITALS_READ',
        'Active Emergency (Cardiovascular)',
        'Pre-arrival OT surgical prep & blood reserve'
      );
      triggerToast('Hospital access recorded to DPDP audit ledger');
    } else if (testAccessType === 'POLICE') {
      logDataAccess(
        'Cyberabad Police Patrol Unit 08',
        'PERIMETER_BEACON_LOCK',
        'Distress Coordinate (Madhapur)',
        'Armed perimeter escort and crowd control'
      );
      triggerToast('Police access audit entry created');
    } else {
      logDataAccess(
        'Zone-4 Senior Dispatcher',
        'COMMUNICATION_RELAY_CALL',
        'Citizen VoIP Proxy',
        'Responder route guidance clarification'
      );
      triggerToast('Dispatcher VoIP access logged');
    }
  };

  const handleExecutePurge = () => {
    purgeAllUserData();
    setIsPurgeModalOpen(false);
    setPurgeSuccess(true);
    triggerToast('All citizen PII scrubbed and fuzzed under DPDP Section 12');
    setTimeout(() => setPurgeSuccess(false), 6000);
  };

  const filteredLogs = dataAccessLogs.filter(log => {
    const matchSearch = log.actor.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.action.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.target.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.purpose.toLowerCase().includes(searchLog.toLowerCase());
    const matchAction = filterAction === 'ALL' || log.action.includes(filterAction);
    return matchSearch && matchAction;
  });

  return (
    <div className="w-full h-full bg-[#070b14] text-slate-100 flex flex-col overflow-hidden select-none font-sans">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600/95 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-400 backdrop-blur animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
          <span className="text-xs font-semibold">{showToast}</span>
        </div>
      )}

      {/* Header with Back Nav & DPDP Seal */}
      <div className="bg-[#090d16] border-b border-slate-800 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveRole('citizen')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition pr-4 border-r border-slate-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            <span>{t.exitToDashboard}</span>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wide text-white uppercase font-mono flex items-center gap-2">
                Secure Data & Privacy Architecture
                <span className="text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 px-2 py-0.5 rounded-full">
                  DPDP Act 2023 Compliant
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">Hardware-backed AES-256-GCM encryption & ephemeral location zero-knowledge telemetry</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-mono text-slate-300">Hardware Keystore: Secure</span>
          </div>
          <button
            onClick={() => setIsPurgeModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3.5 py-1.5 rounded-xl transition shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Right to Erasure (Purge)</span>
          </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6">

        {/* Live Preview & Encryption Benchmark Card */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0c1427] to-slate-900 border border-slate-800/90 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                  Active Operational Cryptography & Masking Preview
                </h3>
                <p className="text-xs text-slate-400">
                  Current presentation of citizen identity in real-time across dispatcher and responder interfaces
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Algorithm:</span>
              <span className="text-xs font-mono font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded-lg">
                {privacySettings.encryptionStandard}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Live Name Preview */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Citizen Name Masking</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${privacySettings.maskCitizenName ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-300'}`}>
                  {privacySettings.maskCitizenName ? 'ACTIVE' : 'EXPOSED'}
                </span>
              </div>
              <div className="text-sm font-bold text-white font-mono">
                {maskName('Karthik Rao (Hyderabad Resident)')}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Raw: Karthik Rao → Rendered: {maskName('Karthik Rao')}
              </div>
            </div>

            {/* Live Phone Preview */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>VoIP Relay Proxy</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${privacySettings.anonymizePhone ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-300'}`}>
                  {privacySettings.anonymizePhone ? 'PROTECTED' : 'UNMASKED'}
                </span>
              </div>
              <div className="text-sm font-bold text-cyan-300 font-mono">
                {maskPhoneNumber('+91 98765 43210')}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Routes via encrypted ephemeral session tunnel
              </div>
            </div>

            {/* GPS Telemetry Retention */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Location Ephemerality</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${privacySettings.ephemeralGpsActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                  {privacySettings.ephemeralGpsActive ? 'EPHEMERAL' : 'PERSISTENT'}
                </span>
              </div>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                {privacySettings.fuzzyResolvedLocation ? 'Centroid GeoHash (~1km)' : 'Precise WGS84 (<5m)'}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Resolved records auto-anonymize coordinates
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars of Trust */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Pillar 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <EyeOff className="w-5 h-5" />
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={privacySettings.ephemeralGpsActive}
                  onChange={(e) => updatePrivacySettings({ ephemeralGpsActive: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              Ephemeral GPS Telemetry Engine
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Your live GPS location coordinates are exclusively collected during an <strong>active reported incident</strong>. The second the case is marked "Resolved" by paramedic or citizen, coordinate telemetry is severed from location tracking daemons.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-1 rounded-lg">
              <Check className="w-3.5 h-3.5" />
              <span>Real-time location stream terminates on case closure</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={privacySettings.anonymizePhone}
                  onChange={(e) => updatePrivacySettings({ anonymizePhone: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              Cryptographic Mobile & Identity Shielding
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Direct phone numbers and full names of callers and emergency contacts are never revealed to field responders or non-credentialed operators. Calls route through an encrypted VoIP proxy relay.
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">Also mask citizen names:</span>
              <button
                onClick={() => updatePrivacySettings({ maskCitizenName: !privacySettings.maskCitizenName })}
                className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-lg border transition ${
                  privacySettings.maskCitizenName 
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-800' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {privacySettings.maskCitizenName ? 'Mask Names: ON' : 'Mask Names: OFF'}
              </button>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 border border-purple-800 px-2 py-0.5 rounded-full">
                Statutory Immunity
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              Supreme Court Good Samaritan Legal Immunity
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Protected under the Supreme Court of India Good Samaritan guidelines. Bystanders, first-aiders, and blood donors assisting trauma victims incur zero civil or criminal liability and cannot be compelled to disclose identity or attend court hearings.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={privacySettings.fuzzyResolvedLocation}
                  onChange={(e) => updatePrivacySettings({ fuzzyResolvedLocation: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              Fuzzy Coordinate Geohashing (Post-Incident)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              When an incident closes, exact pinpoints are automatically truncated to a neighborhood geohash (~1.2 km centroid), ensuring historical analytics retain statistical value while impossible to pinpoint individual residences.
            </p>
            <div className="text-[11px] font-mono text-blue-300 bg-blue-950/40 border border-blue-900/50 px-2.5 py-1 rounded-lg">
              Status: {privacySettings.fuzzyResolvedLocation ? 'Enabled — Precision fuzzed to 2 decimal places' : 'Disabled — Full precision kept'}
            </div>
          </div>

        </div>

        {/* Live Data Access Audit Trail & Inspector (DPDP Section 6 & 11) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wide">
                  Live Data Access Audit Trail (DPDP Section 6 & 11)
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Every hospital query, dispatch read, and police radio intercept is cryptographically notarized
              </p>
            </div>

            {/* Test Simulation Controls */}
            <div className="flex items-center gap-2">
              <select
                value={testAccessType}
                onChange={(e) => setTestAccessType(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-1.5 rounded-xl font-mono"
              >
                <option value="HOSPITAL">Simulate Hospital ER Read</option>
                <option value="POLICE">Simulate Police Intercept</option>
                <option value="DISPATCHER">Simulate Dispatcher Relay</option>
              </select>
              <button
                onClick={handleSimulateDataAccess}
                className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl transition shadow"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Simulate & Notarize</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search audit trail by actor, target, or purpose..."
                value={searchLog}
                onChange={(e) => setSearchLog(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 pl-9 pr-4 py-2 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700"
              />
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {['ALL', 'READ', 'WRITE', 'LOCK'].map((act) => (
                <button
                  key={act}
                  onClick={() => setFilterAction(act)}
                  className={`text-[11px] font-mono px-3 py-1.5 rounded-lg border transition ${
                    filterAction === act
                      ? 'bg-slate-800 text-cyan-400 border-cyan-800'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 max-h-72 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-3">Log ID</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Authorized Actor</th>
                  <th className="py-2.5 px-3">Action Type</th>
                  <th className="py-2.5 px-3">Target Resource</th>
                  <th className="py-2.5 px-3">DPDP Legal Purpose</th>
                  <th className="py-2.5 px-3">Network Origin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500 font-mono text-xs">
                      No audit events match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/60 transition">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-cyan-400 font-semibold">{log.id}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-200">{log.actor}</td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                          log.action.includes('PURGE') 
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : log.action.includes('READ')
                            ? 'bg-blue-950 text-blue-400 border border-blue-800'
                            : log.action.includes('LOCK')
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">{log.target}</td>
                      <td className="py-2.5 px-3 text-slate-400">{log.purpose}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{log.ipMasked}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Retention Policy Configuration */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-bold text-white uppercase font-mono">
                Command Center Automated Retention Schedule
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
              DPDP Section 8 Compliant
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Automated Retention Threshold</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Scrub citizen telemetry after specified duration</div>
              </div>
              <select
                value={privacySettings.autoPurgeDays}
                onChange={(e) => updatePrivacySettings({ autoPurgeDays: Number(e.target.value) })}
                className="bg-slate-900 border border-slate-800 text-xs text-cyan-300 px-3 py-1.5 rounded-lg font-mono"
              >
                <option value={1}>24 Hours (Strict Ephemeral)</option>
                <option value={7}>7 Days (Recommended Standard)</option>
                <option value={30}>30 Days (Clinical Audit Standard)</option>
                <option value={90}>90 Days (Forensic Police Reserve)</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Cryptographic Verification Seal</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Every report certified with SHA-256 integrity hash</div>
              </div>
              <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-lg">
                HMAC-SHA256 ON
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Confirmation Modal for Right to be Forgotten Purge */}
      {isPurgeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b101e] border border-rose-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-mono uppercase">
                  Execute Right to Erasure?
                </h3>
                <span className="text-xs text-rose-300 font-mono">Digital Personal Data Protection Act, Sec 12</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This irreversible cryptographic action will permanently scrub all citizen identifiable data, telephone numbers, and precise GPS lat/lng coordinates across all active and historical incidents.
            </p>

            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1.5 text-[11px] font-mono text-slate-400">
              <div className="flex items-center justify-between text-slate-300">
                <span>Citizen Name:</span>
                <span className="text-rose-400">→ Redacted (Sec 12)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Phone Numbers:</span>
                <span className="text-rose-400">→ +91 ***** *****</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>GPS Resolution:</span>
                <span className="text-rose-400">→ Fuzzed to District Centroid</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsPurgeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleExecutePurge}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition shadow-lg shadow-rose-900/30 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Erasure</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
