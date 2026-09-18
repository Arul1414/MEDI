import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Radio,
  Pause,
  Menu,
  Check,
  ArrowLeft,
  FileText,
  ExternalLink,
  Maximize,
  Minimize,
  Palette,
} from 'lucide-react';

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
  setSearchModalOpen: (open: boolean) => void;
}

const MODULE_COLOR_MAP: Record<string, { label: string; color: string; badge: string; dot: string }> = {
  dashboard: { label: 'Dashboard', color: 'Sky Blue', badge: 'bg-sky-100 text-sky-800 border-sky-300', dot: 'bg-sky-500' },
  requests: { label: 'Collection Requests', color: 'Royal Violet', badge: 'bg-violet-100 text-violet-800 border-violet-300', dot: 'bg-violet-500' },
  'ai-classification': { label: 'AI Classification', color: 'Electric Purple', badge: 'bg-purple-100 text-purple-800 border-purple-300', dot: 'bg-purple-500' },
  segregation: { label: 'Segregation Vaults', color: 'Golden Yellow', badge: 'bg-amber-100 text-amber-900 border-amber-300', dot: 'bg-amber-500' },
  'mobile-units': { label: 'Mobile Fleet', color: 'Cyber Cyan', badge: 'bg-cyan-100 text-cyan-800 border-cyan-300', dot: 'bg-cyan-500' },
  inventory: { label: 'Waste Inventory', color: 'Golden Amber', badge: 'bg-yellow-100 text-yellow-900 border-yellow-300', dot: 'bg-yellow-500' },
  alerts: { label: 'Safety Alerts', color: 'Coral & Gold', badge: 'bg-rose-100 text-rose-800 border-rose-300', dot: 'bg-rose-500' },
  analytics: { label: 'Analytics & Intel', color: 'Deep Indigo', badge: 'bg-indigo-100 text-indigo-800 border-indigo-300', dot: 'bg-indigo-500' },
  logs: { label: 'Activity Logs', color: 'Steel Slate', badge: 'bg-slate-200 text-slate-800 border-slate-300', dot: 'bg-slate-500' },
  assistant: { label: 'MediBot AI', color: 'Multi-Gradient', badge: 'bg-gradient-to-r from-sky-100 via-indigo-100 to-purple-100 text-purple-900 border-purple-300', dot: 'bg-gradient-to-r from-sky-500 to-purple-500' },
  users: { label: 'User Roles', color: 'Orchid Purple', badge: 'bg-purple-100 text-purple-800 border-purple-300', dot: 'bg-purple-500' },
  settings: { label: 'System Settings', color: 'Cyber Blue', badge: 'bg-blue-100 text-blue-800 border-blue-300', dot: 'bg-blue-500' },
};

export const Header: React.FC<HeaderProps> = ({ setMobileOpen, setSearchModalOpen }) => {
  const {
    alerts,
    markAlertRead,
    markAllAlertsRead,
    settings,
    updateSettings,
    currentUser,
    activePage,
    setActivePage,
    goBack,
    canGoBack,
    generateAuditReport,
  } = useApp();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const unreadAlerts = alerts.filter((a) => !a.read);

  // Monitor fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.log('Fullscreen request notice:', err);
    }
  };

  const currentModuleTheme = MODULE_COLOR_MAP[activePage] || MODULE_COLOR_MAP.dashboard;

  return (
    <header
      id="app-header"
      className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs"
    >
      {/* Left section: Back button, Hamburger & Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl">
        {/* Universal "Back" Feature to Come Back */}
        {canGoBack && (
          <button
            id="header-back-button"
            onClick={goBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs border border-sky-200 transition-all cursor-pointer shrink-0"
            title="Go back to previous screen"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Back</span>
          </button>
        )}

        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div
          onClick={() => setSearchModalOpen(true)}
          className="relative w-full cursor-pointer group"
        >
          <div className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 group-hover:border-slate-300 text-slate-500 text-xs transition-colors">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600" />
            <span className="flex-1 truncate">
              Search by Waste ID, Request, Unit, Ward...
            </span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white text-slate-500 rounded border border-slate-200">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Section: Official Audit Report, Status, Simulation Toggle, Notifications, Role */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Module Color Signature Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs shadow-2xs">
          <Palette className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] text-slate-500 font-medium">Theme:</span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${currentModuleTheme.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${currentModuleTheme.dot}`} />
            {currentModuleTheme.color}
          </span>
        </div>

        {/* Full Screen Mode Toggle Button */}
        <button
          id="fullscreen-toggle-btn"
          onClick={toggleFullScreen}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            isFullscreen
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
          }`}
          title={isFullscreen ? 'Exit Full Screen Mode' : 'Enter Full Screen Mode'}
        >
          {isFullscreen ? (
            <>
              <Minimize className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Exit Fullscreen</span>
            </>
          ) : (
            <>
              <Maximize className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Fullscreen</span>
            </>
          )}
        </button>

        {/* Generate Official Audit Report Button */}
        <button
          id="header-generate-audit-btn"
          onClick={generateAuditReport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-600/15 transition-all cursor-pointer shrink-0"
          title="Generate Official Biomedical Audit Report Document"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Official Audit Report</span>
          <span className="md:hidden">Audit</span>
        </button>

        {/* System Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold tracking-wide text-[10px]">OPERATIONAL</span>
        </div>

        {/* Simulation Mode Toggle */}
        <button
          onClick={() => updateSettings({ simulationActive: !settings.simulationActive })}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${
            settings.simulationActive
              ? 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'
              : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
          }`}
          title={settings.simulationActive ? 'Click to pause simulated data stream' : 'Click to activate simulation'}
        >
          {settings.simulationActive ? (
            <>
              <Radio className="w-3.5 h-3.5 text-sky-600 animate-spin" />
              <span className="hidden xl:inline font-semibold">SIM ON</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden xl:inline">SIM OFF</span>
            </>
          )}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            id="notification-bell-btn"
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {notificationOpen && (
            <div
              id="notification-popup-panel"
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-900">System Alerts & Notifications</span>
                  <span className="px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] rounded font-mono font-medium">
                    {unreadAlerts.length} Unread
                  </span>
                </div>
                {unreadAlerts.length > 0 && (
                  <button
                    onClick={markAllAlertsRead}
                    className="text-[11px] text-sky-600 hover:text-sky-800 transition-colors font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                {alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 text-xs transition-colors hover:bg-slate-50 ${
                      !alert.read ? 'bg-sky-50/40' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span
                        className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : alert.severity === 'WARNING'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}
                      >
                        {alert.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{alert.timestamp}</span>
                    </div>
                    <p className="text-slate-800 text-xs mb-1.5">{alert.message}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Source: {alert.sourceModule}</span>
                      {!alert.read && (
                        <button
                          onClick={() => markAlertRead(alert.id)}
                          className="text-sky-600 hover:text-sky-800 flex items-center gap-1 font-medium cursor-pointer"
                        >
                          <Check className="w-3 h-3" /> Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                <button
                  onClick={() => {
                    setActivePage('alerts');
                    setNotificationOpen(false);
                  }}
                  className="text-xs text-sky-700 hover:text-sky-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  View All {alerts.length} Alerts in Command Center
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Current User Quick Badge */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-7 h-7 rounded-full object-cover border border-slate-200"
          />
          <div className="text-left">
            <div className="text-xs font-semibold text-slate-900 leading-none">{currentUser.name}</div>
            <span className="text-[10px] text-sky-700 font-mono font-bold leading-tight">{currentUser.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
