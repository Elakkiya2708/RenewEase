import React from 'react';
import { RenewalStatus, RenewalPriority, RenewalCategory } from '../../types';
import {
  FileText,
  Key,
  Award,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  FileCheck2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCw
} from 'lucide-react';

export const StatusBadge: React.FC<{ status: RenewalStatus | string; className?: string }> = ({ status, className = '' }) => {
  switch (status) {
    case 'Active':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          Active
        </span>
      );
    case 'Expiring Soon':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800 ${className}`}>
          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
          Expiring Soon
        </span>
      );
    case 'Overdue':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 ${className}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          Overdue
        </span>
      );
    case 'Renewed':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800 ${className}`}>
          <RotateCw className="w-3.5 h-3.5" />
          Renewed
        </span>
      );
    case 'Cancelled':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 ${className}`}>
          <XCircle className="w-3.5 h-3.5" />
          Cancelled
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ${className}`}>
          {status}
        </span>
      );
  }
};

export const PriorityBadge: React.FC<{ priority: RenewalPriority | string; className?: string }> = ({ priority, className = '' }) => {
  switch (priority) {
    case 'Critical':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400 animate-ping" />
          Critical
        </span>
      );
    case 'High':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-900 border border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          High
        </span>
      );
    case 'Medium':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Medium
        </span>
      );
    case 'Low':
    default:
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Low
        </span>
      );
  }
};

export const CategoryBadge: React.FC<{ category: RenewalCategory | string; className?: string }> = ({ category, className = '' }) => {
  const getIcon = () => {
    switch (category) {
      case 'Contracts': return <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'Licenses': return <Key className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      case 'Certifications': return <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      case 'Warranties': return <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />;
      case 'Insurance': return <ShieldAlert className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />;
      case 'Subscriptions': return <CreditCard className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />;
      case 'Permits': return <FileCheck2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      default: return <FileText className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 ${className}`}>
      {getIcon()}
      {category}
    </span>
  );
};

export const CountdownBadge: React.FC<{ daysRemaining: number; className?: string }> = ({ daysRemaining, className = '' }) => {
  if (daysRemaining < 0) {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800 ${className}`}>
        <AlertTriangle className="w-3 h-3 text-rose-600" />
        Overdue by {Math.abs(daysRemaining)} {Math.abs(daysRemaining) === 1 ? 'day' : 'days'}
      </span>
    );
  }
  if (daysRemaining === 0) {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse ${className}`}>
        <AlertTriangle className="w-3 h-3 text-rose-600" />
        Expires Today!
      </span>
    );
  }
  if (daysRemaining <= 7) {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 ${className}`}>
        <Clock className="w-3 h-3 text-rose-600" />
        {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
      </span>
    );
  }
  if (daysRemaining <= 30) {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 ${className}`}>
        <Clock className="w-3 h-3 text-amber-600" />
        {daysRemaining} days left
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 ${className}`}>
      {daysRemaining} days left
    </span>
  );
};
