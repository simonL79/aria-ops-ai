
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader, ShieldCheck } from "lucide-react";
import { Building, Globe } from "lucide-react";
import { ThreatClassifierRequest } from "@/types/intelligence";

interface ThreatClassifierFormProps {
  initialContent?: string;
  onSubmit: (request: ThreatClassifierRequest) => Promise<void>;
  isClassifying: boolean;
}

const ThreatClassifierForm = ({ 
  initialContent = "", 
  onSubmit,
  isClassifying
}: ThreatClassifierFormProps) => {
  const [content, setContent] = useState<string>(initialContent);
  const [brand, setBrand] = useState<string>("RepShield");
  const [platform, setPlatform] = useState<string>("Twitter");

  const handleSubmit = () => {
    if (!content.trim()) return;
    
    const request: ThreatClassifierRequest = {
      content,
      platform,
      brand
    };
    
    onSubmit(request);
  };

  return (
    <div className="space-y-4">
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

      <Button 
        onClick={handleSubmit} 
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
    </div>
  );
};

export default ThreatClassifierForm;
