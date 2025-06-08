
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { classifyThreat } from "@/services/intelligence/threatClassifier";
import ThreatClassificationResultDisplay from "../ThreatClassificationResult";
import FormInputs from "./FormInputs";

interface ManualClassificationFormProps {
  onClassified?: (result: any) => void;
}

const ManualClassificationForm = ({ onClassified }: ManualClassificationFormProps) => {
  const [url, setUrl] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [brand, setBrand] = useState<string>("Your Brand");
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("Content is required for classification");
      return;
    }
    
    setIsClassifying(true);
    
    try {
      const result = await classifyThreat(
        content,
        platform || "Unknown",
        brand
      );
      
      if (result) {
        setResult(result);
        
        if (onClassified) {
          onClassified(result);
        }
        
        toast.success("Content classified successfully");
      }
    } catch (error) {
      console.error("Classification error:", error);
      toast.error("Failed to classify content");
    } finally {
      setIsClassifying(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Manual Content Classification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormInputs
          url={url}
          setUrl={setUrl}
          platform={platform}
          setPlatform={setPlatform}
          content={content}
          setContent={setContent}
          brand={brand}
          setBrand={setBrand}
          isClassifying={isClassifying}
          handleSubmit={handleSubmit}
        />
        
        {result && (
          <div className="mt-6">
            <ThreatClassificationResultDisplay result={result} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ManualClassificationForm;
