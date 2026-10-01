import React from 'react';
import { ReliefProvider, useRelief } from './context/ReliefContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { JudgeDemoBar } from './components/JudgeDemoBar';
import { ToastNotification } from './components/Toast';

import { LoginView } from './views/LoginView';
import { MfaView } from './views/MfaView';
import { DashboardView } from './views/DashboardView';
import { HouseholdsView } from './views/HouseholdsView';
import { RegisterHouseholdView } from './views/RegisterHouseholdView';
import { HouseholdProfileView } from './views/HouseholdProfileView';
import { RecordAidView } from './views/RecordAidView';
import { SyncQueueView } from './views/SyncQueueView';
import { VerifyReliefIdView } from './views/VerifyReliefIdView';
import { AuditLedgerView } from './views/AuditLedgerView';
import { DuplicateDetectionView } from './views/DuplicateDetectionView';
import { OrganizationsView } from './views/OrganizationsView';
import { WorkersView } from './views/WorkersView';
import { SettingsPrivacyView } from './views/SettingsPrivacyView';

const MainContent: React.FC = () => {
  const { isAuthenticated, isMfaVerified, activeTab } = useRelief();

  // Authentication routing gates
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans antialiased text-slate-900">
        <JudgeDemoBar />
        <LoginView />
        <ToastNotification />
      </div>
    );
  }

  if (!isMfaVerified) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans antialiased text-slate-900">
        <JudgeDemoBar />
        <MfaView />
        <ToastNotification />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'households':
        return <HouseholdsView />;
      case 'register':
        return <RegisterHouseholdView />;
      case 'profile':
        return <HouseholdProfileView />;
      case 'record-aid':
        return <RecordAidView />;
      case 'sync-center':
        return <SyncQueueView />;
      case 'verify':
        return <VerifyReliefIdView />;
      case 'audit':
        return <AuditLedgerView />;
      case 'duplicates':
        return <DuplicateDetectionView />;
      case 'organizations':
        return <OrganizationsView />;
      case 'workers':
        return <WorkersView />;
      case 'settings':
        return <SettingsPrivacyView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="h-screen max-h-screen w-full overflow-hidden flex flex-col bg-slate-50 font-sans antialiased text-slate-900">
      {/* Top 3-Minute Judge Guided Demo Control Bar */}
      <JudgeDemoBar />

      {/* Main Header with Top Bar Contract */}
      <Header />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col md:flex-row w-full min-h-0 overflow-hidden relative">
        <Sidebar />
        <main key={activeTab} className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto min-h-0 custom-scrollbar animate-fade-in pb-20 md:pb-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <MobileNav />

      {/* Global Toast Notification */}
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <ReliefProvider>
      <MainContent />
    </ReliefProvider>
  );
}
