import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Inbox, GitBranch, FileText,
  Download, Upload, Settings, Activity
} from 'lucide-react';

const NAV_ITEMS = [
  { group: 'Overview', items: [
    { to: '/',         label: 'Overview',       icon: LayoutDashboard },
    { to: '/brief',    label: 'Manager Brief',  icon: FileText },
  ]},
  { group: 'Conversations', items: [
    { to: '/inbox',    label: 'Conversations',  icon: Inbox,      badge: 'needsReview' },
    { to: '/routing',  label: 'Routing & Review', icon: GitBranch },
  ]},
  { group: 'Workspace', items: [
    { to: '/exports',  label: 'Exports',        icon: Download },
    { to: '/import',   label: 'Data Imports',   icon: Upload },
    { to: '/settings', label: 'Data Definitions', icon: Settings },
  ]},
];

export function Sidebar({ stats }) {
  const needsReview = stats?.needsReview || 0;

  return (
    <aside className="w-[228px] shrink-0 bg-[#0B1426] border-r border-[#1E3050] flex flex-col h-screen overflow-hidden z-20">
      {/* Brand */}
      <div className="px-5 py-[18px] border-b border-[#1E3050] flex items-center gap-2.5">
        <div className="w-[30px] h-[30px] bg-[#4070E0] rounded-[7px] flex items-center justify-center shrink-0">
          <Activity size={14} color="#fff" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-bold text-[#F1F5FC] truncate">RevIntel</div>
          <div className="text-[10.5px] text-[#73839E] truncate">SpendNest · 21 Aug 2026</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2.5 overflow-y-auto" aria-label="Main navigation">
        {NAV_ITEMS.map(group => (
          <div key={group.group}>
            <div className="px-5 pt-3.5 pb-1 text-[10px] font-semibold uppercase tracking-[1px] text-[#73839E]">
              {group.group}
            </div>
            {group.items.map(item => (
              <SidebarLink
                key={item.to}
                {...item}
                badge={item.badge === 'needsReview' ? needsReview : 0}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3.5 border-t border-[#1E3050]">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${stats?.total > 0 ? 'bg-[#35C995]' : 'bg-[#73839E]'}`} />
          <span className="text-[11px] text-[#73839E]">
            {stats?.total > 0 ? `${stats.total} records loaded` : 'No data loaded'}
          </span>
        </div>
        <div className="text-[10px] text-[#73839E] leading-relaxed">
          21 Aug 2026 · IST<br />
          {stats?.withTranscript || 0} / {stats?.total || 0} transcripts
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ to, label, icon: Icon, badge }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-5 py-2 text-[13px] font-[450] border-l-2 transition-colors duration-150 ${
          isActive
            ? 'text-[#5B8CFF] bg-[rgba(91,140,255,0.08)] border-l-[#5B8CFF] font-[500]'
            : 'text-[#73839E] border-l-transparent hover:text-[#A3B2C9] hover:bg-[#101C30]'
        }`
      }
    >
      <span className="w-[18px] h-[18px] flex items-center justify-center shrink-0 opacity-75">
        <Icon size={15} />
      </span>
      <span className="flex-1 truncate">{label}</span>
      {badge > 0 && (
        <span className="text-[10px] font-semibold bg-[#4070E0] text-white rounded-full px-1.5 py-px min-w-[18px] text-center">
          {badge}
        </span>
      )}
    </NavLink>
  );
}
