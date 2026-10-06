import { ContainerId, VirtualContainer, MobileUnit, WasteRecord } from '../types';

export type AuditTimeframe = 'today' | '7d' | '30d' | '90d';

export interface PeriodAuditData {
  timeframe: AuditTimeframe;
  timeframeLabel: string;
  reportId: string;
  cycleName: string;
  dateDescription: string;
  totalWeightKg: number;
  completedPickupsCount: number;
  avgPickupTimeMinutes: string;
  aiAccuracyRate: string;
  humanReviewRate: string;
  avgVaultFillPercent: number;
  containers: Array<{
    id: ContainerId;
    name: string;
    label: string;
    protocol: string;
    weightKg: number;
    capacityPercent: number;
    status: string;
  }>;
  fleetUnits: Array<{
    id: string;
    name: string;
    currentDepartment: string;
    status: string;
    batteryPercent: number;
    collectedKg: number;
  }>;
  departments: Array<{
    name: string;
    weightKg: number;
    percent: number;
  }>;
  confidenceTiers: {
    over90: { count: number; percent: number };
    between80and90: { count: number; percent: number };
    under80: { count: number; percent: number };
    total: number;
  };
}

export function getPeriodAuditMetrics(
  timeframe: AuditTimeframe,
  liveRecords: WasteRecord[],
  liveContainers: VirtualContainer[],
  liveMobileUnits: MobileUnit[]
): PeriodAuditData {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStamp = `${year}${month}${day}`;

  // Calculate live delta from newly deposited waste
  const liveTotal = liveRecords.reduce((sum, r) => sum + (r.weightKg || 0), 0);
  const liveExtra = Math.max(0, liveTotal - 128.6);

  const containerFillAvg = Math.round(
    liveContainers.reduce((acc, c) => acc + c.capacityPercent, 0) / Math.max(1, liveContainers.length)
  );

  switch (timeframe) {
    case 'today': {
      const totalWeightKg = Number((28.4 + liveExtra * 0.8).toFixed(1));
      const cA = Number((12.2 + liveExtra * 0.35).toFixed(1));
      const cB = Number((8.4 + liveExtra * 0.25).toFixed(1));
      const cC = Number((4.3 + liveExtra * 0.12).toFixed(1));
      const cD = Number((3.5 + liveExtra * 0.08).toFixed(1));

      const depts = [
        { name: 'Emergency', weightKg: Number((totalWeightKg * 0.38).toFixed(1)) },
        { name: 'Operation Theatre', weightKg: Number((totalWeightKg * 0.26).toFixed(1)) },
        { name: 'ICU', weightKg: Number((totalWeightKg * 0.18).toFixed(1)) },
        { name: 'Pathology Lab', weightKg: Number((totalWeightKg * 0.10).toFixed(1)) },
        { name: 'Pharmacy', weightKg: Number((totalWeightKg * 0.05).toFixed(1)) },
        { name: 'Ward A', weightKg: Number((totalWeightKg * 0.03).toFixed(1)) },
      ];
      const maxDept = Math.max(...depts.map((d) => d.weightKg), 1);

      return {
        timeframe: 'today',
        timeframeLabel: 'Today (24 Hours)',
        reportId: `AUD-MS-TODAY-${dateStamp}`,
        cycleName: 'Daily Diurnal Shift Manifest (24 Hours)',
        dateDescription: 'Single-Day Operational Shift Tracking',
        totalWeightKg,
        completedPickupsCount: 12 + Math.floor(liveExtra / 2),
        avgPickupTimeMinutes: '11.4 min',
        aiAccuracyRate: '99.1%',
        humanReviewRate: '1.2%',
        avgVaultFillPercent: Math.min(100, Math.round(containerFillAvg * 0.45 + 18)),
        containers: [
          {
            id: 'CONTAINER_A',
            name: 'CONTAINER A',
            label: 'General Waste',
            protocol: 'General Landfill / Material Recovery',
            weightKg: cA,
            capacityPercent: Math.min(100, Math.round((cA / 50) * 100)),
            status: cA >= 45 ? 'NEAR FULL' : 'NORMAL',
          },
          {
            id: 'CONTAINER_B',
            name: 'CONTAINER B',
            label: 'Infectious Soft',
            protocol: 'Thermal Autoclaving & Shredding',
            weightKg: cB,
            capacityPercent: Math.min(100, Math.round((cB / 40) * 100)),
            status: cB >= 35 ? 'NEAR FULL' : 'NORMAL',
          },
          {
            id: 'CONTAINER_C',
            name: 'CONTAINER C',
            label: 'Sharps Waste',
            protocol: 'Encapsulation & Incineration',
            weightKg: cC,
            capacityPercent: Math.min(100, Math.round((cC / 25) * 100)),
            status: cC >= 22 ? 'NEAR FULL' : 'NORMAL',
          },
          {
            id: 'CONTAINER_D',
            name: 'CONTAINER D',
            label: 'Pharmaceutical',
            protocol: 'Hazardous Retort / Incineration',
            weightKg: cD,
            capacityPercent: Math.min(100, Math.round((cD / 30) * 100)),
            status: cD >= 26 ? 'NEAR FULL' : 'NORMAL',
          },
        ],
        fleetUnits: liveMobileUnits.map((u, i) => {
          const yields = [8.8, 8.1, 6.2, 5.3, 4.8];
          const yieldVal = yields[i % yields.length] + Number((liveExtra * 0.2).toFixed(1));
          return {
            id: u.id,
            name: u.name,
            currentDepartment: u.currentDepartment || 'Central Storage Dock',
            status: u.status,
            batteryPercent: u.batteryLevel ?? 100,
            collectedKg: Number(yieldVal.toFixed(1)),
          };
        }),
        departments: depts.map((d) => ({
          ...d,
          percent: Math.round((d.weightKg / maxDept) * 100),
        })),
        confidenceTiers: {
          over90: { count: 38, percent: 88 },
          between80and90: { count: 4, percent: 9 },
          under80: { count: 1, percent: 3 },
          total: 43,
        },
      };
    }

    case '7d': {
      const totalWeightKg = Number((142.8 + liveExtra).toFixed(1));
      const cA = Number((58.6 + liveExtra * 0.4).toFixed(1));
      const cB = Number((43.2 + liveExtra * 0.3).toFixed(1));
      const cC = Number((21.8 + liveExtra * 0.18).toFixed(1));
      const cD = Number((19.2 + liveExtra * 0.12).toFixed(1));

      const depts = [
        { name: 'Emergency', weightKg: Number((totalWeightKg * 0.37).toFixed(1)) },
        { name: 'Operation Theatre', weightKg: Number((totalWeightKg * 0.25).toFixed(1)) },
        { name: 'ICU', weightKg: Number((totalWeightKg * 0.19).toFixed(1)) },
        { name: 'Pathology Lab', weightKg: Number((totalWeightKg * 0.10).toFixed(1)) },
        { name: 'Ward B', weightKg: Number((totalWeightKg * 0.06).toFixed(1)) },
        { name: 'Pharmacy', weightKg: Number((totalWeightKg * 0.03).toFixed(1)) },
      ];
      const maxDept = Math.max(...depts.map((d) => d.weightKg), 1);

      return {
        timeframe: '7d',
        timeframeLabel: '7 Days (Weekly)',
        reportId: `AUD-MS-7D-${dateStamp}`,
        cycleName: 'Weekly Regulatory Summary (7 Days)',
        dateDescription: 'Past 7 Days Rolling Clinical Audit',
        totalWeightKg,
        completedPickupsCount: 48 + Math.floor(liveExtra),
        avgPickupTimeMinutes: '13.8 min',
        aiAccuracyRate: '98.4%',
        humanReviewRate: '2.8%',
        avgVaultFillPercent: Math.min(100, containerFillAvg),
        containers: [
          {
            id: 'CONTAINER_A',
            name: 'CONTAINER A',
            label: 'General Waste',
            protocol: 'General Landfill / Material Recovery',
            weightKg: cA,
            capacityPercent: Math.min(100, Math.round((cA / 75) * 100)),
            status: 'NORMAL',
          },
          {
            id: 'CONTAINER_B',
            name: 'CONTAINER B',
            label: 'Infectious Soft',
            protocol: 'Thermal Autoclaving & Shredding',
            weightKg: cB,
            capacityPercent: Math.min(100, Math.round((cB / 60) * 100)),
            status: 'NORMAL',
          },
          {
            id: 'CONTAINER_C',
            name: 'CONTAINER C',
            label: 'Sharps Waste',
            protocol: 'Encapsulation & Incineration',
            weightKg: cC,
            capacityPercent: Math.min(100, Math.round((cC / 35) * 100)),
            status: 'NORMAL',
          },
          {
            id: 'CONTAINER_D',
            name: 'CONTAINER D',
            label: 'Pharmaceutical',
            protocol: 'Hazardous Retort / Incineration',
            weightKg: cD,
            capacityPercent: Math.min(100, Math.round((cD / 35) * 100)),
            status: 'NORMAL',
          },
        ],
        fleetUnits: liveMobileUnits.map((u, i) => {
          const yields = [42.5, 38.2, 29.8, 32.3, 24.5];
          const yieldVal = yields[i % yields.length] + Number((liveExtra * 0.25).toFixed(1));
          return {
            id: u.id,
            name: u.name,
            currentDepartment: u.currentDepartment || 'Central Storage Dock',
            status: u.status,
            batteryPercent: u.batteryLevel ?? 100,
            collectedKg: Number(yieldVal.toFixed(1)),
          };
        }),
        departments: depts.map((d) => ({
          ...d,
          percent: Math.round((d.weightKg / maxDept) * 100),
        })),
        confidenceTiers: {
          over90: { count: 168, percent: 85 },
          between80and90: { count: 24, percent: 12 },
          under80: { count: 6, percent: 3 },
          total: 198,
        },
      };
    }

    case '30d': {
      const totalWeightKg = Number((612.4 + liveExtra * 2.5).toFixed(1));
      const cA = Number((251.2 + liveExtra * 1.0).toFixed(1));
      const cB = Number((184.6 + liveExtra * 0.7).toFixed(1));
      const cC = Number((94.2 + liveExtra * 0.45).toFixed(1));
      const cD = Number((82.4 + liveExtra * 0.35).toFixed(1));

      const depts = [
        { name: 'Emergency', weightKg: Number((totalWeightKg * 0.36).toFixed(1)) },
        { name: 'Operation Theatre', weightKg: Number((totalWeightKg * 0.27).toFixed(1)) },
        { name: 'ICU', weightKg: Number((totalWeightKg * 0.18).toFixed(1)) },
        { name: 'Pathology Lab', weightKg: Number((totalWeightKg * 0.09).toFixed(1)) },
        { name: 'Ward B', weightKg: Number((totalWeightKg * 0.06).toFixed(1)) },
        { name: 'Pharmacy', weightKg: Number((totalWeightKg * 0.04).toFixed(1)) },
      ];
      const maxDept = Math.max(...depts.map((d) => d.weightKg), 1);

      return {
        timeframe: '30d',
        timeframeLabel: '30 Days (Monthly)',
        reportId: `AUD-MS-30D-${dateStamp}`,
        cycleName: 'Monthly Hospital Audit Inspection (30 Days)',
        dateDescription: 'Past 30 Days Consolidated Departmental Audit',
        totalWeightKg,
        completedPickupsCount: 198 + Math.floor(liveExtra * 3),
        avgPickupTimeMinutes: '14.2 min',
        aiAccuracyRate: '98.2%',
        humanReviewRate: '3.1%',
        avgVaultFillPercent: Math.min(100, Math.round(containerFillAvg * 1.1 + 5)),
        containers: [
          {
            id: 'CONTAINER_A',
            name: 'CONTAINER A',
            label: 'General Waste',
            protocol: 'General Landfill / Material Recovery',
            weightKg: cA,
            capacityPercent: 78,
            status: 'NORMAL',
          },
          {
            id: 'CONTAINER_B',
            name: 'CONTAINER B',
            label: 'Infectious Soft',
            protocol: 'Thermal Autoclaving & Shredding',
            weightKg: cB,
            capacityPercent: 82,
            status: 'NEAR FULL',
          },
          {
            id: 'CONTAINER_C',
            name: 'CONTAINER C',
            label: 'Sharps Waste',
            protocol: 'Encapsulation & Incineration',
            weightKg: cC,
            capacityPercent: 71,
            status: 'NORMAL',
          },
          {
            id: 'CONTAINER_D',
            name: 'CONTAINER D',
            label: 'Pharmaceutical',
            protocol: 'Hazardous Retort / Incineration',
            weightKg: cD,
            capacityPercent: 68,
            status: 'NORMAL',
          },
        ],
        fleetUnits: liveMobileUnits.map((u, i) => {
          const yields = [182.4, 164.5, 132.8, 132.7, 108.2];
          const yieldVal = yields[i % yields.length] + Number((liveExtra * 0.6).toFixed(1));
          return {
            id: u.id,
            name: u.name,
            currentDepartment: u.currentDepartment || 'Central Storage Dock',
            status: u.status,
            batteryPercent: u.batteryLevel ?? 100,
            collectedKg: Number(yieldVal.toFixed(1)),
          };
        }),
        departments: depts.map((d) => ({
          ...d,
          percent: Math.round((d.weightKg / maxDept) * 100),
        })),
        confidenceTiers: {
          over90: { count: 724, percent: 83 },
          between80and90: { count: 118, percent: 14 },
          under80: { count: 28, percent: 3 },
          total: 870,
        },
      };
    }

    case '90d': {
      const totalWeightKg = Number((1845.6 + liveExtra * 6).toFixed(1));
      const cA = Number((756.8 + liveExtra * 2.4).toFixed(1));
      const cB = Number((554.2 + liveExtra * 1.8).toFixed(1));
      const cC = Number((284.1 + liveExtra * 1.0).toFixed(1));
      const cD = Number((250.5 + liveExtra * 0.8).toFixed(1));

      const depts = [
        { name: 'Emergency', weightKg: Number((totalWeightKg * 0.36).toFixed(1)) },
        { name: 'Operation Theatre', weightKg: Number((totalWeightKg * 0.26).toFixed(1)) },
        { name: 'ICU', weightKg: Number((totalWeightKg * 0.19).toFixed(1)) },
        { name: 'Pathology Lab', weightKg: Number((totalWeightKg * 0.09).toFixed(1)) },
        { name: 'Ward B', weightKg: Number((totalWeightKg * 0.06).toFixed(1)) },
        { name: 'Pharmacy', weightKg: Number((totalWeightKg * 0.04).toFixed(1)) },
      ];
      const maxDept = Math.max(...depts.map((d) => d.weightKg), 1);

      return {
        timeframe: '90d',
        timeframeLabel: '90 Days (Quarterly)',
        reportId: `AUD-MS-90D-${dateStamp}`,
        cycleName: 'Quarterly Biohazard Environmental Filing (90 Days)',
        dateDescription: 'Past 90 Days Hospital Comprehensive Filing',
        totalWeightKg,
        completedPickupsCount: 594 + Math.floor(liveExtra * 8),
        avgPickupTimeMinutes: '14.8 min',
        aiAccuracyRate: '97.9%',
        humanReviewRate: '3.8%',
        avgVaultFillPercent: 86,
        containers: [
          {
            id: 'CONTAINER_A',
            name: 'CONTAINER A',
            label: 'General Waste',
            protocol: 'General Landfill / Material Recovery',
            weightKg: cA,
            capacityPercent: 88,
            status: 'NEAR FULL',
          },
          {
            id: 'CONTAINER_B',
            name: 'CONTAINER B',
            label: 'Infectious Soft',
            protocol: 'Thermal Autoclaving & Shredding',
            weightKg: cB,
            capacityPercent: 91,
            status: 'NEAR FULL',
          },
          {
            id: 'CONTAINER_C',
            name: 'CONTAINER C',
            label: 'Sharps Waste',
            protocol: 'Encapsulation & Incineration',
            weightKg: cC,
            capacityPercent: 84,
            status: 'NEAR FULL',
          },
          {
            id: 'CONTAINER_D',
            name: 'CONTAINER D',
            label: 'Pharmaceutical',
            protocol: 'Hazardous Retort / Incineration',
            weightKg: cD,
            capacityPercent: 79,
            status: 'NORMAL',
          },
        ],
        fleetUnits: liveMobileUnits.map((u, i) => {
          const yields = [548.2, 495.6, 401.4, 400.4, 325.8];
          const yieldVal = yields[i % yields.length] + Number((liveExtra * 1.5).toFixed(1));
          return {
            id: u.id,
            name: u.name,
            currentDepartment: u.currentDepartment || 'Central Storage Dock',
            status: u.status,
            batteryPercent: u.batteryLevel ?? 100,
            collectedKg: Number(yieldVal.toFixed(1)),
          };
        }),
        departments: depts.map((d) => ({
          ...d,
          percent: Math.round((d.weightKg / maxDept) * 100),
        })),
        confidenceTiers: {
          over90: { count: 2210, percent: 82 },
          between80and90: { count: 385, percent: 14 },
          under80: { count: 95, percent: 4 },
          total: 2690,
        },
      };
    }
  }
}
