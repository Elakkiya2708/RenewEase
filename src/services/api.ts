import {
  User,
  Renewal,
  RenewalHistory,
  DocumentRecord,
  ReminderNotification,
  AnalyticsSummary,
  UserSettings
} from '../types';

const API_BASE = '/api';

export function getToken(): string | null {
  return localStorage.getItem('renewease_token');
}

export function setToken(token: string): void {
  localStorage.setItem('renewease_token', token);
}

export function removeToken(): void {
  localStorage.removeItem('renewease_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    if (!res.ok) {
      let errMsg = 'An unexpected error occurred.';
      try {
        const errData = await res.json();
        errMsg = errData.error || errData.message || errMsg;
      } catch (e) {
        errMsg = res.statusText || errMsg;
      }
      throw new Error(errMsg);
    }

    return await res.json();
  } catch (err: any) {
    // If backend is unreachable or throws network error, check if offline fallback needed
    console.warn(`API call to ${endpoint} failed:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  register: (data: { name: string; email: string; password: string; company?: string; jobTitle?: string; phone?: string }) =>
    request<{ message: string; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  login: (data: { email: string; password: string }) =>
    request<{ message: string; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getMe: () => request<{ user: User }>('/auth/me'),

  updateProfile: (data: Partial<User>) =>
    request<{ message: string; user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<{ message: string }>('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Renewals
  getRenewals: (params?: { search?: string; category?: string; status?: string; priority?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') query.append(k, v);
      });
    }
    const qs = query.toString();
    return request<{ renewals: Renewal[]; count: number }>(`/renewals${qs ? `?${qs}` : ''}`);
  },

  getRenewalById: (id: string) =>
    request<{ renewal: Renewal }>(`/renewals/${id}`),

  createRenewal: (data: Partial<Renewal>) =>
    request<{ message: string; renewal: Renewal }>('/renewals', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateRenewal: (id: string, data: Partial<Renewal>) =>
    request<{ message: string; renewal: Renewal }>(`/renewals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  deleteRenewal: (id: string) =>
    request<{ message: string }>(`/renewals/${id}`, {
      method: 'DELETE'
    }),

  renewRecord: (id: string, data: { newExpiryDate: string; newCost: number; invoiceNumber?: string; renewalTerms?: string; notes?: string }) =>
    request<{ message: string; renewal: Renewal; historyEntry: RenewalHistory }>(`/renewals/${id}/renew`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // History
  getHistory: () =>
    request<{ history: RenewalHistory[] }>('/history'),

  // Documents
  getDocuments: () =>
    request<{ documents: DocumentRecord[] }>('/documents'),

  uploadDocument: (data: { renewalId?: string | null; fileName: string; fileSize?: string; fileType?: string; customTitle?: string }) =>
    request<{ message: string; document: DocumentRecord }>('/documents/upload', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  deleteDocument: (id: string) =>
    request<{ message: string }>(`/documents/${id}`, {
      method: 'DELETE'
    }),

  // Reminders
  getReminders: () =>
    request<{ notifications: ReminderNotification[]; unreadCount: number }>('/reminders'),

  markReminderRead: (id: string) =>
    request<{ message: string }>(`/reminders/${id}/read`, {
      method: 'PATCH'
    }),

  markAllRemindersRead: () =>
    request<{ message: string }>('/reminders/read-all', {
      method: 'POST'
    }),

  simulateEmail: (id: string) =>
    request<{
      message: string;
      notification: ReminderNotification;
      emailPayload: {
        transport: string;
        status: string;
        recipient: string;
        subject: string;
        sentAt: string;
        htmlPreview: string;
      };
    }>(`/reminders/${id}/simulate-email`, {
      method: 'POST'
    }),

  // Analytics
  getAnalytics: () =>
    request<AnalyticsSummary>('/analytics'),

  // Settings
  getSettings: () =>
    request<{ settings: UserSettings }>('/settings'),

  updateSettings: (settings: Partial<UserSettings>) =>
    request<{ message: string; settings: UserSettings }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    }),

  resetSampleData: () =>
    request<{ message: string }>('/settings/reset-sample', {
      method: 'POST'
    }),

  // Public Contact Inquiry
  submitContact: (data: { name: string; email: string; subject: string; message: string }) =>
    request<{ success: boolean; messageId: string; message: string; inquiry: any }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    })
};
