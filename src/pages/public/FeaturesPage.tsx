import React from 'react';
import {
  ShieldCheck,
  Bell,
  Calendar,
  FileText,
  BarChart3,
  Clock,
  Search,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Download,
  Filter,
  Sliders,
  DollarSign,
  TrendingUp,
  FileCheck,
  Eye,
  Check
} from 'lucide-react';

interface FeaturesPageProps {
  onGoToRegister: () => void;
  onGoToLogin: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({
  onGoToRegister,
  onGoToLogin
}) => {
  const featureList = [
    {
      number: '01',
      title: 'Renewal Tracking',
      icon: ShieldCheck,
      iconColor: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950',
      tagline: 'Comprehensive 360° Asset Oversight',
      description: 'Systematically catalog all renewals across 7 core categories: Contracts, Software Licenses, Professional Certifications, Equipment Warranties, Commercial Insurance, SaaS Subscriptions, and Municipal Permits. Capture vital fields like billing cycles, annual costs, account numbers, vendor contacts, and automatic renewal switches.',
      bullets: [
        'Dedicated taxonomy across 7 distinct organizational categories',
        'Automatic calculation of days remaining until expiry date',
        'Dynamic status tags: Active, Expiring Soon, Overdue, and Renewed',
        'Auto-renew flag to prevent surprise charges or lapses'
      ]
    },
    {
      number: '02',
      title: 'Automated Reminders',
      icon: Bell,
      iconColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950',
      tagline: 'Multi-Stage Advance Lead Alerts',
      description: 'Configure custom notification thresholds (60, 45, 30, 15, 7, 3, and 1-day leads) so you are notified at precisely the right stage of the negotiation cycle. Includes simulated enterprise SMTP email previews demonstrating the exact dispatch payload sent to stakeholders.',
      bullets: [
        'Configurable alert lead days to match organizational procurement SLAs',
        'Real-time simulation modal showing generated HTML email notifications',
        'Urgent visual banners for overdue renewals needing binder attention',
        'Notification bell counter with read/unread status management'
      ]
    },
    {
      number: '03',
      title: 'Calendar View',
      icon: Calendar,
      iconColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950',
      tagline: 'Monthly Timeline & Schedule Visualization',
      description: 'An interactive, responsive full-calendar interface that plots renewal deadlines onto an intuitive monthly grid. Color-coded markers distinguish urgency levels, enabling procurement teams and managers to visualize monthly renewal clusters at a glance.',
      bullets: [
        'Interactive month-by-month navigation with today-view return',
        'Color-coded urgency dots (Green = Active, Amber = Soon, Red = Overdue)',
        'Click-to-view renewal detail popovers for fast context',
        'Instantly spot heavy cash-outflow months before they arrive'
      ]
    },
    {
      number: '04',
      title: 'Document Management',
      icon: FileText,
      iconColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950',
      tagline: 'Secure PDF & Policy Certificate Vault',
      description: 'Stop hunting through old email threads for policy schedules and warranty cards. Upload and link agreement PDFs, inspection certificates, and insurance binders directly to the specific renewal record with file size and timestamp tracking.',
      bullets: [
        'Direct multi-file upload support for PDFs, images, and documents',
        'Link multiple supporting documents per contract or license record',
        'Instant document download and browser preview capability',
        'Document counters directly linked on main inventory records'
      ]
    },
    {
      number: '05',
      title: 'Analytics and Reports',
      icon: BarChart3,
      iconColor: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950',
      tagline: 'Cost Breakdown & Expenditure Forecasting',
      description: 'Interactive visual charts displaying total spend by category, upcoming annual financial commitments, and monthly expense projections. Generate and download compliance-ready CSV reports with custom scope filtering in one click.',
      bullets: [
        'Visual category spending distribution charts (Contracts vs Insurance vs SaaS)',
        'Annualized spending metric calculations and upcoming cash-outflow charts',
        'One-click CSV report export with customized column parameters',
        'Executive-ready summaries for budget planning and audit verification'
      ]
    },
    {
      number: '06',
      title: 'Renewal History',
      icon: Clock,
      iconColor: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950',
      tagline: 'Permanent Renegotiation & Audit Ledger',
      description: 'Every time a contract is renewed, RenewEase archives an immutable history entry. The ledger records the previous expiration, newly negotiated term, previous cost, new cost, and precise cost delta along with renegotiation notes.',
      bullets: [
        'Complete chronological audit trail for every renewed agreement',
        'Automatic calculation of positive/negative cost variance deltas',
        'Stores invoice numbers, renewal terms, and negotiator notes',
        'Audit-ready record for corporate compliance and financial reviews'
      ]
    },
    {
      number: '07',
      title: 'Search and Filters',
      icon: Search,
      iconColor: 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950',
      tagline: 'Instant Querying Across Hundreds of Records',
      description: 'Find any record in milliseconds. Full-text search queries item titles, vendor names, account identifiers, and internal notes simultaneously, paired with multi-select category chips and urgency status filters.',
      bullets: [
        'Sub-millisecond instant search across title, vendor, and notes',
        'Filter by category: Contracts, Licenses, Certs, Insurance, Subscriptions',
        'Filter by urgency: Active, Expiring Soon, Overdue, Cancelled',
        'Multi-column sorting by expiry date, cost, priority, or title'
      ]
    },
    {
      number: '08',
      title: 'Secure Personal Dashboard',
      icon: Lock,
      iconColor: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950',
      tagline: 'Cryptographic Privacy & Tenant Isolation',
      description: 'Engineered with strict personal workspace isolation. Every database query enforces the authenticated user scope, guaranteeing zero cross-user data leakage. Includes private workspace JSON backups and instant sample seeding.',
      bullets: [
        'Strict tenant boundary enforcement: Users access only their own records',
        'Cryptographic JWT token authentication and encrypted password hashing',
        'Single-click full workspace backup JSON download',
        'Instant pre-seeded sandbox records for risk-free evaluation'
      ]
    }
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-[#070e1b] text-slate-900 dark:text-white transition-colors">
      
      {/* 1. Header Banner */}
      <section className="pt-16 pb-16 bg-gradient-to-b from-blue-50/80 via-slate-50 to-white dark:from-[#0a192f]/60 dark:via-[#070e1b] dark:to-[#070e1b] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Complete Platform Capabilities</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Enterprise Feature Suite
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Engineered specifically to solve missed renewals, compliance breaches, and budget leakages. Explore the eight core pillars powering RenewEase.
          </p>
        </div>
      </section>

      {/* 2. Feature Cards Grid */}
      <section className="py-20 bg-white dark:bg-[#0c1829] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {featureList.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.number}
                  className="rounded-3xl p-8 bg-slate-50 dark:bg-[#070e1b] border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-800 transition-all group"
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon & Number Badge */}
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${f.iconColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                        Feature {f.number}
                      </span>
                    </div>

                    {/* Titles */}
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-indigo-400 transition-colors">
                        {f.title}
                      </h3>
                      <p className="text-xs font-bold text-blue-900 dark:text-blue-400 mt-1 uppercase tracking-wider">
                        {f.tagline}
                      </p>
                    </div>

                    {/* Detailed Paragraph */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {f.description}
                    </p>

                    {/* Bullet Points */}
                    <ul className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      {f.bullets.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Bottom Action */}
                  <div className="pt-6 mt-6 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Included in all accounts</span>
                    <button
                      onClick={onGoToRegister}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      <span>Try this feature</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#0a192f] via-[#0f2240] to-[#070e1b] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Ready to Experience RenewEase in Action?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Register your private workspace in seconds. All eight features are unlocked immediately with pre-loaded realistic sample records.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGoToRegister}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold bg-white text-blue-950 hover:bg-slate-100 shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>Launch My Free Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoToLogin}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all cursor-pointer"
            >
              Sign In Instead
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
