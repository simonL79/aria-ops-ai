
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader, ShieldCheck, Key } from "lucide-react";
import { Building, Globe } from "lucide-react";
import { ThreatClassifierRequest } from "@/types/intelligence";
import { hasValidKey } from "@/utils/secureKeyStorage";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

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
  const [hasApiKey, setHasApiKey] = useState<boolean>(hasValidKey('openai_api_key'));
  const navigate = useNavigate();

  useEffect(() => {
    // Check for API key whenever the component renders
    setHasApiKey(hasValidKey('openai_api_key'));
  }, []);

  const handleSubmit = () => {
    if (!content.trim()) return;
    
    const request: ThreatClassifierRequest = {
      content,
      platform,
      brand
    };
    
    onSubmit(request);
  };

  const goToSettings = () => {
    navigate('/settings');
  };

  if (!hasApiKey) {
    return (
      <Card className="border-dashed border-red-200">
        <CardContent className="p-6 text-center">
          <Key className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">API Key Required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            To use the threat analysis feature, you need to set your OpenAI API key
            in the security settings.
          </p>
          <Button onClick={goToSettings} variant="action" className="w-full">
            Go to Security Settings
          </Button>
        </CardContent>
      </Card>
    );
  }

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
        variant="action"
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
