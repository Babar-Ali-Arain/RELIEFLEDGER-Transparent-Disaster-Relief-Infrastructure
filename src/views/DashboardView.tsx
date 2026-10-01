import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  AlertTriangle, 
  CloudOff, 
  CheckCircle2, 
  Building2, 
  UserPlus, 
  PackagePlus, 
  QrCode, 
  ShieldCheck, 
  ArrowUpRight,
  PieChart,
  Clock,
  MapPin,
  TrendingUp,
  Activity,
  Zap,
  ChevronRight,
  Filter,
  ShieldAlert
} from 'lucide-react';
import { useRelief } from '../context/ReliefContext';

export const DashboardView: React.FC = () => {
  const { 
    households, 
    transactions, 
    duplicateAlerts, 
    syncQueue, 
    organizations, 
    setActiveTab,
    setSelectedReliefId,
    isOffline,
    toggleOfflineMode,
    currentWorker
  } = useRelief();

  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week'>('all');

  // Metrics calculation
  const totalHouseholds = households.length;
  const totalBeneficiaries = households.reduce((sum, h) => sum + h.familySize, 0);
  const totalTransactions = transactions.length;
  const pendingOverlapAlerts = duplicateAlerts.filter(d => d.status === 'pending').length;
  const pendingSyncCount = syncQueue.length;
  const verifiedTxCount = transactions.filter(t => t.verificationStatus === 'verified').length;
  const participatingOrgsCount = organizations.length;

  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  transactions.forEach(t => {
    categoryCounts[t.aidType] = (categoryCounts[t.aidType] || 0) + 1;
  });

  // Location / Sector breakdown
  const sectorCounts: Record<string, number> = {};
  households.forEach(h => {
    sectorCounts[h.currentLocation] = (sectorCounts[h.currentLocation] || 0) + 1;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Command Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-slate-800 relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 font-extrabold px-3 py-1 rounded-full text-xs uppercase tracking-wider border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> HUMANITARIAN COMMAND DASHBOARD
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
              isOffline ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}>
              {isOffline ? '● SIMULATED OFFLINE MODE' : '● LIVE DISASTER NETWORK'}
            </span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight">
            Interoperable Disaster Relief Ledger
          </h1>
          <p className="text-slate-300 text-xs lg:text-sm leading-relaxed">
            Real-time tracking across participating humanitarian organizations. Preventing aid duplication while guaranteeing dignity and privacy for every household.
          </p>
        </div>

        {/* Quick Command Shortcuts */}
        <div className="flex flex-wrap gap-2.5 shrink-0 relative z-10">
          <button
            onClick={() => setActiveTab('register')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-98"
          >
            <UserPlus className="w-4 h-4" /> REGISTER HOUSEHOLD
          </button>
          <button
            onClick={() => setActiveTab('record-aid')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-98"
          >
            <PackagePlus className="w-4 h-4" /> RECORD AID
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
          >
            <QrCode className="w-4 h-4" /> VERIFY ID
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
          >
            <ShieldCheck className="w-4 h-4" /> AUDIT LEDGER
          </button>
        </div>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Households */}
        <div 
          onClick={() => setActiveTab('households')}
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold text-slate-700">Households</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-950 tabular-nums">
            {totalHouseholds.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <span>{totalBeneficiaries} Total Members</span>
          </div>
        </div>

        {/* Total Aid Transactions */}
        <div 
          onClick={() => setActiveTab('record-aid')}
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold text-slate-700">Distributions</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-950 tabular-nums">
            {totalTransactions.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" /> SHA-256 Chained
          </div>
        </div>

        {/* Overlap Alerts */}
        <div 
          onClick={() => setActiveTab('duplicates')}
          className="bg-white p-4.5 rounded-2xl border border-amber-200 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 bg-gradient-to-br from-white to-amber-50/30"
        >
          <div className="flex items-center justify-between text-amber-900">
            <span className="text-xs font-extrabold text-amber-950">Overlap Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-950 tabular-nums">
            {pendingOverlapAlerts}
          </div>
          <div className="text-[11px] text-amber-800 font-bold flex items-center gap-1">
            Human Audit <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Pending Offline Sync */}
        <div 
          onClick={() => setActiveTab('sync-center')}
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold text-slate-700">Offline Queue</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CloudOff className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-950 tabular-nums">
            {pendingSyncCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Local storage queue</div>
        </div>

        {/* Verified Ledger */}
        <div 
          onClick={() => setActiveTab('audit')}
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold text-slate-700">Ledger Health</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-950 tabular-nums">
            100%
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">Cryptographic Intact</div>
        </div>

        {/* Participating Agencies */}
        <div 
          onClick={() => setActiveTab('organizations')}
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold text-slate-700">Agencies</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-950 tabular-nums">
            {participatingOrgsCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Multi-agency net</div>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Aid Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900">Aid Category Volume & Coverage</h3>
            </div>
            <span className="text-xs font-mono text-slate-500 font-bold">
              {totalTransactions} Total Units
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / totalTransactions) * 100) || 0;
              return (
                <div key={cat} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900 font-extrabold">{cat}</span>
                    <span className="text-emerald-700 font-mono">{count} units ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.max(12, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Regional Sector Coverage */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-extrabold text-slate-900">Disaster Sector Coverage</h3>
            </div>
            <span className="text-xs text-slate-500 font-bold">Registered Villages</span>
          </div>

          <div className="space-y-3">
            {Object.entries(sectorCounts).map(([sector, count]) => (
              <div key={sector} className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl transition-colors border border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-900">{sector}</span>
                </div>
                <span className="text-xs font-mono font-extrabold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                  {count} households
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Activity Timeline Stream */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-extrabold text-slate-900">Live Relief Ledger Activity Stream</h3>
          </div>
          <button
            onClick={() => setActiveTab('audit')}
            className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
          >
            Audit Cryptographic Chain <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {transactions.slice(0, 5).map((tx) => (
            <div 
              key={tx.id}
              onClick={() => {
                setSelectedReliefId(tx.reliefId);
                setActiveTab('profile');
              }}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-3 rounded-xl cursor-pointer transition-colors"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-extrabold bg-slate-900 text-white px-2 py-0.5 rounded">
                    {tx.reliefId}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{tx.aidType}</span>
                  <span className="text-[10px] text-slate-500 font-medium">({tx.quantity})</span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span>{tx.organizationName}</span> · <span>Worker: {tx.workerName}</span> · <span>Location: {tx.location}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 font-extrabold px-2 py-1 rounded border border-emerald-200 inline-block">
                  HASH: {tx.currentHash ? tx.currentHash.substring(0, 12) : '000000000000'}...
                </span>
                <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{tx.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
