import express from 'express';
import multer from 'multer';
import { processBatch } from '../services/importService.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/import/batch — import a batch JSON (body or file upload)
router.post('/batch', upload.single('file'), async (req, res) => {
  try {
    let batch;

    if (req.file) {
      // File upload
      try {
        batch = JSON.parse(req.file.buffer.toString('utf8'));
      } catch {
        return res.status(400).json({ error: 'Invalid JSON in uploaded file' });
      }
    } else if (req.body && req.body.batch) {
      batch = typeof req.body.batch === 'string' ? JSON.parse(req.body.batch) : req.body.batch;
    } else if (req.body && req.body.batch_id) {
      batch = req.body;
    } else {
      return res.status(400).json({ error: 'Provide batch JSON in body or as file upload' });
    }

    const result = await processBatch(batch);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/import/log — get import history (stored in DB via a separate collection)
router.get('/log', async (req, res) => {
  try {
    const { ImportLog } = await import('../models/ImportLog.js');
    const logs = await ImportLog.find().sort({ createdAt: -1 }).limit(50).lean();
    res.json(logs);
  } catch {
    res.json([]); // ImportLog model optional
  }
});

export default router;
