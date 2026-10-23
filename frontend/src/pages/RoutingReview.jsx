import { useEffect, useState, useCallback } from 'react';
import { getRecords } from '../lib/api';
import { RouteBadge, SourceBadge, ManualBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, SectionHeader } from '../components/ui/Card';
import { LoadingPage, EmptyState } from '../components/ui/EmptyState';
import { RouteModal } from '../components/modals/RouteModal';
import { getDisplayTitle, getRecordPerson, getTimeIST, hasUsableTranscript, ALL_ROUTES } from '../lib/utils';
import { Edit3, AlertTriangle, Star, CheckCircle, Filter } from 'lucide-react';

const ROUTE_FILTER_OPTIONS = ['All Routes', ...ALL_ROUTES];

export function RoutingReview() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routeFilter, setRouteFilter] = useState('All Routes');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (routeFilter !== 'All Routes') params.route = routeFilter;
      if (typeFilter !== 'all') params.source_type = typeFilter;
      const data = await getRecords(params);
      setRecords(data.records || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [routeFilter, typeFilter]);

  useEffect(() => { load(); }, [load]);

  const handleRouteUpdated = (updated) => {
    setRecords(prev => prev.map(r => r._id === updated._id ? { ...r, ...updated } : r));
  };

  const openModal = (rec) => { setSelected(rec); setModalOpen(true); };

  // Group records by route
  const grouped = {};
  records.forEach(r => {
    const routes = r.routes?.length ? r.routes : ['Background'];
    routes.forEach(rt => {
      if (!grouped[rt]) grouped[rt] = [];
      grouped[rt].push(r);
    });
  });

  const routeOrder = ALL_ROUTES.filter(rt => grouped[rt]);
  const manualCount = records.filter(r => r.manual_override).length;
  const needsReviewCount = records.filter(r => r.routes?.includes('Needs Review')).length;

  return (
    <div className="p-6 space-y-5">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Records', value: records.length, color: 'text-[#F1F5FC]' },
          { label: 'Manual Overrides', value: manualCount, color: 'text-yellow-300', icon: <Star size={13} /> },
          { label: 'Needs Review', value: needsReviewCount, color: 'text-yellow-300', icon: <AlertTriangle size={13} /> },
          { label: 'Auto-Assigned', value: records.length - manualCount, color: 'text-[#35C995]', icon: <CheckCircle size={13} /> },
        ].map(s => (
          <div key={s.label} className="bg-[#101C30] border border-[#1E3050] rounded-xl p-3.5">
            <div className="text-[10px] text-[#73839E] uppercase tracking-wider mb-1">{s.label}</div>
            <div className={`text-[22px] font-bold ${s.color} flex items-center gap-1.5`}>
              {s.icon}{s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter size={14} className="text-[#73839E]" />
        <select
          value={routeFilter}
          onChange={e => setRouteFilter(e.target.value)}
          className="bg-[#101C30] border border-[#263854] text-[#A3B2C9] rounded text-[12px] px-3 py-1.5 focus:outline-none focus:border-[#5B8CFF]"
        >
          {ROUTE_FILTER_OPTIONS.map(r => <option key={r}>{r}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="bg-[#101C30] border border-[#263854] text-[#A3B2C9] rounded text-[12px] px-3 py-1.5 focus:outline-none focus:border-[#5B8CFF]"
        >
          <option value="all">All Types</option>
          <option value="call">Calls</option>
          <option value="meeting">Meetings</option>
        </select>
        <span className="text-[11.5px] text-[#73839E]">{records.length} records shown</span>
      </div>

      {loading
        ? <LoadingPage />
        : records.length === 0
          ? <EmptyState icon="🗂️" title="No records match" description="Adjust the filters above or import data." />
          : (
            <>
              {/* Grouped by route */}
              {routeFilter === 'All Routes'
                ? routeOrder.map(route => (
                  <Card key={route}>
                    <SectionHeader
                      title={route}
                      sub={`${grouped[route].length} record${grouped[route].length !== 1 ? 's' : ''}`}
                    />
                    <RoutingTable
                      records={grouped[route]}
                      onEditRoute={openModal}
                    />
                  </Card>
                ))
                : (
                  <Card>
                    <SectionHeader title={routeFilter} sub={`${records.length} records`} />
                    <RoutingTable records={records} onEditRoute={openModal} />
                  </Card>
                )
              }
            </>
          )
      }

      {/* Difficult cases note */}
      <Card>
        <SectionHeader title="Classification Notes" sub="Deliberate routing decisions documented" />
        {[
          { ref: 'M02', label: 'LedgerBridge (Partner/Vendor, SpendNest as Buyer)', note: "Calendar title looks like a sales meeting but transcript reveals SpendNest is evaluating LedgerBridge as an infrastructure supplier — not selling software. Excluded from sales pipeline." },
          { ref: 'M10', label: 'Internal Enablement Session', note: "All 3 attendees are internal SpendNest staff (Team member A, B, C) discussing back-office billing access. No external prospects. Routed strictly to Internal." },
          { ref: 'M01', label: 'Harborpath Advisory (Partner/Vendor + Needs Review)', note: "Prospect initially assumed SpendNest was a remote bank opening service. Part partner discovery, part qualification reset. Assigned multi-route." },
          { ref: 'M07', label: 'Willowfield Trust (Late Transcript — Rev 2)', note: "In Batch 1, M07 had 0 transcript turns. In Batch 2 (rev 2), a complete 27-turn transcript arrived. Manual route corrections set before Batch 2 are preserved by data contract." },
          { ref: 'C04', label: 'Voicemail with Telephony Disconnect Flag', note: "Telephony flagged is_connected=false but transcript has 95s of substantive voicemail audio. Preserved as Deal Follow-up touchpoint, not discarded." },
        ].map(c => (
          <div key={c.ref} className="border border-[#1E3050] rounded-lg p-3 mb-2 text-[12px]">
            <span className="font-mono font-bold text-[#5B8CFF] text-[11px] mr-2">{c.ref}</span>
            <span className="font-semibold text-[#F1F5FC]">{c.label}</span>
            <p className="text-[#73839E] mt-1 leading-relaxed">{c.note}</p>
          </div>
        ))}
      </Card>

      <RouteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        record={selected}
        onUpdated={handleRouteUpdated}
      />
    </div>
  );
}

function RoutingTable({ records, onEditRoute }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr>
            {['Ref', 'Type', 'Title / Person', 'Time IST', 'Routes', 'Override', 'Actions'].map(h => (
              <th key={h} className="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.5px] text-[#73839E] bg-[#14233B] border-b border-[#1E3050] whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r._id} className="border-b border-[#1E3050]/50 hover:bg-[#1B2D49] transition-colors">
              <td className="px-3 py-2 font-mono font-semibold text-[#5B8CFF] text-[11px]">{r.record_ref}</td>
              <td className="px-3 py-2"><SourceBadge type={r.source_type} /></td>
              <td className="px-3 py-2">
                <div className="text-[#F1F5FC] font-medium truncate max-w-[220px]">{getDisplayTitle(r)}</div>
                <div className="text-[10.5px] text-[#73839E]">{getRecordPerson(r)}</div>
              </td>
              <td className="px-3 py-2 text-[#73839E] whitespace-nowrap">{getTimeIST(r)}</td>
              <td className="px-3 py-2">
                <div className="flex gap-1 flex-wrap">
                  {r.routes?.map(rt => <RouteBadge key={rt} route={rt} />)}
                </div>
              </td>
              <td className="px-3 py-2">
                {r.manual_override ? <ManualBadge /> : <span className="text-[10px] text-[#73839E]">Auto</span>}
              </td>
              <td className="px-3 py-2">
                <Button variant="ghost" size="sm" onClick={() => onEditRoute(r)}>
                  <Edit3 size={11} /> Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
