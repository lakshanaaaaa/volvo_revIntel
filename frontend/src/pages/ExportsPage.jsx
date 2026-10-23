import { useEffect, useState } from 'react';
import { getManifest, downloadManifestJson, downloadManifestCsv, downloadZip } from '../lib/api';
import { Card, SectionHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingPage } from '../components/ui/EmptyState';
import { RouteBadge } from '../components/ui/Badge';
import { triggerDownload } from '../lib/utils';
import { useToast } from '../components/ui/Toast';
import { Download, FileJson, FileText, Archive, FolderOpen, CheckCircle } from 'lucide-react';

const ROUTE_FOLDER_MAP = {
  'Sales Coaching':     'sales_coaching',
  'Deal Follow-up':     'deal_followup',
  'Customer Follow-up': 'customer_followup',
  'CS/Support':         'cs_support',
  'Partner/Vendor':     'partner_vendor',
  'Internal':           'internal',
  'Background':         'background',
  'Needs Review':       'needs_review',
};

const FOLDER_TREE = `exports/
├── manifest.json
├── manifest.csv
├── daily_briefs/
│   └── daily_brief_2026-08-21.md
├── sales_coaching/
│   ├── C01_analysis.md
│   ├── C03_analysis.md
│   ├── C06_analysis.md
│   ├── C07_analysis.md
│   └── M06_analysis.md
├── deal_followup/
│   ├── C02_analysis.md  C03_analysis.md  C04_analysis.md
│   ├── C05_analysis.md  C07_analysis.md  C08_analysis.md
│   ├── C09_analysis.md  C10_analysis.md
│   ├── M03_analysis.md  M06_analysis.md
├── customer_followup/
│   ├── M04_analysis.md  M07_analysis.md
├── cs_support/
│   ├── M04_analysis.md  M07_analysis.md  M09_analysis.md
├── partner_vendor/
│   ├── M01_analysis.md  M02_analysis.md
├── internal/
│   └── M10_analysis.md
├── needs_review/
│   ├── C02_analysis.md  M01_analysis.md
└── background/
    └── [B01–B20, M05, M08, M11–M14]`;

export function ExportsPage() {
  const toast = useToast();
  const [manifest, setManifest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    getManifest()
      .then(setManifest)
      .catch(() => setManifest([]))
      .finally(() => setLoading(false));
  }, []);

  const refresh = () => {
    setLoading(true);
    getManifest().then(setManifest).catch(() => {}).finally(() => setLoading(false));
  };

  const handleDownload = async (type) => {
    setDownloading(type);
    try {
      if (type === 'json') {
        const blob = await downloadManifestJson();
        triggerDownload(blob, 'manifest.json');
        toast('manifest.json downloaded', 'success');
      } else if (type === 'csv') {
        const blob = await downloadManifestCsv();
        triggerDownload(blob, 'manifest.csv');
        toast('manifest.csv downloaded', 'success');
      } else if (type === 'zip') {
        toast('Generating ZIP archive… this may take a moment.', 'info');
        const blob = await downloadZip();
        triggerDownload(blob, 'revenue_intel_exports.zip');
        toast('ZIP archive downloaded with all analysis files', 'success');
      }
    } catch (err) {
      toast(err.message || 'Download failed', 'error');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) return <LoadingPage />;

  // Group manifest by route
  const routeGroups = {};
  (manifest || []).forEach(m => {
    (m.routes || []).forEach(rt => {
      if (!routeGroups[rt]) routeGroups[rt] = [];
      routeGroups[rt].push(m);
    });
  });

  const manualCount    = (manifest || []).filter(m => m.manual_override).length;
  const analysedCount  = (manifest || []).filter(m => m.processing_state === 'analysed').length;

  return (
    <div className="p-6 space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Records', value: manifest?.length || 0 },
          { label: 'Analysed', value: analysedCount, sub: 'with transcripts' },
          { label: 'Manual Overrides', value: manualCount, sub: 'flagged in manifest' },
          { label: 'Export Folders', value: 8, sub: 'output directories' },
        ].map(s => (
          <div key={s.label} className="bg-[#101C30] border border-[#1E3050] rounded-xl p-3.5">
            <div className="text-[10px] text-[#73839E] uppercase tracking-wider">{s.label}</div>
            <div className="text-[22px] font-bold text-[#F1F5FC] mt-0.5">{s.value}</div>
            {s.sub && <div className="text-[10px] text-[#73839E]">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Download panel */}
      <Card>
        <SectionHeader title="Downloadable Exports" sub="Generated from current database state">
          <Button variant="secondary" size="sm" onClick={refresh}>
            <CheckCircle size={12} /> Refresh
          </Button>
        </SectionHeader>

        <div className="space-y-2.5">
          {[
            {
              id: 'json', icon: <FileJson size={18} className="text-[#5B8CFF]" />,
              name: 'manifest.json',
              desc: `Machine-readable JSON manifest · ${manifest?.length || 0} records · conforms to DATA_CONTRACT`,
              label: 'Download JSON',
            },
            {
              id: 'csv', icon: <FileText size={18} className="text-[#35C995]" />,
              name: 'manifest.csv',
              desc: `CSV manifest with identical schema · ${manifest?.length || 0} rows`,
              label: 'Download CSV',
            },
            {
              id: 'zip', icon: <Archive size={18} className="text-[#FF8C42]" />,
              name: 'revenue_intel_exports.zip',
              desc: 'Full ZIP archive — manifest.json, manifest.csv, daily brief, and all analysis .md files',
              label: 'Download ZIP',
            },
          ].map(f => (
            <div key={f.id} className="flex items-center gap-3.5 p-3.5 bg-[#14233B] border border-[#1E3050] rounded-xl">
              <div className="shrink-0">{f.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[#F1F5FC]">{f.name}</div>
                <div className="text-[11px] text-[#73839E] mt-0.5">{f.desc}</div>
              </div>
              <Button
                variant="primary" size="sm"
                onClick={() => handleDownload(f.id)}
                disabled={downloading === f.id || !manifest?.length}
              >
                <Download size={12} />
                {downloading === f.id ? 'Generating…' : f.label}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Folder structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <SectionHeader title="Export Folder Structure" sub="As generated in the ZIP archive">
            <FolderOpen size={14} className="text-[#73839E]" />
          </SectionHeader>
          <pre className="font-mono text-[11px] text-[#A3B2C9] bg-[#14233B] border border-[#1E3050] rounded-lg p-3.5 overflow-x-auto leading-relaxed whitespace-pre">
            {FOLDER_TREE}
          </pre>
        </Card>

        {/* Manifest preview */}
        <Card>
          <SectionHeader title="Manifest Preview" sub={`${manifest?.length || 0} entries`} />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[11.5px]">
              <thead>
                <tr>
                  {['Ref', 'Type', 'Rev', 'Routes', 'State', 'Override'].map(h => (
                    <th key={h} className="text-left px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.5px] text-[#73839E] bg-[#14233B] border-b border-[#1E3050] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(manifest || []).map(m => (
                  <tr key={m.record_ref} className="border-b border-[#1E3050]/50 hover:bg-[#1B2D49]">
                    <td className="px-2.5 py-1.5 font-mono font-bold text-[#5B8CFF] text-[10.5px]">{m.record_ref}</td>
                    <td className="px-2.5 py-1.5 text-[#73839E]">{m.source_type}</td>
                    <td className="px-2.5 py-1.5 text-[#73839E]">{m.applied_revision}</td>
                    <td className="px-2.5 py-1.5">
                      <div className="flex gap-1 flex-wrap">
                        {m.routes?.slice(0, 2).map(rt => <RouteBadge key={rt} route={rt} />)}
                        {m.routes?.length > 2 && <span className="text-[9px] text-[#73839E]">+{m.routes.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-2.5 py-1.5">
                      <span className={`text-[10px] font-medium ${m.processing_state === 'analysed' ? 'text-[#35C995]' : 'text-[#73839E]'}`}>
                        {m.processing_state === 'analysed' ? '✓' : '·'} {m.processing_state?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-2.5 py-1.5">
                      {m.manual_override
                        ? <span className="text-yellow-300 text-[10px]">★ Yes</span>
                        : <span className="text-[#73839E] text-[10px]">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
