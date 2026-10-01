import React, { useState } from 'react';
import { UserPlus, QrCode as QrIcon, CheckCircle2, ShieldCheck, Printer, ArrowRight } from 'lucide-react';
import { useRelief } from '../context/ReliefContext';
import { VulnerabilityCategory, Household } from '../types';
import { QRModal } from '../components/QRModal';

export const RegisterHouseholdView: React.FC = () => {
  const { registerHousehold, currentWorker, setActiveTab, setSelectedReliefId } = useRelief();

  // Form state
  const [representativeName, setRepresentativeName] = useState('');
  const [familySize, setFamilySize] = useState<number>(5);
  const [currentLocation, setCurrentLocation] = useState('Khairpur Sector 4 Camp');
  const [previousLocationInput, setPreviousLocationInput] = useState('Kot Diji Flood Plain');
  const [phone, setPhone] = useState('');
  const [govDocumentRef, setGovDocumentRef] = useState('');
  const [selectedVulnerabilities, setSelectedVulnerabilities] = useState<VulnerabilityCategory[]>([
    'Displaced', 'Children'
  ]);
  const [notes, setNotes] = useState('');

  // Registered result card
  const [registeredHousehold, setRegisteredHousehold] = useState<Household | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const vulnerabilityOptions: VulnerabilityCategory[] = [
    'Displaced',
    'Elderly household',
    'Disability',
    'Children',
    'Pregnant member',
    'Severe economic hardship',
    'Other'
  ];

  const handleVulnerabilityToggle = (vuln: VulnerabilityCategory) => {
    if (selectedVulnerabilities.includes(vuln)) {
      setSelectedVulnerabilities(selectedVulnerabilities.filter(v => v !== vuln));
    } else {
      setSelectedVulnerabilities([...selectedVulnerabilities, vuln]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!representativeName.trim() || !currentLocation.trim()) return;

    const previousLocations = previousLocationInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newHh = registerHousehold({
      representativeName: representativeName.trim(),
      familySize: Number(familySize) || 1,
      currentLocation: currentLocation.trim(),
      previousLocations: previousLocations.length > 0 ? previousLocations : [currentLocation.trim()],
      phone: phone.trim() || undefined,
      govDocumentRef: govDocumentRef.trim() || undefined,
      vulnerability: selectedVulnerabilities,
      notes: notes.trim() || undefined,
      registeredByOrgId: currentWorker.organizationId,
      registeredByOrgName: currentWorker.organizationName
    });

    setRegisteredHousehold(newHh);
  };

  const handleResetForm = () => {
    setRegisteredHousehold(null);
    setRepresentativeName('');
    setFamilySize(5);
    setPhone('');
    setGovDocumentRef('');
    setNotes('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-black uppercase tracking-wider mb-1">
          <UserPlus className="w-4 h-4" /> Relief Identity Registration
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Register Household & Issue Portable Relief ID
        </h1>
        <p className="text-slate-600 text-xs mt-1 font-medium">
          Registration is inclusive and offline-capable. Government ID is optional so no disaster victim is turned away.
        </p>
      </div>

      {registeredHousehold ? (
        /* Success Screen showing generated RELIEF ID card */
        <div className="bg-white rounded-3xl border-2 border-emerald-500 p-6 lg:p-8 space-y-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3 text-emerald-700">
            <CheckCircle2 className="w-8 h-8 shrink-0" />
            <div>
              <h2 className="text-xl font-black text-slate-900">Household Successfully Registered</h2>
              <p className="text-xs text-slate-600 font-medium">
                Verifiable Relief ID created and cryptographically ready for aid distribution.
              </p>
            </div>
          </div>

          <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4 border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-black text-emerald-400">RELIEFLEDGER OFFICIAL CARD</span>
              <span className="text-xs px-2.5 py-0.5 bg-emerald-600 text-white font-black rounded-md">VERIFIED</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 text-xs block uppercase font-bold">Assigned Relief ID</span>
                <span className="text-2xl font-mono font-black text-emerald-400 tracking-wider">
                  {registeredHousehold.reliefId}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block uppercase font-bold">Representative</span>
                <span className="text-lg font-black text-white">{registeredHousehold.representativeName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block uppercase font-bold">Family Members</span>
                <span className="text-sm font-bold text-slate-200">{registeredHousehold.familySize} Persons</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block uppercase font-bold">Current Village / Sector</span>
                <span className="text-sm font-bold text-slate-200">{registeredHousehold.currentLocation}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-md shadow-emerald-950/20 transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" /> DOWNLOAD / PRINT RELIEF CARD & QR
            </button>

            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  setSelectedReliefId(registeredHousehold.reliefId);
                  setActiveTab('record-aid');
                }}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl flex items-center gap-2 transition-colors shadow-xs"
              >
                RECORD AID NOW <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetForm}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs rounded-xl transition-colors"
              >
                + Register Another
              </button>
            </div>
          </div>

          {/* Modal for QR & Printing */}
          <QRModal
            household={registeredHousehold}
            isOpen={isQRModalOpen}
            onClose={() => setIsQRModalOpen(false)}
          />
        </div>
      ) : (
        /* Form View Card */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-600" />
          <div className="p-6 lg:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Household Representative Name */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  Household Representative Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mahmood"
                  value={representativeName}
                  onChange={(e) => setRepresentativeName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Number of Family Members */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  Number of Family Members <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={familySize}
                  onChange={(e) => setFamilySize(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Village / Current Location */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  Village / Current Location Sector <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Khairpur Sector 4 Camp"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Previous Location */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  Previous / Origin Location (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kot Diji Village"
                  value={previousLocationInput}
                  onChange={(e) => setPreviousLocationInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Phone Number (Optional) */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  Phone Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. +92 301 5550192"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Government Doc Ref (Optional) */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  Government Document Ref / CNIC (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CNIC / Refugee Pass Ref if available"
                  value={govDocumentRef}
                  onChange={(e) => setGovDocumentRef(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <p className="text-[10px] text-slate-500 mt-1 font-medium">
                  Notice: Government ID is NOT required to receive humanitarian assistance.
                </p>
              </div>
            </div>

            {/* Vulnerability Options Checkboxes */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                Vulnerability Category Selectors
              </label>
              <div className="flex flex-wrap gap-2">
                {vulnerabilityOptions.map((vuln) => {
                  const isChecked = selectedVulnerabilities.includes(vuln);
                  return (
                    <button
                      key={vuln}
                      type="button"
                      onClick={() => handleVulnerabilityToggle(vuln)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                        isChecked
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-black ring-1 ring-emerald-300'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : ''}{vuln}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                Field Worker Assessment & Special Household Notes
              </label>
              <textarea
                rows={3}
                placeholder="Record special needs, e.g., infant formula required, wheelchair access required..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Registering as: <strong className="text-slate-800 font-black">{currentWorker.name} ({currentWorker.organizationName})</strong>
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 active:scale-95 transition-all"
              >
                <UserPlus className="w-4 h-4" /> GENERATE RELIEF ID & CARD
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
