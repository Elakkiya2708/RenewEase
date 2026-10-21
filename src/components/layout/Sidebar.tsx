import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Bell,
  FolderArchive,
  History,
  BarChart3,
  User,
  Settings,
  PlusCircle,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { useRenewal } from '../../context/RenewalContext';
import { PageView } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
  onOpenAddModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onCloseMobile,
  onOpenAddModal
}) => {
  const {
    currentView,
    setCurrentView,
    renewals,
    unreadNotificationsCount,
    documents,
    history,
    analytics,
    formatCurrency
  } = useRenewal();

  const overdueCount = renewals.filter(r => r.status === 'Overdue').length;

  const navItems: { id: PageView; label: string; icon: React.ReactNode; badge?: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4.5 h-4.5" />
    },
    {
      id: 'renewals',
      label: 'All Renewals',
      icon: <FileText className="w-4.5 h-4.5" />,
      badge: overdueCount > 0 ? (
        <span className="ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
          <AlertTriangle className="w-2.5 h-2.5" />
          {overdueCount}
        </span>
      ) : (
        <span className="ml-auto px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {renewals.length}
        </span>
      )
    },
    {
      id: 'calendar',
      label: 'Calendar & Deadlines',
      icon: <Calendar className="w-4.5 h-4.5" />
    },
    {
      id: 'reminders',
      label: 'Reminders & Alerts',
      icon: <Bell className="w-4.5 h-4.5" />,
      badge: unreadNotificationsCount > 0 ? (
        <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
          {unreadNotificationsCount}
        </span>
      ) : null
    },
    {
      id: 'documents',
      label: 'Document Vault',
      icon: <FolderArchive className="w-4.5 h-4.5" />,
      badge: (
        <span className="ml-auto px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {documents.length}
        </span>
      )
    },
    {
      id: 'history',
      label: 'Renewal History',
      icon: <History className="w-4.5 h-4.5" />,
      badge: (
        <span className="ml-auto px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {history.length}
        </span>
      )
    },
    {
      id: 'reports',
      label: 'Reports & Export',
      icon: <BarChart3 className="w-4.5 h-4.5" />
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-4.5 h-4.5" />
    },
    {
      id: 'settings',
      label: 'Workspace Settings',
      icon: <Settings className="w-4.5 h-4.5" />
    }
  ];

  const handleNavClick = (view: PageView) => {
    setCurrentView(view);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-17 z-40 h-full lg:h-[calc(100vh-4.25rem)] w-68 bg-white dark:bg-[#081220] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 flex-1 overflow-y-auto">
          {/* "+ New Renewal" CTA button */}
          <div className="mb-5">
            <button
              onClick={() => {
                onOpenAddModal();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-950/20 hover:shadow-lg transition-all cursor-pointer group"
            >
              <PlusCircle className="w-4.5 h-4.5 text-indigo-300 group-hover:rotate-90 transition-transform" />
              <span>Add New Renewal</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Workspace Modules
            </p>
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-900 text-white shadow-sm dark:bg-indigo-950 dark:text-indigo-200 dark:border dark:border-indigo-800/60'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <span className={`${isActive ? 'text-white dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Workspace Summary Widget */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#060e19]">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Private Vault</span>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Encrypted
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 mb-1">
              <span>Annual Run Rate:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatCurrency(analytics?.metrics.totalAnnualSpend || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
              <span>Active Items:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {analytics?.metrics.activeRenewals || 0} Records
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
