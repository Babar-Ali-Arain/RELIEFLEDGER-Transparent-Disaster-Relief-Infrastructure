import React from 'react';
import { Settings, Shield, Lock, Download, RotateCcw, Database, Server } from 'lucide-react';
import { useRelief } from '../context/ReliefContext';

export const SettingsPrivacyView: React.FC = () => {
  const { resetDemoData, households, transactions, showToast } = useRelief();

  const handleExportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      households,
      transactions
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reliefledger_backup_${Date.now()}.json`;
    a.click();
    showToast('success', 'Backup Exported', 'JSON copy of local relief ledger saved.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" /> System Governance
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Privacy Architecture & Database Configuration
        </h1>
        <p className="text-slate-600 text-xs mt-1">
          ReliefLedger applies humanitarian privacy principles to safeguard displaced and vulnerable populations.
        </p>
      </div>

      {/* Privacy Constitution Card */}
      <div className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm border-b border-slate-100 pb-3">
          <Shield className="w-5 h-5" /> HUMANITARIAN DATA PRIVACY CONSTITUTION
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="p-4 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" /> Data Minimization
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Public QR codes and public verification queries encode ONLY the Relief ID. Phone numbers, government IDs, and private notes never leave the secure agency portal.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" /> Non-Mandatory Identity
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Government IDs (CNIC / Passports) are optional. Disaster victims who lost documents during floods or earthquakes are never turned away from receiving aid.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Controls Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          DEMO DATA & BACKUP CONTROLS
        </h3>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" /> EXPORT MASTER LEDGER BACKUP (JSON)
          </button>

          <button
            onClick={resetDemoData}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" /> RESET TO PRISTINE DEMO STATE
          </button>
        </div>
      </div>

      {/* Backend Integration Readiness Box */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-3 border border-slate-800">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <Server className="w-4 h-4" /> Production Backend Architecture
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          ReliefLedger is structured with an isolated service abstraction layer (<code className="font-mono text-emerald-400">src/services/reliefService.ts</code>). The client UI calls service interfaces for <code className="font-mono text-slate-200">registerHousehold()</code>, <code className="font-mono text-slate-200">recordAid()</code>, <code className="font-mono text-slate-200">verifyLedger()</code>, and <code className="font-mono text-slate-200">syncOfflineQueue()</code>. To transition to PostgreSQL / Cloud SQL / Supabase, replace local persistence calls inside <code className="font-mono text-slate-200">reliefService.ts</code> with REST/GraphQL endpoints.
        </p>
      </div>
    </div>
  );
};
