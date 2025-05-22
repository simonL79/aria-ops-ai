
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";

interface ProcessEntitiesButtonProps {
  processing: boolean;
  onProcess: () => void;
}

const ProcessEntitiesButton: React.FC<ProcessEntitiesButtonProps> = ({ processing, onProcess }) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onProcess} 
      disabled={processing}
    >
      {processing ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <RefreshCcw className="h-4 w-4 mr-2" />
      )}
      Process New Items
    </Button>
  );
};

export default ProcessEntitiesButton;
