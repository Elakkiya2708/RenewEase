import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Renewal,
  RenewalHistory,
  DocumentRecord,
  ReminderNotification,
  AnalyticsSummary,
  PageView,
  RenewalCategory,
  RenewalStatus
} from '../types';
import { api } from '../services/api';
import { localStore } from '../services/localStore';
import { useAuth } from './AuthContext';

interface RenewalContextType {
  renewals: Renewal[];
  history: RenewalHistory[];
  documents: DocumentRecord[];
  notifications: ReminderNotification[];
  unreadNotificationsCount: number;
  analytics: AnalyticsSummary | null;
  loading: boolean;
  currentView: PageView;
  setCurrentView: (view: PageView) => void;
  selectedRenewalId: string | null;
  setSelectedRenewalId: (id: string | null) => void;
  selectedRenewal: Renewal | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  refreshAll: () => Promise<void>;
  addRenewal: (data: Partial<Renewal>) => Promise<Renewal>;
  updateRenewal: (id: string, data: Partial<Renewal>) => Promise<void>;
  deleteRenewal: (id: string) => Promise<void>;
  renewRecord: (id: string, data: { newExpiryDate: string; newCost: number; invoiceNumber?: string; renewalTerms?: string; notes?: string }) => Promise<void>;
  uploadDocument: (data: { renewalId?: string | null; fileName: string; fileSize?: string; fileType?: string; customTitle?: string }) => Promise<DocumentRecord>;
  deleteDocument: (id: string) => Promise<void>;
  markReminderRead: (id: string) => Promise<void>;
  markAllRemindersRead: () => Promise<void>;
  simulateEmail: (id: string) => Promise<any>;
  resetWorkspace: () => Promise<void>;
  formatCurrency: (amount: number) => string;
  formatDate: (dateStr: string) => string;
  getDaysRemaining: (dateStr: string) => number;
}

const RenewalContext = createContext<RenewalContextType | undefined>(undefined);

export const RenewalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [renewals, setRenewals] = useState<Renewal[]>([]);
  const [history, setHistory] = useState<RenewalHistory[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [notifications, setNotifications] = useState<ReminderNotification[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Navigation & filtering state
  const [currentView, setCurrentView] = useState<PageView>('dashboard');
  const [selectedRenewalId, setSelectedRenewalId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const selectedRenewal = renewals.find(r => r.id === selectedRenewalId) || null;
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  // Calculate days remaining
  const getDaysRemaining = useCallback((dateStr: string): number => {
    if (!dateStr) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, []);

  // Format currency based on user preferences
  const formatCurrency = useCallback((amount: number): string => {
    const currency = user?.settings?.currency || 'USD';
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      CAD: 'CA$'
    };
    const symbol = symbols[currency] || '$';
    return `${symbol}${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }, [user?.settings?.currency]);

  // Format date based on user preferences
  const formatDate = useCallback((dateStr: string): string => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;

      const format = user?.settings?.dateFormat || 'MM/DD/YYYY';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');

      if (format === 'DD/MM/YYYY') return `${day}/${month}/${year}`;
      if (format === 'YYYY-MM-DD') return `${year}-${month}-${day}`;
      return `${month}/${day}/${year}`;
    } catch {
      return dateStr;
    }
  }, [user?.settings?.dateFormat]);

  // Compute local analytics from items
  const computeLocalAnalytics = useCallback((items: Renewal[]): AnalyticsSummary => {
    let totalAnnualSpend = 0;
    let activeCount = 0;
    let expiringSoonCount = 0;
    let overdueCount = 0;
    let cancelledCount = 0;

    const catMap: Record<string, { spend: number; count: number }> = {};
    const priorityMap: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlySpend: Record<string, number> = {};
    monthNames.forEach(m => { monthlySpend[m] = 0; });

    items.forEach(r => {
      if (r.status !== 'Cancelled') {
        let annual = r.cost;
        if (r.billingCycle === 'Monthly') annual = r.cost * 12;
        else if (r.billingCycle === 'Quarterly') annual = r.cost * 4;
        else if (r.billingCycle === 'Bi-Annual') annual = r.cost * 2;

        totalAnnualSpend += annual;

        if (!catMap[r.category]) catMap[r.category] = { spend: 0, count: 0 };
        catMap[r.category].spend += annual;
        catMap[r.category].count += 1;

        try {
          const d = new Date(r.expiryDate);
          const m = monthNames[d.getMonth()];
          if (m) monthlySpend[m] = (monthlySpend[m] || 0) + r.cost;
        } catch (e) {}
      }

      if (r.status === 'Active') activeCount++;
      else if (r.status === 'Expiring Soon') expiringSoonCount++;
      else if (r.status === 'Overdue') overdueCount++;
      else if (r.status === 'Cancelled') cancelledCount++;

      if (priorityMap[r.priority] !== undefined) {
        priorityMap[r.priority]++;
      }
    });

    const categoryBreakdown = Object.entries(catMap).map(([category, val]) => ({
      category,
      spend: val.spend,
      count: val.count
    })).sort((a, b) => b.spend - a.spend);

    const monthlyBreakdown = monthNames.map(month => ({
      month,
      spend: monthlySpend[month] || 0
    }));

    const statusBreakdown = [
      { status: 'Active', count: activeCount, color: '#10b981' },
      { status: 'Expiring Soon', count: expiringSoonCount, color: '#f59e0b' },
      { status: 'Overdue', count: overdueCount, color: '#ef4444' },
      { status: 'Cancelled', count: cancelledCount, color: '#64748b' }
    ];

    const topVendors = items
      .filter(r => r.status !== 'Cancelled')
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 5)
      .map(r => ({
        vendor: r.vendor,
        title: r.title,
        category: r.category,
        cost: r.cost,
        expiryDate: r.expiryDate
      }));

    return {
      metrics: {
        totalRenewals: items.length,
        activeRenewals: activeCount,
        expiringSoonRenewals: expiringSoonCount,
        overdueRenewals: overdueCount,
        cancelledRenewals: cancelledCount,
        totalAnnualSpend,
        estimatedMonthlySpend: Math.round(totalAnnualSpend / 12)
      },
      categoryBreakdown,
      monthlyBreakdown,
      statusBreakdown,
      priorityBreakdown: Object.entries(priorityMap).map(([priority, count]) => ({ priority, count })),
      topVendors
    };
  }, []);

  // Fetch all data for current user
  const refreshAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const [renRes, histRes, docRes, notifRes, anaRes] = await Promise.all([
        api.getRenewals(),
        api.getHistory(),
        api.getDocuments(),
        api.getReminders(),
        api.getAnalytics()
      ]);

      setRenewals(renRes.renewals);
      setHistory(histRes.history);
      setDocuments(docRes.documents);
      setNotifications(notifRes.notifications);
      setAnalytics(anaRes);
    } catch (err) {
      // Offline fallback from localStore
      const localRenewals = localStore.getRenewals(user.id);
      const localHistory = localStore.getHistory(user.id);
      const localDocs = localStore.getDocuments(user.id);
      const localNotifs = localStore.getNotifications(user.id);
      const computedAnalytics = computeLocalAnalytics(localRenewals);

      setRenewals(localRenewals);
      setHistory(localHistory);
      setDocuments(localDocs);
      setNotifications(localNotifs);
      setAnalytics(computedAnalytics);
    } finally {
      setLoading(false);
    }
  }, [user, computeLocalAnalytics]);

  useEffect(() => {
    if (isAuthenticated && user) {
      refreshAll();
    }
  }, [isAuthenticated, user, refreshAll]);

  // CRUD actions
  const addRenewal = async (data: Partial<Renewal>): Promise<Renewal> => {
    if (!user) throw new Error('Authentication required');
    try {
      const res = await api.createRenewal(data);
      await refreshAll();
      return res.renewal;
    } catch (err) {
      const created = localStore.createRenewal(user.id, data);
      await refreshAll();
      return created;
    }
  };

  const updateRenewal = async (id: string, data: Partial<Renewal>) => {
    if (!user) return;
    try {
      await api.updateRenewal(id, data);
    } catch (err) {
      localStore.updateRenewal(user.id, id, data);
    }
    await refreshAll();
  };

  const deleteRenewal = async (id: string) => {
    if (!user) return;
    try {
      await api.deleteRenewal(id);
    } catch (err) {
      localStore.deleteRenewal(user.id, id);
    }
    if (selectedRenewalId === id) {
      setSelectedRenewalId(null);
      setCurrentView('renewals');
    }
    await refreshAll();
  };

  const renewRecord = async (id: string, data: { newExpiryDate: string; newCost: number; invoiceNumber?: string; renewalTerms?: string; notes?: string }) => {
    if (!user) return;
    try {
      await api.renewRecord(id, data);
    } catch (err) {
      localStore.renewRecord(user.id, id, data);
    }
    await refreshAll();
  };

  const uploadDocument = async (data: { renewalId?: string | null; fileName: string; fileSize?: string; fileType?: string; customTitle?: string }): Promise<DocumentRecord> => {
    if (!user) throw new Error('Authentication required');
    try {
      const res = await api.uploadDocument(data);
      await refreshAll();
      return res.document;
    } catch (err) {
      const created = localStore.addDocument(user.id, {
        renewalId: data.renewalId || null,
        renewalTitle: data.customTitle || 'General Workspace File',
        name: data.fileName,
        fileSize: data.fileSize || '1.5 MB',
        fileType: data.fileType || 'application/pdf',
        fileUrl: '#'
      });
      await refreshAll();
      return created;
    }
  };

  const deleteDocument = async (id: string) => {
    if (!user) return;
    try {
      await api.deleteDocument(id);
    } catch (err) {
      localStore.deleteDocument(user.id, id);
    }
    await refreshAll();
  };

  const markReminderRead = async (id: string) => {
    if (!user) return;
    try {
      await api.markReminderRead(id);
    } catch (err) {
      localStore.markNotificationRead(user.id, id);
    }
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRemindersRead = async () => {
    if (!user) return;
    try {
      await api.markAllRemindersRead();
    } catch (err) {
      localStore.markAllNotificationsRead(user.id);
    }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const simulateEmail = async (id: string) => {
    if (!user) return null;
    try {
      const res = await api.simulateEmail(id);
      await refreshAll();
      return res;
    } catch (err) {
      const notif = localStore.simulateEmail(user.id, id);
      await refreshAll();
      return {
        message: 'Test email reminder simulation successfully sent!',
        notification: notif,
        emailPayload: {
          transport: 'Simulated Enterprise SMTP Gateway (Ready for AWS SES / SendGrid)',
          status: 'Dispatched (Simulated)',
          recipient: `${user.name} <${user.email}>`,
          subject: `[RenewEase Alert] Action Required: ${notif?.renewalTitle}`,
          sentAt: new Date().toISOString(),
          htmlPreview: '<p>Enterprise email notification simulation preview.</p>'
        }
      };
    }
  };

  const resetWorkspace = async () => {
    if (!user) return;
    try {
      await api.resetSampleData();
    } catch (err) {
      localStore.resetUserWorkspace(user.id);
    }
    await refreshAll();
  };

  return (
    <RenewalContext.Provider
      value={{
        renewals,
        history,
        documents,
        notifications,
        unreadNotificationsCount,
        analytics,
        loading,
        currentView,
        setCurrentView,
        selectedRenewalId,
        setSelectedRenewalId,
        selectedRenewal,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,
        refreshAll,
        addRenewal,
        updateRenewal,
        deleteRenewal,
        renewRecord,
        uploadDocument,
        deleteDocument,
        markReminderRead,
        markAllRemindersRead,
        simulateEmail,
        resetWorkspace,
        formatCurrency,
        formatDate,
        getDaysRemaining
      }}
    >
      {children}
    </RenewalContext.Provider>
  );
};

export const useRenewal = () => {
  const context = useContext(RenewalContext);
  if (!context) throw new Error('useRenewal must be used within a RenewalProvider');
  return context;
};
