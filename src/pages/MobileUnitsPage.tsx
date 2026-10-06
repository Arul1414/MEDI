import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MobileUnit } from '../types';
import { getVehicleTheme, VEHICLE_COLORS } from '../utils/vehicleColorUtils';
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
  Play,
  Layers,
  ArrowRight,
  Activity,
  Palette,
} from 'lucide-react';

export const MobileUnitsPage: React.FC = () => {
  const {
    mobileUnits,
    chargeMobileUnit,
    recallMobileUnit,
    dispatchMobileUnit,
    setActivePage,
    setSelectedRequest,
    collectionRequests,
  } = useApp();

  const [selectedUnitId, setSelectedUnitId] = useState<string>(mobileUnits[0]?.id || 'MEDI-01');
  const selectedUnit = mobileUnits.find((u) => u.id === selectedUnitId) || mobileUnits[0];
  const [recentlyRecalledId, setRecentlyRecalledId] = useState<string | null>(null);
  const [simulationActiveId, setSimulationActiveId] = useState<string | null>(null);

  const selectedTheme = getVehicleTheme(selectedUnit.id);

  const handleRecall = (unitId: string) => {
    recallMobileUnit(unitId);
    setRecentlyRecalledId(unitId);
    setTimeout(() => {
      setRecentlyRecalledId((prev) => (prev === unitId ? null : prev));
    }, 2500);
  };

  // Helper to trigger simulated collection mission for available vehicle
  const handleSimulateMission = (unitId: string) => {
    setSimulationActiveId(unitId);
    const mockRequestId = `CR-SIM-${Math.floor(100 + Math.random() * 900)}`;
    const targetWards = ['ICU', 'Emergency Wing', 'Operation Theatre', 'Pathology Lab', 'Ward B'];
    const chosenWard = targetWards[Math.floor(Math.random() * targetWards.length)];

    if (dispatchMobileUnit) {
      dispatchMobileUnit(unitId, mockRequestId, chosenWard);
    }
    setTimeout(() => {
      setSimulationActiveId(null);
    }, 9000);
  };

  // Dynamic fleet summary statistics
  const totalVehicles = mobileUnits.length;
  const availableVehicles = mobileUnits.filter((u) => u.status === 'AVAILABLE').length;
  const activeVehicles = mobileUnits.filter((u) => u.status === 'EN_ROUTE' || u.status === 'RETURNING').length;
  const collectingVehicles = mobileUnits.filter((u) => u.status === 'COLLECTING').length;
  const chargingVehicles = mobileUnits.filter((u) => u.status === 'CHARGING').length;

  // Hospital floor departments with relative positions on the SVG map (0-100 scale)
  const departments = [
    { name: 'Emergency', x: 20, y: 20, color: '#f43f5e', label: 'Emergency Wing' },
    { name: 'ICU', x: 20, y: 48, color: '#f97316', label: 'Intensive Care Unit' },
    { name: 'Operation Theatre', x: 20, y: 75, color: '#ec4899', label: 'OT Complex' },
    { name: 'Pathology Lab', x: 50, y: 20, color: '#a855f7', label: 'Pathology Lab' },
    { name: 'Central Storage', x: 50, y: 50, color: '#14b8a6', label: 'Central Storage Dock' },
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
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-900 text-[10px] font-mono font-bold tracking-wider flex items-center gap-1.5">
              <Palette className="w-3 h-3 text-cyan-700" />
              5 INDEPENDENT VEHICLES • DISTINCT COLOR CODING
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-cyan-600" />
            Mobile Units Fleet Management
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            Autonomous medical waste-collection dispatch telemetry, real-time coordinate waypoints, and docking controls with dedicated vehicle identity colors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-cyan-200 shadow-2xs font-semibold">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            {totalVehicles} Vehicles Monitored
          </span>
        </div>
      </div>

      {/* Fleet Dashboard Summary Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Fleet</span>
            <Truck className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {totalVehicles} <span className="text-xs font-normal text-slate-500">Vehicles</span>
          </div>
          <div className="text-[11px] text-cyan-700 mt-1 font-medium">MEDI-01 to MEDI-05</div>
        </div>

        <div className="p-3.5 bg-white border border-emerald-200 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-xs text-emerald-700 mb-1 font-semibold">
            <span>Available Ready</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700">
            {availableVehicles} <span className="text-xs font-normal text-slate-500">Units</span>
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Can receive requests</div>
        </div>

        <div className="p-3.5 bg-white border border-sky-200 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-xs text-sky-700 mb-1 font-semibold">
            <span>Active In-Transit</span>
            <Navigation className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-700">
            {activeVehicles} <span className="text-xs font-normal text-slate-500">Units</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">En Route & Returning</div>
        </div>

        <div className="p-3.5 bg-white border border-purple-200 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-xs text-purple-700 mb-1 font-semibold">
            <span>Currently Collecting</span>
            <Activity className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-700">
            {collectingVehicles} <span className="text-xs font-normal text-slate-500">Units</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Loading ward waste</div>
        </div>

        <div className="p-3.5 bg-white border border-amber-200 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-xs text-amber-700 mb-1 font-semibold">
            <span>Docked Charging</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600">
            {chargingVehicles} <span className="text-xs font-normal text-slate-500">Units</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">At base station</div>
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
                Hospital Floor Map (Each MEDI with Distinct Color)
              </h2>
              <p className="text-xs text-slate-500">Every vehicle has a unique identifying color pin and coordinates</p>
            </div>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              5 Unique Color Pins
            </span>
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
              <line x1="20%" y1="20%" x2="20%" y2="75%" stroke="#cbd5e1" strokeWidth="16" strokeLinecap="round" />
              <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="#cbd5e1" strokeWidth="16" strokeLinecap="round" />
              <line x1="80%" y1="25%" x2="80%" y2="70%" stroke="#cbd5e1" strokeWidth="16" strokeLinecap="round" />
              {/* Connector Spine into ICU and Storage */}
              <line x1="20%" y1="48%" x2="50%" y2="50%" stroke="#e2e8f0" strokeWidth="8" strokeDasharray="4 4" />
            </svg>

            {/* Department Zones */}
            {departments.map((dept, idx) => (
              <div
                key={idx}
                style={{ left: `${dept.x}%`, top: `${dept.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/95 border border-slate-200 shadow-sm text-center pointer-events-none max-w-[115px] z-10"
              >
                <div
                  style={{ backgroundColor: `${dept.color}20`, borderColor: `${dept.color}` }}
                  className="w-2.5 h-2.5 rounded-full mx-auto mb-1 border"
                />
                <div className="font-bold text-slate-900 text-[11px] leading-tight truncate">{dept.name}</div>
                <div className="text-[9px] text-slate-500 truncate">{dept.label}</div>
              </div>
            ))}

            {/* All 5 Mobile Units with Individual Distinct Colors */}
            {mobileUnits.map((unit) => {
              const isSelected = selectedUnit.id === unit.id;
              const isMoving = unit.status === 'COLLECTING' || unit.status === 'EN_ROUTE' || unit.status === 'RETURNING';
              const uTheme = getVehicleTheme(unit.id);

              return (
                <div
                  key={unit.id}
                  onClick={() => setSelectedUnitId(unit.id)}
                  style={{
                    left: `${unit.coordinates.x}%`,
                    top: `${unit.coordinates.y}%`,
                    transition: 'left 1.2s cubic-bezier(0.4, 0, 0.2, 1), top 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group ${
                    isSelected ? 'z-30' : ''
                  }`}
                  title={`${unit.id} • ${uTheme.name} • ${unit.status} (${unit.batteryLevel}%)`}
                >
                  {/* Pulsing individual color beacon if moving */}
                  {isMoving && (
                    <span
                      style={{ backgroundColor: `${uTheme.primary}40` }}
                      className="absolute -inset-2.5 rounded-full animate-ping pointer-events-none"
                    />
                  )}

                  {/* Individual Color Marker Pin */}
                  <div
                    style={{
                      backgroundColor: uTheme.primary,
                      boxShadow: isSelected
                        ? `0 0 0 4px #ffffff, 0 0 0 7px ${uTheme.primary}, 0 8px 16px ${uTheme.primary}60`
                        : `0 4px 10px ${uTheme.primary}50`,
                    }}
                    className={`relative w-10 h-10 rounded-2xl flex flex-col items-center justify-center font-mono font-bold text-xs text-white transition-all duration-300 ${
                      isSelected ? 'scale-125' : 'hover:scale-115'
                    }`}
                  >
                    {unit.status === 'CHARGING' ? (
                      <Zap className="w-4 h-4 text-white fill-white animate-pulse" />
                    ) : (
                      <Truck className="w-4 h-4 text-white" />
                    )}
                    <span className="text-[8px] font-mono leading-none mt-0.5 tracking-tighter text-white font-extrabold">
                      {unit.id.slice(-2)}
                    </span>

                    {/* Small Status Indicator Pip */}
                    <span
                      className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        unit.status === 'AVAILABLE'
                          ? 'bg-emerald-400'
                          : unit.status === 'COLLECTING'
                          ? 'bg-purple-400'
                          : unit.status === 'EN_ROUTE'
                          ? 'bg-sky-400'
                          : unit.status === 'CHARGING'
                          ? 'bg-amber-400'
                          : 'bg-orange-400'
                      }`}
                    />
                  </div>

                  {/* Individual Color Badge Attached Below Pin */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 flex flex-col items-center pointer-events-none">
                    <span
                      style={{
                        backgroundColor: isSelected ? uTheme.primary : '#ffffff',
                        color: isSelected ? '#ffffff' : uTheme.primary,
                        borderColor: uTheme.primary,
                      }}
                      className="px-2 py-0.5 rounded-md text-[9px] font-mono font-black whitespace-nowrap shadow-xs border transition-all"
                    >
                      {unit.id}
                    </span>
                  </div>

                  {/* Hover Tooltip with Full Telemetry Info */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 px-3 py-1.5 bg-slate-900/95 backdrop-blur-md text-white text-[10px] rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-mono z-40 border border-slate-700">
                    <div className="font-bold flex items-center justify-between gap-3">
                      <span style={{ color: uTheme.primary }}>
                        {unit.id} ({unit.name})
                      </span>
                      <span className="text-slate-300">⚡ {unit.batteryLevel}%</span>
                    </div>
                    <div className="text-slate-300 mt-0.5">
                      Theme: <strong className="text-white">{uTheme.name}</strong> • {unit.currentDepartment}
                    </div>
                    <div className="text-slate-400 text-[9px] max-w-xs truncate">
                      Status: {unit.status} • {unit.currentTask}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend: Individual Vehicle Identity Colors */}
          <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono flex items-center gap-1.5">
              <Palette className="w-3 h-3 text-slate-500" />
              Individual Vehicle Color Registry:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {mobileUnits.map((u) => {
                const theme = getVehicleTheme(u.id);
                const isSelected = selectedUnit.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUnitId(u.id)}
                    className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white shadow-xs font-bold ring-2 ring-slate-400'
                        : 'hover:bg-white border-transparent'
                    }`}
                    style={{ borderColor: isSelected ? theme.primary : '#e2e8f0' }}
                  >
                    <span
                      style={{ backgroundColor: theme.primary }}
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                    />
                    <div className="truncate text-[11px]">
                      <span className="font-mono font-bold text-slate-900">{u.id}</span>
                      <span className="text-[9px] text-slate-500 block truncate">{theme.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Unit Telemetry Inspector (5 Columns) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: selectedTheme.primary }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-mono font-extrabold text-sm shadow-md"
                >
                  {selectedUnit.id.slice(-2)}
                </div>
                <div>
                  <span
                    style={{ color: selectedTheme.primary }}
                    className="font-mono text-xs font-bold flex items-center gap-1.5"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    {selectedUnit.id} • {selectedTheme.name}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{selectedUnit.name}</h3>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold uppercase border ${
                  selectedUnit.status === 'COLLECTING'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : selectedUnit.status === 'EN_ROUTE'
                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                    : selectedUnit.status === 'RETURNING'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : selectedUnit.status === 'CHARGING'
                    ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
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
                    Inductive Battery Level
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {(selectedUnit.batteryLevel ?? 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    style={{
                      width: `${selectedUnit.batteryLevel}%`,
                      backgroundColor: selectedTheme.primary,
                    }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
                  <span>Safety reserve: 20%</span>
                  <span>{selectedUnit.batteryLevel < 30 ? 'Recharge Recommended' : 'Nominal Power'}</span>
                </div>
              </div>

              {/* Transit / Collection Progress */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-600 font-semibold flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-sky-600" />
                    Mission Route Progress
                  </span>
                  <span className="font-mono font-bold text-sky-700 text-sm">
                    {selectedUnit.collectionProgress}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    style={{
                      width: `${selectedUnit.collectionProgress}%`,
                      backgroundColor: selectedTheme.primary,
                    }}
                    className="h-full rounded-full transition-all duration-300"
                  />
                </div>
              </div>

              {/* Metadata Cards */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Current Location</span>
                  <strong className="text-slate-900 truncate block">{selectedUnit.currentDepartment}</strong>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Active Request</span>
                  <strong className="text-sky-700 font-mono truncate block">
                    {selectedUnit.assignedRequestId || 'None (Idle)'}
                  </strong>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Payload Capacity</span>
                  <strong className="text-slate-900">{selectedUnit.payloadCapacityKg || 45} kg max</strong>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Vehicle Color Identity</span>
                  <strong style={{ color: selectedTheme.primary }} className="truncate block font-mono font-bold">
                    {selectedTheme.name}
                  </strong>
                </div>
              </div>

              {/* Task Description */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-500 text-[10px] block mb-0.5 font-semibold">Assigned Mission / Task</span>
                <p className="text-slate-800 font-medium leading-relaxed">{selectedUnit.currentTask}</p>
              </div>
            </div>
          </div>

          {/* Unit Actions Controls */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => chargeMobileUnit(selectedUnit.id)}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Replenish battery to 100% and dock at Central Storage Dock"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600" /> Fast Charge (100%)
              </button>

              {selectedUnit.status === 'AVAILABLE' && (
                <button
                  type="button"
                  onClick={() => handleSimulateMission(selectedUnit.id)}
                  disabled={simulationActiveId === selectedUnit.id}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Simulate autonomous pickup mission: EN_ROUTE -> COLLECTING -> RETURNING -> AVAILABLE"
                >
                  <Play className="w-3.5 h-3.5 text-purple-600" /> Simulate Mission
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleRecall(selectedUnit.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                recentlyRecalledId === selectedUnit.id
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
              }`}
            >
              {recentlyRecalledId === selectedUnit.id ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Recalled to Dock ✓</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Recall to Storage</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* All 5 Fleet Units Cards Grid - Each with Distinct Individual Colors */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-600" />
            Autonomous Fleet Vehicles (Individual Color-Coded Roster)
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Click any card to select & track on floor map
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {mobileUnits.map((u) => {
            const isSelected = selectedUnit.id === u.id;
            const isAtStorage = u.currentDepartment.includes('Central Storage') && u.status === 'AVAILABLE';
            const uTheme = getVehicleTheme(u.id);

            return (
              <div
                key={u.id}
                onClick={() => setSelectedUnitId(u.id)}
                style={{
                  borderTopColor: uTheme.primary,
                  borderTopWidth: '4px',
                  boxShadow: isSelected ? `0 0 0 2px ${uTheme.primary}` : undefined,
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white shadow-md scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div
                        style={{
                          backgroundColor: `${uTheme.primary}18`,
                          color: uTheme.primary,
                          borderColor: `${uTheme.primary}40`,
                        }}
                        className="w-9 h-9 rounded-xl border flex items-center justify-center font-mono font-black text-xs shadow-2xs"
                      >
                        {u.id.slice(-2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-900 text-xs">{u.id}</h4>
                          <span
                            style={{ backgroundColor: uTheme.primary }}
                            className="w-2 h-2 rounded-full inline-block"
                            title={uTheme.name}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 block leading-tight">{uTheme.name}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border ${
                        u.status === 'COLLECTING'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : u.status === 'EN_ROUTE'
                          ? 'bg-sky-50 text-sky-700 border-sky-200'
                          : u.status === 'RETURNING'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : u.status === 'CHARGING'
                          ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {u.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Location:</span>
                      <strong className="text-slate-900 font-semibold truncate max-w-[110px]">
                        {u.currentDepartment}
                      </strong>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="text-slate-500">Battery:</span>
                        <span className="text-slate-900 font-bold">{(u.batteryLevel ?? 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          style={{
                            width: `${u.batteryLevel}%`,
                            backgroundColor: uTheme.primary,
                          }}
                          className="h-full rounded-full transition-all"
                        />
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] text-slate-400 block font-medium">Task:</span>
                      <p className="text-[11px] text-slate-700 line-clamp-2 leading-tight">
                        {u.currentTask}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  {u.status === 'CHARGING' ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        chargeMobileUnit(u.id);
                      }}
                      className="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 cursor-pointer hover:underline text-[11px]"
                    >
                      <Zap className="w-3 h-3 text-amber-500" /> Complete Charge
                    </button>
                  ) : !isAtStorage ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRecall(u.id);
                      }}
                      className="text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1 cursor-pointer hover:underline text-[11px]"
                    >
                      <RotateCcw className="w-3 h-3" /> Recall to Dock
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-700 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Ready at Base
                    </span>
                  )}

                  <span className="font-mono text-[10px] text-slate-400">
                    {u.payloadCapacityKg || 45}kg
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
