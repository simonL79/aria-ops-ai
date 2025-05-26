
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Globe, Shield, Clock, Users, Target } from 'lucide-react';
import { OSINTEnrichment, AttributionAssessment } from '@/types/intelligence/fusion';
import { OSINTEnrichmentService } from '@/services/intelligence/osintEnrichment';
import { AttributionEngine } from '@/services/intelligence/attributionEngine';

interface IntelDossierProps {
  threatId: string;
  threatData: any;
  onClose?: () => void;
}

const IntelDossier = ({ threatId, threatData, onClose }: IntelDossierProps) => {
  const [enrichment, setEnrichment] = useState<OSINTEnrichment>({});
  const [attribution, setAttribution] = useState<AttributionAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const osintService = new OSINTEnrichmentService();
  const attributionEngine = new AttributionEngine();

  useEffect(() => {
    loadIntelligence();
  }, [threatId]);

  const loadIntelligence = async () => {
    setIsLoading(true);
    try {
      const [enrichmentData, attributionData] = await Promise.all([
        osintService.enrichThreat(threatId, threatData.url),
        attributionEngine.assessAttribution(threatData)
      ]);
      
      setEnrichment(enrichmentData);
      setAttribution(attributionData);
    } catch (error) {
      console.error('Intelligence loading failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getOriginBadgeColor = (origin: string) => {
    switch (origin) {
      case 'campaign': return 'destructive';
      case 'botnet': return 'default';
      case 'individual': return 'secondary';
      default: return 'outline';
    }
  };

  const getIntentBadgeColor = (intent: string) => {
    switch (intent) {
      case 'disinformation': return 'destructive';
      case 'reputation_damage': return 'default';
      case 'harassment': return 'secondary';
      default: return 'outline';
    }
  };

  const getIndicatorsArray = (indicators: AttributionAssessment['indicators']): string[] => {
    if (Array.isArray(indicators)) {
      return indicators;
    }
    
    // Extract indicators from the structured format
    const result: string[] = [];
    if (indicators.linguistic?.patterns) result.push(...indicators.linguistic.patterns);
    if (indicators.technical?.ipGeolocation) result.push(...indicators.technical.ipGeolocation);
    if (indicators.behavioral?.activityPatterns) result.push(...indicators.behavioral.activityPatterns);
    return result;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Intelligence Dossier...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Intelligence Dossier - {threatId.slice(0, 8)}
              </CardTitle>
              <CardDescription>
                Comprehensive threat analysis and attribution assessment
              </CardDescription>
            </div>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="osint">OSINT</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-4 w-4" />
                  Threat Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Platform: </span>
                  <Badge variant="outline">{threatData.platform}</Badge>
                </div>
                <div>
                  <span className="font-medium">Severity: </span>
                  <Badge variant={threatData.severity === 'high' ? 'destructive' : 'default'}>
                    {threatData.severity}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Source Type: </span>
                  <Badge variant="secondary">{threatData.source_type || 'Unknown'}</Badge>
                </div>
                <div className="pt-2">
                  <span className="font-medium">Content: </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {threatData.content}
                  </p>
                </div>
              </CardContent>
            </Card>

            {attribution && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-4 w-4" />
                    Attribution Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">Suspected Origin: </span>
                    <Badge variant={getOriginBadgeColor(attribution.suspectedOrigin)}>
                      {attribution.suspectedOrigin.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Intent Profile: </span>
                    <Badge variant={getIntentBadgeColor(attribution.intentProfile)}>
                      {attribution.intentProfile.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Coordination Score: </span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${attribution.coordinationScore * 100}%` }}
                        />
                      </div>
                      <span className="text-sm">{Math.round(attribution.coordinationScore * 100)}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Confidence: </span>
                    <Badge variant="outline">
                      {Math.round(attribution.confidence * 100)}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="attribution">
          {attribution ? (
            <Card>
              <CardHeader>
                <CardTitle>Attribution Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">AI Reasoning:</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    {attribution.reasoning}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Indicators ({getIndicatorsArray(attribution.indicators).length}):</h4>
                  <div className="space-y-2">
                    {getIndicatorsArray(attribution.indicators).map((indicator, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{indicator}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Attribution analysis not available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="osint">
          <div className="space-y-4">
            {enrichment.domain && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Domain Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">Reputation Score: </span>
                    <Badge variant={enrichment.domain.reputation > 70 ? 'default' : 'destructive'}>
                      {enrichment.domain.reputation}/100
                    </Badge>
                  </div>
                  
                  {enrichment.domain.whois && (
                    <div>
                      <h4 className="font-medium mb-2">WHOIS Data:</h4>
                      <div className="bg-muted p-3 rounded text-sm space-y-1">
                        <div>Registrar: {enrichment.domain.whois.registrar}</div>
                        <div>Created: {enrichment.domain.whois.creationDate}</div>
                        <div>Expires: {enrichment.domain.whois.expirationDate}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {enrichment.threatFeeds && (
              <Card>
                <CardHeader>
                  <CardTitle>Threat Intelligence Feeds</CardTitle>
                </CardHeader>
                <CardContent>
                  {enrichment.threatFeeds.knownActor ? (
                    <div className="space-y-2">
                      <Badge variant="destructive">Known Threat Actor</Badge>
                      {enrichment.threatFeeds.ttps.length > 0 && (
                        <div>
                          <span className="font-medium">TTPs: </span>
                          {enrichment.threatFeeds.ttps.map((ttp, index) => (
                            <Badge key={index} variant="outline" className="mr-1">
                              {ttp}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Confidence: </span>
                        <Badge variant="outline">
                          {Math.round(enrichment.threatFeeds.confidence * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No known threat indicators found</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Threat Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <div className="font-medium">Threat Detected</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(threatData.created_at).toLocaleString()}
                    </div>
                    <div className="text-sm">Initial threat identified on {threatData.platform}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <div className="font-medium">Intelligence Analysis</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date().toLocaleString()}
                    </div>
                    <div className="text-sm">OSINT enrichment and attribution assessment completed</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelDossier;
