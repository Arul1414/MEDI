import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { classifyWaste } from '../services/aiClassificationService';
import { AIClassification, WasteCategory, ContainerId, RiskLevel } from '../types';
import {
  ScanLine,
  UploadCloud,
  BrainCircuit,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Boxes,
  ShieldAlert,
  ShieldCheck,
  FileCheck,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

const SAMPLE_IMAGES = [
  {
    id: 'sample-sharps',
    label: 'Used Syringes & Needles',
    categoryHint: 'sharps puncture hazards',
    expectedCategory: 'SHARPS' as WasteCategory,
    container: 'CONTAINER_C' as ContainerId,
    weight: 1.8,
    dept: 'Emergency',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    description: 'Plastic disposable hypodermic syringes with stainless steel needles.',
  },
  {
    id: 'sample-infectious',
    label: 'Blood-Soiled Surgical Gauze',
    categoryHint: 'infectious soft swabs dressings',
    expectedCategory: 'INFECTIOUS_SOFT' as WasteCategory,
    container: 'CONTAINER_B' as ContainerId,
    weight: 3.4,
    dept: 'Operation Theatre',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=600&q=80',
    description: 'Cotton surgical swabs, dressing sponges saturated with biological fluids.',
  },
  {
    id: 'sample-pharma',
    label: 'Expired Antibiotic Vials',
    categoryHint: 'pharmaceutical chemical ampoules',
    expectedCategory: 'PHARMACEUTICAL' as WasteCategory,
    container: 'CONTAINER_D' as ContainerId,
    weight: 2.1,
    dept: 'Pharmacy',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    description: 'Glass vials containing expired cytotoxic and antibiotic formulations.',
  },
  {
    id: 'sample-general',
    label: 'Sterile Packaging & Cardboard',
    categoryHint: 'clean paper packaging cardboard general',
    expectedCategory: 'GENERAL' as WasteCategory,
    container: 'CONTAINER_A' as ContainerId,
    weight: 4.5,
    dept: 'Ward A',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80',
    description: 'Outer packaging boxes, paper wrapping, uncontaminated wrappers.',
  },
  {
    id: 'sample-unknown',
    label: 'Ambiguous Mixed Debris (Safety Test)',
    categoryHint: 'unknown mixed composite blurry',
    expectedCategory: 'UNKNOWN' as WasteCategory,
    container: 'CONTAINER_B' as ContainerId,
    weight: 2.9,
    dept: 'ICU',
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
    description: 'Unidentified composite debris with low optical contrast (<80% confidence trigger).',
  },
];

export const AIClassificationPage: React.FC = () => {
  const { segregateWaste, settings, setActivePage, addAlert, addActivityLog, currentUser } = useApp();

  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_IMAGES[0].image);
  const [selectedSample, setSelectedSample] = useState(SAMPLE_IMAGES[0]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AIClassification | null>(null);
  const [userOverriddenCategory, setUserOverriddenCategory] = useState<WasteCategory | null>(null);
  const [manualWeight, setManualWeight] = useState<number>(1.8);
  const [targetDept, setTargetDept] = useState<string>('Emergency');
  const [auditApproved, setAuditApproved] = useState(false);

  // File Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setResult(null);
          setAuditApproved(false);
          setUserOverriddenCategory(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_IMAGES[0]) => {
    setSelectedSample(sample);
    setSelectedImage(sample.image);
    setManualWeight(sample.weight);
    setTargetDept(sample.dept);
    setResult(null);
    setAuditApproved(false);
    setUserOverriddenCategory(null);
  };

  const handleRunClassification = async () => {
    setAnalyzing(true);
    setResult(null);
    setAuditApproved(false);
    setUserOverriddenCategory(null);

    const classification = await classifyWaste({
      imageBase64: selectedImage.startsWith('data:image') ? selectedImage : undefined,
      sampleHint: selectedSample.categoryHint,
      confidenceThreshold: settings.confidenceThreshold,
    });

    setResult(classification);
    setAnalyzing(false);

    if (classification.requires_human_review) {
      addAlert({
        type: 'AI LOW CONFIDENCE',
        severity: 'WARNING',
        message: `Optical analysis confidence (${((classification.confidence ?? 0.8) * 100).toFixed(0)}%) below safety threshold. Human review mandatory.`,
        details: 'Visual verification flagged due to category ambiguity. Automatic segregation suspended.',
        sourceModule: 'AI Classification',
      });
    }
  };

  const handleApprove = () => {
    if (!result) return;
    const finalCategory = userOverriddenCategory || result.category;

    const { wasteRecord, container } = segregateWaste({
      category: finalCategory,
      weightKg: manualWeight,
      confidence: result.confidence,
      department: targetDept,
      explanation: result.explanation,
      riskLevel: result.risk_level,
      imageUrl: selectedImage,
    });

    setAuditApproved(true);
  };

  const handleSendForReview = () => {
    if (!result) return;
    addAlert({
      type: 'HUMAN REVIEW REQUIRED',
      severity: 'WARNING',
      message: `Waste batch from ${targetDept} forwarded to Waste Manager for physical inspection.`,
      details: `Tentative Category: ${result.category}, Confidence: ${((result.confidence ?? 0.8) * 100).toFixed(0)}%.`,
      sourceModule: 'AI Classification',
    });
    addActivityLog({
      user: currentUser.name,
      action: 'Flagged for Human Review',
      module: 'AI Classification',
      description: `Sample flagged for secondary clinical review by Waste Manager.`,
      status: 'WARNING',
    });
    setAuditApproved(true);
  };

  const effectiveCategory = userOverriddenCategory || result?.category;
  const isBelowThreshold = result ? result.confidence < settings.confidenceThreshold || result.category === 'UNKNOWN' : false;

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Header with Electric Purple Module Identity */}
      <div className="bg-gradient-to-r from-purple-50 via-fuchsia-50/50 to-indigo-50 border border-purple-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-700">
              Neural Perception • Electric Purple Module
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-mono font-semibold">
              Multi-Modal Vision Engine
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ScanLine className="w-6 h-6 text-purple-600" />
            AI Waste Classification
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            Computer vision neural classifier for biomedical hazard detection, bin recommendation, and safety thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-purple-100/70 border border-purple-200 text-purple-800 font-semibold">
            Safety Threshold: {(((settings?.confidenceThreshold ?? 0.8)) * 100).toFixed(0)}%
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-sky-100/70 border border-sky-200 text-sky-800 font-semibold">
            {result?.mode === 'AI' ? 'AI MODE (Gemini)' : 'DEMO/HYBRID MODE'}
          </span>
        </div>
      </div>

      {/* Pre-loaded Sample Gallery (Requirement 8 / 29) */}
      <div className="bg-white border border-purple-200/80 rounded-2xl p-4 shadow-2xs">
        <div className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          Pre-Loaded Clinical Waste Samples (Instant Testing & Verification)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                selectedSample.id === sample.id
                  ? 'bg-purple-50/90 border-purple-500 ring-2 ring-purple-300'
                  : 'bg-slate-50 border-slate-200 hover:border-purple-300 hover:bg-purple-50/40'
              }`}
            >
              <div className="h-20 w-full rounded-lg overflow-hidden mb-2 bg-slate-200 relative">
                <img
                  src={sample.image}
                  alt={sample.label}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-slate-900/80 text-[9px] font-mono text-white rounded">
                  {sample.expectedCategory}
                </span>
              </div>
              <div className="font-semibold text-slate-900 text-xs truncate">{sample.label}</div>
              <div className="text-[10px] text-slate-500 truncate">{sample.dept} • {sample.weight} kg</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Inspection Stage (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Canvas & Upload (6 Columns) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Optical Feed / Waste Sample
              </span>
              <span className="text-[11px] font-mono text-slate-400">Target Resolution: 1080p</span>
            </div>

            {/* Viewport with Optical Grid Overlay */}
            <div className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-video flex items-center justify-center group shadow-inner">
              <img
                src={selectedImage}
                alt="Medical waste for classification"
                className="w-full h-full object-cover"
              />

              {/* Scanning Reticle Overlay */}
              <div className="absolute inset-0 pointer-events-none border-2 border-sky-500/40 m-4 rounded-lg flex flex-col justify-between p-3">
                <div className="flex justify-between text-[10px] font-mono font-semibold text-sky-700 bg-white/75 px-1.5 py-0.5 rounded backdrop-blur-xs">
                  <span>FOV: OPTICAL_BIO_01</span>
                  <span>SPECTRAL: VIS/NIR</span>
                </div>
                {analyzing && (
                  <div className="w-full h-1 bg-sky-500 shadow-[0_0_12px_#0284c7] animate-bounce" />
                )}
                <div className="flex justify-between text-[10px] font-mono font-semibold text-sky-700 bg-white/75 px-1.5 py-0.5 rounded backdrop-blur-xs">
                  <span>CONF_GATE: {(((settings?.confidenceThreshold ?? 0.8)) * 100).toFixed(0)}%</span>
                  <span>STATUS: {analyzing ? 'SCANNING...' : 'READY'}</span>
                </div>
              </div>
            </div>

            {/* Sample Meta Inputs */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Department of Origin
                </label>
                <input
                  type="text"
                  value={targetDept}
                  onChange={(e) => setTargetDept(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Scale Reading (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={manualWeight}
                  onChange={(e) => setManualWeight(parseFloat(e.target.value) || 1.0)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Action Bar & File Upload */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer flex items-center gap-1.5 border border-slate-200 transition-colors">
              <UploadCloud className="w-4 h-4 text-slate-600" />
              <span>Upload Custom Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              id="btn-run-ai-classification"
              onClick={handleRunClassification}
              disabled={analyzing}
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Neural Signatures...</span>
                </>
              ) : (
                <>
                  <BrainCircuit className="w-4 h-4" />
                  <span>Run AI Classification</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Output & Decision Panel (6 Columns) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-600" />
                Classification Output & Safety Verification
              </h2>
              {result && (
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    result.mode === 'AI'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  ENGINE: {result.mode}
                </span>
              )}
            </div>

            {!result && !analyzing && (
              <div className="py-16 text-center text-slate-400 text-xs space-y-2">
                <BrainCircuit className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-slate-800 font-semibold text-sm">Optical Classifier Standing By</p>
                <p className="max-w-xs mx-auto text-slate-500">
                  Select a pre-loaded clinical sample or upload a photo, then click "Run AI Classification".
                </p>
              </div>
            )}

            {analyzing && (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full border-3 border-sky-600 border-t-transparent animate-spin mx-auto" />
                <p className="text-slate-900 text-xs font-semibold">Running Computer Vision Model...</p>
                <p className="text-slate-500 text-[11px]">
                  Extracting edge contours, biological luminescence, and puncture hazard characteristics.
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-4 animate-in fade-in">
                {/* Prominent Safety Threshold Alert (Requirement 8 / 18) */}
                {isBelowThreshold ? (
                  <div
                    id="safety-threshold-alert"
                    className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-3"
                  >
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-amber-800 uppercase tracking-wide">
                        HUMAN REVIEW REQUIRED - CONFIDENCE BELOW THRESHOLD (80%)
                      </div>
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        Automatic approval is locked. The visual confidence score (${((result.confidence ?? 0.8) * 100).toFixed(0)}%)
                        is below the clinical safety barrier. Manual Waste Manager sign-off is required before container deposition.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Confidence meets clinical safety protocol (≥80%). Recommendation eligible for automated segregation.
                    </span>
                  </div>
                )}

                {/* Classification Parameters Grid */}
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px]">Identified Category</span>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">
                      {effectiveCategory}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px]">Confidence Score</span>
                    <div className="font-bold font-mono text-sm mt-0.5 flex items-center gap-1.5">
                      <span
                        className={
                          isBelowThreshold ? 'text-amber-700' : 'text-emerald-700'
                        }
                      >
                        {((result.confidence ?? 0.8) * 100).toFixed(0)}%
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        (Threshold: {(((settings?.confidenceThreshold ?? 0.8)) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px]">Recommended Container</span>
                    <div className="font-bold text-sky-700 text-sm mt-0.5 flex items-center gap-1">
                      <Boxes className="w-3.5 h-3.5 text-sky-600" />
                      {result.recommended_container}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px]">Biohazard Risk Level</span>
                    <div className="mt-0.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          result.risk_level === 'CRITICAL'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : result.risk_level === 'HIGH'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {result.risk_level}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-700 font-semibold block mb-1">Optical Neural Rationale:</span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{result.explanation}</p>
                </div>

                {/* Category Override Dropdown */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-medium">Manual Clinician Override:</span>
                  <select
                    value={userOverriddenCategory || result.category}
                    onChange={(e) => setUserOverriddenCategory(e.target.value as WasteCategory)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  >
                    <option value="GENERAL">Container A: GENERAL</option>
                    <option value="INFECTIOUS_SOFT">Container B: INFECTIOUS SOFT</option>
                    <option value="SHARPS">Container C: SHARPS</option>
                    <option value="PHARMACEUTICAL">Container D: PHARMACEUTICAL</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Decision Buttons (Requirement 8) */}
          {result && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              {auditApproved ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <strong>Segregated into Container!</strong> Waste inventory and audit logs updated.
                  </span>
                  <button
                    onClick={() => setActivePage('segregation')}
                    className="text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-lg font-semibold text-[11px] cursor-pointer"
                  >
                    View Containers →
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-end gap-2.5">
                  <button
                    onClick={() => {
                      setResult(null);
                      setUserOverriddenCategory(null);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
                  >
                    Reject Scan
                  </button>

                  {isBelowThreshold ? (
                    <button
                      onClick={handleSendForReview}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 cursor-pointer"
                    >
                      Send for Waste Manager Review
                    </button>
                  ) : (
                    <button
                      id="btn-approve-classification"
                      onClick={handleApprove}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/25 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Virtual Segregate</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
