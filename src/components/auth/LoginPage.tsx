import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  User as UserIcon,
  ArrowRight,
  AlertTriangle,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  Shield,
  Activity,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim()) {
      setErrorMessage('Please enter your username.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = login(username, password);
      setIsSubmitting(false);
      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    }, 150);
  };

  const handleQuickFill = (accUsername: string, accPass: string) => {
    setUsername(accUsername);
    setPassword(accPass);
    setErrorMessage(null);
    login(accUsername, accPass);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans selection:bg-sky-500 selection:text-white relative">
      {/* Top Header Strip Matching Dashboard Top Navigation */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-sky-600/20 shrink-0">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-slate-900 text-lg font-mono">
                MEDI<span className="text-sky-600">-SORT</span>
              </span>
              <span className="px-1 py-0.5 text-[9px] font-semibold bg-violet-50 text-violet-700 border border-violet-200 rounded">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight hidden sm:block">
              Biomedical Waste Management & Autonomous Segregation Platform
            </p>
          </div>
        </div>

        {/* Operational Status Pill Matching Dashboard Header */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-[11px] tracking-wider uppercase">GATEWAY ONLINE</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl my-auto">
          {/* Main Card Shell Matching Dashboard White Panels */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            {/* Header Banner Matching Dashboard Welcome Strip */}
            <div className="bg-gradient-to-r from-sky-50 via-indigo-50/40 to-blue-50 border border-sky-200/90 rounded-2xl p-5 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-sky-600/20 mx-auto flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-sky-100/70 border border-sky-200 text-sky-800 text-[10px] font-mono font-bold tracking-wider uppercase mb-1.5">
                Hospital Command Center Portal
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
                MEDI<span className="text-sky-600">-SORT</span>
              </h1>
              <p className="text-slate-600 text-xs mt-1 max-w-md mx-auto">
                Sign in to monitor real-time clinical waste telemetry, autonomous mobile fleet dispatch, and AI optical segregation.
              </p>
            </div>

            {/* Error Banner Matching System Alerts */}
            {errorMessage && (
              <div
                id="login-error-banner"
                className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in"
                role="alert"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold block text-rose-900">Authentication Failed</span>
                  <span className="text-rose-700">{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Standard Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label
                  htmlFor="login-username-input"
                  className="block text-slate-700 font-semibold mb-1.5 flex items-center gap-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5 text-sky-600" />
                  <span>Username</span>
                </label>
                <input
                  id="login-username-input"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter username (admin, manager, or staff)"
                  autoComplete="username"
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password-input"
                  className="block text-slate-700 font-semibold mb-1.5 flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter password (e.g. admin123, manager123, staff123)"
                    autoComplete="current-password"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit-button"
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 active:scale-[0.99] text-white font-bold text-xs tracking-wide shadow-md shadow-indigo-600/15 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Command Center'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Demo Quick-Login Accounts Matching Dashboard KPI Card Styles */}
            <div className="pt-5 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Demo Login Accounts</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">1-Click Sign In</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DEMO_ACCOUNTS.map((acc) => {
                  const isAdm = acc.role === 'ADMIN';
                  const isMgr = acc.role === 'WASTE_MANAGER';

                  const badgeClass = isAdm
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : isMgr
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-sky-50 text-sky-700 border-sky-200';

                  const cardGrad = isAdm
                    ? 'from-purple-50/70 to-white border-purple-200 hover:border-purple-300'
                    : isMgr
                    ? 'from-amber-50/70 to-white border-amber-200 hover:border-amber-300'
                    : 'from-sky-50/70 to-white border-sky-200 hover:border-sky-300';

                  const linkColor = isAdm ? 'text-purple-700' : isMgr ? 'text-amber-800' : 'text-sky-700';

                  return (
                    <button
                      key={acc.username}
                      id={`quick-login-${acc.username}`}
                      type="button"
                      onClick={() => handleQuickFill(acc.username, acc.password)}
                      className={`p-3.5 rounded-xl bg-gradient-to-br ${cardGrad} border shadow-xs hover:shadow-md transition-all cursor-pointer group text-left flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${badgeClass}`}>
                            {acc.role === 'WASTE_MANAGER' ? 'MANAGER' : acc.role}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 text-xs group-hover:text-sky-700 transition-colors">
                          {acc.user.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">
                          {acc.username} / {acc.password}
                        </div>
                      </div>
                      <div className={`mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-semibold ${linkColor}`}>
                        <span>Quick Login</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role Access Matrix Strip */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1.5 font-mono">
              <div className="text-[10px] uppercase font-bold text-slate-700 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-sky-600" />
                <span>Role-Based Access Control (RBAC)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] pt-1 text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                  <span><strong>ADMIN:</strong> 12 Modules (Full)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                  <span><strong>MANAGER:</strong> 10 Modules</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 shrink-0" />
                  <span><strong>STAFF:</strong> 8 Modules</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Matching Application Command Center Footer */}
      <footer className="h-14 bg-white border-t border-slate-200 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 shadow-2xs gap-2">
        <div className="flex items-center gap-1.5 text-slate-600">
          <KeyRound className="w-3.5 h-3.5 text-sky-600" />
          <span>Local Session Authentication • State preserved across refreshes</span>
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          MEDI-SORT v2.4 Enterprise • ISO 14001 / Biomedical Safety Standard
        </div>
      </footer>
    </div>
  );
};
