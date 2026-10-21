import {
  User,
  Renewal,
  RenewalHistory,
  DocumentRecord,
  ReminderNotification,
  AnalyticsSummary,
  UserSettings
} from '../types';

const STORAGE_KEY = 'renewease_local_workspace_v1';

interface LocalState {
  users: User[];
  currentUserId: string | null;
  renewals: Renewal[];
  history: RenewalHistory[];
  documents: DocumentRecord[];
  notifications: ReminderNotification[];
}

function calculateExpiryStatus(expiryDateStr: string, currentStatus?: string): 'Active' | 'Expiring Soon' | 'Overdue' | 'Renewed' | 'Cancelled' {
  if (currentStatus === 'Cancelled') return 'Cancelled';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Overdue';
  if (diffDays <= 30) return 'Expiring Soon';
  return 'Active';
}

function createInitialLocalState(): LocalState {
  const demoUserId = 'usr_alex_demo_01';
  const now = new Date();
  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const addDays = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return formatDate(d);
  };

  const subDays = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return formatDate(d);
  };

  const defaultUser: User = {
    id: demoUserId,
    name: 'Dr. Julian Vance',
    email: 'alex@example.com',
    company: 'Apex Innovations Global',
    jobTitle: 'VP of Technology & Infrastructure',
    phone: '+1 (555) 234-8920',
    bio: 'Enterprise architect overseeing cloud operations, software compliance, professional licensing, and vendor relations.',
    avatarUrl: '',
    createdAt: new Date().toISOString(),
    settings: {
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      defaultLeadDays: [30, 15, 7, 1],
      emailNotifications: true,
      weeklyDigest: true,
      soundAlerts: false,
      autoArchiveExpired: false,
      theme: 'light'
    }
  };

  const renewals: Renewal[] = [
    {
      id: `ren_${demoUserId}_1`,
      userId: demoUserId,
      title: 'AWS Enterprise Cloud Infrastructure Support',
      category: 'Contracts',
      vendor: 'Amazon Web Services, Inc.',
      accountNumber: 'AWS-CORP-98042-E',
      cost: 28500,
      billingCycle: 'Annual',
      autoRenew: true,
      startDate: subDays(350),
      expiryDate: addDays(15),
      status: 'Expiring Soon',
      priority: 'Critical',
      reminders: [60, 30, 15, 7, 1],
      notes: 'Includes 24/7 designated Technical Account Manager, 15-minute response SLA, and direct architectural reviews.',
      terms: 'Annual prepayment discount applied at 12%. Renewal window requires 14-day notice for billing modifications.',
      websiteUrl: 'https://aws.amazon.com',
      documentCount: 2,
      renewalCount: 3,
      lastRenewedAt: subDays(350),
      createdAt: subDays(700),
      updatedAt: subDays(30)
    },
    {
      id: `ren_${demoUserId}_2`,
      userId: demoUserId,
      title: 'Salesforce Enterprise CRM & Service Cloud',
      category: 'Subscriptions',
      vendor: 'Salesforce Inc.',
      accountNumber: 'SFDC-LIC-8841-ENT',
      cost: 16800,
      billingCycle: 'Annual',
      autoRenew: false,
      startDate: subDays(335),
      expiryDate: addDays(4),
      status: 'Expiring Soon',
      priority: 'Critical',
      reminders: [45, 30, 15, 7, 2],
      notes: 'Covers 50 user seats across North America and EMEA teams with Premier Support access.',
      terms: 'Net-30 payment terms. Requires renewal PO signed by department director.',
      websiteUrl: 'https://login.salesforce.com',
      documentCount: 1,
      renewalCount: 2,
      lastRenewedAt: subDays(335),
      createdAt: subDays(680),
      updatedAt: subDays(10)
    },
    {
      id: `ren_${demoUserId}_3`,
      userId: demoUserId,
      title: 'Commercial General Liability & Cyber Risk Policy',
      category: 'Insurance',
      vendor: 'Travelers Commercial Insurance Co.',
      accountNumber: 'TRV-POL-77390-GLC',
      cost: 14200,
      billingCycle: 'Annual',
      autoRenew: false,
      startDate: subDays(370),
      expiryDate: subDays(5),
      status: 'Overdue',
      priority: 'High',
      reminders: [60, 30, 15, 7],
      notes: 'Comprehensive liability coverage with $5M aggregate and $2M cyber breach remediation rider.',
      terms: 'Requires annual audited financial statement upload prior to binding renewal certificate.',
      websiteUrl: 'https://www.travelers.com',
      documentCount: 2,
      renewalCount: 1,
      lastRenewedAt: subDays(370),
      createdAt: subDays(370),
      updatedAt: subDays(2)
    },
    {
      id: `ren_${demoUserId}_4`,
      userId: demoUserId,
      title: 'JetBrains All Products Pack Enterprise License',
      category: 'Licenses',
      vendor: 'JetBrains s.r.o.',
      accountNumber: 'JB-CORP-44021',
      cost: 4990,
      billingCycle: 'Annual',
      autoRenew: true,
      startDate: subDays(180),
      expiryDate: addDays(185),
      status: 'Active',
      priority: 'Medium',
      reminders: [30, 15, 7],
      notes: 'Covers 15 IntelliJ IDEA Ultimate, WebStorm, and PyCharm developer workstations.',
      terms: 'Commercial corporate subscription with continuous fallback rights.',
      websiteUrl: 'https://jetbrains.com',
      documentCount: 1,
      renewalCount: 4,
      lastRenewedAt: subDays(180),
      createdAt: subDays(800),
      updatedAt: subDays(50)
    },
    {
      id: `ren_${demoUserId}_5`,
      userId: demoUserId,
      title: 'Dell PowerEdge R750 Enterprise Server Hardware Warranty',
      category: 'Warranties',
      vendor: 'Dell Technologies',
      accountNumber: 'DELL-SVC-99014-PRO',
      cost: 3800,
      billingCycle: 'Annual',
      autoRenew: false,
      startDate: subDays(310),
      expiryDate: addDays(55),
      status: 'Active',
      priority: 'Medium',
      reminders: [60, 30, 14],
      notes: 'ProSupport Plus 4-Hour Onsite Mission-Critical response and Next Business Day parts dispatch.',
      terms: 'Covers serial tag #7HK94B2 located in Primary Data Center Rack B4.',
      websiteUrl: 'https://dell.com',
      documentCount: 1,
      renewalCount: 1,
      lastRenewedAt: subDays(310),
      createdAt: subDays(650),
      updatedAt: subDays(40)
    },
    {
      id: `ren_${demoUserId}_6`,
      userId: demoUserId,
      title: 'ISO/IEC 27001 Security Management Certification Audit',
      category: 'Certifications',
      vendor: 'BSI Group Global Assurance',
      accountNumber: 'BSI-ISMS-2024-81',
      cost: 9500,
      billingCycle: 'Annual',
      autoRenew: false,
      startDate: subDays(320),
      expiryDate: addDays(22),
      status: 'Expiring Soon',
      priority: 'High',
      reminders: [90, 60, 30, 15, 7],
      notes: 'Surveillance audit year 2 scope. All security control evidence gathered in compliance vault.',
      terms: 'Lead auditor scheduled for on-site verification in 3 weeks.',
      websiteUrl: 'https://bsigroup.com',
      documentCount: 3,
      renewalCount: 2,
      lastRenewedAt: subDays(320),
      createdAt: subDays(700),
      updatedAt: subDays(12)
    },
    {
      id: `ren_${demoUserId}_7`,
      userId: demoUserId,
      title: 'Metropolitan Commercial Business Operating Permit',
      category: 'Permits',
      vendor: 'City Department of Commerce & Licensing',
      accountNumber: 'METRO-BUS-2024-0092',
      cost: 1250,
      billingCycle: 'Annual',
      autoRenew: false,
      startDate: subDays(360),
      expiryDate: addDays(8),
      status: 'Expiring Soon',
      priority: 'Critical',
      reminders: [45, 30, 15, 7, 2],
      notes: 'Official municipal facility operating license for Headquarters Building.',
      terms: 'Failure to renew by deadline results in 25% statutory late penalty fee.',
      websiteUrl: 'https://citylicenses.gov',
      documentCount: 1,
      renewalCount: 3,
      lastRenewedAt: subDays(360),
      createdAt: subDays(1100),
      updatedAt: subDays(15)
    },
    {
      id: `ren_${demoUserId}_8`,
      userId: demoUserId,
      title: 'GitHub Enterprise Cloud & Copilot Business Plan',
      category: 'Subscriptions',
      vendor: 'GitHub, Inc. (Microsoft)',
      accountNumber: 'GH-ORG-APEXINNOV',
      cost: 5760,
      billingCycle: 'Monthly',
      autoRenew: true,
      startDate: subDays(25),
      expiryDate: addDays(5),
      status: 'Expiring Soon',
      priority: 'Medium',
      reminders: [7, 3, 1],
      notes: 'Covers 32 active seats with Advanced Security, Secret Scanning, and Copilot code completion.',
      terms: 'Monthly auto-charge to corporate AMEX card ending in 4109.',
      websiteUrl: 'https://github.com',
      documentCount: 1,
      renewalCount: 11,
      lastRenewedAt: subDays(25),
      createdAt: subDays(360),
      updatedAt: subDays(20)
    }
  ];

  const history: RenewalHistory[] = [
    {
      id: `hist_${demoUserId}_1`,
      userId: demoUserId,
      renewalId: renewals[0].id,
      renewalTitle: 'AWS Enterprise Cloud Infrastructure Support',
      category: 'Contracts',
      vendor: 'Amazon Web Services, Inc.',
      previousExpiryDate: subDays(350),
      newExpiryDate: renewals[0].expiryDate,
      previousCost: 26000,
      newCost: 28500,
      costDifference: 2500,
      renewedDate: subDays(350),
      invoiceNumber: 'INV-AWS-2025-901',
      renewalTerms: 'Approved annual contract uplift with 3 dedicated TAM support tickets.',
      notes: 'Successfully renegotiated reserved instances and data egress credits.'
    },
    {
      id: `hist_${demoUserId}_2`,
      userId: demoUserId,
      renewalId: renewals[1].id,
      renewalTitle: 'Salesforce Enterprise CRM & Service Cloud',
      category: 'Subscriptions',
      vendor: 'Salesforce Inc.',
      previousExpiryDate: subDays(335),
      newExpiryDate: renewals[1].expiryDate,
      previousCost: 15400,
      newCost: 16800,
      costDifference: 1400,
      renewedDate: subDays(335),
      invoiceNumber: 'SF-INV-88301',
      renewalTerms: 'Added 5 additional Service Cloud seats for EMEA support expansion.',
      notes: 'Price locked for 12 months with waiver on sandbox environment costs.'
    },
    {
      id: `hist_${demoUserId}_3`,
      userId: demoUserId,
      renewalId: renewals[3].id,
      renewalTitle: 'JetBrains All Products Pack Enterprise License',
      category: 'Licenses',
      vendor: 'JetBrains s.r.o.',
      previousExpiryDate: subDays(180),
      newExpiryDate: renewals[3].expiryDate,
      previousCost: 4990,
      newCost: 4990,
      costDifference: 0,
      renewedDate: subDays(180),
      invoiceNumber: 'JB-ORDER-77192',
      renewalTerms: 'Loyalty continuity discount of 40% maintained.',
      notes: 'Automated renewal processed through developer portal.'
    },
    {
      id: `hist_${demoUserId}_4`,
      userId: demoUserId,
      renewalId: renewals[5].id,
      renewalTitle: 'ISO/IEC 27001 Security Management Certification Audit',
      category: 'Certifications',
      vendor: 'BSI Group Global Assurance',
      previousExpiryDate: subDays(320),
      newExpiryDate: renewals[5].expiryDate,
      previousCost: 9000,
      newCost: 9500,
      costDifference: 500,
      renewedDate: subDays(320),
      invoiceNumber: 'BSI-INSP-2025-104',
      renewalTerms: 'Surveillance Audit Year 1 successfully concluded with zero major non-conformances.',
      notes: 'Auditor commendation on cloud container security policy adherence.'
    }
  ];

  const documents: DocumentRecord[] = [
    {
      id: `doc_${demoUserId}_1`,
      userId: demoUserId,
      renewalId: renewals[0].id,
      renewalTitle: renewals[0].title,
      name: 'AWS_Enterprise_Support_Agreement_2025.pdf',
      fileSize: '3.4 MB',
      fileType: 'application/pdf',
      uploadDate: subDays(350),
      fileUrl: '#'
    },
    {
      id: `doc_${demoUserId}_2`,
      userId: demoUserId,
      renewalId: renewals[0].id,
      renewalTitle: renewals[0].title,
      name: 'AWS_TAM_Escalation_SLA_Matrix.pdf',
      fileSize: '840 KB',
      fileType: 'application/pdf',
      uploadDate: subDays(340),
      fileUrl: '#'
    },
    {
      id: `doc_${demoUserId}_3`,
      userId: demoUserId,
      renewalId: renewals[1].id,
      renewalTitle: renewals[1].title,
      name: 'Salesforce_Master_Subscription_Agreement.pdf',
      fileSize: '4.1 MB',
      fileType: 'application/pdf',
      uploadDate: subDays(335),
      fileUrl: '#'
    },
    {
      id: `doc_${demoUserId}_4`,
      userId: demoUserId,
      renewalId: renewals[2].id,
      renewalTitle: renewals[2].title,
      name: 'Travelers_Commercial_General_Liability_Policy.pdf',
      fileSize: '6.2 MB',
      fileType: 'application/pdf',
      uploadDate: subDays(370),
      fileUrl: '#'
    },
    {
      id: `doc_${demoUserId}_5`,
      userId: demoUserId,
      renewalId: renewals[5].id,
      renewalTitle: renewals[5].title,
      name: 'ISO_27001_Certificate_of_Registration_BSI.pdf',
      fileSize: '2.1 MB',
      fileType: 'application/pdf',
      uploadDate: subDays(320),
      fileUrl: '#'
    },
    {
      id: `doc_${demoUserId}_6`,
      userId: demoUserId,
      renewalId: renewals[6].id,
      renewalTitle: renewals[6].title,
      name: 'City_Commercial_Operating_Permit_2025.pdf',
      fileSize: '950 KB',
      fileType: 'application/pdf',
      uploadDate: subDays(360),
      fileUrl: '#'
    }
  ];

  const notifications: ReminderNotification[] = [
    {
      id: `notif_${demoUserId}_1`,
      userId: demoUserId,
      renewalId: renewals[1].id,
      renewalTitle: renewals[1].title,
      category: renewals[1].category,
      urgency: 'critical',
      message: 'CRITICAL: Salesforce CRM subscription expires in 4 days! PO approval required.',
      daysRemaining: 4,
      dueDate: renewals[1].expiryDate,
      isRead: false,
      createdAt: now.toISOString(),
      simulatedEmailSent: true,
      simulatedEmailSentAt: now.toISOString()
    },
    {
      id: `notif_${demoUserId}_2`,
      userId: demoUserId,
      renewalId: renewals[2].id,
      renewalTitle: renewals[2].title,
      category: renewals[2].category,
      urgency: 'critical',
      message: 'OVERDUE NOTICE: Commercial Liability & Cyber Policy expired 5 days ago. Binder renewal needed urgently.',
      daysRemaining: -5,
      dueDate: renewals[2].expiryDate,
      isRead: false,
      createdAt: now.toISOString(),
      simulatedEmailSent: true,
      simulatedEmailSentAt: now.toISOString()
    },
    {
      id: `notif_${demoUserId}_3`,
      userId: demoUserId,
      renewalId: renewals[6].id,
      renewalTitle: renewals[6].title,
      category: renewals[6].category,
      urgency: 'warning',
      message: 'Upcoming Deadline: Municipal Commercial Operating Permit expires in 8 days.',
      daysRemaining: 8,
      dueDate: renewals[6].expiryDate,
      isRead: false,
      createdAt: now.toISOString(),
      simulatedEmailSent: false,
      simulatedEmailSentAt: null
    },
    {
      id: `notif_${demoUserId}_4`,
      userId: demoUserId,
      renewalId: renewals[0].id,
      renewalTitle: renewals[0].title,
      category: renewals[0].category,
      urgency: 'warning',
      message: 'Upcoming Renewal: AWS Enterprise Cloud Support expires in 15 days.',
      daysRemaining: 15,
      dueDate: renewals[0].expiryDate,
      isRead: true,
      createdAt: now.toISOString(),
      simulatedEmailSent: true,
      simulatedEmailSentAt: now.toISOString()
    }
  ];

  return {
    users: [defaultUser],
    currentUserId: demoUserId,
    renewals,
    history,
    documents,
    notifications
  };
}

class LocalWorkspaceManager {
  private state: LocalState;

  constructor() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        this.state = JSON.parse(raw);
      } catch (e) {
        this.state = createInitialLocalState();
        this.persist();
      }
    } else {
      this.state = createInitialLocalState();
      this.persist();
    }
    this.refreshStatuses();
  }

  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  private refreshStatuses() {
    let changed = false;
    for (const r of this.state.renewals) {
      if (r.status !== 'Cancelled') {
        const calculated = calculateExpiryStatus(r.expiryDate, r.status);
        if (calculated !== r.status) {
          r.status = calculated;
          changed = true;
        }
      }
    }
    if (changed) this.persist();
  }

  public getCurrentUser(): User | null {
    if (!this.state.currentUserId) return null;
    return this.state.users.find(u => u.id === this.state.currentUserId) || null;
  }

  public setCurrentUserId(id: string | null) {
    this.state.currentUserId = id;
    this.persist();
  }

  public findUserByEmail(email: string): User | undefined {
    return this.state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: User): User {
    this.state.users.push(user);
    this.state.currentUserId = user.id;

    // Seed private workspace items for this user
    const initial = createInitialLocalState();
    const userRenewals = initial.renewals.map(r => ({
      ...r,
      id: `ren_${user.id}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.id
    }));

    const userHistory = initial.history.map(h => ({
      ...h,
      id: `hist_${user.id}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.id
    }));

    const userDocs = initial.documents.map(d => ({
      ...d,
      id: `doc_${user.id}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.id
    }));

    const userNotifs = initial.notifications.map(n => ({
      ...n,
      id: `notif_${user.id}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.id
    }));

    this.state.renewals.push(...userRenewals);
    this.state.history.push(...userHistory);
    this.state.documents.push(...userDocs);
    this.state.notifications.push(...userNotifs);

    this.persist();
    return user;
  }

  public updateUser(userId: string, updates: Partial<User>): User | undefined {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) return undefined;
    Object.assign(user, updates);
    this.persist();
    return user;
  }

  public getRenewals(userId: string): Renewal[] {
    this.refreshStatuses();
    return this.state.renewals.filter(r => r.userId === userId);
  }

  public getRenewalById(userId: string, id: string): Renewal | undefined {
    this.refreshStatuses();
    return this.state.renewals.find(r => r.id === id && r.userId === userId);
  }

  public createRenewal(userId: string, data: Partial<Renewal>): Renewal {
    const id = `ren_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const expiryDate = data.expiryDate || now.split('T')[0];
    const status = calculateExpiryStatus(expiryDate, data.status);

    const newRenewal: Renewal = {
      id,
      userId,
      title: data.title || 'Untitled Renewal',
      category: data.category || 'Contracts',
      vendor: data.vendor || 'Unknown Vendor',
      accountNumber: data.accountNumber || 'N/A',
      cost: Number(data.cost) || 0,
      billingCycle: data.billingCycle || 'Annual',
      autoRenew: Boolean(data.autoRenew),
      startDate: data.startDate || now.split('T')[0],
      expiryDate,
      status,
      priority: data.priority || 'Medium',
      reminders: data.reminders || [30, 15, 7],
      notes: data.notes || '',
      terms: data.terms || '',
      websiteUrl: data.websiteUrl || '',
      documentCount: 0,
      renewalCount: 0,
      lastRenewedAt: null,
      createdAt: now,
      updatedAt: now
    };

    this.state.renewals.unshift(newRenewal);
    this.persist();
    return newRenewal;
  }

  public updateRenewal(userId: string, id: string, updates: Partial<Renewal>): Renewal | undefined {
    const r = this.getRenewalById(userId, id);
    if (!r) return undefined;

    if (updates.expiryDate) {
      updates.status = calculateExpiryStatus(updates.expiryDate, updates.status || r.status);
    }

    Object.assign(r, updates, { updatedAt: new Date().toISOString() });
    this.persist();
    return r;
  }

  public deleteRenewal(userId: string, id: string): boolean {
    const initialLen = this.state.renewals.length;
    this.state.renewals = this.state.renewals.filter(r => !(r.id === id && r.userId === userId));
    this.state.history = this.state.history.filter(h => !(h.renewalId === id && h.userId === userId));
    this.state.documents = this.state.documents.filter(d => !(d.renewalId === id && d.userId === userId));
    this.state.notifications = this.state.notifications.filter(n => !(n.renewalId === id && n.userId === userId));
    this.persist();
    return this.state.renewals.length < initialLen;
  }

  public renewRecord(userId: string, id: string, params: {
    newExpiryDate: string;
    newCost: number;
    invoiceNumber?: string;
    renewalTerms?: string;
    notes?: string;
  }): { renewal: Renewal; historyEntry: RenewalHistory } | null {
    const renewal = this.getRenewalById(userId, id);
    if (!renewal) return null;

    const previousExpiry = renewal.expiryDate;
    const previousCost = renewal.cost;
    const costDiff = params.newCost - previousCost;

    const historyEntry: RenewalHistory = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      renewalId: renewal.id,
      renewalTitle: renewal.title,
      category: renewal.category,
      vendor: renewal.vendor,
      previousExpiryDate: previousExpiry,
      newExpiryDate: params.newExpiryDate,
      previousCost,
      newCost: params.newCost,
      costDifference: costDiff,
      renewedDate: new Date().toISOString().split('T')[0],
      invoiceNumber: params.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
      renewalTerms: params.renewalTerms || 'Contract cycle extended under current negotiated terms.',
      notes: params.notes || `Renewed from ${previousExpiry} to ${params.newExpiryDate}.`
    };

    this.state.history.unshift(historyEntry);

    renewal.expiryDate = params.newExpiryDate;
    renewal.cost = params.newCost;
    renewal.status = calculateExpiryStatus(params.newExpiryDate);
    renewal.renewalCount = (renewal.renewalCount || 0) + 1;
    renewal.lastRenewedAt = new Date().toISOString();
    renewal.updatedAt = new Date().toISOString();

    this.persist();
    return { renewal, historyEntry };
  }

  public getHistory(userId: string): RenewalHistory[] {
    return this.state.history.filter(h => h.userId === userId);
  }

  public getDocuments(userId: string): DocumentRecord[] {
    return this.state.documents.filter(d => d.userId === userId);
  }

  public addDocument(userId: string, doc: Omit<DocumentRecord, 'id' | 'userId' | 'uploadDate'>): DocumentRecord {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newDoc: DocumentRecord = {
      ...doc,
      id,
      userId,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    this.state.documents.unshift(newDoc);

    if (doc.renewalId) {
      const renewal = this.getRenewalById(userId, doc.renewalId);
      if (renewal) renewal.documentCount = (renewal.documentCount || 0) + 1;
    }

    this.persist();
    return newDoc;
  }

  public deleteDocument(userId: string, id: string): boolean {
    const doc = this.state.documents.find(d => d.id === id && d.userId === userId);
    if (!doc) return false;

    if (doc.renewalId) {
      const renewal = this.getRenewalById(userId, doc.renewalId);
      if (renewal && renewal.documentCount > 0) renewal.documentCount -= 1;
    }

    this.state.documents = this.state.documents.filter(d => !(d.id === id && d.userId === userId));
    this.persist();
    return true;
  }

  public getNotifications(userId: string): ReminderNotification[] {
    return this.state.notifications.filter(n => n.userId === userId);
  }

  public markNotificationRead(userId: string, id: string): boolean {
    const notif = this.state.notifications.find(n => n.id === id && n.userId === userId);
    if (!notif) return false;
    notif.isRead = true;
    this.persist();
    return true;
  }

  public markAllNotificationsRead(userId: string) {
    this.state.notifications.forEach(n => {
      if (n.userId === userId) n.isRead = true;
    });
    this.persist();
  }

  public simulateEmail(userId: string, id: string) {
    const notif = this.state.notifications.find(n => n.id === id && n.userId === userId);
    if (!notif) return null;
    notif.simulatedEmailSent = true;
    notif.simulatedEmailSentAt = new Date().toISOString();
    this.persist();
    return notif;
  }

  public resetUserWorkspace(userId: string) {
    const initial = createInitialLocalState();
    this.state.renewals = this.state.renewals.filter(r => r.userId !== userId);
    this.state.history = this.state.history.filter(h => h.userId !== userId);
    this.state.documents = this.state.documents.filter(d => d.userId !== userId);
    this.state.notifications = this.state.notifications.filter(n => n.userId !== userId);

    const userRenewals = initial.renewals.map(r => ({ ...r, userId }));
    const userHistory = initial.history.map(h => ({ ...h, userId }));
    const userDocs = initial.documents.map(d => ({ ...d, userId }));
    const userNotifs = initial.notifications.map(n => ({ ...n, userId }));

    this.state.renewals.push(...userRenewals);
    this.state.history.push(...userHistory);
    this.state.documents.push(...userDocs);
    this.state.notifications.push(...userNotifs);

    this.persist();
  }
}

export const localStore = new LocalWorkspaceManager();
