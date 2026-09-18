import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationPage } from '../../types';
import {
  LayoutDashboard,
  ClipboardList,
  ScanLine,
  Boxes,
  Truck,
  Archive,
  Bell,
  BarChart3,
  History,
  Bot,
  Users,
  Settings,
  ShieldCheck,
  Sparkles,
  FileText,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    activePage,
    setActivePage,
    currentUser,
    switchUserRole,
    collectionRequests,
    alerts,
    settings,
    startDemoScenario,
    demoActive,
    generateAuditReport,
  } = useApp();

  const pendingRequestsCount = collectionRequests.filter(
    (r) => r.status === 'PENDING' || r.status === 'ASSIGNED'
  ).length;

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  const navItems: Array<{
    id: NavigationPage;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
    dotColor: string;
    activeStyle: string;
    iconColor: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      dotColor: 'bg-sky-500',
      activeStyle: 'bg-sky-50 text-sky-900 border-sky-300 font-bold shadow-2xs',
      iconColor: 'text-sky-600',
    },
    {
      id: 'requests',
      label: 'Collection Requests',
      icon: ClipboardList,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
      badgeColor: 'bg-violet-100 text-violet-800 border-violet-300',
      dotColor: 'bg-violet-500',
      activeStyle: 'bg-violet-50 text-violet-900 border-violet-300 font-bold shadow-2xs',
      iconColor: 'text-violet-600',
    },
    {
      id: 'ai-classification',
      label: 'AI Waste Classification',
      icon: ScanLine,
      dotColor: 'bg-purple-500',
      activeStyle: 'bg-purple-50 text-purple-900 border-purple-300 font-bold shadow-2xs',
      iconColor: 'text-purple-600',
    },
    {
      id: 'segregation',
      label: 'Segregation Center',
      icon: Boxes,
      dotColor: 'bg-amber-500',
      activeStyle: 'bg-amber-50 text-amber-950 border-amber-300 font-bold shadow-2xs',
      iconColor: 'text-amber-600',
    },
    {
      id: 'mobile-units',
      label: 'Mobile Units',
      icon: Truck,
      dotColor: 'bg-cyan-500',
      activeStyle: 'bg-cyan-50 text-cyan-900 border-cyan-300 font-bold shadow-2xs',
      iconColor: 'text-cyan-600',
    },
    {
      id: 'inventory',
      label: 'Waste Inventory',
      icon: Archive,
      dotColor: 'bg-yellow-500',
      activeStyle: 'bg-yellow-50 text-yellow-950 border-yellow-300 font-bold shadow-2xs',
      iconColor: 'text-yellow-600',
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: Bell,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      dotColor: 'bg-rose-500',
      activeStyle: 'bg-rose-50 text-rose-950 border-rose-300 font-bold shadow-2xs',
      iconColor: 'text-rose-600',
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: BarChart3,
      dotColor: 'bg-indigo-500',
      activeStyle: 'bg-indigo-50 text-indigo-900 border-indigo-300 font-bold shadow-2xs',
      iconColor: 'text-indigo-600',
    },
    {
      id: 'logs',
      label: 'Activity Logs',
      icon: History,
      dotColor: 'bg-slate-500',
      activeStyle: 'bg-slate-100 text-slate-900 border-slate-300 font-bold shadow-2xs',
      iconColor: 'text-slate-700',
    },
    {
      id: 'assistant',
      label: 'AI Assistant',
      icon: Bot,
      dotColor: 'bg-gradient-to-r from-sky-500 to-purple-500',
      activeStyle: 'bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 text-purple-950 border-purple-300 font-bold shadow-2xs',
      iconColor: 'text-purple-600',
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      dotColor: 'bg-purple-500',
      activeStyle: 'bg-purple-50 text-purple-900 border-purple-300 font-bold shadow-2xs',
      iconColor: 'text-purple-600',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      dotColor: 'bg-blue-500',
      activeStyle: 'bg-blue-50 text-blue-900 border-blue-300 font-bold shadow-2xs',
      iconColor: 'text-blue-600',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-68 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-sky-600/20 shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-slate-900 text-lg font-mono">
                  MEDI<span className="text-sky-600">-SORT</span>
                </span>
                <span className="px-1 py-0.5 text-[9px] font-semibold bg-violet-50 text-violet-700 border border-violet-200 rounded">
                  SIM
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight truncate">
                Smart Medical Waste & Segregation
              </p>
            </div>
          </div>

          {/* Quick Demo Mode Trigger Button */}
          <div className="mt-3 space-y-1.5">
            <button
              onClick={() => {
                startDemoScenario();
                setMobileOpen(false);
              }}
              className={`w-full py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                demoActive
                  ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/20'
                  : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{demoActive ? 'Demo Active (Step-by-Step)' : 'Run Guided Demo'}</span>
            </button>

            {/* Direct Official Audit Report in Sidebar */}
            <button
              id="sidebar-audit-report-btn"
              onClick={() => {
                generateAuditReport();
                setMobileOpen(false);
              }}
              className="w-full py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 text-purple-900 border border-purple-200 transition-all cursor-pointer shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-purple-700" />
              <span>Official Audit Report</span>
            </button>
          </div>
        </div>

        {/* Live Simulation Indicator */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <span
              className={`w-2 h-2 rounded-full ${
                settings.simulationActive ? 'bg-sky-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            {settings.simulationActive ? 'SIMULATION ACTIVE' : 'SIMULATION PAUSED'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono font-medium">v2.4 Academic</span>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1 custom-scrollbar bg-white">
          <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Operations & Control
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                  isActive
                    ? item.activeStyle
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${item.dotColor} ${isActive ? 'scale-125' : 'opacity-70'}`} />
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? item.iconColor : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full border shrink-0 ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Role Switcher Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5 mb-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-900 truncate">{currentUser.name}</div>
              <div className="flex items-center gap-1">
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                    currentUser.role === 'ADMIN'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : currentUser.role === 'WASTE_MANAGER'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-sky-50 text-sky-700 border border-sky-200'
                  }`}
                >
                  {currentUser.role}
                </span>
                <span className="text-[10px] text-slate-500 truncate">{currentUser.department}</span>
              </div>
            </div>
          </div>

          {/* Switch Role Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-[10px]">
            {(['ADMIN', 'WASTE_MANAGER', 'STAFF'] as const).map((role) => (
              <button
                key={role}
                onClick={() => switchUserRole(role)}
                className={`py-1 rounded text-center font-medium transition-colors cursor-pointer ${
                  currentUser.role === role
                    ? 'bg-sky-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={`Switch active view to ${role}`}
              >
                {role === 'WASTE_MANAGER' ? 'MANAGER' : role}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};
