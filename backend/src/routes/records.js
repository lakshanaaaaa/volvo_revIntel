import express from 'express';
import ConversationRecord from '../models/ConversationRecord.js';
import { ALL_ROUTES } from '../data/preAnalysis.js';

const router = express.Router();

// GET /api/records — fetch all records with optional filters
router.get('/', async (req, res) => {
  try {
    const { source_type, route, person, search, tab } = req.query;
    let query = {};

    if (source_type && source_type !== 'all') {
      query.source_type = source_type;
    }
    if (route && route !== 'all') {
      query.routes = route;
    }
    if (person && person !== 'all') {
      // Match on rep_name (calls) or organizer_email (meetings)
      query.$or = [
        { 'payload.rep_name': person },
        { 'payload.organizer_email': person }
      ];
    }

    let records = await ConversationRecord.find(query).sort({ record_ref: 1 }).lean();

    // Tab filter (needs-review, analysable, background)
    if (tab === 'needs-review') {
      records = records.filter(r => r.routes.includes('Needs Review'));
    } else if (tab === 'analysable') {
      records = records.filter(r => {
        if (r.source_type === 'call') return Boolean(r.payload?.transcript);
        return Boolean(r.transcript_payload?.turns?.length > 0);
      });
    } else if (tab === 'background') {
      records = records.filter(r => {
        if (r.source_type === 'call') return !r.payload?.transcript;
        return !r.transcript_payload?.turns?.length;
      });
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      records = records.filter(r =>
        r.record_ref?.toLowerCase().includes(q) ||
        r.payload?.rep_name?.toLowerCase().includes(q) ||
        r.payload?.title?.toLowerCase().includes(q) ||
        r.analysis?.company?.toLowerCase().includes(q) ||
        r.routes?.some(rt => rt.toLowerCase().includes(q))
      );
    }

    res.json({ records, total: records.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/records/stats — dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const all = await ConversationRecord.find().lean();
    const calls = all.filter(r => r.source_type === 'call');
    const meetings = all.filter(r => r.source_type === 'meeting');

    const withTranscript = all.filter(r => {
      if (r.source_type === 'call') return Boolean(r.payload?.transcript);
      return Boolean(r.transcript_payload?.turns?.length > 0);
    });
    const callsWithTranscript = calls.filter(r => Boolean(r.payload?.transcript));
    const meetingsWithTranscript = meetings.filter(r => Boolean(r.transcript_payload?.turns?.length > 0));

    const connected = calls.filter(r => r.payload?.is_connected === true);
    const callsWithConnStatus = calls.filter(r => r.payload?.is_connected !== null && r.payload?.is_connected !== undefined);

    const manualOverrides = all.filter(r => r.manual_override);
    const needsReview = all.filter(r => r.routes?.includes('Needs Review'));

    // Outcome distribution
    const outcomeCounts = {};
    calls.forEach(c => {
      const out = c.payload?.observed_outcome || 'unknown';
      outcomeCounts[out] = (outcomeCounts[out] || 0) + 1;
    });

    // Route distribution
    const routeCounts = {};
    all.forEach(r => {
      (r.routes || []).forEach(rt => {
        routeCounts[rt] = (routeCounts[rt] || 0) + 1;
      });
    });

    // Person activity
    const personCounts = {};
    all.forEach(r => {
      const person = r.source_type === 'call'
        ? (r.payload?.rep_name || r.payload?.rep_email || 'Unknown')
        : (r.payload?.organizer_email || 'Unknown Org');
      const label = `${person} (${r.source_type === 'call' ? 'Rep' : 'Org'})`;
      personCounts[label] = (personCounts[label] || 0) + 1;
    });

    // Unique persons for filter
    const persons = [...new Set([
      ...calls.map(r => r.payload?.rep_name).filter(Boolean),
      ...calls.map(r => r.payload?.rep_email).filter(Boolean),
      ...meetings.map(r => r.payload?.organizer_email).filter(Boolean)
    ])].sort();

    res.json({
      total: all.length,
      calls: calls.length,
      meetings: meetings.length,
      withTranscript: withTranscript.length,
      callsWithTranscript: callsWithTranscript.length,
      meetingsWithTranscript: meetingsWithTranscript.length,
      connected: connected.length,
      callsWithConnStatus: callsWithConnStatus.length,
      manualOverrides: manualOverrides.length,
      needsReview: needsReview.length,
      outcomeCounts,
      routeCounts,
      personCounts,
      persons
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/records/:id — single record detail
router.get('/:id', async (req, res) => {
  try {
    const record = await ConversationRecord.findById(req.params.id).lean();
    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/records/:id/route — update routing (manual override)
router.patch('/:id/route', async (req, res) => {
  try {
    const { routes } = req.body;
    if (!Array.isArray(routes) || routes.length === 0) {
      return res.status(400).json({ error: 'routes must be a non-empty array' });
    }
    // Validate each route
    const invalid = routes.filter(r => !ALL_ROUTES.includes(r));
    if (invalid.length > 0) {
      return res.status(400).json({ error: `Invalid routes: ${invalid.join(', ')}` });
    }

    const record = await ConversationRecord.findByIdAndUpdate(
      req.params.id,
      { routes, manual_override: true },
      { new: true }
    ).lean();

    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/records/:id/route/clear — clear manual override (revert to auto)
router.patch('/:id/route/clear', async (req, res) => {
  try {
    const record = await ConversationRecord.findById(req.params.id).lean();
    if (!record) return res.status(404).json({ error: 'Record not found' });

    // Recompute default routes
    const { getDefaultRoutes } = await import('../data/preAnalysis.js');
    const defaultRoutes = getDefaultRoutes(record);

    const updated = await ConversationRecord.findByIdAndUpdate(
      req.params.id,
      { routes: defaultRoutes, manual_override: false },
      { new: true }
    ).lean();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
