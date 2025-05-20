
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ThreatClassificationResult } from "@/types/intelligence";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import ThreatClassifierForm from "./ThreatClassifierForm";
import ThreatClassificationResultDisplay from "./ThreatClassificationResult";
import ClassificationError from "./ClassificationError";
import useThreatClassifier from "./useThreatClassifier";

interface ThreatClassifierProps {
  initialContent?: string;
  onClassified?: (result: ThreatClassificationResult) => void;
}

const ThreatClassifierContainer = ({ 
  initialContent = "", 
  onClassified 
}: ThreatClassifierProps) => {
  const navigate = useNavigate();
  const { 
    isClassifying, 
    result, 
    error, 
    handleClassify, 
    handleRetry 
  } = useThreatClassifier({ onClassified, navigate });
  
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
        
        {error && <ClassificationError error={error} onRetry={handleRetry} />}
        
        {result && !error && <ThreatClassificationResultDisplay result={result} />}
      </CardContent>
    </Card>
  );
};

export default ThreatClassifierContainer;
