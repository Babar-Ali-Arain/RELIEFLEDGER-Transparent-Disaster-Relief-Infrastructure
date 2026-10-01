import React from 'react';
import { Building2, UserCheck, ShieldCheck, Key, Users } from 'lucide-react';
import { useRelief } from '../context/ReliefContext';

export const OrganizationsView: React.FC = () => {
  const { organizations, workers, currentWorker, setCurrentWorker } = useRelief();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
          <Building2 className="w-4 h-4" /> Multi-Agency Coordination
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Participating Organizations & Field Staff
        </h1>
        <p className="text-slate-600 text-xs mt-1">
          Interoperable disaster relief network enabling NGOs and government agencies to coordinate without centralized siloing.
        </p>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {organizations.map((org) => (
          <div key={org.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm">
                  {org.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{org.name}</h3>
                  <span className="text-[10px] text-slate-500">{org.location}</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-bold rounded-full">
                {org.type}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Verified Workers</span>
                <span className="font-bold text-slate-900">{org.verifiedWorkersCount} Staff</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Distributed Aid Units</span>
                <span className="font-bold text-slate-900">{org.totalAidDistributed.toLocaleString()} Units</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Workers Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">VERIFIED FIELD WORKERS & ROLES</h3>
          </div>
          <span className="text-xs text-slate-500">Select row to switch active worker identity</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Worker Code</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Organization</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Authentication</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workers.map((worker) => {
                const isActive = currentWorker.id === worker.id;
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
                    <td className="py-3 px-3 text-emerald-700 flex items-center gap-1">
                      <Key className="w-3.5 h-3.5" /> {worker.authMethod}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isActive ? (
                        <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded-full">
                          ACTIVE IDENTITY
                        </span>
                      ) : (
                        <button
                          onClick={() => setCurrentWorker(worker)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[10px] rounded-lg transition-colors"
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
