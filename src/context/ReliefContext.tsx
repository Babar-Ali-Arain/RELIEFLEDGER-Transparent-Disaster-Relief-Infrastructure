import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Household, 
  AidTransaction, 
  Organization, 
  Worker, 
  SyncQueueItem, 
  DuplicateAlert, 
  AuditLogEntry, 
  ActiveTab,
  AidCategory,
  UserRole
} from '../types';
import { reliefService } from '../services/reliefService';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
}

interface ReliefContextType {
  // Auth state
  isAuthenticated: boolean;
  isMfaVerified: boolean;
  currentUser: Worker | null;
  login: (email: string, pass: string) => boolean;
  verifyMfa: (code: string) => boolean;
  logout: () => void;
  quickDemoLogin: (role?: UserRole) => void;

  // App navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedReliefId: string;
  setSelectedReliefId: (id: string) => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  toggleOfflineMode: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
  
  // Data lists
  households: Household[];
  transactions: AidTransaction[];
  organizations: Organization[];
  workers: Worker[];
  syncQueue: SyncQueueItem[];
  duplicateAlerts: DuplicateAlert[];
  auditLogs: AuditLogEntry[];
  
  // Role & worker actions
  setCurrentUser: (worker: Worker) => void;
  currentWorker: Worker;
  setCurrentWorker: (worker: Worker) => void;

  // Actions
  refreshData: () => void;
  registerHousehold: (data: Omit<Household, 'id' | 'reliefId' | 'registrationDate' | 'status'>) => Household;
  recordAid: (data: {
    reliefId: string;
    organizationId: string;
    organizationName: string;
    workerId: string;
    workerName: string;
    aidType: AidCategory;
    quantity: string;
    date: string;
    location: string;
    notes?: string;
  }) => Promise<AidTransaction>;
  checkOverlap: (reliefId: string, aidType: AidCategory) => { hasOverlap: boolean; recentTransaction?: AidTransaction; daysAgo?: number };
  syncQueueNow: () => Promise<void>;
  verifyLedgerChain: () => Promise<{ isValid: boolean; tamperedIndex?: number; totalVerified: number; message: string }>;
  tamperTxDemo: (txId: string) => void;
  resetDemoData: () => void;
  resolveDuplicate: (alertId: string, action: 'confirmed_same' | 'rejected_different' | 'merged') => void;

  // Toast notifications
  toast: Toast | null;
  showToast: (type: Toast['type'], title: string, description?: string) => void;
  clearToast: () => void;

  // Quick Judge Demo Step Executor
  triggerDemoStep: (stepNumber: number) => void;
}

const ReliefContext = createContext<ReliefContextType | undefined>(undefined);

export const ReliefProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Default logged in for smooth preview, with full login/MFA pages accessible
  const [isMfaVerified, setIsMfaVerified] = useState<boolean>(true);
  
  // App navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedReliefId, setSelectedReliefId] = useState<string>('RL-KHP-7F3A92');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Loaded state
  const [households, setHouseholds] = useState<Household[]>([]);
  const [transactions, setTransactions] = useState<AidTransaction[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const [duplicateAlerts, setDuplicateAlerts] = useState<DuplicateAlert[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Current logged in worker
  const [currentUser, setCurrentUser] = useState<Worker | null>(null);

  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (type: Toast['type'], title: string, description?: string) => {
    const id = `t-${Date.now()}`;
    setToast({ id, type, title, description });
  };

  const clearToast = () => setToast(null);

  const refreshData = () => {
    const loadedHouseholds = reliefService.getHouseholds();
    const loadedTx = reliefService.getTransactions();
    const loadedOrgs = reliefService.getOrganizations();
    const loadedWorkers = reliefService.getWorkers();
    const loadedQueue = reliefService.getSyncQueue();
    const loadedDups = reliefService.getDuplicateAlerts();
    const loadedLogs = reliefService.getAuditLogs();

    setHouseholds(loadedHouseholds);
    setTransactions(loadedTx);
    setOrganizations(loadedOrgs);
    setWorkers(loadedWorkers);
    setSyncQueue(loadedQueue);
    setDuplicateAlerts(loadedDups);
    setAuditLogs(loadedLogs);

    if (!currentUser && loadedWorkers.length > 0) {
      setCurrentUser(loadedWorkers[0]);
    }
  };

  useEffect(() => {
    refreshData();

    // Listen to network online/offline
    const handleOnline = () => {
      setIsOffline(false);
      showToast('info', 'Network Restored', 'Device connected. Ready to sync offline records.');
    };
    const handleOffline = () => {
      setIsOffline(true);
      showToast('warning', 'Offline Mode Engaged', 'Transactions will be stored locally in the sync queue.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Authentication methods
  const login = (email: string, pass: string): boolean => {
    const foundWorker = workers.find(w => w.email.toLowerCase() === email.toLowerCase()) || workers[0];
    if (foundWorker) {
      setCurrentUser(foundWorker);
      setIsAuthenticated(true);
      setIsMfaVerified(false); // Move to MFA screen
      return true;
    }
    return false;
  };

  const verifyMfa = (code: string): boolean => {
    if (code === '123456' || code.length === 6) {
      setIsMfaVerified(true);
      setActiveTab('dashboard');
      showToast('success', 'Identity Verified', `Welcome back, ${currentUser?.name || 'Field Worker'}`);
      return true;
    }
    showToast('error', 'Invalid OTP Code', 'Demo MFA code is 123456.');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsMfaVerified(false);
    showToast('info', 'Logged Out', 'Your session has been securely ended.');
  };

  const quickDemoLogin = (role: UserRole = 'Field Worker') => {
    const target = workers.find(w => w.role === role) || workers[0];
    if (target) {
      setCurrentUser(target);
      setIsAuthenticated(true);
      setIsMfaVerified(true);
      setActiveTab('dashboard');
      showToast('success', 'Identity Switched', `Active User: ${target.name} (${target.role})`);
    }
  };

  const toggleOfflineMode = () => {
    const nextState = !isOffline;
    setIsOffline(nextState);
    if (nextState) {
      showToast('warning', 'SIMULATED OFFLINE MODE', 'Local storage active. New transactions will enter the sync queue.');
    } else {
      showToast('success', 'CONNECTION RESTORED', 'Network connected. Ready to synchronize offline queue.');
    }
  };

  const registerHousehold = (data: Omit<Household, 'id' | 'reliefId' | 'registrationDate' | 'status'>): Household => {
    const result = reliefService.registerHousehold(data, isOffline);
    refreshData();
    if (result.syncQueued) {
      showToast('warning', 'Saved Offline', `Household registered in offline queue (${result.household.reliefId}).`);
    } else {
      showToast('success', 'Household Registered', `Generated Relief ID: ${result.household.reliefId}`);
    }
    setSelectedReliefId(result.household.reliefId);
    return result.household;
  };

  const recordAid = async (data: {
    reliefId: string;
    organizationId: string;
    organizationName: string;
    workerId: string;
    workerName: string;
    aidType: AidCategory;
    quantity: string;
    date: string;
    location: string;
    notes?: string;
  }): Promise<AidTransaction> => {
    const result = await reliefService.recordAid(data, isOffline);
    refreshData();
    if (result.syncQueued) {
      showToast('warning', 'Aid Queued Offline', `${data.aidType} saved to sync queue. Hash computed.`);
    } else {
      showToast('success', 'Aid Recorded', `${data.aidType} logged with SHA-256 block hash.`);
    }
    return result.transaction;
  };

  const checkOverlap = (reliefId: string, aidType: AidCategory) => {
    return reliefService.checkPotentialOverlap(reliefId, aidType);
  };

  const syncQueueNow = async () => {
    const res = await reliefService.syncOfflineQueue();
    refreshData();
    if (res.syncedCount > 0) {
      showToast('success', 'Sync Complete', res.message);
    } else {
      showToast('info', 'Queue Empty', 'All records are synchronized.');
    }
  };

  const verifyLedgerChain = async () => {
    const result = await reliefService.verifyLedger();
    refreshData();
    if (result.isValid) {
      showToast('success', 'Ledger Integrity Verified', result.message);
    } else {
      showToast('error', 'TAMPER DETECTED', result.message);
    }
    return result;
  };

  const tamperTxDemo = (txId: string) => {
    reliefService.tamperTransactionForDemo(txId);
    refreshData();
    showToast('error', 'Demo Tamper Executed', `Modified transaction ${txId}. Run Ledger Verification to detect!`);
  };

  const resetDemoData = () => {
    reliefService.resetDemoData();
    refreshData();
    setSelectedReliefId('RL-KHP-7F3A92');
    setIsOffline(false);
    showToast('info', 'Demo Data Reset', 'Restored initial pristine ledger state.');
  };

  const resolveDuplicate = (alertId: string, action: 'confirmed_same' | 'rejected_different' | 'merged') => {
    reliefService.resolveDuplicateAlert(alertId, action);
    refreshData();
    showToast('success', 'Duplicate Resolved', `Action recorded: ${action}`);
  };

  // Fast Judge Demo Stepper Trigger
  const triggerDemoStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: // Login & MFA Demo
        setIsAuthenticated(true);
        setIsMfaVerified(false);
        break;
      case 2: // Dashboard
        setIsAuthenticated(true);
        setIsMfaVerified(true);
        setActiveTab('dashboard');
        break;
      case 3: // Register Household
        setIsAuthenticated(true);
        setIsMfaVerified(true);
        setActiveTab('register');
        break;
      case 4: // Household Profile
        setIsAuthenticated(true);
        setIsMfaVerified(true);
        setSelectedReliefId('RL-KHP-7F3A92');
        setActiveTab('profile');
        break;
      case 5: // Record Aid
        setIsAuthenticated(true);
        setIsMfaVerified(true);
        setSelectedReliefId('RL-KHP-7F3A92');
        setActiveTab('record-aid');
        break;
      case 6: // Overlap test
        setIsAuthenticated(true);
        setIsMfaVerified(true);
        quickDemoLogin('Admin');
        setSelectedReliefId('RL-KHP-7F3A92');
        setActiveTab('record-aid');
        showToast('warning', 'Overlap Demo', 'Try recording Food for RL-KHP-7F3A92 to trigger the Overlap Warning!');
        break;
      case 7: // Simulate Offline Mode
        setIsAuthenticated(true);
        setIsMfaVerified(true);
        setIsOffline(true);
        setActiveTab('record-aid');
        showToast('warning', 'Offline Mode Engaged', 'Record aid now while offline.');
        break;
      case 8: // Sync Center
        setIsAuthenticated(true);
        setIsMfaVerified(true);
        setActiveTab('sync-center');
        break;
      case 9: // Restore & Sync
        setIsAuthenticated(true);
        setIsMfaVerified(true);
        setIsOffline(false);
        syncQueueNow();
        break;
      case 10: // Audit Ledger
        setIsAuthenticated(true);
        setIsMfaVerified(true);
        setActiveTab('audit');
        break;
      case 11: // Public Verify
        setIsAuthenticated(true);
        setIsMfaVerified(true);
        setActiveTab('verify');
        break;
      default:
        setActiveTab('dashboard');
    }
  };

  return (
    <ReliefContext.Provider
      value={{
        isAuthenticated,
        isMfaVerified,
        currentUser: currentUser || workers[0] || null,
        login,
        verifyMfa,
        logout,
        quickDemoLogin,
        activeTab,
        setActiveTab,
        selectedReliefId,
        setSelectedReliefId,
        isOffline,
        setIsOffline,
        toggleOfflineMode,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        households,
        transactions,
        organizations,
        workers,
        syncQueue,
        duplicateAlerts,
        auditLogs,
        setCurrentUser,
        currentWorker: currentUser || workers[0],
        setCurrentWorker: setCurrentUser,
        refreshData,
        registerHousehold,
        recordAid,
        checkOverlap,
        syncQueueNow,
        verifyLedgerChain,
        tamperTxDemo,
        resetDemoData,
        resolveDuplicate,
        toast,
        showToast,
        clearToast,
        triggerDemoStep
      }}
    >
      {children}
    </ReliefContext.Provider>
  );
};

export const useRelief = () => {
  const context = useContext(ReliefContext);
  if (!context) {
    throw new Error('useRelief must be used within a ReliefProvider');
  }
  return context;
};
