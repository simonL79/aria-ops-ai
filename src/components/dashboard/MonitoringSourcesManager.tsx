
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, Zap, Mail } from "lucide-react";
import { toast } from "sonner";
import SourceCard from './monitoringSourcesManager/SourceCard';
import CustomRSSForm from './monitoringSourcesManager/CustomRSSForm';
import { useMonitoringSources } from './monitoringSourcesManager/useMonitoringSources';
import { getStatusBadge } from './monitoringSourcesManager/utils';
import { 
  generateSuggestedActions, 
  generateEmailDraft, 
  analyzeUKCelebritySportsThreat 
} from './monitoringSourcesManager/responseAutomation';

const MonitoringSourcesManager = () => {
  const {
    sources,
    isLoading,
    scanResults,
    triggerScan,
    toggleSource,
    addSource,
    filterByType
  } = useMonitoringSources();

  const [selectedScanResult, setSelectedScanResult] = useState<any>(null);
  const [showAutomation, setShowAutomation] = useState(false);

  const handleAutomatedResponse = (scanResult: any) => {
    setSelectedScanResult(scanResult);
    setShowAutomation(true);
    
    // Generate automated suggestions
    const suggestions = generateSuggestedActions(scanResult);
    const emailDraft = generateEmailDraft(scanResult, 'internal');
    const ukAnalysis = analyzeUKCelebritySportsThreat(scanResult);
    
    toast.success('Automated response suggestions generated', {
      description: `${suggestions.actions.length} actions recommended with ${suggestions.urgency} urgency`
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            UK Celebrity & Sports Monitoring Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Sources</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="news">UK News & Entertainment</TabsTrigger>
              <TabsTrigger value="review">Reviews</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {sources.map(source => (
                <SourceCard 
                  key={source.id} 
                  source={source} 
                  onToggle={toggleSource}
                  onScan={triggerScan}
                  isLoading={isLoading}
                  scanResult={scanResults[source.id]}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="social" className="space-y-4">
              {filterByType('social').map(source => (
                <SourceCard 
                  key={source.id} 
                  source={source} 
                  onToggle={toggleSource}
                  onScan={triggerScan}
                  isLoading={isLoading}
                  scanResult={scanResults[source.id]}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="news" className="space-y-4">
              {filterByType('news').map(source => (
                <SourceCard 
                  key={source.id} 
                  source={source} 
                  onToggle={toggleSource}
                  onScan={triggerScan}
                  isLoading={isLoading}
                  scanResult={scanResults[source.id]}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="review" className="space-y-4">
              {filterByType('review').map(source => (
                <SourceCard 
                  key={source.id} 
                  source={source} 
                  onToggle={toggleSource}
                  onScan={triggerScan}
                  isLoading={isLoading}
                  scanResult={scanResults[source.id]}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <CustomRSSForm onAddSource={addSource} />
              
              {sources.filter(s => s.id.startsWith('custom-')).map(source => (
                <SourceCard 
                  key={source.id} 
                  source={source} 
                  onToggle={toggleSource}
                  onScan={triggerScan}
                  isLoading={isLoading}
                  scanResult={scanResults[source.id]}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Automation Panel */}
      {Object.keys(scanResults).length > 0 && (
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
      )}
    </div>
  );
};

export default MonitoringSourcesManager;
