
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Globe, Loader } from "lucide-react";
import { toast } from "sonner";
import { SeoMetrics } from "../../../types/serp";

interface SerpDefenseTabOverviewProps {
  seoMetrics: SeoMetrics;
  isAnalyzing: boolean;
  handleAnalyzeSERP: () => void;
}

const SerpDefenseTabOverview = ({ 
  seoMetrics, 
  isAnalyzing, 
  handleAnalyzeSERP 
}: SerpDefenseTabOverviewProps) => {
  return (
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
  );
};

export default SerpDefenseTabOverview;
