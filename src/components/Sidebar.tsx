import React, { useState } from 'react';
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
  X,
  ChevronLeft,
  ChevronRight,
  HardHat,
  Layers,
  Shield,
  Globe2
} from 'lucide-react';
import { useRelief } from '../context/ReliefContext';
import { ActiveTab } from '../types';
import { Logo } from './Logo';

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

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Grouped Navigation Structure
  const navGroups: {
    title: string;
    icon: React.ReactNode;
    items: {
      id: ActiveTab;
      label: string;
      icon: React.ReactNode;
      badge?: number;
      badgeColor?: string;
    }[];
  }[] = [
    {
      title: 'OPERATIONS',
      icon: <Layers className="w-3 h-3 text-emerald-400" />,
      items: [
        { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'households', label: 'Households', icon: <Users className="w-4 h-4" /> },
        { id: 'record-aid', label: 'Aid Distribution', icon: <PackagePlus className="w-4 h-4" /> },
        { 
          id: 'sync-center', 
          label: 'Offline Sync', 
          icon: <CloudOff className="w-4 h-4" />,
          badge: syncQueue.length > 0 ? syncQueue.length : undefined,
          badgeColor: 'bg-emerald-500 text-slate-950 font-black'
        }
      ]
    },
    {
      title: 'INTEGRITY & AUDIT',
      icon: <Shield className="w-3 h-3 text-emerald-400" />,
      items: [
        { id: 'verify', label: 'Public Verification', icon: <QrCode className="w-4 h-4" /> },
        { id: 'audit', label: 'Audit Ledger', icon: <ShieldCheck className="w-4 h-4" /> },
        { 
          id: 'duplicates', 
          label: 'Overlap Alerts', 
          icon: <CopyCheck className="w-4 h-4" />,
          badge: duplicateAlerts.filter(d => d.status === 'pending').length || undefined,
          badgeColor: 'bg-amber-400 text-slate-950 font-black'
        }
      ]
    },
    {
      title: 'NETWORK',
      icon: <Globe2 className="w-3 h-3 text-emerald-400" />,
      items: [
        { id: 'organizations', label: 'Organizations', icon: <Building2 className="w-4 h-4" /> },
        { id: 'workers', label: 'Field Workers', icon: <HardHat className="w-4 h-4" /> },
        { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
      ]
    }
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const renderSidebarNav = (collapsed: boolean) => (
    <div className="flex flex-col h-full select-none overflow-hidden bg-slate-900">
      
      {/* 1. FIXED TOP HEADER (Non-scrolling, shrink-0) */}
      <div className="p-3 pb-2.5 border-b border-slate-800/80 shrink-0 bg-slate-900 flex items-center justify-between">
        {!collapsed ? (
          <Logo size="sm" showText={true} />
        ) : (
          <Logo size="sm" showText={false} className="mx-auto" />
        )}

        {/* Desktop Expand/Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all shrink-0"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. MIDDLE SCROLLABLE MENU (The ONLY scrollable section inside the sidebar) */}
      <div className="px-2.5 sm:px-3 py-3 space-y-3 overflow-y-auto flex-1 min-h-0 custom-scrollbar pr-1">
        <div className="space-y-3">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {!collapsed ? (
                <div className="text-[10px] font-black text-slate-400 tracking-widest px-2 py-0.5 flex items-center gap-1.5 uppercase">
                  {group.icon}
                  <span>{group.title}</span>
                </div>
              ) : (
                <div className="h-px bg-slate-800/80 my-2 mx-1" />
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex items-center ${collapsed ? 'justify-center py-2.5' : 'justify-between px-3 py-2'} rounded-xl text-xs font-extrabold transition-all relative group ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-950/40'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      {/* Left Glowing Accent Line for Active State */}
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-400 rounded-r-full shadow-xs" />
                      )}

                      <div className="flex items-center gap-2.5 truncate">
                        <div className={`shrink-0 transition-transform duration-150 ${isActive ? 'text-white scale-110' : 'text-slate-400 group-hover:text-emerald-400'}`}>
                          {item.icon}
                        </div>
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!collapsed && item.badge !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] shrink-0 font-black shadow-xs ${item.badgeColor || 'bg-amber-400 text-slate-950'}`}>
                          {item.badge}
                        </span>
                      )}

                      {collapsed && item.badge !== undefined && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-slate-900 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. FIXED BOTTOM FOOTER (Non-scrolling, shrink-0, completely locked at bottom) */}
      <div className={`shrink-0 bg-slate-950 border-t border-slate-800/90 p-3 sm:p-3.5 space-y-2.5 shadow-2xl ${collapsed ? 'text-center' : ''}`}>
        
        {/* Live Network / Offline Mode Toggle */}
        <button
          onClick={toggleOfflineMode}
          title={isOffline ? 'Click to Restore Online Mode' : 'Click to Simulate Offline Mode'}
          className={`w-full flex items-center ${collapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'} rounded-xl text-xs font-black border transition-all ${
            isOffline
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
          }`}
        >
          {!collapsed ? (
            <>
              <div className="flex items-center gap-2 truncate">
                <span className={`w-2 h-2 rounded-full shrink-0 ${isOffline ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                <span className="truncate">{isOffline ? 'Simulated Offline' : 'Live Network'}</span>
              </div>
              {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            </>
          ) : (
            isOffline ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />
          )}
        </button>

        {/* Worker Profile Card with Embedded Sign Out Button */}
        {!collapsed ? (
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-2.5 flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs ring-1 ring-white/10">
                {currentUser?.name.charAt(0) || 'Z'}
              </div>
              <div className="truncate">
                <div className="text-xs font-black text-white leading-tight truncate">
                  {currentUser?.name || 'Zubair Ahmed'}
                </div>
                <div className="text-[10px] text-emerald-400 font-extrabold leading-tight truncate mt-0.5">
                  {currentUser?.role || 'Field Lead'} · {currentUser?.organizationName || 'Al-Khidmat'}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-all shrink-0 flex items-center gap-1 font-extrabold text-[11px]"
              title="Sign Out of Account"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="w-full flex items-center justify-center p-2.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}

      </div>
    </div>
  );

  return (
    <>
      {/* Vertically Responsive Desktop Sidebar */}
      <aside className={`hidden md:flex h-full max-h-full ${isCollapsed ? 'w-20' : 'w-60 lg:w-64'} bg-slate-900 text-slate-300 shrink-0 border-r border-slate-800 flex-col transition-all duration-200 ease-in-out z-20 shadow-xl overflow-hidden`}>
        {renderSidebarNav(isCollapsed)}
      </aside>

      {/* Mobile Touch Slide-Over Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex">
          <div className="w-72 bg-slate-900 text-slate-300 h-dvh max-h-dvh border-r border-slate-800 shadow-2xl animate-in slide-in-from-left duration-200 overflow-hidden flex flex-col">
            {renderSidebarNav(false)}
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
