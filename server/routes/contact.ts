import { Router, Request, Response } from 'express';
import { db } from '../db';

const router = Router();

// POST /api/contact - Submit a public inquiry
router.post('/', (req: Request, res: Response): void => {
  const { name, email, subject, message } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({ error: 'Please provide a valid name (at least 2 characters).' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    res.status(400).json({ error: 'Please provide a valid email address.' });
    return;
  }

  if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
    res.status(400).json({ error: 'Please enter a descriptive subject (at least 3 characters).' });
    return;
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    res.status(400).json({ error: 'Message must be at least 10 characters long.' });
    return;
  }

  try {
    const contactRecord = db.createContactMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim()
    });

    console.log(`📬 [Contact Received] Message #${contactRecord.id} from ${contactRecord.name} <${contactRecord.email}>`);

    res.status(201).json({
      success: true,
      messageId: contactRecord.id,
      message: 'Thank you for contacting RenewEase! Your inquiry has been securely logged and our administrative team will respond to your email within 24 hours.',
      inquiry: {
        id: contactRecord.id,
        name: contactRecord.name,
        email: contactRecord.email,
        subject: contactRecord.subject,
        createdAt: contactRecord.createdAt
      }
    });
  } catch (error: any) {
    console.error('Error recording contact inquiry:', error);
    res.status(500).json({ error: 'Failed to process contact inquiry. Please try again later.' });
  }
});

// GET /api/contact - List public inquiries (for administrative testing/verification)
router.get('/', (_req: Request, res: Response): void => {
  const messages = db.getContactMessages();
  res.json({
    total: messages.length,
    messages
  });
});

export default router;
