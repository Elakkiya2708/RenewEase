import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, User, Building, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        company: company.trim() || 'Private Workspace',
        jobTitle: jobTitle.trim() || 'Asset Manager',
        phone: phone.trim()
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070e1b] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-900 dark:text-white transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-900 text-white flex items-center justify-center shadow-xl shadow-blue-950/20 mb-3">
          <ShieldCheck className="w-8 h-8 text-indigo-300" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create Private Workspace
        </h1>
        <p className="text-xs uppercase font-bold tracking-widest text-indigo-900 dark:text-indigo-400 mt-1">
          RenewEase — Smart Renewal Management System
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Each user receives a secure, isolated workspace. No shared or leaked records.
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

          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Automatic workspace setup: Sample records across contracts, licenses, and insurance are initialized for instant testing.</span>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 text-sm">
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sarah Jenkins"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Company / Organization
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Apex Tech Ltd."
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Job Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Operations Lead"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-sm shadow-md shadow-blue-950/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Creating Workspace...' : 'Register & Launch Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400">
            Already have an active account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="font-bold text-blue-900 dark:text-indigo-400 hover:underline cursor-pointer ml-1"
            >
              Sign In Instead →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
