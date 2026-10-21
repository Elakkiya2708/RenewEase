import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth';
import renewalsRoutes from './routes/renewals';
import documentsRoutes from './routes/documents';
import historyRoutes from './routes/history';
import remindersRoutes from './routes/reminders';
import analyticsRoutes from './routes/analytics';
import settingsRoutes from './routes/settings';
import contactRoutes from './routes/contact';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads directory
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'RenewEase Smart Renewal Management System API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/renewals', renewalsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contact', contactRoutes);

app.listen(PORT, () => {
  console.log(`✅ RenewEase Backend Server running on http://localhost:${PORT}`);
});
