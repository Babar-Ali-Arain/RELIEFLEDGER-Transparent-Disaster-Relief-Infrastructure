import React from 'react';
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
  BarChart3,
  PieChart,
  Clock,
  Sparkles
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
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800 relative overflow-hidden">
        
        {/* Background decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OFFLINE-FIRST DISASTER RELIEF INFRASTRUCTURE</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight">
            Transparent Disaster Aid Verification & Ledger
          </h1>
          <p className="text-slate-300 text-xs lg:text-sm leading-relaxed">
            One household, one verifiable aid record. Preventing double-dipping across NGOs without restricting legitimate humanitarian assistance.
          </p>
        </div>

        {/* Quick Action CTAs */}
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

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Households */}
        <div 
          onClick={() => setActiveTab('households')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-600">Households</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-950 tabular-nums">
            {totalHouseholds.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <span>✓ 100% Verifiable</span>
          </div>
        </div>

        {/* Total Aid Transactions */}
        <div 
          onClick={() => setActiveTab('record-aid')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-600">Transactions</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-950 tabular-nums">
            {totalTransactions.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Hash chained</div>
        </div>

        {/* Overlap Alerts */}
        <div 
          onClick={() => setActiveTab('duplicates')}
          className="bg-white p-4 rounded-2xl border border-amber-200 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 bg-gradient-to-br from-white to-amber-50/30"
        >
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-bold text-amber-950">Overlap Alerts</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-950 tabular-nums">
            {pendingOverlapAlerts}
          </div>
          <div className="text-[11px] text-amber-700 font-bold flex items-center gap-1">
            Human Review <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Pending Offline Sync */}
        <div 
          onClick={() => setActiveTab('sync-center')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-600">Pending Sync</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CloudOff className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-950 tabular-nums">
            {pendingSyncCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Local queue</div>
        </div>

        {/* Verified Transactions */}
        <div 
          onClick={() => setActiveTab('audit')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-600">Verified Ledger</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-950 tabular-nums">
            {verifiedTxCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">SHA-256 Intact</div>
        </div>

        {/* Participating Orgs */}
        <div 
          onClick={() => setActiveTab('organizations')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-600">Organizations</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-950 tabular-nums">
            {participatingOrgsCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">NGOs & Gov</div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Aid Category Breakdown Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900">Aid Distributed by Category</h3>
            </div>
            <span className="text-xs text-slate-500 font-semibold">Master Hash Ledger</span>
          </div>

          <div className="space-y-3.5">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / totalTransactions) * 100) || 0;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{cat}</span>
                    <span className="text-slate-600 font-mono tabular-nums">{count} distributions ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.max(10, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-extrabold text-slate-900">Recent Relief Records</h3>
            </div>
            <button
              onClick={() => setActiveTab('households')}
              className="text-xs text-emerald-700 font-bold hover:underline"
            >
              View All Households →
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
                className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-slate-950">{hh.reliefId}</span>
                    <span className="text-xs text-slate-800 font-bold">{hh.representativeName}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    {hh.currentLocation} · {hh.familySize} Members
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    ✓ {hh.status}
                  </span>
                  <span className="block text-[10px] font-mono text-slate-400 mt-0.5">{hh.registrationDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
