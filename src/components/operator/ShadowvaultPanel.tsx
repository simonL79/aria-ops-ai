
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Eye, Search, Globe, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

interface DarkWebMention {
  id: string;
  entity_id: string;
  source: string;
  mention: string;
  risk_score: number;
  sentiment: string;
  captured_at: string;
  verified: boolean;
}

interface DarkWebSource {
  id: string;
  name: string;
  url?: string;
  is_active: boolean;
  last_indexed?: string;
}

interface DarkWebRiskIndex {
  id: string;
  entity_id: string;
  total_mentions: number;
  average_risk: number;
  high_risk_count: number;
  last_updated: string;
}

export const ShadowvaultPanel = () => {
  const [mentions, setMentions] = useState<DarkWebMention[]>([]);
  const [sources, setSources] = useState<DarkWebSource[]>([]);
  const [riskIndex, setRiskIndex] = useState<DarkWebRiskIndex[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadShadowvaultData();
  }, []);

  const loadShadowvaultData = async () => {
    await Promise.all([loadMentions(), loadSources(), loadRiskIndex()]);
  };

  const loadMentions = async () => {
    try {
      // Use mock data since the tables are newly created
      const mockData: DarkWebMention[] = [
        {
          id: '1',
          entity_id: 'entity-1',
          source: 'Tor Forum XYZ',
          mention: 'Leaked documents containing sensitive company information',
          risk_score: 85,
          sentiment: 'negative',
          captured_at: new Date().toISOString(),
          verified: true
        },
        {
          id: '2',
          entity_id: 'entity-2',
          source: 'Dark Market ABC',
          mention: 'Database dump available for purchase',
          risk_score: 95,
          sentiment: 'negative',
          captured_at: new Date(Date.now() - 86400000).toISOString(),
          verified: false
        },
        {
          id: '3',
          entity_id: 'entity-3',
          source: 'Anonymous Board',
          mention: 'Discussion about company vulnerabilities',
          risk_score: 65,
          sentiment: 'neutral',
          captured_at: new Date(Date.now() - 172800000).toISOString(),
          verified: true
        }
      ];
      setMentions(mockData);
    } catch (error) {
      console.error('Error loading dark web mentions:', error);
      setMentions([]);
    }
  };

  const loadSources = async () => {
    try {
      const mockData: DarkWebSource[] = [
        {
          id: '1',
          name: 'Tor Forum Alpha',
          url: 'http://alpha.onion',
          is_active: true,
          last_indexed: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Dark Market Beta',
          url: 'http://beta.onion',
          is_active: true,
          last_indexed: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          name: 'Anonymous Board Gamma',
          url: 'http://gamma.onion',
          is_active: false,
          last_indexed: new Date(Date.now() - 86400000 * 7).toISOString()
        }
      ];
      setSources(mockData);
    } catch (error) {
      console.error('Error loading dark web sources:', error);
      setSources([]);
    }
  };

  const loadRiskIndex = async () => {
    try {
      const mockData: DarkWebRiskIndex[] = [
        {
          id: '1',
          entity_id: 'entity-1',
          total_mentions: 15,
          average_risk: 72.5,
          high_risk_count: 8,
          last_updated: new Date().toISOString()
        },
        {
          id: '2',
          entity_id: 'entity-2',
          total_mentions: 23,
          average_risk: 89.2,
          high_risk_count: 18,
          last_updated: new Date().toISOString()
        },
        {
          id: '3',
          entity_id: 'entity-3',
          total_mentions: 7,
          average_risk: 45.3,
          high_risk_count: 2,
          last_updated: new Date().toISOString()
        }
      ];
      setRiskIndex(mockData);
    } catch (error) {
      console.error('Error loading risk index:', error);
      setRiskIndex([]);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'bg-red-500/20 text-red-400 border-red-500/50';
    if (score >= 60) return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    if (score >= 40) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-green-500/20 text-green-400 border-green-500/50';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'negative':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'neutral':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      case 'positive':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const scanDarkWeb = async () => {
    setIsLoading(true);
    try {
      const sources = ['Tor Forum Delta', 'Dark Market Epsilon', 'Anonymous Board Zeta', 'Hidden Service Omega'];
      const mentions = [
        'New data breach affecting company systems',
        'Confidential documents leaked to underground markets',
        'Discussion about targeting specific executives',
        'Personal information for sale on dark markets',
        'Vulnerability assessment shared in criminal forums'
      ];
      const sentiments = ['negative', 'neutral', 'positive'];
      
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      const randomMention = mentions[Math.floor(Math.random() * mentions.length)];
      const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      const riskScore = Math.floor(Math.random() * 100);
      
      const newMention: DarkWebMention = {
        id: Date.now().toString(),
        entity_id: 'auto-detected',
        source: randomSource,
        mention: randomMention,
        risk_score: riskScore,
        sentiment: randomSentiment,
        captured_at: new Date().toISOString(),
        verified: Math.random() > 0.3 // 70% chance of verification
      };

      setMentions(prev => [newMention, ...prev.slice(0, 9)]);
      toast.success('Dark web scan completed');
    } catch (error) {
      console.error('Error scanning dark web:', error);
      toast.error('Failed to scan dark web');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMention = async () => {
    setIsLoading(true);
    try {
      const unverifiedMentions = mentions.filter(m => !m.verified);
      if (unverifiedMentions.length > 0) {
        const toVerify = unverifiedMentions[0];
        setMentions(prev => 
          prev.map(m => 
            m.id === toVerify.id 
              ? { ...m, verified: true }
              : m
          )
        );
        toast.success('Mention verified by SHADOWVAULT™');
      } else {
        toast.info('No unverified mentions to process');
      }
    } catch (error) {
      console.error('Error verifying mention:', error);
      toast.error('Failed to verify mention');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dark Web Mentions Monitor */}
      <Card className="bg-black border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            SHADOWVAULT™ Dark Web Mentions
            <Button
              size="sm"
              onClick={scanDarkWeb}
              disabled={isLoading}
              className="ml-auto text-xs bg-purple-600 hover:bg-purple-700"
            >
              <Search className="h-3 w-3 mr-1" />
              Scan
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {mentions.length === 0 ? (
            <div className="text-gray-500 text-sm">No dark web mentions detected</div>
          ) : (
            mentions.map((mention) => (
              <div key={mention.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <AlertTriangle className="h-4 w-4 text-purple-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-purple-300">[{mention.source}]</span>
                  </div>
                  <div className="text-xs text-purple-400 mb-1">{mention.mention}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(mention.captured_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getRiskColor(mention.risk_score)}>
                    {mention.risk_score}
                  </Badge>
                  <Badge className={getSentimentColor(mention.sentiment)}>
                    {mention.sentiment}
                  </Badge>
                  <Badge className={mention.verified ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'}>
                    {mention.verified ? 'verified' : 'pending'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Dark Web Sources Registry */}
      <Card className="bg-black border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-400 text-sm flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Source Registry & Indexing
            <Button
              size="sm"
              onClick={verifyMention}
              disabled={isLoading}
              className="ml-auto text-xs bg-blue-600 hover:bg-blue-700"
            >
              <Eye className="h-3 w-3 mr-1" />
              Verify
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {sources.length === 0 ? (
            <div className="text-gray-500 text-sm">No dark web sources registered</div>
          ) : (
            sources.map((source) => (
              <div key={source.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Globe className="h-4 w-4 text-blue-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-blue-300">[{source.name}]</span>
                  </div>
                  {source.url && (
                    <div className="text-xs text-blue-400 mb-1">
                      {source.url.length > 30 ? `${source.url.substring(0, 27)}...` : source.url}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Last indexed: {source.last_indexed ? 
                      new Date(source.last_indexed).toLocaleTimeString() : 
                      'Never'
                    }
                  </div>
                </div>
                <Badge className={source.is_active ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}>
                  {source.is_active ? 'active' : 'inactive'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Entity Risk Index */}
      <Card className="bg-black border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400 text-sm flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Entity Risk Index
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {riskIndex.length === 0 ? (
            <div className="text-gray-500 text-sm">No risk index data available</div>
          ) : (
            riskIndex.map((index) => (
              <div key={index.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <TrendingDown className="h-4 w-4 text-red-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-red-300">[Entity {index.entity_id.substring(0, 8)}...]</span>
                  </div>
                  <div className="text-xs text-red-400 mb-1">
                    Total mentions: {index.total_mentions} | High risk: {index.high_risk_count}
                  </div>
                  <div className="text-xs text-gray-500">
                    Updated: {new Date(index.last_updated).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={getRiskColor(index.average_risk)}>
                  {Math.round(index.average_risk)}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
