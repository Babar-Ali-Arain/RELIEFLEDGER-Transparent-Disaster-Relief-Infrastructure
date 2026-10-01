import React, { useState } from 'react';
import { Users, UserPlus, Search, Filter, Eye, ShieldCheck, MapPin } from 'lucide-react';
import { useRelief } from '../context/ReliefContext';
import { Household } from '../types';

export const HouseholdsView: React.FC = () => {
  const { households, setActiveTab, setSelectedReliefId, transactions } = useRelief();

  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter logic
  const filteredHouseholds = households.filter((h) => {
    const matchesSearch = 
      h.reliefId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.representativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.currentLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = locationFilter === 'ALL' || h.currentLocation.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || h.status === statusFilter;

    return matchesSearch && matchesLocation && matchesStatus;
  });

  const getLastAidForHousehold = (reliefId: string): string => {
    const htx = transactions.filter(t => t.reliefId.toUpperCase() === reliefId.toUpperCase());
    if (htx.length === 0) return 'No Aid Recorded';
    // Newest aid
    const newest = htx.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    return `${newest.aidType} (${newest.date})`;
  };

  return (
    <div className="space-y-6">
      {/* Title & Top Right Actions */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" /> Identity Register
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Households
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            Manage portable household identities and relief records.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('register')}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <UserPlus className="w-4 h-4" /> + REGISTER HOUSEHOLD
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Relief ID, name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        {/* Location Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="ALL">All Locations</option>
            <option value="Khairpur">Khairpur Sector</option>
            <option value="Sukkur">Sukkur Camp</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* Households Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase">
            REGISTERED HOUSEHOLDS ({filteredHouseholds.length})
          </span>
          <span className="text-[11px] text-slate-500">
            Privacy Protected: Personal details redacted in general table view
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-4">Relief ID</th>
                <th className="py-2.5 px-4">Representative</th>
                <th className="py-2.5 px-4">Family Size</th>
                <th className="py-2.5 px-4">Current Location</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Last Aid Received</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHouseholds.map((hh) => {
                const lastAid = getLastAidForHousehold(hh.reliefId);
                return (
                  <tr key={hh.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{hh.reliefId}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{hh.representativeName}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{hh.familySize} Members</td>
                    <td className="py-3.5 px-4 text-slate-600">{hh.currentLocation}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        hh.status === 'Verified'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-900 border border-amber-200'
                      }`}>
                        ✓ {hh.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{lastAid}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedReliefId(hh.reliefId);
                          setActiveTab('profile');
                        }}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
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
