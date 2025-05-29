
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Clock, ExternalLink, Eye, Target } from "lucide-react";
import { getLiveThreats } from '@/services/ariaCore/threatIngestion';
import { supabase } from '@/integrations/supabase/client';

interface ThreatResult {
  id: string;
  source: string;
  content: string;
  threat_type: string;
  sentiment: string;
  risk_score: number;
  summary: string;
  status: string;
  detected_at: string;
  is_live: boolean;
}

const ThreatResultsPanel = () => {
  const [threats, setThreats] = useState<ThreatResult[]>([]);
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setIsLoading(true);
    try {
      // Load live threats
      const liveThreats = await getLiveThreats();
      setThreats(liveThreats || []);

      // Load recent scan results
      const { data: scanData, error } = await supabase
        .from('scan_results')
        .select('*')
        .not('content', 'ilike', '%mock%')
        .not('content', 'ilike', '%demo%')
        .not('content', 'ilike', '%test%')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error loading scan results:', error);
      } else {
        setScanResults(scanData || []);
      }
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (riskScore: number) => {
    if (riskScore >= 80) return 'bg-red-500 text-white';
    if (riskScore >= 60) return 'bg-orange-500 text-white';
    if (riskScore >= 40) return 'bg-yellow-500 text-white';
    return 'bg-green-500 text-white';
  };

  const getThreatTypeIcon = (threatType: string) => {
    switch (threatType) {
      case 'social_media':
        return '📱';
      case 'legal':
        return '⚖️';
      case 'forum':
        return '💬';
      case 'news':
        return '📰';
      case 'professional':
        return '💼';
      default:
        return '🚨';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const totalResults = threats.length + scanResults.length;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Loading Results...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Live Threat Results ({totalResults} found)
            </div>
            <Button onClick={loadResults} size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {totalResults === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No live threats detected</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Live Threats Section */}
              {threats.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Processed Threats ({threats.length})
                  </h3>
                  <div className="space-y-3">
                    {threats.map((threat, index) => (
                      <div key={threat.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getThreatTypeIcon(threat.threat_type)}</span>
                            <Badge className={getSeverityColor(threat.risk_score)}>
                              Risk: {threat.risk_score}%
                            </Badge>
                            <Badge variant="outline">
                              {threat.threat_type.replace('_', ' ').toUpperCase()}
                            </Badge>
                            {threat.is_live && (
                              <Badge className="bg-green-100 text-green-800">
                                LIVE
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(threat.detected_at)}
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <p className="font-medium">{threat.source}</p>
                          <p className="text-sm text-muted-foreground">{threat.summary}</p>
                        </div>
                        
                        <div className="text-sm bg-gray-50 p-3 rounded">
                          {threat.content.substring(0, 200)}
                          {threat.content.length > 200 && '...'}
                        </div>
                        
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="secondary">
                            Sentiment: {threat.sentiment}
                          </Badge>
                          <Badge variant={threat.status === 'active' ? 'default' : 'secondary'}>
                            {threat.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scan Results Section */}
              {scanResults.length > 0 && (
                <div>
                  {threats.length > 0 && <Separator />}
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Recent Scan Results ({scanResults.length})
                  </h3>
                  <div className="space-y-3">
                    {scanResults.map((result, index) => (
                      <div key={result.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {result.platform || 'Unknown Platform'}
                            </Badge>
                            <Badge className={
                              result.severity === 'high' ? 'bg-red-500 text-white' :
                              result.severity === 'medium' ? 'bg-orange-500 text-white' :
                              'bg-blue-500 text-white'
                            }>
                              {(result.severity || 'medium').toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(result.created_at)}
                          </div>
                        </div>
                        
                        <div className="text-sm bg-gray-50 p-3 rounded mb-2">
                          {result.content?.substring(0, 200) || 'No content available'}
                          {result.content && result.content.length > 200 && '...'}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {result.url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={result.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Source
                              </a>
                            </Button>
                          )}
                          <Badge variant="secondary">
                            Status: {result.status || 'New'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreatResultsPanel;
