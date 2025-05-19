
import { useState, useEffect } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnalyticsPanel from "@/components/dashboard/analytics/AnalyticsPanel";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DataSourceStats } from "@/types/intelligence";
import { FileText } from "lucide-react";

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<string>("7d");
  const [clientFilter, setClientFilter] = useState<string>("all");
  
  // Get dashboard data
  const {
    filteredAlerts,
    reputationScore,
    previousScore,
    sources,
    alerts,
    monitoredSources,
    negativeContent,
    removedContent 
  } = useDashboardData();
  
  // Use real-time updates
  const { 
    connectionStatus, 
    realtimeAlerts,
    threatVectors 
  } = useRealTimeUpdates(true);
  
  // Sample timeline data
  const reputationHistory = [
    { date: "May 11", score: 72, mentions: 23 },
    { date: "May 12", score: 70, mentions: 45 },
    { date: "May 13", score: 68, mentions: 52 },
    { date: "May 14", score: 65, mentions: 87 },
    { date: "May 15", score: 69, mentions: 56 },
    { date: "May 16", score: 73, mentions: 41 },
    { date: "May 17", score: 78, mentions: 32 },
    { date: "May 18", score: 82, mentions: 28 },
  ];
  
  // Convert ContentSource[] to DataSourceStats[] to match the expected type
  const sourceStats: DataSourceStats[] = sources.map(source => ({
    source: source.name,
    mentions: source.mentionCount,
    sentiment: source.sentiment,
    coverage: source.positiveRatio,
  }));
  
  const handleRefresh = () => {
    toast.success("Analytics data refreshed", {
      description: "Dashboard updated with latest information"
    });
  };
  
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    toast.info(`Time range updated to ${value}`, {
      description: "Analytics data will reflect the new time period"
    });
  };
  
  const handleClientFilterChange = (value: string) => {
    setClientFilter(value);
    toast.info(`Client filter updated to ${value === 'all' ? 'All Clients' : value}`, {
      description: "Analytics data will reflect the selected client"
    });
  };
  
  // Export analytics data to CSV
  const exportAnalytics = () => {
    // Build headers
    const headers = ["Date", "Reputation Score", "Mentions"];
    
    // Create CSV content from reputation history
    const csvContent = [
      headers.join(','),
      ...reputationHistory.map(item => 
        `"${item.date}","${item.score}","${item.mentions}"`
      )
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Analytics data exported", {
      description: `${reputationHistory.length} data points exported to CSV`
    });
  };
  
  return (
    <DashboardLayout>
      <DashboardHeader 
        title="Analytics Dashboard" 
        description="Comprehensive data analysis and trend visualization"
      />
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Brand Intelligence Analytics</h2>
          {connectionStatus === 'connected' && (
            <p className="text-sm text-green-600 font-medium">
              Real-time data streaming active
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Select value={clientFilter} onValueChange={handleClientFilterChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              <SelectItem value="Acme Corp">Acme Corporation</SelectItem>
              <SelectItem value="LuxeSkin">LuxeSkin Beauty</SelectItem>
              <SelectItem value="TechFuture">TechFuture Inc</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleRefresh}>Refresh Data</Button>
          
          <Button 
            variant="outline" 
            onClick={exportAnalytics}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Export to CSV
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        <AnalyticsPanel 
          alerts={[...realtimeAlerts, ...filteredAlerts].slice(0, 50)}
          sourceStats={sourceStats}
          threatVectors={threatVectors}
          reputationHistory={reputationHistory}
          onRefresh={handleRefresh}
        />
        
        <div className="p-4 border rounded-md bg-blue-50 border-blue-200">
          <h3 className="text-lg font-medium mb-2 text-blue-800">Real-Time Analytics</h3>
          <p className="text-sm text-blue-700">
            This dashboard provides real-time analytics through WebSocket connections, ensuring you always have 
            the most up-to-date information about your brand's online presence. The system analyzes threats by day, 
            platform distribution, and overall reputation scores.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
