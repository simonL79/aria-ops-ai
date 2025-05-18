
import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useDashboardScan } from "@/hooks/useDashboardScan";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardControls from "@/components/dashboard/DashboardControls";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import DashboardMainContent from "@/components/dashboard/DashboardMainContent";

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  
  const {
    filteredAlerts, 
    setFilteredAlerts,
    startDate,
    setStartDate,
    endDate, 
    setEndDate,
    reputationScore, 
    setReputationScore,
    previousScore, 
    setPreviousScore,
    sources, 
    setSources,
    alerts, 
    setAlerts,
    actions, 
    setActions,
    monitoredSources, 
    setMonitoredSources,
    negativeContent, 
    setNegativeContent,
    removedContent, 
    setRemovedContent
  } = useDashboardData();

  const { isScanning, handleScan } = useDashboardScan(
    alerts,
    setAlerts,
    setFilteredAlerts,
    setNegativeContent
  );

  // Simulating initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds for demonstration
    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (filters: {
    platforms: string[];
    severities: string[];
    statuses: string[];
  }) => {
    let filtered = [...alerts];

    if (filters.platforms.length > 0) {
      filtered = filtered.filter((alert) =>
        filters.platforms.includes(alert.platform.toLowerCase())
      );
    }

    if (filters.severities.length > 0) {
      filtered = filtered.filter((alert) =>
        filters.severities.includes(alert.severity)
      );
    }

    if (filters.statuses.length > 0) {
      filtered = filtered.filter((alert) =>
        filters.statuses.includes(alert.status)
      );
    }

    setFilteredAlerts(filtered);
  };

  const handleDateRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
    
    // For demo purposes, let's adjust the metrics slightly
    if (start && end) {
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      
      if (daysDiff <= 7) {
        // Last week data
        setNegativeContent(Math.floor(negativeContent * 0.7));
        setRemovedContent(Math.floor(removedContent * 0.6));
      } else if (daysDiff <= 30) {
        // Last month data
        setNegativeContent(Math.floor(negativeContent * 1.2));
        setRemovedContent(Math.floor(removedContent * 1.1));
      } else {
        // Longer period
        setNegativeContent(Math.floor(negativeContent * 1.5));
        setRemovedContent(Math.floor(removedContent * 1.3));
      }
    }
  };
  
  const handleSelectTestProfile = (profile: any) => {
    setReputationScore(profile.reputationScore);
    setPreviousScore(profile.previousScore);
    setSources(profile.sources);
    setAlerts(profile.alerts);
    setFilteredAlerts(profile.alerts);
    setMonitoredSources(profile.metrics.monitoredSources);
    setNegativeContent(profile.metrics.negativeContent);
    setRemovedContent(profile.metrics.removedContent);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <Loader className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Loading dashboard data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardHeader 
        title="LOVEABLE.SHIELD - Online Reputation Command Center" 
        subtitle="AI-powered intelligence for detecting, analyzing, and responding to reputation threats across digital platforms."
      />
      
      <DashboardControls 
        isScanning={isScanning}
        onScan={handleScan}
        onDateRangeChange={handleDateRangeChange}
        onSelectTestProfile={handleSelectTestProfile}
      />
      
      <DashboardMetrics 
        monitoredSources={monitoredSources}
        negativeContent={negativeContent}
        removedContent={removedContent}
      />
      
      <DashboardMainContent 
        reputationScore={reputationScore}
        previousScore={previousScore}
        sources={sources}
        filteredAlerts={filteredAlerts}
        actions={actions}
        onFilterChange={handleFilterChange}
      />
    </DashboardLayout>
  );
};

export default DashboardPage;
