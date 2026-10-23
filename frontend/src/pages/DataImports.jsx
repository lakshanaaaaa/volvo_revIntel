import { useState } from 'react';
import { Card, SectionHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ImportModal } from '../components/modals/ImportModal';
import { useToast } from '../components/ui/Toast';
import { Upload, FileJson, RefreshCw, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const REPLAY_STEPS = [
  { step: 1, action: 'Click "Load Initial Batch (01)"', expected: 'Exactly 44 unique records loaded (30 calls, 14 meetings). 17 usable transcripts.' },
  { step: 2, action: 'Click "Load Initial Batch (01)" again', expected: '0 duplicates added, 44 ignored. Total records remains exactly 44.' },
  { step: 3, action: 'Go to Conversations → select M07 → click Edit Route → check "Customer Follow-up" → Save', expected: 'M07 route saved with ★ Manual Override badge.' },
  { step: 4, action: 'Click "Load Update Batch (02)"', expected: 'M07 upgraded rev 1→2. 27-turn transcript available. Total stays 44. Usable transcripts: 18.' },
  { step: 5, action: 'Refresh page (F5)', expected: "State persists in DB. M07's 27-turn transcript visible, revision=2, manual route (Customer Follow-up) preserved." },
];

export function DataImports() {
  const toast = useToast();
  const [importOpen, setImportOpen] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const handleSuccess = (result) => {
    setLastResult(result);
    toast(
      `Batch "${result.batch_id}" processed: ${result.added} added, ${result.updated} updated, ${result.ignored} ignored.`,
      result.updated > 0 ? 'warning' : 'success'
    );
  };

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      {/* Quick import */}
      <Card>
        <SectionHeader title="Import Data Batch" sub="Identity key: (source_type, source_id) · revisions control update behaviour">
          <Button variant="primary" onClick={() => setImportOpen(true)}>
            <Upload size={13} /> Open Import Panel
          </Button>
        </SectionHeader>

        <div className="bg-[#14233B] border border-[#1E3050] rounded-xl p-4 text-[12.5px] text-[#A3B2C9] space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-2 text-[#F1F5FC] font-semibold mb-2">
            <Info size={14} className="text-[#5B8CFF]" /> Data Contract Rules
          </div>
          <p>• <strong>New record</strong> (source_id not in DB) → inserted with pre-generated analysis and default routes.</p>
          <p>• <strong>Same revision</strong> already exists → ignored. No duplicates, no inflated counts.</p>
          <p>• <strong>Newer revision</strong> → source payload and transcript updated. Manual route overrides are preserved.</p>
          <p>• <strong>Manual corrections</strong> survive all re-imports, updates, and server restarts (stored in MongoDB).</p>
        </div>

        {lastResult && (
          <div className="mt-4 bg-[#14233B] border border-[#1E3050] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={14} className="text-green-400" />
              <span className="text-[13px] font-semibold text-[#F1F5FC]">Last Import Result</span>
            </div>
            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { label: 'Batch ID', value: lastResult.batch_id, small: true },
                { label: 'Added', value: lastResult.added, color: 'text-green-300' },
                { label: 'Updated', value: lastResult.updated, color: 'text-yellow-300' },
                { label: 'Ignored', value: lastResult.ignored, color: 'text-[#73839E]' },
              ].map(s => (
                <div key={s.label} className="bg-[#101C30] border border-[#1E3050] rounded-lg p-2.5">
                  <div className={`font-bold ${s.small ? 'text-[11px]' : 'text-[20px]'} ${s.color || 'text-[#F1F5FC]'}`}>{s.value}</div>
                  <div className="text-[10px] text-[#73839E] mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-2.5 text-[11.5px] text-[#73839E] text-center">
              Total records in database: <span className="text-[#F1F5FC] font-semibold">{lastResult.total_records}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Replay contract */}
      <Card>
        <SectionHeader title="Replay Contract" sub="5-step verification sequence">
          <RefreshCw size={13} className="text-[#73839E]" />
        </SectionHeader>
        <div className="space-y-2.5">
          {REPLAY_STEPS.map(s => (
            <div key={s.step} className="flex gap-3 p-3 bg-[#14233B] border border-[#1E3050] rounded-xl">
              <div className="w-7 h-7 rounded-full bg-[#4070E0] flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                {s.step}
              </div>
              <div>
                <div className="text-[12.5px] font-medium text-[#F1F5FC]">{s.action}</div>
                <div className="text-[11.5px] text-[#73839E] mt-0.5">Expected: {s.expected}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Source batch info */}
      <Card>
        <SectionHeader title="Source Batch Files" sub="Supplied with project workspace" />
        <div className="space-y-2.5">
          {[
            {
              id: '01_initial.json',
              badge: 'batch_id: initial-001',
              revision: 1,
              desc: '44 records — 30 calls (B01–B20, C01–C10) + 14 meetings (M01–M14). M07 has 0 transcript turns (unavailable at this revision).',
              color: 'border-[#5B8CFF]/30',
            },
            {
              id: '02_update.json',
              badge: 'batch_id: update-002',
              revision: 2,
              desc: '1 record — M07 (Willowfield Trust). Supplies the complete 27-turn screen-share troubleshooting transcript. Upgrades M07 from revision 1 to 2.',
              color: 'border-[#35C995]/30',
            },
          ].map(b => (
            <div key={b.id} className={`flex items-start gap-3 p-3.5 bg-[#14233B] border ${b.color} rounded-xl`}>
              <FileJson size={18} className="text-[#5B8CFF] shrink-0 mt-0.5" />
              <div>
                <div className="text-[13px] font-semibold text-[#F1F5FC]">{b.id}</div>
                <div className="font-mono text-[10.5px] text-[#73839E] mt-0.5">{b.badge} · revision {b.revision}</div>
                <p className="text-[12px] text-[#A3B2C9] mt-1.5 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <ImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
