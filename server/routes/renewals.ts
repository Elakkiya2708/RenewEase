import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get all renewals for the authenticated user with optional filtering
router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.userId!;
  let renewals = db.getRenewals(userId);

  const { search, category, status, priority, sortBy, sortOrder } = req.query as {
    search?: string;
    category?: string;
    status?: string;
    priority?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };

  // Search filter
  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    renewals = renewals.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.vendor.toLowerCase().includes(q) ||
      r.accountNumber.toLowerCase().includes(q) ||
      r.notes.toLowerCase().includes(q)
    );
  }

  // Category filter
  if (category && category !== 'All') {
    renewals = renewals.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }

  // Status filter
  if (status && status !== 'All') {
    renewals = renewals.filter(r => r.status.toLowerCase() === status.toLowerCase());
  }

  // Priority filter
  if (priority && priority !== 'All') {
    renewals = renewals.filter(r => r.priority.toLowerCase() === priority.toLowerCase());
  }

  // Sorting
  renewals.sort((a, b) => {
    let fieldA: any = a.expiryDate;
    let fieldB: any = b.expiryDate;

    if (sortBy === 'cost') {
      fieldA = a.cost;
      fieldB = b.cost;
    } else if (sortBy === 'title') {
      fieldA = a.title.toLowerCase();
      fieldB = b.title.toLowerCase();
    } else if (sortBy === 'priority') {
      const priorityOrder: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      fieldA = priorityOrder[a.priority] || 0;
      fieldB = priorityOrder[b.priority] || 0;
    } else if (sortBy === 'createdAt') {
      fieldA = a.createdAt;
      fieldB = b.createdAt;
    }

    if (fieldA < fieldB) return sortOrder === 'desc' ? 1 : -1;
    if (fieldA > fieldB) return sortOrder === 'desc' ? -1 : 1;
    return 0;
  });

  res.json({ renewals, count: renewals.length });
});

// Get single renewal by ID
router.get('/:id', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.userId!;
  const renewal = db.getRenewalById(userId, req.params.id);
  if (!renewal) {
    res.status(404).json({ error: 'Renewal record not found or access denied.' });
    return;
  }
  res.json({ renewal });
});

// Create new renewal
router.post('/', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.userId!;
  const {
    title,
    category,
    vendor,
    accountNumber,
    cost,
    billingCycle,
    autoRenew,
    startDate,
    expiryDate,
    priority,
    reminders,
    notes,
    terms,
    websiteUrl
  } = req.body;

  if (!title || !category || !vendor || !expiryDate) {
    res.status(400).json({ error: 'Title, category, vendor, and expiry date are required.' });
    return;
  }

  const created = db.createRenewal(userId, {
    title: title.trim(),
    category,
    vendor: vendor.trim(),
    accountNumber: accountNumber ? accountNumber.trim() : 'N/A',
    cost: Number(cost) || 0,
    billingCycle: billingCycle || 'Annual',
    autoRenew: Boolean(autoRenew),
    startDate: startDate || new Date().toISOString().split('T')[0],
    expiryDate,
    status: 'Active',
    priority: priority || 'Medium',
    reminders: Array.isArray(reminders) && reminders.length > 0 ? reminders : [30, 15, 7],
    notes: notes ? notes.trim() : '',
    terms: terms ? terms.trim() : '',
    websiteUrl: websiteUrl ? websiteUrl.trim() : ''
  });

  res.status(201).json({ message: 'Renewal created successfully.', renewal: created });
});

// Update renewal
router.put('/:id', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.userId!;
  const updated = db.updateRenewal(userId, req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Renewal record not found or access denied.' });
    return;
  }
  res.json({ message: 'Renewal updated successfully.', renewal: updated });
});

// Delete renewal
router.delete('/:id', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.userId!;
  const success = db.deleteRenewal(userId, req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Renewal record not found or access denied.' });
    return;
  }
  res.json({ message: 'Renewal record deleted successfully.' });
});

// Action: Renew Record
router.post('/:id/renew', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.userId!;
  const { newExpiryDate, newCost, invoiceNumber, renewalTerms, notes } = req.body;

  if (!newExpiryDate) {
    res.status(400).json({ error: 'New expiry date is required to process renewal.' });
    return;
  }

  const result = db.processRenewalAction(userId, req.params.id, {
    newExpiryDate,
    newCost: Number(newCost) || 0,
    invoiceNumber: invoiceNumber ? invoiceNumber.trim() : '',
    renewalTerms,
    notes
  });

  if (!result) {
    res.status(404).json({ error: 'Renewal record not found or access denied.' });
    return;
  }

  res.json({
    message: 'Renewal executed successfully. Prior cycle has been preserved in history.',
    renewal: result.renewal,
    historyEntry: result.historyEntry
  });
});

export default router;
