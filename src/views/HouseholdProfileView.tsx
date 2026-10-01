import React, { useState } from 'react';
import { 
  Search, 
  QrCode, 
  PackagePlus, 
  ShieldCheck, 
  MapPin, 
  Users, 
  Calendar, 
  History, 
  AlertCircle,
  Scan
} from 'lucide-react';
import { useRelief } from '../context/ReliefContext';
import { QRModal } from '../components/QRModal';
import { QRScannerModal } from '../components/QRScannerModal';

export const HouseholdProfileView: React.FC = () => {
  const { 
    households, 
    selectedReliefId, 
    setSelectedReliefId, 
    checkOverlap, 
    setActiveTab,
    transactions
  } = useRelief();

  const [searchInput, setSearchInput] = useState(selectedReliefId);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const household = households.find(
    h => h.reliefId.toUpperCase() === selectedReliefId.toUpperCase()
  ) || households[0];

  const history = transactions.filter(
    t => t.reliefId.toUpperCase() === household?.reliefId.toUpperCase()
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSelectedReliefId(searchInput.trim().toUpperCase());
    }
  };

  if (!household) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">Household Profile Not Found</h3>
        <p className="text-xs text-slate-500">No household found for ID: {selectedReliefId}</p>
        <button
          onClick={() => setSelectedReliefId('RL-KHP-7F3A92')}
          className="px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-xl"
        >
          Load Demo Household RL-KHP-7F3A92
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2 w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Relief ID (e.g. RL-KHP-7F3A92)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors shrink-0"
          >
            Lookup Profile
          </button>
        </form>

        <button
          onClick={() => setIsScannerOpen(true)}
          className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors shrink-0"
        >
          <Scan className="w-4 h-4 text-emerald-600" /> SCAN QR
        </button>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 space-y-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-mono font-extrabold text-slate-900 tracking-wider">
                {household.reliefId}
              </span>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-full border border-emerald-200">
                ✓ {household.status}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-800 mt-1">
              Representative: {household.representativeName}
            </h2>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setSelectedReliefId(household.reliefId);
                setActiveTab('record-aid');
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors"
            >
              <PackagePlus className="w-4 h-4" /> RECORD NEW AID
            </button>
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors"
            >
              <QrCode className="w-4 h-4" /> VIEW QR & CARD
            </button>
            <button
              onClick={() => {
                setSelectedReliefId(household.reliefId);
                setActiveTab('verify');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" /> PUBLIC VERIFICATION
            </button>
          </div>
        </div>

        {/* Profile Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Current Sector / Location
            </div>
            <div className="text-sm font-bold text-slate-900">{household.currentLocation}</div>
            <div className="text-[11px] text-slate-500">
              Origin: {household.previousLocations.join(', ') || 'N/A'}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
              <Users className="w-3.5 h-3.5 text-slate-400" /> Family Composition
            </div>
            <div className="text-sm font-bold text-slate-900">{household.familySize} Members</div>
            <div className="text-[11px] text-slate-500">
              Phone: {household.phone || 'None registered'}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Registration & Provider
            </div>
            <div className="text-sm font-bold text-slate-900">{household.registrationDate}</div>
            <div className="text-[11px] text-slate-500 truncate">
              Registered by: {household.registeredByOrgName}
            </div>
          </div>
        </div>

        {/* Vulnerabilities & Field Notes */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Vulnerability Tags:</span>
            <div className="flex flex-wrap gap-1.5">
              {household.vulnerability.map((v) => (
                <span key={v} className="px-2.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-md text-xs font-medium">
                  {v}
                </span>
              ))}
            </div>
          </div>

          {household.notes && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 italic">
              <strong>Assessment Notes:</strong> {household.notes}
            </div>
          )}
        </div>
      </div>

      {/* AID HISTORY SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">VERIFIED AID DISTRIBUTION HISTORY</h3>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-700">
            Total Distributions: {history.length}
          </span>
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No aid distributions recorded yet for this household.</p>
        ) : (
          <div className="space-y-3">
            {history.map((tx) => (
              <div 
                key={tx.id}
                className="p-4 bg-slate-50/80 hover:bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-slate-900 text-white text-xs font-bold rounded">
                      {tx.aidType}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{tx.quantity}</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Organization: <strong className="text-slate-800">{tx.organizationName}</strong> · Location: {tx.location}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 truncate max-w-xl">
                    SHA-256 Hash: {tx.currentHash}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 justify-end">
                      ✓ {tx.verificationStatus.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-500 block">{tx.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <QRModal
        household={household}
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(id) => {
          setSelectedReliefId(id);
          setSearchInput(id);
        }}
      />
    </div>
  );
};
