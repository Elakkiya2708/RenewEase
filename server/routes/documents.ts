import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB limit
});

// Format bytes into readable string
function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Get all documents
router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.userId!;
  const documents = db.getDocuments(userId);
  res.json({ documents });
});

// Upload document
router.post('/upload', requireAuth, upload.single('file'), (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.userId!;
  const { renewalId, customTitle } = req.body;

  let renewalTitle = 'General Workspace File';
  if (renewalId) {
    const renewal = db.getRenewalById(userId, renewalId);
    if (renewal) {
      renewalTitle = renewal.title;
    }
  }

  let docName = customTitle || 'Document.pdf';
  let sizeStr = '1.2 MB';
  let mimeType = 'application/pdf';
  let fileUrl = '#';

  if (req.file) {
    docName = req.file.originalname;
    sizeStr = formatBytes(req.file.size);
    mimeType = req.file.mimetype;
    fileUrl = `/uploads/${req.file.filename}`;
  } else if (req.body.fileName) {
    // Allows metadata simulated upload
    docName = req.body.fileName;
    sizeStr = req.body.fileSize || '1.8 MB';
    mimeType = req.body.fileType || 'application/pdf';
  }

  const created = db.addDocument(userId, {
    renewalId: renewalId || null,
    renewalTitle,
    name: docName,
    fileSize: sizeStr,
    fileType: mimeType,
    fileUrl
  });

  res.status(201).json({ message: 'Document uploaded successfully.', document: created });
});

// Delete document
router.delete('/:id', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.userId!;
  const success = db.deleteDocument(userId, req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Document not found or access denied.' });
    return;
  }
  res.json({ message: 'Document removed successfully.' });
});

export default router;
