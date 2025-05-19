
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SeoContent } from "@/types/dashboard";
import { ArrowRight, RefreshCw } from "lucide-react";

const SeoSuppressionPipeline = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };
  
  // Sample content items for the pipeline
  const contentItems: SeoContent[] = [
    {
      id: "seo1",
      title: "Negative Review about Product Quality",
      keywords: ["product failure", "poor quality", "defective"],
      status: "suppressed",
      dateCreated: "2024-01-15",
      publishDate: "2024-01-22",
      url: "https://example.com/review-1",
      score: 85,
      type: "review",
      date: "2024-01-22"
    },
    {
      id: "seo2",
      title: "Client Complaint Article",
      keywords: ["complaint", "customer service", "issue"],
      status: "in-progress",
      dateCreated: "2024-02-03",
      score: 62,
      url: "https://example.com/article-2",
      type: "article",
      date: "2024-02-03"
    },
    {
      id: "seo3",
      title: "Negative Social Media Post",
      keywords: ["disappointed", "won't recommend", "poor experience"],
      status: "queue",
      dateCreated: "2024-02-10",
      url: "https://example.com/post-3",
      type: "social",
      date: "2024-02-10"
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">SEO Suppression Pipeline</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-3 border-b">
          {/* Pipeline Headers */}
          <div className="p-2 font-medium text-center text-muted-foreground">In Queue</div>
          <div className="p-2 font-medium text-center border-x text-muted-foreground">In Progress</div>
          <div className="p-2 font-medium text-center text-muted-foreground">Suppressed</div>
        </div>
        
        <div className="grid grid-cols-3 p-4 gap-4 min-h-[200px]">
          {/* Queue Column */}
          <div className="space-y-2">
            {contentItems
              .filter(item => item.status === "queue")
              .map(item => (
                <div key={item.id} className="p-2 border rounded-md bg-background shadow-sm">
                  <div className="font-medium truncate">{item.title}</div>
                  <div className="flex items-center justify-between mt-1">
                    <Badge variant="outline" className="text-xs">{item.type}</Badge>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              ))}
          </div>
          
          {/* In Progress Column */}
          <div className="space-y-2">
            {contentItems
              .filter(item => item.status === "in-progress")
              .map(item => (
                <div key={item.id} className="p-2 border rounded-md bg-background shadow-sm">
                  <div className="font-medium truncate">{item.title}</div>
                  <div className="flex items-center justify-between mt-1">
                    <Badge className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-100">
                      {item.score}%
                    </Badge>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              ))}
          </div>
          
          {/* Suppressed Column */}
          <div className="space-y-2">
            {contentItems
              .filter(item => item.status === "suppressed")
              .map(item => (
                <div key={item.id} className="p-2 border rounded-md bg-background shadow-sm">
                  <div className="font-medium truncate">{item.title}</div>
                  <div className="flex items-center justify-between mt-1">
                    <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-100">
                      {item.score}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.publishDate}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeoSuppressionPipeline;
