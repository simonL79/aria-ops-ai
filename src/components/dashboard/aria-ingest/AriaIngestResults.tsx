
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { CheckCircle, User, Building, AlertTriangle } from "lucide-react";
import { AriaIngestResponse } from "@/services/ariaIngestService";

interface AriaIngestResultsProps {
  lastResponse: AriaIngestResponse;
}

const AriaIngestResults: React.FC<AriaIngestResultsProps> = ({ lastResponse }) => {
  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'PERSON':
        return <User className="h-3 w-3" />;
      case 'ORG':
        return <Building className="h-3 w-3" />;
      default:
        return <span className="h-3 w-3 bg-gray-400 rounded-full" />;
    }
  };

  const getThreatSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'destructive';
      case 'MEDIUM':
        return 'default';
      case 'LOW':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          {lastResponse.test ? 'Test Results' : 'Processing Results'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lastResponse.payload ? (
          <>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Platform</Label>
                <p className="font-medium">{lastResponse.payload.platform || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Severity</Label>
                <Badge variant={lastResponse.payload.severity === 'high' ? 'destructive' : 'secondary'}>
                  {lastResponse.payload.severity || 'N/A'}
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Content</Label>
              <p className="text-sm bg-muted p-2 rounded">{lastResponse.payload.content || 'N/A'}</p>
            </div>

            {/* Threat Analysis Section */}
            {(lastResponse.payload.threat_summary || lastResponse.payload.threat_severity) && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-amber-800">Threat Analysis</span>
                  {lastResponse.payload.threat_severity && (
                    <Badge variant={getThreatSeverityColor(lastResponse.payload.threat_severity) as any}>
                      {lastResponse.payload.threat_severity}
                    </Badge>
                  )}
                </div>
                {lastResponse.payload.threat_summary && (
                  <p className="text-amber-700 text-sm">
                    {lastResponse.payload.threat_summary}
                  </p>
                )}
              </div>
            )}

            <div>
              <Label className="text-muted-foreground">Detected Entities</Label>
              {lastResponse.payload.detected_entities && lastResponse.payload.detected_entities.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {lastResponse.payload.detected_entities.map((entity, idx) => (
                    <Badge key={idx} variant="outline" className="flex items-center gap-1">
                      {getEntityIcon(entity.type)}
                      {entity.name}
                      <span className="text-xs text-muted-foreground">({entity.type})</span>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No entities detected</p>
              )}
            </div>

            {lastResponse.payload.risk_entity_name && (
              <div>
                <Label className="text-muted-foreground">Primary Risk Entity</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="destructive" className="flex items-center gap-1">
                    {getEntityIcon(lastResponse.payload.risk_entity_type || '')}
                    {lastResponse.payload.risk_entity_name}
                  </Badge>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Confidence</Label>
                <p className="font-medium">{lastResponse.payload.confidence_score || 0}%</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <p className="font-medium">{lastResponse.payload.status || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Source Type</Label>
                <p className="font-medium">{lastResponse.payload.source_type || 'N/A'}</p>
              </div>
            </div>
          </>
        ) : lastResponse.inserted ? (
          <>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Platform</Label>
                <p className="font-medium">{lastResponse.inserted.platform || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Severity</Label>
                <Badge variant={lastResponse.inserted.severity === 'high' ? 'destructive' : 'secondary'}>
                  {lastResponse.inserted.severity || 'N/A'}
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Content</Label>
              <p className="text-sm bg-muted p-2 rounded">{lastResponse.inserted.content || 'N/A'}</p>
            </div>

            <div>
              <Label className="text-muted-foreground">Detected Entities</Label>
              {lastResponse.inserted.detected_entities && lastResponse.inserted.detected_entities.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {lastResponse.inserted.detected_entities.map((entity: any, idx: number) => (
                    <Badge key={idx} variant="outline" className="flex items-center gap-1">
                      {getEntityIcon(entity.type || 'UNKNOWN')}
                      {entity.name || entity}
                      <span className="text-xs text-muted-foreground">({entity.type || 'UNKNOWN'})</span>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No entities detected</p>
              )}
            </div>

            {lastResponse.inserted.risk_entity_name && (
              <div>
                <Label className="text-muted-foreground">Primary Risk Entity</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="destructive" className="flex items-center gap-1">
                    {getEntityIcon(lastResponse.inserted.risk_entity_type || '')}
                    {lastResponse.inserted.risk_entity_name}
                  </Badge>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Response received but no data to display</p>
          </div>
        )}

        {lastResponse.message && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-700">{lastResponse.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AriaIngestResults;
