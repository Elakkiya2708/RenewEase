export type RenewalCategory = 
  | 'Contracts'
  | 'Licenses'
  | 'Certifications'
  | 'Warranties'
  | 'Insurance'
  | 'Subscriptions'
  | 'Permits';

export type RenewalStatus = 
  | 'Active'
  | 'Expiring Soon'
  | 'Overdue'
  | 'Renewed'
  | 'Cancelled';

export type RenewalPriority = 
  | 'Low'
  | 'Medium'
  | 'High'
  | 'Critical';

export type BillingCycle = 
  | 'Annual'
  | 'Monthly'
  | 'Quarterly'
  | 'Bi-Annual'
  | 'One-Time';

export interface UserSettings {
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD';
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  defaultLeadDays: number[];
  emailNotifications: boolean;
  weeklyDigest: boolean;
  soundAlerts: boolean;
  autoArchiveExpired: boolean;
  theme: 'light' | 'dark';
}

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  phone: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
  settings: UserSettings;
}

export interface Renewal {
  id: string;
  userId: string;
  title: string;
  category: RenewalCategory;
  vendor: string;
  accountNumber: string;
  cost: number;
  billingCycle: BillingCycle;
  autoRenew: boolean;
  startDate: string;
  expiryDate: string;
  status: RenewalStatus;
  priority: RenewalPriority;
  reminders: number[];
  notes: string;
  terms: string;
  websiteUrl: string;
  documentCount: number;
  renewalCount: number;
  lastRenewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RenewalHistory {
  id: string;
  userId: string;
  renewalId: string;
  renewalTitle: string;
  category: string;
  vendor: string;
  previousExpiryDate: string;
  newExpiryDate: string;
  previousCost: number;
  newCost: number;
  costDifference: number;
  renewedDate: string;
  invoiceNumber: string;
  renewalTerms: string;
  notes: string;
}

export interface DocumentRecord {
  id: string;
  userId: string;
  renewalId: string | null;
  renewalTitle: string;
  name: string;
  fileSize: string;
  fileType: string;
  uploadDate: string;
  fileUrl: string;
}

export interface ReminderNotification {
  id: string;
  userId: string;
  renewalId: string;
  renewalTitle: string;
  category: string;
  urgency: 'info' | 'warning' | 'critical';
  message: string;
  daysRemaining: number;
  dueDate: string;
  isRead: boolean;
  createdAt: string;
  simulatedEmailSent: boolean;
  simulatedEmailSentAt: string | null;
}

export interface AnalyticsSummary {
  metrics: {
    totalRenewals: number;
    activeRenewals: number;
    expiringSoonRenewals: number;
    overdueRenewals: number;
    cancelledRenewals: number;
    totalAnnualSpend: number;
    estimatedMonthlySpend: number;
  };
  categoryBreakdown: {
    category: string;
    spend: number;
    count: number;
  }[];
  monthlyBreakdown: {
    month: string;
    spend: number;
  }[];
  statusBreakdown: {
    status: string;
    count: number;
    color: string;
  }[];
  priorityBreakdown: {
    priority: string;
    count: number;
  }[];
  topVendors: {
    vendor: string;
    title: string;
    category: string;
    cost: number;
    expiryDate: string;
  }[];
}

export type PageView = 
  | 'dashboard'
  | 'renewals'
  | 'renewal-details'
  | 'calendar'
  | 'reminders'
  | 'documents'
  | 'history'
  | 'reports'
  | 'profile'
  | 'settings';
