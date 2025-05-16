
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
    severity: 'high' as 'high', // Type assertion to match ContentAlert type
    status: 'new' as 'new' // Type assertion to match ContentAlert type
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
