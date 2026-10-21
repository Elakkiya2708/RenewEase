import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRenewal } from '../context/RenewalContext';
import {
  Settings,
  DollarSign,
  Calendar,
  Moon,
  Sun,
  Bell,
  Download,
  RotateCcw,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  HardDriveDownload,
  Lock
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateSettings, toggleTheme } = useAuth();
  const { resetWorkspace, renewals, history, documents } = useRenewal();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleCurrencyChange = (currency: any) => {
    updateSettings({ currency });
    triggerSaveAlert();
  };

  const handleDateFormatChange = (dateFormat: any) => {
    updateSettings({ dateFormat });
    triggerSaveAlert();
  };

  const triggerSaveAlert = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportBackup = () => {
    const backupData = {
      appName: 'RenewEase Smart Renewal Management System',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      user: user ? {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        jobTitle: user.jobTitle,
        settings: user.settings
      } : null,
      renewals,
      history,
      documents
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RenewEase_Workspace_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleResetData = async () => {
    if (confirm('Are you sure you want to restore fresh realistic sample records? Any newly created test records will be replaced.')) {
      await resetWorkspace();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Workspace Preferences & Data Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure regional currency formats, notification channels, visual themes, and local vault backups.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Workspace preferences updated successfully!</span>
        </div>
      )}

      {resetSuccess && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>Realistic sample records restored into your private workspace!</span>
        </div>
      )}

      {/* Regional & Financial Preferences */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-blue-600" />
          <span>Currency & Regional Format</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Default Financial Currency
            </label>
            <select
              value={user?.settings?.currency || 'USD'}
              onChange={e => handleCurrencyChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white font-bold"
            >
              <option value="USD">USD ($) - United States Dollar</option>
              <option value="EUR">EUR (€) - Eurozone Euro</option>
              <option value="GBP">GBP (£) - British Pound Sterling</option>
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="CAD">CAD (CA$) - Canadian Dollar</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Date Display Convention
            </label>
            <select
              value={user?.settings?.dateFormat || 'MM/DD/YYYY'}
              onChange={e => handleDateFormatChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white font-bold"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 10/24/2026)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 24/10/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Standard)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visual Theme Appearance */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Moon className="w-4 h-4 text-indigo-600" />
          <span>Interface Appearance</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#081220] border border-slate-200 dark:border-slate-800">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Color Theme Mode
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Toggle between classic executive light mode and dark navy night mode.
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-[#0c1829] border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs hover:bg-slate-100 cursor-pointer"
          >
            {user?.settings?.theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Switch to Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span>Switch to Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Data Management & Vault Backup */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <HardDriveDownload className="w-4 h-4 text-blue-600" />
          <span>Vault Backup & Data Resilience</span>
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Your renewal contracts, past cycle history, documents, and notifications are securely bound to your user ID. You can download an offline portable backup at any time or restore demo test data for demonstration.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#081220]/50 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Download Offline Backup
            </h4>
            <p className="text-xs text-slate-500">
              Export complete JSON structure of all your renewals, documents, and audit logs.
            </p>
            <button
              onClick={handleExportBackup}
              className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#081220]/50 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Reset Demo Dataset
            </h4>
            <p className="text-xs text-slate-500">
              Restore clean realistic renewals across all 7 categories (contracts, licenses, certs).
            </p>
            <button
              onClick={handleResetData}
              className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1829] text-slate-800 dark:text-slate-200 hover:bg-slate-100 font-bold text-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
              <span>Restore Sample Records</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
