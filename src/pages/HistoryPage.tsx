import React, { useState } from 'react';
import { useRenewal } from '../context/RenewalContext';
import {
  History,
  Search,
  RotateCw,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  DollarSign,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const {
    history,
    renewals,
    setCurrentView,
    setSelectedRenewalId,
    formatCurrency,
    formatDate
  } = useRenewal();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter(h => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      h.renewalTitle.toLowerCase().includes(q) ||
      h.vendor.toLowerCase().includes(q) ||
      h.invoiceNumber.toLowerCase().includes(q) ||
      h.notes.toLowerCase().includes(q)
    );
  });

  const totalCycles = history.length;
  const netDifference = history.reduce((acc, curr) => acc + curr.costDifference, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Renewal Audit History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete version timeline, rate change tracking, and previous agreement terms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Immutable Audit Trail Active</span>
          </span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Completed Renewals
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            {totalCycles} Cycles
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Archived across all assets
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Net Negotiated Variance
          </span>
          <div className={`text-2xl sm:text-3xl font-bold mt-1 ${netDifference >= 0 ? 'text-slate-900 dark:text-white' : 'text-emerald-600'}`}>
            {netDifference > 0 ? `+${formatCurrency(netDifference)}` : formatCurrency(netDifference)}
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            {netDifference >= 0 ? <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> : <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />}
            <span>Cumulative budget difference</span>
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Audit Integrity
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-2">
            <CheckCircle2 className="w-7 h-7" />
            <span>100% Logged</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Every renewal archives previous terms
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, invoice #, vendor, or notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
          />
        </div>
      </div>

      {/* History Timeline Table */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800">
          <History className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-60" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            No Renewal History Entries Found
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            When you execute a renewal on any active or expiring record, its previous cycle terms will be recorded here automatically.
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 dark:bg-[#081220] border-b border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 pl-4">Record Title & Vendor</th>
                  <th className="py-3.5 px-3">Renewed Date</th>
                  <th className="py-3.5 px-3">Timeline Extension</th>
                  <th className="py-3.5 px-3">Rate Change</th>
                  <th className="py-3.5 px-3">Invoice / PO</th>
                  <th className="py-3.5 pr-4">Negotiation Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredHistory.map(h => {
                  const percentChange = h.previousCost > 0
                    ? ((h.costDifference / h.previousCost) * 100).toFixed(1)
                    : '0';

                  return (
                    <tr
                      key={h.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      onClick={() => {
                        setSelectedRenewalId(h.renewalId);
                        setCurrentView('renewal-details');
                      }}
                    >
                      <td className="py-4 pl-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate max-w-xs">{h.renewalTitle}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-900 transition-colors shrink-0" />
                        </div>
                        <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                          {h.vendor} • {h.category}
                        </div>
                      </td>

                      <td className="py-4 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {formatDate(h.renewedDate)}
                      </td>

                      <td className="py-4 px-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                          <span>{formatDate(h.previousExpiryDate)}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className="font-bold text-slate-900 dark:text-white">{formatDate(h.newExpiryDate)}</span>
                        </div>
                      </td>

                      <td className="py-4 px-3">
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          {formatCurrency(h.previousCost)} → {formatCurrency(h.newCost)}
                        </div>
                        <span className={`text-[11px] font-bold block ${
                          h.costDifference > 0
                            ? 'text-rose-600'
                            : h.costDifference < 0
                            ? 'text-emerald-600'
                            : 'text-slate-400'
                        }`}>
                          {h.costDifference > 0
                            ? `+${formatCurrency(h.costDifference)} (+${percentChange}%)`
                            : h.costDifference < 0
                            ? `${formatCurrency(h.costDifference)} (${percentChange}%)`
                            : 'Unchanged (0%)'}
                        </span>
                      </td>

                      <td className="py-4 px-3 text-xs text-slate-700 dark:text-slate-300 font-bold">
                        {h.invoiceNumber}
                      </td>

                      <td className="py-4 pr-4 text-xs text-slate-600 dark:text-slate-300 max-w-sm">
                        <div className="line-clamp-2">{h.notes}</div>
                        {h.renewalTerms && (
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            Terms: {h.renewalTerms}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
