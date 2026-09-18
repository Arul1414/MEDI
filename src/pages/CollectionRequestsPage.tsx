import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CollectionRequest, WasteCategory, MobileUnit } from '../types';
import {
  ClipboardList,
  Plus,
  Filter,
  Search,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Play,
  ArrowRight,
  Eye,
  Check,
} from 'lucide-react';

export const CollectionRequestsPage: React.FC = () => {
  const {
    collectionRequests,
    mobileUnits,
    createCollectionRequest,
    assignMobileUnit,
    startCollection,
    markCollected,
    completeRequest,
    cancelRequest,
    selectedRequest,
    setSelectedRequest,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [targetRequestForAssign, setTargetRequestForAssign] = useState<CollectionRequest | null>(null);
  const [selectedUnitToAssign, setSelectedUnitToAssign] = useState<string>('');

  // New Request Form State
  const [newDepartment, setNewDepartment] = useState('Emergency');
  const [newCategory, setNewCategory] = useState<WasteCategory | 'UNKNOWN'>('INFECTIOUS_SOFT');
  const [newQuantityKg, setNewQuantityKg] = useState('6.5');
  const [newPriority, setNewPriority] = useState<CollectionRequest['priority']>('HIGH');
  const [newDate, setNewDate] = useState('2026-09-11');
  const [newTime, setNewTime] = useState('11:00');
  const [newNotes, setNewNotes] = useState('Urgent surgical soft waste packaging requiring pickup.');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = createCollectionRequest({
      department: newDepartment,
      category: newCategory === 'UNKNOWN' ? undefined : (newCategory as WasteCategory),
      estimatedQuantityKg: parseFloat(newQuantityKg) || 5.0,
      priority: newPriority,
      requestedDate: newDate,
      requestedTime: newTime,
      notes: newNotes,
    });
    setCreateModalOpen(false);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetRequestForAssign && selectedUnitToAssign) {
      assignMobileUnit(targetRequestForAssign.id, selectedUnitToAssign);
      setAssignModalOpen(false);
      setTargetRequestForAssign(null);
      setSelectedUnitToAssign('');
    }
  };

  // Filter pipeline
  const filteredRequests = collectionRequests.filter((req) => {
    if (activeTab !== 'ALL' && req.status !== activeTab) return false;
    if (deptFilter !== 'ALL' && req.department !== deptFilter) return false;
    if (priorityFilter !== 'ALL' && req.priority !== priorityFilter) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return (
        req.id.toLowerCase().includes(q) ||
        req.department.toLowerCase().includes(q) ||
        req.notes.toLowerCase().includes(q) ||
        (req.category && req.category.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Header and Controls with Royal Violet Module Identity */}
      <div className="bg-gradient-to-r from-violet-50 via-purple-50/50 to-indigo-50 border border-violet-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-violet-700">
              Operations • Royal Violet Module
            </span>
            <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200 text-[10px] font-mono font-semibold">
              {collectionRequests.length} Total Requests
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ClipboardList className="w-6 h-6 text-violet-600" />
            Collection Requests
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            Dispatch mobile collection units to hospital wards and manage pickup request lifecycles.
          </p>
        </div>

        <button
          id="btn-new-collection-request"
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-violet-600/20 transition-all self-start sm:self-auto cursor-pointer hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection Request</span>
        </button>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="bg-white border border-violet-200/70 rounded-2xl p-4 shadow-2xs space-y-3">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-violet-100 pb-3">
          {['ALL', 'PENDING', 'ASSIGNED', 'COLLECTING', 'COLLECTED', 'COMPLETED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-violet-600 text-white font-bold shadow-2xs'
                  : 'bg-violet-50/70 text-violet-800 hover:text-violet-950 hover:bg-violet-100 border border-violet-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Secondary Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search request ID, notes, ward..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Emergency">Emergency</option>
              <option value="Operation Theatre">Operation Theatre</option>
              <option value="ICU">ICU</option>
              <option value="Pathology Lab">Pathology Lab</option>
              <option value="Ward A">Ward A</option>
              <option value="Ward B">Ward B</option>
              <option value="Pediatric Ward">Pediatric Ward</option>
              <option value="Oncology">Oncology</option>
              <option value="Dialysis Unit">Dialysis Unit</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">URGENT</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                <th className="py-3 px-4 font-semibold">REQUEST ID</th>
                <th className="py-3 px-4 font-semibold">DEPARTMENT</th>
                <th className="py-3 px-4 font-semibold">EST. WEIGHT</th>
                <th className="py-3 px-4 font-semibold">PRIORITY</th>
                <th className="py-3 px-4 font-semibold">ASSIGNED UNIT</th>
                <th className="py-3 px-4 font-semibold">STATUS</th>
                <th className="py-3 px-4 font-semibold">SCHEDULE</th>
                <th className="py-3 px-4 font-semibold text-right">WORKFLOW ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500 text-xs">
                    No collection requests found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-700">{req.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{req.department}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[160px]">{req.notes}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 font-medium">
                      {(req.estimatedQuantityKg ?? 0).toFixed(1)} kg
                      {req.category && (
                        <div className="text-[10px] text-slate-500">{req.category}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          req.priority === 'URGENT'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : req.priority === 'HIGH'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : req.priority === 'MEDIUM'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {req.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {req.assignedUnitId ? (
                        <span className="inline-flex items-center gap-1 font-mono font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[11px]">
                          <Truck className="w-3 h-3 text-indigo-600" />
                          {req.assignedUnitId}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                          req.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : req.status === 'COLLECTING'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200 animate-pulse'
                            : req.status === 'ASSIGNED'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : req.status === 'CANCELLED'
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      <div>{req.requestedDate}</div>
                      <div className="text-slate-400">{req.requestedTime}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Action Progression */}
                        {req.status === 'PENDING' && (
                          <button
                            onClick={() => {
                              setTargetRequestForAssign(req);
                              setAssignModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Truck className="w-3 h-3" /> Assign Unit
                          </button>
                        )}

                        {req.status === 'ASSIGNED' && (
                          <button
                            onClick={() => startCollection(req.id)}
                            className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Play className="w-3 h-3" /> Start Collection
                          </button>
                        )}

                        {req.status === 'COLLECTING' && (
                          <button
                            onClick={() => markCollected(req.id)}
                            className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Mark Collected
                          </button>
                        )}

                        {req.status === 'COLLECTED' && (
                          <button
                            onClick={() => completeRequest(req.id)}
                            className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Check className="w-3 h-3" /> Complete
                          </button>
                        )}

                        {req.status !== 'COMPLETED' && req.status !== 'CANCELLED' && (
                          <button
                            onClick={() => cancelRequest(req.id, 'Cancelled via Request Manager')}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Cancel Request"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Collection Request */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">Create New Waste Collection Request</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department / Ward
                  </label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="Operation Theatre">Operation Theatre</option>
                    <option value="ICU">ICU</option>
                    <option value="Pathology Lab">Pathology Lab</option>
                    <option value="Ward A">Ward A</option>
                    <option value="Ward B">Ward B</option>
                    <option value="Pediatric Ward">Pediatric Ward</option>
                    <option value="Oncology">Oncology</option>
                    <option value="Dialysis Unit">Dialysis Unit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated Quantity (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="50"
                    value={newQuantityKg}
                    onChange={(e) => setNewQuantityKg(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expected Category (Optional)
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  >
                    <option value="UNKNOWN">Unknown / Mixed</option>
                    <option value="INFECTIOUS_SOFT">Infectious Soft (Yellow)</option>
                    <option value="SHARPS">Sharps (Red/White)</option>
                    <option value="PHARMACEUTICAL">Pharmaceutical (Blue)</option>
                    <option value="GENERAL">General Waste (Black/Green)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  >
                    <option value="URGENT">URGENT (Immediate Biohazard)</option>
                    <option value="HIGH">HIGH Priority</option>
                    <option value="MEDIUM">MEDIUM Priority</option>
                    <option value="LOW">LOW Routine</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clinical Notes / Special Handling Instructions
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Suture needles, double-bagged biohazard gauze..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                Created by: <span className="text-slate-900 font-semibold">{currentUser.name}</span> ({currentUser.role})
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Mobile Unit */}
      {assignModalOpen && targetRequestForAssign && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Assign Unit to {targetRequestForAssign.id}
                </h3>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-700">
                <div><strong>Destination:</strong> {targetRequestForAssign.department}</div>
                <div><strong>Estimated Load:</strong> {targetRequestForAssign.estimatedQuantityKg} kg</div>
                <div><strong>Priority:</strong> {targetRequestForAssign.priority}</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Mobile Unit
                </label>
                <div className="space-y-2">
                  {mobileUnits.map((u) => {
                    return (
                      <label
                        key={u.id}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedUnitToAssign === u.id
                            ? 'bg-sky-50 border-sky-500 ring-1 ring-sky-300'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="mobileUnit"
                            value={u.id}
                            checked={selectedUnitToAssign === u.id}
                            onChange={(e) => setSelectedUnitToAssign(e.target.value)}
                            className="text-sky-600 focus:ring-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{u.name} ({u.id})</div>
                            <div className="text-[11px] text-slate-500">
                              Location: {u.currentDepartment} • Status: {u.status}
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-xs font-mono">
                          <span className="text-emerald-700 font-bold">⚡ {u.batteryLevel}%</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedUnitToAssign}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs cursor-pointer"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Request Details */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Collection Ticket: {selectedRequest.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div><span className="text-slate-500">Department:</span> <strong className="text-slate-900">{selectedRequest.department}</strong></div>
                <div><span className="text-slate-500">Status:</span> <strong className="text-sky-700 font-mono">{selectedRequest.status}</strong></div>
                <div><span className="text-slate-500">Priority:</span> <strong className="text-amber-700 font-mono">{selectedRequest.priority}</strong></div>
                <div><span className="text-slate-500">Est. Weight:</span> <strong className="text-slate-900">{selectedRequest.estimatedQuantityKg} kg</strong></div>
                <div><span className="text-slate-500">Assigned Unit:</span> <strong className="text-indigo-700 font-mono">{selectedRequest.assignedUnitId || 'None'}</strong></div>
                <div><span className="text-slate-500">Requested By:</span> <strong className="text-slate-900">{selectedRequest.requestedBy}</strong></div>
              </div>

              <div>
                <span className="text-slate-500 font-semibold">Schedule:</span>
                <p className="text-slate-800 mt-0.5">{selectedRequest.requestedDate} at {selectedRequest.requestedTime}</p>
              </div>

              <div>
                <span className="text-slate-500 font-semibold">Handling Notes:</span>
                <p className="text-slate-700 mt-0.5 p-2 bg-slate-50 rounded border border-slate-200">{selectedRequest.notes}</p>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
