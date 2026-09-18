import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  Sliders,
  Radio,
  Bell,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, addActivityLog, currentUser } = useApp();

  const [threshold, setThreshold] = useState(settings.confidenceThreshold);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      confidenceThreshold: threshold,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl text-slate-800">
      {/* Header with Cyber Blue Module Identity */}
      <div className="bg-gradient-to-r from-blue-50 via-sky-50/50 to-indigo-50 border border-blue-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-800">
            System Parameters • Cyber Blue Module
          </span>
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-[10px] font-mono font-semibold">
            Parameters Active
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 text-blue-600" />
          System Preferences & Simulation Parameters
        </h1>
        <p className="text-slate-600 text-xs mt-1">
          Configure computer vision safety thresholds, automated telemetry intervals, and infection control parameters.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-5">
        {/* Section 1: AI Safety Protocol & Confidence Gate (Requirement 18) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-600" />
              AI Optical Classification Safety Gate (Threshold)
            </h2>
            <span className="text-sm font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
              {(threshold * 100).toFixed(0)}%
            </span>
          </div>

          <p className="text-xs text-slate-600">
            If the optical neural classification score falls below this safety barrier (or returns UNKNOWN),
            the system disables automatic segregation and flags the waste batch for mandatory clinician review.
          </p>

          <div className="space-y-2">
            <input
              type="range"
              min="0.50"
              max="0.95"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>50% (Permissive)</span>
              <span className="text-sky-700 font-bold">80% (Clinical Standard)</span>
              <span>95% (Strict Maximum)</span>
            </div>
          </div>
        </div>

        {/* Section 2: Autonomous Simulation Engine Controls (Requirement 18 & 22) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Radio className="w-4 h-4 text-indigo-600" />
            Simulation Engine Telemetry
          </h2>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <div className="font-semibold text-slate-900 text-xs">Simulate Mobile Units in Background</div>
              <p className="text-[11px] text-slate-500">
                Periodically advances in-corridor mobile units, battery discharge/charge cycles, and floor map coordinates.
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateSettings({ simulationActive: !settings.simulationActive })}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                settings.simulationActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {settings.simulationActive ? 'ENABLED' : 'PAUSED'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { speed: 2000, label: 'Fast Pace (2.0s tick)' },
              { speed: 4000, label: 'Normal Pace (4.0s tick)' },
              { speed: 8000, label: 'Realistic Pace (8.0s tick)' },
            ].map((s) => (
              <button
                key={s.speed}
                type="button"
                onClick={() => updateSettings({ simulationSpeedMs: s.speed })}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  settings.simulationSpeedMs === s.speed
                    ? 'bg-sky-50 border-sky-400 text-sky-800 font-medium'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-slate-900">{s.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Telemetry cycle interval</div>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Academic Prototype Information */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-purple-600" />
            Software Architecture & Academic Notice
          </h2>
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-2">
            <p>
              <strong>Academic Software Prototype:</strong> This application is developed strictly as a digital
              demonstrator for clinical medical waste logistics, automated fleet dispatch, and multi-modal optical
              segregation.
            </p>
            <p>
              <strong>No Hardware Requirement:</strong> All physical interactions (microcontrollers, robotic chassis,
              strain-gauge scales, infrared pathing) are purely simulated within this web runtime.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" /> Preferences saved successfully.
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
          >
            Apply Settings
          </button>
        </div>
      </form>
    </div>
  );
};
