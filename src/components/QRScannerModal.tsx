import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, Upload, AlertCircle } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (scannedText: string) => void;
  title?: string;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  title = 'SCAN RELIEF CARD QR CODE'
}) => {
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerElementId = 'html5qr-code-full-region';

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (scannerRef.current && scannerRef.current.isScanning) {
          scannerRef.current.stop().catch(() => {});
        }
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    let html5Qrcode: Html5Qrcode | null = null;

    if (isOpen) {
      setScannerError(null);
      
      try {
        html5Qrcode = new Html5Qrcode(readerElementId);
        scannerRef.current = html5Qrcode;

        html5Qrcode.start(
          { facingMode: 'environment' }, // Prefer back camera on mobile
          {
            fps: 10,
            qrbox: { width: 220, height: 220 }
          },
          (decodedText) => {
            if (decodedText) {
              if (html5Qrcode && html5Qrcode.isScanning) {
                html5Qrcode.stop().catch((err) => console.error('Error stopping scanner:', err));
              }
              onScanSuccess(decodedText);
              onClose();
            }
          },
          () => {}
        ).then(() => {
          setCameraActive(true);
        }).catch((err) => {
          console.warn('Camera access prevented or unavailable:', err);
          setScannerError('Camera access unavailable. Select a preset demo Relief ID or upload a QR image below.');
          setCameraActive(false);
        });
      } catch (e) {
        console.error('Error instantiating Html5Qrcode:', e);
      }
    }

    return () => {
      if (html5Qrcode && html5Qrcode.isScanning) {
        html5Qrcode.stop().catch((err) => console.error('Error stopping scanner cleanup:', err));
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const demoPresets = [
    { label: 'Tariq Ahmed (Khairpur)', reliefId: 'RL-KHP-7F3A92' },
    { label: 'Fatima Bibi (Khairpur)', reliefId: 'RL-KHP-1A82BD' },
    { label: 'Hassan Raza (Sukkur)', reliefId: 'RL-SUK-77AB21' },
    { label: 'Gul Hassan Khan (Sukkur)', reliefId: 'RL-SUK-91CD20' }
  ];

  const handleSimulatedScan = (reliefId: string) => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch(() => {});
    }
    onScanSuccess(reliefId);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(readerElementId);
    }

    scannerRef.current
      .scanFile(file, true)
      .then((decodedText) => {
        onScanSuccess(decodedText);
        onClose();
      })
      .catch(() => {
        setScannerError('Could not detect a valid Relief QR Code in the uploaded image.');
      });
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto"
      onClick={() => {
        if (scannerRef.current && scannerRef.current.isScanning) {
          scannerRef.current.stop().catch(() => {});
        }
        onClose();
      }}
    >
      <div 
        className="bg-white rounded-2xl max-w-lg w-[95%] sm:w-full shadow-2xl overflow-hidden border border-slate-200 my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-xs sm:text-sm tracking-wide">{title}</h3>
          </div>
          <button
            onClick={() => {
              if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(() => {});
              }
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport Area */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          <div className="relative bg-slate-950 rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[260px] flex flex-col items-center justify-center border-2 border-slate-800">
            <div id={readerElementId} className="w-full h-full text-white" />

            {scannerError && (
              <div className="p-5 text-center space-y-2 z-10">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-xs text-slate-300 font-medium max-w-xs mx-auto leading-relaxed">
                  {scannerError}
                </p>
              </div>
            )}
          </div>

          {/* Fallback File Upload & Demo Selectors */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                Select Preset Demo Relief ID:
              </span>
              <label className="text-xs text-emerald-700 font-extrabold hover:underline cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {demoPresets.map((preset) => (
                <button
                  key={preset.reliefId}
                  onClick={() => handleSimulatedScan(preset.reliefId)}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-800 text-left transition-colors flex items-center justify-between"
                >
                  <span className="truncate font-bold text-[11px]">{preset.label}</span>
                  <span className="font-mono text-[10px] text-emerald-700 font-black">{preset.reliefId}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-center shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">
            Point camera at the QR code printed on the beneficiary's Relief Card
          </span>
        </div>

      </div>
    </div>
  );
};
