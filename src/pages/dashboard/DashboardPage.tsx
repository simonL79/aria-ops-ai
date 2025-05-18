
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ReputationScore from "@/components/dashboard/ReputationScore";
import ContentAlerts from "@/components/dashboard/ContentAlerts";
import SourceOverview from "@/components/dashboard/SourceOverview";
import RecentActions from "@/components/dashboard/RecentActions";
import MetricsOverview from "@/components/dashboard/MetricsOverview";
import DateRangePicker from "@/components/dashboard/DateRangePicker";
import ContentFilter from "@/components/dashboard/ContentFilter";
import InfoTooltip from "@/components/dashboard/InfoTooltip";
import ProfileTestPanel from "@/components/dashboard/ProfileTestPanel";
import ContentIntelligencePanel from "@/components/dashboard/ContentIntelligencePanel";
import IntelligenceCollection from "@/components/dashboard/IntelligenceCollection";
import StrategicResponseEngine from "@/components/dashboard/StrategicResponseEngine";
import SerpDefense from "@/components/dashboard/SerpDefense";
import DarkWebSurveillance from "@/components/dashboard/DarkWebSurveillance";
import { useDashboardData } from "@/hooks/useDashboardData";

const DashboardPage = () => {
  const [isScanning, setIsScanning] = useState(false);
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

  // Simulating initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds for demonstration
    return () => clearTimeout(timer);
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false);
      
      // Simulate finding new content
      const newAlerts = [...alerts];
      
      // 50% chance to find new content
      if (Math.random() > 0.5) {
        const platforms = ['Twitter', 'Facebook', 'Reddit', 'Yelp', 'Instagram'];
        const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
        const randomSeverity = Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low';
        
        newAlerts.unshift({
          id: `new-${Date.now()}`,
          platform: randomPlatform,
          content: `New ${randomSeverity === 'high' ? 'negative' : randomSeverity === 'medium' ? 'mixed' : 'positive'} mention found during the latest scan.`,
          date: 'Just now',
          severity: randomSeverity,
          status: 'new'
        });
        
        setAlerts(newAlerts);
        setFilteredAlerts(newAlerts);
        setNegativeContent(prev => prev + (randomSeverity === 'high' ? 1 : 0));
        
        toast.success("Scan completed", {
          description: `Found new content on ${randomPlatform}.`,
        });
      } else {
        toast.success("Scan completed", {
          description: "No new mentions found across monitored platforms.",
        });
      }
    }, 2000);
  };

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
    // In a real app, you would refetch data based on this date range
    
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">LOVEABLE.SHIELD - Online Reputation Command Center</h1>
        <p className="text-muted-foreground">
          AI-powered intelligence for detecting, analyzing, and responding to reputation threats across digital platforms.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <DateRangePicker onDateRangeChange={handleDateRangeChange} />
          <ProfileTestPanel onSelectTestProfile={handleSelectTestProfile} />
          <ContentIntelligencePanel />
        </div>
        <Button 
          onClick={handleScan} 
          disabled={isScanning}
          className="w-full md:w-auto"
        >
          {isScanning ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Running Intelligence Sweep...
            </>
          ) : (
            "Intelligence Sweep"
          )}
        </Button>
      </div>
      
      <div className="mb-6">
        <MetricsOverview 
          monitoredSources={monitoredSources}
          negativeContent={negativeContent} 
          removedContent={removedContent}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <div className="flex items-center">
              <ReputationScore score={reputationScore} previousScore={previousScore} />
              <InfoTooltip text="Your reputation score is calculated based on sentiment analysis of mentions across all monitored platforms." />
            </div>
            <div className="flex items-center">
              <IntelligenceCollection />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <h2 className="text-lg font-medium">Threat Intelligence</h2>
                <InfoTooltip text="AI-detected content mentioning your brand that may require attention or action." />
              </div>
              <ContentFilter onFilterChange={handleFilterChange} />
            </div>
            <ContentAlerts alerts={filteredAlerts} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <SourceOverview sources={sources} />
        </div>
        <div className="lg:col-span-1">
          <RecentActions actions={actions} />
        </div>
        <div className="lg:col-span-1">
          <DarkWebSurveillance />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <StrategicResponseEngine />
        <SerpDefense />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
