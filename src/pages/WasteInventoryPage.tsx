import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WasteRecord, WasteCategory } from '../types';
import {
  Archive,
  Search,
  Filter,
  Download,
  Eye,
  ArrowUpDown,
  Boxes,
  ShieldCheck,
  AlertTriangle,
  Scale,
} from 'lucide-react';

export const WasteInventoryPage: React.FC = () => {
  const { wasteRecords, selectedWasteRecord, setSelectedWasteRecord } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'date' | 'weightKg' | 'confidence'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Math totals for the 4 categories
  const generalKg = wasteRecords
    .filter((w) => w.category === 'GENERAL')
    .reduce((a, b) => a + b.weightKg, 0);
  const infectiousKg = wasteRecords
    .filter((w) => w.category === 'INFECTIOUS_SOFT')
    .reduce((a, b) => a + b.weightKg, 0);
  const sharpsKg = wasteRecords
    .filter((w) => w.category === 'SHARPS')
    .reduce((a, b) => a + b.weightKg, 0);
  const pharmaKg = wasteRecords
    .filter((w) => w.category === 'PHARMACEUTICAL')
    .reduce((a, b) => a + b.weightKg, 0);
  const grandTotalKg = generalKg + infectiousKg + sharpsKg + pharmaKg;

  // Filter & Sort
  const filteredRecords = wasteRecords
    .filter((rec) => {
      if (categoryFilter !== 'ALL' && rec.category !== categoryFilter) return false;
      if (deptFilter !== 'ALL' && rec.department !== deptFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          rec.id.toLowerCase().includes(q) ||
          rec.category.toLowerCase().includes(q) ||
          rec.department.toLowerCase().includes(q) ||
          rec.containerId.toLowerCase().includes(q) ||
          rec.collectedBy.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'weightKg') {
        comparison = a.weightKg - b.weightKg;
      } else if (sortField === 'confidence') {
        comparison = a.confidence - b.confidence;
      } else {
        comparison = `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Waste ID', 'Category', 'Department', 'Weight (kg)', 'Classification', 'Confidence', 'Container', 'Collected By', 'Date', 'Time', 'Status'];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.category,
      r.department,
      r.weightKg,
      r.classification,
      `${((r.confidence ?? 0.8) * 100).toFixed(0)}%`,
      r.containerId,
      r.collectedBy,
      r.date,
      r.time,
      r.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `medi-sort-waste-inventory-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Header with Golden Yellow Module Identity */}
      <div className="bg-gradient-to-r from-yellow-50 via-amber-50/60 to-orange-50 border border-yellow-300/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-yellow-900">
              Audit Registry • Golden Yellow Module
            </span>
            <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-900 border border-yellow-300 text-[10px] font-mono font-semibold">
              {wasteRecords.length} Verified Records
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Archive className="w-6 h-6 text-yellow-600" />
            Waste Inventory & Chain of Custody
          </h1>
          <p className="text-slate-700 text-xs mt-1">
            Clinical waste batch registry, container allocation manifests, and confidence metrics.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white border border-yellow-600 text-xs font-bold flex items-center gap-2 transition-all self-start sm:self-auto shadow-md shadow-yellow-600/20 cursor-pointer hover:scale-105 active:scale-95"
        >
          <Download className="w-4 h-4 text-yellow-100" />
          <span>Export Manifest (CSV)</span>
        </button>
      </div>

      {/* Category Totals Summary Cards with Distinct Tint Gradients */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-emerald-800 mb-1 font-semibold">
            <span>Container A (General)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {(generalKg ?? 0).toFixed(1)} <span className="text-xs text-slate-500 font-normal">kg</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">Non-hazardous paper/plastic</div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-amber-900 mb-1 font-semibold">
            <span>Container B (Infectious)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {(infectiousKg ?? 0).toFixed(1)} <span className="text-xs text-slate-500 font-normal">kg</span>
          </div>
          <div className="text-[11px] text-amber-800 mt-1">Surgical swabs & dressings</div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-white border border-rose-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-rose-900 mb-1 font-semibold">
            <span>Container C (Sharps)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {(sharpsKg ?? 0).toFixed(1)} <span className="text-xs text-slate-500 font-normal">kg</span>
          </div>
          <div className="text-[11px] text-rose-800 mt-1">Hypodermic & scalpels</div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-purple-900 mb-1 font-semibold">
            <span>Container D (Pharma)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {(pharmaKg ?? 0).toFixed(1)} <span className="text-xs text-slate-500 font-normal">kg</span>
          </div>
          <div className="text-[11px] text-purple-800 mt-1">Expired vials & chemicals</div>
        </div>
      </div>

      {/* Filters & Sorting Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[220px] relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter by Waste ID (WR-...), category, department, collector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Categories</option>
            <option value="GENERAL">General</option>
            <option value="INFECTIOUS_SOFT">Infectious Soft</option>
            <option value="SHARPS">Sharps</option>
            <option value="PHARMACEUTICAL">Pharmaceutical</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Departments</option>
            <option value="Emergency">Emergency</option>
            <option value="Operation Theatre">Operation Theatre</option>
            <option value="ICU">ICU</option>
            <option value="Pathology Lab">Pathology Lab</option>
            <option value="Ward A">Ward A</option>
            <option value="Ward B">Ward B</option>
            <option value="Pharmacy">Pharmacy</option>
          </select>

          {/* Sort Controls */}
          <button
            onClick={() => {
              if (sortField === 'date') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              else {
                setSortField('date');
                setSortOrder('desc');
              }
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1 border transition-colors cursor-pointer ${
              sortField === 'date'
                ? 'bg-sky-50 text-sky-700 border-sky-300 font-bold'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ArrowUpDown className="w-3 h-3" />
            <span>Date {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}</span>
          </button>

          <button
            onClick={() => {
              if (sortField === 'weightKg') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              else {
                setSortField('weightKg');
                setSortOrder('desc');
              }
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1 border transition-colors cursor-pointer ${
              sortField === 'weightKg'
                ? 'bg-sky-50 text-sky-700 border-sky-300 font-bold'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-3 h-3" />
            <span>Weight {sortField === 'weightKg' && (sortOrder === 'asc' ? '↑' : '↓')}</span>
          </button>
        </div>
      </div>

      {/* Waste Records Table (Requirement 11) */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                <th className="py-3 px-4 font-semibold">WASTE ID</th>
                <th className="py-3 px-4 font-semibold">CATEGORY</th>
                <th className="py-3 px-4 font-semibold">DEPARTMENT</th>
                <th className="py-3 px-4 font-semibold">WEIGHT</th>
                <th className="py-3 px-4 font-semibold">AI CONFIDENCE</th>
                <th className="py-3 px-4 font-semibold">CONTAINER</th>
                <th className="py-3 px-4 font-semibold">COLLECTOR</th>
                <th className="py-3 px-4 font-semibold">DATE/TIME</th>
                <th className="py-3 px-4 font-semibold">STATUS</th>
                <th className="py-3 px-4 font-semibold text-right">INSPECT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-slate-500 text-xs">
                    No waste inventory records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-700">{rec.id}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          rec.category === 'SHARPS'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : rec.category === 'INFECTIOUS_SOFT'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : rec.category === 'PHARMACEUTICAL'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {rec.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-900 font-medium">{rec.department}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{(rec.weightKg ?? 0).toFixed(1)} kg</td>
                    <td className="py-3 px-4 font-mono">
                      <span
                        className={
                          (rec.confidence ?? 0.8) >= 0.8 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'
                        }
                      >
                        {((rec.confidence ?? 0.8) * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-sky-700 text-[11px] font-medium">{rec.containerId}</td>
                    <td className="py-3 px-4 text-slate-600">{rec.collectedBy}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      <div>{rec.date}</div>
                      <div className="text-slate-400">{rec.time}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          rec.status === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedWasteRecord(rec)}
                        className="p-1 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-slate-100 cursor-pointer"
                        title="View Full Inspection Card"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Waste Record Details */}
      {selectedWasteRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Archive className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Clinical Waste Batch: {selectedWasteRecord.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedWasteRecord(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {selectedWasteRecord.imageUrl && (
                <div className="h-44 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                  <img
                    src={selectedWasteRecord.imageUrl}
                    alt="Inspection capture"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div><span className="text-slate-500">Category:</span> <strong className="text-slate-900 ml-1">{selectedWasteRecord.category}</strong></div>
                <div><span className="text-slate-500">Weight:</span> <strong className="text-slate-900 ml-1">{selectedWasteRecord.weightKg} kg</strong></div>
                <div><span className="text-slate-500">Assigned Container:</span> <strong className="text-sky-700 ml-1">{selectedWasteRecord.containerId}</strong></div>
                <div><span className="text-slate-500">AI Confidence:</span> <strong className="text-emerald-700 ml-1">{((selectedWasteRecord.confidence ?? 0.8) * 100).toFixed(0)}%</strong></div>
                <div><span className="text-slate-500">Origin Dept:</span> <strong className="text-slate-900 ml-1">{selectedWasteRecord.department}</strong></div>
                <div><span className="text-slate-500">Logged By:</span> <strong className="text-slate-900 ml-1">{selectedWasteRecord.collectedBy}</strong></div>
                <div><span className="text-slate-500">Risk Rating:</span> <strong className="text-red-700 ml-1">{selectedWasteRecord.riskLevel}</strong></div>
                <div><span className="text-slate-500">Timestamp:</span> <strong className="text-slate-700 ml-1 font-mono">{selectedWasteRecord.date} {selectedWasteRecord.time}</strong></div>
              </div>

              {selectedWasteRecord.explanation && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-600 font-semibold block mb-1">Optical Inspection Notes:</span>
                  <p className="text-slate-700 leading-relaxed text-[11px]">{selectedWasteRecord.explanation}</p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedWasteRecord(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
