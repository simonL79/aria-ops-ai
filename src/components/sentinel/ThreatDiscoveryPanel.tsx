
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink, Clock, Target, Eye } from 'lucide-react';
import { SentinelService } from '@/services/sentinel/sentinelService';
import type { SentinelClient, SentinelThreatDiscovery } from '@/types/sentinel';

interface ThreatDiscoveryPanelProps {
  client: SentinelClient;
}

export const ThreatDiscoveryPanel = ({ client }: ThreatDiscoveryPanelProps) => {
  const [threats, setThreats] = useState<SentinelThreatDiscovery[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<SentinelThreatDiscovery | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThreats();
  }, [client.id]);

  const loadThreats = async () => {
    setIsLoading(true);
    try {
      const threatsData = await SentinelService.getClientThreats(client.id);
      setThreats(threatsData);
    } catch (error) {
      console.error('Error loading threats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getThreatTypeColor = (type: string) => {
    switch (type) {
      case 'legal_threat': return 'bg-red-100 text-red-800';
      case 'reputation_risk': return 'bg-orange-100 text-orange-800';
      case 'harassment': return 'bg-purple-100 text-purple-800';
      case 'misinformation': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatReach = (reach?: number) => {
    if (!reach) return '< 100';
    if (reach >= 1000000) return `${(reach / 1000000).toFixed(1)}M`;
    if (reach >= 1000) return `${(reach / 1000).toFixed(1)}K`;
    return reach.toString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading threat discovery results...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Threats List */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Discovered Threats ({threats.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {threats.length > 0 ? (
            <div className="space-y-4">
              {threats.map((threat) => (
                <div
                  key={threat.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedThreat?.id === threat.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedThreat(threat)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(threat.severity_level)}>
                        {threat.severity_level.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getThreatTypeColor(threat.threat_type)}>
                        {threat.threat_type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">{threat.platform}</span>
                  </div>
                  
                  <p className="text-sm font-medium mb-1">Entity: {threat.entity_name}</p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {threat.threat_content}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        Reach: {formatReach(threat.potential_reach)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(threat.discovered_at).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(threat.confidence_score * 100)}% confidence
                    </Badge>
                  </div>
                  
                  {threat.source_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-6 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(threat.source_url, '_blank');
                      }}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Source
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-muted-foreground">No threats discovered yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Threat Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Threat Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedThreat ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Entity</label>
                <p className="text-sm">{selectedThreat.entity_name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Platform</label>
                <p className="text-sm">{selectedThreat.platform}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Threat Content</label>
                <p className="text-sm bg-gray-50 p-3 rounded border">
                  {selectedThreat.threat_content}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Severity</label>
                  <Badge className={getSeverityColor(selectedThreat.severity_level)}>
                    {selectedThreat.severity_level.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Confidence</label>
                  <p className="text-sm">{Math.round(selectedThreat.confidence_score * 100)}%</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Potential Reach</label>
                  <p className="text-sm">{formatReach(selectedThreat.potential_reach)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Discovery Method</label>
                  <p className="text-sm">{selectedThreat.discovery_method.replace('_', ' ')}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Discovered</label>
                <p className="text-sm">{new Date(selectedThreat.discovered_at).toLocaleString()}</p>
              </div>
              
              {selectedThreat.social_handle && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Social Handle</label>
                  <p className="text-sm">@{selectedThreat.social_handle}</p>
                </div>
              )}
              
              {selectedThreat.source_url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open(selectedThreat.source_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Original Source
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-muted-foreground">Select a threat to view details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
