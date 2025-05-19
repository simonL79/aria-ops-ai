
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentAlert } from "@/types/dashboard";
import { ResponseToneStyle } from "@/types/dashboard";
import { AlertTriangle, Check, MessageSquare, Send, Copy, X } from "lucide-react";
import { generateAIResponse } from "@/services";
import { toast } from "sonner";

interface ActionPanelProps {
  selectedAlert: ContentAlert | null;
  onApprove?: (response: string) => void;
  onSend?: (response: string, alertId: string) => void;
  onDismiss?: () => void;
}

const ActionPanel = ({ selectedAlert, onApprove, onSend, onDismiss }: ActionPanelProps) => {
  const [response, setResponse] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [responseTone, setResponseTone] = useState<ResponseToneStyle>("professional");
  const [responseType, setResponseType] = useState<string>("empathetic");
  
  useEffect(() => {
    if (selectedAlert) {
      setResponse("");
    }
  }, [selectedAlert]);
  
  const handleGenerateResponse = async () => {
    if (!selectedAlert) return;
    
    setIsGenerating(true);
    try {
      const generatedResponse = await generateAIResponse({
        responseType,
        toneStyle: responseTone,
        content: selectedAlert.content,
        platform: selectedAlert.platform,
        severity: selectedAlert.severity,
        threatType: selectedAlert.threatType,
      });
      
      setResponse(generatedResponse);
    } catch (error) {
      console.error("Failed to generate response:", error);
      toast.error("Failed to generate response", {
        description: "Please try again or adjust your settings"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(response);
    toast.success("Response copied to clipboard");
  };
  
  const handleSendResponse = () => {
    if (selectedAlert && onSend) {
      onSend(response, selectedAlert.id);
      toast.success("Response sent successfully");
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-alert-negative text-white';
      case 'medium':
        return 'bg-amber-500 text-white';
      case 'low':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  if (!selectedAlert) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span>Action Panel</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground text-center">No content selected</p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Select an alert from the Threat Feed to generate a response
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span>Action Panel</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <Badge className={getSeverityColor(selectedAlert.severity)}>
                {selectedAlert.severity.toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground">{selectedAlert.platform}</span>
            </div>
            <span className="text-xs text-muted-foreground">{selectedAlert.date}</span>
          </div>
          
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm">{selectedAlert.content}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Response Type</label>
            <Select value={responseType} onValueChange={setResponseType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="empathetic">Empathetic</SelectItem>
                <SelectItem value="correction">Correction</SelectItem>
                <SelectItem value="apology">Apology</SelectItem>
                <SelectItem value="gratitude">Gratitude</SelectItem>
                <SelectItem value="clarification">Clarification</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Tone Style</label>
            <Select value={responseTone} onValueChange={(value) => setResponseTone(value as ResponseToneStyle)}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="humorous">Humorous</SelectItem>
                <SelectItem value="apologetic">Apologetic</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="empathetic">Empathetic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGenerateResponse}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>Generating Response...</>
            ) : (
              <>Generate AI Response</>
            )}
          </Button>
        </div>
        
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Response Preview</label>
          <div className="relative">
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="AI-generated response will appear here..."
              className="min-h-[120px] resize-none"
            />
            {response && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={handleCopyToClipboard}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onApprove && onApprove(response)}
          disabled={!response || isGenerating}
        >
          <Check className="mr-2 h-4 w-4" />
          Approve
        </Button>
        <Button
          className="w-full"
          onClick={handleSendResponse}
          disabled={!response || isGenerating}
        >
          <Send className="mr-2 h-4 w-4" />
          Send Response
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActionPanel;
