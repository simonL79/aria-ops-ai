
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThreatClassificationResult } from "@/types/intelligence";
import { AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface ThreatClassificationResultDisplayProps {
  result: ThreatClassificationResult;
}

const ThreatClassificationResultDisplay = ({ result }: ThreatClassificationResultDisplayProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const getSeverityColor = (severity: number): string => {
    if (severity >= 8) return "bg-red-500 hover:bg-red-600";
    if (severity >= 5) return "bg-amber-500 hover:bg-amber-600";
    return "bg-blue-500 hover:bg-blue-600";
  };

  const getSeverityLabel = (severity: number): string => {
    if (severity >= 8) return "High";
    if (severity >= 5) return "Medium";
    return "Low";
  };

  const getSeverityIcon = (severity: number) => {
    if (severity >= 8) return <AlertTriangle className="h-5 w-5" />;
    if (severity >= 5) return <AlertCircle className="h-5 w-5" />;
    return <Info className="h-5 w-5" />;
  };

  // Extract entities and targets from the reasoning or explanation text
  const extractTargets = (): string[] => {
    // First check if we have detectedEntities in the result
    if (result.detectedEntities && Array.isArray(result.detectedEntities) && result.detectedEntities.length > 0) {
      return result.detectedEntities;
    }
    
    const text = result.explanation || result.ai_reasoning || "";
    
    // Look for mentions of entities in the text - common patterns
    const entityPatterns = [
      /target(?:s|ed|ing)?:?\s*([^\.]+)/i,
      /(?:individual|person|company|brand|organization)(?:s)?:?\s*([^\.]+)/i,
      /(?:directed at|aimed at|focused on):?\s*([^\.]+)/i,
      /(?:attacking|threatening):?\s*([^\.]+)/i
    ];
    
    let targets: string[] = [];
    
    entityPatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match && match[1]) {
        const extracted = match[1].trim();
        if (extracted.length > 3 && !targets.includes(extracted)) {
          targets.push(extracted);
        }
      }
    });
    
    // If we still don't have targets, try to extract proper nouns
    if (targets.length === 0) {
      const properNouns = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
      if (properNouns) {
        targets = [...new Set(properNouns)].slice(0, 3);
      }
    }
    
    return targets.length > 0 ? targets : ["Unspecified target"];
  };

  const getRecommendedActions = (): string[] => {
    if (!result.recommendation) return [];
    
    // Split by periods, semicolons, or numbered items
    const actions = result.recommendation
      .split(/(?:\.\s+|\;\s+|\d+\.\s+)/)
      .map(action => action.trim())
      .filter(action => action.length > 10);
    
    return actions.length > 0 ? actions : [result.recommendation];
  };

  const targets = extractTargets();
  const actions = getRecommendedActions();

  return (
    <Card className="p-4 border-l-4" style={{ borderLeftColor: result.severity >= 8 ? '#ef4444' : result.severity >= 5 ? '#f59e0b' : '#3b82f6' }}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          {getSeverityIcon(result.severity)}
          <h3 className="text-lg font-medium">{result.category} Threat Detected</h3>
        </div>
        <Badge className={`${getSeverityColor(result.severity)}`}>
          {getSeverityLabel(result.severity)} Severity
        </Badge>
      </div>
      
      <div className="mt-3 space-y-3">
        <div>
          <h4 className="text-sm font-medium">Identified Targets:</h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {targets.map((target, index) => (
              <Badge key={index} variant="outline" className="bg-slate-100">
                {target}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium">Threat Summary:</h4>
          <p className="text-sm mt-1">{result.explanation || result.ai_reasoning?.split('.')[0] || "No detailed explanation provided."}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium">Recommended Action:</h4>
          <div className="space-y-1 mt-1">
            {actions.length > 0 ? (
              actions.map((action, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-sm mr-2">•</span>
                  <p className="text-sm">{action}</p>
                </div>
              ))
            ) : (
              <p className="text-sm">{result.recommendation || "No specific recommendation provided."}</p>
            )}
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-2 flex items-center justify-center"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" /> Hide AI Analysis
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" /> Show AI Analysis
            </>
          )}
        </Button>
        
        {showDetails && (
          <>
            <Separator />
            <div className="pt-2">
              <h4 className="text-sm font-medium">AI Reasoning:</h4>
              <p className="text-sm mt-1 whitespace-pre-line">{result.ai_reasoning || "No detailed AI reasoning available."}</p>
              
              {result.confidence !== undefined && (
                <div className="mt-2">
                  <span className="text-xs text-muted-foreground">
                    Confidence Score: {Math.round(result.confidence * 100)}%
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default ThreatClassificationResultDisplay;
