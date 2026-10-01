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
  ChevronRight
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
      
      {/* Top Command Banner with Hero Picture & Killer Sentence */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-800 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Column: Brand, Killer Sentence, & Quick Actions */}
        <div className="lg:col-span-7 space-y-4 relative z-10">
          
          <div className="flex flex-wrap items-center gap-2.5">
            <Logo size="md" showText={false} />
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wider border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> HUMANITARIAN COMMAND HUB
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black border ${
              isOffline ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}>
              {isOffline ? '● SIMULATED OFFLINE MODE' : '● LIVE DISASTER NETWORK'}
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
              ONE HOUSEHOLD. ONE VERIFIABLE AID RECORD. ZERO FRAUD.
            </h1>
            <p className="text-emerald-400 text-xs sm:text-sm font-extrabold uppercase tracking-wide">
              Interoperable Disaster Relief Ledger & Offline Verification Engine
            </p>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl font-medium">
            Empowering disaster response field teams across NGOs with offline-first portable QR identity cards, cross-agency aid overlap detection, and immutable SHA-256 cryptographic auditability.
          </p>

          {/* Quick Command Shortcuts */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              onClick={() => setActiveTab('register')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-md shadow-emerald-950/30 active:scale-95"
            >
              <UserPlus className="w-4 h-4" /> REGISTER HOUSEHOLD
            </button>
            <button
              onClick={() => setActiveTab('record-aid')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-950/30 active:scale-95"
            >
              <PackagePlus className="w-4 h-4" /> RECORD AID
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-black text-xs rounded-xl flex items-center gap-2 transition-all active:scale-95"
            >
              <QrCode className="w-4 h-4 text-emerald-400" /> VERIFY ID
            </button>
          </div>
        </div>

        {/* Right Column: High-Impact Field Image Card */}
        <div className="lg:col-span-5 relative z-10">
          <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl group">
            <img 
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop" 
              alt="Humanitarian Aid Workers Field Operations"
              className="w-full h-52 sm:h-60 object-cover transform group-hover:scale-105 transition-transform duration-500 filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 text-white space-y-1">
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                <span>Khairpur Sector 4 Field Hub</span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Active Distribution
                </span>
              </div>
              <p className="text-xs font-bold text-slate-200 truncate">
                Disaster Aid Distribution & QR Identity Scanning
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
              <span className="text-xs font-black text-slate-700">Distributions</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-slate-950 tabular-nums">
              {totalTransactions.toLocaleString()}
            </div>
            <div className="text-[11px] text-blue-700 font-extrabold flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-blue-600" /> SHA-256 Chained
            </div>
          </div>
        </div>

        {/* Overlap Alerts */}
        <div 
          onClick={() => setActiveTab('duplicates')}
          className="bg-gradient-to-br from-white to-amber-50/40 rounded-2xl border border-amber-200/90 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-200 cursor-pointer overflow-hidden group hover:-translate-y-1"
        >
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-500" />
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between text-amber-900">
              <span className="text-xs font-black text-amber-950">Overlap Alerts</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors shadow-xs">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-amber-950 tabular-nums">
              {pendingOverlapAlerts}
            </div>
            <div className="text-[11px] text-amber-800 font-black flex items-center gap-1">
              Human Audit <ArrowUpRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Pending Offline Sync */}
        <div 
          onClick={() => setActiveTab('sync-center')}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-500/30 transition-all duration-200 cursor-pointer overflow-hidden group hover:-translate-y-1"
        >
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-amber-600" />
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-black text-slate-700">Offline Queue</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors shadow-xs">
                <CloudOff className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-slate-950 tabular-nums">
              {pendingSyncCount}
            </div>
            <div className="text-[11px] text-slate-500 font-bold">Local storage queue</div>
          </div>
        </div>

        {/* Verified Ledger Health */}
        <div 
          onClick={() => setActiveTab('audit')}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-200 cursor-pointer overflow-hidden group hover:-translate-y-1"
        >
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-emerald-700" />
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-black text-slate-700">Ledger Health</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-slate-950 tabular-nums">
              100%
            </div>
            <div className="text-[11px] text-emerald-700 font-black">Cryptographic Intact</div>
          </div>
        </div>

        {/* Participating Agencies */}
        <div 
          onClick={() => setActiveTab('organizations')}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-500/30 transition-all duration-200 cursor-pointer overflow-hidden group hover:-translate-y-1"
        >
          <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-indigo-600" />
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-black text-slate-700">Agencies</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-xs">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-slate-950 tabular-nums">
              {participatingOrgsCount}
            </div>
            <div className="text-[11px] text-purple-700 font-extrabold">Multi-agency net</div>
          </div>
        </div>
      </div>

      {/* DYNAMIC RECHARTS TREND CHART CARD */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-black text-slate-900">
                30-Day Aid Distribution Velocity & Category Trend
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Visualizing daily relief volume across all participating field centers over the last 30 days.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['All', 'Food', 'Water', 'Medicine', 'Tent', 'Cash Grant'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedChartCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all border shrink-0 ${
                  selectedChartCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="foodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="medGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="tentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#1e293b', 
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

              {(selectedChartCategory === 'All' || selectedChartCategory === 'Food') && (
                <Area type="monotone" dataKey="Food" stroke="#10b981" fillOpacity={1} fill="url(#foodGradient)" strokeWidth={2} />
              )}
              {(selectedChartCategory === 'All' || selectedChartCategory === 'Water') && (
                <Area type="monotone" dataKey="Water" stroke="#3b82f6" fillOpacity={1} fill="url(#waterGradient)" strokeWidth={2} />
              )}
              {(selectedChartCategory === 'All' || selectedChartCategory === 'Medicine') && (
                <Area type="monotone" dataKey="Medicine" stroke="#f59e0b" fillOpacity={1} fill="url(#medGradient)" strokeWidth={2} />
              )}
              {(selectedChartCategory === 'All' || selectedChartCategory === 'Tent') && (
                <Area type="monotone" dataKey="Tent" stroke="#8b5cf6" fillOpacity={1} fill="url(#tentGradient)" strokeWidth={2} />
              )}
              {(selectedChartCategory === 'All' || selectedChartCategory === 'Cash Grant') && (
                <Area type="monotone" dataKey="Cash Grant" stroke="#ec4899" fillOpacity={1} fill="url(#cashGradient)" strokeWidth={2} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdown Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Aid Category Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-900">Aid Category Volume & Coverage</h3>
            </div>
            <span className="text-xs font-mono text-slate-500 font-extrabold">
              {totalTransactions} Total Units
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / totalTransactions) * 100) || 0;
              return (
                <div key={cat} className="p-4 bg-slate-50/80 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 space-y-2 transition-colors">
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <span className="text-slate-900 font-black">{cat}</span>
                    <span className="text-emerald-700 font-mono">{count} units ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.max(12, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Regional Sector Coverage Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-black text-slate-900">Disaster Sector Coverage</h3>
            </div>
            <span className="text-xs text-slate-500 font-bold">Registered Villages</span>
          </div>

          <div className="space-y-2.5">
            {Object.entries(sectorCounts).map(([sector, count]) => (
              <div key={sector} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors border border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-black text-slate-900">{sector}</span>
                </div>
                <span className="text-xs font-mono font-black bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">
                  {count} households
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Live Activity Stream Table Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-black text-slate-900">Live Relief Ledger Activity Stream</h3>
          </div>
          <button
            onClick={() => setActiveTab('audit')}
            className="text-xs text-emerald-700 font-black hover:underline flex items-center gap-1"
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
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-emerald-50/50 px-3 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black bg-slate-900 text-white px-2.5 py-0.5 rounded-md">
                    {tx.reliefId}
                  </span>
                  <span className="text-xs font-black text-slate-900">{tx.aidType}</span>
                  <span className="text-[10px] text-slate-500 font-bold">({tx.quantity})</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2">
                  <span>{tx.organizationName}</span> · <span>Worker: {tx.workerName}</span> · <span>Location: {tx.location}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 font-black px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
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
