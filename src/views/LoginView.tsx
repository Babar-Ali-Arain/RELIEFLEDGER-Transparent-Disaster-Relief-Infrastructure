import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, ArrowRight, UserCheck, Shield, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import { useRelief } from '../context/ReliefContext';
import { UserRole } from '../types';

export const LoginView: React.FC = () => {
  const { 
    login, 
    quickDemoLogin, 
    isAuthenticated, 
    isMfaVerified, 
    verifyMfa, 
    currentUser, 
    logout 
  } = useRelief();

  const [email, setEmail] = useState('fw1028@reliefledger.org');
  const [password, setPassword] = useState('password123');
  const [mfaCode, setMfaCode] = useState('123456');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      login(email.trim(), password.trim());
    }
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.trim()) {
      verifyMfa(mfaCode.trim());
    }
  };

  // State A: User is logged in but needs 2FA / MFA verification
  if (isAuthenticated && !isMfaVerified) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-950 rounded-3xl shadow-2xl border border-slate-800 p-8 text-white space-y-6 relative overflow-hidden">
          {/* Glowing Top Accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 absolute top-0 left-0" />

          <div className="text-center space-y-2 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <KeyRound className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-white">
              Multi-Factor OTP Authentication
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Enter the 6-digit security code generated for worker <strong className="text-emerald-400 font-bold">{currentUser?.name || 'Field Worker'}</strong> ({currentUser?.organizationName}).
            </p>
          </div>

          {/* MFA Form */}
          <form onSubmit={handleMfaSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  6-Digit Verification Code
                </label>
                <span className="text-[10px] text-emerald-400 font-mono font-black">Demo Code: 123456</span>
              </div>
              <input
                type="text"
                maxLength={6}
                required
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-center text-2xl font-mono font-black text-emerald-400 tracking-[0.5em] focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-950/40 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> VERIFY OTP & ENTER COMMAND HUB
            </button>
          </form>

          {/* Quick Fill Demo Code Trigger */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setMfaCode('123456');
                verifyMfa('123456');
              }}
              className="text-emerald-400 hover:underline font-black text-[11px] flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Auto-fill Demo Code (123456)
            </button>
            <button
              type="button"
              onClick={logout}
              className="text-slate-500 hover:text-slate-300 font-bold text-[11px]"
            >
              Sign Out / Switch User
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State B: Main Login Screen
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full bg-slate-950 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Brand & Product Concept */}
        <div className="p-8 lg:p-12 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 text-white flex flex-col justify-between space-y-8 border-b md:border-b-0 md:border-r border-slate-800">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                RL
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white">RELIEFLEDGER</h1>
                <p className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                  Transparent disaster-relief infrastructure
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h2 className="text-xl font-black leading-snug text-slate-100">
                One Household. One Verifiable Aid Record.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Securely record, verify and audit humanitarian aid distribution across NGOs and government emergency response teams.
              </p>
            </div>
          </div>

          {/* Quick Demo Preset Login Buttons */}
          <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
            <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider block">
              ⚡ Quick Demo 1-Click Role Login:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['Field Worker', 'Admin', 'Auditor', 'Organization Manager'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => quickDemoLogin(role)}
                  className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700/90 text-slate-100 rounded-xl text-left transition-all border border-slate-700/80 flex items-center justify-between hover:border-emerald-500/50 group active:scale-95"
                >
                  <span className="font-bold text-[11px] group-hover:text-emerald-400 transition-colors">{role}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 lg:p-12 bg-white text-slate-900 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-xl font-black tracking-tight text-slate-900">Worker Portal Sign In</h2>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-black text-[10px] rounded-full border border-emerald-200">
                SECURE PORTAL
              </span>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  Email / Worker ID
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="e.g. fw1028@reliefledger.org"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="••••••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-emerald-400" /> SIGN IN TO RELIEFLEDGER
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 font-bold flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Protected with Multi-Factor Authentication (MFA)
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
