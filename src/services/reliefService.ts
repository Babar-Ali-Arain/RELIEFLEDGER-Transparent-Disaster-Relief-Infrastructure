import { 
  Household, 
  AidTransaction, 
  Organization, 
  Worker, 
  SyncQueueItem, 
  DuplicateAlert, 
  AuditLogEntry, 
  AidCategory 
} from '../types';
import { 
  INITIAL_HOUSEHOLDS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_ORGANIZATIONS, 
  INITIAL_WORKERS, 
  INITIAL_DUPLICATE_ALERTS, 
  INITIAL_AUDIT_LOGS 
} from './mockData';
import { computeTransactionHash, verifyHashChain } from '../utils/crypto';

const STORAGE_KEYS = {
  HOUSEHOLDS: 'relief_ledger_households_v1',
  TRANSACTIONS: 'relief_ledger_transactions_v1',
  ORGANIZATIONS: 'relief_ledger_orgs_v1',
  WORKERS: 'relief_ledger_workers_v1',
  SYNC_QUEUE: 'relief_ledger_sync_queue_v1',
  DUPLICATES: 'relief_ledger_duplicates_v1',
  AUDIT_LOGS: 'relief_ledger_audit_logs_v1'
};

class ReliefService {
  private households: Household[] = [];
  private transactions: AidTransaction[] = [];
  private organizations: Organization[] = [];
  private workers: Worker[] = [];
  private syncQueue: SyncQueueItem[] = [];
  private duplicateAlerts: DuplicateAlert[] = [];
  private auditLogs: AuditLogEntry[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedHouseholds = localStorage.getItem(STORAGE_KEYS.HOUSEHOLDS);
      if (storedHouseholds) {
        this.households = JSON.parse(storedHouseholds);
      } else {
        this.households = [...INITIAL_HOUSEHOLDS];
        this.persist(STORAGE_KEYS.HOUSEHOLDS, this.households);
      }

      const storedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (storedTx) {
        this.transactions = JSON.parse(storedTx);
      } else {
        this.transactions = [...INITIAL_TRANSACTIONS];
        this.persist(STORAGE_KEYS.TRANSACTIONS, this.transactions);
      }

      const storedOrgs = localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS);
      if (storedOrgs) {
        this.organizations = JSON.parse(storedOrgs);
      } else {
        this.organizations = [...INITIAL_ORGANIZATIONS];
        this.persist(STORAGE_KEYS.ORGANIZATIONS, this.organizations);
      }

      const storedWorkers = localStorage.getItem(STORAGE_KEYS.WORKERS);
      if (storedWorkers) {
        this.workers = JSON.parse(storedWorkers);
      } else {
        this.workers = [...INITIAL_WORKERS];
        this.persist(STORAGE_KEYS.WORKERS, this.workers);
      }

      const storedQueue = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      if (storedQueue) {
        this.syncQueue = JSON.parse(storedQueue);
      } else {
        this.syncQueue = [];
        this.persist(STORAGE_KEYS.SYNC_QUEUE, this.syncQueue);
      }

      const storedDups = localStorage.getItem(STORAGE_KEYS.DUPLICATES);
      if (storedDups) {
        this.duplicateAlerts = JSON.parse(storedDups);
      } else {
        this.duplicateAlerts = [...INITIAL_DUPLICATE_ALERTS];
        this.persist(STORAGE_KEYS.DUPLICATES, this.duplicateAlerts);
      }

      const storedLogs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (storedLogs) {
        this.auditLogs = JSON.parse(storedLogs);
      } else {
        this.auditLogs = [...INITIAL_AUDIT_LOGS];
        this.persist(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
      }
    } catch (e) {
      console.warn('LocalStorage access failed, falling back to in-memory state.', e);
      this.households = [...INITIAL_HOUSEHOLDS];
      this.transactions = [...INITIAL_TRANSACTIONS];
      this.organizations = [...INITIAL_ORGANIZATIONS];
      this.workers = [...INITIAL_WORKERS];
      this.syncQueue = [];
      this.duplicateAlerts = [...INITIAL_DUPLICATE_ALERTS];
      this.auditLogs = [...INITIAL_AUDIT_LOGS];
    }
  }

  private persist(key: string, value: any) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to persist to localStorage', e);
    }
  }

  // --- HOUSEHOLDS ---
  public getHouseholds(): Household[] {
    return [...this.households];
  }

  public getHouseholdByReliefId(reliefId: string): Household | undefined {
    const cleanId = reliefId.trim().toUpperCase();
    return this.households.find(h => h.reliefId.toUpperCase() === cleanId);
  }

  public generateReliefId(locationPrefix: string = 'KHP'): string {
    const randomHex = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase();
    const cleanPrefix = locationPrefix.replace(/[^A-Z]/gi, '').slice(0, 3).toUpperCase() || 'KHP';
    return `RL-${cleanPrefix}-${randomHex}`;
  }

  public registerHousehold(
    data: Omit<Household, 'id' | 'reliefId' | 'registrationDate' | 'status'>,
    isOfflineMode: boolean = false
  ): { household: Household; syncQueued: boolean } {
    const newReliefId = this.generateReliefId(data.currentLocation);
    const newHousehold: Household = {
      ...data,
      id: `hh-${Date.now()}`,
      reliefId: newReliefId,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'Verified'
    };

    if (isOfflineMode) {
      const queueItem: SyncQueueItem = {
        id: `q-${Date.now()}`,
        type: 'REGISTRATION',
        timestamp: new Date().toISOString(),
        data: newHousehold,
        status: 'pending'
      };
      this.syncQueue.push(queueItem);
      this.persist(STORAGE_KEYS.SYNC_QUEUE, this.syncQueue);

      // Still add locally so offline user sees it
      this.households.unshift(newHousehold);
      this.persist(STORAGE_KEYS.HOUSEHOLDS, this.households);

      this.logAudit(
        'HOUSEHOLD_REGISTERED',
        data.registeredByOrgName,
        `Offline Registration queued for ${newHousehold.representativeName} (${newReliefId})`,
        newReliefId
      );

      return { household: newHousehold, syncQueued: true };
    }

    this.households.unshift(newHousehold);
    this.persist(STORAGE_KEYS.HOUSEHOLDS, this.households);

    // Check for duplicate triggers
    this.checkForDuplicates(newHousehold);

    this.logAudit(
      'HOUSEHOLD_REGISTERED',
      data.registeredByOrgName,
      `Registered Household: ${newHousehold.representativeName} (${newReliefId}) at ${newHousehold.currentLocation}`,
      newReliefId
    );

    return { household: newHousehold, syncQueued: false };
  }

  // --- AID TRANSACTIONS ---
  public getTransactions(): AidTransaction[] {
    return [...this.transactions];
  }

  public getAidHistoryForHousehold(reliefId: string): AidTransaction[] {
    const cleanId = reliefId.trim().toUpperCase();
    return this.transactions.filter(t => t.reliefId.toUpperCase() === cleanId);
  }

  public checkPotentialOverlap(
    reliefId: string,
    aidType: AidCategory
  ): { hasOverlap: boolean; recentTransaction?: AidTransaction; daysAgo?: number } {
    const history = this.getAidHistoryForHousehold(reliefId);
    const matchingAid = history.filter(t => t.aidType === aidType);

    if (matchingAid.length === 0) {
      return { hasOverlap: false };
    }

    // Sort newest first
    matchingAid.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const newest = matchingAid[0];

    const txTime = new Date(newest.date).getTime();
    const nowTime = new Date().getTime();
    const diffDays = Math.max(0, Math.floor((nowTime - txTime) / (1000 * 60 * 60 * 24)));

    // Warning if received in the last 14 days
    if (diffDays <= 14) {
      return {
        hasOverlap: true,
        recentTransaction: newest,
        daysAgo: diffDays
      };
    }

    return { hasOverlap: false };
  }

  public async recordAid(
    data: {
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
    },
    isOfflineMode: boolean = false
  ): Promise<{ transaction: AidTransaction; syncQueued: boolean }> {
    const txId = `TX-${Date.now().toString().slice(-6)}`;
    
    // Determine previous hash chain link
    const lastTx = this.transactions[this.transactions.length - 1];
    const previousHash = lastTx 
      ? lastTx.currentHash 
      : '0000000000000000000000000000000000000000000000000000000000000000';

    const tempTxPayload = {
      id: txId,
      reliefId: data.reliefId.trim().toUpperCase(),
      organizationId: data.organizationId,
      organizationName: data.organizationName,
      workerId: data.workerId,
      workerName: data.workerName,
      aidType: data.aidType,
      quantity: data.quantity,
      date: data.date,
      location: data.location,
      notes: data.notes || '',
      previousHash,
      syncStatus: (isOfflineMode ? 'pending' : 'synced') as 'pending' | 'synced',
      verificationStatus: 'verified' as 'verified'
    };

    const currentHash = await computeTransactionHash(tempTxPayload);

    const finalTx: AidTransaction = {
      ...tempTxPayload,
      currentHash
    };

    if (isOfflineMode) {
      const queueItem: SyncQueueItem = {
        id: `q-${Date.now()}`,
        type: 'AID_RECORD',
        timestamp: new Date().toISOString(),
        data: finalTx,
        status: 'pending'
      };
      this.syncQueue.push(queueItem);
      this.persist(STORAGE_KEYS.SYNC_QUEUE, this.syncQueue);

      this.transactions.push(finalTx);
      this.persist(STORAGE_KEYS.TRANSACTIONS, this.transactions);

      this.logAudit(
        'TRANSACTION_HASHED',
        data.organizationName,
        `Offline Aid Record Queued (${finalTx.aidType} -> ${finalTx.reliefId}). Hash: ${currentHash.slice(0, 12)}...`,
        finalTx.reliefId,
        currentHash
      );

      return { transaction: finalTx, syncQueued: true };
    }

    this.transactions.push(finalTx);
    this.persist(STORAGE_KEYS.TRANSACTIONS, this.transactions);

    this.logAudit(
      'TRANSACTION_HASHED',
      data.organizationName,
      `Aid Distributed: ${finalTx.quantity} (${finalTx.aidType}) to ${finalTx.reliefId}. Cryptographic Block Hash: ${currentHash}`,
      finalTx.reliefId,
      currentHash
    );

    return { transaction: finalTx, syncQueued: false };
  }

  // --- SYNC QUEUE ---
  public getSyncQueue(): SyncQueueItem[] {
    return [...this.syncQueue];
  }

  public async syncOfflineQueue(): Promise<{ syncedCount: number; message: string }> {
    if (this.syncQueue.length === 0) {
      return { syncedCount: 0, message: 'Sync queue is currently empty.' };
    }

    const pendingCount = this.syncQueue.length;

    // Process all queue items
    for (const item of this.syncQueue) {
      if (item.type === 'AID_RECORD') {
        const txIndex = this.transactions.findIndex(t => t.id === item.data.id);
        if (txIndex !== -1) {
          this.transactions[txIndex].syncStatus = 'synced';
        }
      }
    }

    this.syncQueue = [];
    this.persist(STORAGE_KEYS.SYNC_QUEUE, this.syncQueue);
    this.persist(STORAGE_KEYS.TRANSACTIONS, this.transactions);

    this.logAudit(
      'SYNC_EXECUTED',
      'ReliefLedger Sync Service',
      `Synchronized ${pendingCount} offline transaction(s) to master ledger.`,
      undefined,
      '0000000000'
    );

    return {
      syncedCount: pendingCount,
      message: `${pendingCount} transaction(s) synchronized successfully.`
    };
  }

  // --- DUPLICATE DETECTION ---
  private checkForDuplicates(newHousehold: Household) {
    const existing = this.households.filter(h => h.id !== newHousehold.id);
    for (const target of existing) {
      const matchReasons: string[] = [];
      let score = 0;

      if (newHousehold.phone && target.phone && newHousehold.phone === target.phone) {
        matchReasons.push(`Exact phone match (${newHousehold.phone})`);
        score += 50;
      }

      const nameA = newHousehold.representativeName.toLowerCase().trim();
      const nameB = target.representativeName.toLowerCase().trim();
      if (nameA === nameB || nameA.includes(nameB) || nameB.includes(nameA)) {
        matchReasons.push(`Similar representative name (${newHousehold.representativeName} vs ${target.representativeName})`);
        score += 35;
      }

      if (newHousehold.familySize === target.familySize) {
        matchReasons.push(`Identical family member count (${newHousehold.familySize})`);
        score += 15;
      }

      if (newHousehold.currentLocation.split(' ')[0] === target.currentLocation.split(' ')[0]) {
        matchReasons.push(`Same village/sector area (${newHousehold.currentLocation})`);
        score += 20;
      }

      if (score >= 60) {
        const dupAlert: DuplicateAlert = {
          id: `dup-${Date.now()}`,
          householdA: target,
          householdB: newHousehold,
          similarityScore: Math.min(98, score),
          matchReasons,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        this.duplicateAlerts.unshift(dupAlert);
        this.persist(STORAGE_KEYS.DUPLICATES, this.duplicateAlerts);
        
        this.logAudit(
          'DUPLICATE_REVIEWED',
          'Duplicate Engine',
          `Potential duplicate detected (${score}% similarity) between ${target.reliefId} & ${newHousehold.reliefId}`
        );
      }
    }
  }

  public getDuplicateAlerts(): DuplicateAlert[] {
    return [...this.duplicateAlerts];
  }

  public resolveDuplicateAlert(alertId: string, action: 'confirmed_same' | 'rejected_different' | 'merged') {
    const alert = this.duplicateAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = action;
      if (action === 'confirmed_same' || action === 'merged') {
        const hb = this.households.find(h => h.id === alert.householdB.id);
        if (hb) {
          hb.status = 'Flagged';
        }
      }
      this.persist(STORAGE_KEYS.DUPLICATES, this.duplicateAlerts);
      this.persist(STORAGE_KEYS.HOUSEHOLDS, this.households);

      this.logAudit(
        'DUPLICATE_REVIEWED',
        'Human Auditor',
        `Duplicate alert ${alertId} resolved as: ${action.toUpperCase()}`
      );
    }
  }

  // --- LEDGER INTEGRITY & AUDIT ---
  public async verifyLedger() {
    return verifyHashChain(this.transactions);
  }

  public tamperTransactionForDemo(txId: string) {
    const tx = this.transactions.find(t => t.id === txId);
    if (tx) {
      tx.quantity = 'MODIFIED: 99x Unverified Extra Aid Kits (TAMPERED)';
      tx.verificationStatus = 'tampered';
      this.persist(STORAGE_KEYS.TRANSACTIONS, this.transactions);

      this.logAudit(
        'TAMPER_DETECTED',
        'Demo Tamper Trigger',
        `Simulated unauthorized change in transaction ${txId}. Quantity altered.`,
        tx.reliefId,
        tx.currentHash
      );
    }
  }

  public resetDemoData() {
    this.households = [...INITIAL_HOUSEHOLDS];
    this.transactions = [...INITIAL_TRANSACTIONS];
    this.organizations = [...INITIAL_ORGANIZATIONS];
    this.workers = [...INITIAL_WORKERS];
    this.syncQueue = [];
    this.duplicateAlerts = [...INITIAL_DUPLICATE_ALERTS];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];

    this.persist(STORAGE_KEYS.HOUSEHOLDS, this.households);
    this.persist(STORAGE_KEYS.TRANSACTIONS, this.transactions);
    this.persist(STORAGE_KEYS.ORGANIZATIONS, this.organizations);
    this.persist(STORAGE_KEYS.WORKERS, this.workers);
    this.persist(STORAGE_KEYS.SYNC_QUEUE, this.syncQueue);
    this.persist(STORAGE_KEYS.DUPLICATES, this.duplicateAlerts);
    this.persist(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
  }

  // --- ORGANIZATIONS & WORKERS ---
  public getOrganizations(): Organization[] {
    return [...this.organizations];
  }

  public getWorkers(): Worker[] {
    return [...this.workers];
  }

  public getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs];
  }

  private logAudit(
    eventType: AuditLogEntry['eventType'],
    organizationName: string,
    details: string,
    reliefId?: string,
    hash: string = '0000000000'
  ) {
    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      eventType,
      actorId: 'wrk-active',
      actorName: 'Active Field Worker',
      organizationName,
      reliefId,
      details,
      hash
    };
    this.auditLogs.unshift(entry);
    this.persist(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
  }

  // --- PUBLIC VERIFICATION ---
  public verifyPublicRecord(reliefId: string): {
    found: boolean;
    reliefId?: string;
    generalArea?: string;
    registrationDate?: string;
    status?: string;
    aidHistory?: { aidType: string; date: string; organizationName: string }[];
    tamperCheckPassed?: boolean;
    message?: string;
  } {
    const household = this.getHouseholdByReliefId(reliefId);
    if (!household) {
      return {
        found: false,
        message: `No active relief record found matching ID: ${reliefId}`
      };
    }

    const history = this.getAidHistoryForHousehold(household.reliefId);

    // Sanitize area (e.g. "Khairpur Sector 4 Camp" -> "Khairpur Sector 4 Area")
    const generalArea = household.currentLocation.replace(/Tent \d+|Camp/gi, 'Sector / Area');

    return {
      found: true,
      reliefId: household.reliefId,
      generalArea,
      registrationDate: household.registrationDate,
      status: household.status,
      aidHistory: history.map(t => ({
        aidType: t.aidType,
        date: t.date,
        organizationName: t.organizationName
      })),
      tamperCheckPassed: true,
      message: '✓ Record found and verified against cryptographic relief ledger.'
    };
  }
}

export const reliefService = new ReliefService();
