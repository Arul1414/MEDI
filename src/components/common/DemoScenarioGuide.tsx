import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, ChevronRight, X, Sparkles } from 'lucide-react';

const DEMO_STEPS = [
  { step: 1, title: 'Create Collection Request', page: 'requests', tip: 'Go to Collection Requests and click "New Collection Request" to register an urgent medical waste pickup.' },
  { step: 2, title: 'Assign Mobile Unit', page: 'requests', tip: 'Select request CR-1024 and click "Assign Unit" to dispatch MEDI-01 to Emergency Dept.' },
  { step: 3, title: 'Start Collection Process', page: 'requests', tip: 'Click "Start Collection" on the assigned request to simulate MEDI-01 moving down the corridor.' },
  { step: 4, title: 'Upload Waste Sample', page: 'ai-classification', tip: 'Select the "Used Syringes & Needles" sample or upload a photo in the AI Waste Classification tab.' },
  { step: 5, title: 'Run AI Classification', page: 'ai-classification', tip: 'Click "Run AI Classification" to simulate the multi-modal neural network optical scan.' },
  { step: 6, title: 'Inspect Confidence Score', page: 'ai-classification', tip: 'Verify the confidence score (96%) and check that threshold safety rules (≥80%) are satisfied.' },
  { step: 7, title: 'Approve AI Classification', page: 'ai-classification', tip: 'Click "Approve" to accept the AI recommendation and initiate digital segregation.' },
  { step: 8, title: 'Observe Virtual Segregation', page: 'segregation', tip: 'Watch Container C (Sharps) receive the segregated sharps payload into its virtual vault.' },
  { step: 9, title: 'Container Capacity Update', page: 'segregation', tip: 'Notice Container C fill level reach 91%, approaching safety threshold.' },
  { step: 10, title: 'Automatic Alert Generation', page: 'alerts', tip: 'Check the Alerts tab to see the automated "CONTAINER NEAR FULL" safety alert.' },
  { step: 11, title: 'Complete Collection Workflow', page: 'requests', tip: 'Return to Collection Requests and click "Complete" to return MEDI-01 to base.' },
  { step: 12, title: 'View Analytics & Trends', page: 'analytics', tip: 'Explore the updated waste generation charts, category breakdown, and exportable report.' },
  { step: 13, title: 'Review Regulatory Audit Trail', page: 'logs', tip: 'View the chronological immutable activity log demonstrating full clinical compliance.' },
];

export const DemoScenarioGuide: React.FC = () => {
  const { demoActive, demoStep, advanceDemoScenario, resetDemoScenario, setActivePage } = useApp();

  if (!demoActive || demoStep <= 0) return null;

  const current = DEMO_STEPS[demoStep - 1] || DEMO_STEPS[0];
  const progressPercent = Math.round((demoStep / DEMO_STEPS.length) * 100);

  return (
    <div
      id="demo-scenario-guide"
      className="bg-violet-50/90 border-b border-violet-200 px-4 py-2.5 text-slate-800 shadow-xs relative z-30"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-100 text-violet-700 border border-violet-300">
            <Sparkles className="w-4 h-4 text-violet-600 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-violet-700">
                Interactive Demonstration Mode • Step {demoStep} of {DEMO_STEPS.length}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-violet-200/70 text-violet-800 border border-violet-300">
                {progressPercent}% Completed
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span>{current.title}</span>
              <span className="text-xs text-slate-500 font-normal hidden md:inline">({current.tip})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActivePage(current.page as any);
            }}
            className="px-2.5 py-1 text-xs rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs transition-colors cursor-pointer"
          >
            Go to {current.page}
          </button>

          <button
            onClick={advanceDemoScenario}
            className="px-3 py-1 text-xs rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
          >
            <span>{demoStep === DEMO_STEPS.length ? 'Finish Demo' : 'Next Step'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetDemoScenario}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded transition-colors"
            title="Exit Demo Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
