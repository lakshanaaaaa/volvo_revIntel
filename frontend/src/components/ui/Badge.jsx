import { routeColor } from '../../lib/utils';

const VARIANT = {
  green:  'bg-green-500/10 text-green-300 border border-green-500/20',
  blue:   'bg-blue-500/10 text-blue-300 border border-blue-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20',
  red:    'bg-red-500/10 text-red-300 border border-red-500/20',
  purple: 'bg-purple-500/10 text-purple-300 border border-purple-500/20',
  orange: 'bg-orange-500/10 text-orange-300 border border-orange-500/20',
  gray:   'bg-slate-500/10 text-slate-400 border border-slate-500/20',
  teal:   'bg-teal-500/10 text-teal-300 border border-teal-500/20',
};

export function Badge({ children, variant = 'gray', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10.5px] font-medium rounded px-[7px] py-[2px] whitespace-nowrap ${VARIANT[variant] || VARIANT.gray} ${className}`}>
      {children}
    </span>
  );
}

export function RouteBadge({ route }) {
  return (
    <span className={`inline-flex items-center text-[10.5px] font-medium rounded px-[7px] py-[2px] whitespace-nowrap ${routeColor(route)}`}>
      {route}
    </span>
  );
}

export function SourceBadge({ type }) {
  return (
    <Badge variant={type === 'call' ? 'blue' : 'green'}>
      {type}
    </Badge>
  );
}

export function ManualBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold rounded px-[7px] py-[2px] bg-yellow-500/10 text-yellow-300 border border-yellow-500/30">
      ★ Manual Override
    </span>
  );
}
