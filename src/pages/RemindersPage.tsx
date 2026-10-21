import React, { useState } from 'react';
import { useRenewal } from '../context/RenewalContext';
import { useAuth } from '../context/AuthContext';
import { ReminderNotification } from '../types';
import { StatusBadge, PriorityBadge, CategoryBadge, CountdownBadge } from '../components/common/Badge';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Mail,
  Send,
  Settings,
  Shield,
  Volume2,
  FileText,
  RotateCw,
  Server
} from 'lucide-react';

interface RemindersPageProps {
  onSimulateEmail: (payload: any) => void;
}

export const RemindersPage: React.FC<RemindersPageProps> = ({ onSimulateEmail }) => {
  const { user, updateSettings } = useAuth();
  const {
    notifications,
    unreadNotificationsCount,
    markReminderRead,
    markAllRemindersRead,
    simulateEmail,
    setCurrentView,
    setSelectedRenewalId,
    formatDate
  } = useRenewal();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'critical' | 'dispatched'>('all');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const filteredNotifs = notifications.filter(n => {
    if (activeTab === 'unread') return !n.isRead;
    if (activeTab === 'critical') return n.urgency === 'critical';
    if (activeTab === 'dispatched') return n.simulatedEmailSent;
    return true;
  });

  const handleTestDispatch = async (notifId: string) => {
    const res = await simulateEmail(notifId);
    if (res?.emailPayload) {
      onSimulateEmail(res.emailPayload);
    }
  };

  const handleToggleLeadDay = (days: number) => {
    const currentLead = user?.settings?.defaultLeadDays || [30, 15, 7, 1];
    let updated: number[];
    if (currentLead.includes(days)) {
      updated = currentLead.filter(d => d !== days);
    } else {
      updated = [...currentLead, days].sort((a, b) => b - a);
    }
    updateSettings({ defaultLeadDays: updated });
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Reminders & Alert Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure automated compliance triggers and test enterprise email dispatch notifications.
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <button
            onClick={() => markAllRemindersRead()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1829] text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Mark All As Read</span>
          </button>
        )}
      </div>

      {/* Grid: Preferences & Notification List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Configurable Schedule Rules */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
              <Settings className="w-4 h-4 text-indigo-600" />
              <span>Reminder Lead Schedules</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Define the lead days prior to an item&apos;s expiry date when RenewEase will generate alerts and queue automated emails:
            </p>

            <div className="space-y-2">
              {[60, 45, 30, 15, 7, 3, 1].map(days => {
                const isSelected = user?.settings?.defaultLeadDays?.includes(days);
                return (
                  <label
                    key={days}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-xs"
                  >
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {days} Days Prior
                    </span>
                    <input
                      type="checkbox"
                      checked={Boolean(isSelected)}
                      onChange={() => handleToggleLeadDay(days)}
                      className="w-4 h-4 text-blue-900 rounded border-slate-300"
                    />
                  </label>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <label className="flex items-center justify-between text-xs cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Email Notifications</span>
                  <span className="text-slate-400 text-[11px]">Send HTML notices to {user?.email}</span>
                </div>
                <input
                  type="checkbox"
                  checked={user?.settings?.emailNotifications ?? true}
                  onChange={e => updateSettings({ emailNotifications: e.target.checked })}
                  className="w-4 h-4 text-blue-900 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Weekly Summary Digest</span>
                  <span className="text-slate-400 text-[11px]">Monday morning executive report</span>
                </div>
                <input
                  type="checkbox"
                  checked={user?.settings?.weeklyDigest ?? true}
                  onChange={e => updateSettings({ weeklyDigest: e.target.checked })}
                  className="w-4 h-4 text-blue-900 rounded"
                />
              </label>
            </div>
          </div>

          {/* Academic & Final-Year Project Demonstration Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950 to-slate-900 text-white border border-blue-900/40 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-300">
              <Server className="w-4 h-4" />
              <span>Simulated vs Production Feature</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              To guarantee seamless college project demonstration without configuring an external paid SMTP service, click <strong>&quot;Simulate Dispatch Email&quot;</strong> on any alert to test live HTML email compilation, telemetry headers, and delivery logging!
            </p>
          </div>
        </div>

        {/* Right Column: Notifications Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-lg bg-slate-100 dark:bg-[#081220] border border-slate-200 dark:border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1.5 px-3 rounded-md transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-[#0c1829] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Alerts ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`flex-1 py-1.5 px-3 rounded-md transition-colors cursor-pointer ${
                activeTab === 'unread'
                  ? 'bg-white dark:bg-[#0c1829] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Unread ({unreadNotificationsCount})
            </button>
            <button
              onClick={() => setActiveTab('critical')}
              className={`flex-1 py-1.5 px-3 rounded-md transition-colors cursor-pointer ${
                activeTab === 'critical'
                  ? 'bg-white dark:bg-[#0c1829] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Critical Only
            </button>
            <button
              onClick={() => setActiveTab('dispatched')}
              className={`flex-1 py-1.5 px-3 rounded-md transition-colors cursor-pointer ${
                activeTab === 'dispatched'
                  ? 'bg-white dark:bg-[#0c1829] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Emails Sent
            </button>
          </div>

          {/* Alert Cards */}
          {filteredNotifs.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                No Notifications Found
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                There are no active reminders under this tab.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifs.map(n => (
                <div
                  key={n.id}
                  className={`p-4 rounded-xl border transition-all ${
                    !n.isRead
                      ? 'bg-white dark:bg-[#0c1829] border-blue-300 dark:border-blue-900/60 shadow-sm'
                      : 'bg-slate-50/70 dark:bg-[#081220]/60 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 mt-0.5 shrink-0">
                        {n.urgency === 'critical' ? (
                          <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" />
                        ) : (
                          <Clock className="w-5 h-5 text-amber-500" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {n.renewalTitle}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                            {n.category}
                          </span>
                          {!n.isRead && (
                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                              New
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {n.message}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                          <span>Expiry: <strong>{formatDate(n.dueDate)}</strong></span>
                          <span>•</span>
                          <span>
                            {n.daysRemaining <= 0
                              ? `Overdue by ${Math.abs(n.daysRemaining)} days`
                              : `${n.daysRemaining} days remaining`}
                          </span>
                          {n.simulatedEmailSent && (
                            <>
                              <span>•</span>
                              <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                <span>Email Dispatched</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleTestDispatch(n.id)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Simulate Sending HTML Email"
                      >
                        <Send className="w-3 h-3" />
                        <span>Simulate Email</span>
                      </button>

                      <button
                        onClick={() => {
                          markReminderRead(n.id);
                          setSelectedRenewalId(n.renewalId);
                          setCurrentView('renewal-details');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
