
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Search, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NewsAlert {
  id: string;
  headline: string;
  source: string;
  url: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
  entityMentions: string[];
}

const UKNewsScanPanel = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [newsAlerts, setNewsAlerts] = useState<NewsAlert[]>([]);

  const runUKNewsScan = async () => {
    setIsScanning(true);
    try {
      toast.info('Scanning UK news sources for entity mentions...');

      // Get recent scan results that might be from UK news sources
      const { data: results, error } = await supabase
        .from('scan_results')
        .select('*')
        .ilike('platform', '%news%')
        .or('platform.ilike.%bbc%,platform.ilike.%guardian%,platform.ilike.%times%,platform.ilike.%telegraph%')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        throw error;
      }

      const alerts: NewsAlert[] = (results || []).map(result => ({
        id: result.id,
        headline: result.content?.substring(0, 100) + '...' || 'News Alert',
        source: result.platform || 'UK News',
        url: result.url || '#',
        timestamp: result.created_at,
        severity: result.severity as 'high' | 'medium' | 'low',
        entityMentions: result.risk_entity_name ? [result.risk_entity_name] : []
      }));

      setNewsAlerts(alerts);
      
      if (alerts.length > 0) {
        toast.success(`UK news scan completed: ${alerts.length} relevant articles found`);
      } else {
        toast.info('UK news scan completed: No recent relevant coverage found');
      }

    } catch (error) {
      console.error('UK news scan error:', error);
      toast.error('UK news scan failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            UK News Intelligence Scanner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Monitor UK news sources (BBC, Guardian, Times, Telegraph) for entity mentions and reputation signals.
            </p>
            
            <Button 
              onClick={runUKNewsScan}
              disabled={isScanning}
              className="w-full bg-[#247CFF] hover:bg-[#1c63cc] text-white"
            >
              {isScanning ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-pulse" />
                  Scanning UK News Sources...
                </>
              ) : (
                <>
                  <Newspaper className="mr-2 h-4 w-4" />
                  Scan UK News Sources
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {newsAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              UK News Coverage ({newsAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {newsAlerts.map((alert) => (
                <div key={alert.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm">{alert.headline}</h4>
                    <Badge className={`${getSeverityColor(alert.severity)} text-white`}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                    <span className="font-medium">{alert.source}</span>
                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                  {alert.entityMentions.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs text-gray-600">Entities: </span>
                      {alert.entityMentions.map((entity, idx) => (
                        <Badge key={idx} variant="outline" className="mr-1 text-xs">
                          {entity}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <a 
                    href={alert.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View Article
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UKNewsScanPanel;
