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
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
          <CopyCheck className="w-4 h-4" /> Anti-Double-Dipping Engine
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Duplicate Household Matching & Human Review
        </h1>
        <p className="text-slate-600 text-xs mt-1">
          System FLAGS potential duplicate registrations across organizations using fuzzy signals. Human reviewers confirm or dismiss.
        </p>
      </div>

      {!selectedAlert ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3 shadow-2xs">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-lg text-slate-900">Zero Pending Duplicate Alerts</h3>
          <p className="text-xs text-slate-500">All registered households have passed duplicate verification checks.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Inspection Card */}
          <div className="bg-white rounded-2xl border-2 border-amber-400 p-6 lg:p-8 space-y-6 shadow-sm">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 uppercase">
                    POSSIBLE DUPLICATE HOUSEHOLD MATCH
                  </h3>
                  <p className="text-xs text-slate-600">
                    Similarity Score: <span className="font-bold text-amber-700">{selectedAlert.similarityScore}% Match</span>
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 bg-amber-100 text-amber-900 font-extrabold text-xs rounded-full border border-amber-300">
                STATUS: {selectedAlert.status.toUpperCase()}
              </span>
            </div>

            {/* Match Reasons List */}
            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
              <span className="text-xs font-extrabold text-amber-950 uppercase tracking-wider block">
                Fuzzy Signal Match Indicators:
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-amber-900">
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
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-extrabold uppercase text-slate-500">RECORD A (Primary)</span>
                  <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                    {selectedAlert.householdA.reliefId}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Representative</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedAlert.householdA.representativeName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Family Members</span>
                    <span className="font-semibold text-slate-800">{selectedAlert.householdA.familySize} Persons</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Current Sector / Village</span>
                    <span className="font-semibold text-slate-800">{selectedAlert.householdA.currentLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone Number</span>
                    <span className="font-mono text-slate-800">{selectedAlert.householdA.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Registered By</span>
                    <span className="font-semibold text-slate-800">{selectedAlert.householdA.registeredByOrgName}</span>
                  </div>
                </div>
              </div>

              {/* Record B */}
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-extrabold uppercase text-amber-800">RECORD B (Flagged Candidate)</span>
                  <span className="font-mono font-bold text-xs bg-amber-600 text-white px-2 py-0.5 rounded">
                    {selectedAlert.householdB.reliefId}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Representative</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedAlert.householdB.representativeName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Family Members</span>
                    <span className="font-semibold text-slate-800">{selectedAlert.householdB.familySize} Persons</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Current Sector / Village</span>
                    <span className="font-semibold text-slate-800">{selectedAlert.householdB.currentLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone Number</span>
                    <span className="font-mono text-slate-800">{selectedAlert.householdB.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Registered By</span>
                    <span className="font-semibold text-slate-800">{selectedAlert.householdB.registeredByOrgName}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Decision Action Buttons */}
            {selectedAlert.status === 'pending' && (
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => resolveDuplicate(selectedAlert.id, 'rejected_different')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
                >
                  <XCircle className="w-4 h-4 text-slate-600" /> NOT THE SAME HOUSEHOLD
                </button>

                <button
                  onClick={() => resolveDuplicate(selectedAlert.id, 'confirmed_same')}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors"
                >
                  <CheckCircle className="w-4 h-4" /> CONFIRM SAME HOUSEHOLD
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
