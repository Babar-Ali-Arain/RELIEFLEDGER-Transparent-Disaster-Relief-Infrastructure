import { Household, AidTransaction, Organization, Worker, DuplicateAlert, AuditLogEntry } from '../types';

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-hh-01',
    name: 'Helping Hands NGO',
    type: 'NGO',
    location: 'Khairpur Base Camp',
    verifiedWorkersCount: 18,
    totalAidDistributed: 642
  },
  {
    id: 'org-gov-02',
    name: 'Government Emergency Response',
    type: 'Government',
    location: 'Sindh Disaster Control Center',
    verifiedWorkersCount: 32,
    totalAidDistributed: 1842
  },
  {
    id: 'org-health-03',
    name: 'Community Health Network',
    type: 'NGO',
    location: 'District Hospital Wing B',
    verifiedWorkersCount: 11,
    totalAidDistributed: 421
  },
  {
    id: 'org-rel-04',
    name: 'Community Relief Network',
    type: 'Community',
    location: 'Sukkur Hub',
    verifiedWorkersCount: 15,
    totalAidDistributed: 937
  }
];

export const INITIAL_WORKERS: Worker[] = [
  {
    id: 'wrk-101',
    workerCode: 'FW-1028',
    name: 'Zubair Ahmed',
    email: 'fw1028@reliefledger.org',
    organizationId: 'org-hh-01',
    organizationName: 'Helping Hands NGO',
    role: 'Field Worker',
    status: 'Active',
    authMethod: 'Authenticator App',
    mfaEnabled: true
  },
  {
    id: 'wrk-102',
    workerCode: 'FW-1029',
    name: 'Captain Asif Khan',
    email: 'admin@reliefledger.org',
    organizationId: 'org-gov-02',
    organizationName: 'Government Emergency Response',
    role: 'Admin',
    status: 'Active',
    authMethod: 'Authenticator App',
    mfaEnabled: true
  },
  {
    id: 'wrk-103',
    workerCode: 'FW-1030',
    name: 'Mariam Rashid',
    email: 'manager@reliefledger.org',
    organizationId: 'org-hh-01',
    organizationName: 'Helping Hands NGO',
    role: 'Organization Manager',
    status: 'Active',
    authMethod: 'Email OTP',
    mfaEnabled: true
  },
  {
    id: 'wrk-104',
    workerCode: 'AUD-880',
    name: 'Dr. Sarah Lin',
    email: 'auditor@reliefledger.org',
    organizationId: 'org-health-03',
    organizationName: 'Community Health Network',
    role: 'Auditor',
    status: 'Active',
    authMethod: 'Authenticator App',
    mfaEnabled: true
  }
];

export const INITIAL_HOUSEHOLDS: Household[] = [
  {
    id: 'hh-001',
    reliefId: 'RL-KHP-7F3A92',
    representativeName: 'Ahmed Family (Tariq Ahmed)',
    familySize: 6,
    currentLocation: 'Khairpur',
    previousLocations: ['Sukkur', 'Kot Diji Village'],
    phone: '+92 301 5550192',
    govDocumentRef: 'CNIC-45201-8819201-3 (Optional copy)',
    vulnerability: ['Displaced', 'Elderly household', 'Severe economic hardship'],
    notes: 'Elderly head with 4 children. Requires dry ration kit & water filter.',
    registrationDate: '2026-09-18',
    registeredByOrgId: 'org-hh-01',
    registeredByOrgName: 'Helping Hands NGO',
    status: 'Verified'
  },
  {
    id: 'hh-002',
    reliefId: 'RL-KHP-1A82BD',
    representativeName: 'Fatima Family (Fatima Bibi)',
    familySize: 4,
    currentLocation: 'Khairpur',
    previousLocations: ['Pir Jo Goth Sector C'],
    phone: '+92 302 5550381',
    vulnerability: ['Children', 'Pregnant member', 'Displaced'],
    notes: 'Pregnant mother with 3 toddlers under 5 years.',
    registrationDate: '2026-09-21',
    registeredByOrgId: 'org-hh-01',
    registeredByOrgName: 'Helping Hands NGO',
    status: 'Verified'
  },
  {
    id: 'hh-003',
    reliefId: 'RL-SUK-77AB21',
    representativeName: 'Hassan Family (Hassan Raza)',
    familySize: 7,
    currentLocation: 'Sukkur',
    previousLocations: ['Rohri Canal Bank'],
    phone: '+92 300 5550912',
    vulnerability: ['Disability', 'Displaced'],
    notes: 'Wheelchair user family member. Needs ground tent access.',
    registrationDate: '2026-09-22',
    registeredByOrgId: 'org-gov-02',
    registeredByOrgName: 'Government Emergency Response',
    status: 'Verified'
  },
  {
    id: 'hh-004',
    reliefId: 'RL-SUK-91CD20',
    representativeName: 'Khan Family (Gul Hassan Khan)',
    familySize: 5,
    currentLocation: 'Sukkur',
    previousLocations: ['Gambat East'],
    vulnerability: ['Severe economic hardship', 'Children'],
    notes: 'Relocated family from riverbank overflow.',
    registrationDate: '2026-09-24',
    registeredByOrgId: 'org-rel-04',
    registeredByOrgName: 'Community Relief Network',
    status: 'Verified'
  },
  {
    id: 'hh-005',
    reliefId: 'RL-KHP-98F2AA', // Candidate duplicate match for demo
    representativeName: 'A. Ahmed Family (Tariq A. Khan)',
    familySize: 6,
    currentLocation: 'Khairpur',
    previousLocations: ['Sukkur'],
    phone: '+92 301 5550192',
    vulnerability: ['Displaced', 'Elderly household'],
    notes: 'Flagged by system: phone match & same location area.',
    registrationDate: '2026-09-28',
    registeredByOrgId: 'org-gov-02',
    registeredByOrgName: 'Government Emergency Response',
    status: 'Pending Review'
  }
];

const GENESIS_PREV = '0000000000000000000000000000000000000000000000000000000000000000';

export const INITIAL_TRANSACTIONS: AidTransaction[] = [
  {
    id: 'TX-83919',
    reliefId: 'RL-KHP-7F3A92',
    organizationId: 'org-health-03',
    organizationName: 'Community Health Network',
    workerId: 'wrk-104',
    workerName: 'Dr. Sarah Lin',
    aidType: 'Medicine',
    quantity: '1x Emergency First Aid & Oral Rehydration Kit',
    date: '2026-09-20',
    location: 'Khairpur District Field Hospital',
    notes: 'Chronic care refill & ORS packets.',
    previousHash: GENESIS_PREV,
    currentHash: '8A72F9921001234567890abcdef1234567890abcdef1234567890abcdef12345',
    syncStatus: 'synced',
    verificationStatus: 'verified'
  },
  {
    id: 'TX-83920',
    reliefId: 'RL-KHP-7F3A92',
    organizationId: 'org-gov-02',
    organizationName: 'Government Emergency Response',
    workerId: 'wrk-102',
    workerName: 'Captain Asif Khan',
    aidType: 'Tent',
    quantity: '1x Emergency Shelter Tent (6-Person)',
    date: '2026-09-25',
    location: 'Khairpur Depot 2',
    notes: 'Standard weatherproof tent.',
    previousHash: '8A72F9921001234567890abcdef1234567890abcdef1234567890abcdef12345',
    currentHash: '9B830AA3211234567890bcdef1234567890bcdef1234567890bcdef12345678',
    syncStatus: 'synced',
    verificationStatus: 'verified'
  },
  {
    id: 'TX-83921',
    reliefId: 'RL-KHP-7F3A92',
    organizationId: 'org-hh-01',
    organizationName: 'Helping Hands NGO',
    workerId: 'wrk-101',
    workerName: 'Zubair Ahmed',
    aidType: 'Food',
    quantity: '1x Family Food Package (30 Days Rations)',
    date: '2026-10-01',
    location: 'Khairpur Sector 4 Distribution Center',
    notes: 'Rations package issued.',
    previousHash: '9B830AA3211234567890bcdef1234567890bcdef1234567890bcdef12345678',
    currentHash: 'B921D31102234567890cdef1234567890cdef1234567890cdef1234567890cde',
    syncStatus: 'synced',
    verificationStatus: 'verified'
  },
  {
    id: 'TX-83922',
    reliefId: 'RL-KHP-1A82BD',
    organizationId: 'org-hh-01',
    organizationName: 'Helping Hands NGO',
    workerId: 'wrk-101',
    workerName: 'Zubair Ahmed',
    aidType: 'Hygiene Kit',
    quantity: '1x Maternal & Infant Care Sanitation Pack',
    date: '2026-10-01',
    location: 'Khairpur Sector 2 Camp',
    notes: 'Hygiene items issued.',
    previousHash: 'B921D31102234567890cdef1234567890cdef1234567890cdef1234567890cde',
    currentHash: 'C032E4221334567890def1234567890def1234567890def1234567890def123',
    syncStatus: 'synced',
    verificationStatus: 'verified'
  }
];

export const INITIAL_DUPLICATE_ALERTS: DuplicateAlert[] = [
  {
    id: 'dup-001',
    householdA: INITIAL_HOUSEHOLDS[0],
    householdB: INITIAL_HOUSEHOLDS[4],
    similarityScore: 94,
    matchReasons: [
      'Exact phone number match (+92 301 5550192)',
      'High name phonetic similarity (Ahmed Family vs A. Ahmed Family)',
      'Same location area (Khairpur)',
      'Identical family member count (6 members)'
    ],
    status: 'pending',
    createdAt: '2026-09-28T14:30:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-10-01 11:25:04',
    eventType: 'TRANSACTION_HASHED',
    actorId: 'wrk-101',
    actorName: 'Zubair Ahmed',
    organizationName: 'Helping Hands NGO',
    reliefId: 'RL-KHP-7F3A92',
    details: 'Recorded Food Package. SHA-256 block hash generated & chained.',
    hash: 'B921D31102234567890cdef1234567890cdef1234567890cdef1234567890cde'
  },
  {
    id: 'aud-002',
    timestamp: '2026-10-01 11:21:12',
    eventType: 'HOUSEHOLD_REGISTERED',
    actorId: 'wrk-101',
    actorName: 'Zubair Ahmed',
    organizationName: 'Helping Hands NGO',
    reliefId: 'RL-SUK-77AB21',
    details: 'Household Registered: Hassan Family (Sukkur)',
    hash: '0000000000'
  },
  {
    id: 'aud-003',
    timestamp: '2026-10-01 11:17:00',
    eventType: 'LEDGER_AUDITED',
    actorId: 'wrk-104',
    actorName: 'Dr. Sarah Lin',
    organizationName: 'Independent Auditor',
    details: 'System-wide cryptographic ledger verification completed. 3,842 transactions verified.',
    hash: '4481f9a2e3120bc9182312211aa8871625241b3a302910811aa'
  }
];
