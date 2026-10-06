export interface VehicleTheme {
  primary: string; // Hex color
  bgClass: string;
  textClass: string;
  lightBgClass: string;
  borderClass: string;
  ringClass: string;
  badgeClass: string;
  dotClass: string;
  gradientClass: string;
  name: string;
}

export const VEHICLE_COLORS: Record<string, VehicleTheme> = {
  'MEDI-01': {
    primary: '#6366f1',
    bgClass: 'bg-indigo-600',
    textClass: 'text-indigo-600',
    lightBgClass: 'bg-indigo-50',
    borderClass: 'border-indigo-300',
    ringClass: 'ring-indigo-400',
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    dotClass: 'bg-indigo-500',
    gradientClass: 'from-indigo-600 to-violet-700',
    name: 'Electric Indigo',
  },
  'MEDI-02': {
    primary: '#059669',
    bgClass: 'bg-emerald-600',
    textClass: 'text-emerald-600',
    lightBgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-300',
    ringClass: 'ring-emerald-400',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    dotClass: 'bg-emerald-500',
    gradientClass: 'from-emerald-600 to-teal-700',
    name: 'Clinical Emerald',
  },
  'MEDI-03': {
    primary: '#0284c7',
    bgClass: 'bg-sky-600',
    textClass: 'text-sky-600',
    lightBgClass: 'bg-sky-50',
    borderClass: 'border-sky-300',
    ringClass: 'ring-sky-400',
    badgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
    dotClass: 'bg-sky-500',
    gradientClass: 'from-sky-600 to-cyan-700',
    name: 'Cyan Sapphire',
  },
  'MEDI-04': {
    primary: '#ea580c',
    bgClass: 'bg-orange-600',
    textClass: 'text-orange-600',
    lightBgClass: 'bg-orange-50',
    borderClass: 'border-orange-300',
    ringClass: 'ring-orange-400',
    badgeClass: 'bg-orange-100 text-orange-900 border-orange-300',
    dotClass: 'bg-orange-500',
    gradientClass: 'from-orange-600 to-amber-700',
    name: 'Tangerine Amber',
  },
  'MEDI-05': {
    primary: '#e11d48',
    bgClass: 'bg-rose-600',
    textClass: 'text-rose-600',
    lightBgClass: 'bg-rose-50',
    borderClass: 'border-rose-300',
    ringClass: 'ring-rose-400',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
    dotClass: 'bg-rose-500',
    gradientClass: 'from-rose-600 to-pink-700',
    name: 'Bio-Crimson Rose',
  },
};

export const getVehicleTheme = (id: string): VehicleTheme => {
  return (
    VEHICLE_COLORS[id] || {
      primary: '#64748b',
      bgClass: 'bg-slate-700',
      textClass: 'text-slate-700',
      lightBgClass: 'bg-slate-50',
      borderClass: 'border-slate-300',
      ringClass: 'ring-slate-400',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
      dotClass: 'bg-slate-500',
      gradientClass: 'from-slate-600 to-slate-800',
      name: 'Slate Command',
    }
  );
};
