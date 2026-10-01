import React, { useState } from 'react';
import { X, QrCode, Scan, Search, CheckCircle } from 'lucide-react';
import { useRelief } from '../context/ReliefContext';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (reliefId: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const { households } = useRelief();
  const [manualId, setManualId] = useState('');
  const [isScanningSimulated, setIsScanningSimulated] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (id: string) => {
    setIsScanningSimulated(true);
    setTimeout(() => {
      setIsScanningSimulated(false);
      onScanSuccess(id);
      onClose();
    }, 600);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      onScanSuccess(manualId.trim().toUpperCase());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm tracking-wide">SCAN RELIEF QR CODE</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Simulated Scanner Viewport Frame */}
          <div className="relative aspect-4/3 bg-slate-950 rounded-xl overflow-hidden border-2 border-emerald-500/50 flex flex-col items-center justify-center p-4">
            {/* Corner Bracket Overlays */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-400" />

            {/* Laser Line Animation */}
            <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce my-auto" />

            <div className="text-center z-10 bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-white text-xs">
              {isScanningSimulated ? (
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle className="w-4 h-4 animate-pulse" />
                  <span>QR Code Detected! Processing...</span>
                </div>
              ) : (
                <span>Position Household QR Code within viewfinder or select demo card below</span>
              )}
            </div>
          </div>

          {/* Quick Tap Demo Household IDs */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Quick Scan Demo Households:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {households.slice(0, 4).map((h) => (
                <button
                  key={h.id}
                  onClick={() => handleSelect(h.reliefId)}
                  className="p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-left transition-colors group"
                >
                  <div className="font-mono text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                    {h.reliefId}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {h.representativeName}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Entry Fallback */}
          <form onSubmit={handleManualSubmit} className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Manual Relief ID Entry
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. RL-KHP-7F3A92"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-semibold uppercase focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors"
              >
                Find
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
