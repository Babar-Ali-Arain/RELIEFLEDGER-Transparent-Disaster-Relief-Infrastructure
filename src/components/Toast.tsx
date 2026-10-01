import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useRelief } from '../context/ReliefContext';

export const ToastNotification: React.FC = () => {
  const { toast, clearToast } = useRelief();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full px-4 animate-fade-in">
      <div className={`p-4 rounded-xl border shadow-lg flex items-start justify-between gap-3 ${bgColors[toast.type]}`}>
        <div className="flex items-start gap-3">
          {icons[toast.type]}
          <div>
            <h4 className="font-semibold text-sm leading-tight">{toast.title}</h4>
            {toast.description && (
              <p className="text-xs opacity-90 mt-1 leading-relaxed">{toast.description}</p>
            )}
          </div>
        </div>
        <button
          onClick={clearToast}
          className="text-slate-400 hover:text-slate-700 transition-colors p-1"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
