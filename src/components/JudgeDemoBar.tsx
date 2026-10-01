import React, { useState } from 'react';
import { RotateCcw, Zap, Wifi, WifiOff } from 'lucide-react';
import { useRelief } from '../context/ReliefContext';

export const JudgeDemoBar: React.FC = () => {
  const { 
    triggerDemoStep, 
    resetDemoData, 
    isOffline, 
    toggleOfflineMode, 
    setSelectedReliefId, 
    activeTab,
    syncQueue,
    syncQueueNow
  } = useRelief();

  const [isExpanded, setIsExpanded] = useState(true);

  const demoSteps = [
    { num: 1, label: '1. Login', tab: 'login', action: () => triggerDemoStep(1) },
    { num: 2, label: '2. Overview', tab: 'dashboard', action: () => triggerDemoStep(2) },
    { num: 3, label: '3. Households', tab: 'households', action: () => triggerDemoStep(3) },
    { num: 4, label: '4. Register', tab: 'register', action: () => triggerDemoStep(4) },
    { num: 5, label: '5. Profile', tab: 'profile', action: () => triggerDemoStep(5) },
    { num: 6, label: '6. Record Aid', tab: 'record-aid', action: () => triggerDemoStep(6) },
    { num: 7, label: '7. Overlap Alert', tab: 'record-aid', action: () => triggerDemoStep(7) },
    { num: 8, label: '8. Offline Sim', tab: 'record-aid', action: () => triggerDemoStep(8) },
    { num: 9, label: '9. Sync Center', tab: 'sync-center', action: () => triggerDemoStep(9) },
    { num: 10, label: '10. Audit Chain', tab: 'audit', action: () => triggerDemoStep(10) },
    { num: 11, label: '11. Verify ID', tab: 'verify', action: () => triggerDemoStep(11) }
  ];

  return (
    <div className="bg-slate-950 text-white border-b border-slate-800 text-xs z-40 relative w-full overflow-hidden shadow-md">
      
      {/* Top Main Controls Strip */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 py-1.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        
        {/* Left: Judge Badge & Expand Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 font-black px-2 py-0.5 rounded-lg text-[10px] tracking-wide uppercase border border-amber-500/30 whitespace-nowrap">
            <Zap className="w-3 h-3 text-amber-400 animate-pulse" /> JUDGE DEMO
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-white underline text-[10px] font-bold transition-colors whitespace-nowrap"
          >
            {isExpanded ? 'Hide' : 'Show Stepper'}
          </button>
        </div>

        {/* Center: Household Presets (Scrollable on small screens) */}
        <div className="flex items-center gap-1 shrink-0 overflow-x-auto no-scrollbar py-0.5 max-w-[200px] xs:max-w-[280px] sm:max-w-none">
          <span className="text-slate-400 text-[10px] font-bold hidden md:inline">Presets:</span>
          {['RL-KHP-7F3A92', 'RL-KHP-1A82BD', 'RL-SUK-77AB21', 'RL-SUK-91CD20'].map((id) => (
            <button
              key={id}
              onClick={() => {
                setSelectedReliefId(id);
                triggerDemoStep(5);
              }}
              className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white rounded font-mono text-[10px] font-bold border border-slate-700/80 transition-all shrink-0 whitespace-nowrap"
              title={`Load profile for ${id}`}
            >
              {id}
            </button>
          ))}
        </div>

        {/* Right: Offline Toggle & Reset */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleOfflineMode}
            className={`px-2 py-0.5 rounded-md font-bold flex items-center gap-1 text-[10px] transition-all border whitespace-nowrap ${
              isOffline
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
            <span>{isOffline ? 'OFFLINE' : 'ONLINE'}</span>
          </button>

          {syncQueue.length > 0 && (
            <button
              onClick={syncQueueNow}
              className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-md text-[10px] flex items-center gap-1 border border-emerald-400 shadow-xs whitespace-nowrap"
            >
              SYNC ({syncQueue.length})
            </button>
          )}

          <button
            onClick={resetDemoData}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors shrink-0"
            title="Reset demo data"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Expandable Guided Stepper Strip (Horizontally Scrollable) */}
      {isExpanded && (
        <div className="bg-slate-900/90 border-t border-slate-800/80 px-2.5 sm:px-4 py-1.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 w-max">
            {demoSteps.map((step) => {
              const isActive = activeTab === step.tab;
              return (
                <button
                  key={step.num}
                  onClick={step.action}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all shrink-0 whitespace-nowrap flex items-center gap-1 border ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-xs'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
