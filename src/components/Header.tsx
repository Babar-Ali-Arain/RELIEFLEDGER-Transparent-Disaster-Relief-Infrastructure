import React, { useState } from 'react';
import { Wifi, WifiOff, ShieldCheck, Bell, ChevronDown, User, LogOut, Menu, X } from 'lucide-react';
import { useRelief } from '../context/ReliefContext';

export const Header: React.FC = () => {
  const { 
    isOffline, 
    toggleOfflineMode, 
    currentUser, 
    setCurrentUser, 
    workers, 
    syncQueue,
    activeTab,
    logout,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useRelief();

  const [isWorkerMenuOpen, setIsWorkerMenuOpen] = useState(false);

  const titles: Record<string, { title: string; desc: string }> = {
    dashboard: { title: 'Overview', desc: 'Monitor humanitarian assistance across participating organizations.' },
    households: { title: 'Households', desc: 'Manage portable household identities and relief records.' },
    register: { title: 'Register Household', desc: 'Issue verifiable portable Relief IDs and QR cards.' },
    profile: { title: 'Household Profile', desc: 'View verified distribution timeline and relief history.' },
    'record-aid': { title: 'Record Aid Distribution', desc: 'Commit distribution transactions to master hash chain.' },
    'sync-center': { title: 'Offline Sync Center', desc: 'Manage and batch-synchronize offline field transactions.' },
    duplicates: { title: 'Review Potential Duplicates', desc: 'Audit fuzzy signal matches and resolve duplicate registrations.' },
    verify: { title: 'Verify Relief Record', desc: 'Public privacy-safe record lookup and ledger audit.' },
    audit: { title: 'Audit Ledger', desc: 'Tamper-evident record of sequential aid transactions.' },
    organizations: { title: 'Organizations', desc: 'Interoperable multi-agency humanitarian relief network.' },
    workers: { title: 'Workers', desc: 'Authorized field personnel and multi-factor authentication directory.' },
    settings: { title: 'Settings & Governance', desc: 'System preferences, backup controls, and privacy settings.' }
  };

  const currentHeaderInfo = titles[activeTab] || { title: 'RELIEFLEDGER', desc: 'Transparent disaster relief infrastructure.' };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="px-4 lg:px-8 py-3 flex items-center justify-between gap-3">
        
        {/* Left: Mobile Menu Toggle & Brand / Title */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle Navigation Drawer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-lg shadow-xs shrink-0">
            RL
          </div>
          <div>
            <h1 className="text-base sm:text-lg lg:text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {currentHeaderInfo.title}
            </h1>
            <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
              {currentHeaderInfo.desc}
            </p>
          </div>
        </div>

        {/* Right Controls: Connection, Notifications, Profile Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Connection Status Badge */}
          <button
            onClick={toggleOfflineMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all border ${
              isOffline
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs animate-pulse'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
            title="Click to toggle simulated offline mode"
          >
            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            {isOffline ? (
              <span className="flex items-center gap-1 font-extrabold whitespace-nowrap">
                <WifiOff className="w-3.5 h-3.5" /> <span className="hidden xs:inline">OFFLINE</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 font-semibold whitespace-nowrap">
                <Wifi className="w-3.5 h-3.5" /> <span className="hidden xs:inline">ONLINE</span>
              </span>
            )}
          </button>

          {/* Active Worker Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsWorkerMenuOpen(!isWorkerMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-extrabold text-xs shrink-0">
                {currentUser?.name.charAt(0) || 'W'}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-extrabold text-slate-900 leading-tight truncate max-w-[120px]">
                  {currentUser?.name}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold leading-tight">
                  {currentUser?.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {/* Worker Identity Switcher Menu */}
            {isWorkerMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Role & Identity Switcher
                  </p>
                </div>

                <div className="max-h-64 overflow-y-auto py-1">
                  {workers.map((worker) => (
                    <button
                      key={worker.id}
                      onClick={() => {
                        setCurrentUser(worker);
                        setIsWorkerMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 hover:bg-slate-50 flex items-start gap-2.5 transition-colors ${
                        currentUser?.id === worker.id ? 'bg-emerald-50/70 border-l-2 border-emerald-600' : ''
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {worker.name} ({worker.workerCode})
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {worker.role} · {worker.organizationName}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-1 px-2">
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
