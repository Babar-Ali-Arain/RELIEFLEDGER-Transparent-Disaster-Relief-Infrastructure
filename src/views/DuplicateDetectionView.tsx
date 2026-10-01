import React, { useState } from 'react';
import { CopyCheck, AlertTriangle, CheckCircle, XCircle, ArrowRight, ShieldCheck, Users } from 'lucide-react';
import { useRelief } from '../context/ReliefContext';
import { DuplicateAlert } from '../types';

export const DuplicateDetectionView: React.FC = () => {
  const { duplicateAlerts, resolveDuplicate } = useRelief();

  const [selectedAlert, setSelectedAlert] = useState<DuplicateAlert | null>(
    duplicateAlerts.find(d => d.status === 'pending') || duplicateAlerts[0] || null
  );

  return (
    <div className="space-y-6 pb-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-amber-700 text-xs font-black uppercase tracking-wider mb-1">
          <CopyCheck className="w-4 h-4" /> Anti-Double-Dipping Engine
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Duplicate Household Matching & Human Review
        </h1>
        <p className="text-slate-600 text-xs mt-1 font-medium">
          System FLAGS potential duplicate registrations across organizations using fuzzy signals. Human reviewers confirm or dismiss.
        </p>
      </div>

      {!selectedAlert ? (
        <div className="bg-white p-10 rounded-3xl border border-slate-200/90 text-center space-y-3 shadow-sm">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-black text-lg text-slate-900">Zero Pending Duplicate Alerts</h3>
          <p className="text-xs text-slate-500 font-medium">All registered households have passed duplicate verification checks.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Inspection Card */}
          <div className="bg-white rounded-3xl border-2 border-amber-400 p-6 lg:p-8 space-y-6 shadow-md overflow-hidden">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase">
                    POSSIBLE DUPLICATE HOUSEHOLD MATCH
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Similarity Score: <span className="font-black text-amber-700">{selectedAlert.similarityScore}% Match</span>
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 bg-amber-100/90 text-amber-950 font-black text-xs rounded-full border border-amber-300">
                STATUS: {selectedAlert.status.toUpperCase()}
              </span>
            </div>

            {/* Match Reasons List */}
            <div className="p-4.5 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-2">
              <span className="text-xs font-black text-amber-950 uppercase tracking-wider block">
                Fuzzy Signal Match Indicators:
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-amber-900 font-medium">
                {selectedAlert.matchReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Side-by-Side Record Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Record A */}
              <div className="p-5 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <span className="text-xs font-black uppercase text-slate-600">RECORD A (Primary)</span>
                  <span className="font-mono font-black text-xs bg-slate-900 text-white px-2.5 py-0.5 rounded-md">
                    {selectedAlert.householdA.reliefId}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-black">Representative</span>
                    <span className="font-black text-slate-900 text-sm">{selectedAlert.householdA.representativeName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-black">Family Members</span>
                    <span className="font-bold text-slate-800">{selectedAlert.householdA.familySize} Persons</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-black">Current Sector / Village</span>
                    <span className="font-bold text-slate-800">{selectedAlert.householdA.currentLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-black">Phone Number</span>
                    <span className="font-mono font-bold text-slate-800">{selectedAlert.householdA.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-black">Registered By</span>
                    <span className="font-bold text-slate-800">{selectedAlert.householdA.registeredByOrgName}</span>
                  </div>
                </div>
              </div>

              {/* Record B */}
              <div className="p-5 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <span className="text-xs font-black uppercase text-amber-800">RECORD B (Flagged Candidate)</span>
                  <span className="font-mono font-black text-xs bg-amber-600 text-white px-2.5 py-0.5 rounded-md">
                    {selectedAlert.householdB.reliefId}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-black">Representative</span>
                    <span className="font-black text-slate-900 text-sm">{selectedAlert.householdB.representativeName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-black">Family Members</span>
                    <span className="font-bold text-slate-800">{selectedAlert.householdB.familySize} Persons</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-black">Current Sector / Village</span>
                    <span className="font-bold text-slate-800">{selectedAlert.householdB.currentLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-black">Phone Number</span>
                    <span className="font-mono font-bold text-slate-800">{selectedAlert.householdB.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-black">Registered By</span>
                    <span className="font-bold text-slate-800">{selectedAlert.householdB.registeredByOrgName}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Human Resolution Decision Bar */}
            {selectedAlert.status === 'pending' && (
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500 font-medium">
                  Human Oversight Policy: <strong className="text-slate-800">Reviewers verify identities before merging records.</strong>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => resolveDuplicate(selectedAlert.id, 'rejected_different')}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <XCircle className="w-4 h-4 text-rose-600" /> DISMISS — DISTINCT HOUSEHOLDS
                  </button>
                  <button
                    onClick={() => resolveDuplicate(selectedAlert.id, 'confirmed_same')}
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-amber-950/20 active:scale-95 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" /> CONFIRM DUPLICATE & MERGE
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* List of Other Alert Candidates */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              ALL DUPLICATE MATCH ALERTS ({duplicateAlerts.length})
            </h3>

            <div className="space-y-2.5">
              {duplicateAlerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    selectedAlert?.id === alert.id
                      ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-400'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-black text-slate-900">
                        {alert.householdA.representativeName} ({alert.householdA.reliefId}) ↔ {alert.householdB.representativeName} ({alert.householdB.reliefId})
                      </span>
                      <span className="block text-[10px] text-slate-500 font-medium">
                        Similarity: {alert.similarityScore}% · Reasons: {alert.matchReasons.join(', ')}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg font-black text-[10px] uppercase ${
                    alert.status === 'pending'
                      ? 'bg-amber-200 text-amber-900'
                      : alert.status === 'confirmed_same'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {alert.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
