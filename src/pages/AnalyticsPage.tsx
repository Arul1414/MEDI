import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getPeriodAuditMetrics, AuditTimeframe } from '../utils/auditDataUtils';
import {
  BarChart3,
  FileText,
  TrendingUp,
  BrainCircuit,
  Boxes,
  Clock,
  AlertTriangle,
  Building2,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { wasteRecords, containers, mobileUnits, generateAuditReport, auditDateRange, setAuditDateRange } = useApp();

  const dateRange = (auditDateRange as AuditTimeframe) || '7d';

  const handleRangeChange = (range: AuditTimeframe) => {
    setAuditDateRange(range);
  };

  // Dynamic metrics derived for the selected timeframe
  const data = getPeriodAuditMetrics(dateRange, wasteRecords, containers, mobileUnits);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Header with Deep Indigo Module Identity */}
      <div className="bg-gradient-to-r from-indigo-50 via-blue-50/50 to-sky-50 border border-indigo-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-800">
              Intelligence & Metrics • Deep Indigo Module
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200 text-[10px] font-mono font-semibold">
              Telemetry Analytics Active • {data.timeframeLabel}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            Analytics & Regulatory Audit Reports
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            Clinical waste generation volume, AI neural classifier performance, and environmental compliance matrices for {data.timeframeLabel.toLowerCase()}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-white border border-indigo-200 rounded-xl p-1 text-xs shadow-2xs">
            {(['today', '7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => handleRangeChange(range)}
                className={`px-3 py-1 rounded-lg font-medium uppercase transition-colors cursor-pointer ${
                  dateRange === range
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-indigo-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            id="analytics-generate-audit-btn"
            onClick={() => generateAuditReport(dateRange)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
            title={`Generate official regulatory audit report for ${data.timeframeLabel}`}
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>Generate Official Audit Report ({dateRange.toUpperCase()})</span>
          </button>
        </div>
      </div>

      {/* Top 5 Metric Cards with Dynamic Period Data */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/90 to-white border border-indigo-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-indigo-800 mb-1 font-semibold">
            <span>Total Volume</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {data.totalWeightKg.toFixed(1)} <span className="text-xs text-slate-500 font-normal">kg</span>
          </div>
          <div className="text-[11px] text-indigo-700 mt-1 font-mono font-medium">{data.timeframeLabel}</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Avg Pickup Time</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-600">{data.avgPickupTimeMinutes}</div>
          <div className="text-[11px] text-slate-500 mt-1">From request to dock</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>AI Model Accuracy</span>
            <BrainCircuit className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-600">{data.aiAccuracyRate}</div>
          <div className="text-[11px] text-purple-500 mt-1">Verified via pathology</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Human Review Rate</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600">{data.humanReviewRate}</div>
          <div className="text-[11px] text-slate-500 mt-1">Conf &lt; 80% protocol</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Avg Vault Level</span>
            <Boxes className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{data.avgVaultFillPercent}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Across 4 containers</div>
        </div>
      </div>

      {/* Row 2: Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste by Department */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-600" />
                Waste Generation by Department (kg) • {data.timeframeLabel}
              </h2>
              <p className="text-xs text-slate-500">Aggregated clinical ward load for the period</p>
            </div>
            <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
              {data.completedPickupsCount} Dispatched Pickups
            </span>
          </div>

          <div className="space-y-3">
            {data.departments.map((dept) => (
              <div key={dept.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">{dept.name}</span>
                  <span className="font-mono text-slate-500 font-semibold">{dept.weightKg.toFixed(1)} kg</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${dept.percent}%` }}
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Confidence Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-purple-600" />
                  AI Classification Confidence Tiers • {data.timeframeLabel}
                </h2>
                <p className="text-xs text-slate-500">Neural certainty distribution against 80% safety rule</p>
              </div>
              <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                {data.confidenceTiers.total} Neural Scans
              </span>
            </div>

            <div className="space-y-4 my-auto">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-sky-700 font-semibold">&gt; 90% High Certainty (Auto-Segregated)</span>
                  <span className="font-mono text-slate-600">
                    {data.confidenceTiers.over90.count} records ({data.confidenceTiers.over90.percent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${data.confidenceTiers.over90.percent}%` }}
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-indigo-700 font-semibold">80% - 90% Moderate Certainty (Compliant)</span>
                  <span className="font-mono text-slate-600">
                    {data.confidenceTiers.between80and90.count} records ({data.confidenceTiers.between80and90.percent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${data.confidenceTiers.between80and90.percent}%` }}
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-700 font-semibold">&lt; 80% Ambiguous (Human Review Mandatory)</span>
                  <span className="font-mono text-slate-600">
                    {data.confidenceTiers.under80.count} records ({data.confidenceTiers.under80.percent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${data.confidenceTiers.under80.percent}%` }}
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-900 mt-4">
            <strong className="text-amber-800">Safety Audit Note:</strong> Zero automated segregation occurs when confidence is below 80% or labeled UNKNOWN, fulfilling biomedical hazard protection standards.
          </div>
        </div>
      </div>
    </div>
  );
};
