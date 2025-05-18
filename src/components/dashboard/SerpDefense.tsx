
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import SerpDefenseTabOverview from "./serp/SerpDefenseTabOverview";
import SerpDefenseTabSerp from "./serp/SerpDefenseTabSerp";
import SerpDefenseTabTactics from "./serp/SerpDefenseTabTactics";
import { getSerpResults, getSeoMetrics } from "@/services/serpService";

const SerpDefense = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [keyword, setKeyword] = useState("brand name reputation");
  
  const serpResults = getSerpResults();
  const seoMetrics = getSeoMetrics();
  
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
            <SerpDefenseTabOverview 
              seoMetrics={seoMetrics} 
              isAnalyzing={isAnalyzing} 
              handleAnalyzeSERP={handleAnalyzeSERP}
            />
          </TabsContent>
          
          <TabsContent value="serp">
            <SerpDefenseTabSerp keyword={keyword} serpResults={serpResults} />
          </TabsContent>
          
          <TabsContent value="tactics">
            <SerpDefenseTabTactics />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SerpDefense;
