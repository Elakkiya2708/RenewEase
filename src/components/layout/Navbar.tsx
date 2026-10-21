import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  Sun,
  Moon,
  ShieldCheck,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRenewal } from '../../context/RenewalContext';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout, toggleTheme } = useAuth();
  const {
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    notifications,
    unreadNotificationsCount,
    markReminderRead,
    markAllRemindersRead
  } = useRenewal();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() !== '' && currentView !== 'renewals') {
      setCurrentView('renewals');
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'RH';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0a1424]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-17">
        {/* Left Section: Mobile toggle & Brand */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-900 text-white flex items-center justify-center shadow-md group-hover:shadow-indigo-500/20 transition-all">
              <ShieldCheck className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  RenewEase
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  SaaS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Smart Renewal Management System
              </p>
            </div>
          </div>

          {/* User Workspace Isolation Indicator */}
          <div className="hidden xl:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200 dark:border-slate-800">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50/80 text-blue-900 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60">
              <Lock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span>{user?.name || 'User'}&apos;s Private Workspace</span>
            </span>
          </div>
        </div>

        {/* Middle Section: Quick Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search contracts, licenses, vendors, policy #..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100/80 dark:bg-[#0c1829] text-slate-900 dark:text-white placeholder-slate-400 rounded-lg border border-transparent focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-[#0f1f35] focus:outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Right Section: Actions, Notifications, Dark Mode, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark Mode Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Toggle Light / Dark Mode"
            aria-label="Toggle Dark Mode"
          >
            {user?.settings?.theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(prev => !prev)}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Notifications & Expiry Alerts"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white dark:bg-[#0c1829] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-[#0a1424] border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">Alerts & Reminders</span>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                        {unreadNotificationsCount} unread
                      </span>
                    )}
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={() => markAllRemindersRead()}
                      className="text-xs text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                      <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                      No alerts. All your renewals are in good standing!
                    </div>
                  ) : (
                    notifications.slice(0, 5).map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markReminderRead(n.id);
                          setCurrentView('reminders');
                          setIsNotifOpen(false);
                        }}
                        className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                          !n.isRead ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {n.urgency === 'critical' ? (
                            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400 mt-0.5 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {n.renewalTitle}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5">
                              {n.message}
                            </p>
                            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                              <span>Due: {n.dueDate}</span>
                              {n.simulatedEmailSent && (
                                <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                  Email Dispatched
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-[#0a1424] border-t border-slate-200 dark:border-slate-800 text-center">
                  <button
                    onClick={() => {
                      setCurrentView('reminders');
                      setIsNotifOpen(false);
                    }}
                    className="text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    View All Reminders & Notification Settings →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(prev => !prev)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="User profile menu"
            >
              <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-blue-900 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {getInitials(user?.name)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-32">
                  {user?.name || 'Dr. Julian Vance'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-32">
                  {user?.company || 'Apex Innovations'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#0c1829] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 bg-slate-50 dark:bg-[#0a1424] border-b border-slate-200 dark:border-slate-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user?.email}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Private Workspace Active</span>
                  </div>
                </div>

                <div className="p-1.5">
                  <button
                    onClick={() => {
                      setCurrentView('profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('settings');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>System Settings & Backup</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
