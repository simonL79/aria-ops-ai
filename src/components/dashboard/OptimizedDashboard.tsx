
import React, { Suspense, lazy, memo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';

// Lazy load components with aggressive optimization
const ReputationScore = lazy(() => import('@/components/dashboard/ReputationScore'));
const ContentAlerts = lazy(() => import('@/components/dashboard/ContentAlerts'));
const SourceOverview = lazy(() => import('@/components/dashboard/SourceOverview'));
const RecentActions = lazy(() => import('@/components/dashboard/RecentActions'));
const IntelligenceCollection = lazy(() => import('@/components/dashboard/IntelligenceCollection'));
const EntitySummaryPanel = lazy(() => import('@/components/dashboard/EntitySummaryPanel'));
const CriticalActionButtons = lazy(() => import('./CriticalActionButtons'));

interface OptimizedDashboardProps {
  metrics?: any;
  alerts?: any[];
  sources?: any[];
  actions?: any[];
  loading?: boolean;
  error?: string;
  fetchData?: () => void;
  filteredAlerts?: any[];
  reputationScore?: number;
  previousScore?: number;
  selectedClient?: any;
  clientEntities?: any[];
  onLiveThreatScan?: () => void;
  onLiveIntelligenceSweep?: () => void;
  onGuardianToggle?: () => void;
  onGenerateReport?: () => void;
  onActivateRealTime?: () => void;
  onRunManualScan?: () => void;
  isScanning?: boolean;
  isGuardianActive?: boolean;
  isRealTimeActive?: boolean;
}

// Optimized skeleton with better performance
const DashboardSkeleton = memo(() => (
  <div className="space-y-4">
    <Skeleton className="h-20 w-full bg-corporate-darkSecondary" />
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      <div className="xl:col-span-3 space-y-3">
        <Skeleton className="h-32 bg-corporate-darkSecondary" />
        <Skeleton className="h-48 bg-corporate-darkSecondary" />
      </div>
      <div className="xl:col-span-6">
        <Skeleton className="h-80 bg-corporate-darkSecondary" />
      </div>
      <div className="xl:col-span-3">
        <Skeleton className="h-80 bg-corporate-darkSecondary" />
      </div>
    </div>
  </div>
));

// Ultra-lightweight fallback
const QuickSkeleton = memo(() => (
  <Skeleton className="h-20 bg-corporate-darkSecondary rounded-lg" />
));

const OptimizedDashboard: React.FC<OptimizedDashboardProps> = memo(({
  metrics,
  alerts = [],
  sources = [],
  actions = [],
  loading = false,
  error,
  fetchData,
  filteredAlerts,
  reputationScore = 75,
  previousScore = 70,
  selectedClient,
  clientEntities,
  onLiveThreatScan,
  onLiveIntelligenceSweep,
  onGuardianToggle,
  onGenerateReport,
  onActivateRealTime,
  onRunManualScan,
  isScanning = false,
  isGuardianActive = false,
  isRealTimeActive = false
}) => {
  // Memoize display alerts to prevent unnecessary re-renders
  const displayAlerts = React.useMemo(() => 
    filteredAlerts?.length ? filteredAlerts : alerts
  , [filteredAlerts, alerts]);

  // Memoize action handlers to prevent re-renders
  const memoizedHandlers = React.useMemo(() => ({
    onLiveThreatScan,
    onLiveIntelligenceSweep,
    onGuardianToggle,
    onGenerateReport,
    onActivateRealTime,
    onRunManualScan
  }), [onLiveThreatScan, onLiveIntelligenceSweep, onGuardianToggle, onGenerateReport, onActivateRealTime, onRunManualScan]);

  if (loading) {
    return (
      <div className="min-h-screen bg-corporate-dark p-2 sm:p-4">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-corporate-dark p-2 sm:p-4">
        <Card className="corporate-card max-w-md mx-auto">
          <CardContent className="text-center py-6">
            <RefreshCw className="h-8 w-8 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">System Error</h3>
            <p className="text-corporate-lightGray text-sm mb-3">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-corporate-dark">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 space-y-3 sm:space-y-4 max-w-7xl">
        {/* Critical Action Buttons - Highest priority */}
        <Suspense fallback={<QuickSkeleton />}>
          <CriticalActionButtons
            {...memoizedHandlers}
            isScanning={isScanning}
            isGuardianActive={isGuardianActive}
            isRealTimeActive={isRealTimeActive}
          />
        </Suspense>

        {/* Main Dashboard Grid - Responsive optimization */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4">
          {/* Left Column - Stacked on mobile */}
          <div className="xl:col-span-3 space-y-3 sm:space-y-4">
            <Suspense fallback={<QuickSkeleton />}>
              <ReputationScore score={reputationScore} previousScore={previousScore} />
            </Suspense>
            
            <Suspense fallback={<QuickSkeleton />}>
              <IntelligenceCollection onDataRefresh={fetchData} />
            </Suspense>
          </div>
          
          {/* Center Column - Main content */}
          <div className="xl:col-span-6 space-y-3 sm:space-y-4">
            <Suspense fallback={<Skeleton className="h-80 bg-corporate-darkSecondary" />}>
              <ContentAlerts alerts={displayAlerts} isLoading={loading} />
            </Suspense>
          </div>

          {/* Right Column - Entity summary */}
          <div className="xl:col-span-3">
            <Suspense fallback={<QuickSkeleton />}>
              <EntitySummaryPanel alerts={displayAlerts} />
            </Suspense>
          </div>
        </div>

        {/* Bottom Section - Lower priority */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <Suspense fallback={<QuickSkeleton />}>
            <SourceOverview sources={sources} />
          </Suspense>
          
          <Suspense fallback={<QuickSkeleton />}>
            <RecentActions actions={actions} />
          </Suspense>
        </div>
      </div>
    </div>
  );
});

OptimizedDashboard.displayName = 'OptimizedDashboard';

export default OptimizedDashboard;
