import React from 'react';
import { 
  Users, 
  Package, 
  AlertTriangle, 
  CloudOff, 
  CheckCircle, 
  Building2, 
  UserPlus, 
  PackagePlus, 
  QrCode, 
  ShieldCheck, 
  ArrowUpRight,
  BarChart3,
  PieChart
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
    setSelectedReliefId
  } = useRelief();

  // Metrics calculation
  const totalHouseholds = households.length;
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

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OFFLINE-FIRST DISASTER RELIEF INFRASTRUCTURE</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            Transparent Disaster Aid Verification
          </h1>
          <p className="text-slate-300 text-xs lg:text-sm leading-relaxed">
            One household, one verifiable aid record. Preventing duplicates without restricting legitimate humanitarian assistance.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('register')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm"
          >
            <UserPlus className="w-4 h-4" /> REGISTER HOUSEHOLD
          </button>
          <button
            onClick={() => setActiveTab('record-aid')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm"
          >
            <PackagePlus className="w-4 h-4" /> RECORD AID
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-xl flex items-center gap-2 transition-all"
          >
            <QrCode className="w-4 h-4" /> VERIFY RELIEF ID
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-xl flex items-center gap-2 transition-all"
          >
            <ShieldCheck className="w-4 h-4" /> AUDIT LEDGER
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
        {/* Total Households */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Households</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {totalHouseholds.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">100% Verifiable IDs</div>
        </div>

        {/* Total Aid Transactions */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Aid Transactions</span>
            <Package className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {totalTransactions.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">Hash chained in block ledger</div>
        </div>

        {/* Overlap Alerts */}
        <div 
          onClick={() => setActiveTab('duplicates')}
          className="bg-white p-4 rounded-xl border border-amber-200 hover:border-amber-300 shadow-2xs space-y-2 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-semibold">Overlap Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-900 tabular-nums">
            {pendingOverlapAlerts}
          </div>
          <div className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
            Human Review Required <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Pending Offline Sync */}
        <div 
          onClick={() => setActiveTab('sync-center')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs space-y-2 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Pending Offline Sync</span>
            <CloudOff className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {pendingSyncCount}
          </div>
          <div className="text-[11px] text-slate-500">Local queue active</div>
        </div>

        {/* Verified Transactions */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Verified Ledger</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {verifiedTxCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">100% SHA-256 Intact</div>
        </div>

        {/* Participating Orgs */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Organizations</span>
            <Building2 className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {participatingOrgsCount}
          </div>
          <div className="text-[11px] text-slate-500">NGOs & Gov Agencies</div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aid Category Breakdown Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">Aid Distributed by Category</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Live Master Ledger</span>
          </div>

          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / totalTransactions) * 100) || 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-800">{cat}</span>
                    <span className="text-slate-600 font-mono tabular-nums">{count} items ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
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

        {/* Recent Household Registrations & Verification Queue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">Recent Household Relief Records</h3>
            </div>
            <button
              onClick={() => setActiveTab('register')}
              className="text-xs text-emerald-700 font-semibold hover:underline"
            >
              + Register New
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {households.slice(0, 4).map((hh) => (
              <div 
                key={hh.id}
                onClick={() => {
                  setSelectedReliefId(hh.reliefId);
                  setActiveTab('profile');
                }}
                className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{hh.reliefId}</span>
                    <span className="text-xs text-slate-700 font-medium">{hh.representativeName}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {hh.currentLocation} · {hh.familySize} Members
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {hh.status}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">{hh.registrationDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
