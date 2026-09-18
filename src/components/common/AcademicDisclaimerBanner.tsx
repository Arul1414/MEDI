import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

export const AcademicDisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      id="academic-disclaimer-banner"
      className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between gap-3 shrink-0"
    >
      <div className="flex items-center gap-2 max-w-5xl">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong className="font-semibold text-amber-950">ACADEMIC PROTOTYPE NOTICE:</strong> This application is an
          academic software prototype for medical-waste management simulation. AI classifications are recommendations
          and must not replace applicable clinical waste-handling regulations, trained personnel, or certified disposal
          procedures. No physical IoT/robotic hardware required.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 hover:bg-amber-100 rounded text-amber-700 transition-colors"
        title="Dismiss notice"
        aria-label="Dismiss disclaimer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
