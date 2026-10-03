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
  Database
} from 'lucide-react';

export const PrivacyView: React.FC = () => {
  const [retentionDays, setRetentionDays] = useState<number>(7);
  const [autoPurgeEnabled, setAutoPurgeEnabled] = useState<boolean>(true);
  const [anonymizePhone, setAnonymizePhone] = useState<boolean>(true);

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen bg-[#070b14] text-slate-100 p-6 space-y-8 select-none">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h1 className="text-xl font-black tracking-wide text-white uppercase font-mono">
            PRIVACY, CITIZEN CONSENT & TRUST FRAMEWORK
          </h1>
        </div>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Lifeline India is architected from the ground up for strict privacy compliance (Digital Personal Data Protection Act / DPDP 2023 & Indian Good Samaritan Law).
        </p>
      </div>

      {/* 4 Core Pillars of Trust */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Pillar 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">
            Ephemeral GPS Tracking Only
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your live GPS location coordinates are exclusively collected during an <strong>active reported incident</strong>. The second the case is marked "Resolved" by paramedic or citizen, location broadcasting terminates and coordinate telemetry is scrubbed.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">
            Cryptographic Phone Number Masking
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Direct phone numbers of callers and responders are never revealed. Calls and messages route through an encrypted VoIP relay proxy (<code className="text-cyan-300">+91 40 •••• 108</code>), preventing harassment and unsolicited callbacks.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">
            Good Samaritan Legal Protection
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Protected under the Supreme Court of India Good Samaritan guidelines. Bystanders, first-aiders, and blood donors assisting trauma victims incur zero civil or criminal liability and cannot be compelled to disclose identity.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">
            End-to-End Operational Encryption
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            All incident records, clinical triage notes, and paramedic comms are transmitted over TLS 1.3 with AES-GCM-256 in transit and hashed in the local verifiable audit ledger.
          </p>
        </div>

      </div>

      {/* Admin Data Governance & Retention Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase font-mono">
              Command Center Data Retention Policy
            </h2>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
            DPDP Compliant (India 2023)
          </span>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="font-semibold text-white">Automated Incident Data Purge</div>
              <div className="text-slate-400 text-[11px]">Hard-delete citizen identifiable data after retention period</div>
            </div>
            <input
              type="checkbox"
              checked={autoPurgeEnabled}
              onChange={e => setAutoPurgeEnabled(e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="font-semibold text-white">Data Retention Duration</div>
              <div className="text-slate-400 text-[11px]">Days before telemetry is irreversibly anonymized</div>
            </div>
            <select
              value={retentionDays}
              onChange={e => setRetentionDays(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 text-xs text-cyan-300 px-3 py-1.5 rounded-lg"
            >
              <option value={1}>24 Hours (Ultra Strict)</option>
              <option value={7}>7 Days (Recommended Standard)</option>
              <option value={30}>30 Days (Legal Audit Standard)</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="font-semibold text-white">Anonymize Mobile Numbers on UI</div>
              <div className="text-slate-400 text-[11px]">Mask digits with bullets across all operator dashboards</div>
            </div>
            <input
              type="checkbox"
              checked={anonymizePhone}
              onChange={e => setAnonymizePhone(e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
