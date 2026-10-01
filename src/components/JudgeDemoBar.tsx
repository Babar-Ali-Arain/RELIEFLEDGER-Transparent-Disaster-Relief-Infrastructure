import React, { useState } from 'react';
import { RotateCcw, Zap, ChevronRight, Wifi, WifiOff, Sparkles } from 'lucide-react';
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
    { num: 1, label: '1. Login Screen', tab: 'login', action: () => triggerDemoStep(1) },
    { num: 2, label: '2. Overview', tab: 'dashboard', action: () => triggerDemoStep(2) },
    { num: 3, label: '3. Households List', tab: 'households', action: () => triggerDemoStep(3) },
    { num: 4, label: '4. Register Household', tab: 'register', action: () => triggerDemoStep(4) },
    { num: 5, label: '5. Household Profile', tab: 'profile', action: () => triggerDemoStep(5) },
    { num: 6, label: '6. Record Aid', tab: 'record-aid', action: () => triggerDemoStep(6) },
    { num: 7, label: '7. Overlap Warning', tab: 'record-aid', action: () => triggerDemoStep(7) },
    { num: 8, label: '8. Simulate Offline', tab: 'record-aid', action: () => triggerDemoStep(8) },
    { num: 9, label: '9. Sync Center', tab: 'sync-center', action: () => triggerDemoStep(9) },
    { num: 10, label: '10. Audit Hash Chain', tab: 'audit', action: () => triggerDemoStep(10) },
    { num: 11, label: '11. Public Verification', tab: 'verify', action: () => triggerDemoStep(11) }
  ];

  return (
    <div className="bg-slate-950 text-white border-b border-slate-800 text-xs z-50 sticky top-0 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: Badge & Title */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 font-extrabold px-2.5 py-0.5 rounded-lg text-[10px] tracking-wide uppercase border border-amber-500/30">
            <Zap className="w-3 h-3 text-amber-400 animate-pulse" /> JUDGE DEMO MODE
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-white underline text-[11px] font-semibold transition-colors"
          >
            {isExpanded ? 'Hide Stepper' : 'Show Stepper'}
          </button>
        </div>

        {/* Center: Quick Household Presets */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-slate-400 text-[11px] font-semibold mr-1 hidden lg:inline">Presets:</span>
          {['RL-KHP-7F3A92', 'RL-KHP-1A82BD', 'RL-SUK-77AB21', 'RL-SUK-91CD20'].map((id) => (
            <button
              key={id}
              onClick={() => {
                setSelectedReliefId(id);
                triggerDemoStep(5);
              }}
              className="px-2.5 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white rounded-md font-mono text-[11px] font-bold border border-slate-700/80 transition-all hover:border-slate-500 shrink-0"
              title={`Load profile for ${id}`}
            >
              {id}
            </button>
          ))}
        </div>

        {/* Right: Quick Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleOfflineMode}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 text-[11px] transition-all border ${
              isOffline
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-xs animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{isOffline ? 'RESTORE ONLINE' : 'SIMULATE OFFLINE'}</span>
          </button>

          {syncQueue.length > 0 && (
            <button
              onClick={syncQueueNow}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-lg text-[11px] flex items-center gap-1 border border-emerald-400 shadow-xs"
            >
              SYNC ({syncQueue.length})
            </button>
          )}

          <button
            onClick={resetDemoData}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Reset to pristine demo state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Stepper buttons bar */}
      {isExpanded && (
        <div className="bg-slate-900/95 border-t border-slate-800/80 py-1.5 px-3 sm:px-4 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto flex items-center gap-1.5 min-w-max">
            {demoSteps.map((step) => {
              const isActive = activeTab === step.tab;
              return (
                <button
                  key={step.num}
                  onClick={step.action}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold border-emerald-500 shadow-xs'
                      : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-800'
                  }`}
                >
                  <span>{step.label}</span>
                  <ChevronRight className="w-3 h-3 opacity-60" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
