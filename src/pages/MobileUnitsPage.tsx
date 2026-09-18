import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MobileUnit } from '../types';
import {
  Truck,
  BatteryCharging,
  Zap,
  RotateCcw,
  Navigation,
  Compass,
  MapPin,
  Radio,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const MobileUnitsPage: React.FC = () => {
  const {
    mobileUnits,
    chargeMobileUnit,
    recallMobileUnit,
    setActivePage,
    setSelectedRequest,
    collectionRequests,
  } = useApp();

  const [selectedUnit, setSelectedUnit] = useState<MobileUnit>(mobileUnits[0]);

  // Hospital floor departments with relative positions on the SVG map (0-100 scale)
  const departments = [
    { name: 'Emergency', x: 20, y: 25, color: '#f43f5e', label: 'Emergency Room' },
    { name: 'Operation Theatre', x: 20, y: 70, color: '#ec4899', label: 'OT Complex' },
    { name: 'Pathology Lab', x: 50, y: 20, color: '#a855f7', label: 'Pathology' },
    { name: 'Central Storage', x: 50, y: 50, color: '#14b8a6', label: 'Base Docking Bay' },
    { name: 'Pharmacy', x: 50, y: 80, color: '#3b82f6', label: 'Central Pharmacy' },
    { name: 'Ward A', x: 80, y: 25, color: '#10b981', label: 'Ward A (General)' },
    { name: 'Ward B', x: 80, y: 70, color: '#eab308', label: 'Ward B (Surgical)' },
  ];

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Header with Cyber Cyan Module Identity */}
      <div className="bg-gradient-to-r from-cyan-50 via-teal-50/50 to-sky-50 border border-cyan-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-800">
              Fleet Navigation • Cyber Cyan Module
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-900 text-[10px] font-mono font-bold tracking-wider">
              SIMULATION MODE • NO HARDWARE REQUIRED
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-cyan-600" />
            Mobile Units Fleet
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            Autonomous mobile waste collection transport telemetry, simulated floor coordinate vectors, and docking controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-cyan-200 shadow-2xs font-semibold">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            4 Autonomous Units Online
          </span>
        </div>
      </div>

      {/* Hospital Floor Map & Live Telemetry Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Floor Plan Map (7 Columns) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-600" />
                Simulated Hospital Level-2 Floor Map
              </h2>
              <p className="text-xs text-slate-500">Live navigation paths and corridor waypoints</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Scale: 1:100 (Digital)</span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full aspect-[4/3] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden p-4 shadow-inner">
            {/* Grid Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Simulated Corridors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Horizontal Main Spine */}
              <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="#cbd5e1" strokeWidth="20" strokeLinecap="round" />
              {/* Vertical Corridors */}
              <line x1="20%" y1="25%" x2="20%" y2="75%" stroke="#cbd5e1" strokeWidth="16" strokeLinecap="round" />
              <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="#cbd5e1" strokeWidth="16" strokeLinecap="round" />
              <line x1="80%" y1="25%" x2="80%" y2="75%" stroke="#cbd5e1" strokeWidth="16" strokeLinecap="round" />
            </svg>

            {/* Department Zones */}
            {departments.map((dept, idx) => (
              <div
                key={idx}
                style={{ left: `${dept.x}%`, top: `${dept.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/95 border border-slate-200 shadow-sm text-center pointer-events-none max-w-[115px]"
              >
                <div
                  style={{ backgroundColor: `${dept.color}20`, borderColor: `${dept.color}` }}
                  className="w-2.5 h-2.5 rounded-full mx-auto mb-1 border"
                />
                <div className="font-bold text-slate-900 text-[11px] leading-tight truncate">{dept.name}</div>
                <div className="text-[9px] text-slate-500 truncate">{dept.label}</div>
              </div>
            ))}

            {/* Mobile Units Positions on Map */}
            {mobileUnits.map((unit) => {
              const isSelected = selectedUnit.id === unit.id;
              const isMoving = unit.status === 'COLLECTING' || unit.status === 'RETURNING';

              return (
                <div
                  key={unit.id}
                  onClick={() => setSelectedUnit(unit)}
                  style={{
                    left: `${unit.coordinates.x}%`,
                    top: `${unit.coordinates.y}%`,
                    transition: 'left 1s ease-out, top 1s ease-out',
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group`}
                >
                  {/* Pulsing beacon if active */}
                  {isMoving && (
                    <span className="absolute -inset-2 rounded-full bg-sky-500/30 animate-ping pointer-events-none" />
                  )}

                  {/* Marker Pin */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shadow-md transition-transform ${
                      isSelected
                        ? 'bg-sky-600 text-white ring-4 ring-sky-300 scale-110'
                        : unit.status === 'COLLECTING'
                        ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                        : 'bg-slate-800 text-white hover:scale-105'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                  </div>

                  {/* Hover Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2.5 py-1 bg-slate-900 text-white text-[10px] rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-mono">
                    <strong>{unit.id}</strong>: {unit.status} ({unit.batteryLevel}%)
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              Purple Marker = In Transit
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              Sky Blue = Selected
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              Slate = Docked Base
            </span>
          </div>
        </div>

        {/* Selected Unit Telemetry Inspector (5 Columns) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-mono text-xs font-bold text-sky-700">
                  {selectedUnit.id} TELEMETRY
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg">{selectedUnit.name}</h3>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                  selectedUnit.status === 'COLLECTING'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : selectedUnit.status === 'RETURNING'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {selectedUnit.status}
              </span>
            </div>

            {/* Detailed Parameters Grid */}
            <div className="space-y-3">
              {/* Battery Level */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-600 font-semibold flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Simulated Battery Level
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {(selectedUnit.batteryLevel ?? 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    style={{ width: `${selectedUnit.batteryLevel}%` }}
                    className={`h-full rounded-full ${
                      selectedUnit.batteryLevel < 20
                        ? 'bg-red-500'
                        : selectedUnit.batteryLevel < 50
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>

              {/* Transit / Collection Progress */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-600 font-semibold flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-sky-600" />
                    Task Route Progress
                  </span>
                  <span className="font-mono font-bold text-sky-700 text-sm">
                    {selectedUnit.collectionProgress}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    style={{ width: `${selectedUnit.collectionProgress}%` }}
                    className="h-full bg-sky-500 rounded-full transition-all duration-300"
                  />
                </div>
              </div>

              {/* Metadata Cards */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Location</span>
                  <strong className="text-slate-900">{selectedUnit.currentDepartment}</strong>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Active Request</span>
                  <strong className="text-sky-700 font-mono">
                    {selectedUnit.assignedRequestId || 'None (Idle)'}
                  </strong>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Payload Capacity</span>
                  <strong className="text-slate-900">{selectedUnit.payloadCapacityKg} kg max</strong>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Last Activity</span>
                  <strong className="text-slate-700 font-mono">{selectedUnit.lastActivity}</strong>
                </div>
              </div>

              {/* Task Description */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-500 text-[10px] block mb-0.5">Current Mission Assignment</span>
                <p className="text-slate-700">{selectedUnit.currentTask}</p>
              </div>
            </div>
          </div>

          {/* Unit Actions */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => chargeMobileUnit(selectedUnit.id)}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" /> Fast Charge (100%)
            </button>

            <button
              onClick={() => recallMobileUnit(selectedUnit.id)}
              className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-sky-600/20 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Recall to Storage
            </button>
          </div>
        </div>
      </div>

      {/* All Fleet Units Cards Grid (Requirement 10) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mobileUnits.map((u) => {
          const isSelected = selectedUnit.id === u.id;
          return (
            <div
              key={u.id}
              onClick={() => setSelectedUnit(u)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-white border-sky-500 ring-2 ring-sky-200 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center font-mono font-bold text-xs">
                    {u.id.slice(-2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{u.name}</h4>
                    <span className="text-[10px] text-slate-500">{u.currentDepartment}</span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                    u.status === 'COLLECTING'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : u.status === 'RETURNING'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {u.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-500">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-600">Battery</span>
                  <span className="text-slate-900 font-bold">{(u.batteryLevel ?? 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    style={{ width: `${u.batteryLevel}%` }}
                    className="h-full bg-sky-500 rounded-full"
                  />
                </div>
                <div className="text-[10px] text-slate-500 truncate pt-1">{u.currentTask}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
