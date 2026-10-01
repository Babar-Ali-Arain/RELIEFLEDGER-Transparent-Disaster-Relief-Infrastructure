import { Household, AidTransaction } from '../types';

/**
 * Escapes CSV field value to handle commas, quotes, and line breaks properly
 */
const escapeCSV = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
};

/**
 * Downloads a string payload as a CSV file in the browser
 */
const downloadCSVBlob = (csvContent: string, defaultFilename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', defaultFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exports a array of Households to a CSV file
 */
export const exportHouseholdsToCSV = (households: Household[], filenamePrefix = 'ReliefLedger_Households') => {
  const headers = [
    'Relief ID',
    'Representative Name',
    'Gov ID / Document',
    'Phone',
    'Family Size',
    'Current Location',
    'Vulnerabilities',
    'Status',
    'Registered By Organization',
    'Registration Date',
    'Notes'
  ];

  const rows = households.map(h => [
    escapeCSV(h.reliefId),
    escapeCSV(h.representativeName),
    escapeCSV(h.govDocumentRef || 'N/A'),
    escapeCSV(h.phone || 'N/A'),
    escapeCSV(h.familySize),
    escapeCSV(h.currentLocation),
    escapeCSV(h.vulnerability ? h.vulnerability.join('; ') : 'None'),
    escapeCSV(h.status),
    escapeCSV(h.registeredByOrgName),
    escapeCSV(h.registrationDate),
    escapeCSV(h.notes || '')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\r\n');

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${filenamePrefix}_${timestamp}.csv`;
  downloadCSVBlob(csvContent, filename);
};

/**
 * Exports an array of AidTransaction ledger blocks to a CSV file
 */
export const exportAuditLedgerToCSV = (transactions: AidTransaction[], filenamePrefix = 'ReliefLedger_AuditChain') => {
  const headers = [
    'Block Index',
    'Transaction ID',
    'Relief ID',
    'Aid Category',
    'Quantity',
    'Location',
    'Organization',
    'Worker Name',
    'Timestamp / Date',
    'Sync Status',
    'Verification Status',
    'Previous Hash',
    'Current Hash',
    'Notes'
  ];

  const rows = transactions.map((tx, idx) => [
    escapeCSV(idx + 1),
    escapeCSV(tx.id),
    escapeCSV(tx.reliefId),
    escapeCSV(tx.aidType),
    escapeCSV(tx.quantity),
    escapeCSV(tx.location),
    escapeCSV(tx.organizationName),
    escapeCSV(tx.workerName),
    escapeCSV(tx.date),
    escapeCSV(tx.syncStatus),
    escapeCSV(tx.verificationStatus),
    escapeCSV(tx.previousHash),
    escapeCSV(tx.currentHash),
    escapeCSV(tx.notes || '')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\r\n');

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${filenamePrefix}_${timestamp}.csv`;
  downloadCSVBlob(csvContent, filename);
};
