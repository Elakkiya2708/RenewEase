import React, { useState } from 'react';
import { useRenewal } from '../context/RenewalContext';
import { Renewal, RenewalCategory } from '../types';
import { StatusBadge, PriorityBadge, CategoryBadge, CountdownBadge } from '../components/common/Badge';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  RotateCw,
  Clock,
  AlertTriangle,
  ExternalLink,
  Plus
} from 'lucide-react';

interface CalendarPageProps {
  onOpenAddModal: () => void;
  onOpenRenewModal: (renewal: Renewal) => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({
  onOpenAddModal,
  onOpenRenewModal
}) => {
  const {
    renewals,
    setCurrentView,
    setSelectedRenewalId,
    formatCurrency,
    formatDate,
    getDaysRemaining
  } = useRenewal();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCalendarCategory, setSelectedCalendarCategory] = useState<string>('All');
  const [activeDayRenewals, setActiveDayRenewals] = useState<Renewal[] | null>(null);

  const categories = ['All', 'Contracts', 'Licenses', 'Certifications', 'Warranties', 'Insurance', 'Subscriptions', 'Permits'];

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // First day of month (0 = Sun, 1 = Mon...)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Total days in month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  // Days in previous month
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  // Filtered renewals
  const visibleRenewals = renewals.filter(r => {
    if (r.status === 'Cancelled') return false;
    if (selectedCalendarCategory !== 'All' && r.category !== selectedCalendarCategory) return false;
    return true;
  });

  // Map renewals by date string (YYYY-MM-DD)
  const renewalsByDate: Record<string, Renewal[]> = {};
  visibleRenewals.forEach(r => {
    if (!renewalsByDate[r.expiryDate]) renewalsByDate[r.expiryDate] = [];
    renewalsByDate[r.expiryDate].push(r);
  });

  // Build grid calendar cells
  const calendarCells = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthTotalDays - i;
    calendarCells.push({
      day: dayNum,
      isCurrentMonth: false,
      dateStr: ''
    });
  }

  // Current month days
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    const dateStr = `${year}-${mStr}-${dStr}`;

    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      dateStr,
      items: renewalsByDate[dateStr] || []
    });
  }

  // Next month leading days to complete 35 or 42 grid cells
  const remainingCells = (7 - (calendarCells.length % 7)) % 7;
  for (let n = 1; n <= remainingCells; n++) {
    calendarCells.push({
      day: n,
      isCurrentMonth: false,
      dateStr: ''
    });
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Renewal Deadlines Calendar
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual month-by-month agenda of all contract expiry windows and regulatory renewal dates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-950/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Renewal</span>
          </button>
        </div>
      </div>

      {/* Calendar Controls & Month Header */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#081220] p-1">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {monthNames[month]} {year}
          </h2>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs w-full md:w-auto">
          <span className="text-slate-400 font-bold shrink-0">Filter:</span>
          {categories.slice(0, 5).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCalendarCategory(cat)}
              className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap cursor-pointer transition-colors ${
                selectedCalendarCategory === cat
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Day-of-week header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#081220] text-center text-xs font-bold text-slate-500 py-3">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800/80">
          {calendarCells.map((cell, idx) => {
            const hasEvents = cell.items && cell.items.length > 0;
            const isToday = cell.dateStr === todayStr;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (hasEvents) {
                    setActiveDayRenewals(cell.items);
                  }
                }}
                className={`min-h-24 sm:min-h-28 p-1.5 sm:p-2 transition-colors relative flex flex-col justify-between ${
                  !cell.isCurrentMonth
                    ? 'bg-slate-50/40 dark:bg-[#060c14]/40 text-slate-300 dark:text-slate-700'
                    : hasEvents
                    ? 'bg-blue-50/20 dark:bg-blue-950/10 cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-950/30'
                    : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      isToday
                        ? 'bg-blue-900 text-white shadow-xs'
                        : cell.isCurrentMonth
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    {cell.day}
                  </span>
                  {hasEvents && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      {cell.items.length} {cell.items.length === 1 ? 'due' : 'dues'}
                    </span>
                  )}
                </div>

                {/* Event pills preview */}
                <div className="space-y-1 mt-1 overflow-hidden">
                  {cell.items?.slice(0, 2).map(item => {
                    const days = getDaysRemaining(item.expiryDate);
                    const isUrgent = days <= 7;

                    return (
                      <div
                        key={item.id}
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedRenewalId(item.id);
                          setCurrentView('renewal-details');
                        }}
                        className={`px-1.5 py-0.5 rounded text-[11px] font-semibold truncate border cursor-pointer ${
                          isUrgent
                            ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900'
                            : 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900'
                        }`}
                        title={`${item.title} - ${formatCurrency(item.cost)}`}
                      >
                        {item.title}
                      </div>
                    );
                  })}
                  {cell.items && cell.items.length > 2 && (
                    <span className="text-[10px] font-bold text-slate-400 block pl-1">
                      +{cell.items.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Modal/Drawer */}
      {activeDayRenewals && (
        <div className="p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-blue-200 dark:border-blue-900 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Renewals Due on Selected Date ({activeDayRenewals.length})
              </h3>
              <p className="text-xs text-slate-500">
                Direct actions for records expiring on this day
              </p>
            </div>
            <button
              onClick={() => setActiveDayRenewals(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              Close Agenda ✕
            </button>
          </div>

          <div className="space-y-3">
            {activeDayRenewals.map(r => (
              <div
                key={r.id}
                className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#081220] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CategoryBadge category={r.category} />
                    <StatusBadge status={r.status} />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {r.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Vendor: {r.vendor} • Annual Cost: {formatCurrency(r.cost)}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setSelectedRenewalId(r.id);
                      setCurrentView('renewal-details');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    View Record
                  </button>
                  <button
                    onClick={() => onOpenRenewModal(r)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Renew</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
