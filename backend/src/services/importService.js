import ConversationRecord from '../models/ConversationRecord.js';
import { PRE_ANALYSIS, getDefaultRoutes, hasUsableTranscript } from '../data/preAnalysis.js';

/**
 * Process a batch import according to the data contract:
 *  - Identity key: (source_type, source_id)
 *  - Same or older revisions → ignored (idempotent)
 *  - Newer revision → update payload + transcript only; preserve manual_override + routes if manual
 *  - New record → insert with pre-analysis routes + analysis
 */
export async function processBatch(batch) {
  if (!batch || !Array.isArray(batch.records)) {
    throw new Error('Invalid batch format: missing records array');
  }

  const batchId = batch.batch_id || 'unknown';
  const batchRevision = parseInt(batch.revision, 10) || 1;

  let added = 0;
  let updated = 0;
  let ignored = 0;
  const details = [];

  for (const rec of batch.records) {
    const sourceType = rec.source_type;
    const sourceId = rec.source_id || rec.payload?.id;

    if (!sourceType || !sourceId) {
      details.push({ record_ref: rec.record_ref, action: 'skipped', reason: 'missing source_type or source_id' });
      continue;
    }

    const existing = await ConversationRecord.findOne({ source_type: sourceType, source_id: sourceId });

    if (existing) {
      if (batchRevision <= existing.applied_revision) {
        // Data contract rule: same or older revision → ignore
        ignored++;
        details.push({ record_ref: rec.record_ref, action: 'ignored', reason: `existing rev ${existing.applied_revision} >= batch rev ${batchRevision}` });
        continue;
      }

      // Newer revision → update source data only
      // CRITICAL: preserve manual_override and routes if manual
      const updateData = {
        batch_id: batchId,
        applied_revision: batchRevision,
        payload: rec.payload || {},
        transcript_payload: rec.transcript_payload || null
      };

      // If NOT manually overridden, refresh routes from new analysis/heuristic
      if (!existing.manual_override) {
        const tempRecord = { ...rec, record_ref: rec.record_ref };
        updateData.routes = getDefaultRoutes(tempRecord);
      }

      // If pre-analysis exists for this ref, update analysis fields too (non-destructive)
      const preAnalysis = PRE_ANALYSIS[rec.record_ref];
      if (preAnalysis) {
        updateData.analysis = {
          summary: preAnalysis.summary,
          evidence: preAnalysis.evidence,
          evidence_ref: preAnalysis.evidence_ref,
          coaching: preAnalysis.coaching,
          next_steps: preAnalysis.next_steps,
          limitations: preAnalysis.limitations,
          company: preAnalysis.company,
          title: preAnalysis.title,
          is_late_update: preAnalysis.is_late_update || false
        };
      }

      await ConversationRecord.updateOne(
        { source_type: sourceType, source_id: sourceId },
        { $set: updateData }
      );

      updated++;
      details.push({ record_ref: rec.record_ref, action: 'updated', old_revision: existing.applied_revision, new_revision: batchRevision });

    } else {
      // New record — insert with analysis
      const preAnalysis = PRE_ANALYSIS[rec.record_ref] || null;
      const routes = getDefaultRoutes(rec);

      const newRecord = new ConversationRecord({
        record_ref:         rec.record_ref,
        source_type:        sourceType,
        source_id:          sourceId,
        batch_id:           batchId,
        applied_revision:   batchRevision,
        payload:            rec.payload || {},
        transcript_payload: rec.transcript_payload || null,
        routes,
        manual_override:    false,
        analysis: preAnalysis ? {
          summary:      preAnalysis.summary,
          evidence:     preAnalysis.evidence,
          evidence_ref: preAnalysis.evidence_ref,
          coaching:     preAnalysis.coaching,
          next_steps:   preAnalysis.next_steps,
          limitations:  preAnalysis.limitations,
          company:      preAnalysis.company,
          title:        preAnalysis.title,
          is_late_update: preAnalysis.is_late_update || false
        } : {}
      });

      await newRecord.save();
      added++;
      details.push({ record_ref: rec.record_ref, action: 'added' });
    }
  }

  const totalNow = await ConversationRecord.countDocuments();

  return {
    batch_id: batchId,
    revision: batchRevision,
    added,
    updated,
    ignored,
    total_records: totalNow,
    details
  };
}
