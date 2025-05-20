
import { useState, useEffect } from "react";
import { NavigateFunction } from "react-router-dom";
import { toast } from "sonner";
import { hasValidKey } from "@/utils/secureKeyStorage";
import { classifyThreat } from "@/services";
import { ThreatClassificationResult, ThreatClassifierRequest } from "@/types/intelligence";

interface UseThreatClassifierProps {
  onClassified?: (result: ThreatClassificationResult) => void;
  navigate: NavigateFunction;
}

export default function useThreatClassifier({ onClassified, navigate }: UseThreatClassifierProps) {
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [result, setResult] = useState<ThreatClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check for API key on component mount
    if (!hasValidKey('openai_api_key')) {
      toast.info("API Key Required", {
        description: "Please set your OpenAI API key in the settings panel before using this feature",
        action: {
          label: "Settings",
          onClick: () => navigate('/settings')
        }
      });
    }
  }, [navigate]);
  
  const handleClassify = async (request: ThreatClassifierRequest) => {
    // Reset previous error state
    setError(null);
    
    // Check if we have an API key
    if (!hasValidKey('openai_api_key')) {
      toast.error("API Key Required", {
        description: "Please set your OpenAI API key in the settings panel",
        action: {
          label: "Settings",
          onClick: () => navigate('/settings')
        }
      });
      return;
    }
    
    setIsClassifying(true);
    
    try {
      const classificationResult = await classifyThreat(request);
      
      if (classificationResult) {
        setResult(classificationResult);
        
        if (onClassified) {
          onClassified(classificationResult);
        }
      } else {
        // If classifyThreat returns null, it means there was an error
        setError("Unable to classify content. Check your API key or try again later.");
      }
    } catch (error) {
      console.error("Classification failed:", error);
      setError("Classification failed. Please check your API key or try again.");
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
