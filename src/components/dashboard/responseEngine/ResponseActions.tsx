
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquareText, Loader, RefreshCw, Copy, Sparkles } from "lucide-react";

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
        onClick={onAutoRespond}
        disabled={isGenerating || !autoResponseEnabled}
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
            onClick={onCopy}
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
