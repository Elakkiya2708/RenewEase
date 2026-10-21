import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('alex@example.com');
    setPassword('password123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070e1b] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-900 dark:text-white transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-900 text-white flex items-center justify-center shadow-xl shadow-blue-950/20 mb-3">
          <ShieldCheck className="w-8 h-8 text-indigo-300" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          RenewEase
        </h1>
        <p className="text-xs uppercase font-bold tracking-widest text-indigo-900 dark:text-indigo-400 mt-1">
          Smart Renewal Management System
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Sign in to your private, isolated compliance & contract workspace.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-[#0c1829] py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Demo Fill Banner for Evaluators */}
          <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-bold text-blue-900 dark:text-blue-300">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Demo Evaluator Workspace</span>
              </span>
              <button
                type="button"
                onClick={handleDemoFill}
                className="text-[11px] font-bold underline hover:text-blue-700 cursor-pointer"
              >
                Auto-Fill Demo
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              Preset with realistic contracts, licenses, certs, documents, and audit history for <strong>Dr. Julian Vance</strong>.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-sm">
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-900 rounded border-slate-300"
                />
                <span className="text-slate-600 dark:text-slate-400 font-semibold">Remember my session</span>
              </label>

              <span className="text-indigo-900 dark:text-indigo-400 font-bold hover:underline cursor-pointer">
                Private Vault Access
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-sm shadow-md shadow-blue-950/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400">
            Need a separate private workspace?{' '}
            <button
              onClick={onSwitchToRegister}
              className="font-bold text-blue-900 dark:text-indigo-400 hover:underline cursor-pointer ml-1"
            >
              Register New Account →
            </button>
          </div>
        </div>

        {/* College Project Badge */}
        <p className="text-center text-xs text-slate-400 mt-6">
          RenewEase — Smart Renewal Management System • Academic Capstone Demonstration
        </p>
      </div>
    </div>
  );
};
