import React, { useState } from 'react';
import { EmergencyProvider, useEmergency } from './context/EmergencyContext';
import { PulseGridDashboard } from './components/dashboard/PulseGridDashboard';
import { CitizenView } from './components/citizen/CitizenView';
import { ResponderView } from './components/responder/ResponderView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DemoWalkthrough } from './components/demo/DemoWalkthrough';
import { PrivacyView } from './components/privacy/PrivacyView';
import { X, Smartphone, ArrowLeft } from 'lucide-react';

function AppContent() {
  const { activeRole, setActiveRole } = useEmergency();
  const [showSOSModal, setShowSOSModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans select-none">
      
      {/* Primary PulseGrid View (Matching user's screenshot) */}
      {activeRole === 'citizen' && (
        <PulseGridDashboard onOpenSOS={() => setShowSOSModal(true)} />
      )}

      {/* Responder Terminal View */}
      {activeRole === 'responder' && (
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveRole('citizen')}
              className="flex items-center gap-1 font-bold text-slate-700 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to PulseGrid Citizen Dashboard</span>
            </button>
            <span className="font-mono text-blue-600 font-bold">RESPONDER TERMINAL MODE</span>
          </div>
          <ResponderView />
        </div>
      )}

      {/* Admin Command Center Dashboard */}
      {activeRole === 'admin' && (
        <div className="flex-1 flex flex-col">
          <div className="bg-[#090d16] border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveRole('citizen')}
              className="flex items-center gap-1 font-bold text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to PulseGrid Citizen Dashboard</span>
            </button>
            <span className="font-mono text-cyan-400 font-bold">COMMAND CENTER DISPATCH MODE</span>
          </div>
          <AdminDashboard />
        </div>
      )}

      {/* 90-Second Guided Live Demo Walkthrough */}
      {activeRole === 'demo' && (
        <div className="flex-1 flex flex-col">
          <div className="bg-[#090d16] border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveRole('citizen')}
              className="flex items-center gap-1 font-bold text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to PulseGrid Citizen Dashboard</span>
            </button>
            <span className="font-mono text-amber-400 font-bold">90-SECOND HACKATHON DEMO WALKTHROUGH</span>
          </div>
          <DemoWalkthrough />
        </div>
      )}

      {/* Privacy & Trust View */}
      {activeRole === 'privacy' && (
        <div className="flex-1 flex flex-col">
          <div className="bg-[#090d16] border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveRole('citizen')}
              className="flex items-center gap-1 font-bold text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to PulseGrid Citizen Dashboard</span>
            </button>
            <span className="font-mono text-emerald-400 font-bold">DATA PRIVACY & DPDP COMPLIANCE</span>
          </div>
          <PrivacyView />
        </div>
      )}

      {/* Interactive Emergency Report & SOS Drawer Modal */}
      {showSOSModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-full max-w-[420px] max-h-[92vh] overflow-y-auto bg-[#070b14] rounded-[36px] border-4 border-slate-800 shadow-2xl relative flex flex-col">
            <div className="sticky top-0 right-0 z-50 flex justify-between items-center p-4 bg-[#070b14]/90 backdrop-blur border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-wider">
                Emergency Dispatch Portal
              </span>
              <button
                onClick={() => setShowSOSModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <CitizenView />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <EmergencyProvider>
      <AppContent />
    </EmergencyProvider>
  );
}
