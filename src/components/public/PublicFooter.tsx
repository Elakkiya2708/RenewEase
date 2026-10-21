import React from 'react';
import { PublicNavTab } from './PublicNavbar';
import { ArrowUpRight, Lock, Clock, FileCheck } from 'lucide-react';

interface PublicFooterProps {
  onSelectTab: (tab: PublicNavTab) => void;
  onGoToLogin: () => void;
  onGoToRegister: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  onSelectTab,
  onGoToLogin,
  onGoToRegister
}) => {
  const currentYear = 2026;

  const handleNav = (tab: PublicNavTab) => {
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#0a192f] text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Overview Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-900/40">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="4" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <path d="m9 16 2 2 4-4" />
                </svg>
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-white">RenewEase</span>
                <p className="text-xs text-blue-300 font-medium">Smart Renewal Management System</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pr-6">
              RenewEase is an enterprise-grade personal compliance workspace built to eliminate renewal blindspots, missed cancellation windows, and compliance lapses across corporate contracts, software licenses, warranties, insurance policies, and subscriptions.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>Isolated Vault</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Lapse SLA</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
                <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Audit-Ready</span>
              </span>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About RenewEase
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('features')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Features & Capabilities
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Core Features Column */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>Renewal Lifecycle Tracking</li>
              <li>Automated Multi-Stage Reminders</li>
              <li>Interactive Calendar View</li>
              <li>Encrypted Document Repository</li>
              <li>Annual Spend Analytics</li>
              <li>Historical Renegotiation Ledger</li>
              <li>Full-Text Instant Search</li>
            </ul>
          </div>

          {/* Get Started / Portal Column */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              User Portal
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Experience the live simulated platform with auto-populated realistic enterprise records.
            </p>
            <div className="space-y-2.5">
              <button
                onClick={onGoToRegister}
                className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-blue-700 hover:bg-blue-600 text-white transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Create Workspace</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onGoToLogin}
                className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all text-center cursor-pointer"
              >
                Sign In to Vault
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Capstone Notice */}
        <div className="mt-14 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {currentYear} RenewEase. All rights reserved. Enterprise Personal Renewal Management System.
          </p>
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Academic Capstone Demonstration • Production-Ready React & TypeScript</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
