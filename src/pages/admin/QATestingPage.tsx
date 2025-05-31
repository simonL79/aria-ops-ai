
import React, { Suspense, lazy } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle, TrendingUp, Monitor, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

// Optimized imports with immediate loading for critical components
const ComprehensiveQADashboard = lazy(() => import('@/components/qa/ComprehensiveQADashboard'));
const CriticalActionButtons = lazy(() => import('@/components/dashboard/CriticalActionButtons'));
const PerformanceMonitor = lazy(() => import('@/components/admin/qa/PerformanceMonitor'));

// Optimized overview cards with React.memo and better responsive design
const QAOverviewCards = React.memo(() => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6 w-full">
    <Card className="corporate-card w-full min-w-0">
      <CardHeader className="pb-1 sm:pb-2 p-2 sm:p-4">
        <CardTitle className="text-xs sm:text-sm lg:text-base flex items-center gap-1 sm:gap-2 corporate-heading">
          <Monitor className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-corporate-accent flex-shrink-0" />
          <span className="truncate">UI & Navigation</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 pt-0">
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">4 Tests</div>
        <p className="text-xs sm:text-sm corporate-subtext">Interface validation</p>
      </CardContent>
    </Card>

    <Card className="corporate-card w-full min-w-0">
      <CardHeader className="pb-1 sm:pb-2 p-2 sm:p-4">
        <CardTitle className="text-xs sm:text-sm lg:text-base flex items-center gap-1 sm:gap-2 corporate-heading">
          <Zap className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-corporate-accent flex-shrink-0" />
          <span className="truncate">Functional</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 pt-0">
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">5 Tests</div>
        <p className="text-xs sm:text-sm corporate-subtext">Core features</p>
      </CardContent>
    </Card>

    <Card className="corporate-card w-full min-w-0 sm:col-span-2 xl:col-span-1">
      <CardHeader className="pb-1 sm:pb-2 p-2 sm:p-4">
        <CardTitle className="text-xs sm:text-sm lg:text-base flex items-center gap-1 sm:gap-2 corporate-heading">
          <Shield className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-corporate-accent flex-shrink-0" />
          <span className="truncate">Security</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 pt-0">
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">4 Tests</div>
        <p className="text-xs sm:text-sm corporate-subtext">Security validation</p>
      </CardContent>
    </Card>
  </div>
));

QAOverviewCards.displayName = 'QAOverviewCards';

const QATestingPage = React.memo(() => {
  // Memoized action handlers to prevent re-renders
  const actionHandlers = React.useMemo(() => ({
    handleLiveThreatScan: () => toast.info('🔍 QA Test: Live Threat Scan initiated'),
    handleLiveIntelligenceSweep: () => toast.info('🔍 QA Test: Live Intelligence Sweep initiated'),
    handleGuardianToggle: () => toast.info('🛡️ QA Test: Guardian Mode toggled'),
    handleGenerateReport: () => toast.info('📊 QA Test: Report generation initiated'),
    handleActivateRealTime: () => toast.info('📡 QA Test: Real-Time monitoring toggled'),
    handleRunManualScan: () => toast.info('🔄 QA Test: Manual scan initiated')
  }), []);

  return (
    <DashboardLayout>
      <ResponsiveLayout className="bg-corporate-dark min-h-screen w-full">
        {/* Critical Action Buttons - Performance optimized */}
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

        {/* Header section - fully responsive */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 corporate-heading">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-corporate-accent flex-shrink-0" />
              <span className="truncate">A.R.I.A™ Comprehensive QA Master Plan</span>
            </h1>
            <p className="corporate-subtext mt-1 text-xs sm:text-sm lg:text-base">
              Complete Quality Assurance & System Validation for Genesis Sentinel
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 flex-shrink-0">
            <Badge variant="secondary" className="flex items-center gap-1 bg-corporate-darkSecondary text-corporate-lightGray border-corporate-border text-xs">
              <CheckCircle className="h-3 w-3" />
              Production Ready
            </Badge>
            <Badge className="bg-corporate-accent text-black hover:bg-corporate-accentDark text-xs">
              QA Certified
            </Badge>
          </div>
        </div>

        {/* Performance monitor and overview - responsive grid */}
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

        {/* QA Process Overview - Responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-6 w-full">
          <Card className="corporate-card w-full min-w-0">
            <CardHeader className="p-3 sm:p-4 lg:p-6">
              <CardTitle className="flex items-center gap-2 corporate-heading text-sm sm:text-base">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-corporate-accent flex-shrink-0" />
                <span className="truncate">QA Testing Categories</span>
              </CardTitle>
              <CardDescription className="corporate-subtext text-xs sm:text-sm">Comprehensive testing approach</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-corporate-lightGray">
                <div className="flex items-center gap-2">
                  <Monitor className="h-3 w-3 sm:h-4 sm:w-4 text-corporate-accent flex-shrink-0" />
                  <span className="font-medium">UI & Navigation Testing</span>
                </div>
                <p className="text-xs corporate-subtext ml-4 sm:ml-6">Button visibility, navigation flow, responsive design, interactive elements</p>
                
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-corporate-accent flex-shrink-0" />
                  <span className="font-medium">Functional Testing</span>
                </div>
                <p className="text-xs corporate-subtext ml-4 sm:ml-6">Live threat scan, entity management, guardian mode, report generation</p>
                
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-corporate-accent flex-shrink-0" />
                  <span className="font-medium">Performance Testing</span>
                </div>
                <p className="text-xs corporate-subtext ml-4 sm:ml-6">Page load time, scan performance, memory usage, concurrent users</p>
                
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-corporate-accent flex-shrink-0" />
                  <span className="font-medium">Security Testing</span>
                </div>
                <p className="text-xs corporate-subtext ml-4 sm:ml-6">Input validation, authentication, data encryption, session management</p>
                
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-corporate-accent flex-shrink-0" />
                  <span className="font-medium">Regression Testing</span>
                </div>
                <p className="text-xs corporate-subtext ml-4 sm:ml-6">Core functionality, integration points, database operations</p>
              </div>
            </CardContent>
          </Card>

          <Card className="corporate-card w-full min-w-0">
            <CardHeader className="p-3 sm:p-4 lg:p-6">
              <CardTitle className="flex items-center gap-2 corporate-heading text-sm sm:text-base">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-corporate-accent flex-shrink-0" />
                <span className="truncate">Quality Assurance Process</span>
              </CardTitle>
              <CardDescription className="corporate-subtext text-xs sm:text-sm">Systematic validation approach</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-corporate-lightGray">
                <div>
                  <div className="font-medium text-white">1. Automated Test Execution</div>
                  <p className="text-xs corporate-subtext">Comprehensive test suite runs all categories automatically</p>
                </div>
                
                <div>
                  <div className="font-medium text-white">2. Real-time Results</div>
                  <p className="text-xs corporate-subtext">Immediate feedback on test status and performance metrics</p>
                </div>
                
                <div>
                  <div className="font-medium text-white">3. Defect Tracking</div>
                  <p className="text-xs corporate-subtext">Critical defects flagged for immediate attention</p>
                </div>
                
                <div>
                  <div className="font-medium text-white">4. Recommendations</div>
                  <p className="text-xs corporate-subtext">Actionable insights for deployment readiness</p>
                </div>
                
                <div>
                  <div className="font-medium text-white">5. Documentation</div>
                  <p className="text-xs corporate-subtext">Detailed logging of all test results and system status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-corporate-accent bg-corporate-darkSecondary mt-4 sm:mt-6 w-full min-w-0">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-corporate-accent flex items-center gap-2 text-sm sm:text-base">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">Deployment Readiness Criteria</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            <div className="text-corporate-lightGray space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <p><strong className="text-white">✓ All Critical Tests Pass:</strong> No critical defects detected</p>
              <p><strong className="text-white">✓ Security Validation:</strong> All security tests must pass</p>
              <p><strong className="text-white">✓ Performance Benchmarks:</strong> Load times under 3 seconds</p>
              <p><strong className="text-white">✓ Functional Integrity:</strong> Core features operational</p>
              <p><strong className="text-white">✓ UI/UX Standards:</strong> Interface elements responsive and accessible</p>
              <p><strong className="text-white">✓ Regression Clearance:</strong> No existing functionality broken</p>
            </div>
          </CardContent>
        </Card>
      </ResponsiveLayout>
    </DashboardLayout>
  );
});

QATestingPage.displayName = 'QATestingPage';

export default QATestingPage;
