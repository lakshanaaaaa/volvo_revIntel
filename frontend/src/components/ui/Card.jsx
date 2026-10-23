export function Card({ children, className = '' }) {
  return (
    <div className={`bg-[#101C30] border border-[#1E3050] rounded-[10px] p-5 ${className}`}>
      {children}
    </div>
  );
}

export function KpiCard({ label, value, sub, accent = false, children }) {
  return (
    <div className={`relative bg-[#101C30] border border-[#1E3050] rounded-[10px] p-[18px] overflow-hidden`}>
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#4070E0] to-transparent opacity-50" />
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.7px] text-[#73839E] mb-2">{label}</div>
      <div className="text-[24px] font-bold text-[#F1F5FC] leading-tight tracking-tight">{value}</div>
      {sub && <div className="text-[11px] text-[#73839E] mt-1.5">{sub}</div>}
      {children}
    </div>
  );
}

export function SectionHeader({ title, sub, children }) {
  return (
    <div className="flex items-center justify-between mb-3.5">
      <div>
        <div className="text-[14px] font-semibold text-[#F1F5FC]">{title}</div>
        {sub && <div className="text-[11px] text-[#73839E] mt-0.5">{sub}</div>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
