import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, User } from '../db';
import { requireAuth, AuthenticatedRequest, JWT_SECRET } from '../middleware/auth';

const router = Router();

// Register new user
router.post('/register', async (req, res: Response): Promise<void> => {
  try {
    const { name, email, password, company, jobTitle, phone } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.' });
      return;
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      res.status(409).json({ error: 'An account with this email address already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newUser: User = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      company: company ? company.trim() : 'Private Workspace',
      jobTitle: jobTitle ? jobTitle.trim() : 'Renewal Manager',
      phone: phone ? phone.trim() : '',
      bio: 'Managing contracts, warranties, licenses, and subscriptions with RenewEase.',
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

    db.createUser(newUser);
    // Seed new user with realistic sample data for instant exploration
    db.seedUserSampleData(userId);

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = newUser;
    res.status(201).json({
      message: 'Account created successfully with private workspace.',
      token,
      user: safeUser
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// Login
router.post('/login', async (req, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = user;
    res.json({
      message: 'Logged in successfully.',
      token,
      user: safeUser
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// Current user profile
router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const user = db.findUserById(req.userId!);
  if (!user) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }
  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

// Update profile details
router.put('/profile', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const { name, company, jobTitle, phone, bio } = req.body;
  const user = db.updateUser(req.userId!, {
    ...(name && { name: name.trim() }),
    ...(company !== undefined && { company: company.trim() }),
    ...(jobTitle !== undefined && { jobTitle: jobTitle.trim() }),
    ...(phone !== undefined && { phone: phone.trim() }),
    ...(bio !== undefined && { bio: bio.trim() })
  });

  if (!user) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }
  const { passwordHash: _, ...safeUser } = user;
  res.json({ message: 'Profile updated successfully.', user: safeUser });
});

// Change password
router.put('/password', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current password and new password are required.' });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters long.' });
      return;
    }

    const user = db.findUserById(req.userId!);
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ error: 'Current password does not match.' });
      return;
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    db.updateUser(req.userId!, { passwordHash: newHash });
    res.json({ message: 'Password changed successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update password.' });
  }
});

export default router;
