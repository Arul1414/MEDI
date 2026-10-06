import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, X, ArrowLeft } from 'lucide-react';

export const AccessDeniedToast: React.FC = () => {
  const { accessDeniedMessage, clearAccessDeniedMessage } = useAuth();

  if (!accessDeniedMessage) return null;

  return (
    <div
      id="access-denied-toast"
      className="fixed top-5 right-5 z-50 max-w-md w-full animate-in slide-in-from-top-3 fade-in duration-200"
      role="alert"
    >
      <div className="bg-white border-2 border-rose-300 rounded-2xl p-4 shadow-2xl shadow-rose-900/15 flex items-start gap-3 text-slate-800">
        <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700">
              Access Restricted
            </h4>
            <button
              onClick={clearAccessDeniedMessage}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
              aria-label="Dismiss alert"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {accessDeniedMessage}
          </p>
          <div className="mt-2 text-[10px] text-slate-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Redirected to primary Dashboard</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AccessDeniedFallback: React.FC<{ onGoDashboard: () => void; pageName?: string }> = ({
  onGoDashboard,
  pageName = 'this module',
}) => {
  const { role } = useAuth();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-rose-200 rounded-3xl p-8 text-center shadow-lg shadow-rose-950/5 space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 stroke-[2]" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Access Denied</h2>
          <p className="text-xs text-slate-600 mt-2">
            Your current role (<span className="font-mono font-bold text-rose-700">{role}</span>) does not have
            authorization to view {pageName}.
          </p>
        </div>
        <button
          onClick={onGoDashboard}
          className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
};
