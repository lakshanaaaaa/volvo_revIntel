export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-16 px-6">
      {icon && <div className="text-4xl opacity-30 mb-3">{icon}</div>}
      <h3 className="text-[14px] font-medium text-[#A3B2C9] mb-1.5">{title}</h3>
      {description && <p className="text-[12px] text-[#73839E] mb-4">{description}</p>}
      {action}
    </div>
  );
}

export function Spinner({ size = 'md' }) {
  const s = size === 'sm' ? 'w-4 h-4 border-2' : size === 'lg' ? 'w-8 h-8 border-3' : 'w-6 h-6 border-2';
  return (
    <div className={`${s} border-[#1E3050] border-t-[#5B8CFF] rounded-full animate-spin`} />
  );
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  );
}
