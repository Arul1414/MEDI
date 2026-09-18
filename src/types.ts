export type UserRole = 'ADMIN' | 'WASTE_MANAGER' | 'STAFF';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string;
  badgeNumber: string;
  lastActive: string;
}

export type WasteCategory =
  | 'GENERAL'
  | 'INFECTIOUS_SOFT'
  | 'SHARPS'
  | 'PHARMACEUTICAL'
  | 'UNKNOWN';

export type ContainerId =
  | 'CONTAINER_A'
  | 'CONTAINER_B'
  | 'CONTAINER_C'
  | 'CONTAINER_D';

export type ContainerStatus = 'NORMAL' | 'FILLING' | 'NEAR FULL' | 'FULL';

export interface VirtualContainer {
  id: ContainerId;
  name: string; // e.g. "CONTAINER A"
  label: string; // e.g. "General Waste"
  category: WasteCategory;
  color: string; // Hex or theme class
  capacityKg: number;
  currentWeightKg: number;
  capacityPercent: number;
  itemCount: number;
  status: ContainerStatus;
  lastUpdated: string;
  description: string;
}

export type RequestStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'COLLECTING'
  | 'COLLECTED'
  | 'COMPLETED'
  | 'CANCELLED';

export type RequestPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface CollectionRequest {
  id: string; // e.g. "CR-1024"
  department: string;
  category?: WasteCategory;
  estimatedQuantityKg: number;
  priority: RequestPriority;
  requestedDate: string;
  requestedTime: string;
  notes: string;
  status: RequestStatus;
  assignedUnitId?: string;
  requestedBy: string;
  collectedAt?: string;
  completedAt?: string;
  wasteRecordId?: string;
}

export type MobileUnitStatus =
  | 'AVAILABLE'
  | 'ASSIGNED'
  | 'COLLECTING'
  | 'RETURNING'
  | 'MAINTENANCE'
  | 'OFFLINE';

export interface MobileUnit {
  id: string; // e.g. "MEDI-01"
  name: string;
  status: MobileUnitStatus;
  assignedRequestId?: string;
  currentDepartment: string;
  batteryLevel: number; // 0-100 percentage
  collectionProgress: number; // 0-100 percentage
  currentTask: string;
  lastActivity: string;
  speedMps: number;
  coordinates: { x: number; y: number }; // Relative position on map (0-100%)
  targetCoordinates?: { x: number; y: number };
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface WasteRecord {
  id: string; // e.g. "WR-2091"
  category: WasteCategory;
  department: string;
  weightKg: number;
  classification: string;
  confidence: number; // 0.00 to 1.00
  containerId: ContainerId;
  collectedBy: string; // Unit ID or user name
  date: string;
  time: string;
  status: 'VERIFIED' | 'REVIEWED' | 'FLAGGED';
  riskLevel: RiskLevel;
  imageUrl?: string;
  explanation?: string;
  reviewedBy?: string;
}

export type AlertType =
  | 'CONTAINER NEAR FULL'
  | 'CONTAINER FULL'
  | 'LOW SIMULATED BATTERY'
  | 'HIGH PRIORITY COLLECTION'
  | 'AI HUMAN REVIEW REQUIRED'
  | 'COLLECTION DELAY'
  | 'SYSTEM WARNING';

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  details?: string;
  timestamp: string;
  read: boolean;
  sourceModule: string;
  resolved?: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  description: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT' | 'INFO';
}

export interface AIClassification {
  category: WasteCategory;
  confidence: number;
  recommended_container: ContainerId;
  risk_level: RiskLevel;
  requires_human_review: boolean;
  explanation: string;
  mode?: 'AI' | 'DEMO';
}

export interface SystemSettings {
  confidenceThreshold: number; // e.g. 0.80 (80%)
  simulationActive: boolean;
  simulationSpeedMs: number;
  alertSoundEnabled: boolean;
  autoSegregationAllowed: boolean;
  hospitalSiteName: string;
  theme: 'dark' | 'light' | 'system';
}

export type NavigationPage =
  | 'dashboard'
  | 'requests'
  | 'ai-classification'
  | 'segregation'
  | 'mobile-units'
  | 'inventory'
  | 'alerts'
  | 'analytics'
  | 'logs'
  | 'assistant'
  | 'users'
  | 'settings';
