
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentAlert } from "@/types/dashboard";
import { Target } from "lucide-react";

interface ResultItemProps {
  result: ContentAlert;
}

const ResultItem: React.FC<ResultItemProps> = ({ result }) => {
  // Extract targets if they're in the alert
  const getTargets = () => {
    if (result.detectedEntities && result.detectedEntities.length > 0) {
      return result.detectedEntities;
    }
    
    if (result.content) {
      // Try to extract proper nouns from the content as potential targets
      const properNouns = result.content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
      return properNouns ? [...new Set(properNouns)].slice(0, 2) : null;
    }
    
    return null;
  };
  
  const targets = getTargets();
  
  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className={`h-2 w-2 rounded-full mr-2 ${
            result.severity === 'high' 
              ? 'bg-red-500' 
              : result.severity === 'medium' 
              ? 'bg-yellow-500' 
              : 'bg-green-500'
          }`} />
          <span className="font-medium">{result.platform}</span>
        </div>
        <span className="text-xs text-muted-foreground">{result.date}</span>
      </div>
      <p className="mt-1 text-sm">{result.content}</p>
      
      {targets && targets.length > 0 && (
        <div className="flex items-center gap-1 mt-1 text-xs">
          <Target className="h-3 w-3 text-gray-500" />
          <span className="text-muted-foreground">Targets:</span>
          <div className="flex gap-1">
            {targets.map((target, idx) => (
              <Badge key={idx} variant="outline" className="text-xs py-0 px-1">
                {target}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {result.recommendation && (
        <div className="mt-1 text-xs text-muted-foreground">
          <strong>Recommended action:</strong> {result.recommendation.length > 60 
            ? `${result.recommendation.substring(0, 60)}...` 
            : result.recommendation}
        </div>
      )}
      
      <div className="mt-2">
        {result.category === 'customer_enquiry' && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            Customer Enquiry
          </span>
        )}
        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
          result.severity === 'high' 
            ? 'bg-red-100 text-red-800' 
            : result.severity === 'medium' 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {result.severity === 'high' 
            ? 'High Priority' 
            : result.severity === 'medium' 
            ? 'Medium Priority' 
            : 'Low Priority'
          }
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-2"
          onClick={() => {
            window.location.href = `/dashboard/engagement?alert=${result.id}`;
          }}
        >
          View & Respond
        </Button>
      </div>
    </div>
  );
};

export default ResultItem;
