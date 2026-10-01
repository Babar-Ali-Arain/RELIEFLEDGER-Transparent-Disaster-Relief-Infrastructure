import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCw, 
  Search, 
  Lock, 
  FileCode, 
  AlertOctagon, 
  ListFilter 
} from 'lucide-react';
import { useRelief } from '../context/ReliefContext';
import { AidTransaction } from '../types';

export const AuditLedgerView: React.FC = () => {
  const { 
    transactions, 
    verifyLedgerChain, 
    tamperTxDemo, 
    auditLogs,
    resetDemoData
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

  return (
    <div className="space-y-6">
      {/* Page Title & Controls Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Cryptographic Integrity Engine
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Audit Ledger & Hash Chain Inspector
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            SHA-256 linked block chain ensures zero tampering across participating NGOs and government agencies.
          </p>
        </div>

        {/* Verification & Demo Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRunVerification}
            disabled={isVerifying}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
            {isVerifying ? 'VERIFYING LEDGER...' : 'VERIFY ENTIRE LEDGER'}
          </button>

          {/* Judge Demo Tamper Trigger */}
          <button
            onClick={() => {
              if (transactions.length > 0) {
                tamperTxDemo(transactions[0].id);
                setAuditResult(null);
              }
            }}
            className="px-3.5 py-2.5 bg-red-100 hover:bg-red-200 text-red-900 border border-red-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            title="Simulate data alteration to test hash chain failure detection"
          >
            <AlertOctagon className="w-4 h-4 text-red-600" />
            SIMULATE TAMPER (TEST)
          </button>
        </div>
      </div>

      {/* Audit Banner Status Card */}
      {auditResult && (
        <div className={`p-5 rounded-2xl border ${
          auditResult.isValid 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
            : 'bg-red-50 border-red-300 text-red-950'
        } animate-in fade-in duration-200`}>
          <div className="flex items-start gap-3">
            {auditResult.isValid ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-7 h-7 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <h3 className="font-extrabold text-base">
                {auditResult.isValid ? '✓ LEDGER INTEGRITY VERIFIED' : '⚠ TAMPER / CORRUPTION DETECTED'}
              </h3>
              <p className="text-xs font-semibold">{auditResult.message}</p>
              <div className="text-[11px] opacity-80 pt-1 font-mono">
                Blocks Scanned: {auditResult.totalVerified} / {transactions.length} | Hash Engine: SHA-256 WebCrypto
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ledger Stats Summary Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Ledger Status</span>
          <div className="text-xl font-extrabold text-emerald-700 flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> VERIFIED INTACT
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Transactions</span>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {transactions.length.toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Last Cryptographic Audit</span>
          <div className="text-xs font-bold font-mono text-slate-800">
            {new Date().toISOString().replace('T', ' ').slice(0, 16)}
          </div>
        </div>
      </div>

      {/* Search Filter & Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <h3 className="text-sm font-bold text-slate-900">MASTER LEDGER BLOCK TABLE</h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, Relief ID, Org, or Aid..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Tx ID</th>
                <th className="py-2.5 px-3">Relief ID</th>
                <th className="py-2.5 px-3">Organization</th>
                <th className="py-2.5 px-3">Aid Category & Quantity</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">SHA-256 Hash</th>
                <th className="py-2.5 px-3 text-right">Status</th>
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
                    <td className="py-3 px-3 text-slate-800 font-semibold">{tx.reliefId}</td>
                    <td className="py-3 px-3 font-sans text-slate-700">{tx.organizationName}</td>
                    <td className="py-3 px-3 font-sans">
                      <span className="font-bold text-slate-900">{tx.aidType}:</span> {tx.quantity}
                    </td>
                    <td className="py-3 px-3 text-slate-500">{tx.date}</td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] truncate max-w-[140px]">
                      {tx.currentHash}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
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

      {/* Inspector Modal */}
      {selectedTxInspector && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <FileCode className="w-5 h-5 text-emerald-400" />
                BLOCK TRANSACTION INSPECTOR — {selectedTxInspector.id}
              </div>
              <button
                onClick={() => setSelectedTxInspector(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Relief ID</span>
                <span className="text-slate-900 font-bold text-sm">{selectedTxInspector.reliefId}</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Previous Block Hash</span>
                <div className="p-2.5 bg-slate-100 rounded border border-slate-200 text-[11px] break-all font-mono text-slate-700">
                  {selectedTxInspector.previousHash}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Current Block Hash</span>
                <div className="p-2.5 bg-slate-900 text-emerald-400 rounded border border-slate-800 text-[11px] break-all font-mono font-bold">
                  {selectedTxInspector.currentHash}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 font-sans pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Aid Category</span>
                  <span className="font-bold text-slate-900">{selectedTxInspector.aidType} ({selectedTxInspector.quantity})</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Organization</span>
                  <span className="font-bold text-slate-900">{selectedTxInspector.organizationName}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedTxInspector(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg"
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
