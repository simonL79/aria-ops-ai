import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  MessageSquareText, 
  FileCheck, 
  Copy, 
  ThumbsUp, 
  UserRound, 
  Loader,
  RefreshCw,
  Languages,
  Settings,
  Sparkles
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { generateAIResponse, ResponseGenerationProps } from "@/services";
import { ContentThreatType } from "@/types/intelligence";
import { ResponseToneStyle, AutoResponseSettings } from "@/types/dashboard";
import { storeSecureKey, getSecureKey, hasValidKey } from "@/utils/secureKeyStorage";

interface ResponseTemplateProps {
  type: string;
  description: string;
  icon: React.ReactNode;
  template: string;
}

// Define props for the StrategicResponseEngine component
interface StrategicResponseEngineProps {
  initialContent?: string;
  threatType?: ContentThreatType | string;
  severity?: string;
  platform?: string;
}

const StrategicResponseEngine = ({ 
  initialContent = "", 
  threatType, 
  severity, 
  platform 
}: StrategicResponseEngineProps) => {
  const [responseType, setResponseType] = useState<string>("empathetic");
  const [responseText, setResponseText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [toneStyle, setToneStyle] = useState<ResponseToneStyle>("professional");
  const [contentToRespond, setContentToRespond] = useState<string>(initialContent);
  const [selectedPlatform, setPlatform] = useState<string>(platform || "");
  
  // Update to use secure storage instead of localStorage
  const [apiKey, setApiKey] = useState<string>("");
  const [apiKeyMasked, setApiKeyMasked] = useState<boolean>(hasValidKey('openai_api_key'));
  
  const [usageTokens, setUsageTokens] = useState<number>(0);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("en");
  const [autoResponseSettings, setAutoResponseSettings] = useState<AutoResponseSettings>({
    enabled: false,
    threshold: 'medium',
    reviewRequired: true,
    defaultTone: 'professional'
  });
  
  const responseTemplates: ResponseTemplateProps[] = [
    {
      type: "empathetic",
      description: "Show understanding while addressing concerns",
      icon: <UserRound className="h-4 w-4" />,
      template: "We understand your concerns about [ISSUE]. Our team is committed to resolving this by [ACTION]. Please reach out directly to [CONTACT] so we can make this right for you."
    },
    {
      type: "correction",
      description: "Correct misinformation with facts",
      icon: <FileCheck className="h-4 w-4" />,
      template: "Thank you for bringing this to our attention. We'd like to clarify that [CORRECT INFORMATION]. Here's our evidence: [LINK/FACTS]. Please let us know if you have any other questions."
    },
    {
      type: "apology",
      description: "Take responsibility with genuine apology",
      icon: <ThumbsUp className="h-4 w-4" />,
      template: "We sincerely apologize for [ISSUE]. This doesn't reflect our standards, and we're taking immediate steps to [SOLUTION]. We'd appreciate the opportunity to make this right for you."
    }
  ];
  
  const toneOptions: ResponseToneStyle[] = [
    "professional", 
    "friendly", 
    "formal", 
    "casual", 
    "humorous", 
    "apologetic", 
    "technical", 
    "empathetic"
  ];
  
  const languageOptions = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "ar", name: "Arabic" },
    { code: "ru", name: "Russian" },
    { code: "pt", name: "Portuguese" }
  ];

  // Check for existing API key when component loads
  useEffect(() => {
    // If we have a key in secure storage, show that it's masked
    if (hasValidKey('openai_api_key')) {
      setApiKeyMasked(true);
    }
  }, []);
  
  const handleGenerateResponse = async () => {
    if (!contentToRespond.trim()) {
      toast.error("Please enter content to respond to");
      return;
    }
    
    // Save API key if provided
    if (apiKey) {
      storeSecureKey('openai_api_key', apiKey, 60); // Store for 60 minutes
      setApiKey('');
      setApiKeyMasked(true);
    }
    
    // Check if we have a key after attempting to save
    if (!hasValidKey('openai_api_key')) {
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
    if (!contentToRespond.trim() || !apiKey) {
      toast.error("Please enter content and API key");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const props: ResponseGenerationProps = {
        responseType: "empathetic",
        toneStyle: autoResponseSettings.defaultTone,
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
        description: autoResponseSettings.reviewRequired ? 
          "Please review before sending" : 
          "Response has been sent automatically"
      });
    } catch (error) {
      console.error("Error generating auto-response:", error);
      toast.error("Failed to generate auto-response");
    } finally {
      setIsGenerating(false);
    }
  };

  // Update the API key input render code
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Strategic Response Engine</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="generate">Generate Response</TabsTrigger>
            <TabsTrigger value="templates">Response Templates</TabsTrigger>
            <TabsTrigger value="settings">Auto-Response</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate">
            <div className="space-y-4">
              {/* API Key Input */}
              <div>
                <label className="text-sm font-medium mb-1 block">OpenAI API Key</label>
                {apiKeyMasked ? (
                  <div className="flex space-x-2">
                    <Input
                      type="password"
                      value="••••••••••••••••••••••"
                      disabled
                      className="font-mono text-sm flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setApiKeyMasked(false);
                        setApiKey('');
                      }}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your OpenAI API key"
                    className="font-mono text-sm"
                  />
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Your API key is stored securely in memory and will be cleared when your session ends.
                </p>
              </div>
              
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
                        <SelectItem key={template.type} value={template.type}>
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
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium mb-1 block">Platform Context</label>
                      <Select value={selectedPlatform} onValueChange={setPlatform}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          <SelectItem value="Twitter">Twitter</SelectItem>
                          <SelectItem value="Facebook">Facebook</SelectItem>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="Yelp">Yelp</SelectItem>
                          <SelectItem value="Reddit">Reddit</SelectItem>
                          <SelectItem value="TripAdvisor">TripAdvisor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium mb-1 block">Response Language</label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
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
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="default" 
                  onClick={handleGenerateResponse} 
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <MessageSquareText className="h-4 w-4 mr-2" />
                      Generate Response
                    </>
                  )}
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={handleAutoResponse}
                  disabled={isGenerating || !autoResponseSettings.enabled}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Auto-Respond
                </Button>
                
                {responseText && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={handleRegenerateResponse}
                      disabled={isGenerating}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleCopyResponse}
                      disabled={!responseText}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="space-y-3">
              {responseTemplates.map((template) => (
                <div key={template.type} className="border rounded-md p-3">
                  <div className="flex items-center gap-2 mb-1">
                    {template.icon}
                    <h3 className="font-medium capitalize">{template.type} Response</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                  <div className="bg-gray-50 p-2 rounded text-sm">{template.template}</div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-respond">Enable Auto-Response</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically generate responses to new content
                  </p>
                </div>
                <Switch
                  id="auto-respond"
                  checked={autoResponseSettings.enabled}
                  onCheckedChange={(checked) => 
                    setAutoResponseSettings({...autoResponseSettings, enabled: checked})
                  }
                />
              </div>
              
              <div>
                <Label>Response Threshold</Label>
                <Select 
                  value={autoResponseSettings.threshold}
                  onValueChange={(val: any) => 
                    setAutoResponseSettings({...autoResponseSettings, threshold: val})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Content</SelectItem>
                    <SelectItem value="high">High Severity Only</SelectItem>
                    <SelectItem value="medium">Medium & High Severity</SelectItem>
                    <SelectItem value="none">Disable Auto-Response</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose what severity levels will trigger auto-responses
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="review-required">Require Review</Label>
                  <p className="text-xs text-muted-foreground">
                    Review responses before they are sent
                  </p>
                </div>
                <Switch
                  id="review-required"
                  checked={autoResponseSettings.reviewRequired}
                  onCheckedChange={(checked) => 
                    setAutoResponseSettings({...autoResponseSettings, reviewRequired: checked})
                  }
                />
              </div>
              
              <div>
                <Label>Default Tone</Label>
                <Select 
                  value={autoResponseSettings.defaultTone}
                  onValueChange={(val: any) => 
                    setAutoResponseSettings({...autoResponseSettings, defaultTone: val})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select default tone" />
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
              
              <Button className="w-full" disabled={!autoResponseSettings.enabled}>
                <Settings className="h-4 w-4 mr-2" />
                Save Auto-Response Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StrategicResponseEngine;
