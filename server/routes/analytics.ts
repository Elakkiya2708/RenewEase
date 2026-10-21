import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.userId!;
  const renewals = db.getRenewals(userId);

  let totalAnnualSpend = 0;
  let activeCount = 0;
  let expiringSoonCount = 0;
  let overdueCount = 0;
  let cancelledCount = 0;

  const categoryMap: Record<string, { spend: number; count: number }> = {};
  const priorityMap: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  const monthlySpend: Record<string, number> = {
    Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
    Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  renewals.forEach(r => {
    // Exclude cancelled from spend metrics
    if (r.status !== 'Cancelled') {
      let annualCost = r.cost;
      if (r.billingCycle === 'Monthly') annualCost = r.cost * 12;
      else if (r.billingCycle === 'Quarterly') annualCost = r.cost * 4;
      else if (r.billingCycle === 'Bi-Annual') annualCost = r.cost * 2;

      totalAnnualSpend += annualCost;

      // Category breakdown
      if (!categoryMap[r.category]) {
        categoryMap[r.category] = { spend: 0, count: 0 };
      }
      categoryMap[r.category].spend += annualCost;
      categoryMap[r.category].count += 1;

      // Monthly distribution based on expiry month
      try {
        const d = new Date(r.expiryDate);
        const m = monthNames[d.getMonth()];
        if (m) {
          monthlySpend[m] = (monthlySpend[m] || 0) + r.cost;
        }
      } catch (e) {
        // ignore parse error
      }
    }

    // Status counts
    if (r.status === 'Active') activeCount++;
    else if (r.status === 'Expiring Soon') expiringSoonCount++;
    else if (r.status === 'Overdue') overdueCount++;
    else if (r.status === 'Cancelled') cancelledCount++;

    // Priority counts
    if (priorityMap[r.priority] !== undefined) {
      priorityMap[r.priority]++;
    }
  });

  const categoryBreakdown = Object.entries(categoryMap).map(([category, val]) => ({
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

  const topVendors = renewals
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

  res.json({
    metrics: {
      totalRenewals: renewals.length,
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
  });
});

export default router;
