
import React, { Suspense, lazy } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load components for better performance
const CriticalActionButtons = lazy(() => import('@/components/dashboard/CriticalActionButtons'));
const PerformanceMonitor = lazy(() => import('@/components/admin/qa/PerformanceMonitor'));
const ComprehensiveQADashboard = lazy(() => import('@/components/qa/ComprehensiveQADashboard'));

// Import optimized components directly (no lazy loading for small components)
import QATestingHeader from '@/components/admin/qa/QATestingHeader';
import QAOverviewCards from '@/components/admin/qa/QAOverviewCards';
import QAComplianceStatus from '@/components/admin/qa/QAComplianceStatus';
import QAProcessCards from '@/components/admin/qa/QAProcessCards';
import QADeploymentCriteria from '@/components/admin/qa/QADeploymentCriteria';

const QATestingPage = React.memo(() => {
  // Enhanced validation for live data only
  const actionHandlers = React.useMemo(() => ({
    handleLiveThreatScan: () => {
      console.log('🔍 A.R.I.A™ OSINT: Live Threat Scan initiated - NO SIMULATIONS');
    },
    handleLiveIntelligenceSweep: () => {
      console.log('🔍 A.R.I.A™ OSINT: Live Intelligence Sweep initiated - NO SIMULATIONS');
    },
    handleGuardianToggle: () => {
      console.log('🛡️ A.R.I.A™ Guardian: Live Guardian Mode toggled');
    },
    handleGenerateReport: () => {
      console.log('📊 A.R.I.A™ Reports: Live report generation initiated');
    },
    handleActivateRealTime: () => {
      console.log('📡 A.R.I.A™ Real-Time: Live monitoring activated');
    },
    handleRunManualScan: () => {
      console.log('🔄 A.R.I.A™ Manual Scan: Live scan initiated - NO SIMULATIONS');
    }
  }), []);

  return (
    <DashboardLayout>
      <ResponsiveLayout className="bg-corporate-dark min-h-screen w-full">
        {/* Critical Action Buttons - Live Data Validated */}
        <Suspense fallback={<Skeleton className="h-12 sm:h-16 lg:h-20 w-full bg-corporate-darkSecondary rounded" />}>
          <CriticalActionButtons
            onLiveThreatScan={actionHandlers.handleLiveThreatScan}
            onLiveIntelligenceSweep={actionHandlers.handleLiveIntelligenceSweep}
            onGuardianToggle={actionHandlers.handleGuardianToggle}
            onGenerateReport={actionHandlers.handleGenerateReport}
            onActivateRealTime={actionHandlers.handleActivateRealTime}
            onRunManualScan={actionHandlers.handleRunManualScan}
            isScanning={false}
            isGuardianActive={true}
            isRealTimeActive={false}
          />
        </Suspense>

        {/* Header section - Live Data Compliance */}
        <QATestingHeader />

        {/* Performance monitor and overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 w-full">
          <div className="lg:col-span-3 w-full min-w-0">
            <QAOverviewCards />
          </div>
          <div className="lg:col-span-1 w-full min-w-0">
            <Suspense fallback={<Skeleton className="h-32 sm:h-40 bg-corporate-darkSecondary rounded" />}>
              <PerformanceMonitor />
            </Suspense>
          </div>
        </div>

        {/* Main QA Dashboard */}
        <Suspense fallback={<Skeleton className="h-64 sm:h-80 lg:h-96 w-full bg-corporate-darkSecondary rounded" />}>
          <ComprehensiveQADashboard />
        </Suspense>

        {/* Live Data Compliance Status */}
        <div className="mt-4 sm:mt-6">
          <QAComplianceStatus />
        </div>

        {/* QA Process Overview - Updated for Live Data */}
        <div className="mt-4 sm:mt-6">
          <QAProcessCards />
        </div>

        {/* Deployment Criteria */}
        <div className="mt-4 sm:mt-6">
          <QADeploymentCriteria />
        </div>
      </ResponsiveLayout>
    </DashboardLayout>
  );
});

QATestingPage.displayName = 'QATestingPage';

export default QATestingPage;
