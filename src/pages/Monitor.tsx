
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ContentItem {
  id: string;
  platform: string;
  type: 'post' | 'comment' | 'review';
  content: string;
  date: string;
  sentiment: 'negative' | 'neutral' | 'positive';
  impact: 'high' | 'medium' | 'low';
  url: string;
}

const mockContent: ContentItem[] = [
  {
    id: '1',
    platform: 'Twitter',
    type: 'post',
    content: 'The worst experience I\'ve ever had with a company. Complete waste of money and time. #NeverAgain',
    date: '2 hours ago',
    sentiment: 'negative',
    impact: 'high',
    url: 'https://twitter.com/user/status/123456'
  },
  {
    id: '2',
    platform: 'Reddit',
    type: 'comment',
    content: 'Their customer service could be better, but overall the product works as advertised.',
    date: '1 day ago',
    sentiment: 'neutral',
    impact: 'low',
    url: 'https://reddit.com/r/subreddit/comments/123'
  },
  {
    id: '3',
    platform: 'Facebook',
    type: 'post',
    content: 'Very disappointed with the quality of the product I received. Not what I expected at all.',
    date: '3 days ago',
    sentiment: 'negative',
    impact: 'medium',
    url: 'https://facebook.com/post/123456'
  },
  {
    id: '4',
    platform: 'Yelp',
    type: 'review',
    content: 'One star service. The staff was rude and unprofessional. Will not be coming back!',
    date: '1 week ago',
    sentiment: 'negative',
    impact: 'high',
    url: 'https://yelp.com/biz/business/review/123456'
  },
  {
    id: '5',
    platform: 'Twitter',
    type: 'post',
    content: 'Actually had a great experience with their support team today. Problem solved quickly!',
    date: '2 days ago',
    sentiment: 'positive',
    impact: 'low',
    url: 'https://twitter.com/user/status/789012'
  }
];

const Monitor = () => {
  const [filtered, setFiltered] = useState(mockContent);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'negative': return 'bg-alert-negative text-white';
      case 'neutral': return 'bg-gray-500 text-white';
      case 'positive': return 'bg-alert-positive text-white';
      default: return 'bg-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100';
    }
  };

  const filterContent = () => {
    let results = [...mockContent];
    
    if (selectedPlatform !== 'all') {
      results = results.filter(item => item.platform === selectedPlatform);
    }
    
    if (selectedSentiment !== 'all') {
      results = results.filter(item => item.sentiment === selectedSentiment);
    }
    
    setFiltered(results);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Content Monitor</h1>
        <p className="text-muted-foreground">
          Track and filter content across all platforms to identify potential reputation issues.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Content Analysis</CardTitle>
          <CardDescription>
            View and filter content from all monitored platforms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="all">All Content</TabsTrigger>
              <TabsTrigger value="negative">Negative</TabsTrigger>
              <TabsTrigger value="neutral">Neutral</TabsTrigger>
              <TabsTrigger value="positive">Positive</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input placeholder="Search content..." />
              </div>
              <div className="flex gap-2">
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="Twitter">Twitter</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Reddit">Reddit</SelectItem>
                    <SelectItem value="Yelp">Yelp</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sentiment</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button onClick={filterContent}>Filter</Button>
              </div>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <div className="space-y-0 border rounded-md">
                {filtered.map((item, idx) => (
                  <div key={item.id}>
                    <div className="p-4">
                      <div className="flex flex-wrap justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.platform}</span>
                          <Badge variant="outline">{item.type}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getSentimentColor(item.sentiment)}>
                            {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                          </Badge>
                          <Badge variant="outline" className={getImpactColor(item.impact)}>
                            {item.impact === 'high' ? 'High Impact' : 
                            item.impact === 'medium' ? 'Medium Impact' : 'Low Impact'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{item.content}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-muted-foreground">{item.date}</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View</Button>
                          <Button size="sm" variant="outline">Hide</Button>
                          <Button size="sm" variant="destructive">Request Removal</Button>
                        </div>
                      </div>
                    </div>
                    {idx < filtered.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="negative" className="mt-0">
              <div className="space-y-0 border rounded-md">
                {filtered.filter(item => item.sentiment === 'negative').map((item, idx, arr) => (
                  <div key={item.id}>
                    <div className="p-4">
                      <div className="flex justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.platform}</span>
                          <Badge variant="outline">{item.type}</Badge>
                        </div>
                        <Badge className={getImpactColor(item.impact)}>
                          {item.impact === 'high' ? 'High Impact' : 
                          item.impact === 'medium' ? 'Medium Impact' : 'Low Impact'}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{item.content}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-muted-foreground">{item.date}</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View</Button>
                          <Button size="sm" variant="outline">Hide</Button>
                          <Button size="sm" variant="destructive">Request Removal</Button>
                        </div>
                      </div>
                    </div>
                    {idx < arr.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="neutral" className="mt-0">
              <div className="space-y-0 border rounded-md">
                {filtered.filter(item => item.sentiment === 'neutral').map((item, idx, arr) => (
                  <div key={item.id}>
                    <div className="p-4">
                      {/* Content similar to above */}
                      <div className="flex justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.platform}</span>
                          <Badge variant="outline">{item.type}</Badge>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{item.content}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-muted-foreground">{item.date}</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View</Button>
                          <Button size="sm" variant="outline">Monitor</Button>
                        </div>
                      </div>
                    </div>
                    {idx < arr.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="positive" className="mt-0">
              <div className="space-y-0 border rounded-md">
                {filtered.filter(item => item.sentiment === 'positive').map((item, idx, arr) => (
                  <div key={item.id}>
                    <div className="p-4">
                      {/* Content similar to above */}
                      <div className="flex justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.platform}</span>
                          <Badge variant="outline">{item.type}</Badge>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{item.content}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-muted-foreground">{item.date}</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View</Button>
                          <Button size="sm" variant="outline">Highlight</Button>
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
    </DashboardLayout>
  );
};

export default Monitor;
