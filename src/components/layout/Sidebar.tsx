import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  PieChart,
  Bookmark,
  ShieldAlert,
  FlaskConical,
  Sparkles,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  collapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Markets', path: '/markets', icon: TrendingUp },
    { label: 'Portfolio', path: '/portfolio', icon: PieChart },
    { label: 'Watchlist', path: '/watchlist', icon: Bookmark },
    { label: 'Risk Analytics', path: '/risk', icon: ShieldAlert },
    { label: 'Strategy Lab', path: '/strategy-lab', icon: FlaskConical },
    { label: 'AI Insights', path: '/ai-insights', icon: Sparkles, highlight: true },
    { label: 'Transactions', path: '/transactions', icon: History },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <aside
      className={`h-full flex flex-col justify-between bg-[#0a0a0a] border-r border-[#313131] transition-all duration-200 z-30 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#313131]">
          <div
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Geometric Monoline Logo */}
            <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#454545] flex items-center justify-center text-[#6798ff] group-hover:border-[#6798ff] transition-colors shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-semibold text-white tracking-wider text-xs uppercase font-mono">
                  VERTEX
                </span>
                <span className="text-[10px] text-[#7c7c7c] tracking-tight truncate">
                  Capital Terminal
                </span>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1 text-[#7c7c7c] hover:text-white rounded hover:bg-[#1e1e1e] transition-colors cursor-pointer"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1">
          {navItems.map(item => {
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#1e1e1e] text-[#6798ff] border border-[#313131] shadow-xs'
                    : 'text-[#a7a7a7] hover:text-white hover:bg-[#141414]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#6798ff]'
                      : item.highlight
                      ? 'text-[#a855f7]'
                      : 'text-[#7c7c7c]'
                  }`}
                />
                {!collapsed && (
                  <span className="truncate flex-1 flex items-center justify-between">
                    <span>{item.label}</span>
                    {item.highlight && (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 bg-[#8b5cf6]/20 text-[#a855f7] border border-[#8b5cf6]/30 rounded">
                        ML
                      </span>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status & Landing preview */}
      <div className="p-3 border-t border-[#313131]">
        {!collapsed ? (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('/')}
              className="flex items-center justify-between px-2.5 py-1.5 rounded text-[11px] text-[#7c7c7c] hover:text-white hover:bg-[#141414] transition-colors cursor-pointer"
            >
              <span>Landing Overview</span>
              <ExternalLink className="w-3 h-3 text-[#7c7c7c]" />
            </button>
            <div className="px-2 py-1.5 bg-[#141414] border border-[#313131] rounded-lg flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#7c7c7c]">NSE Terminal</span>
              <span className="flex items-center gap-1.5 text-[#10b981]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                Live
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" title="NSE Live" />
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 h-full bg-[#0a0a0a] z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
