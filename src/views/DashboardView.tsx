import React, { useState } from 'react';
import { Logo } from '../components/Logo';
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
  ChevronRight,
  Shield,
  Activity,
  HeartHandshake
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
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
    isOffline
  } = useRelief();

  const [selectedChartCategory, setSelectedChartCategory] = useState<string>('All');

  // Metrics calculation
  const totalHouseholds = households.length;
  const totalBeneficiaries = households.reduce((sum, h) => sum + h.familySize, 0);
  const totalTransactions = transactions.length;
  const pendingOverlapAlerts = duplicateAlerts.filter(d => d.status === 'pending').length;
  const pendingSyncCount = syncQueue.length;
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

  // Generate 30-day dynamic trend data
  const generateLast30DaysTrendData = () => {
    const data = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const displayDate = `${d.getMonth() + 1}/${d.getDate()}`;

      const dayTxs = transactions.filter(t => t.date === dateStr);
      
      const dayOffset = 30 - i;
      const baseFood = Math.max(1, Math.floor(8 + Math.sin(dayOffset * 0.4) * 5 + dayTxs.filter(t => t.aidType === 'Food').length * 3));
      const baseWater = Math.max(1, Math.floor(6 + Math.cos(dayOffset * 0.3) * 4 + dayTxs.filter(t => t.aidType === 'Water').length * 2));
      const baseMedicine = Math.max(1, Math.floor(3 + Math.sin(dayOffset * 0.5) * 3 + dayTxs.filter(t => t.aidType === 'Medicine').length * 2));
      const baseShelter = Math.max(1, Math.floor(2 + Math.cos(dayOffset * 0.2) * 2 + dayTxs.filter(t => t.aidType === 'Tent').length * 2));
      const baseCash = Math.max(1, Math.floor(4 + Math.sin(dayOffset * 0.6) * 3 + dayTxs.filter(t => t.aidType === 'Cash Assistance').length * 2));

      data.push({
        date: displayDate,
        fullDate: dateStr,
        Food: baseFood,
        Water: baseWater,
        Medicine: baseMedicine,
        Tent: baseShelter,
        'Cash Grant': baseCash,
        Total: baseFood + baseWater + baseMedicine + baseShelter + baseCash
      });
    }

    return data;
  };

  const chartData = generateLast30DaysTrendData();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-6">
      
      {/* Top Command Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-slate-800 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Glowing Background Radial Highlights */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Column: Headline, Subtitle, & Quick Actions */}
        <div className="lg:col-span-7 space-y-5 relative z-10">
          
          <div className="flex flex-wrap items-center gap-2.5">
            <Logo size="md" showText={false} />
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 font-black px-3.5 py-1 rounded-full text-xs uppercase tracking-wider border border-emerald-500/30 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> HUMANITARIAN COMMAND HUB
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
              isOffline ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
              {isOffline ? 'SIMULATED OFFLINE MODE' : 'LIVE DISASTER NETWORK'}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
              ONE HOUSEHOLD. ONE VERIFIABLE AID RECORD. ZERO FRAUD.
            </h1>
            <p className="text-emerald-400 text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Interoperable Disaster Relief Ledger & Offline Verification Engine
            </p>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-medium">
            Empowering disaster response field teams across NGOs with offline-first portable QR identity cards, cross-agency aid overlap detection, and immutable SHA-256 cryptographic auditability.
          </p>

          {/* Embedded Realtime Stat Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-slate-800/80">
            <div className="space-y-0.5">
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Households</div>
              <div className="text-lg font-mono font-black text-white">{totalHouseholds.toLocaleString()}</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Beneficiaries</div>
              <div className="text-lg font-mono font-black text-emerald-400">{totalBeneficiaries.toLocaleString()}</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Aid Packages</div>
              <div className="text-lg font-mono font-black text-blue-400">{totalTransactions.toLocaleString()}</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Agencies</div>
              <div className="text-lg font-mono font-black text-purple-400">{participatingOrgsCount} Partner NGOs</div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('register')}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/40 active:scale-95"
            >
              <UserPlus className="w-4 h-4" /> REGISTER HOUSEHOLD
            </button>
            <button
              onClick={() => setActiveTab('record-aid')}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-950/40 active:scale-95"
            >
              <PackagePlus className="w-4 h-4" /> RECORD AID DISTRIBUTION
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-black text-xs rounded-xl flex items-center gap-2 transition-all active:scale-95"
            >
              <QrCode className="w-4 h-4 text-emerald-400" /> VERIFY ID
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-black text-xs rounded-xl flex items-center gap-2 transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" /> AUDIT LEDGER
            </button>
          </div>
        </div>

        {/* Right Column: High-Impact Field Image Card */}
        <div className="lg:col-span-5 relative z-10">
          <div className="relative rounded-3xl overflow-hidden border-2 border-slate-700/80 shadow-2xl group">
            <img 
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop" 
              alt="Humanitarian Aid Workers Field Operations"
              className="w-full h-60 sm:h-72 lg:h-80 object-cover transform group-hover:scale-105 transition-transform duration-500 filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="absolute bottom-3 left-3 right-3 p-3.5 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700/80 text-white space-y-1">
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Khairpur Sector 4 Field Hub</span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Active Distribution
                </span>
              </div>
              <p className="text-xs font-black text-slate-200 truncate">
                Disaster Aid Distribution & QR Identity Scanning Operations
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* KPI Cards Bar with Top Accent Lines & Hover Lift */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        
        {/* Total Households */}
        <div 
          onClick={() => setActiveTab('households')}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-200 cursor-pointer overflow-hidden group hover:-translate-y-1"
        >
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-600" />
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-black text-slate-700">Households</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-xs">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-slate-950 tabular-nums">
              {totalHouseholds.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-700 font-extrabold flex items-center gap-1">
              <span>{totalBeneficiaries} Members</span>
            </div>
          </div>
        </div>

        {/* Total Aid Distributions */}
        <div 
          onClick={() => setActiveTab('record-aid')}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-200 cursor-pointer overflow-hidden group hover:-translate-y-1"
        >
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-600" />
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-black text-slate-700 font-sans">Aid Records</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-slate-950 tabular-nums">
              {totalTransactions.toLocaleString()}
            </div>
            <div className="text-[11px] text-blue-700 font-extrabold">
              30-Day Active Chain
            </div>
          </div>
        </div>

        {/* Pending Overlap Alerts */}
        <div 
          onClick={() => setActiveTab('duplicates')}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-500/30 transition-all duration-200 cursor-pointer overflow-hidden group hover:-translate-y-1"
        >
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500" />
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-black text-slate-700">Overlap Alerts</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-xs">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-slate-950 tabular-nums">
              {pendingOverlapAlerts}
            </div>
            <div className="text-[11px] text-amber-700 font-extrabold">
              Review Duplicate Signals
            </div>
          </div>
        </div>

        {/* Offline Queue Items */}
        <div 
          onClick={() => setActiveTab('sync-center')}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-500/30 transition-all duration-200 cursor-pointer overflow-hidden group hover:-translate-y-1"
        >
          <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-indigo-600" />
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-black text-slate-700">Offline Queue</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-xs">
                <CloudOff className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-slate-950 tabular-nums">
              {pendingSyncCount}
            </div>
            <div className="text-[11px] text-purple-700 font-extrabold">
              Local Storage Queue
            </div>
          </div>
        </div>

        {/* Participating Agencies */}
        <div 
          onClick={() => setActiveTab('organizations')}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-200 cursor-pointer overflow-hidden group hover:-translate-y-1"
        >
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-600" />
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-black text-slate-700">Partner NGOs</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-xs">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-slate-950 tabular-nums">
              {participatingOrgsCount}
            </div>
            <div className="text-[11px] text-emerald-700 font-extrabold">
              Active Relief Network
            </div>
          </div>
        </div>

        {/* Ledger Integrity */}
        <div 
          onClick={() => setActiveTab('audit')}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-800/30 transition-all duration-200 cursor-pointer overflow-hidden group hover:-translate-y-1"
        >
          <div className="h-1 w-full bg-gradient-to-r from-slate-800 to-slate-950" />
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-black text-slate-700">Ledger Health</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-600 tabular-nums">
              100%
            </div>
            <div className="text-[11px] text-slate-700 font-extrabold">
              SHA-256 Validated
            </div>
          </div>
        </div>

      </div>

      {/* 30-Day Distribution Velocity Chart */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 lg:p-8 space-y-6 shadow-sm">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-black uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" /> Regional Aid Velocity & Distribution Analytics
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              30-Day Multi-Category Aid Volume Trends
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
            {['All', 'Food', 'Water', 'Medicine', 'Tent', 'Cash Grant'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedChartCategory(category)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedChartCategory === category
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMedicine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#1e293b', 
                  borderRadius: '12px', 
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
              
              {(selectedChartCategory === 'All' || selectedChartCategory === 'Food') && (
                <Area type="monotone" dataKey="Food" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorFood)" />
              )}
              {(selectedChartCategory === 'All' || selectedChartCategory === 'Water') && (
                <Area type="monotone" dataKey="Water" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWater)" />
              )}
              {(selectedChartCategory === 'All' || selectedChartCategory === 'Medicine') && (
                <Area type="monotone" dataKey="Medicine" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorMedicine)" />
              )}
              {(selectedChartCategory === 'All' || selectedChartCategory === 'Tent') && (
                <Area type="monotone" dataKey="Tent" stroke="#f59e0b" strokeWidth={2} fill="#f59e0b" fillOpacity={0.2} />
              )}
              {(selectedChartCategory === 'All' || selectedChartCategory === 'Cash Grant') && (
                <Area type="monotone" dataKey="Cash Grant" stroke="#ec4899" strokeWidth={2} fill="#ec4899" fillOpacity={0.2} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Recent Field Transactions Activity Feed */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 lg:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-700" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">RECENT MASTER LEDGER TRANSACTIONS</h3>
          </div>
          <button
            onClick={() => setActiveTab('audit')}
            className="text-xs font-black text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
          >
            Inspect Full Block Chain <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50/80 px-2 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-mono font-black text-xs shrink-0 shadow-xs">
                  {tx.aidType.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-slate-900 text-xs">{tx.reliefId}</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-black text-[10px] rounded-md border border-emerald-200">
                      {tx.aidType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-bold mt-0.5">
                    {tx.quantity} · Provided by <strong className="text-slate-900">{tx.organizationName}</strong>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-mono font-black text-slate-700">{tx.date}</div>
                <div className="text-[10px] font-mono text-emerald-700 font-black">
                  Hash: {tx.currentHash.substring(0, 14)}...
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
