import React from 'react';
import { useRenewal } from '../context/RenewalContext';
import { StatusBadge, PriorityBadge, CategoryBadge, CountdownBadge } from '../components/common/Badge';
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Calendar,
  RotateCw,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  PlusCircle,
  Download,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';

interface DashboardPageProps {
  onOpenAddModal: () => void;
  onOpenRenewModal: (renewal: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenAddModal,
  onOpenRenewModal
}) => {
  const {
    renewals,
    analytics,
    setCurrentView,
    setSelectedRenewalId,
    formatCurrency,
    formatDate,
    getDaysRemaining
  } = useRenewal();

  // Urgent items: Overdue or expiring in <= 7 days
  const urgentRenewals = renewals
    .filter(r => r.status !== 'Cancelled')
    .map(r => ({ ...r, days: getDaysRemaining(r.expiryDate) }))
    .filter(r => r.days <= 14)
    .sort((a, b) => a.days - b.days);

  // Upcoming items sorted by expiry date
  const upcomingRenewals = [...renewals]
    .filter(r => r.status !== 'Cancelled')
    .map(r => ({ ...r, days: getDaysRemaining(r.expiryDate) }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 6);

  const categoryColors = [
    '#1e3a8a', // navy
    '#4f46e5', // indigo
    '#7c3aed', // purple
    '#0d9488', // teal
    '#0284c7', // sky
    '#d97706', // amber
    '#e11d48'  // rose
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Workspace Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time compliance health, upcoming expiry deadlines, and portfolio expenditures.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentView('reports')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1829] text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-950/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Renewal</span>
          </button>
        </div>
      </div>

      {/* Critical Urgency Banner */}
      {urgentRenewals.length > 0 && (
        <div className="relative overflow-hidden p-4 sm:p-5 rounded-xl bg-gradient-to-r from-rose-950 via-rose-900 to-slate-900 text-white shadow-lg border border-rose-800/60">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-rose-600/30 border border-rose-400/40 text-rose-200 shrink-0">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/30 text-rose-200 border border-rose-400/30 mb-1">
                  Urgent Attention Required
                </span>
                <h3 className="text-lg font-bold text-white">
                  {urgentRenewals[0].title}
                </h3>
                <p className="text-xs text-rose-200/90 mt-0.5">
                  Vendor: <strong>{urgentRenewals[0].vendor}</strong> • Cost: <strong>{formatCurrency(urgentRenewals[0].cost)}</strong> • Expiry:{' '}
                  <strong>{formatDate(urgentRenewals[0].expiryDate)}</strong> (
                  {urgentRenewals[0].days <= 0
                    ? `Overdue by ${Math.abs(urgentRenewals[0].days)} days!`
                    : `Expires in ${urgentRenewals[0].days} days!`}
                  )
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
              <button
                onClick={() => {
                  setSelectedRenewalId(urgentRenewals[0].id);
                  setCurrentView('renewal-details');
                }}
                className="px-3.5 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-950 text-rose-100 text-xs font-semibold border border-rose-700/60 transition-colors cursor-pointer"
              >
                Inspect Record
              </button>
              <button
                onClick={() => onOpenRenewModal(urgentRenewals[0])}
                className="px-4 py-2 rounded-lg bg-white text-rose-950 font-bold text-xs shadow-md hover:bg-rose-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Renew Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Renewals */}
        <div
          onClick={() => setCurrentView('renewals')}
          className="navy-card p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Managed</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-300 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {analytics?.metrics.totalRenewals || 0}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>Contracts & licenses</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Active Renewals */}
        <div
          onClick={() => setCurrentView('renewals')}
          className="navy-card p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active & Compliant</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400">
            {analytics?.metrics.activeRenewals || 0}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>In good standing</span>
            <span className="text-[11px] font-bold text-emerald-600">Compliant</span>
          </p>
        </div>

        {/* Expiring Soon */}
        <div
          onClick={() => setCurrentView('renewals')}
          className="navy-card p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Expiring in 30 Days</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
            {analytics?.metrics.expiringSoonRenewals || 0}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>Action window open</span>
            <span className="text-[11px] font-bold text-amber-600">Pending Review</span>
          </p>
        </div>

        {/* Overdue */}
        <div
          onClick={() => setCurrentView('renewals')}
          className="navy-card p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Overdue Items</span>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-rose-600 dark:text-rose-400">
            {analytics?.metrics.overdueRenewals || 0}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>Critical compliance breach</span>
            <span className="text-[11px] font-bold text-rose-600">Immediate</span>
          </p>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Annual Expenditure
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-0.5">
                {formatCurrency(analytics?.metrics.totalAnnualSpend || 0)}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-300">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span>Estimated Monthly Run Rate:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {formatCurrency(analytics?.metrics.estimatedMonthlySpend || 0)} / mo
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Renewal Activity Timeline
              </p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                Automated Expiry Tracking
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            System automatically calculates status based on current date, dispatches configured lead reminders, and preserves historic rates upon completion.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setCurrentView('calendar')}
              className="text-xs font-bold text-blue-900 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Open Deadlines Calendar →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Monthly Renewal Spend Forecast */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Renewal Spend Distribution & Forecast
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Anticipated renewal budget distribution across calendar months
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Fiscal Year
            </span>
          </div>

          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.monthlyBreakdown || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} style={{ fontFamily: '"Times New Roman", Times, serif' }} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                  tickFormatter={val => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val) || 0), 'Expenditure']}
                  contentStyle={{
                    backgroundColor: '#0c1829',
                    borderColor: '#1e293b',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontFamily: '"Times New Roman", Times, serif'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="spend"
                  stroke="#1e3a8a"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#spendGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Breakdown Donut */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Spend by Category
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Proportion of annual budget across asset classes
            </p>
          </div>

          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.categoryBreakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="spend"
                  nameKey="category"
                >
                  {(analytics?.categoryBreakdown || []).map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val) || 0), 'Budget']}
                  contentStyle={{
                    backgroundColor: '#0c1829',
                    borderColor: '#1e293b',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontFamily: '"Times New Roman", Times, serif'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {(analytics?.categoryBreakdown || []).slice(0, 4).map((item, idx) => (
              <div key={item.category} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: categoryColors[idx % categoryColors.length] }}
                  />
                  <span className="text-slate-700 dark:text-slate-300 truncate">{item.category}</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(item.spend)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines Table */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Upcoming Expiry Deadlines
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immediate renewal obligations requiring action or PO dispatch
            </p>
          </div>

          <button
            onClick={() => setCurrentView('renewals')}
            className="text-xs font-bold text-blue-900 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Records ({renewals.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Record Title</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Vendor</th>
                <th className="pb-3">Due Date</th>
                <th className="pb-3">Cost</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {upcomingRenewals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                    No renewal records registered yet. Click{' '}
                    <button
                      onClick={onOpenAddModal}
                      className="font-bold text-blue-900 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      + Add Renewal
                    </button>{' '}
                    to start tracking your contracts, licenses, and subscriptions.
                  </td>
                </tr>
              ) : (
                upcomingRenewals.map(r => (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => {
                      setSelectedRenewalId(r.id);
                      setCurrentView('renewal-details');
                    }}
                  >
                    <td className="py-3.5 pl-2 font-bold text-slate-900 dark:text-white">
                      <div className="truncate max-w-xs">{r.title}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{r.accountNumber}</div>
                    </td>
                    <td className="py-3.5">
                      <CategoryBadge category={r.category} />
                    </td>
                    <td className="py-3.5 text-slate-700 dark:text-slate-300 font-medium">
                      {r.vendor}
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {formatDate(r.expiryDate)}
                      </div>
                      <CountdownBadge daysRemaining={r.days} />
                    </td>
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(r.cost)}
                      <span className="text-[10px] text-slate-400 font-normal block">{r.billingCycle}</span>
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-3.5 text-right pr-2" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenRenewModal(r)}
                          className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800 transition-colors cursor-pointer flex items-center gap-1"
                          title="Renew Record"
                        >
                          <RotateCw className="w-3 h-3" />
                          <span>Renew</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedRenewalId(r.id);
                            setCurrentView('renewal-details');
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
