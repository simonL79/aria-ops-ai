
import React, { Suspense, lazy } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';

// Lazy load heavy components for better performance
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

// Loading skeleton component
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-32 bg-corporate-darkSecondary" />
      <Skeleton className="h-32 bg-corporate-darkSecondary" />
      <Skeleton className="h-32 bg-corporate-darkSecondary" />
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-3 space-y-4">
        <Skeleton className="h-48 bg-corporate-darkSecondary" />
        <Skeleton className="h-64 bg-corporate-darkSecondary" />
      </div>
      <div className="xl:col-span-6">
        <Skeleton className="h-96 bg-corporate-darkSecondary" />
      </div>
      <div className="xl:col-span-3">
        <Skeleton className="h-96 bg-corporate-darkSecondary" />
      </div>
    </div>
  </div>
);

const OptimizedDashboard: React.FC<OptimizedDashboardProps> = ({
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
  const displayAlerts = filteredAlerts?.length ? filteredAlerts : alerts;

  if (loading) {
    return (
      <div className="min-h-screen bg-corporate-dark p-6">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-corporate-dark p-6">
        <Card className="corporate-card">
          <CardContent className="text-center py-8">
            <RefreshCw className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">System Error</h3>
            <p className="text-corporate-lightGray mb-4">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-corporate-dark">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        {/* Critical Action Buttons - Always visible */}
        <Suspense fallback={<Skeleton className="h-32 bg-corporate-darkSecondary" />}>
          <CriticalActionButtons
            onLiveThreatScan={onLiveThreatScan}
            onLiveIntelligenceSweep={onLiveIntelligenceSweep}
            onGuardianToggle={onGuardianToggle}
            onGenerateReport={onGenerateReport}
            onActivateRealTime={onActivateRealTime}
            onRunManualScan={onRunManualScan}
            isScanning={isScanning}
            isGuardianActive={isGuardianActive}
            isRealTimeActive={isRealTimeActive}
          />
        </Suspense>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="xl:col-span-3 space-y-6">
            <Suspense fallback={<Skeleton className="h-48 bg-corporate-darkSecondary" />}>
              <ReputationScore score={reputationScore} previousScore={previousScore} />
            </Suspense>
            
            <Suspense fallback={<Skeleton className="h-64 bg-corporate-darkSecondary" />}>
              <IntelligenceCollection onDataRefresh={fetchData} />
            </Suspense>
          </div>
          
          {/* Center Column */}
          <div className="xl:col-span-6 space-y-6">
            <Suspense fallback={<Skeleton className="h-96 bg-corporate-darkSecondary" />}>
              <ContentAlerts alerts={displayAlerts} isLoading={loading} />
            </Suspense>
          </div>

          {/* Right Column */}
          <div className="xl:col-span-3">
            <Suspense fallback={<Skeleton className="h-96 bg-corporate-darkSecondary" />}>
              <EntitySummaryPanel alerts={displayAlerts} />
            </Suspense>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<Skeleton className="h-64 bg-corporate-darkSecondary" />}>
            <SourceOverview sources={sources} />
          </Suspense>
          
          <Suspense fallback={<Skeleton className="h-64 bg-corporate-darkSecondary" />}>
            <RecentActions actions={actions} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default OptimizedDashboard;
