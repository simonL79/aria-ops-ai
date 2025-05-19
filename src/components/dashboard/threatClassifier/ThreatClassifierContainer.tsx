
import { useState, useEffect } from "react";
import { hasValidKey } from "@/utils/secureKeyStorage";
import { classifyThreat } from "@/services";
import { toast } from "sonner";
import { ThreatClassificationResult, ThreatClassifierRequest } from "@/types/intelligence";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AlertTriangle, Key } from "lucide-react";
import ThreatClassifierForm from "./ThreatClassifierForm";
import ThreatClassificationResultDisplay from "./ThreatClassificationResult";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ThreatClassifierProps {
  initialContent?: string;
  onClassified?: (result: ThreatClassificationResult) => void;
}

const ThreatClassifierContainer = ({ 
  initialContent = "", 
  onClassified 
}: ThreatClassifierProps) => {
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [result, setResult] = useState<ThreatClassificationResult | null>(null);
  const navigate = useNavigate();
  
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
      }
    } catch (error) {
      console.error("Classification failed:", error);
      toast.error("Classification failed", {
        description: "There was an error while analyzing the content. Please try again."
      });
    } finally {
      setIsClassifying(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Threat Intelligence Classifier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ThreatClassifierForm 
          initialContent={initialContent}
          onSubmit={handleClassify}
          isClassifying={isClassifying}
        />
        
        {result && <ThreatClassificationResultDisplay result={result} />}
      </CardContent>
    </Card>
  );
};

export default ThreatClassifierContainer;
