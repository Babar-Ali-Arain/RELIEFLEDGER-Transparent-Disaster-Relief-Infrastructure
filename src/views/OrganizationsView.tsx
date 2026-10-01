import React from 'react';
import { Building2, UserCheck, ShieldCheck, Key, Users } from 'lucide-react';
import { useRelief } from '../context/ReliefContext';

export const OrganizationsView: React.FC = () => {
  const { organizations, workers, currentWorker, setCurrentWorker } = useRelief();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-purple-700 text-xs font-black uppercase tracking-wider mb-1">
          <Building2 className="w-4 h-4" /> Multi-Agency Coordination
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Participating Organizations & Field Staff
        </h1>
        <p className="text-slate-600 text-xs mt-1 font-medium">
          Interoperable disaster relief network enabling NGOs and government agencies to coordinate without centralized siloing.
        </p>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {organizations.map((org) => (
          <div key={org.id} className="bg-white rounded-3xl border border-slate-200/90 space-y-3 shadow-sm hover:shadow-xl hover:border-purple-500/30 transition-all duration-200 hover:-translate-y-1 overflow-hidden group">
            <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-indigo-600" />
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-sm group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-xs">
                    {org.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900">{org.name}</h3>
                    <span className="text-[10px] text-slate-500 font-bold">{org.location}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-[10px] font-black rounded-lg">
                  {org.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-[10px] uppercase font-black block">Verified Staff</span>
                  <span className="font-black text-slate-900">{org.verifiedWorkersCount} Staff</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-[10px] uppercase font-black block">Aid Volume</span>
                  <span className="font-black text-slate-900">{org.totalAidDistributed.toLocaleString()} Units</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Workers Roster Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 lg:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-700" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">VERIFIED FIELD WORKERS & ROLES</h3>
          </div>
          <span className="text-xs text-slate-500 font-bold">Select row to switch active worker identity</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-black border-b border-slate-200">
                <th className="py-3 px-3.5">Worker Code</th>
                <th className="py-3 px-3.5">Name</th>
                <th className="py-3 px-3.5">Organization</th>
                <th className="py-3 px-3.5">Role</th>
                <th className="py-3 px-3.5">Authentication</th>
                <th className="py-3 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workers.map((worker) => {
                const isActive = currentWorker.id === worker.id;
                return (
                  <tr 
                    key={worker.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isActive ? 'bg-emerald-50/70 font-black' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3.5 font-mono font-black text-slate-900">{worker.workerCode}</td>
                    <td className="py-3.5 px-3.5 font-black text-slate-900">{worker.name}</td>
                    <td className="py-3.5 px-3.5 text-slate-600 font-bold">{worker.organizationName}</td>
                    <td className="py-3.5 px-3.5 font-black text-slate-900">{worker.role}</td>
                    <td className="py-3.5 px-3.5 text-emerald-700 font-bold flex items-center gap-1">
                      <Key className="w-3.5 h-3.5" /> {worker.authMethod}
                    </td>
                    <td className="py-3.5 px-3.5 text-right">
                      {isActive ? (
                        <span className="px-3 py-1 bg-emerald-600 text-white font-black text-[10px] rounded-full shadow-xs">
                          ACTIVE IDENTITY
                        </span>
                      ) : (
                        <button
                          onClick={() => setCurrentWorker(worker)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-[10px] rounded-lg transition-colors"
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
