import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  PackagePlus, 
  CloudOff, 
  QrCode, 
  ShieldCheck, 
  CopyCheck, 
  Building2, 
  Settings,
  LogOut,
  Wifi,
  WifiOff,
  X
} from 'lucide-react';
import { useRelief } from '../context/ReliefContext';
import { ActiveTab } from '../types';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    syncQueue, 
    duplicateAlerts, 
    currentUser, 
    isOffline, 
    toggleOfflineMode, 
    logout,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useRelief();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'households', label: 'Households', icon: <Users className="w-5 h-5" /> },
    { id: 'record-aid', label: 'Aid Distribution', icon: <PackagePlus className="w-5 h-5" /> },
    { 
      id: 'sync-center', 
      label: 'Sync Center', 
      icon: <CloudOff className="w-5 h-5" />,
      badge: syncQueue.length > 0 ? syncQueue.length : undefined 
    },
    { id: 'verify', label: 'Verification', icon: <QrCode className="w-5 h-5" /> },
    { id: 'audit', label: 'Audit Ledger', icon: <ShieldCheck className="w-5 h-5" /> },
    { 
      id: 'duplicates', 
      label: 'Duplicate Alerts', 
      icon: <CopyCheck className="w-5 h-5" />,
      badge: duplicateAlerts.filter(d => d.status === 'pending').length || undefined 
    },
    { id: 'organizations', label: 'Organizations', icon: <Building2 className="w-5 h-5" /> },
    { id: 'workers', label: 'Workers', icon: <Users className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="p-4 space-y-4">
        {/* Mobile Close Header */}
        <div className="md:hidden flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center font-extrabold text-white text-xs">
              RL
            </div>
            <span className="font-extrabold text-white text-sm tracking-wide">RELIEFLEDGER</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
          Navigation Directory
        </p>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-white text-emerald-900' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Connection & Worker Profile Footer */}
      <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950/60">
        
        {/* Connection Status Indicator */}
        <button
          onClick={toggleOfflineMode}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
            isOffline
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span>{isOffline ? '● Offline Mode' : '● Online'}</span>
          </div>
          {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
        </button>

        {/* Logged in Worker Profile */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-xs font-bold text-white leading-tight">
              {currentUser?.name || 'Zubair Ahmed'}
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              {currentUser?.role} · {currentUser?.organizationName}
            </div>
          </div>

          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 shrink-0 border-r border-slate-800 flex-col min-h-[calc(100vh-80px)]">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Overlay Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex">
          <div className="w-72 bg-slate-900 text-slate-300 h-full border-r border-slate-800 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
