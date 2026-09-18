import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  History,
  Search,
  Filter,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
} from 'lucide-react';

export const ActivityLogsPage: React.FC = () => {
  const { activityLogs } = useApp();

  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredLogs = activityLogs.filter((log) => {
    if (moduleFilter !== 'ALL' && log.module !== moduleFilter) return false;
    if (statusFilter !== 'ALL' && log.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        log.id.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.description.toLowerCase().includes(q) ||
        log.module.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExport = () => {
    const jsonStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medi-sort-audit-trail-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Header with Steel Slate Module Identity */}
      <div className="bg-gradient-to-r from-slate-100 via-slate-50 to-zinc-100 border border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-700">
              Audit Compliance • Steel Slate Module
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 border border-slate-300 text-[10px] font-mono font-semibold">
              SHA-256 Ledger Active
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-slate-800" />
            Activity Logs & Regulatory Audit Trail
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            Immutable chronological transaction log for hospital accreditation, clinical safety oversight, and infection control compliance.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-800 text-xs font-bold flex items-center gap-2 transition-all self-start sm:self-auto shadow-md shadow-slate-800/20 cursor-pointer hover:scale-105 active:scale-95"
        >
          <Download className="w-4 h-4 text-slate-200" />
          <span>Export Audit Trail (JSON)</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[220px] relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search action, user, log ID, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Modules</option>
            <option value="AI Classification">AI Classification</option>
            <option value="Segregation Center">Segregation Center</option>
            <option value="Mobile Units">Mobile Units</option>
            <option value="Collection Requests">Collection Requests</option>
            <option value="Users">Users</option>
            <option value="Settings">Settings</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="ERROR">ERROR</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                <th className="py-3 px-4 font-semibold">LOG ID</th>
                <th className="py-3 px-4 font-semibold">TIMESTAMP</th>
                <th className="py-3 px-4 font-semibold">USER / ACTOR</th>
                <th className="py-3 px-4 font-semibold">MODULE</th>
                <th className="py-3 px-4 font-semibold">ACTION</th>
                <th className="py-3 px-4 font-semibold">DESCRIPTION</th>
                <th className="py-3 px-4 font-semibold text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500 text-xs">
                    No activity logs found matching your query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-700">{log.id}</td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 text-slate-900 font-medium whitespace-nowrap">{log.user}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-md">{log.description}</td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : log.status === 'WARNING'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : log.status === 'ERROR'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}
                      >
                        {log.status === 'SUCCESS' && <CheckCircle2 className="w-3 h-3" />}
                        {log.status === 'WARNING' && <AlertTriangle className="w-3 h-3" />}
                        {log.status === 'ERROR' && <XCircle className="w-3 h-3" />}
                        {log.status === 'INFO' && <Info className="w-3 h-3" />}
                        <span>{log.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
