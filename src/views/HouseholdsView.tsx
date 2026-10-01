import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Eye, 
  ShieldCheck, 
  MapPin, 
  Tag, 
  X, 
  QrCode, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  HeartHandshake,
  Download
} from 'lucide-react';
import { useRelief } from '../context/ReliefContext';
import { Household, VulnerabilityCategory } from '../types';
import { QRModal } from '../components/QRModal';
import { exportHouseholdsToCSV } from '../utils/csvExport';

export const HouseholdsView: React.FC = () => {
  const { households, setActiveTab, setSelectedReliefId, transactions, showToast } = useRelief();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVulnerability, setSelectedVulnerability] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  
  const [selectedModalHousehold, setSelectedModalHousehold] = useState<Household | null>(null);

  const vulnerabilityList: VulnerabilityCategory[] = [
    'Displaced',
    'Elderly household',
    'Disability',
    'Children',
    'Pregnant member',
    'Severe economic hardship',
    'Other'
  ];

  // Calculate vulnerability category counts
  const vulnerabilityCounts: Record<string, number> = {
    ALL: households.length
  };

  vulnerabilityList.forEach(cat => {
    vulnerabilityCounts[cat] = households.filter(h => 
      h.vulnerability && h.vulnerability.includes(cat)
    ).length;
  });

  // Calculate status counts
  const statusCounts = {
    ALL: households.length,
    Verified: households.filter(h => h.status === 'Verified').length,
    'Pending Review': households.filter(h => h.status === 'Pending Review').length,
    Flagged: households.filter(h => h.status === 'Flagged').length
  };

  // Filter logic
  const filteredHouseholds = households.filter((h) => {
    const matchesSearch = 
      h.reliefId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.representativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.currentLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVulnerability = 
      selectedVulnerability === 'ALL' || 
      (h.vulnerability && h.vulnerability.includes(selectedVulnerability as VulnerabilityCategory));

    const matchesStatus = statusFilter === 'ALL' || h.status === statusFilter;
    const matchesLocation = locationFilter === 'ALL' || h.currentLocation.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesVulnerability && matchesStatus && matchesLocation;
  });

  const activeFiltersCount = 
    (selectedVulnerability !== 'ALL' ? 1 : 0) + 
    (statusFilter !== 'ALL' ? 1 : 0) + 
    (locationFilter !== 'ALL' ? 1 : 0) + 
    (searchTerm.trim() !== '' ? 1 : 0);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedVulnerability('ALL');
    setStatusFilter('ALL');
    setLocationFilter('ALL');
  };

  const getLastAidForHousehold = (reliefId: string): string => {
    const htx = transactions.filter(t => t.reliefId.toUpperCase() === reliefId.toUpperCase());
    if (htx.length === 0) return 'No Aid Recorded';
    const newest = htx.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    return `${newest.aidType} (${newest.date})`;
  };

  const handleExportCSV = () => {
    exportHouseholdsToCSV(filteredHouseholds);
    showToast(
      'success',
      'CSV Export Downloaded',
      `Successfully exported ${filteredHouseholds.length} household records to CSV for external reporting.`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Title Bar */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" /> Identity Register & Vulnerability Index
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Household Relief Registry
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            Filter households by vulnerability profile, status, or distribution location for targeted field response.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors border border-slate-700"
            title="Export current filtered view to CSV file"
          >
            <Download className="w-4 h-4 text-emerald-400" /> EXPORT CSV ({filteredHouseholds.length})
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" /> + REGISTER HOUSEHOLD
          </button>
        </div>
      </div>

      {/* Advanced Filter Control Station */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        
        {/* Search & Location Select Header */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Relief ID, Representative Name, or Village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Location Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <MapPin className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full md:w-48 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="ALL">All Sectors & Camps</option>
              <option value="Khairpur">Khairpur Sector</option>
              <option value="Sukkur">Sukkur Camp</option>
              <option value="Larkana">Larkana Camp</option>
            </select>
          </div>
        </div>

        {/* Vulnerability Category Filter Chips */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
            <span className="flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-600" /> Vulnerability Filter Chips:
            </span>
            <span className="text-slate-500 font-mono">
              Showing {filteredHouseholds.length} of {households.length}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedVulnerability('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                selectedVulnerability === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <span>All Categories</span>
              <span className="px-1.5 py-0.2 bg-slate-800 text-white text-[10px] rounded-full font-mono">
                {vulnerabilityCounts.ALL}
              </span>
            </button>

            {vulnerabilityList.map((cat) => {
              const isSelected = selectedVulnerability === cat;
              const count = vulnerabilityCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedVulnerability(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <Tag className="w-3 h-3 opacity-70" />
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                    isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-800'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-600 mr-1">
              Status:
            </span>
            {['ALL', 'Verified', 'Pending Review', 'Flagged'].map((st) => {
              const isSel = statusFilter === st;
              const cnt = statusCounts[st as keyof typeof statusCounts] || 0;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all border ${
                    isSel
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {st} ({cnt})
                </button>
              );
            })}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear All Filters ({activeFiltersCount})
            </button>
          )}
        </div>

      </div>

      {/* Household Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
            Matching Household Records ({filteredHouseholds.length})
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Privacy Safe: Contact phone redacted in summary table view
          </span>
        </div>

        {filteredHouseholds.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Filter className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-sm text-slate-800">No Households Match Selected Filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query or clearing vulnerability category chips to display records.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Relief ID</th>
                  <th className="py-3 px-4">Representative</th>
                  <th className="py-3 px-4">Vulnerability Badges</th>
                  <th className="py-3 px-4">Location Sector</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4">Last Aid Record</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHouseholds.map((hh) => {
                  const lastAid = getLastAidForHousehold(hh.reliefId);
                  return (
                    <tr key={hh.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Relief ID */}
                      <td className="py-3.5 px-4 font-mono font-extrabold text-slate-950">
                        {hh.reliefId}
                      </td>

                      {/* Representative & Family */}
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-slate-900 block text-xs">
                          {hh.representativeName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-semibold">
                          {hh.familySize} Family Members
                        </span>
                      </td>

                      {/* Vulnerability Tags */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {hh.vulnerability && hh.vulnerability.length > 0 ? (
                            hh.vulnerability.map((v) => (
                              <span
                                key={v}
                                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 shrink-0"
                              >
                                {v}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[11px]">Standard</span>
                          )}
                        </div>
                      </td>

                      {/* Current Location */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {hh.currentLocation}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          hh.status === 'Verified'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {hh.status}
                        </span>
                      </td>

                      {/* Last Aid */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {lastAid}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right space-x-1.5 shrink-0">
                        <button
                          onClick={() => setSelectedModalHousehold(hh)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-lg transition-colors border border-slate-200 inline-flex items-center gap-1"
                          title="Print QR Relief Card"
                        >
                          <QrCode className="w-3 h-3 text-slate-600" /> QR Card
                        </button>
                        <button
                          onClick={() => {
                            setSelectedReliefId(hh.reliefId);
                            setActiveTab('profile');
                          }}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-lg transition-colors inline-flex items-center gap-1"
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
        )}
      </div>

      {/* QR Modal when clicking QR Card in list */}
      {selectedModalHousehold && (
        <QRModal
          isOpen={!!selectedModalHousehold}
          household={selectedModalHousehold}
          onClose={() => setSelectedModalHousehold(null)}
        />
      )}

    </div>
  );
};
