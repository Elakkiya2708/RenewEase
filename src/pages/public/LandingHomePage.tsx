import React, { useState } from 'react';
import { PublicNavTab } from '../../components/public/PublicNavbar';
import {
  ShieldCheck,
  Bell,
  FileText,
  ArrowRight,
  AlertTriangle,
  Clock,
  ChevronRight,
  Sparkles,
  Check
} from 'lucide-react';
import hero3dClean from '../../assets/hero-3d-clean.png';

interface LandingHomePageProps {
  onNavigate: (tab: PublicNavTab) => void;
  onGoToLogin: () => void;
  onGoToRegister: () => void;
}

export const LandingHomePage: React.FC<LandingHomePageProps> = ({
  onNavigate,
  onGoToLogin,
  onGoToRegister
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'All' | 'Contracts' | 'Licenses' | 'Insurance' | 'Subscriptions'>('All');

  // Simulated live preview records for interactive showcase
  const previewItems = [
    {
      title: 'AWS Enterprise Cloud Support',
      category: 'Contracts',
      vendor: 'Amazon Web Services, Inc.',
      dueDate: 'In 15 Days',
      cost: '$28,500/yr',
      status: 'Active',
      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      action: 'Renegotiation Scheduled'
    },
    {
      title: 'Salesforce Enterprise CRM License',
      category: 'Subscriptions',
      vendor: 'Salesforce, Inc.',
      dueDate: 'In 4 Days',
      cost: '$14,400/yr',
      status: 'Expiring Soon',
      statusColor: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      action: 'PO Approval Pending'
    },
    {
      title: 'Commercial General Liability Policy',
      category: 'Insurance',
      vendor: 'Travelers Casualty Insurance',
      dueDate: '5 Days Overdue',
      cost: '$18,200/yr',
      status: 'Overdue',
      statusColor: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
      action: 'Immediate Binder Renewal'
    },
    {
      title: 'ISO 27001 Security Audit Cert',
      category: 'Licenses',
      vendor: 'BSI Assurance Americas',
      dueDate: 'In 45 Days',
      cost: '$6,500/yr',
      status: 'Active',
      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      action: 'Auditor Retained'
    }
  ];

  const filteredPreview = activeCategoryFilter === 'All'
    ? previewItems
    : previewItems.filter(i => i.category === activeCategoryFilter);

  return (
    <div className="w-full bg-slate-50 dark:bg-[#070e1b] text-slate-900 dark:text-white transition-colors">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-blue-50/60 via-slate-50 to-white dark:from-[#0a192f]/50 dark:via-[#070e1b] dark:to-[#070e1b]">
        {/* Ambient background glow circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
              <span>Smart Enterprise Renewal & Compliance Lifecycle Platform</span>
            </div>

            {/* Exact Required Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Never Miss a Renewal Again.
            </h1>

            {/* Exact Required Description */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Manage contracts, licenses, certifications, insurance policies, warranties, and subscriptions in one secure place. Get timely reminders and stay ahead of every renewal.
            </p>

            {/* Hero CTA Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGoToRegister}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 hover:from-blue-800 hover:to-indigo-800 text-white shadow-xl shadow-blue-950/20 hover:shadow-indigo-950/30 transition-all cursor-pointer flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('features')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-white dark:bg-[#0c1829] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Explore Features</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Installation Required</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Pre-Populated Demo Sandbox</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Private Isolated Workspace</span>
              </span>
            </div>

          </div>

          {/* INTERACTIVE DASHBOARD PREVIEW */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1829] shadow-2xl overflow-hidden transition-all">
              
              {/* Window Mockup Header Bar */}
              <div className="px-5 py-3.5 bg-slate-100 dark:bg-[#091424] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  <span className="ml-3 text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                    RenewEase Personal Workspace — Live Demonstration
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Monitoring Active</span>
                  </span>
                </div>
              </div>

              {/* Interactive Dashboard Content Inside Window */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Metric Summary Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60">
                    <div className="text-xs text-blue-900 dark:text-blue-300 font-bold uppercase tracking-wider">Active Assets</div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">14</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Across 7 categories</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60">
                    <div className="text-xs text-amber-900 dark:text-amber-300 font-bold uppercase tracking-wider">Expiring Soon</div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">3</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Within 30-day window</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60">
                    <div className="text-xs text-rose-900 dark:text-rose-300 font-bold uppercase tracking-wider">Overdue Action</div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">1</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Requires binder renewal</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60">
                    <div className="text-xs text-indigo-900 dark:text-indigo-300 font-bold uppercase tracking-wider">Tracked Budget</div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">$67,600</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Annual commitment</div>
                  </div>
                </div>

                {/* Filter Tabs in Preview */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {(['All', 'Contracts', 'Licenses', 'Insurance', 'Subscriptions'] as const).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          activeCategoryFilter === cat
                            ? 'bg-blue-900 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Click items to preview automated workflows
                  </div>
                </div>

                {/* Table Simulation */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-3 px-4 font-bold">Renewal Item</th>
                        <th className="py-3 px-4 font-bold">Category</th>
                        <th className="py-3 px-4 font-bold">Expiry Timeline</th>
                        <th className="py-3 px-4 font-bold">Cost</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-4 font-bold">Automated Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredPreview.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                            <div>{item.title}</div>
                            <div className="text-[11px] font-normal text-slate-500">{item.vendor}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                            {item.category}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                            {item.dueDate}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                            {item.cost}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold border ${item.statusColor}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-blue-900 dark:text-indigo-400 font-semibold text-[11px]">
                            {item.action}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Launch Interactive Workspace Teaser */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/10 shrink-0">
                      <Bell className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Simulated Notification Engine Active</h4>
                      <p className="text-xs text-blue-200">Test live email dispatch previews and automatic reminders immediately upon sign-in.</p>
                    </div>
                  </div>
                  <button
                    onClick={onGoToLogin}
                    className="px-4 py-2 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
                  >
                    Launch Live Workspace
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. THE RENEWAL PAIN & SOLUTION SECTION */}
      <section className="py-20 bg-white dark:bg-[#0c1829] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Why Unmanaged Renewals Cost Businesses Thousands
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Without an automated centralized renewal repository, teams fall victim to missed deadlines, compliance lapses, and unwanted price hikes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#070e1b] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Unwanted Auto-Renewals
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Vendors quietly lock organizations into annual renewals without notice. RenewEase alerts you 60, 30, and 15 days in advance so you can renegotiate or cancel in time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#070e1b] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Operating Without Coverage
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                A lapsed commercial liability policy or expired ISO certification exposes companies to regulatory fines and audit penalties. RenewEase keeps critical permits continuously active.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#070e1b] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Lost Contracts & Documents
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Agreements, warranty cards, and insurance policy schedules scattered across personal inboxes. RenewEase stores digital PDFs right alongside the renewal record.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CORE PLATFORM PILLARS (3D HERO ILLUSTRATION HIGHLIGHT) */}
      <section className="py-20 bg-slate-50 dark:bg-[#070e1b] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Description */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Engineered for Reliability</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                One Single Pane of Glass For Every Renewal Across Your Organization
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Whether you manage high-value enterprise cloud commitments, municipal permits, professional medical or engineering licenses, or equipment warranties, RenewEase organizes everything systematically.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Multi-Stage Automated Notification Pipeline</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Custom lead-schedule thresholds (60, 45, 30, 15, 7, 3, 1 days) with simulated SMTP delivery and urgent overdue escalations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Historical Renegotiation & Cost Variance Ledger</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Every renewed contract logs the previous cost, new cost, and delta, giving you unshakeable leverage during vendor negotiations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">100% Isolated Private User Vaults</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Each user account is fully isolated. No shared, leaked, or mixed renewal data between users.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onNavigate('features')}
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-900 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <span>Explore the complete feature specification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column 3D Graphic */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="relative w-full max-w-lg p-6 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-950 to-[#070e1b] shadow-2xl overflow-hidden border border-slate-700">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-3xl pointer-events-none" />
                <img
                  src={hero3dClean}
                  alt="RenewEase 3D Workflow Preview"
                  className="w-full h-auto object-contain drop-shadow-2xl animate-float-slow select-none"
                />
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <span>Interactive Renewal Tracking</span>
                  <span className="font-bold text-blue-300">Production Ready</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. CALL TO ACTION SECTION */}
      <section className="py-20 bg-gradient-to-br from-[#0a192f] via-[#0f2240] to-[#070e1b] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center mx-auto shadow-xl">
            <ShieldCheck className="w-8 h-8 text-indigo-300" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Take Command of Your Renewal Deadlines Today.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Create your isolated personal workspace in under 30 seconds. Realistic sample data across contracts, licenses, and policies is pre-seeded for immediate testing.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGoToRegister}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold bg-white text-blue-950 hover:bg-slate-100 shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGoToLogin}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all cursor-pointer"
            >
              Sign In to Existing Workspace
            </button>
          </div>

          <p className="text-xs text-slate-400 pt-2">
            RenewEase • Academic Capstone Project Demonstration
          </p>
        </div>
      </section>

    </div>
  );
};
