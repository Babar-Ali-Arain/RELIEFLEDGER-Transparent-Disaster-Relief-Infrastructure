import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Printer, Download, ShieldCheck } from 'lucide-react';
import { Household } from '../types';

interface QRModalProps {
  household: Household;
  isOpen: boolean;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ household, isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `RELIEF_CARD_${household.reliefId}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 no-print-backdrop overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-[95%] sm:w-full shadow-2xl overflow-hidden border border-slate-200 my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header (Hidden during print) */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-xs sm:text-sm tracking-wide">PORTABLE RELIEF CARD TEMPLATE</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Relief Card Container */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto" id="printable-card">
          <div className="p-5 sm:p-6 rounded-2xl border-2 border-slate-900 bg-white text-slate-900 space-y-4 shadow-xs relative overflow-hidden print-card-border">
            
            {/* Card Header Lockup */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 block">
                  VERIFIED DISASTER RELIEF RECORD
                </span>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                  RELIEFLEDGER
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-extrabold uppercase bg-slate-900 text-white px-2.5 py-1 rounded-md block">
                  PORTABLE ID
                </span>
              </div>
            </div>

            {/* QR Code Canvas */}
            <div className="flex flex-col items-center justify-center py-3 bg-slate-50 rounded-xl border border-slate-300">
              <canvas ref={canvasRef} className="max-w-[180px] sm:max-w-[200px] h-auto rounded" />
              <div className="mt-2 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  PORTABLE RELIEF ID
                </span>
                <span className="text-xl sm:text-2xl font-mono font-extrabold tracking-wider text-slate-950">
                  {household.reliefId}
                </span>
              </div>
            </div>

            {/* Household Meta Details */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-200">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-extrabold">
                  Representative Name
                </span>
                <span className="font-extrabold text-slate-950 text-xs sm:text-sm truncate block">
                  {household.representativeName}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-extrabold">
                  Family Composition
                </span>
                <span className="font-extrabold text-slate-950 text-xs sm:text-sm">
                  {household.familySize} Members
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-extrabold">
                  Current Sector / Area
                </span>
                <span className="font-bold text-slate-900 truncate block">
                  {household.currentLocation}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-extrabold">
                  Registration Date
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {household.registrationDate}
                </span>
              </div>
            </div>

            {/* Privacy Safeguard Statement */}
            <div className="pt-2 border-t border-slate-200 text-center">
              <p className="text-[10px] text-slate-600 font-medium italic leading-tight">
                Privacy Protected: QR encodes ONLY Relief ID ({household.reliefId}). Contains zero private contact or government ID payload.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons (Hidden during print) */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 shrink-0 no-print">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadPng}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors border border-slate-200"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" /> Save PNG
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" /> Print Card
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
