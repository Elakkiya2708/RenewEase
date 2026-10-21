import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get notifications/reminders for user
router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.userId!;
  const notifications = db.getNotifications(userId);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  res.json({ notifications, unreadCount });
});

// Mark single notification as read
router.patch('/:id/read', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.userId!;
  const success = db.markNotificationAsRead(userId, req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Notification not found.' });
    return;
  }
  res.json({ message: 'Notification marked as read.' });
});

// Mark all notifications as read
router.post('/read-all', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.userId!;
  db.markAllNotificationsAsRead(userId);
  res.json({ message: 'All notifications marked as read.' });
});

// Simulate Email Dispatch for a reminder
router.post('/:id/simulate-email', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.userId!;
  const notif = db.recordSimulatedEmail(userId, req.params.id);
  if (!notif) {
    res.status(404).json({ error: 'Reminder notification not found.' });
    return;
  }

  const user = db.findUserById(userId);
  const recipient = user ? `${user.name} <${user.email}>` : 'Workspace Owner';

  // Construct realistic enterprise email preview payload
  const emailPayload = {
    transport: 'Simulated Enterprise SMTP Gateway (Ready for AWS SES / SendGrid)',
    status: 'Dispatched (Simulated)',
    recipient,
    subject: `[RenewEase Alert] Action Required: ${notif.renewalTitle} (${notif.daysRemaining > 0 ? `${notif.daysRemaining} days left` : 'OVERDUE'})`,
    sentAt: notif.simulatedEmailSentAt,
    htmlPreview: `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">
        <div style="background-color: #0a192f; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: normal; letter-spacing: 0.5px;">RenewEase</h1>
          <p style="color: #94a3b8; margin: 4px 0 0; font-size: 13px;">Smart Renewal Management System</p>
        </div>
        <div style="padding: 28px 24px; color: #0f172a; line-height: 1.6;">
          <h2 style="font-size: 20px; color: ${notif.daysRemaining <= 0 ? '#b91c1c' : '#c2410c'}; margin-top: 0;">
            ${notif.daysRemaining <= 0 ? 'URGENT: Renewal Overdue' : 'Upcoming Expiry Notice'}
          </h2>
          <p>Dear ${user?.name || 'Valued User'},</p>
          <p>This is an automated alert regarding your registered renewal record:</p>
          <div style="background: #f8fafc; border-left: 4px solid #1e3a8a; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px;"><strong>Record:</strong> ${notif.renewalTitle}</p>
            <p style="margin: 0 0 8px;"><strong>Category:</strong> ${notif.category}</p>
            <p style="margin: 0 0 8px;"><strong>Due Date:</strong> ${notif.dueDate}</p>
            <p style="margin: 0;"><strong>Status:</strong> ${notif.daysRemaining > 0 ? `Expires in ${notif.daysRemaining} day(s)` : `Overdue by ${Math.abs(notif.daysRemaining)} day(s)`}</p>
          </div>
          <p>Please review and initiate necessary vendor negotiations or payment approval to ensure continuous service compliance.</p>
          <div style="margin: 28px 0; text-align: center;">
            <span style="background-color: #1e3a8a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-size: 15px;">
              Open in RenewEase Workspace
            </span>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #64748b; margin: 0; text-align: center;">
            RenewEase Enterprise Notification Engine • Note: In production mode, this connects to an authenticated SMTP or SendGrid/SES service.
          </p>
        </div>
      </div>
    `
  };

  res.json({
    message: 'Test email reminder simulation successfully sent!',
    notification: notif,
    emailPayload
  });
});

export default router;
