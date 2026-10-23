import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import recordsRouter from './routes/records.js';
import importsRouter from './routes/imports.js';
import exportsRouter from './routes/exports.js';

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/revenue_intel';

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const stateLabels = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: 'ok',
    db: stateLabels[dbState] || 'unknown',
    timestamp: new Date().toISOString()
  });
});

// ── Routes ───────────────────────────────────────────────────
app.use('/api/records', recordsRouter);
app.use('/api/import', importsRouter);
app.use('/api/exports', exportsRouter);

// ── 404 handler ──────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Error handler ─────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ── DB + Server start ─────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`✅ MongoDB connected: ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`🚀 Revenue Intel API running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('   Make sure MongoDB is running: mongod --dbpath <path>');
    process.exit(1);
  });

export default app;
