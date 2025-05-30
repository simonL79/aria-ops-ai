
import React, { useEffect, useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, MessageSquare, Eye } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ContentAlert } from "@/types/dashboard";

const EngagementHubPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedAlert, setSelectedAlert] = useState<ContentAlert | null>(null);
  const [action, setAction] = useState<string>('');

  useEffect(() => {
    // Get alert from sessionStorage or URL params
    const alertData = sessionStorage.getItem('selectedAlert');
    const alertId = searchParams.get('alert');
    const actionParam = searchParams.get('action');

    if (alertData) {
      setSelectedAlert(JSON.parse(alertData));
    }
    
    if (actionParam) {
      setAction(actionParam);
    }
  }, [searchParams]);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">A.R.I.A™ Engagement Hub</h1>
        </div>
        <p className="text-muted-foreground">
          Advanced threat analysis and response generation system
        </p>
      </div>

      {selectedAlert ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Threat Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={selectedAlert.severity === 'high' ? 'destructive' : 'default'}>
                  {selectedAlert.severity.toUpperCase()}
                </Badge>
                <Badge variant="outline">{selectedAlert.platform}</Badge>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Content:</h4>
                <p className="text-sm bg-gray-50 p-3 rounded">{selectedAlert.content}</p>
              </div>

              {selectedAlert.detectedEntities && (
                <div>
                  <h4 className="font-medium mb-2">Detected Entities:</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedAlert.detectedEntities.map((entity, idx) => (
                      <Badge key={idx} variant="secondary">{entity}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Confidence:</span> {selectedAlert.confidenceScore}%
                </div>
                <div>
                  <span className="font-medium">Reach:</span> {selectedAlert.potentialReach?.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {action === 'respond' ? 'Response Generation' : 'Recommended Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {action === 'respond' ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    A.R.I.A™ AI response system is analyzing the threat and generating appropriate responses...
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Suggested Response Strategy:</h4>
                    <p className="text-sm">Based on the threat analysis, a measured response focusing on factual correction and brand protection is recommended.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Comprehensive threat analysis and intelligence gathering completed.
                  </p>
                  <div className="space-y-2">
                    <Button className="w-full gap-2">
                      <Eye className="h-4 w-4" />
                      Generate Detailed Report
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Create Response Strategy
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Alert Selected</h3>
            <p className="text-muted-foreground mb-4">
              Please select an alert from the dashboard to begin analysis.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default EngagementHubPage;
