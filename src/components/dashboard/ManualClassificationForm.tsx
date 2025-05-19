
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Search } from "lucide-react";
import { ThreatClassifierRequest } from "@/types/intelligence";
import { classifyThreat } from "@/services";
import ThreatClassificationResultDisplay from "./threatClassifier/ThreatClassificationResult";

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
      const request: ThreatClassifierRequest = {
        content,
        platform: platform || "Unknown",
        brand
      };
      
      const result = await classifyThreat(request);
      
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                placeholder="e.g., Twitter, Reddit"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL (optional)</Label>
              <Input
                id="url"
                placeholder="https://example.com/post"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="brand">Brand Name</Label>
            <Input
              id="brand"
              placeholder="Your brand name"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content to Classify</Label>
            <Textarea
              id="content"
              placeholder="Enter the content you want to classify..."
              className="min-h-[150px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full"
            disabled={isClassifying || !content.trim()}
          >
            {isClassifying ? "Classifying..." : "Classify Content"}
          </Button>
        </form>
        
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
