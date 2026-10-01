import React from 'react';
import { 
  CloudOff, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  HardDrive
} from 'lucide-react';
import { useRelief } from '../context/ReliefContext';

export const SyncQueueView: React.FC = () => {
  const { 
    isOffline, 
    toggleOfflineMode, 
    syncQueue, 
    syncQueueNow
  } = useRelief();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-black uppercase tracking-wider mb-1">
            <CloudOff className="w-4 h-4" /> Offline Resilience Engine
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Offline Synchronization Queue
          </h1>
          <p className="text-slate-600 text-xs mt-1 font-medium">
            Stores relief records locally in IndexedDB / LocalStorage during disaster power & internet outages.
          </p>
        </div>

        {/* Offline Simulation Toggle Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleOfflineMode}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all border shadow-xs active:scale-95 ${
              isOffline
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black animate-pulse'
                : 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800'
            }`}
          >
            {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
            {isOffline ? 'RESTORE CONNECTION' : 'SIMULATE OFFLINE MODE'}
          </button>
        </div>
      </div>

      {/* Connection State Info Box */}
      <div className={`p-6 rounded-3xl border-2 space-y-2 shadow-sm transition-all ${
        isOffline 
          ? 'bg-amber-50/90 border-amber-300 text-amber-950' 
          : 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
      }`}>
        <div className="flex items-start gap-4">
          {isOffline ? (
            <WifiOff className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <Wifi className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
          )}

          <div className="space-y-1">
            <h3 className="font-black text-base tracking-tight">
              {isOffline ? 'OFFLINE MODE ENGAGED' : 'NETWORK CONNECTED & READY'}
            </h3>
            <p className="text-xs font-medium opacity-90 leading-relaxed">
              {isOffline
                ? 'Your data will be saved securely on this device and synchronized when connection returns. All offline entries generate deterministic hashes locally.'
                : 'Device is connected to master network. Offline transactions can now be batch-synchronized to the master ledger.'}
            </p>
          </div>
        </div>
      </div>

      {/* Sync Queue List Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-orange-500" />
        <div className="p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-slate-700" />
              <h3 className="text-base font-black text-slate-900">
                PENDING OFFLINE TRANSACTIONS ({syncQueue.length})
              </h3>
            </div>

            {syncQueue.length > 0 && (
              <button
                onClick={syncQueueNow}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-md shadow-emerald-950/20 active:scale-95 transition-all"
              >
                <RefreshCw className="w-4 h-4" /> SYNC NOW
              </button>
            )}
          </div>

          {syncQueue.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-black text-slate-900">All Offline Records Synchronized</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                No pending transactions in local storage. Everything is committed to the master relief ledger.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {syncQueue.map((item) => (
                <div 
                  key={item.id}
                  className="p-4.5 bg-amber-50/60 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-amber-100/60"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-amber-600 text-white text-[10px] font-black rounded uppercase">
                        {item.type}
                      </span>
                      <span className="font-mono text-xs font-black text-slate-900">
                        {item.data.reliefId || item.data.id}
                      </span>
                    </div>
                    <div className="text-xs font-black text-slate-900">
                      {item.type === 'AID_RECORD' 
                        ? `${item.data.aidType} (${item.data.quantity}) · ${item.data.organizationName}`
                        : `Household Registration: ${item.data.representativeName} (${item.data.currentLocation})`}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Queued Timestamp: {item.timestamp}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1 bg-amber-200/80 text-amber-950 font-black text-xs rounded-lg border border-amber-300">
                      PENDING SYNC
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
