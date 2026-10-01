import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, ArrowRight, UserCheck } from 'lucide-react';
import { useRelief } from '../context/ReliefContext';
import { UserRole } from '../types';

export const LoginView: React.FC = () => {
  const { login, quickDemoLogin } = useRelief();
  const [email, setEmail] = useState('fw1028@reliefledger.org');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-slate-950 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Brand & Product Concept */}
        <div className="p-8 lg:p-12 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 text-white flex flex-col justify-between space-y-8 border-b md:border-b-0 md:border-r border-slate-800">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-extrabold text-xl shadow-md">
                RL
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">RELIEFLEDGER</h1>
                <p className="text-xs font-semibold text-emerald-400">
                  Transparent disaster-relief infrastructure
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h2 className="text-xl font-bold leading-snug">
                One Household. One Verifiable Aid Record.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Securely record, verify and audit humanitarian aid distribution across NGOs and government emergency response teams.
              </p>
            </div>
          </div>

          {/* Quick Demo Preset Login Buttons */}
          <div className="space-y-2 pt-4 border-t border-slate-800/80">
            <span className="text-[11px] font-bold uppercase text-amber-400 tracking-wider block">
              ⚡ Quick Demo One-Click Sign In:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['Field Worker', 'Admin', 'Auditor', 'Organization Manager'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => quickDemoLogin(role)}
                  className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-lg text-left transition-colors border border-slate-700/80 flex items-center justify-between"
                >
                  <span className="font-semibold text-[11px]">{role}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 lg:p-12 bg-white text-slate-900 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Worker Portal Sign In</h2>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold text-[10px] rounded-full border border-emerald-200">
                SECURE PORTAL
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email / Worker ID
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="e.g. fw1028@reliefledger.org"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="••••••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-emerald-400" /> SIGN IN TO RELIEFLEDGER
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Protected with Multi-Factor Authentication (MFA)
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
