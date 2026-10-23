// ── Record helpers ─────────────────────────────────────────────

export function getRecordPerson(rec) {
  if (!rec) return '—';
  if (rec.source_type === 'call') {
    return rec.payload?.rep_name || rec.payload?.rep_email || 'Unknown Rep';
  }
  return rec.payload?.organizer_email || 'Unknown Organiser';
}

export function getRecordTitle(rec) {
  if (!rec) return '—';
  if (rec.source_type === 'call') {
    const rep = rec.payload?.rep_name || 'Rep';
    const out = rec.payload?.observed_outcome || 'call';
    const dur = rec.payload?.duration_seconds ? `${rec.payload.duration_seconds}s` : '';
    return `${rep} · Call (${out}${dur ? ', ' + dur : ''})`;
  }
  return rec.payload?.title || 'Untitled Meeting';
}

export function getDisplayTitle(rec) {
  if (!rec) return '—';
  if (rec.analysis?.title) return rec.analysis.title;
  return getRecordTitle(rec);
}

export function hasUsableTranscript(rec) {
  if (!rec) return false;
  if (rec.source_type === 'call') {
    return Boolean(rec.payload?.transcript?.trim());
  }
  return Boolean(rec.transcript_payload?.turns?.length > 0);
}

export function getTimeIST(rec) {
  if (!rec) return '—';
  const ts = rec.payload?.started_at || rec.payload?.starts_at;
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata'
    });
  } catch {
    return ts.substring(11, 16);
  }
}

export function getDuration(rec) {
  if (!rec?.payload) return '—';
  const s = rec.payload.duration_seconds;
  if (!s) return '—';
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

// ── Route styling ──────────────────────────────────────────────

export const ROUTE_COLORS = {
  'Deal Follow-up':     'bg-blue-500/10 text-blue-300 border border-blue-500/20',
  'Sales Coaching':     'bg-purple-500/10 text-purple-300 border border-purple-500/20',
  'Customer Follow-up': 'bg-green-500/10 text-green-300 border border-green-500/20',
  'CS/Support':         'bg-teal-500/10 text-teal-300 border border-teal-500/20',
  'Partner/Vendor':     'bg-orange-500/10 text-orange-300 border border-orange-500/20',
  'Internal':           'bg-gray-500/10 text-gray-400 border border-gray-500/20',
  'Background':         'bg-slate-500/10 text-slate-400 border border-slate-500/20',
  'Needs Review':       'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20'
};

export function routeColor(route) {
  return ROUTE_COLORS[route] || 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
}

export const ALL_ROUTES = [
  'Deal Follow-up', 'Sales Coaching', 'Customer Follow-up',
  'CS/Support', 'Partner/Vendor', 'Internal', 'Background', 'Needs Review'
];

// ── File download helper ───────────────────────────────────────

export function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Format helpers ─────────────────────────────────────────────

export function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata'
    });
  } catch {
    return iso;
  }
}

export function pct(num, den) {
  if (!den) return '0.0';
  return ((num / den) * 100).toFixed(1);
}
