
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader, AlertTriangle, ShieldCheck, Scale, Building, Globe } from "lucide-react";
import { ThreatClassificationResult, ThreatClassifierRequest } from "@/types/intelligence";
import { classifyThreat } from "@/services/threatClassifierService";
import { toast } from "sonner";

interface ThreatClassifierProps {
  initialContent?: string;
  onClassified?: (result: ThreatClassificationResult) => void;
}

const ThreatClassifier = ({ initialContent = "", onClassified }: ThreatClassifierProps) => {
  const [content, setContent] = useState<string>(initialContent);
  const [brand, setBrand] = useState<string>("RepShield");
  const [platform, setPlatform] = useState<string>("Twitter");
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [result, setResult] = useState<ThreatClassificationResult | null>(null);
  
  const handleClassify = async () => {
    if (!content.trim()) {
      toast.error("Please enter content to classify");
      return;
    }
    
    setIsClassifying(true);
    try {
      const request: ThreatClassifierRequest = {
        content,
        platform,
        brand
      };
      
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
  
  const getSeverityIndicator = (severity?: number) => {
    if (!severity) return null;
    
    let color = "bg-green-500";
    if (severity > 3) color = "bg-blue-500";
    if (severity > 5) color = "bg-yellow-500";
    if (severity > 7) color = "bg-orange-500";
    if (severity > 8) color = "bg-red-500";
    
    return (
      <div className="flex items-center gap-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`${color} h-2 rounded-full`} 
            style={{ width: `${(severity / 10) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium">{severity}/10</span>
      </div>
    );
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brand" className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              Brand Name
            </Label>
            <Input
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Enter brand name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="platform" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              Platform
            </Label>
            <Input
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              placeholder="Enter platform (e.g. Twitter, Instagram)"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Content to Analyze</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter the content you want to classify..."
            className="min-h-[100px]"
          />
        </div>
        
        {result && (
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
            
            {getSeverityIndicator(result.severity)}
            
            <div className="space-y-2 pt-2">
              <div>
                <span className="text-sm font-medium">Recommended Action:</span>
                <p className="text-sm">{result.recommendation}</p>
              </div>
              
              {result.ai_reasoning && (
                <div>
                  <span className="text-sm font-medium">Analysis:</span>
                  <p className="text-sm">{result.ai_reasoning}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleClassify} 
          disabled={isClassifying || !content.trim()}
          className="w-full"
        >
          {isClassifying ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Content...
            </>
          ) : (
            <>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Run Threat Analysis
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ThreatClassifier;
