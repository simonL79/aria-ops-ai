
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getSerpResults, getSeoMetrics } from "@/services/serpService";
import { SERPResult } from "@/types/serp";
import { Search, ArrowUp, ArrowDown, Minus, RefreshCw } from "lucide-react";

interface SEOTrackerProps {
  isLoading?: boolean;
  onRefresh?: () => void;
}

const SEOTracker = ({ isLoading = false, onRefresh }: SEOTrackerProps) => {
  const [activeTab, setActiveTab] = useState<string>("positions");
  const [results, setResults] = useState<SERPResult[]>(getSerpResults());
  const metrics = getSeoMetrics();
  
  const getPositionChange = (current: number, previous: number) => {
    if (current === previous) return <Minus className="h-4 w-4 text-gray-500" />;
    if (current < previous) return <ArrowUp className="h-4 w-4 text-green-500" />;
    return <ArrowDown className="h-4 w-4 text-red-500" />;
  };
  
  const getResultTypeIndicator = (type: string) => {
    switch (type) {
      case 'owned':
        return <Badge className="bg-green-500 text-white">Owned</Badge>;
      case 'negative':
        return <Badge className="bg-red-500 text-white">Negative</Badge>;
      case 'neutral':
        return <Badge className="bg-blue-500 text-white">Neutral</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      // For demo purposes, let's randomize the results a bit
      setResults(prev => prev.map(item => ({
        ...item,
        position: Math.max(1, Math.min(10, item.position + Math.floor(Math.random() * 3) - 1)),
      })));
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Search className="h-5 w-5" />
            <span>SEO Tracker</span>
          </CardTitle>
          <Skeleton className="h-8 w-40 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Search className="h-5 w-5" />
            <span>SEO Tracker</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="positions">SERP Positions</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {activeTab === 'positions' && (
          <div className="space-y-3">
            {results.map((result) => (
              <div key={result.url} className="flex items-center p-2 border rounded-md">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted mr-3 text-lg font-bold">
                  {result.position}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <div className="truncate font-medium text-sm">
                      {result.title}
                    </div>
                    {getResultTypeIndicator(result.type)}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {result.url}
                  </div>
                </div>
                <div className="flex items-center ml-3">
                  {getPositionChange(result.position, result.previousPosition)}
                  <span className="text-xs ml-1">
                    {result.position === result.previousPosition
                      ? '0'
                      : result.position < result.previousPosition
                      ? `+${result.previousPosition - result.position}`
                      : `-${result.position - result.previousPosition}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'metrics' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <div className="text-2xl font-bold">{metrics.ownedResults}</div>
                <div className="text-sm text-muted-foreground">Owned Results</div>
              </div>
              <div className="p-4 border rounded-md">
                <div className="text-2xl font-bold text-red-500">{metrics.negativeResults}</div>
                <div className="text-sm text-muted-foreground">Negative Results</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Control Score</span>
                  <span className="text-sm font-medium">{metrics.controlScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${metrics.controlScore}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Percentage of top 10 results under your control
                </p>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Visibility Score</span>
                  <span className="text-sm font-medium">{metrics.visibilityScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${metrics.visibilityScore}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Weighted score based on positions and click-through rates
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
              <h4 className="font-medium mb-1">SEO Recommendations</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Create content targeting "brand reputation management"</li>
                <li>Build backlinks to your owned properties to boost rankings</li>
                <li>Update social profiles with consistent brand messaging</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SEOTracker;
