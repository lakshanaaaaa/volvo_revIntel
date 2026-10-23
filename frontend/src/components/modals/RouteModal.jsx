import { useState, useEffect } from 'react';
import { Modal, ModalActions } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ALL_ROUTES, routeColor } from '../../lib/utils';
import { updateRoute, clearRoute } from '../../lib/api';
import { useToast } from '../ui/Toast';

export function RouteModal({ open, onClose, record, onUpdated }) {
  const toast = useToast();
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (record) setSelected(record.routes || []);
  }, [record]);

  const toggle = (route) => {
    setSelected(prev =>
      prev.includes(route) ? prev.filter(r => r !== route) : [...prev, route]
    );
  };

  const handleSave = async () => {
    if (!record || selected.length === 0) return;
    setLoading(true);
    try {
      const updated = await updateRoute(record._id, selected);
      toast('Manual route correction saved and will persist through re-imports.', 'success');
      onUpdated?.(updated);
      onClose();
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to save route', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!record) return;
    setLoading(true);
    try {
      const updated = await clearRoute(record._id);
      toast('Manual override cleared. Route reverted to auto-assigned.', 'info');
      onUpdated?.(updated);
      onClose();
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to clear override', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!record) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Route"
      description="Manual corrections persist through re-imports and browser restarts. Flagged with ★ in the manifest."
    >
      {record.manual_override && (
        <div className="mb-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3 text-[12px] text-yellow-300">
          ★ This record currently has a manual override active.
        </div>
      )}

      <div className="text-[11px] font-semibold text-[#73839E] uppercase tracking-wider mb-3">
        Select routes (one or more)
      </div>

      <div className="grid grid-cols-2 gap-2 mb-1">
        {ALL_ROUTES.map(route => {
          const active = selected.includes(route);
          return (
            <label
              key={route}
              className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                active
                  ? 'border-[#5B8CFF] bg-[rgba(91,140,255,0.08)]'
                  : 'border-[#1E3050] hover:border-[#263854] bg-[#14233B]'
              }`}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => toggle(route)}
                className="accent-[#5B8CFF] w-3.5 h-3.5"
              />
              <span className={`text-[11.5px] font-medium ${active ? 'text-[#F1F5FC]' : 'text-[#A3B2C9]'}`}>
                {route}
              </span>
            </label>
          );
        })}
      </div>

      <ModalActions>
        {record.manual_override && (
          <Button variant="ghost" size="sm" onClick={handleClear} disabled={loading}>
            Clear Override
          </Button>
        )}
        <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={loading || selected.length === 0}
        >
          {loading ? 'Saving…' : 'Save Correction'}
        </Button>
      </ModalActions>
    </Modal>
  );
}
