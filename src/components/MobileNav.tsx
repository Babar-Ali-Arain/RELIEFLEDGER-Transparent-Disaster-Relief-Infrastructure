import React from 'react';
import { LayoutDashboard, Users, PackagePlus, CloudOff, Menu } from 'lucide-react';
import { useRelief } from '../context/ReliefContext';
import { ActiveTab } from '../types';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, syncQueue } = useRelief();

  const primaryMobileTabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'households', label: 'Households', icon: <Users className="w-5 h-5" /> },
    { id: 'record-aid', label: 'Record Aid', icon: <PackagePlus className="w-5 h-5" /> },
    { 
      id: 'sync-center', 
      label: 'Sync', 
      icon: <CloudOff className="w-5 h-5" />,
      badge: syncQueue.length > 0 ? syncQueue.length : undefined 
    },
    { id: 'audit', label: 'Audit', icon: <Menu className="w-5 h-5" /> }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 text-slate-300 py-1 px-2 shadow-lg">
      <div className="flex items-center justify-around">
        {primaryMobileTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-[10px] font-semibold transition-colors relative ${
                isActive ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span className="mt-0.5">{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
