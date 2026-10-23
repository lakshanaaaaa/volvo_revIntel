import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getRecords, getRecord } from '../lib/api';
import { RouteBadge, SourceBadge, ManualBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingPage, Spinner, EmptyState } from '../components/ui/EmptyState';
import { RouteModal } from '../components/modals/RouteModal';
import {
  getDisplayTitle, getRecordPerson, getTimeIST, getDuration,
  hasUsableTranscript, ALL_ROUTES
} from '../lib/utils';
import {
  Search, Filter, Edit3, Phone, CalendarDays, Clock,
  ChevronRight, AlertTriangle, Info, Zap, X
} from 'lucide-react';

const TABS = [
  { key: 'all',          label: 'All' },
  { key: 'needs-review', label: 'Needs Review' },
  { key: 'analysable',   label: 'Analysable' },
  { key: 'background',   label: 'Background' },
];

export function Conversations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(searchParams.get('selected') || null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [tab, setTab] = useState(searchParams.get('tab') || 'all');
  const [personFilter, setPersonFilter] = useState('all');
  const [persons, setPersons] = useState([]);
  const searchRef = useRef();

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = { tab, search: search || undefined };
      if (personFilter !== 'all') params.person = personFilter;
      const data = await getRecords(params);
      setRecords(data.records || []);
      setTotal(data.total || 0);

      // Extract persons list
      const pSet = new Set();
      (data.records || []).forEach(r => {
        const p = getRecordPerson(r);
        if (p) pSet.add(p);
      });
      setPersons([...pSet].sort());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [tab, search, personFilter]);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  // Auto-select first if none
  useEffect(() => {
    if (!selectedId && records.length > 0) setSelectedId(records[0]._id);
  }, [records, selectedId]);

  // Load detail
  useEffect(() => {
    if (!selectedId) return;
    setDetailLoading(true);
    getRecord(selectedId)
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setDetailLoading(false));
  }, [selectedId]);

  const handleSelect = (rec) => {
    setSelectedId(rec._id);
    setSearchParams(p => { p.set('selected', rec._id); return p; });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(p => { p.set('search', search); p.set('tab', tab); return p; });
    loadRecords();
  };

  const handleTabChange = (t) => {
    setTab(t);
    setSearchParams(p => { p.set('tab', t); return p; });
  };

  const handleRouteUpdated = (updated) => {
    setDetail(updated);
    setRecords(prev => prev.map(r => r._id === updated._id ? { ...r, ...updated } : r));
  };

  // Tab counts
  const tabCounts = {
    all:           records.length,
    'needs-review': records.filter(r => r.routes?.includes('Needs Review')).length,
    analysable:    records.filter(r => hasUsableTranscript(r)).length,
    background:    records.filter(r => !hasUsableTranscript(r)).length,
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── List panel ── */}
      <div className="w-[300px] shrink-0 border-r border-[#1E3050] flex flex-col bg-[#0B1426] overflow-hidden">

        {/* Search + filter */}
        <div className="p-3 border-b border-[#1E3050] space-y-2">
          <form onSubmit={handleSearch} className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#73839E]" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="w-full bg-[#101C30] border border-[#263854] text-[#A3B2C9] placeholder-[#73839E] rounded text-[12px] pl-8 pr-3 py-[6px] focus:outline-none focus:border-[#5B8CFF]"
            />
            {search && (
              <button type="button" onClick={() => { setSearch(''); loadRecords(); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#73839E] hover:text-[#A3B2C9]">
                <X size={12} />
              </button>
            )}
          </form>
          <select
            value={personFilter}
            onChange={e => setPersonFilter(e.target.value)}
            className="w-full bg-[#101C30] border border-[#263854] text-[#A3B2C9] rounded text-[11.5px] px-2.5 py-[5px] focus:outline-none focus:border-[#5B8CFF]"
          >
            <option value="all">All reps / organisers</option>
            {persons.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1E3050] shrink-0">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => handleTabChange(t.key)}
              className={`flex-1 text-[11px] font-medium py-2 border-b-2 transition-colors whitespace-nowrap ${
                tab === t.key
                  ? 'text-[#5B8CFF] border-[#5B8CFF]'
                  : 'text-[#73839E] border-transparent hover:text-[#A3B2C9]'
              }`}
            >
              {t.label}
              <span className={`ml-1 text-[9.5px] ${tab === t.key ? 'text-[#5B8CFF]' : 'text-[#73839E]'}`}>
                ({tabCounts[t.key] || 0})
              </span>
            </button>
          ))}
        </div>

        {/* Record list */}
        <div className="flex-1 overflow-y-auto">
          {loading
            ? <div className="flex justify-center py-10"><Spinner /></div>
            : records.length === 0
              ? <EmptyState icon="📭" title="No conversations found" description="Try adjusting your filters or importing a batch." />
              : records.map(r => (
                <RecordListItem
                  key={r._id}
                  record={r}
                  isSelected={r._id === selectedId}
                  onClick={() => handleSelect(r)}
                />
              ))
          }
        </div>
      </div>

      {/* ── Detail panel ── */}
      <div className="flex-1 overflow-y-auto">
        {detailLoading
          ? <LoadingPage />
          : detail
            ? <RecordDetail
                record={detail}
                onEditRoute={() => setRouteModalOpen(true)}
              />
            : <EmptyState icon="💬" title="Select a conversation" description="Click any item on the left to inspect it." />
        }
      </div>

      <RouteModal
        open={routeModalOpen}
        onClose={() => setRouteModalOpen(false)}
        record={detail}
        onUpdated={handleRouteUpdated}
      />
    </div>
  );
}

/* ── Record list item ──────────────────────────────────────── */
function RecordListItem({ record: r, isSelected, onClick }) {
  const hasText = hasUsableTranscript(r);
  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-2.5 px-3.5 py-3 border-b border-[#1E3050]/50 cursor-pointer transition-colors border-l-2 ${
        isSelected
          ? 'bg-[rgba(91,140,255,0.08)] border-l-[#5B8CFF]'
          : 'border-l-transparent hover:bg-[#101C30]'
      }`}
    >
      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${r.source_type === 'call' ? 'bg-[#5B8CFF]' : 'bg-[#35C995]'}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-mono text-[10px] font-semibold text-[#5B8CFF]">{r.record_ref}</span>
          {r.manual_override && <span className="text-yellow-400 text-[9px]">★</span>}
          {r.routes?.includes('Needs Review') && (
            <AlertTriangle size={10} className="text-yellow-400 shrink-0" />
          )}
        </div>
        <div className="text-[12px] font-medium text-[#F1F5FC] truncate">{getDisplayTitle(r)}</div>
        <div className="text-[10.5px] text-[#73839E] mt-0.5">
          {getRecordPerson(r)} · {getTimeIST(r)}
          {!hasText && <span className="ml-1 text-[#73839E]">· no transcript</span>}
        </div>
        <div className="flex gap-1 mt-1.5 flex-wrap">
          {r.routes?.slice(0, 2).map(rt => <RouteBadge key={rt} route={rt} />)}
          {r.routes?.length > 2 && <span className="text-[9.5px] text-[#73839E]">+{r.routes.length - 2}</span>}
        </div>
      </div>
    </div>
  );
}

/* ── Record detail panel ──────────────────────────────────── */
function RecordDetail({ record: r, onEditRoute }) {
  const hasText = hasUsableTranscript(r);
  const isCall = r.source_type === 'call';

  return (
    <div className="p-5">
      {/* Header */}
      <div className="bg-[#14233B] border border-[#1E3050] rounded-xl p-4 mb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono text-[11px] font-bold text-[#5B8CFF]">{r.record_ref}</span>
              <SourceBadge type={r.source_type} />
              {r.manual_override && <ManualBadge />}
              {r.analysis?.is_late_update && (
                <span className="text-[10.5px] font-medium text-orange-300 bg-orange-500/10 border border-orange-500/20 rounded px-2 py-px">Late Update (Rev {r.applied_revision})</span>
              )}
            </div>
            <h2 className="text-[15px] font-semibold text-[#F1F5FC]">{getDisplayTitle(r)}</h2>
            <div className="flex items-center gap-4 mt-1.5 text-[11.5px] text-[#73839E] flex-wrap">
              {isCall
                ? <><Phone size={12} /> {getRecordPerson(r)}</>
                : <><CalendarDays size={12} /> {getRecordPerson(r)}</>
              }
              <span className="flex items-center gap-1"><Clock size={12} /> {getTimeIST(r)} IST</span>
              <span>{getDuration(r)}</span>
              <span className="font-mono text-[10px] bg-[#101C30] px-2 py-0.5 rounded border border-[#263854]">rev {r.applied_revision}</span>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={onEditRoute}>
            <Edit3 size={12} />
            Edit Route
          </Button>
        </div>

        {/* Routes */}
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {r.routes?.map(rt => <RouteBadge key={rt} route={rt} />)}
        </div>
      </div>

      {/* Call-specific metadata */}
      {isCall && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          {[
            { label: 'Direction',    value: r.payload?.direction || '—' },
            { label: 'Outcome',      value: r.payload?.observed_outcome || '—' },
            { label: 'Connected',    value: r.payload?.is_connected === true ? '✓ Yes' : r.payload?.is_connected === false ? '✗ No' : '—' },
            { label: 'Speaker Count', value: r.payload?.speaker_count ?? '—' },
          ].map(m => (
            <div key={m.label} className="bg-[#14233B] border border-[#1E3050] rounded-lg p-2.5">
              <div className="text-[10px] text-[#73839E] uppercase tracking-wider">{m.label}</div>
              <div className="text-[13px] font-medium text-[#F1F5FC] mt-0.5">{m.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Meeting-specific metadata */}
      {!isCall && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          {[
            { label: 'Provider',    value: r.payload?.provider || '—' },
            { label: 'Attendees',   value: r.payload?.attendee_count ?? '—' },
            { label: 'Recording',   value: r.payload?.recording_status || '—' },
            { label: 'Transcript',  value: r.payload?.has_transcript ? '✓ Yes' : '✗ No' },
          ].map(m => (
            <div key={m.label} className="bg-[#14233B] border border-[#1E3050] rounded-lg p-2.5">
              <div className="text-[10px] text-[#73839E] uppercase tracking-wider">{m.label}</div>
              <div className="text-[13px] font-medium text-[#F1F5FC] mt-0.5">{m.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Analysis */}
      {hasText && r.analysis?.summary && (
        <div className="space-y-3 mb-4">
          <AnalysisBlock label="Executive Summary" icon={<Zap size={13} />}>
            {r.analysis.summary}
          </AnalysisBlock>
          {r.analysis?.evidence_ref && (
            <div className="bg-[rgba(91,140,255,0.06)] border border-[rgba(91,140,255,0.18)] border-l-[3px] border-l-[#5B8CFF] rounded-lg p-3.5">
              <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#73839E] mb-1.5">Source Evidence</div>
              <p className="text-[12px] text-[#A3B2C9] italic leading-relaxed">"{r.analysis.evidence}"</p>
              <p className="text-[10.5px] text-[#73839E] mt-1.5 font-mono">{r.analysis.evidence_ref}</p>
            </div>
          )}
          {r.analysis?.coaching && (
            <AnalysisBlock label="Sales Coaching Notes" icon={<Info size={13} />}>
              {r.analysis.coaching}
            </AnalysisBlock>
          )}
          {r.analysis?.next_steps && (
            <AnalysisBlock label="Recommended Next Steps" icon={<ChevronRight size={13} />}>
              {r.analysis.next_steps}
            </AnalysisBlock>
          )}
          {r.analysis?.limitations && (
            <AnalysisBlock label="Honest Limitations & Boundaries" icon={<AlertTriangle size={13} />}>
              {r.analysis.limitations}
            </AnalysisBlock>
          )}
        </div>
      )}

      {!hasText && (
        <div className="bg-[#14233B] border border-[#1E3050] rounded-xl p-4 mb-4 flex items-start gap-2.5">
          <AlertTriangle size={15} className="text-[#73839E] shrink-0 mt-0.5" />
          <p className="text-[12.5px] text-[#73839E]">
            No usable transcript available for this record. Stored as intake record only.
            {isCall && r.payload?.observed_outcome === 'voicemail' && ' (Voicemail / no-reply)'}
          </p>
        </div>
      )}

      {/* Transcript */}
      {hasText && (
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#73839E] mb-2">Transcript</div>
          {isCall
            ? <CallTranscript text={r.payload?.transcript} />
            : <MeetingTranscript turns={r.transcript_payload?.turns} />
          }
        </div>
      )}
    </div>
  );
}

function AnalysisBlock({ label, icon, children }) {
  return (
    <div className="bg-[#14233B] border border-[#1E3050] rounded-lg p-3.5">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-[#73839E]">{icon}</span>
        <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#73839E]">{label}</span>
      </div>
      <p className="text-[12.5px] text-[#A3B2C9] leading-relaxed">{children}</p>
    </div>
  );
}

function CallTranscript({ text }) {
  if (!text) return null;
  return (
    <div className="bg-[#14233B] border border-[#1E3050] rounded-lg p-4 max-h-[360px] overflow-y-auto">
      <p className="text-[12px] text-[#A3B2C9] leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  );
}

function MeetingTranscript({ turns }) {
  if (!turns?.length) return null;
  return (
    <div className="bg-[#14233B] border border-[#1E3050] rounded-lg p-4 max-h-[420px] overflow-y-auto space-y-3.5">
      {turns.map((turn, i) => {
        const isTeam = turn.speaker?.toLowerCase().includes('team');
        return (
          <div key={i}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10.5px] font-bold ${isTeam ? 'text-[#5B8CFF]' : 'text-[#35C995]'}`}>
                {turn.speaker}
              </span>
              {turn.timecode && (
                <span className="font-mono text-[9.5px] text-[#73839E]">{turn.timecode}</span>
              )}
            </div>
            <p className="text-[12px] text-[#A3B2C9] leading-relaxed">{turn.text}</p>
          </div>
        );
      })}
    </div>
  );
}
