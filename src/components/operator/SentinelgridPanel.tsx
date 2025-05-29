
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, AlertTriangle, Shield, Eye, Radar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface GlobalRiskIndicator {
  id: string;
  region: string;
  risk_type: string;
  source?: string;
  severity?: number;
  is_active: boolean;
  indicator_details?: string;
  detected_at: string;
}

interface EntityRiskLink {
  id: string;
  entity_name: string;
  risk_id: string;
  relevance_score?: number;
  linked_at: string;
}

export const SentinelgridPanel = () => {
  const [riskIndicators, setRiskIndicators] = useState<GlobalRiskIndicator[]>([]);
  const [entityRiskLinks, setEntityRiskLinks] = useState<EntityRiskLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSentinelgridData();
  }, []);

  const loadSentinelgridData = async () => {
    await Promise.all([loadRiskIndicators(), loadEntityRiskLinks()]);
  };

  const loadRiskIndicators = async () => {
    try {
      // Use mock data since the tables are newly created
      const mockData: GlobalRiskIndicator[] = [
        {
          id: '1',
          region: 'United Kingdom',
          risk_type: 'geopolitical',
          source: 'WorldRiskMonitor',
          severity: 78,
          is_active: true,
          indicator_details: 'Heightened tensions in regional economic policy',
          detected_at: new Date().toISOString()
        },
        {
          id: '2',
          region: 'European Union',
          risk_type: 'economic',
          source: 'Global Economic Intelligence',
          severity: 65,
          is_active: true,
          indicator_details: 'Currency volatility affecting market stability',
          detected_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          region: 'Asia Pacific',
          risk_type: 'cyber',
          source: 'CyberThreat Alliance',
          severity: 89,
          is_active: true,
          indicator_details: 'Advanced persistent threat campaign targeting infrastructure',
          detected_at: new Date(Date.now() - 7200000).toISOString()
        }
      ];
      setRiskIndicators(mockData);
    } catch (error) {
      console.error('Error loading risk indicators:', error);
      setRiskIndicators([]);
    }
  };

  const loadEntityRiskLinks = async () => {
    try {
      const mockData: EntityRiskLink[] = [
        {
          id: '1',
          entity_name: 'Financial Corp',
          risk_id: '1',
          relevance_score: 85,
          linked_at: new Date().toISOString()
        },
        {
          id: '2',
          entity_name: 'Tech Startup',
          risk_id: '3',
          relevance_score: 92,
          linked_at: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: '3',
          entity_name: 'Global Bank',
          risk_id: '2',
          relevance_score: 73,
          linked_at: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      setEntityRiskLinks(mockData);
    } catch (error) {
      console.error('Error loading entity risk links:', error);
      setEntityRiskLinks([]);
    }
  };

  const getSeverityColor = (severity?: number) => {
    if (!severity) return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    if (severity >= 80) return 'bg-red-500/20 text-red-400 border-red-500/50';
    if (severity >= 60) return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    if (severity >= 40) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-green-500/20 text-green-400 border-green-500/50';
  };

  const getRiskTypeColor = (type: string) => {
    switch (type) {
      case 'geopolitical':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'economic':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'cyber':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'environmental':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getRelevanceColor = (score?: number) => {
    if (!score) return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    if (score >= 90) return 'bg-red-500/20 text-red-400 border-red-500/50';
    if (score >= 75) return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    if (score >= 50) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-green-500/20 text-green-400 border-green-500/50';
  };

  const scanGlobalRisk = async () => {
    setIsLoading(true);
    try {
      const regions = ['North America', 'South America', 'Africa', 'Middle East', 'Australia'];
      const riskTypes = ['geopolitical', 'economic', 'cyber', 'environmental', 'social'];
      const sources = ['Global Risk Monitor', 'Threat Intelligence Network', 'Economic Watch'];
      
      const randomRegion = regions[Math.floor(Math.random() * regions.length)];
      const randomType = riskTypes[Math.floor(Math.random() * riskTypes.length)];
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      const randomSeverity = Math.floor(Math.random() * 40) + 60;
      
      const newRisk: GlobalRiskIndicator = {
        id: Date.now().toString(),
        region: randomRegion,
        risk_type: randomType,
        source: randomSource,
        severity: randomSeverity,
        is_active: true,
        indicator_details: `${randomType.charAt(0).toUpperCase() + randomType.slice(1)} risk detected in ${randomRegion}`,
        detected_at: new Date().toISOString()
      };

      setRiskIndicators(prev => [newRisk, ...prev.slice(0, 9)]);
      toast.success('New global risk detected by SENTINELGRID™');
    } catch (error) {
      console.error('Error scanning global risk:', error);
      toast.error('Failed to scan global risks');
    } finally {
      setIsLoading(false);
    }
  };

  const linkEntityRisk = async () => {
    setIsLoading(true);
    try {
      const entities = ['Global Corp', 'Innovation Labs', 'Defense Contractor', 'Energy Company'];
      const randomEntity = entities[Math.floor(Math.random() * entities.length)];
      const randomRiskId = riskIndicators[Math.floor(Math.random() * riskIndicators.length)]?.id || '1';
      const randomRelevance = Math.floor(Math.random() * 30) + 70;
      
      const newLink: EntityRiskLink = {
        id: Date.now().toString(),
        entity_name: randomEntity,
        risk_id: randomRiskId,
        relevance_score: randomRelevance,
        linked_at: new Date().toISOString()
      };

      setEntityRiskLinks(prev => [newLink, ...prev.slice(0, 9)]);
      toast.success('Entity risk link established');
    } catch (error) {
      console.error('Error linking entity risk:', error);
      toast.error('Failed to link entity risk');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeMesh = async () => {
    setIsLoading(true);
    try {
      const activeRisks = riskIndicators.filter(risk => risk.is_active);
      const highSeverityRisks = riskIndicators.filter(risk => (risk.severity || 0) >= 80);
      const totalLinks = entityRiskLinks.length;
      
      toast.success(
        `SENTINELGRID™ Analysis: ${activeRisks.length} active risks, ${highSeverityRisks.length} critical, ${totalLinks} entity links`
      );
    } catch (error) {
      console.error('Error analyzing mesh:', error);
      toast.error('Failed to analyze risk mesh');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Global Risk Indicators */}
      <Card className="bg-black border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
            <Globe className="h-4 w-4" />
            SENTINELGRID™ Global Risk Indicators
            <Button
              size="sm"
              onClick={scanGlobalRisk}
              disabled={isLoading}
              className="ml-auto text-xs bg-purple-600 hover:bg-purple-700"
            >
              <Radar className="h-3 w-3 mr-1" />
              Scan
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {riskIndicators.length === 0 ? (
            <div className="text-gray-500 text-sm">No global risks detected</div>
          ) : (
            riskIndicators.map((risk) => (
              <div key={risk.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <AlertTriangle className="h-4 w-4 text-purple-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-purple-300">[{risk.region}]</span>
                  </div>
                  <div className="text-xs text-purple-400 mb-1">
                    {risk.indicator_details || 'No details available'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Source: {risk.source || 'Unknown'} | {new Date(risk.detected_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getRiskTypeColor(risk.risk_type)}>
                    {risk.risk_type}
                  </Badge>
                  <Badge className={getSeverityColor(risk.severity)}>
                    {risk.severity || 0}%
                  </Badge>
                  <Badge className={risk.is_active ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-gray-500/20 text-gray-400 border-gray-500/50'}>
                    {risk.is_active ? 'active' : 'inactive'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Entity Risk Links */}
      <Card className="bg-black border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-orange-400 text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Entity Risk Correlation Network
            <Button
              size="sm"
              onClick={linkEntityRisk}
              disabled={isLoading}
              className="ml-auto text-xs bg-orange-600 hover:bg-orange-700"
            >
              <Eye className="h-3 w-3 mr-1" />
              Link
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {entityRiskLinks.length === 0 ? (
            <div className="text-gray-500 text-sm">No entity risk links established</div>
          ) : (
            entityRiskLinks.map((link) => (
              <div key={link.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Shield className="h-4 w-4 text-orange-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-orange-300">[{link.entity_name}]</span>
                  </div>
                  <div className="text-xs text-orange-400 mb-1">
                    Linked to Risk ID: {link.risk_id}
                  </div>
                  <div className="text-xs text-gray-500">
                    Linked: {new Date(link.linked_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getRelevanceColor(link.relevance_score)}>
                    {link.relevance_score || 0}%
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Mesh Analysis Controls */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Risk Mesh Analysis Engine
            <Button
              size="sm"
              onClick={analyzeMesh}
              disabled={isLoading}
              className="ml-auto text-xs bg-green-600 hover:bg-green-700"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Analyze
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{riskIndicators.filter(r => r.is_active).length}</div>
              <div className="text-xs text-gray-500">Active Risks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{riskIndicators.filter(r => (r.severity || 0) >= 80).length}</div>
              <div className="text-xs text-gray-500">Critical Risks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{entityRiskLinks.length}</div>
              <div className="text-xs text-gray-500">Entity Links</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
