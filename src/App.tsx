import React, { useState } from 'react';
import { EmergencyProvider, useEmergency } from './context/EmergencyContext';
import { PulseGridDashboard } from './components/dashboard/PulseGridDashboard';
import { CitizenView } from './components/citizen/CitizenView';
import { ResponderView } from './components/responder/ResponderView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DemoWalkthrough } from './components/demo/DemoWalkthrough';
import { PrivacyView } from './components/privacy/PrivacyView';
import { EmergencyChatbot } from './components/chat/EmergencyChatbot';
import { TemporaryLoggedOutScreen } from './components/auth/TemporaryLoggedOutScreen';
import { X } from 'lucide-react';

function AppContent() {
  const { activeRole, isTemporarilyLoggedOut } = useEmergency();
  const [showSOSModal, setShowSOSModal] = useState<boolean>(false);

  // If temporarily logged out, render the secure lock / log in screen
  if (isTemporarilyLoggedOut) {
    return <TemporaryLoggedOutScreen />;
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f8fafc] text-slate-800 flex flex-col font-sans select-none">

      {/* Primary PulseGrid Citizen Dashboard */}
      {activeRole === 'citizen' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <PulseGridDashboard onOpenSOS={() => setShowSOSModal(true)} />
        </div>
      )}

      {/* Responder Terminal View — full height, no external bar */}
      {activeRole === 'responder' && (
        <div className="flex-1 overflow-hidden">
          <ResponderView />
        </div>
      )}

      {/* Admin Command Center Dashboard — full height, no external bar */}
      {activeRole === 'admin' && (
        <div className="flex-1 overflow-hidden">
          <AdminDashboard />
        </div>
      )}

      {/* 90-Second Guided Live Demo Walkthrough */}
      {activeRole === 'demo' && (
        <div className="flex-1 overflow-hidden">
          <DemoWalkthrough />
        </div>
      )}

      {/* Privacy & Trust View */}
      {activeRole === 'privacy' && (
        <div className="flex-1 overflow-hidden">
          <PrivacyView />
        </div>
      )}

      {/* Interactive Emergency Report & SOS Drawer Modal */}
      {showSOSModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[480px] max-h-[92vh] overflow-y-auto bg-[#070b14] rounded-3xl border border-slate-800/80 shadow-2xl relative flex flex-col z-[10000]">
            {/* Modal Header */}
            <div className="sticky top-0 z-50 flex justify-between items-center px-5 py-3.5 bg-[#070b14]/95 backdrop-blur border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
                  Emergency Dispatch Portal
                </span>
              </div>
              <button
                onClick={() => setShowSOSModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
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

      {/* Universal Floating Lifeline AI Assistant Chatbot */}
      <EmergencyChatbot />

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
