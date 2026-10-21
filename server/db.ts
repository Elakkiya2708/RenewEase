import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  company: string;
  jobTitle: string;
  phone: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
  settings: {
    currency: string;
    dateFormat: string;
    defaultLeadDays: number[];
    emailNotifications: boolean;
    weeklyDigest: boolean;
    soundAlerts: boolean;
    autoArchiveExpired: boolean;
    theme: 'light' | 'dark';
  };
}

export interface Renewal {
  id: string;
  userId: string;
  title: string;
  category: 'Contracts' | 'Licenses' | 'Certifications' | 'Warranties' | 'Insurance' | 'Subscriptions' | 'Permits';
  vendor: string;
  accountNumber: string;
  cost: number;
  billingCycle: 'Annual' | 'Monthly' | 'Quarterly' | 'Bi-Annual' | 'One-Time';
  autoRenew: boolean;
  startDate: string;
  expiryDate: string;
  status: 'Active' | 'Expiring Soon' | 'Overdue' | 'Renewed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
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

export interface DatabaseSchema {
  users: User[];
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
  
  if (diffDays < 0) {
    return 'Overdue';
  } else if (diffDays <= 30) {
    return 'Expiring Soon';
  } else {
    return 'Active';
  }
}

export class Database {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error loading db file, re-initializing', err);
        this.data = this.createInitialData();
        this.save();
      }
    } else {
      this.data = this.createInitialData();
      this.save();
    }

    // Refresh statuses dynamically on startup
    this.refreshAllStatuses();
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save database file:', err);
    }
  }

  private refreshAllStatuses() {
    let changed = false;
    for (const r of this.data.renewals) {
      if (r.status !== 'Cancelled') {
        const calculated = calculateExpiryStatus(r.expiryDate, r.status);
        if (calculated !== r.status) {
          r.status = calculated;
          changed = true;
        }
      }
    }
    if (changed) {
      this.save();
    }
  }

  public createInitialData(): DatabaseSchema {
    const demoPasswordHash = bcrypt.hashSync('password123', 10);
    const demoUserId = 'usr_alex_demo_01';

    const demoUser: User = {
      id: demoUserId,
      name: 'Dr. Julian Vance',
      email: 'alex@example.com',
      passwordHash: demoPasswordHash,
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

    const initialRenewals = this.generateSampleRenewals(demoUserId);
    const initialHistory = this.generateSampleHistory(demoUserId, initialRenewals);
    const initialDocs = this.generateSampleDocuments(demoUserId, initialRenewals);
    const initialNotifications = this.generateSampleNotifications(demoUserId, initialRenewals);

    return {
      users: [demoUser],
      renewals: initialRenewals,
      history: initialHistory,
      documents: initialDocs,
      notifications: initialNotifications
    };
  }

  public seedUserSampleData(userId: string) {
    const sampleRenewals = this.generateSampleRenewals(userId);
    const sampleHistory = this.generateSampleHistory(userId, sampleRenewals);
    const sampleDocs = this.generateSampleDocuments(userId, sampleRenewals);
    const sampleNotifs = this.generateSampleNotifications(userId, sampleRenewals);

    this.data.renewals.push(...sampleRenewals);
    this.data.history.push(...sampleHistory);
    this.data.documents.push(...sampleDocs);
    this.data.notifications.push(...sampleNotifs);
    this.save();
  }

  public generateSampleRenewals(userId: string): Renewal[] {
    const now = new Date();
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    // Helper for relative dates
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

    return [
      {
        id: `ren_${userId}_1`,
        userId,
        title: 'AWS Enterprise Cloud Infrastructure Support',
        category: 'Contracts',
        vendor: 'Amazon Web Services, Inc.',
        accountNumber: 'AWS-CORP-98042-E',
        cost: 28500,
        billingCycle: 'Annual',
        autoRenew: true,
        startDate: subDays(350),
        expiryDate: addDays(15), // Expiring soon (15 days)
        status: 'Expiring Soon',
        priority: 'Critical',
        reminders: [60, 30, 15, 7, 1],
        notes: 'Includes 24/7 designated Technical Account Manager, 15-minute response SLA, and direct architectural reviews.',
        terms: 'Annual prepayment discount applied at 12%. Renewal window requires 14-day notice for billing modifications.',
        websiteUrl: 'https://aws.amazon.com/console',
        documentCount: 2,
        renewalCount: 3,
        lastRenewedAt: subDays(350),
        createdAt: subDays(700),
        updatedAt: subDays(30)
      },
      {
        id: `ren_${userId}_2`,
        userId,
        title: 'Salesforce Enterprise CRM & Service Cloud',
        category: 'Subscriptions',
        vendor: 'Salesforce Inc.',
        accountNumber: 'SFDC-LIC-8841-ENT',
        cost: 16800,
        billingCycle: 'Annual',
        autoRenew: false,
        startDate: subDays(335),
        expiryDate: addDays(4), // Critical expiry in 4 days!
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
        id: `ren_${userId}_3`,
        userId,
        title: 'Commercial General Liability & Cyber Risk Policy',
        category: 'Insurance',
        vendor: 'Travelers Commercial Insurance Co.',
        accountNumber: 'TRV-POL-77390-GLC',
        cost: 14200,
        billingCycle: 'Annual',
        autoRenew: false,
        startDate: subDays(370),
        expiryDate: subDays(5), // Overdue by 5 days!
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
        id: `ren_${userId}_4`,
        userId,
        title: 'JetBrains All Products Pack Enterprise License',
        category: 'Licenses',
        vendor: 'JetBrains s.r.o.',
        accountNumber: 'JB-CORP-44021',
        cost: 4990,
        billingCycle: 'Annual',
        autoRenew: true,
        startDate: subDays(180),
        expiryDate: addDays(185), // Active
        status: 'Active',
        priority: 'Medium',
        reminders: [30, 15, 7],
        notes: 'Covers 15 IntelliJ IDEA Ultimate, WebStorm, and PyCharm developer workstations.',
        terms: 'Commercial corporate subscription with continuous fallback rights.',
        websiteUrl: 'https://account.jetbrains.com',
        documentCount: 1,
        renewalCount: 4,
        lastRenewedAt: subDays(180),
        createdAt: subDays(800),
        updatedAt: subDays(50)
      },
      {
        id: `ren_${userId}_5`,
        userId,
        title: 'Dell PowerEdge R750 Enterprise Server Hardware Warranty',
        category: 'Warranties',
        vendor: 'Dell Technologies',
        accountNumber: 'DELL-SVC-99014-PRO',
        cost: 3800,
        billingCycle: 'Annual',
        autoRenew: false,
        startDate: subDays(310),
        expiryDate: addDays(55), // Active (55 days)
        status: 'Active',
        priority: 'Medium',
        reminders: [60, 30, 14],
        notes: 'ProSupport Plus 4-Hour Onsite Mission-Critical response and Next Business Day parts dispatch.',
        terms: 'Covers serial tag #7HK94B2 located in Primary Data Center Rack B4.',
        websiteUrl: 'https://www.dell.com/support',
        documentCount: 1,
        renewalCount: 1,
        lastRenewedAt: subDays(310),
        createdAt: subDays(650),
        updatedAt: subDays(40)
      },
      {
        id: `ren_${userId}_6`,
        userId,
        title: 'ISO/IEC 27001 Security Management Certification Audit',
        category: 'Certifications',
        vendor: 'BSI Group Global Assurance',
        accountNumber: 'BSI-ISMS-2024-81',
        cost: 9500,
        billingCycle: 'Annual',
        autoRenew: false,
        startDate: subDays(320),
        expiryDate: addDays(22), // Expiring soon (22 days)
        status: 'Expiring Soon',
        priority: 'High',
        reminders: [90, 60, 30, 15, 7],
        notes: 'Surveillance audit year 2 scope. All security control evidence gathered in compliance vault.',
        terms: 'Lead auditor scheduled for on-site verification in 3 weeks.',
        websiteUrl: 'https://www.bsigroup.com',
        documentCount: 3,
        renewalCount: 2,
        lastRenewedAt: subDays(320),
        createdAt: subDays(700),
        updatedAt: subDays(12)
      },
      {
        id: `ren_${userId}_7`,
        userId,
        title: 'Metropolitan Commercial Business Operating Permit',
        category: 'Permits',
        vendor: 'City Department of Commerce & Licensing',
        accountNumber: 'METRO-BUS-2024-0092',
        cost: 1250,
        billingCycle: 'Annual',
        autoRenew: false,
        startDate: subDays(360),
        expiryDate: addDays(8), // Expiring soon in 8 days!
        status: 'Expiring Soon',
        priority: 'Critical',
        reminders: [45, 30, 15, 7, 2],
        notes: 'Official municipal facility operating license for Headquarters Building.',
        terms: 'Failure to renew by deadline results in 25% statutory late penalty fee.',
        websiteUrl: 'https://citylicenses.gov/renew',
        documentCount: 1,
        renewalCount: 3,
        lastRenewedAt: subDays(360),
        createdAt: subDays(1100),
        updatedAt: subDays(15)
      },
      {
        id: `ren_${userId}_8`,
        userId,
        title: 'GitHub Enterprise Cloud & Copilot Business Plan',
        category: 'Subscriptions',
        vendor: 'GitHub, Inc. (Microsoft)',
        accountNumber: 'GH-ORG-APEXINNOV',
        cost: 5760,
        billingCycle: 'Monthly',
        autoRenew: true,
        startDate: subDays(25),
        expiryDate: addDays(5), // Monthly renewal in 5 days
        status: 'Expiring Soon',
        priority: 'Medium',
        reminders: [7, 3, 1],
        notes: 'Covers 32 active seats with Advanced Security, Secret Scanning, and Copilot code completion.',
        terms: 'Monthly auto-charge to corporate AMEX card ending in 4109.',
        websiteUrl: 'https://github.com/organizations/ApexInnovations/settings/billing',
        documentCount: 1,
        renewalCount: 11,
        lastRenewedAt: subDays(25),
        createdAt: subDays(360),
        updatedAt: subDays(20)
      }
    ];
  }

  public generateSampleHistory(userId: string, renewals: Renewal[]): RenewalHistory[] {
    const subDays = (days: number) => {
      const d = new Date();
      d.setDate(d.getDate() - days);
      return d.toISOString().split('T')[0];
    };

    return [
      {
        id: `hist_${userId}_1`,
        userId,
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
        id: `hist_${userId}_2`,
        userId,
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
        id: `hist_${userId}_3`,
        userId,
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
        id: `hist_${userId}_4`,
        userId,
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
  }

  public generateSampleDocuments(userId: string, renewals: Renewal[]): DocumentRecord[] {
    const subDays = (days: number) => {
      const d = new Date();
      d.setDate(d.getDate() - days);
      return d.toISOString().split('T')[0];
    };

    return [
      {
        id: `doc_${userId}_1`,
        userId,
        renewalId: renewals[0].id,
        renewalTitle: renewals[0].title,
        name: 'AWS_Enterprise_Support_Agreement_2025.pdf',
        fileSize: '3.4 MB',
        fileType: 'application/pdf',
        uploadDate: subDays(350),
        fileUrl: '#'
      },
      {
        id: `doc_${userId}_2`,
        userId,
        renewalId: renewals[0].id,
        renewalTitle: renewals[0].title,
        name: 'AWS_TAM_Escalation_SLA_Matrix.pdf',
        fileSize: '840 KB',
        fileType: 'application/pdf',
        uploadDate: subDays(340),
        fileUrl: '#'
      },
      {
        id: `doc_${userId}_3`,
        userId,
        renewalId: renewals[1].id,
        renewalTitle: renewals[1].title,
        name: 'Salesforce_Master_Subscription_Agreement.pdf',
        fileSize: '4.1 MB',
        fileType: 'application/pdf',
        uploadDate: subDays(335),
        fileUrl: '#'
      },
      {
        id: `doc_${userId}_4`,
        userId,
        renewalId: renewals[2].id,
        renewalTitle: renewals[2].title,
        name: 'Travelers_Commercial_General_Liability_Policy.pdf',
        fileSize: '6.2 MB',
        fileType: 'application/pdf',
        uploadDate: subDays(370),
        fileUrl: '#'
      },
      {
        id: `doc_${userId}_5`,
        userId,
        renewalId: renewals[2].id,
        renewalTitle: renewals[2].title,
        name: 'Cyber_Risk_Endorsement_Schedule.pdf',
        fileSize: '1.2 MB',
        fileType: 'application/pdf',
        uploadDate: subDays(370),
        fileUrl: '#'
      },
      {
        id: `doc_${userId}_6`,
        userId,
        renewalId: renewals[5].id,
        renewalTitle: renewals[5].title,
        name: 'ISO_27001_Certificate_of_Registration_BSI.pdf',
        fileSize: '2.1 MB',
        fileType: 'application/pdf',
        uploadDate: subDays(320),
        fileUrl: '#'
      },
      {
        id: `doc_${userId}_7`,
        userId,
        renewalId: renewals[6].id,
        renewalTitle: renewals[6].title,
        name: 'City_Commercial_Operating_Permit_2025.pdf',
        fileSize: '950 KB',
        fileType: 'application/pdf',
        uploadDate: subDays(360),
        fileUrl: '#'
      }
    ];
  }

  public generateSampleNotifications(userId: string, renewals: Renewal[]): ReminderNotification[] {
    const now = new Date();
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    return [
      {
        id: `notif_${userId}_1`,
        userId,
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
        id: `notif_${userId}_2`,
        userId,
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
        id: `notif_${userId}_3`,
        userId,
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
        id: `notif_${userId}_4`,
        userId,
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
  }

  // User Operations
  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public createUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.findUserById(id);
    if (!user) return undefined;
    Object.assign(user, updates);
    this.save();
    return user;
  }

  // Renewal Operations with strict userId isolation
  public getRenewals(userId: string): Renewal[] {
    this.refreshAllStatuses();
    return this.data.renewals.filter(r => r.userId === userId);
  }

  public getRenewalById(userId: string, id: string): Renewal | undefined {
    this.refreshAllStatuses();
    return this.data.renewals.find(r => r.id === id && r.userId === userId);
  }

  public createRenewal(userId: string, renewal: Omit<Renewal, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'renewalCount' | 'lastRenewedAt' | 'documentCount'>): Renewal {
    const id = `ren_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const status = calculateExpiryStatus(renewal.expiryDate, renewal.status);

    const newRenewal: Renewal = {
      ...renewal,
      id,
      userId,
      status,
      renewalCount: 0,
      lastRenewedAt: null,
      documentCount: 0,
      createdAt: now,
      updatedAt: now
    };

    this.data.renewals.unshift(newRenewal);
    this.save();
    return newRenewal;
  }

  public updateRenewal(userId: string, id: string, updates: Partial<Renewal>): Renewal | undefined {
    const renewal = this.getRenewalById(userId, id);
    if (!renewal) return undefined;

    if (updates.expiryDate) {
      updates.status = calculateExpiryStatus(updates.expiryDate, updates.status || renewal.status);
    }

    Object.assign(renewal, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return renewal;
  }

  public deleteRenewal(userId: string, id: string): boolean {
    const initialLen = this.data.renewals.length;
    this.data.renewals = this.data.renewals.filter(r => !(r.id === id && r.userId === userId));
    // Also remove associated history, documents, notifications
    this.data.history = this.data.history.filter(h => !(h.renewalId === id && h.userId === userId));
    this.data.documents = this.data.documents.filter(d => !(d.renewalId === id && d.userId === userId));
    this.data.notifications = this.data.notifications.filter(n => !(n.renewalId === id && n.userId === userId));
    this.save();
    return this.data.renewals.length < initialLen;
  }

  // Renewal Action: Archives current cycle into history and extends record with new dates/terms
  public processRenewalAction(userId: string, id: string, params: {
    newExpiryDate: string;
    newCost: number;
    invoiceNumber: string;
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

    this.data.history.unshift(historyEntry);

    // Update renewal record
    renewal.expiryDate = params.newExpiryDate;
    renewal.cost = params.newCost;
    renewal.status = calculateExpiryStatus(params.newExpiryDate);
    renewal.renewalCount = (renewal.renewalCount || 0) + 1;
    renewal.lastRenewedAt = new Date().toISOString();
    renewal.updatedAt = new Date().toISOString();
    if (params.notes) {
      renewal.notes = `${renewal.notes}\n[Renewed ${historyEntry.renewedDate}]: ${params.notes}`.trim();
    }

    this.save();
    return { renewal, historyEntry };
  }

  // History Operations
  public getHistory(userId: string): RenewalHistory[] {
    return this.data.history.filter(h => h.userId === userId);
  }

  // Documents Operations
  public getDocuments(userId: string): DocumentRecord[] {
    return this.data.documents.filter(d => d.userId === userId);
  }

  public addDocument(userId: string, doc: Omit<DocumentRecord, 'id' | 'userId' | 'uploadDate'>): DocumentRecord {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newDoc: DocumentRecord = {
      ...doc,
      id,
      userId,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    this.data.documents.unshift(newDoc);

    // Update document count on renewal if linked
    if (doc.renewalId) {
      const renewal = this.getRenewalById(userId, doc.renewalId);
      if (renewal) {
        renewal.documentCount = (renewal.documentCount || 0) + 1;
      }
    }

    this.save();
    return newDoc;
  }

  public deleteDocument(userId: string, id: string): boolean {
    const doc = this.data.documents.find(d => d.id === id && d.userId === userId);
    if (!doc) return false;

    if (doc.renewalId) {
      const renewal = this.getRenewalById(userId, doc.renewalId);
      if (renewal && renewal.documentCount > 0) {
        renewal.documentCount -= 1;
      }
    }

    this.data.documents = this.data.documents.filter(d => !(d.id === id && d.userId === userId));
    this.save();
    return true;
  }

  // Notifications / Reminders Operations
  public getNotifications(userId: string): ReminderNotification[] {
    return this.data.notifications.filter(n => n.userId === userId);
  }

  public markNotificationAsRead(userId: string, id: string): boolean {
    const notif = this.data.notifications.find(n => n.id === id && n.userId === userId);
    if (!notif) return false;
    notif.isRead = true;
    this.save();
    return true;
  }

  public markAllNotificationsAsRead(userId: string): void {
    this.data.notifications.forEach(n => {
      if (n.userId === userId) {
        n.isRead = true;
      }
    });
    this.save();
  }

  public recordSimulatedEmail(userId: string, id: string): ReminderNotification | undefined {
    const notif = this.data.notifications.find(n => n.id === id && n.userId === userId);
    if (!notif) return undefined;
    notif.simulatedEmailSent = true;
    notif.simulatedEmailSentAt = new Date().toISOString();
    this.save();
    return notif;
  }

  // Reset user data back to clean realistic sample set
  public resetUserWorkspace(userId: string): void {
    // Remove existing items for this user
    this.data.renewals = this.data.renewals.filter(r => r.userId !== userId);
    this.data.history = this.data.history.filter(h => h.userId !== userId);
    this.data.documents = this.data.documents.filter(d => d.userId !== userId);
    this.data.notifications = this.data.notifications.filter(n => n.userId !== userId);

    // Re-seed
    this.seedUserSampleData(userId);
  }

  // Export all user data as standalone JSON
  public exportUserData(userId: string) {
    const user = this.findUserById(userId);
    return {
      exportedAt: new Date().toISOString(),
      user: user ? {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        jobTitle: user.jobTitle,
        settings: user.settings
      } : null,
      renewals: this.getRenewals(userId),
      history: this.getHistory(userId),
      documents: this.getDocuments(userId),
      notifications: this.getNotifications(userId)
    };
  }
}

export const db = new Database();
