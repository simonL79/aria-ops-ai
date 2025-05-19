
import { useState, useEffect } from "react";
import { hasValidKey } from "@/utils/secureKeyStorage";
import { classifyThreat } from "@/services";
import { toast } from "sonner";
import { ThreatClassificationResult, ThreatClassifierRequest } from "@/types/intelligence";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import ThreatClassifierForm from "./ThreatClassifierForm";
import ThreatClassificationResultDisplay from "./ThreatClassificationResult";

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
  
  useEffect(() => {
    // Check for API key on component mount
    if (!hasValidKey('openai_api_key')) {
      toast.info("API Key Required", {
        description: "Please set your OpenAI API key in the settings panel before using this feature"
      });
    }
  }, []);
  
  const handleClassify = async (request: ThreatClassifierRequest) => {
    // Check if we have an API key
    if (!hasValidKey('openai_api_key')) {
      toast.error("API Key Required", {
        description: "Please set your OpenAI API key in the settings panel"
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
