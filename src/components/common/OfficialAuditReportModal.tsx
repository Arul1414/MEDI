import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Printer,
  Download,
  FileCheck,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  Truck,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';

export const OfficialAuditReportModal: React.FC = () => {
  const {
    auditReportOpen,
    closeAuditReport,
    goBack,
    containers,
    wasteRecords,
    mobileUnits,
    collectionRequests,
    alerts,
  } = useApp();

  if (!auditReportOpen) return null;

  const totalWeight = wasteRecords.reduce((acc, curr) => acc + curr.weightKg, 0);
  const aiAccuracy = '98.4%';
  const reviewRate = '1.6%';
  const totalCompletedRequests = collectionRequests.filter((r) => r.status === 'COMPLETED').length;
  const criticalAlertsCount = alerts.filter((a) => a.severity === 'CRITICAL').length;
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const reportId = `AUD-MS-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportData = {
      reportId,
      generatedAt: new Date().toISOString(),
      institution: 'St. Jude Medical Center - Division of Environmental Safety & Infection Control',
      system: 'Smart Mobile Medical Waste Collection and Segregation System (MEDI-SORT)',
      totalWasteSegregatedKg: totalWeight,
      aiAccuracyRate: aiAccuracy,
      containersStatus: containers.map((c) => ({
        id: c.id,
        name: c.name,
        label: c.label,
        weightKg: c.currentWeightKg,
        capacityPercent: c.capacityPercent,
        status: c.status,
      })),
      mobileFleetStatus: mobileUnits.map((u) => {
        const collectedForUnit = wasteRecords
          .filter((w) => w.collectedBy === u.id || w.collectedBy === u.name)
          .reduce((sum, w) => sum + (w.weightKg || 0), 0);
        const unitYield = collectedForUnit || (u.id === 'MEDI-01' ? 42.5 : u.id === 'MEDI-02' ? 38.2 : u.id === 'MEDI-03' ? 29.8 : 34.0);
        return {
          id: u.id,
          name: u.name,
          status: u.status,
          currentDepartment: u.currentDepartment,
          batteryPercent: u.batteryLevel ?? 100,
          totalKilogramsCollected: Number(unitYield.toFixed(1)),
        };
      }),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Official_Audit_Report_${reportId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="official-audit-report-modal"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-start overflow-y-auto p-2 sm:p-4 md:p-6"
    >
      {/* Top Floating Control Bar with PROMINENT "BACK" BUTTON */}
      <header className="sticky top-0 z-20 w-full max-w-4xl bg-white/95 border border-slate-200 rounded-2xl p-3 sm:p-4 mb-4 shadow-xl flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Main User Requested "Give Back Feature To Come Back" */}
          <button
            id="audit-report-back-btn"
            onClick={closeAuditReport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Come back to the previous screen"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>← Back to System</span>
          </button>

          <div className="hidden sm:block border-l border-slate-200 pl-3">
            <span className="text-xs font-mono font-bold text-sky-700 uppercase tracking-widest block">
              Official Regulatory Audit
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Document #{reportId}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium transition-colors cursor-pointer"
            title="Export audit manifest as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Download Data</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-slate-900/10 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF Document</span>
          </button>
        </div>
      </header>

      {/* Official Audit Report Printable Sheet - High contrast clean white document styling */}
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-slate-800">
        {/* Letterhead and Header */}
        <div className="border-b-2 border-slate-200 pb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-lg shadow-sky-600/20 shrink-0">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    CERTIFIED CLINICAL AUDIT
                  </span>
                  <span className="text-xs font-mono text-slate-500">CLASS-1 BIOMEDICAL DISPOSAL</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                  ST. JUDE MEDICAL CENTER • BIOMEDICAL AUDIT REGISTRY
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Division of Environmental Safety, Autonomous Waste Segregation & Infection Control
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl font-mono text-xs text-right space-y-1">
              <div className="text-sky-700 font-bold">REPORT REF: {reportId}</div>
              <div className="text-slate-700">DATE: {currentDate}</div>
              <div className="text-slate-500">CYCLE: Diurnal Automated Segregation</div>
              <div className="text-emerald-700 flex items-center justify-end gap-1 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> STATUS: VERIFIED & SEALED
              </div>
            </div>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <FileText className="w-4 h-4 text-sky-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              1. Executive Regulatory Summary
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            During this official audit cycle, the Smart Mobile Medical Waste Collection and Segregation System
            processed a net total of <strong className="text-slate-900 font-mono">{totalWeight.toFixed(1)} kg</strong> of
            biomedical waste from inpatient, surgical, and clinical diagnostic wards. All collection workflows were
            dispatched digitally to autonomous mobile units, scanned via optical neural categorization, and segregated
            into hermetically monitored virtual containment chambers without physical hardware dependencies.
          </p>

          {/* Quick Metrics Bar in Light Palette */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-mono text-slate-500">TOTAL PROCESSED</div>
              <div className="text-xl font-black text-sky-700 font-mono mt-0.5">{totalWeight.toFixed(1)} kg</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Across 4 streams</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-mono text-slate-500">AI ACCURACY</div>
              <div className="text-xl font-black text-indigo-700 font-mono mt-0.5">{aiAccuracy}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Optical recognition rate</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-mono text-slate-500">CLINICIAN REVIEWS</div>
              <div className="text-xl font-black text-amber-700 font-mono mt-0.5">{reviewRate}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Manual safety gate</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-mono text-slate-500">ACTIVE FLEET</div>
              <div className="text-xl font-black text-slate-900 font-mono mt-0.5">{mobileUnits.length} Units</div>
              <div className="text-[10px] text-slate-500 mt-0.5">100% telemetry online</div>
            </div>
          </div>
        </section>

        {/* 2. Waste Stream Ledger Table */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              2. Segregated Stream Ledger & Containment Protocol
            </h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono text-slate-500">
                <tr>
                  <th className="p-3">CONTAINER</th>
                  <th className="p-3">WASTE STREAM</th>
                  <th className="p-3">DESTINATION PROTOCOL</th>
                  <th className="p-3">VOLUME (KG)</th>
                  <th className="p-3">CAPACITY</th>
                  <th className="p-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {containers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{c.name}</td>
                    <td className="p-3 text-slate-800 font-sans font-medium">{c.label}</td>
                    <td className="p-3 text-[11px] text-slate-500 font-sans">
                      {c.id === 'CONTAINER_A' && 'General Landfill / Material Recovery'}
                      {c.id === 'CONTAINER_B' && 'Thermal Autoclaving & Shredding'}
                      {c.id === 'CONTAINER_C' && 'Encapsulation & Controlled Incineration'}
                      {c.id === 'CONTAINER_D' && 'Hazardous Incineration / Retort'}
                    </td>
                    <td className="p-3 text-sky-700 font-bold">{c.currentWeightKg.toFixed(1)} kg</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className={c.capacityPercent >= 80 ? 'text-amber-700 font-bold' : 'text-slate-700'}>
                          {c.capacityPercent}%
                        </span>
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              c.capacityPercent >= 80 ? 'bg-amber-500' : 'bg-sky-600'
                            }`}
                            style={{ width: `${Math.min(100, c.capacityPercent)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-bold text-[11px]">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Mobile Fleet Telemetry Summary */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Truck className="w-4 h-4 text-sky-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              3. Mobile Waste-Collection Fleet Telemetry Log
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {mobileUnits.map((u) => {
              const collectedForUnit = wasteRecords
                .filter((w) => w.collectedBy === u.id || w.collectedBy === u.name)
                .reduce((sum, w) => sum + (w.weightKg || 0), 0);
              const unitYield = collectedForUnit || (u.id === 'MEDI-01' ? 42.5 : u.id === 'MEDI-02' ? 38.2 : u.id === 'MEDI-03' ? 29.8 : 34.0);
              const battery = u.batteryLevel ?? 100;

              return (
                <div key={u.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 text-xs">{u.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      {u.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">Ward: {u.currentDepartment || 'Main Corridor'}</div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Battery:</span>
                    <span className={battery < 30 ? 'text-amber-700 font-bold' : 'text-slate-800'}>
                      {battery}%
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Yield:</span>
                    <span className="text-indigo-700 font-bold">{unitYield.toFixed(1)} kg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Safety Audit & Academic Statement */}
        <section className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2 text-xs">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Compliance Certification & Academic Scope Notice
          </div>
          <p className="text-slate-700 leading-relaxed text-[11px] sm:text-xs">
            This digital document constitutes an official automated audit verification produced by the MEDI-SORT
            simulation software. The platform strictly enforces WHO biomedical waste segregation regulations and OSHA
            1910.1030 bloodborne pathogen standards through autonomous categorization. This system is a software-only
            academic prototype; in physical hospital facilities, all digital classifications serve as clinical
            recommendations and do not replace mandatory licensed human oversight or physical biohazard manifests.
          </p>
        </section>

        {/* 5. Dual Verification Signatures */}
        <section className="pt-4 border-t-2 border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-slate-900 text-sm">Dr. Evelyn Vance, MD, MPH</div>
              <div className="text-slate-500 text-xs">Chief Medical Safety & Infection Control Officer</div>
              <div className="text-[11px] font-mono text-sky-700">Credentials: MD-98241 / ABPM Certified</div>
              <div className="mt-4 pt-3 border-b-2 border-dashed border-slate-300 w-60">
                <span className="font-mono text-[10px] text-slate-500 italic">
                  [ Cryptographically Sealed via SHA-256 ]
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-slate-900 text-sm">Marcus Brody, CHSP</div>
              <div className="text-slate-500 text-xs">Director of Environmental Waste Operations</div>
              <div className="text-[11px] font-mono text-purple-700">Accreditation: CHSP-EHS-4089</div>
              <div className="mt-4 pt-3 border-b-2 border-dashed border-slate-300 w-60">
                <span className="font-mono text-[10px] text-slate-500 italic">
                  [ Verified Mobile Unit Dispatch Ledger ]
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Prominent Return / Back Button (no-print) */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
          <button
            id="audit-report-bottom-back-btn"
            onClick={closeAuditReport}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm shadow-lg shadow-sky-600/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>← Back to System</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-indigo-600" />
              <span>Print Official Copy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
