import React, { useState } from 'react';
import { ShieldCheck, Bell, FileText, BarChart3, CheckCircle2 } from 'lucide-react';
import hero3dClean from '../../assets/hero-3d-clean.png';

interface AuthHeroProps {
  compact?: boolean;
}

export const AuthHero: React.FC<AuthHeroProps> = ({ compact = true }) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'track',
      name: 'Track Renewals',
      icon: ShieldCheck,
      desc: 'Smart 360° timeline of contracts, warranties & licenses'
    },
    {
      id: 'remind',
      name: 'Get Reminders',
      icon: Bell,
      desc: 'Automated 60, 30, 15, and 1-day lead alerts'
    },
    {
      id: 'docs',
      name: 'Manage Documents',
      icon: FileText,
      desc: 'Encrypted document vault for policy PDFs & certificates'
    },
    {
      id: 'history',
      name: 'View History',
      icon: BarChart3,
      desc: 'Comprehensive cost variation & audit trail analytics'
    }
  ];

  return (
    <div className={`relative w-full h-full bg-gradient-to-br from-[#1b3d8c] via-[#16337a] to-[#0f2459] text-white flex flex-col justify-between overflow-hidden select-none ${
      compact ? 'p-5 sm:p-6 lg:p-7' : 'p-8 lg:p-12'
    }`}>
      {/* Decorative ambient background curves */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-0 w-72 h-72 rounded-full border border-white/10 pointer-events-none opacity-40" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Top Branding Header */}
      <div className="relative z-10 flex items-center gap-3 animate-fade-in-up">
        <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg shadow-blue-950/30 text-white shrink-0">
          <svg className="w-5 h-5 text-white drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="4" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <path d="m9 16 2 2 4-4" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white leading-tight drop-shadow-xs font-serif">RenewEase</h1>
            <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-white/15 text-blue-200 border border-white/20">
              Pro
            </span>
          </div>
          <p className="text-[11px] text-blue-200/90 font-medium tracking-wide">Every Renewal. Always On Time.</p>
        </div>
      </div>

      {/* Hero Headline & Subtitle */}
      <div className={`relative z-10 space-y-1.5 animate-fade-in-up ${compact ? 'my-2.5 sm:my-3' : 'my-6 space-y-3'}`} style={{ animationDelay: '100ms' }}>
        <h2 className={`font-bold text-white tracking-tight leading-[1.2] drop-shadow-sm font-serif ${
          compact ? 'text-xl sm:text-2xl lg:text-[25px]' : 'text-3xl sm:text-4xl lg:text-[42px]'
        }`}>
          Stay Organized.<br />
          Never Miss a Renewal.
        </h2>
        <p className="text-xs text-blue-100/90 leading-relaxed max-w-sm font-normal">
          Manage your contracts, licenses, certifications, warranties, insurance policies, and subscriptions in one place.
        </p>
      </div>

      {/* 3D Animated Illustration Scene */}
      <div className="relative z-10 my-auto py-1 flex items-center justify-center">
        <div className={`relative w-full animate-float-slow ${
          compact ? 'max-w-[240px] sm:max-w-[270px]' : 'max-w-lg'
        }`}>
          {/* Floating animated glowing notification bell over calendar */}
          <div className="absolute top-0 right-6 z-20 flex items-center justify-center">
            <span className="absolute w-8 h-8 rounded-full bg-blue-300/40 animate-pulse-ring pointer-events-none" />
            <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-300 text-white flex items-center justify-center shadow-lg shadow-blue-400/50 animate-bell-ring">
              <Bell className="w-3.5 h-3.5 text-white fill-white/30" />
            </div>
          </div>

          {/* 3D Scene Image */}
          <img
            src={hero3dClean}
            alt="RenewEase 3D Renewal Management Interface with Laptop and Notifications"
            className="w-full h-auto object-contain drop-shadow-2xl pointer-events-none select-none transition-transform duration-500 hover:scale-[1.02]"
          />

          {/* Subtle floating compliance badge on laptop */}
          <div className="hidden sm:flex absolute -bottom-1 -left-1 z-20 items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#070e1b]/90 text-slate-800 dark:text-white backdrop-blur-md shadow-xl border border-white/20 text-[10px] font-semibold animate-pulse">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Zero Compliance Lapses</span>
          </div>
        </div>
      </div>

      {/* Bottom 4-Column Feature Bar */}
      <div className={`relative z-10 border-t border-white/15 animate-fade-in-up ${compact ? 'pt-3' : 'pt-6'}`} style={{ animationDelay: '200ms' }}>
        <div className="grid grid-cols-4 divide-x divide-white/20">
          {features.map((item) => {
            const Icon = item.icon;
            const isHovered = activeFeature === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveFeature(item.id)}
                onMouseLeave={() => setActiveFeature(null)}
                className={`flex flex-col items-center text-center px-1.5 py-1 transition-all duration-200 cursor-pointer group ${
                  isHovered ? 'scale-105' : 'hover:opacity-100 opacity-90'
                }`}
              >
                <div className={`p-1.5 rounded-lg mb-1 transition-colors ${
                  isHovered ? 'bg-white/25 text-white' : 'bg-white/10 text-blue-200 group-hover:bg-white/20 group-hover:text-white'
                }`}>
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-white leading-tight">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Feature hover description tooltip */}
        <div className="h-3.5 mt-1 text-center">
          {activeFeature && (
            <p className="text-[10px] text-blue-200/90 animate-fade-in-up italic">
              {features.find(f => f.id === activeFeature)?.desc}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
