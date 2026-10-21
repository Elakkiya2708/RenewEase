import React, { useState } from 'react';
import { useRenewal } from '../context/RenewalContext';
import {
  BarChart3,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const {
    renewals,
    analytics,
    history,
    formatCurrency,
    formatDate
  } = useRenewal();

  const [reportScope, setReportScope] = useState<'all' | 'expiring' | 'overdue' | 'active'>('all');
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeTerms, setIncludeTerms] = useState(true);
  const [includeCost, setIncludeCost] = useState(true);

  // Generate downloadable CSV
  const handleDownloadReportCSV = () => {
    let items = [...renewals];
    if (reportScope === 'expiring') items = items.filter(r => r.status === 'Expiring Soon');
    else if (reportScope === 'overdue') items = items.filter(r => r.status === 'Overdue');
    else if (reportScope === 'active') items = items.filter(r => r.status === 'Active');

    const headers = ['Record ID', 'Title', 'Category', 'Vendor', 'Account/Policy Number', 'Billing Frequency', 'Start Date', 'Expiry Date', 'Status', 'Priority', 'Auto Renew'];
    if (includeCost) headers.push('Annual Cost');
    if (includeTerms) headers.push('Contract Terms');
    if (includeNotes) headers.push('Internal Notes');

    const rows = items.map(r => {
      const row = [
        `"${r.id}"`,
        `"${r.title.replace(/"/g, '""')}"`,
        `"${r.category}"`,
        `"${r.vendor.replace(/"/g, '""')}"`,
        `"${r.accountNumber}"`,
        `"${r.billingCycle}"`,
        `"${r.startDate}"`,
        `"${r.expiryDate}"`,
        `"${r.status}"`,
        `"${r.priority}"`,
        r.autoRenew ? 'Yes' : 'No'
      ];
      if (includeCost) row.push(r.cost.toString());
      if (includeTerms) row.push(`"${(r.terms || '').replace(/"/g, '""')}"`);
      if (includeNotes) row.push(`"${(r.notes || '').replace(/"/g, '""')}"`);
      return row;
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RenewEase_${reportScope.toUpperCase()}_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalBudget = analytics?.metrics.totalAnnualSpend || 1;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Reports & Financial Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Executive spend statements, category breakdown, and downloadable CSV audit archives.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1829] text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleDownloadReportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Report</span>
          </button>
        </div>
      </div>

      {/* CSV Report Customizer Card */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <span>Custom CSV Report Generator</span>
          </div>
          <span className="text-xs text-slate-400">RFC 4180 Compliant</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Report Record Scope:
            </label>
            <select
              value={reportScope}
              onChange={e => setReportScope(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#081220] text-slate-900 dark:text-white font-semibold"
            >
              <option value="all">All Managed Records ({renewals.length})</option>
              <option value="expiring">Expiring Soon Only ({analytics?.metrics.expiringSoonRenewals || 0})</option>
              <option value="overdue">Overdue Items Only ({analytics?.metrics.overdueRenewals || 0})</option>
              <option value="active">Active & Compliant Only ({analytics?.metrics.activeRenewals || 0})</option>
            </select>
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCost}
                onChange={e => setIncludeCost(e.target.checked)}
                className="w-4 h-4 text-blue-900 rounded"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Include Cost Fields</span>
            </label>
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTerms}
                onChange={e => setIncludeTerms(e.target.checked)}
                className="w-4 h-4 text-blue-900 rounded"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Include Contract Terms</span>
            </label>
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeNotes}
                onChange={e => setIncludeNotes(e.target.checked)}
                className="w-4 h-4 text-blue-900 rounded"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Include Audit Notes</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleDownloadReportCSV}
            className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Export CSV File Now</span>
          </button>
        </div>
      </div>

      {/* Financial Analytics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Financial Breakdown Table */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
            Category Budget Allocation
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Financial distribution across all recognized enterprise asset classes
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase pb-2">
                  <th className="pb-2">Asset Category</th>
                  <th className="pb-2 text-center">Items</th>
                  <th className="pb-2 text-right">Annual Cost</th>
                  <th className="pb-2 text-right">% of Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {(analytics?.categoryBreakdown || []).map(cat => {
                  const pct = ((cat.spend / totalBudget) * 100).toFixed(1);

                  return (
                    <tr key={cat.category} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">
                        {cat.category}
                      </td>
                      <td className="py-2.5 text-center text-slate-600 dark:text-slate-400 font-semibold">
                        {cat.count}
                      </td>
                      <td className="py-2.5 text-right font-bold text-slate-900 dark:text-white">
                        {formatCurrency(cat.spend)}
                      </td>
                      <td className="py-2.5 text-right text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-blue-900 dark:text-blue-400">{pct}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Vendors by Expenditure */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
            Top 5 Vendors by Annual Commitment
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Largest supplier relationships in your private renewal portfolio
          </p>

          <div className="space-y-3">
            {(analytics?.topVendors || []).map((v, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-slate-50 dark:bg-[#081220] border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {v.vendor}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {v.title} ({v.category})
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white text-sm block">
                    {formatCurrency(v.cost)}
                  </span>
                  <span className="text-[10px] text-slate-400">Due {formatDate(v.expiryDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
