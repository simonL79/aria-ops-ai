
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Camera, ExternalLink } from "lucide-react";
import { DiscoveredThreat } from '@/hooks/useDiscoveryScanning';
import { toast } from 'sonner';

interface EvidenceReportsPanelProps {
  threats: DiscoveredThreat[];
}

const EvidenceReportsPanel = ({ threats }: EvidenceReportsPanelProps) => {
  const [generatingReports, setGeneratingReports] = useState<Set<string>>(new Set());

  const generateEvidenceReport = async (threat: DiscoveredThreat) => {
    setGeneratingReports(prev => new Set(prev).add(threat.id));
    
    try {
      // Call the evidence report generator edge function
      const response = await fetch('/functions/v1/evidence-report-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threat_id: threat.id,
          entity_name: threat.entityName,
          entity_type: threat.entityType,
          platform: threat.platform,
          content: threat.content,
          threat_level: threat.threatLevel,
          source_url: threat.sourceUrl,
          include_screenshot: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate evidence report');
      }

      const result = await response.json();
      
      if (result.report_url) {
        toast.success("Evidence report generated successfully!");
        // Open the report in a new tab
        window.open(result.report_url, '_blank');
      }
      
    } catch (error) {
      console.error('Error generating evidence report:', error);
      toast.error("Failed to generate evidence report");
    } finally {
      setGeneratingReports(prev => {
        const newSet = new Set(prev);
        newSet.delete(threat.id);
        return newSet;
      });
    }
  };

  const captureScreenshot = async (threat: DiscoveredThreat) => {
    if (!threat.sourceUrl) {
      toast.error("No source URL available for screenshot");
      return;
    }

    try {
      const response = await fetch('/functions/v1/screenshot-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: threat.sourceUrl,
          threat_id: threat.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to capture screenshot');
      }

      const result = await response.json();
      toast.success("Screenshot captured successfully!");
      
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      toast.error("Failed to capture screenshot");
    }
  };

  const highPriorityThreats = threats.filter(t => t.threatLevel >= 6);

  return (
    <div className="space-y-6">
      {/* Report Generator Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Evidence Report Generator
          </CardTitle>
          <CardDescription>
            Create professional PDF reports with threat evidence, screenshots, and response plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Each Report Includes:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>• Executive summary with threat level</div>
              <div>• Source links and evidence</div>
              <div>• Screenshots of original content</div>
              <div>• Suggested response strategies</div>
              <div>• Timestamp and scan metadata</div>
              <div>• Professional formatting for stakeholders</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High Priority Threats for Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Evidence Reports</CardTitle>
          <CardDescription>
            {highPriorityThreats.length} high priority threats available for evidence compilation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {highPriorityThreats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No high priority threats requiring evidence reports at this time.
              </div>
            ) : (
              highPriorityThreats.map((threat) => (
                <div key={threat.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{threat.entityName}</h4>
                        <Badge variant="outline">{threat.entityType}</Badge>
                        <Badge className={threat.threatLevel >= 8 ? 'bg-red-600' : 'bg-orange-500'}>
                          Level {threat.threatLevel}/10
                        </Badge>
                        <Badge variant="secondary">{threat.platform}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {threat.contextSnippet}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Type: {threat.threatType}</span>
                        <span>Sentiment: {threat.sentiment.toFixed(2)}</span>
                        <span>{new Date(threat.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => captureScreenshot(threat)}
                        disabled={!threat.sourceUrl}
                      >
                        <Camera className="mr-1 h-3 w-3" />
                        Screenshot
                      </Button>
                      
                      <Button 
                        size="sm"
                        onClick={() => generateEvidenceReport(threat)}
                        disabled={generatingReports.has(threat.id)}
                      >
                        {generatingReports.has(threat.id) ? (
                          "Generating..."
                        ) : (
                          <>
                            <FileText className="mr-1 h-3 w-3" />
                            Generate Report
                          </>
                        )}
                      </Button>
                      
                      {threat.sourceUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={threat.sourceUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Source
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Report Generation</CardTitle>
          <CardDescription>
            Generate comprehensive reports for multiple threats simultaneously
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full"
              disabled={highPriorityThreats.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Generate Master Evidence Report ({highPriorityThreats.length} threats)
            </Button>
            
            <div className="text-sm text-muted-foreground">
              This will create a comprehensive PDF containing all high priority threats with full evidence documentation, 
              perfect for stakeholder briefings and legal proceedings.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvidenceReportsPanel;
