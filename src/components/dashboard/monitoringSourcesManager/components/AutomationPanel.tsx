
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Zap, Mail } from "lucide-react";
import { toast } from "sonner";
import { MonitoringSource, ScanResult } from '../types';
import { 
  generateSuggestedActions, 
  generateEmailDraft, 
  analyzeUKCelebritySportsThreat 
} from '../responseAutomation';

interface AutomationPanelProps {
  scanResults: Record<string, ScanResult>;
  sources: MonitoringSource[];
}

const AutomationPanel: React.FC<AutomationPanelProps> = ({ scanResults, sources }) => {
  const handleAutomatedResponse = (scanResult: any) => {
    // Generate automated suggestions
    const suggestions = generateSuggestedActions(scanResult);
    const emailDraft = generateEmailDraft(scanResult, 'internal');
    const ukAnalysis = analyzeUKCelebritySportsThreat(scanResult);
    
    toast.success('Automated response suggestions generated', {
      description: `${suggestions.actions.length} actions recommended with ${suggestions.urgency} urgency`
    });
  };

  if (Object.keys(scanResults).length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          UK Celebrity/Sports Response Automation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <Zap className="h-4 w-4" />
          <AlertDescription>
            Automated response suggestions are available for detected UK celebrity and sports threats. 
            Click "Generate Response" to get instant action plans and email drafts.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-3">
          {Object.entries(scanResults).map(([sourceId, result]) => (
            <div key={sourceId} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{sources.find(s => s.id === sourceId)?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {result.matches_found || 0} threats detected
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleAutomatedResponse(result)}
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Generate Response
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    const emailDraft = generateEmailDraft(result, 'internal');
                    toast.success('Email draft generated', {
                      description: emailDraft.subject
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Draft Email
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomationPanel;
