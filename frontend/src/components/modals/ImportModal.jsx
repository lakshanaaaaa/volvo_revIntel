import { useState, useRef } from 'react';
import { Upload, FileJson, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Modal, ModalActions } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/EmptyState';
import { importBatch, importFile } from '../../lib/api';

// Lazy-loaded batch data
const loadBatch = async (type) => {
  if (type === 'initial') {
    const mod = await import('../../data/batch01.js');
    return mod.INITIAL_BATCH;
  } else {
    const mod = await import('../../data/batch02.js');
    return mod.UPDATE_BATCH;
  }
};

export function ImportModal({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef();

  const reset = () => { setResult(null); setError(null); };

  const runImport = async (fn) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await fn();
      setResult(data);
      onSuccess?.(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLoad = (type) => runImport(async () => {
    const batch = await loadBatch(type);
    return importBatch(batch);
  });

  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.endsWith('.json')) {
      setError('Only JSON files are supported');
      return;
    }
    runImport(() => importFile(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <Modal
      open={open}
      onClose={() => { reset(); onClose(); }}
      title="Import Batch"
      description="Identity: (source_type, source_id). Same or older revisions are ignored. Manual route corrections survive all re-imports."
    >
      {/* Quick load buttons */}
      <div className="flex gap-2 flex-wrap mb-5">
        <Button variant="secondary" onClick={() => handleQuickLoad('initial')} disabled={loading}>
          <FileJson size={13} />
          Load Initial Batch (01)
        </Button>
        <Button variant="secondary" onClick={() => handleQuickLoad('update')} disabled={loading}>
          <RefreshCw size={13} />
          Load Update Batch (02)
        </Button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-[1.5px] border-dashed rounded-lg p-7 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-[#5B8CFF] bg-[rgba(91,140,255,0.08)] text-[#A3B2C9]'
            : 'border-[#263854] text-[#73839E] hover:border-[#5B8CFF] hover:bg-[rgba(91,140,255,0.04)]'
        }`}
      >
        <Upload size={26} className="mx-auto mb-2 opacity-50" />
        <p className="text-[12.5px]">Click or drag & drop a JSON batch file</p>
        <p className="text-[11px] mt-1 opacity-60">Supports 01_initial.json and 02_update.json</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={e => handleFile(e.target.files[0])}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 mt-4 text-[12.5px] text-[#A3B2C9]">
          <Spinner size="sm" /> Processing batch…
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-4 bg-[#14233B] border border-green-500/20 rounded-lg p-3.5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={14} className="text-green-400 shrink-0" />
            <span className="text-[12.5px] font-medium text-[#F1F5FC]">
              Batch "{result.batch_id}" (rev {result.revision}) processed
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Added', val: result.added, color: 'text-green-300' },
              { label: 'Updated', val: result.updated, color: 'text-yellow-300' },
              { label: 'Ignored', val: result.ignored, color: 'text-[#73839E]' },
            ].map(s => (
              <div key={s.label} className="bg-[#101C30] rounded p-2">
                <div className={`text-[18px] font-bold ${s.color}`}>{s.val}</div>
                <div className="text-[10px] text-[#73839E]">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[11px] text-[#73839E] text-center">
            Total records in DB: <span className="text-[#F1F5FC] font-medium">{result.total_records}</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-500/5 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
          <span className="text-[12px] text-red-300">{error}</span>
        </div>
      )}

      <ModalActions>
        <Button variant="ghost" onClick={() => { reset(); onClose(); }}>Close</Button>
      </ModalActions>
    </Modal>
  );
}
