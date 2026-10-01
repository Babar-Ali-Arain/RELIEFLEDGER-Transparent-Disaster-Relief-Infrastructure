import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Smartphone, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useRelief } from '../context/ReliefContext';

export const MfaView: React.FC = () => {
  const { currentUser, verifyMfa, logout } = useRelief();
  const [otpCode, setOtpCode] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'Authenticator App' | 'SMS OTP' | 'Email OTP'>('Authenticator App');
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyMfa(otpCode)) {
      setVerifiedSuccess(true);
    }
  };

  const handleQuickFillDemo = () => {
    setOtpCode('123456');
    verifyMfa('123456');
    setVerifiedSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-8 space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-2 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl mx-auto flex items-center justify-center mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Verify Your Identity</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            For security, enter the verification code sent to your registered authentication method.
          </p>
        </div>

        {verifiedSuccess ? (
          <div className="py-8 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900">✓ Identity Verified</h3>
            <p className="text-xs text-slate-500">Redirecting to ReliefLedger Dashboard...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Meta Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Worker</span>
                <span className="font-extrabold text-slate-900">
                  {currentUser?.name || 'Zubair Ahmed'} ({currentUser?.workerCode || 'FW-1028'})
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Method</span>
                <span className="font-semibold text-emerald-700">{selectedMethod}</span>
              </div>
            </div>

            {/* Demo Code Banner */}
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between text-xs text-amber-950">
              <span className="font-extrabold font-mono">DEMO CODE: 123456</span>
              <button
                type="button"
                onClick={handleQuickFillDemo}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] transition-colors"
              >
                Auto-Fill 123456
              </button>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center text-2xl font-mono tracking-[0.5em] font-extrabold px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                VERIFY & CONTINUE
              </button>
            </form>

            {/* Method Switcher */}
            <div className="pt-2 border-t border-slate-100 text-center space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Use Another Method:
              </span>
              <div className="flex justify-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('Authenticator App')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border ${
                    selectedMethod === 'Authenticator App' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Authenticator
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('SMS OTP')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border ${
                    selectedMethod === 'SMS OTP' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  SMS OTP
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('Email OTP')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border ${
                    selectedMethod === 'Email OTP' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Email OTP
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={logout}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
