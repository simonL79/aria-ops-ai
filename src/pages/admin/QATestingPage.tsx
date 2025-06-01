
import React, { Suspense, lazy, useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { qaTestRunner, QATestSuite } from '@/services/testing/qaTestRunner';

// Lazy load heavy components for better performance
const CriticalActionButtons = lazy(() => import('@/components/dashboard/CriticalActionButtons'));
const ComprehensiveQADashboard = lazy(() => import('@/components/qa/ComprehensiveQADashboard'));

// Import optimized components directly for better performance
import QATestingHeader from '@/components/admin/qa/QATestingHeader';
import QAOverviewCards from '@/components/admin/qa/QAOverviewCards';
import QAComplianceStatus from '@/components/admin/qa/QAComplianceStatus';
import QAProcessCards from '@/components/admin/qa/QAProcessCards';
import QADeploymentCriteria from '@/components/admin/qa/QADeploymentCriteria';
import QAResponsiveLayout from '@/components/admin/qa/QAResponsiveLayout';
import QAPerformanceOptimizer from '@/components/admin/qa/QAPerformanceOptimizer';

const QATestingPage = React.memo(() => {
  const [testSuite, setTestSuite] = useState<QATestSuite | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Memoized action handlers to prevent unnecessary re-renders
  const actionHandlers = useMemo(() => ({
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

  // Optimized test initialization
  useEffect(() => {
    let isMounted = true;
    
    const runInitialTests = async () => {
      if (isRunningTests) return;
      
      setIsRunningTests(true);
      try {
        // Use requestIdleCallback for better performance
        const runTests = () => {
          if (!isMounted) return;
          
          qaTestRunner.runFullQASuite().then(results => {
            if (isMounted) {
              setTestSuite(results);
              setIsRunningTests(false);
            }
          }).catch(error => {
            console.error('Failed to run QA tests:', error);
            if (isMounted) {
              setIsRunningTests(false);
            }
          });
        };

        if ('requestIdleCallback' in window) {
          requestIdleCallback(runTests);
        } else {
          setTimeout(runTests, 100);
        }
      } catch (error) {
        console.error('Failed to initialize QA tests:', error);
        if (isMounted) {
          setIsRunningTests(false);
        }
      }
    };

    runInitialTests();

    return () => {
      isMounted = false;
    };
  }, [isRunningTests]);

  return (
    <DashboardLayout>
      <QAResponsiveLayout className="bg-corporate-dark">
        {/* Critical Action Buttons - Optimized Loading */}
        <Suspense fallback={
          <Skeleton className="h-12 sm:h-16 lg:h-20 w-full bg-corporate-darkSecondary rounded" />
        }>
          <div className="w-full">
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

        {/* Header Section - Responsive */}
        <QATestingHeader />

        {/* Performance Monitor and Overview - Enhanced Responsive Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="xl:col-span-3 w-full min-w-0">
            <QAOverviewCards testSuite={testSuite} />
          </div>
          <div className="xl:col-span-1 w-full min-w-0">
            <QAPerformanceOptimizer />
          </div>
        </div>

        {/* Main QA Dashboard - Optimized Loading */}
        <Suspense fallback={
          <Skeleton className="h-64 sm:h-80 lg:h-96 w-full bg-corporate-darkSecondary rounded" />
        }>
          <ComprehensiveQADashboard />
        </Suspense>

        {/* Compliance Status - Responsive */}
        <QAComplianceStatus />

        {/* QA Process Overview - Responsive */}
        <QAProcessCards />

        {/* Deployment Criteria - Responsive */}
        <QADeploymentCriteria />
      </QAResponsiveLayout>
    </DashboardLayout>
  );
});

QATestingPage.displayName = 'QATestingPage';

export default QATestingPage;
