import React from 'react';
import { Users, Key, ShieldCheck, UserCheck } from 'lucide-react';
import { useRelief } from '../context/ReliefContext';

export const WorkersView: React.FC = () => {
  const { workers, currentUser, setCurrentUser } = useRelief();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-wider mb-1">
          <Users className="w-4 h-4" /> Personnel Directory
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Verified Workers & Field Personnel
        </h1>
        <p className="text-slate-600 text-xs mt-1">
          Authorized personnel across participating humanitarian organizations and government emergency teams.
        </p>
      </div>

      {/* Workers Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">ACTIVE FIELD WORKERS & MFA SECURITY</h3>
          <span className="text-xs text-slate-500">Switch active session identity below</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Worker ID</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Organization</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">MFA Status</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workers.map((worker) => {
                const isActive = currentUser?.id === worker.id;
                return (
                  <tr 
                    key={worker.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isActive ? 'bg-emerald-50/60 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{worker.workerCode}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{worker.name}</td>
                    <td className="py-3 px-3 text-slate-600">{worker.organizationName}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{worker.role}</td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">
                      ✓ Enabled ({worker.authMethod})
                    </td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">
                      ✓ {worker.status}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isActive ? (
                        <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded-full">
                          ACTIVE IDENTITY
                        </span>
                      ) : (
                        <button
                          onClick={() => setCurrentUser(worker)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[10px] rounded-lg transition-colors"
                        >
                          Switch Identity
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
