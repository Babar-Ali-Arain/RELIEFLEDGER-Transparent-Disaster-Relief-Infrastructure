import React, { useState } from 'react';
import { QrCode, Search, Scan, ShieldCheck, CheckCircle2, Lock, EyeOff } from 'lucide-react';
import { useRelief } from '../context/ReliefContext';
import { reliefService } from '../services/reliefService';
import { QRScannerModal } from '../components/QRScannerModal';

export const VerifyReliefIdView: React.FC = () => {
  const { selectedReliefId, setSelectedReliefId } = useRelief();
  const [verifyIdInput, setVerifyIdInput] = useState(selectedReliefId);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const publicRecord = reliefService.verifyPublicRecord(verifyIdInput);

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyIdInput.trim()) {
      setSelectedReliefId(verifyIdInput.trim().toUpperCase());
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-6">
      {/* Title Header */}
      <div className="border-b border-slate-200 pb-4 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 text-white text-xs font-black uppercase tracking-wider shadow-xs">
          <QrCode className="w-3.5 h-3.5 text-emerald-400" /> PUBLIC VERIFICATION PORTAL
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Verify Relief ID & Audit History
        </h1>
        <p className="text-slate-600 text-xs max-w-lg mx-auto font-medium">
          Public verification confirms the existence and integrity of a relief record without exposing private household information.
        </p>
      </div>

      {/* Search Input Box Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-600" />
        <div className="p-6 space-y-4">
          <form onSubmit={handleVerifySubmit} className="space-y-3">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
              Enter Relief ID to Verify
            </label>
            <div className="flex gap-2.5">
              <input
                type="text"
                placeholder="e.g. RL-KHP-7F3A92"
                value={verifyIdInput}
                onChange={(e) => setVerifyIdInput(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-black uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-950/20 active:scale-95 transition-all shrink-0"
              >
                VERIFY
              </button>
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl active:scale-95 transition-all shrink-0 shadow-xs"
                title="Scan QR Code"
              >
                <Scan className="w-5 h-5 text-emerald-400" />
              </button>
            </div>
          </form>

          {/* Quick Demo ID triggers */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1 font-medium">
            <span className="font-bold">Try demo IDs:</span>
            {['RL-KHP-7F3A92', 'RL-KHP-1A82BD', 'RL-SUK-77AB21'].map(id => (
              <button
                key={id}
                onClick={() => {
                  setVerifyIdInput(id);
                  setSelectedReliefId(id);
                }}
                className="font-mono text-emerald-700 hover:underline font-black bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Result Display Card */}
      {publicRecord.found ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 lg:p-8 space-y-6 shadow-sm animate-in fade-in duration-200">
          
          {/* Verification Status Badges */}
          <div className="p-4.5 bg-emerald-50/90 border-2 border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-950">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
            <div>
              <div className="font-black text-sm flex items-center gap-2">
                <span>RECORD FOUND</span> · <span className="text-emerald-700">✓ LEDGER INTEGRITY VERIFIED</span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5 font-medium">{publicRecord.message}</p>
            </div>
          </div>

          {/* Privacy-Safe Information Display */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Privacy-Protected Household Summary
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                <span className="text-slate-500 block text-[10px] uppercase font-black">Relief ID</span>
                <span className="font-mono font-black text-slate-900 text-sm">{publicRecord.reliefId}</span>
              </div>
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                <span className="text-slate-500 block text-[10px] uppercase font-black">General Sector Area</span>
                <span className="font-black text-slate-800">{publicRecord.generalArea}</span>
              </div>
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                <span className="text-slate-500 block text-[10px] uppercase font-black">Registration Date</span>
                <span className="font-black text-slate-800">{publicRecord.registrationDate}</span>
              </div>
            </div>
          </div>

          {/* Aid History Timeline */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Verifiable Aid Transactions ({publicRecord.aidHistory?.length || 0})
            </h3>

            {publicRecord.aidHistory && publicRecord.aidHistory.length > 0 ? (
              <div className="divide-y divide-slate-100 border border-slate-200/90 rounded-2xl overflow-hidden bg-slate-50/50">
                {publicRecord.aidHistory.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between text-xs hover:bg-slate-100/50 transition-colors">
                    <div>
                      <span className="font-black text-slate-900">{item.aidType}</span>
                      <span className="text-slate-500 block text-[11px] font-medium">Provider: {item.organizationName}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-slate-700 font-bold">{item.date}</span>
                      <span className="text-[10px] text-emerald-700 block font-black">✓ Verified Block</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic font-medium">No distribution history recorded for this ID yet.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center space-y-2 shadow-sm">
          <EyeOff className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-black text-base text-slate-900">Relief ID Not Found or Unverified</h3>
          <p className="text-xs text-slate-500 font-medium">
            Please check the Relief ID string or scan the portable QR ID card.
          </p>
        </div>
      )}

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(scannedId) => {
          setVerifyIdInput(scannedId);
          setSelectedReliefId(scannedId);
        }}
      />
    </div>
  );
};
