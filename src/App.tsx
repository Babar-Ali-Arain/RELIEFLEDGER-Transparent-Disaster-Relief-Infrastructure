import React from 'react';
import { ReliefProvider, useRelief } from './context/ReliefContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { JudgeDemoBar } from './components/JudgeDemoBar';
import { MobileNav } from './components/MobileNav';
import { ToastNotification } from './components/Toast';

// Views
import { DashboardView } from './views/DashboardView';
import { HouseholdsView } from './views/HouseholdsView';
import { RegisterHouseholdView } from './views/RegisterHouseholdView';
import { HouseholdProfileView } from './views/HouseholdProfileView';
import { RecordAidView } from './views/RecordAidView';
import { SyncQueueView } from './views/SyncQueueView';
import { DuplicateDetectionView } from './views/DuplicateDetectionView';
import { VerifyReliefIdView } from './views/VerifyReliefIdView';
import { AuditLedgerView } from './views/AuditLedgerView';
import { OrganizationsView } from './views/OrganizationsView';
import { WorkersView } from './views/WorkersView';
import { SettingsPrivacyView } from './views/SettingsPrivacyView';
import { LoginView } from './views/LoginView';

const MainContent: React.FC = () => {
  const { activeTab, currentUser } = useRelief();

  // If user is not authenticated, render auth views
  if (!currentUser) {
    return <LoginView />;
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
      case 'duplicates':
        return <DuplicateDetectionView />;
      case 'verify':
        return <VerifyReliefIdView />;
      case 'audit':
        return <AuditLedgerView />;
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
      <div className="flex-1 flex flex-col md:flex-row w-full min-h-0 overflow-hidden relative bg-slate-50">
        <Sidebar />
        <main key={activeTab} className="flex-1 p-4 md:p-8 w-full overflow-y-auto min-h-0 animate-fade-in pb-20 md:pb-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
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
