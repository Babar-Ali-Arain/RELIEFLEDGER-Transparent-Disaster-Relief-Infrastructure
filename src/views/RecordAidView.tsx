import React, { useState, useEffect } from 'react';
import { 
  PackagePlus, 
  Scan, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  History, 
  ShieldCheck, 
  Send,
  Utensils,
  Droplets,
  Stethoscope,
  Tent,
  Banknote,
  Shirt,
  Sparkles,
  Package
} from 'lucide-react';
import { useRelief } from '../context/ReliefContext';
import { AidCategory, AidTransaction } from '../types';
import { QRScannerModal } from '../components/QRScannerModal';

export const RecordAidView: React.FC = () => {
  const { 
    selectedReliefId, 
    setSelectedReliefId, 
    households, 
    checkOverlap, 
    recordAid, 
    currentWorker,
    transactions,
    isOffline,
    setActiveTab
  } = useRelief();

  const [inputReliefId, setInputReliefId] = useState(selectedReliefId);
  const [aidCategory, setAidCategory] = useState<AidCategory>('Food');
  const [quantity, setQuantity] = useState('1x Family Monthly Rations Package (30 Days)');
  const [location, setLocation] = useState('Khairpur Sector 4 Distribution Hub');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [overlapWarning, setOverlapWarning] = useState<{
    hasOverlap: boolean;
    recentTransaction?: AidTransaction;
    daysAgo?: number;
  }>({ hasOverlap: false });

  const [forceRecordOverride, setForceRecordOverride] = useState(false);
  const [recordedResult, setRecordedResult] = useState<AidTransaction | null>(null);

  const household = households.find(
    h => h.reliefId.toUpperCase() === selectedReliefId.toUpperCase()
  ) || households[0];

  const history = transactions.filter(
    t => t.reliefId.toUpperCase() === household?.reliefId.toUpperCase()
  );

  const categories: { cat: AidCategory; icon: React.ReactNode }[] = [
    { cat: 'Food', icon: <Utensils className="w-4 h-4" /> },
    { cat: 'Water', icon: <Droplets className="w-4 h-4" /> },
    { cat: 'Medicine', icon: <Stethoscope className="w-4 h-4" /> },
    { cat: 'Tent', icon: <Tent className="w-4 h-4" /> },
    { cat: 'Cash Assistance', icon: <Banknote className="w-4 h-4" /> },
    { cat: 'Clothing', icon: <Shirt className="w-4 h-4" /> },
    { cat: 'Hygiene Kit', icon: <Sparkles className="w-4 h-4" /> },
    { cat: 'Other', icon: <Package className="w-4 h-4" /> }
  ];

  const defaultQuantities: Record<AidCategory, string> = {
    'Food': '1x Family Monthly Rations Package (30 Days)',
    'Water': '2x 20L Clean Drinking Water Containers',
    'Medicine': '1x Basic Emergency First Aid Kit',
    'Tent': '1x All-Season Weatherproof Family Shelter Tent',
    'Cash Assistance': 'PKR 15,000 Unconditional Emergency Grant',
    'Clothing': '1x Winter Blanket & Warm Family Clothing Pack',
    'Hygiene Kit': '1x Household Sanitation & Soap Kit',
    'Other': '1x Miscellaneous Emergency Aid Unit'
  };

  const handleCategorySelect = (cat: AidCategory) => {
    setAidCategory(cat);
    setQuantity(defaultQuantities[cat] || '');
    setForceRecordOverride(false);
  };

  useEffect(() => {
    if (household) {
      const overlap = checkOverlap(household.reliefId, aidCategory);
      setOverlapWarning(overlap);
    }
  }, [household, aidCategory, checkOverlap]);

  const handleIdSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputReliefId.trim()) {
      setSelectedReliefId(inputReliefId.trim().toUpperCase());
      setRecordedResult(null);
      setForceRecordOverride(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!household) return;

    if (overlapWarning.hasOverlap && !forceRecordOverride) {
      return;
    }

    const tx = await recordAid({
      reliefId: household.reliefId,
      organizationId: currentWorker.organizationId,
      organizationName: currentWorker.organizationName,
      workerId: currentWorker.id,
      workerName: currentWorker.name,
      aidType: aidCategory,
      quantity,
      date,
      location,
      notes
    });

    setRecordedResult(tx);
    setForceRecordOverride(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-black uppercase tracking-wider mb-1">
            <PackagePlus className="w-4 h-4" /> Field Aid Distribution Station
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Record Aid Transaction to Master Ledger
          </h1>
        </div>

        {isOffline && (
          <span className="px-3.5 py-1.5 bg-amber-500/15 text-amber-800 border border-amber-400 font-black text-xs rounded-full animate-pulse self-start sm:self-auto">
            ● Simulated Offline Mode
          </span>
        )}
      </div>

      {/* Target Household Lookup Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-indigo-600" />
        <div className="p-5 sm:p-6 space-y-4">
          <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
            Target Household Relief ID
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <form onSubmit={handleIdSearch} className="flex-1 flex gap-2">
              <input
                type="text"
                value={inputReliefId}
                onChange={(e) => setInputReliefId(e.target.value)}
                placeholder="Enter Relief ID e.g. RL-KHP-7F3A92"
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-black uppercase focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl transition-colors shadow-xs"
              >
                Lookup
              </button>
            </form>

            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shrink-0 shadow-md shadow-emerald-950/20 active:scale-95 transition-all"
            >
              <Scan className="w-4 h-4" /> SCAN QR CODE
            </button>
          </div>

          {/* Selected Household Summary Box */}
          {household && (
            <div className="p-4 bg-slate-50/80 border border-slate-200/90 rounded-2xl flex flex-wrap items-center justify-between text-xs gap-2">
              <div>
                <span className="font-mono font-black text-slate-950 text-sm bg-slate-200/80 px-2.5 py-0.5 rounded-md mr-2">{household.reliefId}</span>
                <span className="font-black text-slate-900">{household.representativeName}</span> ({household.familySize} Members)
              </div>
              <div className="text-slate-600 font-bold">
                Sector Location: <strong className="text-slate-900">{household.currentLocation}</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Receipt State */}
      {recordedResult ? (
        <div className="bg-white rounded-3xl border-2 border-emerald-500 p-6 sm:p-8 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-3 text-emerald-700">
            <CheckCircle2 className="w-8 h-8 shrink-0" />
            <div>
              <h3 className="text-lg font-black text-slate-900">Aid Transaction Cryptographically Hashed</h3>
              <p className="text-xs text-slate-600 font-medium">
                {isOffline ? 'Queued offline. Will sync automatically upon re-connection.' : 'Verified block hash committed to master ledger.'}
              </p>
            </div>
          </div>

          <div className="p-4.5 bg-slate-900 text-white rounded-2xl space-y-2 text-xs font-mono shadow-inner border border-slate-800">
            <div>Transaction ID: {recordedResult.id}</div>
            <div>Relief ID: {recordedResult.reliefId}</div>
            <div>Aid Category: {recordedResult.aidType} ({recordedResult.quantity})</div>
            <div>Organization: {recordedResult.organizationName}</div>
            <div className="text-emerald-400 truncate">SHA-256 Hash: {recordedResult.currentHash}</div>
          </div>

          <div className="flex flex-wrap gap-2.5 justify-end pt-2">
            <button
              onClick={() => setRecordedResult(null)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-xl transition-colors"
            >
              + Record Another Transaction
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-colors shadow-md shadow-emerald-950/20"
            >
              View Household History
            </button>
          </div>
        </div>
      ) : (
        /* Aid Distribution Form Card */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 p-6 lg:p-8 space-y-6 shadow-sm">
          
          {/* SMART OVERLAP WARNING BANNER */}
          {overlapWarning.hasOverlap && overlapWarning.recentTransaction && (
            <div className="p-5 bg-amber-50/90 border-2 border-amber-400/90 rounded-2xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-start gap-3 text-amber-900">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wide text-amber-950">
                    POTENTIAL OVERLAP ALERT — RECENT AID DETECTED
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed text-amber-900 font-medium">
                    This household received <strong>{overlapWarning.recentTransaction.aidType} ({overlapWarning.recentTransaction.quantity})</strong> from <strong>{overlapWarning.recentTransaction.organizationName}</strong>{' '}
                    <strong>{overlapWarning.daysAgo === 0 ? 'today' : `${overlapWarning.daysAgo} day(s) ago`}</strong> on {overlapWarning.recentTransaction.date}.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-100/70 rounded-xl text-xs text-amber-900 italic border border-amber-200 font-medium">
                Policy Notice: System does NOT block distribution. Disasters create evolving needs. Human field workers retain discretion to override.
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className="px-3.5 py-2 bg-amber-200/80 hover:bg-amber-200 text-amber-950 font-black text-xs rounded-xl transition-colors"
                >
                  REVIEW HOUSEHOLD HISTORY
                </button>
                <button
                  type="button"
                  onClick={() => setForceRecordOverride(true)}
                  className={`px-4 py-2 font-black text-xs rounded-xl transition-colors border ${
                    forceRecordOverride
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-amber-600 hover:bg-amber-700 text-white border-amber-500'
                  }`}
                >
                  {forceRecordOverride ? '✓ OVERRIDE APPROVED' : 'RECORD ANYWAY (OVERRIDE)'}
                </button>
              </div>
            </div>
          )}

          {/* Aid Category Selection Grid */}
          <div className="space-y-2.5">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
              Select Aid Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {categories.map(({ cat, icon }) => {
                const isSelected = aidCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`p-3.5 rounded-2xl border text-xs font-black transition-all text-left flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-950/20'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'}`}>
                      {icon}
                    </div>
                    <span className="truncate">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                Distributing Organization
              </label>
              <input
                type="text"
                disabled
                value={currentWorker.organizationName}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                Field Worker Name
              </label>
              <input
                type="text"
                disabled
                value={currentWorker.name}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                Aid Quantity & Details <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                Distribution Hub Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 mb-1.5">
              Field Notes / Special Circumstances (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Special dietary ration provided due to infant in household..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-medium">
              Hashing with: <strong className="text-slate-800 font-mono">SHA-256 Cryptographic Block Chain</strong>
            </div>

            <button
              type="submit"
              disabled={overlapWarning.hasOverlap && !forceRecordOverride}
              className={`px-6 py-2.5 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
                overlapWarning.hasOverlap && !forceRecordOverride
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-950/20'
              }`}
            >
              <Send className="w-4 h-4" /> COMMIT TRANSACTION
            </button>
          </div>
        </form>
      )}

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(id) => {
          setSelectedReliefId(id);
          setInputReliefId(id);
          setRecordedResult(null);
        }}
      />
    </div>
  );
};
