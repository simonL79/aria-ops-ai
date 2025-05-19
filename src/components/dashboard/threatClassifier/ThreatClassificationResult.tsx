
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Scale, AlertCircle, ShieldCheck } from "lucide-react";
import { ThreatClassificationResult } from "@/types/intelligence";
import ThreatSeverityIndicator from "./ThreatSeverityIndicator";

interface ThreatClassificationResultProps {
  result: ThreatClassificationResult;
}

const ThreatClassificationResultDisplay = ({ result }: ThreatClassificationResultProps) => {
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "Positive": return "bg-green-100 text-green-800";
      case "Neutral": return "bg-blue-100 text-blue-800";
      case "Complaint": return "bg-yellow-100 text-yellow-800";
      case "Reputation Threat": return "bg-orange-100 text-orange-800";
      case "Misinformation": return "bg-purple-100 text-purple-800";
      case "Legal Risk": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRecommendationIcon = (recommendation?: string) => {
    if (!recommendation) return <AlertCircle className="h-4 w-4" />;
    
    const lower = recommendation.toLowerCase();
    
    if (lower.includes('escalate') || lower.includes('legal')) {
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
    
    if (lower.includes('monitor') || lower.includes('review')) {
      return <Scale className="h-4 w-4 text-amber-600" />;
    }
    
    return <ShieldCheck className="h-4 w-4 text-green-600" />;
  };

  return (
    <div className="border rounded-md p-4 space-y-3">
      <div className="flex justify-between items-center">
        <Badge className={getCategoryColor(result.category)}>
          {result.category}
        </Badge>
        <div className="flex items-center gap-1.5">
          <Scale className="h-4 w-4" />
          <span className="text-sm font-medium">Threat Severity:</span>
        </div>
      </div>
      
      <ThreatSeverityIndicator severity={result.severity} />
      
      <div className="space-y-2 pt-2">
        <div className="flex items-start gap-2">
          {getRecommendationIcon(result.recommendation)}
          <div>
            <span className="text-sm font-medium block">Recommended Action:</span>
            <p className="text-sm">{result.recommendation}</p>
          </div>
        </div>
        
        {result.ai_reasoning && (
          <div>
            <span className="text-sm font-medium">Analysis:</span>
            <p className="text-sm">{result.ai_reasoning}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatClassificationResultDisplay;
