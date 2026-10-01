import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Printer, Download, ShieldCheck, QrCode as QrIcon } from 'lucide-react';
import { Household } from '../types';

interface QRModalProps {
  household: Household;
  isOpen: boolean;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ household, isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        household.reliefId,
        {
          width: 220,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        },
        (error) => {
          if (error) console.error('Error generating QR code:', error);
        }
      );
    }
  }, [isOpen, household]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm tracking-wide">RELIEF CARD & QR CODE</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Relief Card Body */}
        <div className="p-6 space-y-4 print:p-0" id="printable-card">
          <div className="p-5 rounded-xl border-2 border-slate-800 bg-slate-50 text-slate-900 space-y-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 block">
                  VERIFIED DISASTER RELIEF ID
                </span>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">RELIEFLEDGER</h2>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2.5 py-1 rounded">
                PORTABLE ID
              </span>
            </div>

            {/* QR Code Canvas */}
            <div className="flex flex-col items-center justify-center py-2 bg-white rounded-lg border border-slate-200">
              <canvas ref={canvasRef} className="max-w-[200px] h-auto" />
              <div className="mt-2 text-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Relief ID</span>
                <span className="text-xl font-mono font-extrabold tracking-wider text-slate-900">
                  {household.reliefId}
                </span>
              </div>
            </div>

            {/* Household Meta Details */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Representative</span>
                <span className="font-bold text-slate-900 truncate block">{household.representativeName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Family Size</span>
                <span className="font-bold text-slate-900">{household.familySize} Members</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Location Area</span>
                <span className="font-semibold text-slate-800 truncate block">{household.currentLocation}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Registered Date</span>
                <span className="font-semibold text-slate-800">{household.registrationDate}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 text-center italic border-t border-slate-200 pt-2">
              Privacy Protected: QR encodes ONLY Relief ID. No personal data inside QR payload.
            </p>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg flex items-center gap-2 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" /> Print / Save Relief Card
          </button>
        </div>
      </div>
    </div>
  );
};
