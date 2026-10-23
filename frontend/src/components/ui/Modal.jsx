import { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ open, onClose, title, description, children, width = 'max-w-lg' }) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={`bg-[#101C30] border border-[#263854] rounded-xl shadow-2xl w-full ${width} max-h-[88vh] overflow-y-auto`}>
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-[#1E3050]">
          <div>
            <h2 className="text-[16px] font-bold text-[#F1F5FC]">{title}</h2>
            {description && <p className="text-[12.5px] text-[#73839E] mt-1 leading-relaxed">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-[#73839E] hover:text-[#A3B2C9] ml-4 mt-0.5 shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function ModalActions({ children }) {
  return (
    <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-[#1E3050]">
      {children}
    </div>
  );
}
