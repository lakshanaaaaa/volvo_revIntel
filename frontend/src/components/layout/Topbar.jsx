import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Upload, Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { ImportModal } from '../modals/ImportModal';

export function Topbar({ title, stats, onImportSuccess }) {
  const [search, setSearch] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/inbox?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <>
      <header className="bg-[#0B1426] border-b border-[#1E3050] h-[52px] flex items-center gap-3 px-6 shrink-0 z-10">
        {/* Page title */}
        <h1 className="text-[14px] font-semibold text-[#F1F5FC] flex-1 truncate">{title}</h1>

        {/* Date badge */}
        <span className="text-[11.5px] text-[#73839E] bg-[#101C30] border border-[#1E3050] rounded px-2.5 py-1 whitespace-nowrap hidden sm:block">
          21 Aug 2026 IST
        </span>

        {/* Global search */}
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#73839E]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search conversations…"
            className="bg-[#101C30] border border-[#263854] text-[#A3B2C9] placeholder-[#73839E] rounded text-[12px] pl-8 pr-3 py-[5px] w-52 focus:outline-none focus:border-[#5B8CFF] focus:ring-1 focus:ring-[#5B8CFF]/20"
          />
        </form>

        {/* Needs-review bell */}
        {stats?.needsReview > 0 && (
          <button
            onClick={() => navigate('/inbox?tab=needs-review')}
            className="relative text-[#73839E] hover:text-[#F5B84B] transition-colors"
            aria-label={`${stats.needsReview} items need review`}
          >
            <Bell size={17} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F5B84B] text-[9px] font-bold text-black flex items-center justify-center">
              {stats.needsReview}
            </span>
          </button>
        )}

        {/* Import button */}
        <Button variant="primary" size="md" onClick={() => setImportOpen(true)}>
          <Upload size={13} />
          Import
        </Button>
      </header>

      <ImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onSuccess={(result) => {
          setImportOpen(false);
          onImportSuccess?.(result);
        }}
      />
    </>
  );
}
