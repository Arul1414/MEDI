import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Scale,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  BrainCircuit,
  ArrowUpRight,
  ChevronRight,
  Zap,
  Activity,
  Boxes,
  FileText,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    collectionRequests,
    wasteRecords,
    mobileUnits,
    containers,
    alerts,
    setActivePage,
    setSelectedRequest,
    generateAuditReport,
  } = useApp();

  // Calculate KPIs
  const totalWasteKg = wasteRecords.reduce((acc, curr) => acc + (curr.weightKg || 0), 0);
  const todayCollectionsCount = wasteRecords.filter((w) => w.date === '2026-09-11').length + 22; // historical simulated
  const pendingRequestsCount = collectionRequests.filter(
    (r) => r.status === 'PENDING' || r.status === 'ASSIGNED'
  ).length;
  const activeUnitsCount = mobileUnits.filter(
    (u) => u.status === 'COLLECTING' || u.status === 'ASSIGNED' || u.status === 'RETURNING'
  ).length;
  const fullContainersCount = containers.filter((c) => c.capacityPercent >= 80).length;
  const totalAIClassifications = wasteRecords.length + 166; // simulated total verified AI runs

  // Category Distribution math
  const catTotals = {
    GENERAL: wasteRecords.filter((w) => w.category === 'GENERAL').reduce((a, b) => a + (b.weightKg || 0), 0),
    INFECTIOUS_SOFT: wasteRecords.filter((w) => w.category === 'INFECTIOUS_SOFT').reduce((a, b) => a + (b.weightKg || 0), 0),
    SHARPS: wasteRecords.filter((w) => w.category === 'SHARPS').reduce((a, b) => a + (b.weightKg || 0), 0),
    PHARMACEUTICAL: wasteRecords.filter((w) => w.category === 'PHARMACEUTICAL').reduce((a, b) => a + (b.weightKg || 0), 0),
  };
  const catSum = Math.max(1, catTotals.GENERAL + catTotals.INFECTIOUS_SOFT + catTotals.SHARPS + catTotals.PHARMACEUTICAL);

  // 7-day activity mock points for clean SVG chart
  const weeklyData = [
    { day: 'Mon', kg: 88.4 },
    { day: 'Tue', kg: 104.2 },
    { day: 'Wed', kg: 95.8 },
    { day: 'Thu', kg: 122.1 },
    { day: 'Fri', kg: 115.6 },
    { day: 'Sat', kg: 76.3 },
    { day: 'Today', kg: totalWasteKg },
  ];
  const maxKg = Math.max(...weeklyData.map((d) => d.kg)) * 1.15;

  return (
    <div className="space-y-6 pb-12 bg-slate-50 text-slate-800">
      {/* Welcome & Command Center Header Banner */}
      <div className="bg-gradient-to-r from-sky-50 via-indigo-50/40 to-blue-50 border border-sky-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-700">
                Hospital Command Center • Sky Blue Module
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SYSTEM STATUS: OPERATIONAL
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Medi-Sort Operations Telemetry
            </h1>
            <p className="text-slate-600 text-xs mt-1 max-w-2xl">
              Autonomous mobile waste-collection dispatch, optical neural classification, and digital container
              segregation for hospital infection prevention.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Generate Official Audit Report Button */}
            <button
              id="dashboard-generate-audit-btn"
              onClick={generateAuditReport}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/15 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Generate Official Audit Report</span>
            </button>

            <button
              onClick={() => setActivePage('ai-classification')}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-600/15 transition-all cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Scan Waste Image</span>
            </button>
            <button
              onClick={() => setActivePage('requests')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-violet-50 text-violet-800 border border-violet-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <span>+ New Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 6 KPI Cards with Rich Individual Color Palettes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* KPI 1: Total Waste - Sky Blue */}
        <div className="bg-gradient-to-br from-sky-50/90 to-white border border-sky-200 rounded-xl p-3.5 shadow-xs hover:border-sky-300 transition-colors">
          <div className="flex items-center justify-between text-sky-800 text-xs mb-1.5 font-medium">
            <span>Total Waste</span>
            <Scale className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
            {(totalWasteKg ?? 0).toFixed(1)} <span className="text-xs font-normal text-slate-500">kg</span>
          </div>
          <div className="text-[11px] text-sky-700 flex items-center gap-1 mt-1 font-mono font-medium">
            <ArrowUpRight className="w-3 h-3 text-sky-600" /> +12.4% vs yesterday
          </div>
        </div>

        {/* KPI 2: Today's Pickups - Royal Violet */}
        <div className="bg-gradient-to-br from-violet-50/90 to-white border border-violet-200 rounded-xl p-3.5 shadow-xs hover:border-violet-300 transition-colors">
          <div className="flex items-center justify-between text-violet-800 text-xs mb-1.5 font-medium">
            <span>Today's Pickups</span>
            <CheckCircle2 className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
            {todayCollectionsCount}
          </div>
          <div className="text-[11px] text-violet-700 mt-1 font-medium">
            Across 9 clinical wards
          </div>
        </div>

        {/* KPI 3: Pending Requests - Golden Amber */}
        <div className="bg-gradient-to-br from-amber-50/90 to-white border border-amber-200 rounded-xl p-3.5 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-amber-800 text-xs mb-1.5 font-medium">
            <span>Pending Requests</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-900 tracking-tight">
            {pendingRequestsCount}
          </div>
          <div className="text-[11px] text-amber-800 mt-1 font-medium">
            2 Urgent triage requests
          </div>
        </div>

        {/* KPI 4: Active Mobile Units - Cyber Cyan */}
        <div className="bg-gradient-to-br from-cyan-50/90 to-white border border-cyan-200 rounded-xl p-3.5 shadow-xs hover:border-cyan-300 transition-colors">
          <div className="flex items-center justify-between text-cyan-800 text-xs mb-1.5 font-medium">
            <span>Active Fleet</span>
            <Truck className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
            {activeUnitsCount} <span className="text-xs font-normal text-slate-500">/ 4</span>
          </div>
          <div className="text-[11px] text-cyan-700 mt-1 font-medium">
            MEDI-01, 02 in transit
          </div>
        </div>

        {/* KPI 5: Full/Near Containers - Golden Yellow */}
        <div className="bg-gradient-to-br from-yellow-50/90 to-white border border-yellow-200 rounded-xl p-3.5 shadow-xs hover:border-yellow-300 transition-colors">
          <div className="flex items-center justify-between text-yellow-900 text-xs mb-1.5 font-medium">
            <span>Near Full Vaults</span>
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-yellow-900 tracking-tight">
            {fullContainersCount}
          </div>
          <div className="text-[11px] text-yellow-800 mt-1 font-medium">
            Container C at 91%
          </div>
        </div>

        {/* KPI 6: AI Classifications - Electric Purple */}
        <div className="bg-gradient-to-br from-purple-50/90 to-white border border-purple-200 rounded-xl p-3.5 shadow-xs hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between text-purple-800 text-xs mb-1.5 font-medium">
            <span>AI Scans Run</span>
            <BrainCircuit className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
            {totalAIClassifications}
          </div>
          <div className="text-[11px] text-purple-800 mt-1 font-medium">
            98.4% optical confidence
          </div>
        </div>
      </div>

      {/* Row 2: Charts & Container Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* A. Collection Activity Chart (7 Columns) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-600" />
                Collection Activity Trends (7-Day Weight)
              </h2>
              <p className="text-xs text-slate-500">Total medical waste collected per diurnal cycle (kg)</p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
              Avg: 104.5 kg/day
            </span>
          </div>

          {/* SVG Bar / Line Hybrid Chart */}
          <div className="flex-1 flex items-end justify-between gap-3 pt-6 pb-2 px-2 h-52">
            {weeklyData.map((item, idx) => {
              const heightPercent = Math.min(100, Math.round((item.kg / maxKg) * 100));
              const isToday = item.day === 'Today';
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {(item.kg ?? 0).toFixed(1)}kg
                  </span>
                  <div className="w-full max-w-[38px] bg-slate-100 rounded-t-lg relative overflow-hidden flex items-end h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isToday
                          ? 'bg-gradient-to-t from-sky-600 to-sky-400 shadow-sm'
                          : 'bg-gradient-to-t from-slate-300 to-slate-400 group-hover:from-indigo-600 group-hover:to-indigo-400'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-mono ${
                      isToday ? 'text-sky-700 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* B. Waste Category Distribution Chart (5 Columns) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Boxes className="w-4 h-4 text-indigo-600" />
                Waste Category Breakdown
              </h2>
              <p className="text-xs text-slate-500">Distribution by classified biohazard stream</p>
            </div>
          </div>

          {/* Visual Category Meter */}
          <div className="space-y-3.5 my-auto">
            {/* General */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-sky-700 font-semibold">General Waste (Container A)</span>
                <span className="font-mono text-slate-700 font-medium">
                  {(catTotals.GENERAL ?? 0).toFixed(1)} kg ({Math.round(((catTotals.GENERAL ?? 0) / catSum) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${((catTotals.GENERAL ?? 0) / catSum) * 100}%` }}
                  className="h-full bg-sky-500 rounded-full"
                />
              </div>
            </div>

            {/* Infectious Soft */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-700 font-semibold">Infectious Soft (Container B)</span>
                <span className="font-mono text-slate-700 font-medium">
                  {(catTotals.INFECTIOUS_SOFT ?? 0).toFixed(1)} kg ({Math.round(((catTotals.INFECTIOUS_SOFT ?? 0) / catSum) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${((catTotals.INFECTIOUS_SOFT ?? 0) / catSum) * 100}%` }}
                  className="h-full bg-amber-500 rounded-full"
                />
              </div>
            </div>

            {/* Sharps */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-purple-700 font-semibold">Sharps Waste (Container C)</span>
                <span className="font-mono text-slate-700 font-medium">
                  {(catTotals.SHARPS ?? 0).toFixed(1)} kg ({Math.round(((catTotals.SHARPS ?? 0) / catSum) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${((catTotals.SHARPS ?? 0) / catSum) * 100}%` }}
                  className="h-full bg-purple-500 rounded-full"
                />
              </div>
            </div>

            {/* Pharmaceutical */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-indigo-700 font-semibold">Pharmaceutical (Container D)</span>
                <span className="font-mono text-slate-700 font-medium">
                  {(catTotals.PHARMACEUTICAL ?? 0).toFixed(1)} kg ({Math.round(((catTotals.PHARMACEUTICAL ?? 0) / catSum) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${((catTotals.PHARMACEUTICAL ?? 0) / catSum) * 100}%` }}
                  className="h-full bg-indigo-500 rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Biohazard safety rating: Tier-1 Compliant</span>
            <button
              onClick={() => setActivePage('segregation')}
              className="text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Segregation details <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* C. Container Capacity Overview (4 Containers) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-amber-600" />
              Virtual Container Capacity Overview
            </h2>
            <p className="text-xs text-slate-500">
              Live capacity monitoring with 80% warning threshold and 95% critical alert locking
            </p>
          </div>
          <button
            onClick={() => setActivePage('segregation')}
            className="text-xs text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1 cursor-pointer"
          >
            Open Segregation Center <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {containers.map((c) => {
            const isNearFull = c.capacityPercent >= 80 && c.capacityPercent < 95;
            const isFull = c.capacityPercent >= 95;
            return (
              <div
                key={c.id}
                className={`p-4 rounded-xl border transition-all ${
                  isFull
                    ? 'bg-red-50/50 border-red-300 ring-1 ring-red-200'
                    : isNearFull
                    ? 'bg-amber-50/50 border-amber-300'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-900">{c.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isFull
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : isNearFull
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mb-3 truncate">{c.label}</div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500">Fill Level</span>
                    <span className={isFull ? 'text-red-700 font-bold' : isNearFull ? 'text-amber-700 font-bold' : 'text-slate-800 font-semibold'}>
                      {c.capacityPercent}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      style={{ width: `${c.capacityPercent}%` }}
                      className={`h-full rounded-full ${
                        isFull ? 'bg-red-500' : isNearFull ? 'bg-amber-500' : 'bg-sky-500'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-1">
                    <span>{(c.currentWeightKg ?? 0).toFixed(1)} / {c.capacityKg} kg</span>
                    <span>{c.itemCount} items</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 4: Recent Requests & Mobile Unit Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* D. Recent Collection Requests Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600" />
                Recent Collection Requests
              </h2>
              <p className="text-xs text-slate-500">Latest ward service tickets in dispatch pipeline</p>
            </div>
            <button
              onClick={() => setActivePage('requests')}
              className="text-xs text-sky-700 hover:text-sky-900 font-semibold cursor-pointer"
            >
              View all ({collectionRequests.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                  <th className="pb-2.5 font-semibold">REQUEST ID</th>
                  <th className="pb-2.5 font-semibold">WARD/DEPT</th>
                  <th className="pb-2.5 font-semibold">PRIORITY</th>
                  <th className="pb-2.5 font-semibold">STATUS</th>
                  <th className="pb-2.5 font-semibold">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {collectionRequests.slice(0, 5).map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 font-mono font-bold text-sky-700">{req.id}</td>
                    <td className="py-2.5 text-slate-800 font-medium">{req.department}</td>
                    <td className="py-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          req.priority === 'URGENT'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : req.priority === 'HIGH'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {req.priority}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className="font-mono text-[11px] text-slate-700">{req.status}</span>
                    </td>
                    <td className="py-2.5">
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setActivePage('requests');
                        }}
                        className="text-sky-700 hover:text-sky-900 font-semibold text-[11px] cursor-pointer"
                      >
                        Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* G. Mobile Unit Status Cards (5 Columns) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600" />
                Mobile Fleet Status (Simulated)
              </h2>
              <p className="text-xs text-slate-500">Autonomous corridor transit units</p>
            </div>
            <button
              onClick={() => setActivePage('mobile-units')}
              className="text-xs text-sky-700 hover:text-sky-900 font-semibold cursor-pointer"
            >
              Floor Map →
            </button>
          </div>

          <div className="space-y-2.5">
            {mobileUnits.map((unit) => (
              <div
                key={unit.id}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center font-mono font-bold text-[11px]">
                    {unit.id.slice(-2)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <span>{unit.id}</span>
                      <span className="text-[10px] text-slate-500 font-normal">({unit.currentDepartment})</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{unit.currentTask}</p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      unit.status === 'COLLECTING'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : unit.status === 'RETURNING'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {unit.status}
                  </span>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-end gap-1 font-semibold">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>{(unit.batteryLevel ?? 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 text-center">
            <span className="text-[11px] text-slate-500">
              Corridor Collision Avoidance: <strong className="text-emerald-700">ACTIVE</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Row 5: Recent AI Classifications & Active Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* E. Recent AI Classifications */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-600" />
                Recent AI Classifications
              </h2>
              <p className="text-xs text-slate-500">Computer vision classification log with safety verifications</p>
            </div>
            <button
              onClick={() => setActivePage('ai-classification')}
              className="text-xs text-sky-700 hover:text-sky-900 font-semibold cursor-pointer"
            >
              Test Scan →
            </button>
          </div>

          <div className="space-y-2.5">
            {wasteRecords.slice(0, 4).map((record) => (
              <div
                key={record.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-purple-700">{record.id}</span>
                    <span className="font-semibold text-slate-900">{record.category}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {record.weightKg} kg • {record.containerId}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{record.explanation}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                      (record.confidence ?? 0.8) >= 0.8
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {((record.confidence ?? 0.8) * 100).toFixed(0)}% Conf
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">{record.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* F. Active Alerts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Active Alerts & Escalations
              </h2>
              <p className="text-xs text-slate-500">Critical notifications requiring clinical environmental action</p>
            </div>
            <button
              onClick={() => setActivePage('alerts')}
              className="text-xs text-sky-700 hover:text-sky-900 font-semibold cursor-pointer"
            >
              Alerts Center →
            </button>
          </div>

          <div className="space-y-2.5">
            {alerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
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
                <p className="text-slate-800 text-xs">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
