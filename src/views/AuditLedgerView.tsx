import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCw, 
  Search, 
  Lock, 
  FileCode, 
  AlertOctagon, 
  X,
  Download
} from 'lucide-react';
import { useRelief } from '../context/ReliefContext';
import { AidTransaction } from '../types';
import { exportAuditLedgerToCSV } from '../utils/csvExport';

export const AuditLedgerView: React.FC = () => {
  const { 
    transactions, 
    verifyLedgerChain, 
    tamperTxDemo, 
    auditLogs,
    resetDemoData,
    showToast
  } = useRelief();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedTxInspector, setSelectedTxInspector] = useState<AidTransaction | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    isValid: boolean;
    tamperedIndex?: number;
    totalVerified: number;
    message: string;
  } | null>(null);

  // Close Inspector modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedTxInspector(null);
    };
    if (selectedTxInspector) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTxInspector]);

  const handleRunVerification = async () => {
    setIsVerifying(true);
    setTimeout(async () => {
      const res = await verifyLedgerChain();
      setAuditResult(res);
      setIsVerifying(false);
    }, 400);
  };

  const filteredTransactions = transactions.filter(t => 
    t.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
    t.reliefId.toLowerCase().includes(searchFilter.toLowerCase()) ||
    t.organizationName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    t.aidType.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleExportCSV = () => {
    exportAuditLedgerToCSV(filteredTransactions);
    showToast(
      'success',
      'Ledger CSV Export Downloaded',
      `Successfully exported ${filteredTransactions.length} cryptographic audit ledger transactions to CSV.`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Cryptographic Proof & Chain Inspector
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Cryptographic SHA-256 Audit Ledger
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            Every transaction is linked via SHA-256 block hashing (<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">previousHash → currentHash</code>).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors border border-slate-700"
            title="Export current ledger blocks to CSV file"
          >
            <Download className="w-4 h-4 text-emerald-400" /> EXPORT LEDGER CSV ({filteredTransactions.length})
          </button>

          <button
            onClick={handleRunVerification}
            disabled={isVerifying}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
            {isVerifying ? 'Verifying Hashes...' : 'RUN FULL CHAIN INTEGRITY AUDIT'}
          </button>
        </div>
      </div>

      {/* Audit Result Display Banner */}
      {auditResult && (
        <div className={`p-5 rounded-2xl border-2 space-y-2 animate-in fade-in duration-150 ${
          auditResult.isValid
            ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
            : 'bg-red-50 border-red-500 text-red-950'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {auditResult.isValid ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
              ) : (
                <AlertOctagon className="w-7 h-7 text-red-600 shrink-0" />
              )}
              <div>
                <h3 className="font-extrabold text-sm uppercase tracking-wide">
                  {auditResult.isValid ? '✓ LEDGER INTEGRITY VERIFIED (100% INTACT)' : '❌ TAMPERING DETECTED IN LEDGER CHAIN'}
                </h3>
                <p className="text-xs font-medium mt-0.5">{auditResult.message}</p>
              </div>
            </div>

            {!auditResult.isValid && (
              <button
                onClick={async () => {
                  await resetDemoData();
                  setAuditResult(null);
                }}
                className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Restore Valid Ledger
              </button>
            )}
          </div>
        </div>
      )}

      {/* Interactive Tamper Attack Simulation Panel */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-wider">
            <AlertOctagon className="w-4 h-4" /> Judge Security Stress Test Zone
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Simulate Unauthorized Database Modification
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <p className="text-xs text-slate-300 max-w-xl">
            Simulate a rogue database administrator manually altering an aid record quantity post-distribution to test cryptographic hash detection.
          </p>

          <button
            onClick={async () => {
              if (transactions.length > 0) {
                await tamperTxDemo(transactions[0].id);
                handleRunVerification();
              }
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors shrink-0"
          >
            ⚡ SIMULATE TAMPER ATTACK (ALTER TX #1)
          </button>
        </div>
      </div>

      {/* Master Transaction Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-extrabold text-slate-900 uppercase">
              MASTER DISTRIBUTION LEDGER BLOCK BLOCKS ({filteredTransactions.length})
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Tx ID, Relief ID, or Aid Category..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[10px] uppercase tracking-wider">
                <th className="py-3 px-3">Tx ID</th>
                <th className="py-3 px-3">Relief ID</th>
                <th className="py-3 px-3">Organization</th>
                <th className="py-3 px-3">Aid Category & Quantity</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">SHA-256 Hash</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredTransactions.map((tx) => {
                const isTampered = tx.verificationStatus === 'tampered';
                return (
                  <tr 
                    key={tx.id}
                    onClick={() => setSelectedTxInspector(tx)}
                    className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                      isTampered ? 'bg-red-50/80' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-slate-900">{tx.id}</td>
                    <td className="py-3 px-3 text-slate-800 font-extrabold">{tx.reliefId}</td>
                    <td className="py-3 px-3 font-sans text-slate-700">{tx.organizationName}</td>
                    <td className="py-3 px-3 font-sans">
                      <span className="font-extrabold text-slate-900">{tx.aidType}:</span> {tx.quantity}
                    </td>
                    <td className="py-3 px-3 text-slate-500">{tx.date}</td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] truncate max-w-[140px]">
                      {tx.currentHash}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isTampered 
                          ? 'bg-red-100 text-red-900 border border-red-300' 
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {isTampered ? '❌ TAMPERED' : '✓ VERIFIED'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Responsive Block Inspector Modal */}
      {selectedTxInspector && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setSelectedTxInspector(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-xl w-[95%] sm:w-full shadow-2xl overflow-hidden border border-slate-200 my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-extrabold text-xs sm:text-sm">
                <FileCode className="w-5 h-5 text-emerald-400" />
                BLOCK TRANSACTION INSPECTOR — {selectedTxInspector.id}
              </div>
              <button
                onClick={() => setSelectedTxInspector(null)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs font-mono overflow-y-auto">
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1 border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Target Household Relief ID</span>
                <span className="text-slate-950 font-black text-sm">{selectedTxInspector.reliefId}</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Previous Block Hash</span>
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-[11px] break-all font-mono text-slate-700">
                  {selectedTxInspector.previousHash}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Current Block Hash</span>
                <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl border border-slate-800 text-[11px] break-all font-mono font-bold">
                  {selectedTxInspector.currentHash}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-sans pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block font-bold">Aid Category</span>
                  <span className="font-extrabold text-slate-900">{selectedTxInspector.aidType} ({selectedTxInspector.quantity})</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block font-bold">Distributing Agency</span>
                  <span className="font-extrabold text-slate-900">{selectedTxInspector.organizationName}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedTxInspector(null)}
                className="px-4 py-2 bg-slate-900 text-white font-extrabold text-xs rounded-xl"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
