
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

// Sample data
const mockAlerts = [
  {
    id: '1',
    platform: 'Twitter',
    content: 'This company has terrible customer service. I waited for hours and no one helped me. #awful #scam',
    date: '2 hours ago',
    severity: 'high' as 'high', 
    status: 'new' as 'new'
  },
  {
    id: '2',
    platform: 'Reddit',
    content: 'I had a somewhat negative experience with their product, but customer service was helpful in resolving it.',
    date: '5 hours ago',
    severity: 'medium' as 'medium',
    status: 'new' as 'new'
  },
  {
    id: '3',
    platform: 'Yelp',
    content: 'Not the best service, but the staff were polite. Food was just okay.',
    date: '1 day ago',
    severity: 'low' as 'low',
    status: 'reviewing' as 'reviewing'
  }
];

const mockSources = [
  { name: 'Twitter', status: 'critical' as 'critical', positiveRatio: 35, total: 120 },
  { name: 'Facebook', status: 'good' as 'good', positiveRatio: 87, total: 230 },
  { name: 'Reddit', status: 'warning' as 'warning', positiveRatio: 62, total: 85 },
  { name: 'Yelp', status: 'good' as 'good', positiveRatio: 78, total: 45 }
];

const mockActions = [
  { 
    id: '1', 
    platform: 'Twitter', 
    action: 'removal_requested' as 'removal_requested', 
    date: '3 hours ago', 
    status: 'completed' as 'completed'
  },
  { 
    id: '2', 
    platform: 'Yelp', 
    action: 'reported' as 'reported', 
    date: '1 day ago', 
    status: 'pending' as 'pending'
  },
  { 
    id: '3', 
    platform: 'Reddit', 
    action: 'content_hidden' as 'content_hidden', 
    date: '2 days ago', 
    status: 'completed' as 'completed'
  },
  { 
    id: '4', 
    platform: 'Facebook', 
    action: 'removal_requested' as 'removal_requested', 
    date: '3 days ago', 
    status: 'rejected' as 'rejected'
  }
];

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredAlerts, setFilteredAlerts] = useState(mockAlerts);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
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
      toast.success("Scan completed", {
        description: "Found 2 new mentions across monitored platforms.",
      });
    }, 2000);
  };

  const handleFilterChange = (filters: {
    platforms: string[];
    severities: string[];
    statuses: string[];
  }) => {
    let filtered = [...mockAlerts];

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
        <h1 className="text-2xl font-bold mb-2">Reputation Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your online reputation across multiple platforms.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <DateRangePicker onDateRangeChange={handleDateRangeChange} />
        <Button 
          onClick={handleScan} 
          disabled={isScanning}
          className="w-full md:w-auto"
        >
          {isScanning ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            "Scan for New Content"
          )}
        </Button>
      </div>
      
      <MetricsOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <div className="flex items-center">
              <ReputationScore score={68} previousScore={61} />
              <InfoTooltip text="Your reputation score is calculated based on sentiment analysis of mentions across all monitored platforms." />
            </div>
            <div className="flex items-center">
              <RecentActions actions={mockActions} />
              <InfoTooltip text="Recent actions taken on content that may affect your online reputation." />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <h2 className="text-lg font-medium">Content Alerts</h2>
                <InfoTooltip text="Content mentioning your brand that may require attention or action." />
              </div>
              <ContentFilter onFilterChange={handleFilterChange} />
            </div>
            <ContentAlerts alerts={filteredAlerts} />
            <div className="flex items-center">
              <SourceOverview sources={mockSources} />
              <InfoTooltip text="Overview of your reputation status across different platforms." />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
