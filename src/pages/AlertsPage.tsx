import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertSeverity } from '../types';
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle2,
  Trash2,
  Filter,
  Check,
  Plus,
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { alerts, markAlertRead, markAllAlertsRead, dismissAlert, addAlert } = useApp();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [tabFilter, setTabFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const [newModalOpen, setNewModalOpen] = useState(false);

  // New alert form
  const [newType, setNewType] = useState('CONTAINER NEAR FULL');
  const [newSeverity, setNewSeverity] = useState<AlertSeverity>('WARNING');
  const [newMessage, setNewMessage] = useState('Container C reached 85% capacity in surgical corridor.');
  const [newDetails, setNewDetails] = useState('Immediate replacement bin required before next surgical round.');
  const [newSource, setNewSource] = useState('Segregation Center');

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    addAlert({
      type: newType,
      severity: newSeverity,
      message: newMessage,
      details: newDetails,
      sourceModule: newSource,
    });
    setNewModalOpen(false);
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (tabFilter === 'UNREAD' && alert.read) return false;
    if (severityFilter !== 'ALL' && alert.severity !== severityFilter) return false;
    return true;
  });

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Header with Coral Red Module Identity */}
      <div className="bg-gradient-to-r from-rose-50 via-red-50/50 to-orange-50 border border-rose-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-800">
              Safety Surveillance • Coral Red Module
            </span>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-200 text-[10px] font-mono font-semibold">
              {unreadCount} Active Warning{unreadCount === 1 ? '' : 's'}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-rose-600" />
            Alerts & Safety Escalations
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            Real-time biohazard containment warnings, capacity threshold breaches, and mobile unit telemetry alarms.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {unreadCount > 0 && (
            <button
              onClick={markAllAlertsRead}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-900 text-xs font-bold border border-rose-200 transition-colors shadow-2xs cursor-pointer"
            >
              Mark All Read ({unreadCount})
            </button>
          )}

          <button
            onClick={() => setNewModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Trigger Test Alert</span>
          </button>
        </div>
      </div>

      {/* Filters and Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTabFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              tabFilter === 'ALL'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setTabFilter('UNREAD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              tabFilter === 'UNREAD'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="WARNING">WARNING</option>
            <option value="INFO">INFO</option>
          </select>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 text-xs shadow-2xs">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
            <p className="text-slate-900 font-semibold text-sm">All Clear - No Active Alerts</p>
            <p className="text-slate-500 mt-1">All hospital waste containers and mobile units operate within nominal thresholds.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border transition-all shadow-2xs ${
                alert.severity === 'CRITICAL'
                  ? 'bg-red-50/60 border-red-300 ring-1 ring-red-200'
                  : alert.severity === 'WARNING'
                  ? 'bg-amber-50/60 border-amber-300'
                  : 'bg-white border-slate-200'
              } ${!alert.read ? 'border-l-4 border-l-sky-500' : ''}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : alert.severity === 'WARNING'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-sky-50 text-sky-700 border border-sky-200'
                    }`}
                  >
                    {alert.severity} • {alert.type}
                  </span>
                  <span className="text-slate-500 font-mono text-xs">Source: {alert.sourceModule}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono">{alert.timestamp}</span>
                  {!alert.read && (
                    <button
                      onClick={() => markAlertRead(alert.id)}
                      className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                    title="Dismiss alert"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-sm mb-1">{alert.message}</h3>
              {alert.details && (
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200 mt-2">
                  {alert.details}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal: New Alert */}
      {newModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-slate-900 text-sm">Simulate Biohazard Alert</h3>
              </div>
              <button
                onClick={() => setNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Alert Type</label>
                <input
                  type="text"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Severity Level</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as AlertSeverity)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500"
                >
                  <option value="CRITICAL">CRITICAL (Red Alarm)</option>
                  <option value="WARNING">WARNING (Amber Alert)</option>
                  <option value="INFO">INFO (Blue Notice)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Message</label>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Clinical Details</label>
                <textarea
                  rows={2}
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Source Module</label>
                <select
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500"
                >
                  <option value="Segregation Center">Segregation Center</option>
                  <option value="Mobile Units">Mobile Units</option>
                  <option value="AI Classification">AI Classification</option>
                  <option value="Collection Requests">Collection Requests</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-md shadow-rose-600/20 cursor-pointer"
                >
                  Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
