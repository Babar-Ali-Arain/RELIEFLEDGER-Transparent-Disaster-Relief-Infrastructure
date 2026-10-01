import React from 'react';
import { 
  CloudOff, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  Database, 
  HardDrive, 
  ShieldCheck, 
  Package 
} from 'lucide-react';
import { useRelief } from '../context/ReliefContext';

export const SyncQueueView: React.FC = () => {
  const { 
    isOffline, 
    toggleOfflineMode, 
    syncQueue, 
    syncQueueNow, 
    transactions,
    households 
  } = useRelief();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
            <CloudOff className="w-4 h-4" /> Offline Resilience Engine
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Offline Synchronization Queue
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            Stores relief records locally in IndexedDB / LocalStorage during disaster power & internet outages.
          </p>
        </div>

        {/* Offline Simulation Toggle Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleOfflineMode}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border shadow-xs ${
              isOffline
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold animate-pulse'
                : 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800'
            }`}
          >
            {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
            {isOffline ? 'RESTORE CONNECTION' : 'SIMULATE OFFLINE MODE'}
          </button>
        </div>
      </div>

      {/* Connection State Info Box */}
      <div className={`p-6 rounded-2xl border ${
        isOffline 
          ? 'bg-amber-50 border-amber-300 text-amber-950' 
          : 'bg-emerald-50 border-emerald-200 text-emerald-950'
      }`}>
        <div className="flex items-start gap-4">
          {isOffline ? (
            <WifiOff className="w-8 h-8 text-amber-600 shrink-0 mt-1" />
          ) : (
            <Wifi className="w-8 h-8 text-emerald-600 shrink-0 mt-1" />
          )}

          <div className="space-y-1">
            <h3 className="font-extrabold text-base">
              {isOffline ? 'OFFLINE MODE ENGAGED' : 'NETWORK CONNECTED & READY'}
            </h3>
            <p className="text-xs opacity-90 leading-relaxed">
              {isOffline
                ? 'Your data will be saved securely on this device and synchronized when connection returns. All offline entries generate deterministic hashes locally.'
                : 'Device is connected to master network. Offline transactions can now be batch-synchronized to the master ledger.'}
            </p>
          </div>
        </div>
      </div>

      {/* Sync Queue List Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-slate-700" />
            <h3 className="text-lg font-bold text-slate-900">
              PENDING OFFLINE TRANSACTIONS ({syncQueue.length})
            </h3>
          </div>

          {syncQueue.length > 0 && (
            <button
              onClick={syncQueueNow}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> SYNC NOW
            </button>
          )}
        </div>

        {syncQueue.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">All Offline Records Synchronized</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No pending transactions in local storage. Everything is committed to the master relief ledger.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {syncQueue.map((item) => (
              <div 
                key={item.id}
                className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-600 text-white text-[10px] font-bold rounded uppercase">
                      {item.type}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {item.data.reliefId || item.data.id}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700">
                    {item.type === 'AID_RECORD' 
                      ? `${item.data.aidType} (${item.data.quantity}) · ${item.data.organizationName}`
                      : `Household Registration: ${item.data.representativeName} (${item.data.currentLocation})`}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Queued Timestamp: {item.timestamp}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 bg-amber-200 text-amber-900 font-bold text-xs rounded-md">
                    PENDING SYNC
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Architectural Guarantee Box */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-3 border border-slate-800">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Cryptographic Offline Integrity
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          ReliefLedger calculates SHA-256 transaction block hashes client-side on field tablets before local storage persistence. Even if an offline device is turned off or reboots, the hash chain order is preserved and cryptographically verified upon synchronization.
        </p>
      </div>
    </div>
  );
};
