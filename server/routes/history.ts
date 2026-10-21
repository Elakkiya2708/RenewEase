import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get history records for the current user
router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.userId!;
  const history = db.getHistory(userId);
  res.json({ history });
});

export default router;
