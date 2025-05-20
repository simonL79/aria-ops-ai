
import React from "react";
import { Button } from "@/components/ui/button";
import { Shield, RefreshCw } from "lucide-react";

interface ClassificationErrorProps {
  error: string;
  onRetry: () => void;
}

const ClassificationError: React.FC<ClassificationErrorProps> = ({ error, onRetry }) => {
  return (
    <div className="border border-red-200 bg-red-50 rounded-md p-4 text-center">
      <Shield className="h-10 w-10 text-red-400 mx-auto mb-2" />
      <h3 className="text-lg font-medium mb-1">Classification Error</h3>
      <p className="text-sm text-muted-foreground mb-3">{error}</p>
      <Button variant="outline" onClick={onRetry} size="sm" className="mx-auto">
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
};

export default ClassificationError;
