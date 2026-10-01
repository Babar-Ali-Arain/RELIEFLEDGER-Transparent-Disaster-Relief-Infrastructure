export type VulnerabilityCategory = 
  | 'Displaced'
  | 'Elderly household'
  | 'Disability'
  | 'Children'
  | 'Pregnant member'
  | 'Severe economic hardship'
  | 'Other';

export type AidCategory = 
  | 'Food'
  | 'Water'
  | 'Medicine'
  | 'Tent'
  | 'Cash Assistance'
  | 'Clothing'
  | 'Hygiene Kit'
  | 'Other';

export interface Household {
  id: string;
  reliefId: string; // e.g. RL-KHP-7F3A92
  representativeName: string;
  familySize: number;
  currentLocation: string;
  previousLocations: string[];
  phone?: string;
  govDocumentRef?: string;
  vulnerability: VulnerabilityCategory[];
  notes?: string;
  registrationDate: string;
  registeredByOrgId: string;
  registeredByOrgName: string;
  status: 'Verified' | 'Pending Review' | 'Flagged';
}

export interface AidTransaction {
  id: string;
  reliefId: string;
  organizationId: string;
  organizationName: string;
  workerId: string;
  workerName: string;
  aidType: AidCategory;
  quantity: string;
  date: string; // YYYY-MM-DD or formatted timestamp
  location: string;
  notes?: string;
  previousHash: string;
  currentHash: string;
  syncStatus: 'synced' | 'pending';
  verificationStatus: 'verified' | 'unverified' | 'tampered';
}

export interface Organization {
  id: string;
  name: string;
  type: 'NGO' | 'Government' | 'Community' | 'International Agency';
  location: string;
  verifiedWorkersCount: number;
  totalAidDistributed: number;
}

export type UserRole = 'Admin' | 'Auditor' | 'Organization Manager' | 'Field Worker';

export interface Worker {
  id: string;
  workerCode: string; // FW-1028
  name: string;
  email: string;
  organizationId: string;
  organizationName: string;
  role: UserRole;
  status: 'Active' | 'Suspended';
  authMethod: 'Authenticator App' | 'SMS OTP' | 'Email OTP' | 'Hardware Key';
  mfaEnabled: boolean;
}

export interface SyncQueueItem {
  id: string;
  type: 'REGISTRATION' | 'AID_RECORD';
  timestamp: string;
  data: any;
  status: 'pending' | 'syncing' | 'failed';
  errorMessage?: string;
}

export interface DuplicateAlert {
  id: string;
  householdA: Household;
  householdB: Household;
  similarityScore: number;
  matchReasons: string[];
  status: 'pending' | 'confirmed_same' | 'rejected_different' | 'merged';
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: 'TRANSACTION_HASHED' | 'SYNC_EXECUTED' | 'DUPLICATE_REVIEWED' | 'HOUSEHOLD_REGISTERED' | 'LEDGER_AUDITED' | 'TAMPER_DETECTED' | 'WORKER_LOGIN';
  actorId: string;
  actorName: string;
  organizationName: string;
  reliefId?: string;
  details: string;
  hash: string;
}

export type ActiveTab = 
  | 'dashboard'
  | 'households'
  | 'register'
  | 'profile'
  | 'record-aid'
  | 'sync-center'
  | 'duplicates'
  | 'verify'
  | 'audit'
  | 'organizations'
  | 'workers'
  | 'settings';
