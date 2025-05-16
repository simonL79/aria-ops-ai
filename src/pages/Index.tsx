
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ReputationScore from "@/components/dashboard/ReputationScore";
import ContentAlerts from "@/components/dashboard/ContentAlerts";
import SourceOverview from "@/components/dashboard/SourceOverview";
import RecentActions from "@/components/dashboard/RecentActions";
import MetricsOverview from "@/components/dashboard/MetricsOverview";

// Sample data
const mockAlerts = [
  {
    id: '1',
    platform: 'Twitter',
    content: 'This company has terrible customer service. I waited for hours and no one helped me. #awful #scam',
    date: '2 hours ago',
    severity: 'high',
    status: 'new'
  },
  {
    id: '2',
    platform: 'Reddit',
    content: 'I had a somewhat negative experience with their product, but customer service was helpful in resolving it.',
    date: '5 hours ago',
    severity: 'medium',
    status: 'new'
  },
  {
    id: '3',
    platform: 'Yelp',
    content: 'Not the best service, but the staff were polite. Food was just okay.',
    date: '1 day ago',
    severity: 'low',
    status: 'reviewing'
  }
];

const mockSources = [
  { name: 'Twitter', status: 'critical', positiveRatio: 35, total: 120 },
  { name: 'Facebook', status: 'good', positiveRatio: 87, total: 230 },
  { name: 'Reddit', status: 'warning', positiveRatio: 62, total: 85 },
  { name: 'Yelp', status: 'good', positiveRatio: 78, total: 45 }
];

const mockActions = [
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
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Reputation Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your online reputation across multiple platforms.
        </p>
      </div>
      
      <MetricsOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <ReputationScore score={68} previousScore={61} />
            <RecentActions actions={mockActions} />
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <ContentAlerts alerts={mockAlerts} />
            <SourceOverview sources={mockSources} />
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button>Scan for New Content</Button>
      </div>
    </DashboardLayout>
  );
};

export default Index;
