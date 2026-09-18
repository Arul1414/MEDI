import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  ClipboardList,
  Archive,
  Truck,
  Bell,
  User as UserIcon,
  ArrowRight,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const {
    collectionRequests,
    wasteRecords,
    mobileUnits,
    alerts,
    users,
    setActivePage,
    setSelectedRequest,
    setSelectedWasteRecord,
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Command+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  // Search Collections
  const matchedRequests = cleanQuery
    ? collectionRequests.filter(
        (r) =>
          r.id.toLowerCase().includes(cleanQuery) ||
          r.department.toLowerCase().includes(cleanQuery) ||
          r.notes.toLowerCase().includes(cleanQuery) ||
          (r.category && r.category.toLowerCase().includes(cleanQuery))
      )
    : [];

  // Search Waste Records
  const matchedWaste = cleanQuery
    ? wasteRecords.filter(
        (w) =>
          w.id.toLowerCase().includes(cleanQuery) ||
          w.category.toLowerCase().includes(cleanQuery) ||
          w.department.toLowerCase().includes(cleanQuery) ||
          w.containerId.toLowerCase().includes(cleanQuery)
      )
    : [];

  // Search Mobile Units
  const matchedUnits = cleanQuery
    ? mobileUnits.filter(
        (u) =>
          u.id.toLowerCase().includes(cleanQuery) ||
          u.name.toLowerCase().includes(cleanQuery) ||
          u.currentDepartment.toLowerCase().includes(cleanQuery) ||
          u.status.toLowerCase().includes(cleanQuery)
      )
    : [];

  // Search Alerts
  const matchedAlerts = cleanQuery
    ? alerts.filter(
        (a) =>
          a.message.toLowerCase().includes(cleanQuery) ||
          a.type.toLowerCase().includes(cleanQuery) ||
          a.sourceModule.toLowerCase().includes(cleanQuery)
      )
    : [];

  // Search Users
  const matchedUsers = cleanQuery
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(cleanQuery) ||
          u.department.toLowerCase().includes(cleanQuery) ||
          u.role.toLowerCase().includes(cleanQuery)
      )
    : [];

  const totalMatches =
    matchedRequests.length +
    matchedWaste.length +
    matchedUnits.length +
    matchedAlerts.length +
    matchedUsers.length;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-sky-600 shrink-0" />
          <input
            type="text"
            placeholder="Search Waste ID (WR-...), Request (CR-...), Unit (MEDI-...), Dept, Alert, User..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 border border-slate-200 rounded font-mono cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100 custom-scrollbar space-y-4 bg-slate-50/50">
          {!cleanQuery ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p>Type keywords to search across all hospital waste modules.</p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                <button
                  onClick={() => setQuery('CR-1024')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-sky-700 text-[11px] hover:bg-slate-100 font-medium cursor-pointer shadow-2xs"
                >
                  CR-1024
                </button>
                <button
                  onClick={() => setQuery('SHARPS')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-amber-700 text-[11px] hover:bg-slate-100 font-medium cursor-pointer shadow-2xs"
                >
                  SHARPS
                </button>
                <button
                  onClick={() => setQuery('Emergency')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-violet-700 text-[11px] hover:bg-slate-100 font-medium cursor-pointer shadow-2xs"
                >
                  Emergency
                </button>
                <button
                  onClick={() => setQuery('MEDI-01')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-sky-700 text-[11px] hover:bg-slate-100 font-medium cursor-pointer shadow-2xs"
                >
                  MEDI-01
                </button>
              </div>
            </div>
          ) : totalMatches === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No results found matching "<span className="text-slate-800 font-medium">{query}</span>".
            </div>
          ) : (
            <>
              {/* Collection Requests Group */}
              {matchedRequests.length > 0 && (
                <div className="pt-2 first:pt-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    <ClipboardList className="w-3.5 h-3.5 text-sky-600" />
                    Collection Requests ({matchedRequests.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedRequests.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => {
                          setSelectedRequest(r);
                          setActivePage('requests');
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer flex items-center justify-between text-xs transition-colors shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sky-700">{r.id}</span>
                            <span className="text-slate-900 font-semibold">{r.department}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-100 text-slate-600 font-medium">
                              {r.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{r.notes}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Waste Records Group */}
              {matchedWaste.length > 0 && (
                <div className="pt-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    <Archive className="w-3.5 h-3.5 text-amber-600" />
                    Waste Inventory Records ({matchedWaste.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedWaste.map((w) => (
                      <div
                        key={w.id}
                        onClick={() => {
                          setSelectedWasteRecord(w);
                          setActivePage('inventory');
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer flex items-center justify-between text-xs transition-colors shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-700">{w.id}</span>
                            <span className="text-slate-900 font-semibold">{w.category}</span>
                            <span className="text-sky-700 font-mono font-bold">{w.weightKg} kg</span>
                            <span className="text-slate-500 text-[11px]">({w.containerId})</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{w.department} • {w.date} {w.time}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Units Group */}
              {matchedUnits.length > 0 && (
                <div className="pt-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    <Truck className="w-3.5 h-3.5 text-violet-600" />
                    Mobile Units ({matchedUnits.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedUnits.map((u) => (
                      <div
                        key={u.id}
                        onClick={() => {
                          setActivePage('mobile-units');
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer flex items-center justify-between text-xs transition-colors shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-violet-700">{u.id}</span>
                            <span className="text-slate-900 font-bold">{u.name}</span>
                            <span className="text-xs text-amber-700 font-mono font-semibold">⚡{u.batteryLevel}%</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{u.currentDepartment} • {u.currentTask}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Alerts Group */}
              {matchedAlerts.length > 0 && (
                <div className="pt-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    <Bell className="w-3.5 h-3.5 text-amber-600" />
                    Alerts & Warnings ({matchedAlerts.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedAlerts.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          setActivePage('alerts');
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer flex items-center justify-between text-xs transition-colors shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              {a.type}
                            </span>
                            <span className="text-slate-800 font-medium">{a.message}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{a.sourceModule} • {a.timestamp}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users Group */}
              {matchedUsers.length > 0 && (
                <div className="pt-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    <UserIcon className="w-3.5 h-3.5 text-purple-600" />
                    Hospital Users ({matchedUsers.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedUsers.map((u) => (
                      <div
                        key={u.id}
                        onClick={() => {
                          setActivePage('users');
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer flex items-center justify-between text-xs transition-colors shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                          <div>
                            <span className="font-bold text-slate-900 mr-2">{u.name}</span>
                            <span className="text-purple-700 font-mono text-[10px] font-semibold">[{u.role}]</span>
                            <span className="text-slate-500 ml-2">{u.department}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
