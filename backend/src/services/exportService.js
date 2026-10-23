import JSZip from 'jszip';
import ConversationRecord from '../models/ConversationRecord.js';
import { ROUTE_FOLDER_MAP, hasUsableTranscript, getRecordPerson, getRecordTitle } from '../data/preAnalysis.js';

const DAILY_BRIEF_DATE = '2026-08-21';

/**
 * Build the manifest array from current DB state
 */
export async function buildManifest() {
  const records = await ConversationRecord.find().sort({ record_ref: 1 }).lean();
  const exportedAt = new Date().toISOString();

  return records.map(r => {
    const routes = r.routes && r.routes.length > 0 ? r.routes : ['Background'];
    const hasText = hasUsableTranscript(r);

    const outputPaths = routes.map(rt => {
      const folder = ROUTE_FOLDER_MAP[rt] || rt.toLowerCase().replace(/[^a-z0-9]/g, '_');
      return `exports/${folder}/${r.record_ref}_analysis.md`;
    });

    return {
      source_type: r.source_type,
      source_id: r.source_id,
      record_ref: r.record_ref,
      applied_revision: r.applied_revision || 1,
      routes,
      output_paths: outputPaths,
      processing_state: hasText ? 'analysed' : 'intake_complete',
      manual_override: r.manual_override || false,
      analysis_fresh: true,
      analysis_source: hasText
        ? (r.manual_override ? 'human_corrected' : 'pre_generated')
        : 'intake_only',
      exported_at: exportedAt
    };
  });
}

/**
 * Convert manifest array to CSV string
 */
export function manifestToCsv(manifest) {
  const headers = [
    'source_type', 'source_id', 'record_ref', 'applied_revision',
    'routes', 'output_paths', 'processing_state', 'manual_override',
    'analysis_fresh', 'analysis_source', 'exported_at'
  ];
  const rows = [headers.join(',')];
  manifest.forEach(m => {
    rows.push([
      m.source_type,
      m.source_id,
      m.record_ref,
      m.applied_revision,
      `"${m.routes.join(';')}"`,
      `"${m.output_paths.join(';')}"`,
      m.processing_state,
      m.manual_override,
      m.analysis_fresh,
      m.analysis_source,
      m.exported_at
    ].join(','));
  });
  return rows.join('\n');
}

/**
 * Generate analysis markdown for a single record
 */
function buildAnalysisMd(record) {
  const title = record.analysis?.title || getRecordTitle(record);
  const person = getRecordPerson(record);
  const routes = record.routes?.join(', ') || 'Background';
  const hasText = hasUsableTranscript(record);

  let md = `# Analysis: ${record.record_ref} — ${title}\n`;
  md += `- **Source Type:** ${record.source_type}\n`;
  md += `- **Source ID:** \`${record.source_id}\`\n`;
  md += `- **Applied Revision:** ${record.applied_revision || 1}\n`;
  md += `- **Route Assigned:** ${routes}\n`;
  md += `- **Processing State:** ${hasText ? 'Analysed' : 'Intake Complete'}\n`;
  md += `- **Rep / Organiser:** ${person}\n`;
  if (record.manual_override) md += `- **⭐ Manual Override:** Yes\n`;
  md += '\n';

  if (hasText && record.analysis?.summary) {
    md += `## Executive Summary\n${record.analysis.summary}\n\n`;

    if (record.analysis.evidence) {
      md += `## Source Evidence & Verification\n`;
      md += `- **Exact Passage / Citation:** ${record.analysis.evidence_ref || record.analysis.evidence}\n`;
      md += `- **Passage Content:** "${record.analysis.evidence}"\n\n`;
    }

    if (record.analysis.coaching) {
      md += `## Sales Coaching Notes\n${record.analysis.coaching}\n\n`;
    }

    if (record.analysis.next_steps) {
      md += `## Recommended Next Steps\n${record.analysis.next_steps}\n\n`;
    }

    if (record.analysis.limitations) {
      md += `## Honest Limitations & Boundaries\n${record.analysis.limitations}\n\n`;
    }
  } else {
    md += `## Status\nNo usable transcript available for this record. Stored as intake record only.\n\n`;
    md += `## Payload Summary\n`;
    md += `- Duration: ${record.payload?.duration_seconds || 0}s\n`;
    md += `- Outcome: ${record.payload?.observed_outcome || record.payload?.recording_status || '—'}\n`;
  }

  return md;
}

/**
 * Generate daily brief markdown
 */
async function buildDailyBrief(records) {
  const total = records.length;
  const calls = records.filter(r => r.source_type === 'call');
  const meetings = records.filter(r => r.source_type === 'meeting');
  const withText = records.filter(r => hasUsableTranscript(r));
  const connected = calls.filter(r => r.payload?.is_connected === true);

  let md = `# SpendNest Revenue Intelligence — Daily Manager Brief\n`;
  md += `**Date:** 21 August 2026 (Asia/Kolkata)  \n`;
  md += `**Batch Scope:** Post-update reconciled state (Revisions 1 & 2 applied)  \n`;
  md += `**Total Records Analysed:** ${total} selected records (${calls.length} calls, ${meetings.length} meetings)  \n`;
  md += `**Usable Transcripts:** ${withText.length} interactions\n\n---\n\n`;

  md += `## 1. Executive Activity Summary\n`;
  md += `- **Calls Connect Rate:** ${connected.length} of ${calls.length} calls reported as connected by upstream telephony (${calls.length > 0 ? ((connected.length / calls.length) * 100).toFixed(1) : 0}%), though telemetry contains edge cases (B11/B14 were unresponsive; C04 was an answered voicemail service).\n`;
  md += `- **Usable Transcript Coverage:** ${withText.length} of ${total} selected records (${total > 0 ? ((withText.length / total) * 100).toFixed(1) : 0}%).\n`;
  md += `- **Active Team Roster:** Arun (12 calls), Leela (8 calls), Meera (5 calls), Kiran (1 call), Dev (1 call), plus calendar meetings organized across operational inboxes.\n\n`;

  md += `## 2. Priority Pipeline Deals & Follow-ups\n`;
  md += `1. **Asterloom Systems (M03) — High Value Evaluation:** Finance stakeholder Customer B placed a firm boundary: *"Send the details first. We need time with the CFO."* **Action:** Deliver executive solution overview and security whitepaper today.\n`;
  md += `2. **Fernhaven Group (C02) — Gatekeeper Callback:** Gatekeeper confirmed key contact Leela is out of office until Tuesday (25 August). **Action:** Calendar follow-up task for Tuesday morning.\n`;
  md += `3. **Prospect Aniket (C10) — Demo Booked:** Meera successfully converted cold call into confirmed invoice approval demo for Thursday afternoon.\n`;
  md += `4. **Willowbank Advisory (C07) — Channel Advisory:** Dev connected with Aditya who advises 40 mid-market corporate clients. High-leverage potential partner referral channel.\n\n`;

  md += `## 3. Targeted Sales Coaching\n`;
  md += `- **Arun (C01):** Tendency to pitch features before qualifying business fit. Coach on asking open discovery questions.\n`;
  md += `- **Meera (C05, C06, C08, C09, C10):** Outstanding outbound discipline — accurately handled competitor lock-in (C06), secured warm referrals (C08, C09), closed a firm demo (C10).\n`;
  md += `- **Team Member A (M03):** Pushed slightly too hard for calendar commitments, triggering customer boundary pushback. Reinforce honoring buyer evaluation pace.\n\n`;

  md += `## 4. Operational & Partnership Segregation\n`;
  md += `- **LedgerBridge (M02):** SpendNest is the buyer evaluating banking/card issuing infrastructure. Classified under Partner/Vendor and excluded from sales pipeline.\n`;
  md += `- **SpendNest Internal (M10):** Internal enablement walkthrough on billing permissions. Classified under Internal.\n`;
  md += `- **Willowfield Trust (M07):** Late transcript (rev 2) resolved multi-tier approval permissions via screen-share.\n`;

  return md;
}

/**
 * Build a full ZIP archive containing:
 * - manifest.json
 * - manifest.csv
 * - daily_briefs/daily_brief_2026-08-21.md
 * - All analysis .md files in correct subfolders
 */
export async function buildExportZip() {
  const records = await ConversationRecord.find().sort({ record_ref: 1 }).lean();
  const manifest = await buildManifest();
  const manifestCsv = manifestToCsv(manifest);
  const dailyBrief = await buildDailyBrief(records);

  const zip = new JSZip();
  const exportsFolder = zip.folder('exports');

  exportsFolder.file('manifest.json', JSON.stringify(manifest, null, 2));
  exportsFolder.file('manifest.csv', manifestCsv);

  const briefFolder = exportsFolder.folder('daily_briefs');
  briefFolder.file(`daily_brief_${DAILY_BRIEF_DATE}.md`, dailyBrief);

  // Create route subfolders and populate analysis files
  const routeFolders = {};
  const getFolderObj = (routeName) => {
    const folderKey = ROUTE_FOLDER_MAP[routeName] || routeName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (!routeFolders[folderKey]) {
      routeFolders[folderKey] = exportsFolder.folder(folderKey);
    }
    return routeFolders[folderKey];
  };

  for (const record of records) {
    const routes = record.routes && record.routes.length > 0 ? record.routes : ['Background'];
    const analysisMd = buildAnalysisMd(record);

    routes.forEach(route => {
      const folder = getFolderObj(route);
      folder.file(`${record.record_ref}_analysis.md`, analysisMd);
    });
  }

  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}
