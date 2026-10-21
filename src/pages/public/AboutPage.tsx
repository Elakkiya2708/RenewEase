import React from 'react';
import {
  ShieldCheck,
  Clock,
  Lock,
  ArrowRight,
  Award,
  Layers,
  FileCheck
} from 'lucide-react';

interface AboutPageProps {
  onGoToRegister: () => void;
  onGoToLogin?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onGoToRegister
}) => {
  return (
    <div className="w-full bg-slate-50 dark:bg-[#070e1b] text-slate-900 dark:text-white transition-colors">
      
      {/* 1. Header Hero */}
      <section className="pt-16 pb-16 bg-gradient-to-b from-blue-50/80 via-slate-50 to-white dark:from-[#0a192f]/60 dark:via-[#070e1b] dark:to-[#070e1b] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>About RenewEase</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            The Purpose & Architecture Behind RenewEase
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            RenewEase was created to solve one of the most persistent, expensive, and unmonitored blindspots in modern personal and corporate administration: missed renewal deadlines.
          </p>
        </div>
      </section>

      {/* 2. The Core Problem We Solve */}
      <section className="py-16 bg-white dark:bg-[#0c1829] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              The Real-World Dilemma
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every day, organizations and individuals juggle dozens of critical expiration dates across disparate tools, sticky notes, and buried inbox threads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#070e1b] border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Unmonitored Auto-Renewals & Price Hikes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Software providers and cloud vendors automatically charge corporate credit cards for underutilized licenses. Without adequate advance warning (30-60 days), users miss the cancellation window and remain locked in for another full annual term.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#070e1b] border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Regulatory Non-Compliance & Audit Failure
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Operating with an expired ISO certification, municipal permit, or commercial general liability policy exposes businesses to severe legal penalties, invalidated customer contracts, and catastrophic uninsured liability.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#070e1b] border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Zero Historical Leverage During Renegotiations
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                When renewal notices arrive at the eleventh hour, buyers lack time to pull historical invoice records or review previous renegotiated terms, forcing them to accept vendor increases without negotiation leverage.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#070e1b] border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Scattered Documents & Lost Paperwork
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Finding insurance binder schedules, warranty receipts, or service level agreements when filing a claim can take hours. RenewEase keeps the PDF document directly attached to the asset record.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. The RenewEase Solution & Architectural Principles */}
      <section className="py-16 bg-slate-50 dark:bg-[#070e1b] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              How RenewEase Solves It
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We engineered RenewEase around four fundamental design pillars:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Multi-Stage Automated Alert Engine
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                RenewEase classifies every record with dynamic status tags (Active, Expiring Soon, Overdue, Renewed). Alerts fire automatically along configurable lead thresholds (60, 45, 30, 15, 7, 3, and 1 day) so you always have sufficient runway.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Complete Data Isolation & Privacy
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Every registered user receives a strictly isolated private workspace. RenewEase enforces authenticated user scoping on every database query, ensuring zero possibility of cross-user data leakage.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Audit-Proof Historical Ledger
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                When you mark an item as renewed, RenewEase archives the exact terms, former cost, new cost, price variance, and renegotiation notes into a permanent audit trail for compliance verification.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Dual-Mode Offline & Server Resilience
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Engineered with an offline-first storage fallback. If the backend server is temporarily paused or unreachable, RenewEase transparently saves and retrieves data from encrypted local storage without interrupting user workflows.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Academic Capstone Engineering Context */}
      <section className="py-16 bg-white dark:bg-[#0c1829] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-300 flex items-center justify-center mx-auto shadow-md">
            <Award className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Academic Capstone Demonstration
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            RenewEase represents a final-year software engineering project showcasing full-stack TypeScript development, RESTful API architecture, reactive component design with React 19, and enterprise data modeling.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
              React 19 & Vite
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
              TypeScript
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
              Express & Node.js
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
              TailwindCSS
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
              JWT Authentication
            </span>
          </div>

          <div className="pt-6">
            <button
              onClick={onGoToRegister}
              className="px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explore Live Workspace Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
