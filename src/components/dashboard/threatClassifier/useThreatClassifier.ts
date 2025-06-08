
import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { toast } from "sonner";
import { classifyThreat } from "@/services/intelligence/threatClassifier";
import { ThreatClassificationResult } from "@/services/intelligence/threatClassifier";

interface ThreatClassifierRequest {
  content: string;
  platform: string;
  brand: string;
  context?: string;
}

interface UseThreatClassifierProps {
  onClassified?: (result: ThreatClassificationResult) => void;
  navigate: NavigateFunction;
}

export default function useThreatClassifier({ onClassified, navigate }: UseThreatClassifierProps) {
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [result, setResult] = useState<ThreatClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleClassify = async (request: ThreatClassifierRequest) => {
    // Reset previous error state
    setError(null);
    setIsClassifying(true);
    
    try {
      const classificationResult = await classifyThreat(
        request.content,
        request.platform,
        request.brand
      );
      
      if (classificationResult) {
        setResult(classificationResult);
        
        // Show notification for high severity threats
        if (classificationResult.severity >= 7) {
          toast.error("High severity threat detected", {
            description: classificationResult.reasoning || classificationResult.category,
            duration: 6000
          });
        }
        
        if (onClassified) {
          onClassified(classificationResult);
        }
      } else {
        setError("Unable to classify content. Please try again later.");
      }
    } catch (error) {
      console.error("Classification failed:", error);
      setError("Classification failed. Please try again.");
      toast.error("Classification failed", {
        description: error instanceof Error 
          ? error.message 
          : "There was an error while analyzing the content. Please try again."
      });
    } finally {
      setIsClassifying(false);
    }
  };
  
  const handleRetry = () => {
    setError(null);
    setResult(null);
  };

  return {
    isClassifying,
    result,
    error,
    handleClassify,
    handleRetry
  };
}
