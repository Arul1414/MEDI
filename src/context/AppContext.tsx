import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  UserRole,
  CollectionRequest,
  WasteRecord,
  MobileUnit,
  VirtualContainer,
  Alert,
  ActivityLog,
  SystemSettings,
  NavigationPage,
  ContainerId,
  WasteCategory,
  RiskLevel,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_COLLECTION_REQUESTS,
  INITIAL_WASTE_RECORDS,
  INITIAL_MOBILE_UNITS,
  INITIAL_CONTAINERS,
  INITIAL_ALERTS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_SETTINGS,
} from '../mockData';

interface AppContextType {
  currentUser: User;
  users: User[];
  collectionRequests: CollectionRequest[];
  wasteRecords: WasteRecord[];
  mobileUnits: MobileUnit[];
  containers: VirtualContainer[];
  alerts: Alert[];
  activityLogs: ActivityLog[];
  settings: SystemSettings;
  activePage: NavigationPage;
  pageHistory: NavigationPage[];
  canGoBack: boolean;
  auditReportOpen: boolean;
  globalSearchQuery: string;
  demoStep: number;
  demoActive: boolean;
  selectedRequest: CollectionRequest | null;
  selectedWasteRecord: WasteRecord | null;

  // Actions
  setActivePage: (page: NavigationPage) => void;
  goBack: () => void;
  setAuditReportOpen: (open: boolean) => void;
  generateAuditReport: () => void;
  closeAuditReport: () => void;
  setCurrentUser: (user: User) => void;
  switchUserRole: (role: UserRole) => void;
  addUser: (user: Omit<User, 'id' | 'lastActive'>) => void;
  setGlobalSearchQuery: (query: string) => void;
  setSelectedRequest: (req: CollectionRequest | null) => void;
  setSelectedWasteRecord: (rec: WasteRecord | null) => void;

  createCollectionRequest: (data: {
    department: string;
    category?: WasteCategory;
    estimatedQuantityKg: number;
    priority: CollectionRequest['priority'];
    requestedDate: string;
    requestedTime: string;
    notes: string;
  }) => string;
  assignMobileUnit: (requestId: string, unitId: string) => void;
  startCollection: (requestId: string) => void;
  markCollected: (requestId: string) => void;
  completeRequest: (requestId: string) => void;
  cancelRequest: (requestId: string, reason?: string) => void;

  segregateWaste: (data: {
    category: WasteCategory;
    weightKg: number;
    confidence: number;
    department: string;
    explanation: string;
    riskLevel: RiskLevel;
    imageUrl?: string;
    requestId?: string;
  }) => { wasteRecord: WasteRecord; container: VirtualContainer };

  emptyContainer: (containerId: ContainerId) => void;
  updateContainerManual: (containerId: ContainerId, weightDelta: number) => void;
  chargeMobileUnit: (unitId: string) => void;
  recallMobileUnit: (unitId: string) => void;

  markAlertRead: (alertId: string) => void;
  markAllAlertsRead: () => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) => void;
  dismissAlert: (alertId: string) => void;

  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;

  // Guided demo scenario
  startDemoScenario: () => void;
  advanceDemoScenario: () => void;
  resetDemoScenario: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[1]); // Default to Waste Manager Marcus Brody
  const [collectionRequests, setCollectionRequests] = useState<CollectionRequest[]>(INITIAL_COLLECTION_REQUESTS);
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>(INITIAL_WASTE_RECORDS);
  const [mobileUnits, setMobileUnits] = useState<MobileUnit[]>(INITIAL_MOBILE_UNITS);
  const [containers, setContainers] = useState<VirtualContainer[]>(INITIAL_CONTAINERS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [activePage, setActivePageState] = useState<NavigationPage>('dashboard');
  const [pageHistory, setPageHistory] = useState<NavigationPage[]>([]);
  const [auditReportOpen, setAuditReportOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<CollectionRequest | null>(null);
  const [selectedWasteRecord, setSelectedWasteRecord] = useState<WasteRecord | null>(null);

  // Navigation with history tracking
  const setActivePage = useCallback((newPage: NavigationPage) => {
    setActivePageState((prev) => {
      if (prev !== newPage) {
        setPageHistory((hist) => [...hist, prev]);
      }
      return newPage;
    });
  }, []);

  const goBack = useCallback(() => {
    if (auditReportOpen) {
      setAuditReportOpen(false);
      return;
    }
    setPageHistory((prev) => {
      if (prev.length === 0) {
        setActivePageState('dashboard');
        return [];
      }
      const last = prev[prev.length - 1];
      setActivePageState(last);
      return prev.slice(0, -1);
    });
  }, [auditReportOpen]);

  const generateAuditReport = useCallback(() => {
    setAuditReportOpen(true);
  }, []);

  const closeAuditReport = useCallback(() => {
    setAuditReportOpen(false);
  }, []);

  const canGoBack = pageHistory.length > 0 || auditReportOpen || activePage !== 'dashboard';

  // Demo Walkthrough Mode
  const [demoActive, setDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // Helper to format timestamp
  const getNowFormatted = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const addActivityLog = useCallback((log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      ...log,
      id: `LOG-${Date.now().toString().slice(-5)}`,
      timestamp: getNowFormatted(),
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  }, []);

  const addAlert = useCallback((alertData: Omit<Alert, 'id' | 'timestamp' | 'read'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: `ALT-${Date.now().toString().slice(-4)}`,
      timestamp: getNowFormatted(),
      read: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  }, []);

  const switchUserRole = useCallback((role: UserRole) => {
    const matchingUser = users.find((u) => u.role === role) || users[0];
    setCurrentUser(matchingUser);
    addActivityLog({
      user: matchingUser.name,
      action: 'Role Switched',
      module: 'Users',
      description: `Active interface switched to ${role} (${matchingUser.name}).`,
      status: 'INFO',
    });
  }, [users, addActivityLog]);

  const addUser = useCallback((userData: Omit<User, 'id' | 'lastActive'>) => {
    const newUser: User = {
      ...userData,
      id: `USR-${(users.length + 1).toString().padStart(2, '0')}`,
      lastActive: 'Just now',
    };
    setUsers((prev) => [...prev, newUser]);
    addActivityLog({
      user: currentUser.name,
      action: 'User Registered',
      module: 'Users',
      description: `Registered new user ${newUser.name} with role ${newUser.role} in ${newUser.department}.`,
      status: 'SUCCESS',
    });
  }, [users.length, currentUser.name, addActivityLog]);

  const createCollectionRequest = useCallback(
    (data: {
      department: string;
      category?: WasteCategory;
      estimatedQuantityKg: number;
      priority: CollectionRequest['priority'];
      requestedDate: string;
      requestedTime: string;
      notes: string;
    }) => {
      const newId = `CR-${1000 + collectionRequests.length + 1}`;
      const newReq: CollectionRequest = {
        ...data,
        id: newId,
        status: 'PENDING',
        requestedBy: currentUser.name,
      };

      setCollectionRequests((prev) => [newReq, ...prev]);

      addActivityLog({
        user: currentUser.name,
        action: 'Request Created',
        module: 'Collection Requests',
        description: `Collection request ${newId} created for ${data.department} (${data.estimatedQuantityKg} kg, ${data.priority} priority).`,
        status: 'INFO',
      });

      if (data.priority === 'URGENT' || data.priority === 'HIGH') {
        addAlert({
          type: 'HIGH PRIORITY COLLECTION',
          severity: 'WARNING',
          message: `New ${data.priority} collection request ${newId} logged from ${data.department}.`,
          details: `Estimated ${data.estimatedQuantityKg} kg waste. Quick mobile unit dispatch recommended.`,
          sourceModule: 'Collection Requests',
        });
      }

      return newId;
    },
    [collectionRequests.length, currentUser.name, addActivityLog, addAlert]
  );

  const assignMobileUnit = useCallback(
    (requestId: string, unitId: string) => {
      setCollectionRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'ASSIGNED', assignedUnitId: unitId } : r))
      );

      const targetReq = collectionRequests.find((r) => r.id === requestId);
      const dept = targetReq?.department || 'Corridor';

      setMobileUnits((prev) =>
        prev.map((u) =>
          u.id === unitId
            ? {
                ...u,
                status: 'ASSIGNED',
                assignedRequestId: requestId,
                currentTask: `Assigned to request ${requestId} at ${dept}`,
                lastActivity: getNowFormatted(),
              }
            : u
        )
      );

      addActivityLog({
        user: currentUser.name,
        action: 'Unit Assigned',
        module: 'Mobile Units',
        description: `${unitId} assigned to collection request ${requestId} (${dept}).`,
        status: 'SUCCESS',
      });
    },
    [collectionRequests, currentUser.name, addActivityLog]
  );

  const startCollection = useCallback(
    (requestId: string) => {
      const req = collectionRequests.find((r) => r.id === requestId);
      setCollectionRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'COLLECTING' } : r))
      );

      if (req?.assignedUnitId) {
        setMobileUnits((prev) =>
          prev.map((u) =>
            u.id === req.assignedUnitId
              ? {
                  ...u,
                  status: 'COLLECTING',
                  collectionProgress: 20,
                  currentDepartment: req.department,
                  currentTask: `In-transit collection at ${req.department}`,
                  lastActivity: getNowFormatted(),
                }
              : u
          )
        );
      }

      addActivityLog({
        user: req?.assignedUnitId || currentUser.name,
        action: 'Collection Started',
        module: 'Mobile Units',
        description: `Collection process started for request ${requestId} at ${req?.department}.`,
        status: 'SUCCESS',
      });
    },
    [collectionRequests, currentUser.name, addActivityLog]
  );

  const markCollected = useCallback(
    (requestId: string) => {
      const nowTime = getNowFormatted();
      setCollectionRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'COLLECTED', collectedAt: nowTime } : r))
      );

      addActivityLog({
        user: currentUser.name,
        action: 'Waste Collected',
        module: 'Collection Requests',
        description: `Waste physically collected from department for request ${requestId}. Ready for segregation.`,
        status: 'SUCCESS',
      });
    },
    [currentUser.name, addActivityLog]
  );

  const completeRequest = useCallback(
    (requestId: string) => {
      const req = collectionRequests.find((r) => r.id === requestId);
      const nowTime = getNowFormatted();

      setCollectionRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'COMPLETED', completedAt: nowTime } : r))
      );

      if (req?.assignedUnitId) {
        setMobileUnits((prev) =>
          prev.map((u) =>
            u.id === req.assignedUnitId
              ? {
                  ...u,
                  status: 'RETURNING',
                  assignedRequestId: undefined,
                  collectionProgress: 100,
                  currentTask: 'Returning to central storage docking station',
                  lastActivity: nowTime,
                }
              : u
          )
        );
      }

      addActivityLog({
        user: currentUser.name,
        action: 'Collection Completed',
        module: 'Collection Requests',
        description: `Request ${requestId} marked COMPLETED. Mobile unit returning to docking bay.`,
        status: 'SUCCESS',
      });
    },
    [collectionRequests, currentUser.name, addActivityLog]
  );

  const cancelRequest = useCallback(
    (requestId: string, reason?: string) => {
      const req = collectionRequests.find((r) => r.id === requestId);
      setCollectionRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'CANCELLED', notes: `${r.notes} [Cancelled: ${reason || 'By user'}]` } : r))
      );

      if (req?.assignedUnitId) {
        setMobileUnits((prev) =>
          prev.map((u) =>
            u.id === req.assignedUnitId
              ? {
                  ...u,
                  status: 'AVAILABLE',
                  assignedRequestId: undefined,
                  currentTask: 'Docked at Base Station',
                  lastActivity: getNowFormatted(),
                }
              : u
          )
        );
      }

      addActivityLog({
        user: currentUser.name,
        action: 'Request Cancelled',
        module: 'Collection Requests',
        description: `Request ${requestId} was cancelled (${reason || 'Standard cancellation'}).`,
        status: 'WARNING',
      });
    },
    [collectionRequests, currentUser.name, addActivityLog]
  );

  // Digital Segregation Engine
  const segregateWaste = useCallback(
    (data: {
      category: WasteCategory;
      weightKg: number;
      confidence: number;
      department: string;
      explanation: string;
      riskLevel: RiskLevel;
      imageUrl?: string;
      requestId?: string;
    }) => {
      let targetContainerId: ContainerId = 'CONTAINER_A';
      if (data.category === 'INFECTIOUS_SOFT' || data.category === 'UNKNOWN') {
        targetContainerId = 'CONTAINER_B';
      } else if (data.category === 'SHARPS') {
        targetContainerId = 'CONTAINER_C';
      } else if (data.category === 'PHARMACEUTICAL') {
        targetContainerId = 'CONTAINER_D';
      }

      const newRecordId = `WR-${2100 + wasteRecords.length + 1}`;
      const isReviewRequired = data.confidence < settings.confidenceThreshold || data.category === 'UNKNOWN';

      const newRecord: WasteRecord = {
        id: newRecordId,
        category: data.category,
        department: data.department,
        weightKg: Number(((data.weightKg ?? 0)).toFixed(1)),
        classification: data.category,
        confidence: Number(((data.confidence ?? 0.85)).toFixed(2)),
        containerId: targetContainerId,
        collectedBy: currentUser.name,
        date: new Date().toISOString().slice(0, 10),
        time: getNowFormatted(),
        status: isReviewRequired ? 'FLAGGED' : 'VERIFIED',
        riskLevel: data.riskLevel,
        imageUrl: data.imageUrl,
        explanation: data.explanation,
      };

      setWasteRecords((prev) => [newRecord, ...prev]);

      // Update virtual container capacity
      let updatedContainer: VirtualContainer = containers[0];
      setContainers((prev) =>
        prev.map((c) => {
          if (c.id === targetContainerId) {
            const newWeight = Number(((c.currentWeightKg ?? 0) + (data.weightKg ?? 0)).toFixed(1));
            const newPercent = Math.min(100, Math.round((newWeight / c.capacityKg) * 100));
            let newStatus: VirtualContainer['status'] = 'NORMAL';

            if (newPercent >= 95) {
              newStatus = 'FULL';
            } else if (newPercent >= 80) {
              newStatus = 'NEAR FULL';
            } else if (newPercent >= 50) {
              newStatus = 'FILLING';
            }

            const updated: VirtualContainer = {
              ...c,
              currentWeightKg: newWeight,
              capacityPercent: newPercent,
              itemCount: c.itemCount + 1,
              status: newStatus,
              lastUpdated: getNowFormatted(),
            };
            updatedContainer = updated;

            // Generate automated alerts for capacity thresholds
            if (newPercent >= 95) {
              addAlert({
                type: 'CONTAINER FULL',
                severity: 'CRITICAL',
                message: `${c.name} (${c.label}) has reached ${newPercent}% capacity (${newWeight} / ${c.capacityKg} kg)!`,
                details: 'CRITICAL: Container is full. Automated locking engaged. Immediate decanting and safe disposal required.',
                sourceModule: 'Segregation Center',
              });
            } else if (newPercent >= 80) {
              addAlert({
                type: 'CONTAINER NEAR FULL',
                severity: 'WARNING',
                message: `${c.name} (${c.label}) is approaching full capacity at ${newPercent}% (${newWeight} / ${c.capacityKg} kg).`,
                details: 'Prepare replacement containment bin before threshold limit is reached.',
                sourceModule: 'Segregation Center',
              });
            }

            return updated;
          }
          return c;
        })
      );

      // Audit logs
      addActivityLog({
        user: currentUser.name,
        action: 'Virtual Segregation',
        module: 'Segregation Center',
        description: `Deposited ${data.weightKg} kg of ${data.category} into ${targetContainerId} (${newRecordId}).`,
        status: isReviewRequired ? 'WARNING' : 'SUCCESS',
      });

      addActivityLog({
        user: 'SYSTEM',
        action: 'Audit Record Created',
        module: 'Activity Logs',
        description: `Audit token generated for waste record ${newRecordId} with hash verification.`,
        status: 'INFO',
      });

      // If associated with a request, mark request collected/completed
      if (data.requestId) {
        setCollectionRequests((prev) =>
          prev.map((r) =>
            r.id === data.requestId
              ? {
                  ...r,
                  status: 'COMPLETED',
                  completedAt: getNowFormatted(),
                  wasteRecordId: newRecordId,
                }
              : r
          )
        );
      }

      return { wasteRecord: newRecord, container: updatedContainer };
    },
    [wasteRecords.length, settings.confidenceThreshold, currentUser.name, containers, addAlert, addActivityLog]
  );

  const emptyContainer = useCallback(
    (containerId: ContainerId) => {
      setContainers((prev) =>
        prev.map((c) => {
          if (c.id === containerId) {
            return {
              ...c,
              currentWeightKg: 0.0,
              capacityPercent: 0,
              itemCount: 0,
              status: 'NORMAL',
              lastUpdated: getNowFormatted(),
            };
          }
          return c;
        })
      );

      const target = containers.find((c) => c.id === containerId);
      addActivityLog({
        user: currentUser.name,
        action: 'Container Dispatched/Emptied',
        module: 'Segregation Center',
        description: `${target?.name || containerId} (${target?.label}) decanted and reset to 0 kg. Biohazard manifest signed.`,
        status: 'SUCCESS',
      });
    },
    [containers, currentUser.name, addActivityLog]
  );

  const updateContainerManual = useCallback((containerId: ContainerId, weightDelta: number) => {
    setContainers((prev) =>
      prev.map((c) => {
        if (c.id === containerId) {
          const newWeight = Math.max(0, Number(((c.currentWeightKg ?? 0) + weightDelta).toFixed(1)));
          const newPercent = Math.min(100, Math.round((newWeight / c.capacityKg) * 100));
          let newStatus: VirtualContainer['status'] = 'NORMAL';
          if (newPercent >= 95) newStatus = 'FULL';
          else if (newPercent >= 80) newStatus = 'NEAR FULL';
          else if (newPercent >= 50) newStatus = 'FILLING';

          return {
            ...c,
            currentWeightKg: newWeight,
            capacityPercent: newPercent,
            itemCount: Math.max(0, c.itemCount + (weightDelta > 0 ? 1 : -1)),
            status: newStatus,
            lastUpdated: getNowFormatted(),
          };
        }
        return c;
      })
    );
  }, []);

  const chargeMobileUnit = useCallback(
    (unitId: string) => {
      setMobileUnits((prev) =>
        prev.map((u) => (u.id === unitId ? { ...u, batteryLevel: 100, lastActivity: getNowFormatted() } : u))
      );
      addActivityLog({
        user: currentUser.name,
        action: 'Fast Charge Initiated',
        module: 'Mobile Units',
        description: `${unitId} battery replenished to 100% via inductive fast-charger.`,
        status: 'SUCCESS',
      });
    },
    [currentUser.name, addActivityLog]
  );

  const recallMobileUnit = useCallback(
    (unitId: string) => {
      setMobileUnits((prev) =>
        prev.map((u) =>
          u.id === unitId
            ? {
                ...u,
                status: 'AVAILABLE',
                assignedRequestId: undefined,
                currentDepartment: 'Storage',
                collectionProgress: 0,
                currentTask: 'Recalled to Central Storage Base Station',
                lastActivity: getNowFormatted(),
                coordinates: { x: 50, y: 50 },
              }
            : u
        )
      );
      addActivityLog({
        user: currentUser.name,
        action: 'Unit Recalled',
        module: 'Mobile Units',
        description: `${unitId} recalled manually to Central Storage Base Station.`,
        status: 'INFO',
      });
    },
    [currentUser.name, addActivityLog]
  );

  const markAlertRead = useCallback((alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, read: true } : a)));
  }, []);

  const markAllAlertsRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  const updateSettings = useCallback(
    (newSettings: Partial<SystemSettings>) => {
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };
        return updated;
      });
      addActivityLog({
        user: currentUser.name,
        action: 'Settings Updated',
        module: 'Settings',
        description: `System preferences updated: Threshold=${(((newSettings.confidenceThreshold ?? settings.confidenceThreshold) ?? 0.8) * 100).toFixed(0)}%, Simulation=${newSettings.simulationActive ?? settings.simulationActive ? 'ON' : 'OFF'}.`,
        status: 'INFO',
      });
    },
    [currentUser.name, settings, addActivityLog]
  );

  // Guided Demo Scenario
  const startDemoScenario = useCallback(() => {
    setDemoActive(true);
    setDemoStep(1);
    setActivePage('requests');
    addActivityLog({
      user: currentUser.name,
      action: 'Demo Scenario Started',
      module: 'Dashboard',
      description: 'End-to-end 13-step academic demonstration initialized.',
      status: 'INFO',
    });
  }, [currentUser.name, addActivityLog]);

  const advanceDemoScenario = useCallback(() => {
    setDemoStep((prev) => {
      const next = prev + 1;
      // Step routing
      if (next === 1 || next === 2 || next === 3) {
        setActivePage('requests');
      } else if (next === 4 || next === 5 || next === 6 || next === 7) {
        setActivePage('ai-classification');
      } else if (next === 8 || next === 9 || next === 10) {
        setActivePage('segregation');
      } else if (next === 11) {
        setActivePage('requests');
      } else if (next === 12) {
        setActivePage('analytics');
      } else if (next === 13) {
        setActivePage('logs');
      } else {
        setDemoActive(false);
        return 0;
      }
      return next;
    });
  }, []);

  const resetDemoScenario = useCallback(() => {
    setDemoActive(false);
    setDemoStep(0);
  }, []);

  // Periodic Simulation Engine
  useEffect(() => {
    if (!settings.simulationActive) return;

    const interval = setInterval(() => {
      setMobileUnits((prevUnits) =>
        prevUnits.map((unit) => {
          if (unit.status === 'COLLECTING') {
            const nextProgress = unit.collectionProgress + 5;
            if (nextProgress >= 100) {
              return {
                ...unit,
                status: 'RETURNING',
                collectionProgress: 100,
                currentTask: `Returning from ${unit.currentDepartment} to Central Segregation Vault`,
                batteryLevel: Math.max(10, unit.batteryLevel - 1),
                lastActivity: getNowFormatted(),
              };
            }
            return {
              ...unit,
              collectionProgress: nextProgress,
              batteryLevel: Math.max(10, unit.batteryLevel - 0.5),
              lastActivity: getNowFormatted(),
              coordinates: {
                x: Math.min(90, Math.max(10, unit.coordinates.x + (Math.random() * 4 - 2))),
                y: Math.min(90, Math.max(10, unit.coordinates.y + (Math.random() * 4 - 2))),
              },
            };
          } else if (unit.status === 'RETURNING') {
            const nextProgress = unit.collectionProgress - 10;
            if (nextProgress <= 0) {
              return {
                ...unit,
                status: 'AVAILABLE',
                collectionProgress: 0,
                currentDepartment: 'Storage',
                currentTask: 'Docked at Base Station (Ready for dispatch)',
                coordinates: { x: 50, y: 50 },
                lastActivity: getNowFormatted(),
              };
            }
            return {
              ...unit,
              collectionProgress: nextProgress,
              batteryLevel: Math.max(10, unit.batteryLevel - 0.2),
              lastActivity: getNowFormatted(),
            };
          } else if (unit.status === 'AVAILABLE') {
            // Recharging at dock
            return {
              ...unit,
              batteryLevel: Math.min(100, unit.batteryLevel + 1),
            };
          }
          return unit;
        })
      );
    }, settings.simulationSpeedMs);

    return () => clearInterval(interval);
  }, [settings.simulationActive, settings.simulationSpeedMs]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        collectionRequests,
        wasteRecords,
        mobileUnits,
        containers,
        alerts,
        activityLogs,
        settings,
        activePage,
        pageHistory,
        canGoBack,
        auditReportOpen,
        globalSearchQuery,
        demoStep,
        demoActive,
        selectedRequest,
        selectedWasteRecord,
        setActivePage,
        goBack,
        setAuditReportOpen,
        generateAuditReport,
        closeAuditReport,
        setCurrentUser,
        switchUserRole,
        addUser,
        setGlobalSearchQuery,
        setSelectedRequest,
        setSelectedWasteRecord,
        createCollectionRequest,
        assignMobileUnit,
        startCollection,
        markCollected,
        completeRequest,
        cancelRequest,
        segregateWaste,
        emptyContainer,
        updateContainerManual,
        chargeMobileUnit,
        recallMobileUnit,
        markAlertRead,
        markAllAlertsRead,
        addAlert,
        dismissAlert,
        addActivityLog,
        updateSettings,
        startDemoScenario,
        advanceDemoScenario,
        resetDemoScenario,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
