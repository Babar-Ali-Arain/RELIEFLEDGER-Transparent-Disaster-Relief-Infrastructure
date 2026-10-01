import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  const dimensions = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base'
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Emblem SVG Shield & Chain */}
      <div className={`${dimensions} bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-emerald-950/20 ring-1 ring-white/20 shrink-0 relative overflow-hidden group`}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-3/5 h-3/5 text-white transform group-hover:scale-110 transition-transform"
        >
          {/* Shield Outline */}
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          {/* Checkmark inside */}
          <path d="M9 12l2 2 4-4" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-black tracking-wider text-slate-900 uppercase leading-none text-sm sm:text-base">
            RELIEF<span className="text-emerald-600">LEDGER</span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
            VERIFIABLE AID NET
          </span>
        </div>
      )}
    </div>
  );
};
