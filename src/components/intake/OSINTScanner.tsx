
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, AlertTriangle, Eye, ExternalLink, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface OSINTThreat {
  source: string;
  sentiment: number;
  content: string;
  severity: 'low' | 'medium' | 'high';
  url: string;
  detected_at: string;
}

interface OSINTResult {
  threats: OSINTThreat[];
  sentiment: number;
  riskScore: number;
}

interface OSINTScannerProps {
  entityName: string;
  onResults: (results: OSINTResult) => void;
}

export const OSINTScanner = ({ entityName, onResults }: OSINTScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<OSINTResult | null>(null);

  const performOSINTScan = async () => {
    if (!entityName || entityName.length < 2) {
      toast.error('Entity name required for OSINT scan');
      return;
    }

    setIsScanning(true);
    try {
      console.log(`🔍 A.R.I.A™ OSINT Scan: ${entityName}`);
      
      // Call live OSINT scanning edge function
      const { data, error } = await supabase.functions.invoke('live-entity-validator', {
        body: {
          entityName: entityName,
          validationType: 'osint_scan',
          platforms: ['google', 'reddit', 'news', 'social']
        }
      });
      
      if (error) {
        console.error('OSINT scan error:', error);
        throw new Error('OSINT scan failed');
      }
      
      if (data?.success && data?.result?.osintData) {
        const osintResults = data.result.osintData;
        setResults(osintResults);
        onResults(osintResults);
        
        const threatsFound = osintResults.threats.length;
        const riskLevel = osintResults.riskScore;
        
        if (threatsFound > 0) {
          if (riskLevel > 0.7) {
            toast.error(`High-risk threats detected: ${threatsFound} threats found`, {
              description: `Risk score: ${Math.round(riskLevel * 100)}% - Immediate review recommended`
            });
          } else if (riskLevel > 0.4) {
            toast.warning(`Moderate threats detected: ${threatsFound} threats found`, {
              description: `Risk score: ${Math.round(riskLevel * 100)}% - Monitor closely`
            });
          } else {
            toast.info(`Low-level mentions found: ${threatsFound} items`, {
              description: `Risk score: ${Math.round(riskLevel * 100)}% - Routine monitoring`
            });
          }
        } else {
          toast.success('OSINT scan complete: No significant threats detected', {
            description: 'Entity appears to have clean online presence'
          });
        }
      } else {
        throw new Error('Invalid response from OSINT scanner');
      }
      
    } catch (error) {
      console.error('OSINT scan error:', error);
      toast.error('OSINT scan failed', {
        description: 'Unable to complete live threat intelligence gathering'
      });
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score > 0.7) return 'text-red-600';
    if (score > 0.4) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card className="border-orange-200 bg-orange-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-lg">Live OSINT Intelligence</CardTitle>
          </div>
          <Button
            onClick={performOSINTScan}
            disabled={isScanning || !entityName}
            size="sm"
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Start OSINT Scan
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isScanning && (
          <div className="flex items-center gap-2 text-sm text-orange-600 p-3 bg-orange-100 rounded">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Performing live intelligence gathering across news sources and social platforms...</span>
          </div>
        )}
        
        {results && !isScanning && (
          <div className="space-y-4">
            {/* Risk Summary */}
            <div className="p-3 bg-white rounded border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Threat Assessment</span>
                <Badge className={getRiskScoreColor(results.riskScore)}>
                  Risk Score: {Math.round(results.riskScore * 100)}%
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Threats Found:</span>
                  <span className="ml-1 font-medium">{results.threats.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Sentiment:</span>
                  <span className={`ml-1 font-medium ${results.sentiment < -0.2 ? 'text-red-600' : results.sentiment > 0.2 ? 'text-green-600' : 'text-gray-600'}`}>
                    {results.sentiment > 0 ? 'Positive' : results.sentiment < 0 ? 'Negative' : 'Neutral'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Scan:</span>
                  <span className="ml-1 font-medium">
                    <Clock className="inline h-3 w-3 mr-1" />
                    Now
                  </span>
                </div>
              </div>
            </div>

            {/* Threat Details */}
            {results.threats.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  Detected Threats
                </h4>
                
                {results.threats.slice(0, 5).map((threat, index) => (
                  <div key={index} className="p-3 bg-white rounded border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(threat.severity)}>
                          {threat.severity.toUpperCase()}
                        </Badge>
                        <span className="text-sm font-medium">{threat.source}</span>
                      </div>
                      {threat.url && (
                        <a 
                          href={threat.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-700">{threat.content}</p>
                    
                    <div className="text-xs text-muted-foreground">
                      Detected: {new Date(threat.detected_at).toLocaleString()}
                    </div>
                  </div>
                ))}
                
                {results.threats.length > 5 && (
                  <div className="text-sm text-muted-foreground text-center p-2">
                    ... and {results.threats.length - 5} more threats
                  </div>
                )}
              </div>
            )}

            {results.threats.length === 0 && (
              <div className="p-4 bg-green-50 rounded border border-green-200 text-center">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-green-800 font-medium">Clean Online Presence</p>
                <p className="text-xs text-green-600">No significant threats detected in current scan</p>
              </div>
            )}
          </div>
        )}
        
        {!results && !isScanning && (
          <div className="text-sm text-muted-foreground text-center p-4">
            Click "Start OSINT Scan" to perform live threat intelligence gathering
          </div>
        )}
      </CardContent>
    </Card>
  );
};
