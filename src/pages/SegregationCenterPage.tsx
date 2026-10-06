import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ContainerId } from '../types';
import {
  Boxes,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Scale,
  Clock,
  Layers,
} from 'lucide-react';

export const SegregationCenterPage: React.FC = () => {
  const {
    containers,
    emptyContainer,
    updateContainerManual,
    setActivePage,
  } = useApp();

  const [selectedContainerId, setSelectedContainerId] = useState<ContainerId>('CONTAINER_C');
  const [depositAmount, setDepositAmount] = useState<number>(3.5);
  const [recentlyEmptiedId, setRecentlyEmptiedId] = useState<string | null>(null);

  const pipelineSteps = [
    { title: 'Waste Detected', desc: 'Optical sensor or ward request logged' },
    { title: 'AI Classification', desc: 'Multi-modal neural vision scan' },
    { title: 'Confidence Check', desc: '≥80% gate check; human review fallback' },
    { title: 'Confirmation', desc: 'Clinician / automated sign-off' },
    { title: 'Virtual Segregation', desc: 'Direct routing into containment chamber' },
    { title: 'Container Updated', desc: 'Weight & volume recalculated' },
    { title: 'Audit Log Created', desc: 'Immutable SHA-verified compliance entry' },
  ];

  const handleDeposit = () => {
    updateContainerManual(selectedContainerId, depositAmount);
  };

  const handleEmpty = (containerId: ContainerId) => {
    emptyContainer(containerId);
    setRecentlyEmptiedId(containerId);
    setTimeout(() => {
      setRecentlyEmptiedId((prev) => (prev === containerId ? null : prev));
    }, 2500);
  };

  const handleEmptyAll = () => {
    containers.forEach((c) => emptyContainer(c.id));
    setRecentlyEmptiedId('ALL');
    setTimeout(() => {
      setRecentlyEmptiedId((prev) => (prev === 'ALL' ? null : prev));
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Header with Golden Amber Module Identity */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50/50 to-yellow-50 border border-amber-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-800">
              Containment Vaults • Golden Amber Module
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-semibold">
              4 Biohazard Vaults Monitored
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Boxes className="w-6 h-6 text-amber-600" />
            Segregation Center
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            Simulated clinical biohazard segregation vaults with dynamic capacity thresholds, safety alarms, and decanting controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('ai-classification')}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            Classify & Deposit Waste →
          </button>
        </div>
      </div>

      {/* Visual Digital Segregation Pipeline (Requirement 9) */}
      <div className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-2xs">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-600" />
          End-to-End Digital Segregation Protocol Pipeline
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          {pipelineSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between relative group hover:border-sky-400 hover:bg-sky-50/50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-sky-700 mb-1">
                  <span>STEP 0{idx + 1}</span>
                  {idx < 6 && <ArrowRight className="w-3 h-3 text-slate-400 md:hidden" />}
                </div>
                <div className="font-bold text-slate-900 text-xs mb-1">{step.title}</div>
                <p className="text-[10px] text-slate-500 leading-tight">{step.desc}</p>
              </div>

              {idx < 6 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4 Virtual Containers Grid (Requirement 9) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {containers.map((c) => {
          const isFull = c.capacityPercent >= 95;
          const isNearFull = c.capacityPercent >= 80 && c.capacityPercent < 95;
          const isSelected = selectedContainerId === c.id;

          return (
            <div
              key={c.id}
              onClick={() => setSelectedContainerId(c.id)}
              className={`rounded-2xl border p-5 flex flex-col justify-between cursor-pointer transition-all ${
                isFull
                  ? 'bg-red-50/70 border-red-400 ring-2 ring-red-300'
                  : isNearFull
                  ? 'bg-amber-50/70 border-amber-400 ring-1 ring-amber-300'
                  : isSelected
                  ? 'bg-white border-sky-500 ring-2 ring-sky-200 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-sky-700">{c.name}</span>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">{c.label}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      isFull
                        ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse'
                        : isNearFull
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 mb-4 line-clamp-2">{c.description}</p>

                {/* Capacity Radial / Bar Visualization */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 mb-4 space-y-2">
                  <div className="flex justify-between items-baseline text-xs font-mono">
                    <span className="text-slate-600 font-medium">Vault Capacity</span>
                    <span
                      className={`font-bold text-base ${
                        isFull ? 'text-red-600' : isNearFull ? 'text-amber-700' : 'text-slate-900'
                      }`}
                    >
                      {c.capacityPercent}%
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden relative">
                    <div
                      style={{ width: `${c.capacityPercent}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull
                          ? 'bg-gradient-to-r from-red-500 to-red-600'
                          : isNearFull
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                          : 'bg-gradient-to-r from-sky-500 to-indigo-600'
                      }`}
                    />
                    {/* 80% and 95% threshold markers */}
                    <div className="absolute left-[80%] top-0 bottom-0 w-0.5 bg-amber-600" title="80% Warning Marker" />
                    <div className="absolute left-[95%] top-0 bottom-0 w-0.5 bg-red-600" title="95% Critical Marker" />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-1">
                    <span>
                      {(c.currentWeightKg ?? 0).toFixed(1)} / {c.capacityKg} kg
                    </span>
                    <span>{c.itemCount} items logged</span>
                  </div>
                </div>

                {/* Safety Warning Banners */}
                {isFull && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-[11px] flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>CRITICAL: 95% limit reached. Automated lock engaged. Decanting required!</span>
                  </div>
                )}

                {isNearFull && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>WARNING: Exceeded 80% threshold. Prepare replacement canister.</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400 font-mono">Updated: {c.lastUpdated}</span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEmpty(c.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    recentlyEmptiedId === c.id || recentlyEmptiedId === 'ALL'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-200'
                      : 'bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 border-slate-200'
                  }`}
                  title="Decant and reset this container to 0 kg"
                >
                  {recentlyEmptiedId === c.id || recentlyEmptiedId === 'ALL' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Emptied (0 kg)</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Empty & Reset</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Simulation Console (Requirement 9) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-sky-600" />
              Manual Vault Simulation & Calibration Controls
            </h2>
            <p className="text-xs text-slate-500">
              Inject simulated load into containers to trigger capacity warnings (80%) and safety locks (95%), or decant containers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-600 font-medium">Target:</span>
              <select
                value={selectedContainerId}
                onChange={(e) => setSelectedContainerId(e.target.value as ContainerId)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
              >
                {containers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}: {c.label} ({c.capacityPercent}%)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-600 font-medium">Weight:</span>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="20"
                value={depositAmount}
                onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 1.0)}
                className="w-16 px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:border-sky-500"
              />
              <span className="text-slate-500 font-mono">kg</span>
            </div>

            <button
              onClick={handleDeposit}
              className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-sky-600/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulate Deposit</span>
            </button>

            <button
              onClick={() => handleEmpty(selectedContainerId)}
              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title="Empty the selected vault"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>Empty Target</span>
            </button>

            <button
              onClick={handleEmptyAll}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title="Decant and reset all vaults to 0 kg"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-700" />
              <span>Reset All Vaults</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
