
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  MessageSquareText, 
  FileCheck, 
  Copy, 
  ThumbsUp, 
  UserRound, 
  Loader 
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface ResponseTemplateProps {
  type: string;
  description: string;
  icon: React.ReactNode;
  template: string;
}

const StrategicResponseEngine = () => {
  const [responseType, setResponseType] = useState<string>("empathetic");
  const [responseText, setResponseText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [toneStyle, setToneStyle] = useState<string>("professional");
  
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
  
  const handleGenerateResponse = () => {
    setIsGenerating(true);
    const selectedTemplate = responseTemplates.find(template => template.type === responseType);
    
    // Simulate AI generation
    setTimeout(() => {
      if (selectedTemplate) {
        setResponseText(selectedTemplate.template);
      }
      setIsGenerating(false);
      toast.success("AI response generated successfully");
    }, 1500);
  };
  
  const handleCopyResponse = () => {
    navigator.clipboard.writeText(responseText);
    toast.success("Response copied to clipboard");
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Strategic Response Engine</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="generate">Generate Response</TabsTrigger>
            <TabsTrigger value="templates">Response Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate">
            <div className="space-y-4">
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
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Tone & Style</label>
                  <Select value={toneStyle} onValueChange={setToneStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              
              <div className="flex gap-2">
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
                  variant="outline" 
                  onClick={handleCopyResponse}
                  disabled={!responseText}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
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
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StrategicResponseEngine;
