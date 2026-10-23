export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, className = '', type = 'button', ...props }) {
  const base = 'inline-flex items-center gap-1.5 font-medium rounded transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary:   'bg-[#4070E0] text-white hover:bg-[#5B8CFF] active:scale-[0.98]',
    secondary: 'bg-[#14233B] text-[#A3B2C9] border border-[#263854] hover:bg-[#1B2D49] hover:text-[#F1F5FC]',
    ghost:     'bg-transparent text-[#73839E] border border-[#1E3050] hover:bg-[#14233B] hover:text-[#A3B2C9]',
    danger:    'bg-red-600/20 text-red-300 border border-red-600/30 hover:bg-red-600/30',
    success:   'bg-green-600/20 text-green-300 border border-green-600/30 hover:bg-green-600/30',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-1',
    md: 'text-[12px] px-3.5 py-1.5',
    lg: 'text-[13px] px-4 py-2',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
