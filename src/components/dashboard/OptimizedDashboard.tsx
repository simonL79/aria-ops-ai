
import React, { Suspense, lazy, memo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';

// Ultra-lazy loading with smaller chunks
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

// Minimal skeleton for instant rendering
const QuickSkeleton = memo(() => (
  <Skeleton className="h-20 bg-corporate-darkSecondary rounded-lg animate-pulse" />
));

// Optimized error component
const ErrorComponent = memo(({ error, onRetry }: { error: string; onRetry?: () => void }) => (
  <Card className="corporate-card max-w-md mx-auto">
    <CardContent className="text-center py-6">
      <RefreshCw className="h-8 w-8 text-red-500 mx-auto mb-3" />
      <h3 className="text-lg font-semibold text-white mb-2">System Error</h3>
      <p className="text-corporate-lightGray text-sm mb-3">{error}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-corporate-accent hover:underline">
          Retry
        </button>
      )}
    </CardContent>
  </Card>
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
  // Micro-optimized display alerts
  const displayAlerts = React.useMemo(() => 
    filteredAlerts?.length ? filteredAlerts.slice(0, 50) : alerts.slice(0, 50)
  , [filteredAlerts, alerts]);

  // Stable action handlers reference
  const handlers = React.useMemo(() => ({
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
        <QuickSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-corporate-dark p-2 sm:p-4">
        <ErrorComponent error={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-corporate-dark">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 space-y-3 sm:space-y-4 max-w-7xl">
        {/* Critical Action Buttons - Priority load */}
        <Suspense fallback={<QuickSkeleton />}>
          <CriticalActionButtons
            {...handlers}
            isScanning={isScanning}
            isGuardianActive={isGuardianActive}
            isRealTimeActive={isRealTimeActive}
          />
        </Suspense>

        {/* Responsive grid layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4">
          {/* Left Column */}
          <div className="xl:col-span-3 space-y-3 sm:space-y-4">
            <Suspense fallback={<QuickSkeleton />}>
              <ReputationScore score={reputationScore} previousScore={previousScore} />
            </Suspense>
            
            <Suspense fallback={<QuickSkeleton />}>
              <IntelligenceCollection onDataRefresh={fetchData} />
            </Suspense>
          </div>
          
          {/* Center Column */}
          <div className="xl:col-span-6 space-y-3 sm:space-y-4">
            <Suspense fallback={<QuickSkeleton />}>
              <ContentAlerts alerts={displayAlerts} isLoading={loading} />
            </Suspense>
          </div>

          {/* Right Column */}
          <div className="xl:col-span-3">
            <Suspense fallback={<QuickSkeleton />}>
              <EntitySummaryPanel alerts={displayAlerts} />
            </Suspense>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <Suspense fallback={<QuickSkeleton />}>
            <SourceOverview sources={sources.slice(0, 10)} />
          </Suspense>
          
          <Suspense fallback={<QuickSkeleton />}>
            <RecentActions actions={actions.slice(0, 10)} />
          </Suspense>
        </div>
      </div>
    </div>
  );
});

OptimizedDashboard.displayName = 'OptimizedDashboard';

export default OptimizedDashboard;
