import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

const ToastCtx = createContext(null);

const ICONS = {
  success: <CheckCircle size={15} className="text-green-400 shrink-0" />,
  error:   <XCircle    size={15} className="text-red-400 shrink-0" />,
  warning: <AlertCircle size={15} className="text-yellow-400 shrink-0" />,
  info:    <Info       size={15} className="text-blue-400 shrink-0" />,
};

const BORDER = {
  success: 'border-green-500/30',
  error:   'border-red-500/30',
  warning: 'border-yellow-500/30',
  info:    'border-blue-500/30',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-start gap-2.5 bg-[#14233B] border ${BORDER[t.type] || BORDER.info} rounded-lg px-3.5 py-2.5 shadow-xl min-w-[260px] max-w-[380px] pointer-events-auto animate-[slideUp_0.2s_ease]`}
            style={{ animation: 'slideUp 0.2s ease' }}
          >
            {ICONS[t.type]}
            <span className="text-[12.5px] text-[#F1F5FC] flex-1 leading-snug">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="text-[#73839E] hover:text-[#A3B2C9] mt-0.5">
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
      <style>{`@keyframes slideUp { from { transform:translateY(10px); opacity:0 } to { transform:translateY(0); opacity:1 } }`}</style>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
