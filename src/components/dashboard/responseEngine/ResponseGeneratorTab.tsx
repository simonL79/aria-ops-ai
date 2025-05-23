
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateAIResponse, ResponseGenerationProps } from "@/services";
import { ResponseToneStyle } from "@/types/dashboard";
import { hasValidKey } from "@/utils/secureKeyStorage";
import { responseTemplates, toneOptions } from "./constants";
import ApiKeyInput from "./ApiKeyInput";
import AdvancedOptions from "./AdvancedOptions";
import ResponseActions from "./ResponseActions";
import { ResponseGeneratorTabProps } from "./types";

const ResponseGeneratorTab = ({ 
  initialContent = "",
  threatType,
  severity,
  platform = ""
}: ResponseGeneratorTabProps) => {
  const [responseType, setResponseType] = useState<string>("empathetic");
  const [responseText, setResponseText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [toneStyle, setToneStyle] = useState<ResponseToneStyle>("professional");
  const [contentToRespond, setContentToRespond] = useState<string>(initialContent);
  const [selectedPlatform, setPlatform] = useState<string>(platform);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("en");
  const [hasApiKey, setHasApiKey] = useState<boolean>(hasValidKey('openai_api_key'));
  
  const handleGenerateResponse = async () => {
    if (!contentToRespond.trim()) {
      toast.error("Please enter content to respond to");
      return;
    }
    
    if (!hasApiKey) {
      toast.error("Please enter an OpenAI API key");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const props: ResponseGenerationProps = {
        responseType,
        toneStyle,
        content: contentToRespond,
        platform: selectedPlatform,
        severity,
        threatType,
        language: language !== "en" ? language : undefined
      };
      
      const generatedResponse = await generateAIResponse(props);
      setResponseText(generatedResponse);
      
      toast.success("AI response generated successfully");
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Failed to generate response", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopyResponse = () => {
    navigator.clipboard.writeText(responseText);
    toast.success("Response copied to clipboard");
  };
  
  const handleRegenerateResponse = () => {
    handleGenerateResponse();
  };
  
  const handleAutoResponse = async () => {
    if (!contentToRespond.trim()) {
      toast.error("Please enter content to respond to");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const props: ResponseGenerationProps = {
        responseType: "empathetic",
        toneStyle: "professional",
        content: contentToRespond,
        platform: selectedPlatform,
        severity,
        threatType,
        language: language !== "en" ? language : undefined,
        autoRespond: true
      };
      
      const generatedResponse = await generateAIResponse(props);
      setResponseText(generatedResponse);
      
      toast.success("Auto-response generated", {
        description: "Please review before sending"
      });
    } catch (error) {
      console.error("Error generating auto-response:", error);
      toast.error("Failed to generate auto-response");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <ApiKeyInput onApiKeyChange={setHasApiKey} />
      
      <div>
        <label className="text-sm font-medium mb-1 block">Content to Respond To</label>
        <Textarea
          value={contentToRespond}
          onChange={(e) => setContentToRespond(e.target.value)}
          placeholder="Enter the criticism or content that needs a response..."
          className="min-h-[100px]"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Response Type</label>
          <Select value={responseType} onValueChange={setResponseType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {responseTemplates.map((template) => (
                <SelectItem key={template.id} value={template.type}>
                  {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                </SelectItem>
              ))}
              <SelectItem value="gratitude">Gratitude</SelectItem>
              <SelectItem value="clarification">Clarification</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Tone & Style</label>
          <Select value={toneStyle} onValueChange={(value) => setToneStyle(value as ResponseToneStyle)}>
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              {toneOptions.map((tone) => (
                <SelectItem key={tone} value={tone}>
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs"
        >
          {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
        </Button>
        
        {showAdvanced && (
          <AdvancedOptions
            selectedPlatform={selectedPlatform}
            setPlatform={setPlatform}
            language={language}
            setLanguage={setLanguage}
          />
        )}
      </div>
      
      <div>
        <label className="text-sm font-medium mb-1 block">AI-Generated Response</label>
        <Textarea 
          value={responseText} 
          onChange={(e) => setResponseText(e.target.value)}
          placeholder="Press 'Generate Response' to create an AI-powered response..."
          className="min-h-[120px]"
        />
      </div>
      
      <ResponseActions
        responseText={responseText}
        isGenerating={isGenerating}
        autoResponseEnabled={hasApiKey}
        onGenerate={handleGenerateResponse}
        onRegenerate={handleRegenerateResponse}
        onCopy={handleCopyResponse}
        onAutoRespond={handleAutoResponse}
      />
    </div>
  );
};

export default ResponseGeneratorTab;
