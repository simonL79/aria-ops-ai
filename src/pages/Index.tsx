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
import ProfileTestPanel, { TestProfileData } from "@/components/dashboard/ProfileTestPanel";
import ContentIntelligencePanel from "@/components/dashboard/ContentIntelligencePanel";
import IntelligenceCollection from "@/components/dashboard/IntelligenceCollection";
import StrategicResponseEngine from "@/components/dashboard/StrategicResponseEngine";
import SerpDefense from "@/components/dashboard/SerpDefense";
import DarkWebSurveillance from "@/components/dashboard/DarkWebSurveillance";

// Define content alert type to avoid TypeScript errors
export interface ContentAlert {
  id: string;
  platform: string;
  content: string;
  date: string;
  severity: 'high' | 'medium' | 'low';
  status: 'new' | 'reviewing' | 'actioned';
  threatType?: 'falseReviews' | 'coordinatedAttack' | 'competitorSmear' | 'botActivity' | 'misinformation' | 'legalRisk' | 'viralThreat';
  confidenceScore?: number;
  sourceType?: 'social' | 'review' | 'news' | 'forum' | 'darkweb';
  sentiment?: 'negative' | 'neutral' | 'sarcastic' | 'threatening';
  potentialReach?: number;
  detectedEntities?: string[];
}

// Define source type
export interface ContentSource {
  name: string;
  status: 'critical' | 'warning' | 'good';
  positiveRatio: number;
  total: number;
}

// Define action type
export interface ContentAction {
  id: string;
  platform: string;
  action: 'removal_requested' | 'reported' | 'content_hidden';
  date: string;
  status: 'completed' | 'pending' | 'rejected';
}

// Sample data with enhanced threat intelligence
const mockAlerts: ContentAlert[] = [
  {
    id: '1',
    platform: 'Twitter',
    content: 'This company has terrible customer service. I waited for hours and no one helped me. #awful #scam',
    date: '2 hours ago',
    severity: 'high',
    status: 'new',
    threatType: 'viralThreat',
    confidenceScore: 89,
    sourceType: 'social',
    sentiment: 'negative',
    potentialReach: 6500,
    detectedEntities: ['Customer Service', 'Company']
  },
  {
    id: '2',
    platform: 'Reddit',
    content: 'Just found evidence that this business is using fake reviews to boost their ratings. Look at these screenshots of identical reviews across different accounts.',
    date: '5 hours ago',
    severity: 'high',
    status: 'new',
    threatType: 'misinformation',
    confidenceScore: 73,
    sourceType: 'forum',
    sentiment: 'threatening',
    potentialReach: 12400,
    detectedEntities: ['Business', 'Reviews']
  },
  {
    id: '3',
    platform: 'Trustpilot',
    content: 'Not the best service, but the staff were polite. Food was just okay.',
    date: '1 day ago',
    severity: 'low',
    status: 'reviewing',
    threatType: 'falseReviews',
    confidenceScore: 42,
    sourceType: 'review',
    sentiment: 'neutral',
    detectedEntities: ['Service', 'Staff', 'Food']
  },
  {
    id: '4',
    platform: 'Dark Web Forum',
    content: 'Looking for people to help coordinate negative reviews for [BRAND]. Will pay $5 per review that stays up for at least 2 weeks.',
    date: '3 hours ago',
    severity: 'high',
    status: 'new',
    threatType: 'coordinatedAttack',
    confidenceScore: 95,
    sourceType: 'darkweb',
    sentiment: 'threatening',
    potentialReach: 1200,
    detectedEntities: ['BRAND']
  },
  {
    id: '5',
    platform: 'Business Competitor Blog',
    content: 'Our investigation reveals questionable business practices at [COMPANY]. We\'ve found evidence suggesting potential ethical violations.',
    date: '12 hours ago',
    severity: 'medium',
    status: 'reviewing',
    threatType: 'competitorSmear',
    confidenceScore: 82,
    sourceType: 'news',
    sentiment: 'negative',
    potentialReach: 3800,
    detectedEntities: ['COMPANY', 'Ethical Violations']
  }
];

const mockSources: ContentSource[] = [
  { name: 'Twitter', status: 'critical', positiveRatio: 35, total: 120 },
  { name: 'Facebook', status: 'good', positiveRatio: 87, total: 230 },
  { name: 'Reddit', status: 'warning', positiveRatio: 62, total: 85 },
  { name: 'Yelp', status: 'good', positiveRatio: 78, total: 45 }
];

const mockActions: ContentAction[] = [
  { 
    id: '1', 
    platform: 'Twitter', 
    action: 'removal_requested', 
    date: '3 hours ago', 
    status: 'completed'
  },
  { 
    id: '2', 
    platform: 'Yelp', 
    action: 'reported', 
    date: '1 day ago', 
    status: 'pending'
  },
  { 
    id: '3', 
    platform: 'Reddit', 
    action: 'content_hidden', 
    date: '2 days ago', 
    status: 'completed'
  },
  { 
    id: '4', 
    platform: 'Facebook', 
    action: 'removal_requested', 
    date: '3 days ago', 
    status: 'rejected'
  }
];

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredAlerts, setFilteredAlerts] = useState(mockAlerts);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // State for metrics
  const [reputationScore, setReputationScore] = useState(68);
  const [previousScore, setPreviousScore] = useState(61);
  const [sources, setSources] = useState(mockSources);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [actions, setActions] = useState(mockActions);
  const [monitoredSources, setMonitoredSources] = useState(58);
  const [negativeContent, setNegativeContent] = useState(12);
  const [removedContent, setRemovedContent] = useState(7);
  
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
  
  const handleSelectTestProfile = (profile: TestProfileData) => {
    setReputationScore(profile.reputationScore);
    setPreviousScore(profile.previousScore);
    setSources(profile.sources);
    setAlerts(profile.alerts);
    setFilteredAlerts(profile.alerts);
    setMonitoredSources(profile.metrics.monitoredSources);
    setNegativeContent(profile.metrics.negativeContent);
    setRemovedContent(profile.metrics.removedContent);
  };

  // Add new state for blueprint features
  const [activeTab, setActiveTab] = useState<string>("dashboard");

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

export default Index;
