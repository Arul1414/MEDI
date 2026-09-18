/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AcademicDisclaimerBanner } from './components/common/AcademicDisclaimerBanner';
import { DemoScenarioGuide } from './components/common/DemoScenarioGuide';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { OfficialAuditReportModal } from './components/common/OfficialAuditReportModal';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Page Views
import { DashboardPage } from './pages/DashboardPage';
import { CollectionRequestsPage } from './pages/CollectionRequestsPage';
import { AIClassificationPage } from './pages/AIClassificationPage';
import { SegregationCenterPage } from './pages/SegregationCenterPage';
import { MobileUnitsPage } from './pages/MobileUnitsPage';
import { WasteInventoryPage } from './pages/WasteInventoryPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ActivityLogsPage } from './pages/ActivityLogsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { activePage } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'requests':
        return <CollectionRequestsPage />;
      case 'ai-classification':
        return <AIClassificationPage />;
      case 'segregation':
        return <SegregationCenterPage />;
      case 'mobile-units':
        return <MobileUnitsPage />;
      case 'inventory':
        return <WasteInventoryPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'logs':
        return <ActivityLogsPage />;
      case 'assistant':
        return <AIAssistantPage />;
      case 'users':
        return <UsersPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Academic Disclaimer (Dismissible) */}
      <AcademicDisclaimerBanner />

      {/* Guided Demo Walkthrough Banner */}
      <DemoScenarioGuide />

      {/* Main App Layout Shell */}
      <div className="flex-1 flex overflow-hidden bg-slate-50">
        {/* Left Navigation Sidebar */}
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Content Column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
          {/* Command Center Top Header */}
          <Header
            setMobileOpen={setMobileOpen}
            setSearchModalOpen={setSearchModalOpen}
          />

          {/* Main Page Content Scrollable Canvas */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar bg-slate-50">
            <div className="max-w-7xl mx-auto">{renderActivePage()}</div>
          </main>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Official Audit Report Modal with Dedicated "Back" Feature to Come Back */}
      <OfficialAuditReportModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
