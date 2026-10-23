import { Card, SectionHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Database, BookOpen, Ruler, Shield } from 'lucide-react';

const FIELD_GLOSSARY = [
  { field: 'record_ref',         type: 'string',  source: 'Batch',     desc: 'Human-readable reference ID (B01–B20, C01–C10, M01–M14)' },
  { field: 'source_type',        type: 'enum',    source: 'Batch',     desc: 'Record origin: "call" or "meeting"' },
  { field: 'source_id',          type: 'uuid',    source: 'Batch',     desc: 'Unique identifier from source system. Together with source_type forms the identity key.' },
  { field: 'batch_id',           type: 'string',  source: 'Batch',     desc: 'Identifier of the import batch (e.g. "initial-001", "update-002")' },
  { field: 'applied_revision',   type: 'integer', source: 'Computed', desc: 'Highest revision applied to this record. Newer revisions replace payload; older/same are ignored.' },
  { field: 'rep_name',           type: 'string',  source: 'Call payload', desc: 'SDR representative name (calls only)' },
  { field: 'rep_email',          type: 'string',  source: 'Call payload', desc: 'SDR representative email' },
  { field: 'direction',          type: 'string',  source: 'Call payload', desc: 'Call direction: "inbound" or "outbound"' },
  { field: 'is_connected',       type: 'boolean', source: 'Call payload', desc: 'Telephony source-reported connection flag. NOTE: Contains known telemetry discrepancies (B11/B14 false positive, C04 false negative).' },
  { field: 'observed_outcome',   type: 'string',  source: 'Call payload', desc: 'Call outcome: "voicemail", "unresponsive", "uninterested", "ooo", "follow_up"' },
  { field: 'duration_seconds',   type: 'integer', source: 'Call payload', desc: 'Call duration in seconds' },
  { field: 'transcript',         type: 'string',  source: 'Call payload', desc: 'Raw conversation transcript (calls only). Null for 20 background calls.' },
  { field: 'title',              type: 'string',  source: 'Meeting payload', desc: 'Calendar meeting title' },
  { field: 'organizer_email',    type: 'string',  source: 'Meeting payload', desc: 'Calendar organizer email (team06–team14, arun)' },
  { field: 'attendee_count',     type: 'integer', source: 'Meeting payload', desc: 'Number of attendees' },
  { field: 'recording_status',   type: 'string',  source: 'Meeting payload', desc: 'Recording state: "recorded", "not_recorded", etc.' },
  { field: 'has_transcript',     type: 'boolean', source: 'Meeting payload', desc: 'Whether transcript text was available at export time' },
  { field: 'transcript_payload', type: 'object',  source: 'Meeting payload', desc: 'Structured transcript with turns array (speaker, timecode, text). Null when unavailable.' },
  { field: 'routes',            type: 'array',   source: 'Computed',   desc: 'Assigned routing destinations. Auto-assigned from pre-analysis or manually overridden.' },
  { field: 'manual_override',    type: 'boolean', source: 'Computed',   desc: 'True if a manager has manually corrected the route. Persists through all re-imports.' },
  { field: 'analysis.summary',  type: 'string',  source: 'Pre-generated', desc: 'Executive summary of the conversation, grounded in transcript evidence' },
  { field: 'analysis.evidence', type: 'string',  source: 'Pre-generated', desc: 'Direct quote from transcript supporting the analysis conclusion' },
  { field: 'analysis.coaching', type: 'string',  source: 'Pre-generated', desc: 'Sales coaching observation for the rep' },
  { field: 'analysis.next_steps', type: 'string', source: 'Pre-generated', desc: 'Recommended follow-up action with timing' },
  { field: 'analysis.limitations', type: 'string', source: 'Pre-generated', desc: 'Explicit statement of what is NOT known or cannot be inferred' },
];

const METRIC_DEFINITIONS = [
  {
    metric: 'Selected Records',
    calc: 'Count of distinct (source_type, source_id) pairs in database',
    value: '44',
    interp: 'Deliberately selected sample for 21 Aug 2026 IST; not a full-team census.',
  },
  {
    metric: 'Usable Transcript Coverage',
    calc: 'Records with non-empty transcript text / all loaded records',
    value: '18 / 44 (40.9%)',
    interp: '10 of 30 calls have text (33.3%); 8 of 14 meetings have text (57.1%). 20 background calls and 6 unrecorded meetings lack speech text by design.',
  },
  {
    metric: 'Source-Reported Connect Rate',
    calc: 'Calls with is_connected=true / calls with non-null is_connected',
    value: '11 / 30 (36.7%)',
    interp: 'Telephony source classifier. 11 connected, 19 unconnected, 0 unknown. Contradicted by actual audio (B11/B14 unresponsive; C04 answered voicemail).',
  },
  {
    metric: 'Rep vs Organiser Split',
    calc: 'Calls feature rep_name; meetings feature organizer_email',
    value: '5 SDR reps, 9 organiser inboxes',
    interp: 'Calls: Arun, Meera, Kiran, Dev, Leela. Meetings: team06–team14, arun. An organiser is an internal scheduler, not necessarily an AE or attendee.',
  },
  {
    metric: 'Manual Overrides',
    calc: 'Count of records where manual_override=true',
    value: '0 by default',
    interp: 'Manager-corrected routes. Persist through re-imports, updates, and server restarts. Flagged with ★ in the manifest.',
  },
];

const ROUTE_DEFINITIONS = [
  { route: 'Sales Coaching',      folder: 'sales_coaching',     desc: 'Conversations where rep performance observations are actionable — coaching opportunities, technique gaps, or standout execution.' },
  { route: 'Deal Follow-up',      folder: 'deal_followup',     desc: 'Active pipeline touchpoints requiring a next action: callbacks, demos, referrals, or warm introductions.' },
  { route: 'Customer Follow-up',  folder: 'customer_followup', desc: 'Existing customer interactions needing relationship management attention.' },
  { route: 'CS/Support',          folder: 'cs_support',         desc: 'Product support, troubleshooting, account setup, or configuration issues raised by existing customers.' },
  { route: 'Partner/Vendor',      folder: 'partner_vendor',     desc: 'Partner discussions or vendor evaluations. SpendNest may be the buyer (e.g. LedgerBridge/M02). Excluded from sales pipeline.' },
  { route: 'Internal',            folder: 'internal',           desc: 'Internal SpendNest meetings with no external prospects. Excluded from pipeline and quota metrics.' },
  { route: 'Background',          folder: 'background',         desc: 'Intake-only records with no usable transcript. Stored but not analysed. No fabricated summaries.' },
  { route: 'Needs Review',        folder: 'needs_review',       desc: 'Records flagged for manager review — ambiguous routing, multi-destination, or requiring manual verification.' },
];

const REJECTED_DECISIONS = [
  {
    title: 'No fabricated pipeline currency',
    reason: 'No CRM opportunity table, authoritative deal value, or confirmed staff-role directory is supplied. Guessing ARR or deal sizes creates dangerous false confidence.',
    tradeoff: 'The dashboard omits aggregate pipeline currency cards. The Manager Brief groups priorities by qualitative urgency (Today, Tuesday, Thursday) rather than unverified revenue sizing.',
  },
  {
    title: 'No sales rep quota leaderboards',
    reason: 'Call counts do not equal sales performance. Ranking Meera as "top SDR" based on call count ignores deal quality, outcome, and stage.',
    tradeoff: 'Rep activity bars are explicitly labeled as "Selected records only. Not a full-team daily view." Coaching notes are evidence-grounded, not ranking-based.',
  },
  {
    title: 'No extrapolated customer relationships',
    reason: 'Meeting attendee labels (Customer A, Partner A, Supplier A) are anonymized. Inferring account hierarchy or decision authority from these labels is unreliable.',
    tradeoff: 'Next steps reference verified roles only (e.g. "finance lead" from transcript, not guessed titles). Limitations are stated explicitly per record.',
  },
];

export function Settings() {
  return (
    <div className="p-6 space-y-5 max-w-5xl">
      {/* Header */}
      <div className="bg-[#101C30] border border-[#1E3050] rounded-xl p-5">
        <div className="flex items-center gap-2.5 mb-1">
          <Database size={18} className="text-[#5B8CFF]" />
          <h2 className="text-[16px] font-bold text-[#F1F5FC]">Data Definitions & Metric Glossary</h2>
        </div>
        <p className="text-[12.5px] text-[#A3B2C9] mt-1.5 leading-relaxed">
          This page documents every field in the data model, the exact denominator for each metric,
          and the routing taxonomy. All metrics use only conclusions supported by the supplied data.
        </p>
      </div>

      {/* Metric definitions */}
      <Card>
        <SectionHeader title="Metric Definitions" sub="Exact calculation & denominator for each dashboard metric">
          <Ruler size={14} className="text-[#73839E]" />
        </SectionHeader>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr>
                {['Metric', 'Calculation', 'Value', 'Interpretation & Source Grounding'].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.5px] text-[#73839E] bg-[#14233B] border-b border-[#1E3050]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRIC_DEFINITIONS.map(m => (
                <tr key={m.metric} className="border-b border-[#1E3050]/50 align-top">
                  <td className="px-3 py-2.5 font-semibold text-[#F1F5FC] whitespace-nowrap">{m.metric}</td>
                  <td className="px-3 py-2.5 text-[#A3B2C9] font-mono text-[11px]">{m.calc}</td>
                  <td className="px-3 py-2.5 text-[#5B8CFF] font-semibold whitespace-nowrap">{m.value}</td>
                  <td className="px-3 py-2.5 text-[#73839E] leading-relaxed">{m.interp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Field glossary */}
      <Card>
        <SectionHeader title="Field Glossary" sub="Every field in the ConversationRecord schema">
          <BookOpen size={14} className="text-[#73839E]" />
        </SectionHeader>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[11.5px]">
            <thead>
              <tr>
                {['Field', 'Type', 'Source', 'Description'].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.5px] text-[#73839E] bg-[#14233B] border-b border-[#1E3050]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FIELD_GLOSSARY.map(f => (
                <tr key={f.field} className="border-b border-[#1E3050]/50 align-top hover:bg-[#1B2D49]">
                  <td className="px-3 py-2 font-mono text-[#5B8CFF] font-medium whitespace-nowrap">{f.field}</td>
                  <td className="px-3 py-2"><Badge variant={f.type === 'boolean' ? 'green' : f.type === 'integer' ? 'orange' : f.type === 'enum' ? 'purple' : 'gray'}>{f.type}</Badge></td>
                  <td className="px-3 py-2 text-[#73839E] whitespace-nowrap">{f.source}</td>
                  <td className="px-3 py-2 text-[#A3B2C9] leading-relaxed">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Route definitions */}
      <Card>
        <SectionHeader title="Routing Taxonomy" sub="8 route destinations with folder mapping and inclusion rules" />
        <div className="space-y-2">
          {ROUTE_DEFINITIONS.map(r => (
            <div key={r.route} className="flex items-start gap-3 p-3 bg-[#14233B] border border-[#1E3050] rounded-lg">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] font-semibold text-[#F1F5FC]">{r.route}</span>
                  <span className="font-mono text-[10px] text-[#73839E] bg-[#101C30] px-1.5 py-0.5 rounded">exports/{r.folder}/</span>
                </div>
                <p className="text-[11.5px] text-[#A3B2C9] leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Deliberately rejected decisions */}
      <Card>
        <SectionHeader title="Deliberately Rejected Decisions" sub="What we chose NOT to infer and why">
          <Shield size={14} className="text-[#FF6B78]" />
        </SectionHeader>
        <div className="space-y-3">
          {REJECTED_DECISIONS.map(d => (
            <div key={d.title} className="border border-[#1E3050] border-l-[3px] border-l-[#FF6B78] rounded-lg p-3.5 bg-red-500/5">
              <div className="text-[13px] font-semibold text-[#F1F5FC] mb-1.5">{d.title}</div>
              <p className="text-[12px] text-[#A3B2C9] leading-relaxed mb-1.5">
                <span className="text-[#73839E] font-semibold">Why rejected: </span>{d.reason}
              </p>
              <p className="text-[12px] text-[#A3B2C9] leading-relaxed">
                <span className="text-[#73839E] font-semibold">Accepted trade-off: </span>{d.tradeoff}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Data contract summary */}
      <Card>
        <SectionHeader title="Data Contract Summary" sub="Import idempotency and revision rules" />
        <div className="space-y-2 text-[12px] text-[#A3B2C9] leading-relaxed">
          <p>• <strong className="text-[#F1F5FC]">Identity key:</strong> (source_type, source_id) — composite unique index in MongoDB.</p>
          <p>• <strong className="text-[#F1F5FC]">Revision ordering:</strong> Newer revision replaces source payload + transcript. Same or older revision → ignored (idempotent).</p>
          <p>• <strong className="text-[#F1F5FC]">Manual override preservation:</strong> If manual_override=true, routes are NOT changed by re-imports. Only source payload and transcript are refreshed.</p>
          <p>• <strong className="text-[#F1F5FC]">Analysis freshness:</strong> Pre-generated analysis is loaded at first import. Late-arriving transcripts (e.g. M07 rev 2) trigger analysis refresh if no manual override exists.</p>
          <p>• <strong className="text-[#F1F5FC]">No fabricated data:</strong> Records without transcripts receive "intake_complete" state only. No summaries, coaching, or next steps are generated for them.</p>
        </div>
      </Card>
    </div>
  );
}
