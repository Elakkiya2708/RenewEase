import React, { useState } from 'react';
import { Menu, X, ArrowRight, LogIn } from 'lucide-react';

export type PublicNavTab = 'home' | 'about' | 'features' | 'contact';

interface PublicNavbarProps {
  currentTab: PublicNavTab;
  onSelectTab: (tab: PublicNavTab) => void;
  onGoToLogin: () => void;
  onGoToRegister: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  currentTab,
  onSelectTab,
  onGoToLogin,
  onGoToRegister
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks: { id: PublicNavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'features', label: 'Features' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleLinkClick = (tab: PublicNavTab) => {
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/95 dark:bg-[#070e1b]/95 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <div
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-900 text-white flex items-center justify-center shadow-md shadow-blue-950/20 group-hover:shadow-indigo-500/20 transition-all">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="4" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <path d="m9 16 2 2 4-4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  RenewEase
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  SaaS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Smart Renewal Management System
              </p>
            </div>
          </div>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900/60'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Action Buttons (Login & Register) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onGoToLogin}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-blue-900 dark:text-indigo-400" />
              <span>Login</span>
            </button>

            <button
              onClick={onGoToRegister}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 hover:from-blue-800 hover:to-indigo-800 text-white shadow-md shadow-blue-950/20 hover:shadow-indigo-950/30 transition-all cursor-pointer active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1829] px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-fade-in-up">
          <div className="space-y-1">
            {navLinks.map(link => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-base font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onGoToLogin();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-center border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onGoToRegister();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-center bg-blue-900 hover:bg-blue-800 text-white shadow-md cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
