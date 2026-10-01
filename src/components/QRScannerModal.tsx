import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { X, Camera, QrCode, Upload, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

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

  useEffect(() => {
    let html5Qrcode: Html5Qrcode | null = null;

    if (isOpen) {
      setScannerError(null);
      
      // Initialize html5Qrcode scanner instance
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
            // On QR code successfully scanned
            if (decodedText) {
              // Stop camera scanning
              if (html5Qrcode && html5Qrcode.isScanning) {
                html5Qrcode.stop().catch((err) => console.error('Error stopping scanner:', err));
              }
              onScanSuccess(decodedText);
              onClose();
            }
          },
          (errorMessage) => {
            // Non-fatal parse errors while searching for QR frame
          }
        ).then(() => {
          setCameraActive(true);
        }).catch((err) => {
          console.warn('Camera access prevented or unavailable:', err);
          setScannerError('Camera access unavailable or permission denied. You can select a preset demo QR or upload an image.');
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

  // Manual Demo QR Code preset triggers for instant testing without camera
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
      .catch((err) => {
        setScannerError('Could not detect a valid Relief QR Code in the uploaded image.');
      });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 space-y-0">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-sm tracking-wide">{title}</h3>
          </div>
          <button
            onClick={() => {
              if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(() => {});
              }
              onClose();
            }}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport Area */}
        <div className="p-6 space-y-4">
          <div className="relative bg-slate-950 rounded-2xl overflow-hidden min-h-[260px] flex flex-col items-center justify-center border-2 border-slate-800">
            {/* Camera Viewport Canvas element target */}
            <div id={readerElementId} className="w-full h-full text-white" />

            {scannerError && (
              <div className="p-6 text-center space-y-3 z-10">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <p className="text-xs text-slate-300 font-medium max-w-xs mx-auto leading-relaxed">
                  {scannerError}
                </p>
              </div>
            )}
          </div>

          {/* Fallback File Upload & Demo Selectors */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Or Select Preset Demo Relief ID:
              </span>
              <label className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload QR Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {demoPresets.map((preset) => (
                <button
                  key={preset.reliefId}
                  onClick={() => handleSimulatedScan(preset.reliefId)}
                  className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-800 text-left transition-colors flex items-center justify-between"
                >
                  <span className="truncate font-bold text-[11px]">{preset.label}</span>
                  <span className="font-mono text-[10px] text-emerald-700 font-extrabold">{preset.reliefId}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center">
          <span className="text-[11px] text-slate-500 font-medium">
            Point camera at the QR code printed on the beneficiary's Relief Card
          </span>
        </div>

      </div>
    </div>
  );
};
