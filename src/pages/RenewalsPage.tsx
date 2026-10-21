import React, { useState } from 'react';
import { useRenewal } from '../context/RenewalContext';
import { StatusBadge, PriorityBadge, CategoryBadge, CountdownBadge } from '../components/common/Badge';
import { Renewal, RenewalCategory, RenewalStatus } from '../types';
import {
  Search,
  Filter,
  Plus,
  RotateCw,
  Edit2,
  Trash2,
  Eye,
  LayoutGrid,
  List,
  ArrowUpDown,
  Download,
  AlertCircle,
  CheckCircle2,
  Calendar,
  DollarSign,
  CheckSquare,
  Square,
  FileSpreadsheet
} from 'lucide-react';

interface RenewalsPageProps {
  onOpenAddModal: () => void;
  onOpenEditModal: (renewal: Renewal) => void;
  onOpenRenewModal: (renewal: Renewal) => void;
}

export const RenewalsPage: React.FC<RenewalsPageProps> = ({
  onOpenAddModal,
  onOpenEditModal,
  onOpenRenewModal
}) => {
  const {
    renewals,
    deleteRenewal,
    setCurrentView,
    setSelectedRenewalId,
    formatCurrency,
    formatDate,
    getDaysRemaining,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus
  } = useRenewal();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'expiryDate' | 'cost' | 'title' | 'priority'>('expiryDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const categories = ['All', 'Contracts', 'Licenses', 'Certifications', 'Warranties', 'Insurance', 'Subscriptions', 'Permits'];
  const statuses = ['All', 'Active', 'Expiring Soon', 'Overdue', 'Cancelled'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  // Filter renewals
  const filteredRenewals = renewals.filter(r => {
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const match =
        r.title.toLowerCase().includes(q) ||
        r.vendor.toLowerCase().includes(q) ||
        r.accountNumber.toLowerCase().includes(q) ||
        r.notes.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && r.category !== selectedCategory) return false;

    // Status filter
    if (selectedStatus !== 'All' && r.status !== selectedStatus) return false;

    // Priority filter
    if (priorityFilter !== 'All' && r.priority !== priorityFilter) return false;

    return true;
  });

  // Sort renewals
  filteredRenewals.sort((a, b) => {
    let valA: any = a.expiryDate;
    let valB: any = b.expiryDate;

    if (sortBy === 'cost') {
      valA = a.cost;
      valB = b.cost;
    } else if (sortBy === 'title') {
      valA = a.title.toLowerCase();
      valB = b.title.toLowerCase();
    } else if (sortBy === 'priority') {
      const prioWeights: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      valA = prioWeights[a.priority] || 0;
      valB = prioWeights[b.priority] || 0;
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Bulk Selection Handlers
  const handleSelectAll = () => {
    if (selectedIds.length === filteredRenewals.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRenewals.map(r => r.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Bulk Export to CSV
  const handleExportSelectedCSV = () => {
    const itemsToExport = renewals.filter(r => selectedIds.length === 0 || selectedIds.includes(r.id));
    const headers = ['Title', 'Category', 'Vendor', 'Account/Policy Number', 'Cost', 'Billing Cycle', 'Expiry Date', 'Status', 'Priority', 'Auto Renew'];
    const rows = itemsToExport.map(r => [
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.category}"`,
      `"${r.vendor.replace(/"/g, '""')}"`,
      `"${r.accountNumber}"`,
      r.cost,
      `"${r.billingCycle}"`,
      `"${r.expiryDate}"`,
      `"${r.status}"`,
      `"${r.priority}"`,
      r.autoRenew ? 'Yes' : 'No'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RenewEase_Records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            All Renewals Repository
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Central repository of contracts, software licenses, warranties, certifications, and compliance permits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0c1829] p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-blue-900 text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-blue-900 text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleExportSelectedCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1829] text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Export filtered records to CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>CSV Export {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-950/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Renewal</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, vendor, account..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Status filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Expiring Soon">Expiring Soon Only</option>
              <option value="Overdue">Overdue Only</option>
              <option value="Cancelled">Cancelled Only</option>
            </select>
          </div>

          {/* Priority filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-1.5">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
            >
              <option value="expiryDate">Sort by Expiry Date</option>
              <option value="cost">Sort by Cost</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#081220] text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold cursor-pointer"
              title="Toggle Sort Order"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold mr-1 shrink-0">Category:</span>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {filteredRenewals.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Renewal Records Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            No records matched your search query or filter criteria. Clear filters or add a new renewal record.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedStatus('All');
                setPriorityFilter('All');
              }}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 rounded-lg bg-blue-900 text-white text-xs font-bold hover:bg-blue-800 cursor-pointer"
            >
              Register Renewal
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 dark:bg-[#081220] border-b border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 pl-4 w-10">
                    <button
                      onClick={handleSelectAll}
                      className="text-slate-500 hover:text-slate-900 cursor-pointer"
                      title="Select All"
                    >
                      {selectedIds.length === filteredRenewals.length && filteredRenewals.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-blue-900 dark:text-blue-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-3">Record Details</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Vendor</th>
                  <th className="py-3 px-3">Cost / Term</th>
                  <th className="py-3 px-3">Due Date & Urgency</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredRenewals.map(r => {
                  const days = getDaysRemaining(r.expiryDate);
                  const isSelected = selectedIds.includes(r.id);

                  return (
                    <tr
                      key={r.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer ${
                        isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                      onClick={() => {
                        setSelectedRenewalId(r.id);
                        setCurrentView('renewal-details');
                      }}
                    >
                      <td className="py-4 pl-4" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => toggleSelectOne(r.id)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-900 dark:text-blue-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="py-4 px-3">
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1 max-w-xs">
                          {r.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-normal flex items-center gap-2 mt-0.5">
                          <span>{r.accountNumber}</span>
                          {r.autoRenew && (
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                              • Auto-renews
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-3">
                        <CategoryBadge category={r.category} />
                      </td>

                      <td className="py-4 px-3 text-slate-700 dark:text-slate-300 font-medium">
                        {r.vendor}
                      </td>

                      <td className="py-4 px-3 font-bold text-slate-900 dark:text-white">
                        <div>{formatCurrency(r.cost)}</div>
                        <span className="text-[10px] text-slate-400 font-normal block">{r.billingCycle}</span>
                      </td>

                      <td className="py-4 px-3">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {formatDate(r.expiryDate)}
                        </div>
                        <CountdownBadge daysRemaining={days} />
                      </td>

                      <td className="py-4 px-3">
                        <StatusBadge status={r.status} />
                      </td>

                      <td className="py-4 px-3">
                        <PriorityBadge priority={r.priority} />
                      </td>

                      <td className="py-4 pr-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenRenewModal(r)}
                            className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800 transition-colors cursor-pointer flex items-center gap-1"
                            title="Execute Renewal"
                          >
                            <RotateCw className="w-3 h-3" />
                            <span>Renew</span>
                          </button>

                          <button
                            onClick={() => onOpenEditModal(r)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${r.title}"? This action cannot be undone.`)) {
                                deleteRenewal(r.id);
                              }
                            }}
                            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRenewals.map(r => {
            const days = getDaysRemaining(r.expiryDate);

            return (
              <div
                key={r.id}
                onClick={() => {
                  setSelectedRenewalId(r.id);
                  setCurrentView('renewal-details');
                }}
                className="navy-card p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <CategoryBadge category={r.category} />
                    <PriorityBadge priority={r.priority} />
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {r.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    Vendor: {r.vendor} • Acct: {r.accountNumber}
                  </p>

                  <div className="my-3 p-3 rounded-lg bg-slate-50 dark:bg-[#081220] border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="block text-slate-400">Due Date:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{formatDate(r.expiryDate)}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Annual Cost:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(r.cost)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <StatusBadge status={r.status} />
                    <CountdownBadge daysRemaining={days} />
                  </div>
                </div>

                <div
                  className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => onOpenRenewModal(r)}
                    className="flex-1 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Renew</span>
                  </button>

                  <button
                    onClick={() => onOpenEditModal(r)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Edit Record"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete "${r.title}"?`)) deleteRenewal(r.id);
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
