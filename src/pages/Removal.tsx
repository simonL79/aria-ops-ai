
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface RemovalRequest {
  id: string;
  platform: string;
  content: string;
  requestDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  progress: number;
  url: string;
}

const mockRequests: RemovalRequest[] = [
  {
    id: '1',
    platform: 'Twitter',
    content: 'This company has terrible customer service. I waited for hours and no one helped me. #awful #scam',
    requestDate: '2 days ago',
    status: 'in_progress',
    progress: 60,
    url: 'https://twitter.com/user/status/123456'
  },
  {
    id: '2',
    platform: 'Yelp',
    content: 'One star service. The staff was rude and unprofessional. Will not be coming back!',
    requestDate: '1 week ago',
    status: 'completed',
    progress: 100,
    url: 'https://yelp.com/biz/business/review/123456'
  },
  {
    id: '3',
    platform: 'Reddit',
    content: 'WARNING: This is a scam company that will take your money and run. AVOID AT ALL COSTS.',
    requestDate: '3 days ago',
    status: 'pending',
    progress: 20,
    url: 'https://reddit.com/r/subreddit/comments/123'
  },
  {
    id: '4',
    platform: 'Facebook',
    content: 'Very disappointed with the quality of the product I received. Not what I expected at all.',
    requestDate: '5 days ago',
    status: 'rejected',
    progress: 100,
    url: 'https://facebook.com/post/123456'
  }
];

const Removal = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-alert-positive text-white';
      case 'in_progress': return 'bg-brand-accent text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'rejected': return 'bg-alert-negative text-white';
      default: return 'bg-gray-200';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Removed';
      case 'in_progress': return 'In Progress';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };
  
  const getProgressColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-alert-positive';
      case 'in_progress': return 'bg-brand-accent';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-alert-negative';
      default: return '';
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Content Removal</h1>
        <p className="text-muted-foreground">
          Track and manage your content removal requests across platforms.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-4xl font-bold text-brand-accent">{mockRequests.length}</div>
            <div className="text-sm text-muted-foreground mt-1">Total Requests</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-4xl font-bold text-yellow-500">
              {mockRequests.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Pending</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-4xl font-bold text-brand-accent">
              {mockRequests.filter(r => r.status === 'in_progress').length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">In Progress</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-4xl font-bold text-alert-positive">
              {mockRequests.filter(r => r.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Completed</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Removal Requests</CardTitle>
          <CardDescription>
            Track the status of your content removal requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="space-y-0 border rounded-md">
                {mockRequests.map((request, idx) => (
                  <div key={request.id}>
                    <div className="p-4">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{request.platform}</span>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusText(request.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Requested: {request.requestDate}
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3">{request.content}</p>
                      
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{request.progress}%</span>
                        </div>
                        <Progress value={request.progress} max={100} className={`h-2 ${getProgressColor(request.status)}`} />
                      </div>
                      
                      <div className="flex justify-between">
                        <a href={request.url} target="_blank" rel="noreferrer" className="text-sm text-brand hover:underline">
                          View Original Content
                        </a>
                        <div className="flex gap-2">
                          {request.status !== 'completed' && request.status !== 'rejected' && (
                            <Button size="sm" variant="outline">Check Status</Button>
                          )}
                          {request.status === 'rejected' && (
                            <Button size="sm" variant="outline">Appeal Decision</Button>
                          )}
                          <Button size="sm" variant="outline">View Details</Button>
                        </div>
                      </div>
                    </div>
                    {idx < mockRequests.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              <div className="space-y-0 border rounded-md">
                {mockRequests.filter(req => req.status === 'pending').map((request, idx, arr) => (
                  <div key={request.id}>
                    <div className="p-4">
                      {/* Similar structure to above */}
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{request.platform}</span>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusText(request.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Requested: {request.requestDate}
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3">{request.content}</p>
                      
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{request.progress}%</span>
                        </div>
                        <Progress value={request.progress} max={100} className={`h-2 ${getProgressColor(request.status)}`} />
                      </div>
                      
                      <div className="flex justify-between">
                        <a href={request.url} target="_blank" rel="noreferrer" className="text-sm text-brand hover:underline">
                          View Original Content
                        </a>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Check Status</Button>
                          <Button size="sm" variant="outline">View Details</Button>
                        </div>
                      </div>
                    </div>
                    {idx < arr.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="in_progress" className="mt-0">
              <div className="space-y-0 border rounded-md">
                {mockRequests.filter(req => req.status === 'in_progress').map((request, idx, arr) => (
                  <div key={request.id}>
                    {/* Similar structure to above */}
                    <div className="p-4">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{request.platform}</span>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusText(request.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Requested: {request.requestDate}
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3">{request.content}</p>
                      
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{request.progress}%</span>
                        </div>
                        <Progress value={request.progress} max={100} className={`h-2 ${getProgressColor(request.status)}`} />
                      </div>
                      
                      <div className="flex justify-between">
                        <a href={request.url} target="_blank" rel="noreferrer" className="text-sm text-brand hover:underline">
                          View Original Content
                        </a>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Check Status</Button>
                          <Button size="sm" variant="outline">View Details</Button>
                        </div>
                      </div>
                    </div>
                    {idx < arr.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              <div className="space-y-0 border rounded-md">
                {mockRequests.filter(req => req.status === 'completed' || req.status === 'rejected').map((request, idx, arr) => (
                  <div key={request.id}>
                    {/* Similar structure to above */}
                    <div className="p-4">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{request.platform}</span>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusText(request.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Requested: {request.requestDate}
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3">{request.content}</p>
                      
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{request.progress}%</span>
                        </div>
                        <Progress value={request.progress} max={100} className={`h-2 ${getProgressColor(request.status)}`} />
                      </div>
                      
                      <div className="flex justify-between">
                        <a href={request.url} target="_blank" rel="noreferrer" className="text-sm text-brand hover:underline">
                          View Original Content
                        </a>
                        <div className="flex gap-2">
                          {request.status === 'rejected' && (
                            <Button size="sm" variant="outline">Appeal Decision</Button>
                          )}
                          <Button size="sm" variant="outline">View Details</Button>
                        </div>
                      </div>
                    </div>
                    {idx < arr.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex justify-end">
        <Button>New Removal Request</Button>
      </div>
    </DashboardLayout>
  );
};

export default Removal;
