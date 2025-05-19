
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquareText, Loader, RefreshCw, Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ResponseActionsProps {
  responseText: string;
  isGenerating: boolean;
  autoResponseEnabled: boolean;
  onGenerate: () => void;
  onRegenerate: () => void;
  onCopy: () => void;
  onAutoRespond: () => void;
}

const ResponseActions = ({
  responseText,
  isGenerating,
  autoResponseEnabled,
  onGenerate,
  onRegenerate,
  onCopy,
  onAutoRespond
}: ResponseActionsProps) => {
  // Enhanced copy function with feedback
  const handleCopy = () => {
    if (!responseText) return;
    
    // Call the parent's onCopy handler
    onCopy();
    
    // Copy to clipboard
    navigator.clipboard.writeText(responseText)
      .then(() => {
        toast.success("Response copied to clipboard");
      })
      .catch(err => {
        console.error("Failed to copy text: ", err);
        toast.error("Failed to copy response");
      });
  };
  
  // Enhanced auto-respond function with feedback
  const handleAutoRespond = () => {
    if (!autoResponseEnabled || !responseText) return;
    
    // Call the parent's onAutoRespond handler
    onAutoRespond();
    
    // Show toast
    toast.success("Auto-response deployed", {
      description: "Your response has been sent through selected channels"
    });
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="default" 
        onClick={onGenerate} 
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
        onClick={handleAutoRespond}
        disabled={isGenerating || !autoResponseEnabled || !responseText}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Auto-Respond
      </Button>
      
      {responseText && (
        <>
          <Button 
            variant="outline" 
            onClick={onRegenerate}
            disabled={isGenerating}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleCopy}
            disabled={!responseText}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </>
      )}
    </div>
  );
};

export default ResponseActions;
