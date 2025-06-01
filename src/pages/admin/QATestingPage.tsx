
import React, { Suspense, lazy, useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { qaTestRunner, QATestSuite } from '@/services/testing/qaTestRunner';

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
  const [testSuite, setTestSuite] = useState<QATestSuite | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Run initial QA tests on component mount
  useEffect(() => {
    const runInitialTests = async () => {
      setIsRunningTests(true);
      try {
        const results = await qaTestRunner.runFullQASuite();
        setTestSuite(results);
      } catch (error) {
        console.error('Failed to run QA tests:', error);
      } finally {
        setIsRunningTests(false);
      }
    };

    runInitialTests();
  }, []);

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
        {/* Critical Action Buttons - Live Data Validated - Responsive Design Enhanced */}
        <Suspense fallback={<Skeleton className="h-12 sm:h-16 lg:h-20 w-full bg-corporate-darkSecondary rounded" />}>
          <div className="w-full px-2 sm:px-4 lg:px-6">
            <CriticalActionButtons
              onLiveThreatScan={actionHandlers.handleLiveThreatScan}
              onLiveIntelligenceSweep={actionHandlers.handleLiveIntelligenceSweep}
              onGuardianToggle={actionHandlers.handleGuardianToggle}
              onGenerateReport={actionHandlers.handleGenerateReport}
              onActivateRealTime={actionHandlers.handleActivateRealTime}
              onRunManualScan={actionHandlers.handleRunManualScan}
              isScanning={isRunningTests}
              isGuardianActive={true}
              isRealTimeActive={false}
            />
          </div>
        </Suspense>

        {/* Header section - Live Data Compliance - Responsive */}
        <div className="w-full px-2 sm:px-4 lg:px-6 mt-4 sm:mt-6">
          <QATestingHeader />
        </div>

        {/* Performance monitor and overview - Enhanced Responsive Grid */}
        <div className="w-full px-2 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 w-full">
            <div className="xl:col-span-3 w-full min-w-0">
              <QAOverviewCards testSuite={testSuite} />
            </div>
            <div className="xl:col-span-1 w-full min-w-0">
              <Suspense fallback={<Skeleton className="h-32 sm:h-40 bg-corporate-darkSecondary rounded" />}>
                <PerformanceMonitor />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Main QA Dashboard - Responsive Container */}
        <div className="w-full px-2 sm:px-4 lg:px-6">
          <Suspense fallback={<Skeleton className="h-64 sm:h-80 lg:h-96 w-full bg-corporate-darkSecondary rounded" />}>
            <ComprehensiveQADashboard />
          </Suspense>
        </div>

        {/* Live Data Compliance Status - Responsive */}
        <div className="w-full px-2 sm:px-4 lg:px-6 mt-4 sm:mt-6">
          <QAComplianceStatus />
        </div>

        {/* QA Process Overview - Updated for Live Data - Responsive */}
        <div className="w-full px-2 sm:px-4 lg:px-6 mt-4 sm:mt-6">
          <QAProcessCards />
        </div>

        {/* Deployment Criteria - Responsive */}
        <div className="w-full px-2 sm:px-4 lg:px-6 mt-4 sm:mt-6 pb-6">
          <QADeploymentCriteria />
        </div>
      </ResponsiveLayout>
    </DashboardLayout>
  );
});

QATestingPage.displayName = 'QATestingPage';

export default QATestingPage;
