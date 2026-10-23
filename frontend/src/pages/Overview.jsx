import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { getStats, getRecords } from '../lib/api';
import { KpiCard, Card, SectionHeader } from '../components/ui/Card';
import { RouteBadge, SourceBadge, ManualBadge } from '../components/ui/Badge';
import { LoadingPage } from '../components/ui/EmptyState';
import { getDisplayTitle, getRecordPerson, getTimeIST, getDuration, hasUsableTranscript, pct } from '../lib/utils';
import { AlertTriangle, TrendingUp, Phone, CalendarDays } from 'lucide-react';

const ROUTE_COLORS_CHART = {
  'Deal Follow-up':     '#5B8CFF',
  'Sales Coaching':     '#9B7EF8',
  'Customer Follow-up': '#35C995',
  'CS/Support':         '#2DD4BF',
  'Partner/Vendor':     '#FF8C42',
  'Internal':           '#73839E',
  'Background':         '#1B2D49',
  'Needs Review':       '#F5B84B',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#14233B] border border-[#263854] rounded-lg px-3 py-2 text-[12px]">
      <p className="text-[#A3B2C9] mb-0.5">{label}</p>
      <p className="text-[#F1F5FC] font-semibold">{payload[0].value} records</p>
    </div>
  );
};

export function Overview() {
  const [stats, setStats] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      const [s, r] = await Promise.all([getStats(), getRecords()]);
      setStats(s);
      setRecords(r.records || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingPage />;

  // Chart data
  const routeChartData = Object.entries(stats?.routeCounts || {})
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  const outcomeChartData = Object.entries(stats?.outcomeCounts || {})
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  const personChartData = Object.entries(stats?.personCounts || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  const coveragePct = pct(stats?.withTranscript || 0, stats?.total || 0);
  const connectPct  = pct(stats?.connected || 0, stats?.callsWithConnStatus || 0);

  // Attention items — flagged records
  const attentionRecords = records.filter(r =>
    r.routes?.includes('Needs Review') || r.record_ref === 'C04'
  ).slice(0, 5);

  return (
    <div className="p-6 space-y-5">

      {/* No data banner */}
      {stats?.total === 0 && (
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5 flex items-start gap-3">
          <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-medium text-yellow-300">No data loaded</p>
            <p className="text-[12px] text-[#A3B2C9] mt-0.5">
              Click <strong>Import</strong> in the top bar and load Initial Batch (01) to get started.
            </p>
          </div>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KpiCard
          label="Selected Records"
          value={stats?.total || 0}
          sub={`${stats?.calls || 0} calls · ${stats?.meetings || 0} meetings`}
        />
        <KpiCard
          label="Transcript Coverage"
          value={`${stats?.withTranscript || 0} / ${stats?.total || 0}`}
          sub={`${coveragePct}% have usable text`}
        />
        <KpiCard
          label="Source-Reported Connect Rate"
          value={`${connectPct}%`}
          sub={`${stats?.connected || 0} / ${stats?.callsWithConnStatus || 0} calls · see notes`}
        />
        <KpiCard
          label="Manual Overrides"
          value={stats?.manualOverrides || 0}
          sub={`${stats?.needsReview || 0} items need review`}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">

        {/* Route distribution */}
        <Card>
          <SectionHeader title="Route Distribution" sub="All loaded records" />
          {routeChartData.length === 0
            ? <p className="text-[12px] text-[#73839E] py-4">No data yet</p>
            : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={routeChartData} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category" dataKey="name" width={110}
                    tick={{ fill: '#A3B2C9', fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {routeChartData.map((entry) => (
                      <Cell key={entry.name} fill={ROUTE_COLORS_CHART[entry.name] || '#5B8CFF'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </Card>

        {/* Outcome distribution */}
        <Card>
          <SectionHeader title="Call Outcome Distribution" sub="Calls only" />
          {outcomeChartData.length === 0
            ? <p className="text-[12px] text-[#73839E] py-4">No calls loaded</p>
            : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={outcomeChartData} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category" dataKey="name" width={90}
                    tick={{ fill: '#A3B2C9', fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#35C995" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </Card>

        {/* Activity by rep */}
        <Card>
          <SectionHeader title="Activity by Rep / Organiser" sub="Selected records only — not full-team view" />
          {personChartData.length === 0
            ? <p className="text-[12px] text-[#73839E] py-4">No data yet</p>
            : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={personChartData} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category" dataKey="name" width={110}
                    tick={{ fill: '#A3B2C9', fontSize: 10.5 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#9B7EF8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </Card>
      </div>

      {/* Coverage breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        <Card>
          <SectionHeader title="Transcript Coverage Breakdown" />
          <div className="space-y-3 text-[12.5px]">
            <CoverageBar
              label="Calls"
              icon={<Phone size={13} />}
              with_={stats?.callsWithTranscript || 0}
              total={stats?.calls || 0}
              color="bg-[#5B8CFF]"
            />
            <CoverageBar
              label="Meetings"
              icon={<CalendarDays size={13} />}
              with_={stats?.meetingsWithTranscript || 0}
              total={stats?.meetings || 0}
              color="bg-[#35C995]"
            />
          </div>
          <p className="text-[11px] text-[#73839E] mt-3">
            * 20 background calls and 6 unrecorded meetings have no supplied audio text by design.
          </p>
        </Card>

        {/* Needs attention */}
        <Card>
          <SectionHeader title="Needs Attention" sub={`${attentionRecords.length} items flagged`} />
          {attentionRecords.length === 0
            ? <p className="text-[12px] text-[#73839E]">No items requiring immediate attention.</p>
            : attentionRecords.map(r => (
              <div
                key={r._id}
                onClick={() => navigate(`/inbox?selected=${r._id}`)}
                className="flex items-start gap-2 p-2.5 rounded-lg bg-[#14233B] border border-[#1E3050] mb-2 cursor-pointer hover:border-[#263854] transition-colors"
              >
                <AlertTriangle size={13} className="text-yellow-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[11px] font-mono font-semibold text-[#5B8CFF]">{r.record_ref}</span>
                  <span className="text-[11.5px] text-[#A3B2C9] ml-1.5">{getDisplayTitle(r)}</span>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {r.routes?.map(rt => <RouteBadge key={rt} route={rt} />)}
                  </div>
                </div>
                <span className="text-[10.5px] text-[#5B8CFF] ml-auto shrink-0">Inspect →</span>
              </div>
            ))
          }
        </Card>
      </div>

      {/* All records quick-scan */}
      <Card>
        <SectionHeader
          title="All Records"
          sub={`${records.length} records · click any row to inspect`}
        >
          <button
            onClick={() => navigate('/inbox')}
            className="text-[11.5px] text-[#5B8CFF] hover:text-[#A3B2C9] transition-colors"
          >
            View full inbox →
          </button>
        </SectionHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] border-collapse">
            <thead>
              <tr>
                {['Ref', 'Type', 'Person', 'Time IST', 'Duration', 'Transcript', 'Outcome / Status', 'Routes', 'Override'].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-[#73839E] bg-[#14233B] border-b border-[#1E3050] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr
                  key={r._id}
                  onClick={() => navigate(`/inbox?selected=${r._id}`)}
                  className="cursor-pointer border-b border-[#1E3050]/60 hover:bg-[#1B2D49] transition-colors"
                >
                  <td className="px-3 py-2 font-mono font-semibold text-[#5B8CFF] text-[11px]">{r.record_ref}</td>
                  <td className="px-3 py-2"><SourceBadge type={r.source_type} /></td>
                  <td className="px-3 py-2 text-[#A3B2C9]">{getRecordPerson(r)}</td>
                  <td className="px-3 py-2 text-[#73839E]">{getTimeIST(r)}</td>
                  <td className="px-3 py-2 text-[#73839E]">{getDuration(r)}</td>
                  <td className="px-3 py-2">
                    {hasUsableTranscript(r)
                      ? <span className="text-green-400 text-[10.5px] font-medium">✓ Yes</span>
                      : <span className="text-[#73839E] text-[10.5px]">No</span>}
                  </td>
                  <td className="px-3 py-2 text-[#73839E] text-[11px]">
                    {r.payload?.observed_outcome || r.payload?.recording_status || '—'}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1 flex-wrap">
                      {r.routes?.slice(0, 2).map(rt => <RouteBadge key={rt} route={rt} />)}
                      {r.routes?.length > 2 && <span className="text-[10px] text-[#73839E]">+{r.routes.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {r.manual_override
                      ? <span className="text-[10px] text-yellow-300">★ Manual</span>
                      : <span className="text-[10px] text-[#73839E]">Auto</span>}
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-[#73839E] text-[12px]">
                    No records loaded. Use Import to load a batch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function CoverageBar({ label, icon, with_, total, color }) {
  const p = total > 0 ? (with_ / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[#A3B2C9] mb-1">
        {icon}
        <span className="font-medium">{label}:</span>
        <span className="text-[#F1F5FC] font-semibold">{with_} / {total} usable</span>
        <span className="text-[#73839E] ml-auto">{p.toFixed(1)}%</span>
      </div>
      <div className="h-[6px] bg-[#1B2D49] rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${p}%` }} />
      </div>
    </div>
  );
}
