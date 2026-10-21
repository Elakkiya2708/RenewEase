import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get settings
router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.userId!;
  const user = db.findUserById(userId);
  if (!user) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }
  res.json({ settings: user.settings });
});

// Update settings
router.put('/', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.userId!;
  const user = db.findUserById(userId);
  if (!user) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }

  const updatedSettings = {
    ...user.settings,
    ...req.body
  };

  db.updateUser(userId, { settings: updatedSettings });
  res.json({ message: 'Settings saved successfully.', settings: updatedSettings });
});

// Export private workspace JSON data
router.get('/export', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.userId!;
  const exportData = db.exportUserData(userId);
  res.setHeader('Content-Disposition', `attachment; filename="renewease_backup_${new Date().toISOString().split('T')[0]}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(exportData, null, 2));
});

// Reset workspace with clean sample data
router.post('/reset-sample', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.userId!;
  db.resetUserWorkspace(userId);
  res.json({ message: 'Workspace successfully restored with fresh realistic sample records.' });
});

export default router;
