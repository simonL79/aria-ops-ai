
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, Globe, AlertTriangle, Loader } from "lucide-react";
import { toast } from "sonner";

interface SERPResult {
  position: number;
  previousPosition: number;
  url: string;
  title: string;
  type: "owned" | "negative" | "neutral";
}

const SerpDefense = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [keyword, setKeyword] = useState("brand name reputation");
  
  const serpResults: SERPResult[] = [
    {
      position: 1,
      previousPosition: 1,
      url: "https://yourwebsite.com",
      title: "Official Website | Your Brand",
      type: "owned"
    },
    {
      position: 2,
      previousPosition: 5,
      url: "https://yourblog.com/about",
      title: "About Us | Your Brand Blog",
      type: "owned"
    },
    {
      position: 3,
      previousPosition: 2,
      url: "https://thirdparty.com/review",
      title: "Your Brand Review - Trusted Source",
      type: "neutral"
    },
    {
      position: 4,
      previousPosition: 3,
      url: "https://news.example.com/story",
      title: "Breaking: Controversy at Your Brand",
      type: "negative"
    },
    {
      position: 5,
      previousPosition: 8,
      url: "https://social.example.com/discussion",
      title: "Discussion: Your Brand Experience",
      type: "neutral"
    }
  ];
  
  const seoMetrics = {
    ownedResults: 4,
    negativeResults: 2,
    controlScore: 68,
    visibilityScore: 72
  };
  
  const handleAnalyzeSERP = () => {
    setIsAnalyzing(true);
    
    // Simulate SERP analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success("SERP analysis complete", {
        description: "Found 7 results for your brand on page 1"
      });
    }, 2000);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">SERP & SEO Defense</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="serp">SERP Control</TabsTrigger>
            <TabsTrigger value="tactics">Defense Tactics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="border rounded-md p-3">
                  <div className="text-sm text-muted-foreground mb-1">SERP Control Score</div>
                  <div className="text-2xl font-bold mb-2">{seoMetrics.controlScore}%</div>
                  <Progress value={seoMetrics.controlScore} className="h-1.5" />
                </div>
                
                <div className="border rounded-md p-3">
                  <div className="text-sm text-muted-foreground mb-1">Visibility Score</div>
                  <div className="text-2xl font-bold mb-2">{seoMetrics.visibilityScore}%</div>
                  <Progress value={seoMetrics.visibilityScore} className="h-1.5" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="border rounded-md p-3 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">Owned Results</div>
                    <div className="text-xl font-bold">{seoMetrics.ownedResults}</div>
                  </div>
                  <Badge variant="outline" className="bg-green-50">Good</Badge>
                </div>
                
                <div className="border rounded-md p-3 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">Negative Results</div>
                    <div className="text-xl font-bold">{seoMetrics.negativeResults}</div>
                  </div>
                  <Badge variant="outline" className="bg-yellow-50">Monitor</Badge>
                </div>
              </div>
              
              <Button
                onClick={handleAnalyzeSERP}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing SERP...
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-2" />
                    Analyze SERP Now
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="serp">
            <div>
              <div className="mb-4 text-sm">
                <span className="font-medium">Monitoring keyword:</span> {keyword}
              </div>
              
              <div className="space-y-2">
                {serpResults.map((result) => (
                  <div key={result.url} className="border rounded-md p-2 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-md text-center min-w-[24px]">
                        {result.position}
                      </div>
                      <div>
                        <div className="font-medium text-sm line-clamp-1">{result.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{result.url}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        result.type === "owned" ? "outline" : 
                        result.type === "negative" ? "destructive" : "secondary"
                      }>
                        {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                      </Badge>
                      <div className={`flex items-center ${
                        result.previousPosition > result.position ? "text-green-600" : 
                        result.previousPosition < result.position ? "text-red-600" : ""
                      }`}>
                        {result.previousPosition > result.position ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : result.previousPosition < result.position ? (
                          <ArrowDown className="h-4 w-4" />
                        ) : null}
                        <span className="text-xs">{Math.abs(result.previousPosition - result.position) || ""}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-2 border rounded-md bg-amber-50 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <div className="text-xs">
                  <span className="font-medium">Alert:</span> Negative content on position #4 - implement defense tactics.
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tactics">
            <div className="space-y-3">
              <div className="border rounded-md p-3">
                <h3 className="font-medium mb-1">Content Amplification</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Boost owned content visibility through strategic publishing and link building.
                </p>
                <Button size="sm" variant="outline" className="w-full">Deploy</Button>
              </div>
              
              <div className="border rounded-md p-3">
                <h3 className="font-medium mb-1">Authority Linking</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Generate high-authority backlinks to improve domain authority.
                </p>
                <Button size="sm" variant="outline" className="w-full">Deploy</Button>
              </div>
              
              <div className="border rounded-md p-3">
                <h3 className="font-medium mb-1">Content Shield</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Create positive branded content to push down negative results.
                </p>
                <Button size="sm" className="w-full">Deploy (Recommended)</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SerpDefense;
