import express from 'express';
import { buildManifest, manifestToCsv, buildExportZip } from '../services/exportService.js';

const router = express.Router();

// GET /api/exports/manifest — full manifest JSON
router.get('/manifest', async (req, res) => {
  try {
    const manifest = await buildManifest();
    res.json(manifest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/exports/manifest.csv — manifest as CSV download
router.get('/manifest.csv', async (req, res) => {
  try {
    const manifest = await buildManifest();
    const csv = manifestToCsv(manifest);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="manifest.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/exports/manifest.json — manifest as JSON download
router.get('/manifest.json', async (req, res) => {
  try {
    const manifest = await buildManifest();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="manifest.json"');
    res.send(JSON.stringify(manifest, null, 2));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/exports/zip — full ZIP archive download
router.get('/zip', async (req, res) => {
  try {
    const zipBuffer = await buildExportZip();
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="revenue_intel_exports.zip"');
    res.send(zipBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
