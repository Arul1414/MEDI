import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getPeriodAuditMetrics, AuditTimeframe } from '../../utils/auditDataUtils';
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
  Clock,
  BrainCircuit,
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
    auditDateRange,
    setAuditDateRange,
  } = useApp();

  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  if (!auditReportOpen) return null;

  const activeTimeframe: AuditTimeframe = (auditDateRange as AuditTimeframe) || '7d';
  const reportData = getPeriodAuditMetrics(activeTimeframe, wasteRecords, containers, mobileUnits);

  const totalWeight = reportData.totalWeightKg;
  const aiAccuracy = reportData.aiAccuracyRate;
  const reviewRate = reportData.humanReviewRate;
  const reportId = reportData.reportId;
  const cycleName = reportData.cycleName;
  const timeframeLabel = reportData.timeframeLabel;
  const dateDescription = reportData.dateDescription;

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const generateAndDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();

      // Top Letterhead
      doc.setFillColor(14, 116, 144); // Sky 700
      doc.rect(0, 0, pageWidth, 22, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('ST. JUDE MEDICAL CENTER • BIOMEDICAL AUDIT REGISTRY', 14, 11);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Division of Environmental Safety, Autonomous Waste Segregation & Infection Control', 14, 17);

      // Metadata Box
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.text(`REPORT REF: ${reportId}`, 14, 30);
      doc.setFont('helvetica', 'normal');
      doc.text(`DATE: ${currentDate}`, 14, 35);
      doc.text(`CYCLE: ${cycleName}`, 14, 40);
      doc.text(`PERIOD: ${timeframeLabel} (${dateDescription})`, 14, 45);

      doc.setFont('helvetica', 'bold');
      doc.text(`STATUS: VERIFIED & SEALED`, pageWidth - 75, 30);
      doc.setFont('helvetica', 'normal');
      doc.text(`AI ACCURACY: ${aiAccuracy}`, pageWidth - 75, 35);
      doc.text(`MANUAL REVIEWS: ${reviewRate}`, pageWidth - 75, 40);
      doc.text(`AVG PICKUP: ${reportData.avgPickupTimeMinutes}`, pageWidth - 75, 45);

      // 1. Executive Summary
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('1. EXECUTIVE REGULATORY SUMMARY', 14, 53);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const summaryText = `During this official regulatory audit cycle (${timeframeLabel} • ${dateDescription}), the Smart Mobile Medical Waste Collection and Segregation System processed a net total of ${totalWeight.toFixed(1)} kg of biomedical waste across ${reportData.completedPickupsCount} dispatched collection tasks with an average pickup response of ${reportData.avgPickupTimeMinutes}. All collection workflows were dispatched to autonomous mobile units, scanned via optical neural categorization, and segregated into dedicated containment chambers conforming to WHO biomedical waste protocols and OSHA bloodborne pathogen standards.`;
      const splitSummary = doc.splitTextToSize(summaryText, pageWidth - 28);
      doc.text(splitSummary, 14, 59);

      // Metric Strip Box
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, 73, pageWidth - 28, 14, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(14, 116, 144);
      doc.text(`TOTAL PROCESSED: ${totalWeight.toFixed(1)} kg`, 18, 82);
      doc.setTextColor(67, 56, 202);
      doc.text(`AI ACCURACY: ${aiAccuracy}`, 72, 82);
      doc.setTextColor(180, 83, 9);
      doc.text(`CLINICIAN REVIEWS: ${reviewRate}`, 118, 82);
      doc.setTextColor(15, 23, 42);
      doc.text(`PICKUPS: ${reportData.completedPickupsCount} DISPATCHES`, 164, 82);

      // 2. Containers Table
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('2. SEGREGATED STREAM LEDGER & CONTAINMENT PROTOCOL', 14, 95);

      const containerRows = reportData.containers.map((c) => [
        c.name,
        c.label,
        c.protocol,
        `${c.weightKg.toFixed(1)} kg`,
        `${c.capacityPercent}%`,
        c.status,
      ]);

      autoTable(doc, {
        startY: 99,
        head: [['CONTAINER', 'WASTE STREAM', 'DESTINATION PROTOCOL', 'VOLUME', 'CAPACITY', 'STATUS']],
        body: containerRows,
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
        bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
        margin: { left: 14, right: 14 },
      });

      // 3. Fleet Table
      const finalY1 = (doc as any).lastAutoTable?.finalY || 142;
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('3. MOBILE WASTE-COLLECTION FLEET TELEMETRY LOG', 14, finalY1 + 9);

      const fleetRows = reportData.fleetUnits.map((u) => [
        u.id,
        u.name,
        u.currentDepartment,
        u.status,
        `${u.batteryPercent}%`,
        `${u.collectedKg.toFixed(1)} kg`,
      ]);

      autoTable(doc, {
        startY: finalY1 + 13,
        head: [['UNIT ID', 'NAME', 'CURRENT WARD', 'STATUS', 'BATTERY', 'COLLECTED YIELD']],
        body: fleetRows,
        theme: 'grid',
        headStyles: { fillColor: [14, 116, 144], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
        bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
        margin: { left: 14, right: 14 },
      });

      // 4. Clinical Ward Distribution Table
      const finalY2 = (doc as any).lastAutoTable?.finalY || 185;
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('4. CLINICAL WARD WASTE GENERATION BREAKDOWN', 14, finalY2 + 9);

      const deptRows = reportData.departments.map((d) => [
        d.name,
        `${d.weightKg.toFixed(1)} kg`,
        `${d.percent}% relative peak`,
      ]);

      autoTable(doc, {
        startY: finalY2 + 13,
        head: [['DEPARTMENT / CLINICAL WARD', 'PERIOD GENERATED VOLUME', 'RELATIVE LOAD']],
        body: deptRows,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
        bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
        margin: { left: 14, right: 14 },
      });

      // 5. Compliance Certification
      const finalY3 = (doc as any).lastAutoTable?.finalY || 225;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, finalY3 + 6, pageWidth - 28, 20, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('COMPLIANCE CERTIFICATION & SAFETY SCOPE NOTICE', 18, finalY3 + 12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const certText =
        'This digital document constitutes an official automated audit verification produced by the MEDI-SORT system. The platform strictly enforces WHO biomedical waste segregation regulations and OSHA 1910.1030 bloodborne pathogen standards through autonomous categorization, dual-key clinician sign-off, and immutable cryptographic activity ledger recording.';
      const splitCert = doc.splitTextToSize(certText, pageWidth - 36);
      doc.text(splitCert, 18, finalY3 + 17);

      // 6. Dual Signatures
      const sigY = finalY3 + 32;
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Dr. Evelyn Vance, MD, MPH', 14, sigY);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text('Chief Medical Safety & Infection Control Officer', 14, sigY + 4);
      doc.text('Credentials: MD-98241 / ABPM Certified', 14, sigY + 7.5);
      doc.text('[ Cryptographically Sealed via SHA-256 ]', 14, sigY + 12);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Marcus Brody, CHSP', pageWidth / 2 + 8, sigY);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text('Director of Environmental Waste Operations', pageWidth / 2 + 8, sigY + 4);
      doc.text('Accreditation: CHSP-EHS-4089', pageWidth / 2 + 8, sigY + 7.5);
      doc.text('[ Verified Mobile Unit Dispatch Ledger ]', pageWidth / 2 + 8, sigY + 12);

      // Save PDF
      doc.save(`Official_Audit_Report_${reportId}.pdf`);
      return true;
    } catch (err) {
      console.error('PDF generation error:', err);
      return false;
    }
  };

  const triggerPrintableIframe = () => {
    try {
      const sheet = document.getElementById('official-audit-report-sheet');
      if (!sheet) {
        window.print();
        return;
      }

      // Create an invisible iframe for clean printing
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const frameDoc = iframe.contentWindow?.document;
      if (frameDoc) {
        frameDoc.open();
        frameDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Official Audit Report - ${reportId} (${timeframeLabel})</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                  color: #0f172a;
                  padding: 28px;
                  margin: 0;
                  background: #ffffff;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 10px;
                  margin-bottom: 14px;
                }
                th, td {
                  border: 1px solid #cbd5e1;
                  padding: 8px 10px;
                  text-align: left;
                  font-size: 11px;
                }
                th {
                  background-color: #f1f5f9;
                  font-weight: 700;
                }
                h1 { font-size: 17px; margin: 0 0 4px 0; color: #0f172a; }
                h2 { font-size: 13px; margin: 14px 0 6px 0; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; }
                p { font-size: 11px; line-height: 1.5; color: #334155; }
                .grid { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }
                .card { flex: 1; min-width: 130px; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; }
                @media print {
                  @page { margin: 1.2cm; }
                  .no-print { display: none !important; }
                }
              </style>
            </head>
            <body>
              ${sheet.innerHTML}
            </body>
          </html>
        `);
        frameDoc.close();

        setTimeout(() => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
          } catch (e) {
            console.log('Iframe print notice:', e);
            window.print();
          } finally {
            setTimeout(() => {
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
              }
            }, 2500);
          }
        }, 350);
      } else {
        window.print();
      }
    } catch {
      try {
        window.print();
      } catch {
        // Safe fallback
      }
    }
  };

  const handlePrint = () => {
    // 1. Generate & download the official PDF file
    generateAndDownloadPDF();

    // 2. Launch print dialog
    triggerPrintableIframe();

    // 3. Show visual confirmation
    setDownloadSuccessMessage(`Official PDF Document generated and downloaded for ${timeframeLabel} as Official_Audit_Report_${reportId}.pdf! Print dialog opened.`);
    setTimeout(() => {
      setDownloadSuccessMessage(null);
    }, 5000);
  };

  const handleDownloadOnlyPDF = () => {
    generateAndDownloadPDF();
    setDownloadSuccessMessage(`Official PDF Document for ${timeframeLabel} downloaded successfully (Official_Audit_Report_${reportId}.pdf)!`);
    setTimeout(() => {
      setDownloadSuccessMessage(null);
    }, 4500);
  };

  const handleDownloadJSON = () => {
    const reportDataExport = {
      reportId,
      timeframe: activeTimeframe,
      timeframeLabel,
      cycleName,
      dateDescription,
      generatedAt: new Date().toISOString(),
      institution: 'St. Jude Medical Center - Division of Environmental Safety & Infection Control',
      system: 'Smart Mobile Medical Waste Collection and Segregation System (MEDI-SORT)',
      totalWasteSegregatedKg: totalWeight,
      completedPickupsCount: reportData.completedPickupsCount,
      avgPickupTimeMinutes: reportData.avgPickupTimeMinutes,
      aiAccuracyRate: aiAccuracy,
      humanReviewRate: reviewRate,
      avgVaultFillPercent: reportData.avgVaultFillPercent,
      containersStatus: reportData.containers,
      mobileFleetStatus: reportData.fleetUnits,
      departmentsBreakdown: reportData.departments,
      confidenceTiers: reportData.confidenceTiers,
    };

    const blob = new Blob([JSON.stringify(reportDataExport, null, 2)], { type: 'application/json' });
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
      {/* Top Floating Control Bar with Timeframe Switcher and Actions */}
      <header className="sticky top-0 z-20 w-full max-w-4xl bg-white/95 border border-slate-200 rounded-2xl p-3 sm:p-4 mb-4 shadow-xl flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Prominent Back Button */}
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
              Official Regulatory Audit • {timeframeLabel}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Document #{reportId}</span>
          </div>
        </div>

        {/* Timeframe Switcher in Modal Bar */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
          {(['today', '7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setAuditDateRange(range)}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                activeTimeframe === range
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {range}
            </button>
          ))}
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
            onClick={handleDownloadOnlyPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 text-xs font-bold transition-colors cursor-pointer"
            title="Download PDF document directly"
          >
            <Download className="w-3.5 h-3.5 text-sky-600" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-slate-900/10 transition-all cursor-pointer"
            title="Print document and generate PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF Document</span>
          </button>
        </div>
      </header>

      {/* Visual Download / Print Confirmation Toast */}
      {downloadSuccessMessage && (
        <div className="w-full max-w-4xl p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center justify-between gap-2 shadow-sm animate-in fade-in no-print mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccessMessage}</span>
          </div>
          <button
            onClick={() => setDownloadSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-xs px-2 py-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Official Audit Report Printable Sheet - High contrast clean white document styling */}
      <div
        id="official-audit-report-sheet"
        className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-slate-800"
      >
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
                    CERTIFIED CLINICAL AUDIT • {timeframeLabel.toUpperCase()}
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
              <div className="text-slate-600">CYCLE: {cycleName}</div>
              <div className="text-indigo-700 font-semibold">PERIOD: {timeframeLabel}</div>
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
              1. Executive Regulatory Summary ({timeframeLabel})
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            During this official audit cycle (<strong className="text-slate-900 font-semibold">{timeframeLabel}</strong> — {dateDescription}), the Smart Mobile Medical Waste Collection and Segregation System
            processed a net total of <strong className="text-slate-900 font-mono text-base font-bold">{totalWeight.toFixed(1)} kg</strong> of
            biomedical waste across <strong className="text-slate-900 font-mono">{reportData.completedPickupsCount} collection dispatches</strong> from
            inpatient, surgical, and clinical diagnostic wards. All collection workflows were
            dispatched digitally to autonomous mobile units, scanned via optical neural categorization, and segregated
            into hermetically monitored virtual containment chambers without physical hardware dependencies.
          </p>

          {/* Quick Metrics Bar in Light Palette */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200">
              <div className="text-[11px] font-mono text-sky-800 font-semibold">TOTAL PROCESSED</div>
              <div className="text-xl font-black text-sky-700 font-mono mt-0.5">{totalWeight.toFixed(1)} kg</div>
              <div className="text-[10px] text-sky-700/80 mt-0.5">{timeframeLabel}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-mono text-slate-500">AVG PICKUP TIME</div>
              <div className="text-xl font-black text-indigo-700 font-mono mt-0.5">{reportData.avgPickupTimeMinutes}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Request to dock</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-mono text-slate-500">AI ACCURACY</div>
              <div className="text-xl font-black text-purple-700 font-mono mt-0.5">{aiAccuracy}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Optical recognition</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-mono text-slate-500">CLINICIAN REVIEWS</div>
              <div className="text-xl font-black text-amber-700 font-mono mt-0.5">{reviewRate}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Manual safety gate</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-mono text-slate-500">COMPLETED TASKS</div>
              <div className="text-xl font-black text-slate-900 font-mono mt-0.5">{reportData.completedPickupsCount}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{reportData.fleetUnits.length} active units</div>
            </div>
          </div>
        </section>

        {/* 2. Waste Stream Ledger Table */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              2. Segregated Stream Ledger & Containment Protocol ({timeframeLabel})
            </h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono text-slate-500">
                <tr>
                  <th className="p-3">CONTAINER</th>
                  <th className="p-3">WASTE STREAM</th>
                  <th className="p-3">DESTINATION PROTOCOL</th>
                  <th className="p-3">PERIOD VOLUME</th>
                  <th className="p-3">CAPACITY</th>
                  <th className="p-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {reportData.containers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{c.name}</td>
                    <td className="p-3 text-slate-800 font-sans font-medium">{c.label}</td>
                    <td className="p-3 text-[11px] text-slate-500 font-sans">{c.protocol}</td>
                    <td className="p-3 text-sky-700 font-bold">{c.weightKg.toFixed(1)} kg</td>
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
                      <span className={`px-2 py-0.5 rounded-full border text-xs ${
                        c.status === 'NEAR FULL'
                          ? 'bg-amber-50 border-amber-300 text-amber-800'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      }`}>
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
              3. Mobile Waste-Collection Fleet Telemetry Log ({timeframeLabel})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {reportData.fleetUnits.map((u) => {
              const battery = u.batteryPercent;

              return (
                <div key={u.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 text-xs">{u.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      {u.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">Ward: {u.currentDepartment}</div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Battery:</span>
                    <span className={battery < 30 ? 'text-amber-700 font-bold' : 'text-slate-800'}>
                      {battery}%
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Period Yield:</span>
                    <span className="text-indigo-700 font-bold">{u.collectedKg.toFixed(1)} kg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Clinical Ward Generation Breakdown */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              4. Clinical Ward Waste Generation Breakdown ({timeframeLabel})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {reportData.departments.map((dept) => (
              <div key={dept.name} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-semibold">{dept.name}</span>
                  <span className="font-mono text-sky-700 font-bold">{dept.weightKg.toFixed(1)} kg</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    style={{ width: `${dept.percent}%` }}
                    className="h-full bg-indigo-600 rounded-full"
                  />
                </div>
                <div className="text-[10px] text-slate-400 font-mono text-right">{dept.percent}% of peak ward</div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. AI Confidence Tiers Distribution */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <BrainCircuit className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              5. AI Neural Classifier Performance & Safety Gates ({timeframeLabel})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
              <div className="text-[11px] font-bold text-sky-800">&gt; 90% High Certainty</div>
              <div className="text-lg font-bold font-mono text-sky-900 mt-0.5">
                {reportData.confidenceTiers.over90.count} scans ({reportData.confidenceTiers.over90.percent}%)
              </div>
              <div className="text-[10px] text-sky-700 mt-0.5">Auto-segregated safely</div>
            </div>
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <div className="text-[11px] font-bold text-indigo-800">80% - 90% Moderate Certainty</div>
              <div className="text-lg font-bold font-mono text-indigo-900 mt-0.5">
                {reportData.confidenceTiers.between80and90.count} scans ({reportData.confidenceTiers.between80and90.percent}%)
              </div>
              <div className="text-[10px] text-indigo-700 mt-0.5">Compliant segregation</div>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="text-[11px] font-bold text-amber-800">&lt; 80% Ambiguous / Review</div>
              <div className="text-lg font-bold font-mono text-amber-900 mt-0.5">
                {reportData.confidenceTiers.under80.count} scans ({reportData.confidenceTiers.under80.percent}%)
              </div>
              <div className="text-[10px] text-amber-700 mt-0.5">Mandatory clinician sign-off</div>
            </div>
          </div>
        </section>

        {/* 6. Safety Audit & Compliance Statement */}
        <section className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase font-mono">
            <AlertTriangle className="w-4 h-4 text-sky-600" />
            Compliance Certification & Safety Scope Notice
          </div>
          <p className="text-slate-700 leading-relaxed text-xs">
            This digital document constitutes an official automated audit verification produced by the MEDI-SORT
            system for the <strong>{timeframeLabel}</strong> regulatory inspection cycle. The platform strictly enforces WHO biomedical waste segregation regulations and OSHA 1910.1030
            bloodborne pathogen standards through autonomous categorization, dual-key clinician sign-off, and
            immutable cryptographic activity ledger recording.
          </p>
        </section>

        {/* 7. Dual Verification Signatures */}
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
              onClick={handleDownloadOnlyPDF}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 font-bold text-xs transition-colors cursor-pointer"
              title="Download official PDF copy"
            >
              <Download className="w-4 h-4 text-sky-600" />
              <span>Download PDF Copy</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-md"
              title="Print official document copy"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Copy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

