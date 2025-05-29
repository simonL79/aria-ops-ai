
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Satellite, Signal, Database, RefreshCw, Eye, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface OSINTFeed {
  id: string;
  source_name: string;
  source_url: string;
  fetch_frequency: string;
  last_fetched?: string;
  is_active: boolean;
  trust_score: number;
  created_at: string;
}

interface OSINTSignal {
  id: string;
  feed_id: string;
  signal_content: string;
  signal_type?: string;
  related_entity_name?: string;
  confidence_score?: number;
  is_live: boolean;
  detected_at: string;
}

export const ZeuslinkPanel = () => {
  const [osintFeeds, setOsintFeeds] = useState<OSINTFeed[]>([]);
  const [osintSignals, setOsintSignals] = useState<OSINTSignal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadZeuslinkData();
  }, []);

  const loadZeuslinkData = async () => {
    await Promise.all([loadOSINTFeeds(), loadOSINTSignals()]);
  };

  const loadOSINTFeeds = async () => {
    try {
      // Use mock data since tables are newly created
      const mockData: OSINTFeed[] = [
        {
          id: '1',
          source_name: 'CyberThreat RSS Aggregator',
          source_url: 'https://example.com/threat-feed.xml',
          fetch_frequency: 'daily',
          last_fetched: new Date().toISOString(),
          is_active: true,
          trust_score: 85,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          source_name: 'Dark Web Intelligence Feed',
          source_url: 'https://osint.example/darkweb.json',
          fetch_frequency: 'hourly',
          last_fetched: new Date(Date.now() - 3600000).toISOString(),
          is_active: true,
          trust_score: 92,
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          source_name: 'Social Media Threat Monitor',
          source_url: 'https://social.intel/api/threats',
          fetch_frequency: 'hourly',
          last_fetched: new Date(Date.now() - 7200000).toISOString(),
          is_active: false,
          trust_score: 78,
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      setOsintFeeds(mockData);
    } catch (error) {
      console.error('Error loading OSINT feeds:', error);
      setOsintFeeds([]);
    }
  };

  const loadOSINTSignals = async () => {
    try {
      const mockData: OSINTSignal[] = [
        {
          id: '1',
          feed_id: '1',
          signal_content: 'Advanced Persistent Threat detected targeting financial institutions',
          signal_type: 'threat_intelligence',
          related_entity_name: 'Financial Corp',
          confidence_score: 87,
          is_live: true,
          detected_at: new Date().toISOString()
        },
        {
          id: '2',
          feed_id: '2',
          signal_content: 'Credential leak identified on underground marketplace',
          signal_type: 'data_breach',
          related_entity_name: 'Tech Company',
          confidence_score: 94,
          is_live: true,
          detected_at: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: '3',
          feed_id: '1',
          signal_content: 'Phishing campaign using brand impersonation tactics',
          signal_type: 'phishing',
          related_entity_name: 'Brand Name',
          confidence_score: 76,
          is_live: false,
          detected_at: new Date(Date.now() - 7200000).toISOString()
        }
      ];
      setOsintSignals(mockData);
    } catch (error) {
      console.error('Error loading OSINT signals:', error);
      setOsintSignals([]);
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500/20 text-green-400 border-green-500/50';
    if (score >= 75) return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    if (score >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-red-500/20 text-red-400 border-red-500/50';
  };

  const getConfidenceColor = (score?: number) => {
    if (!score) return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    if (score >= 90) return 'bg-green-500/20 text-green-400 border-green-500/50';
    if (score >= 75) return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    if (score >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-red-500/20 text-red-400 border-red-500/50';
  };

  const getSignalTypeColor = (type?: string) => {
    switch (type) {
      case 'threat_intelligence':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'data_breach':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'phishing':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const refreshFeeds = async () => {
    setIsLoading(true);
    try {
      const feedSources = ['Threat Intel Pro', 'OSINT Collector', 'Cyber Watch'];
      const randomSource = feedSources[Math.floor(Math.random() * feedSources.length)];
      
      const newFeed: OSINTFeed = {
        id: Date.now().toString(),
        source_name: randomSource,
        source_url: `https://${randomSource.toLowerCase().replace(/\s+/g, '')}.com/api/feed`,
        fetch_frequency: 'hourly',
        last_fetched: new Date().toISOString(),
        is_active: true,
        trust_score: Math.floor(Math.random() * 30) + 70,
        created_at: new Date().toISOString()
      };

      setOsintFeeds(prev => [newFeed, ...prev.slice(0, 9)]);
      toast.success('New OSINT feed added to ZEUSLINK™');
    } catch (error) {
      console.error('Error refreshing feeds:', error);
      toast.error('Failed to refresh OSINT feeds');
    } finally {
      setIsLoading(false);
    }
  };

  const ingestSignal = async () => {
    setIsLoading(true);
    try {
      const signalTypes = ['threat_intelligence', 'data_breach', 'phishing', 'malware', 'vulnerability'];
      const entities = ['Global Bank', 'Tech Startup', 'Government Agency', 'Healthcare Provider'];
      const signals = [
        'Suspicious network activity detected',
        'Insider threat indicators observed',
        'Malicious domain registration identified',
        'Credential stuffing attack in progress',
        'Zero-day exploit being weaponized'
      ];
      
      const randomType = signalTypes[Math.floor(Math.random() * signalTypes.length)];
      const randomEntity = entities[Math.floor(Math.random() * entities.length)];
      const randomSignal = signals[Math.floor(Math.random() * signals.length)];
      
      const newSignal: OSINTSignal = {
        id: Date.now().toString(),
        feed_id: osintFeeds[0]?.id || '1',
        signal_content: randomSignal,
        signal_type: randomType,
        related_entity_name: randomEntity,
        confidence_score: Math.floor(Math.random() * 40) + 60,
        is_live: true,
        detected_at: new Date().toISOString()
      };

      setOsintSignals(prev => [newSignal, ...prev.slice(0, 9)]);
      toast.success('New OSINT signal ingested via ZEUSLINK™');
    } catch (error) {
      console.error('Error ingesting signal:', error);
      toast.error('Failed to ingest OSINT signal');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeFeed = async () => {
    setIsLoading(true);
    try {
      const activeFeeds = osintFeeds.filter(feed => feed.is_active);
      const totalSignals = osintSignals.length;
      const liveSignals = osintSignals.filter(signal => signal.is_live).length;
      
      toast.success(
        `ZEUSLINK™ Analysis: ${activeFeeds.length} active feeds, ${totalSignals} total signals, ${liveSignals} live threats`
      );
    } catch (error) {
      console.error('Error analyzing feeds:', error);
      toast.error('Failed to analyze OSINT feeds');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* OSINT Feed Management */}
      <Card className="bg-black border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
            <Satellite className="h-4 w-4" />
            ZEUSLINK™ OSINT Feed Management
            <Button
              size="sm"
              onClick={refreshFeeds}
              disabled={isLoading}
              className="ml-auto text-xs bg-cyan-600 hover:bg-cyan-700"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {osintFeeds.length === 0 ? (
            <div className="text-gray-500 text-sm">No OSINT feeds configured</div>
          ) : (
            osintFeeds.map((feed) => (
              <div key={feed.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Database className="h-4 w-4 text-cyan-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-cyan-300">[{feed.source_name}]</span>
                  </div>
                  <div className="text-xs text-cyan-400 mb-1">
                    {feed.source_url.length > 50 ? `${feed.source_url.substring(0, 47)}...` : feed.source_url}
                  </div>
                  <div className="text-xs text-gray-500">
                    Frequency: {feed.fetch_frequency} | 
                    Last: {feed.last_fetched ? new Date(feed.last_fetched).toLocaleTimeString() : 'Never'}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getTrustScoreColor(feed.trust_score)}>
                    Trust: {feed.trust_score}%
                  </Badge>
                  <Badge className={feed.is_active ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-gray-500/20 text-gray-400 border-gray-500/50'}>
                    {feed.is_active ? 'active' : 'inactive'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Signal Intelligence Stream */}
      <Card className="bg-black border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-400 text-sm flex items-center gap-2">
            <Signal className="h-4 w-4" />
            Signal Intelligence Stream
            <Button
              size="sm"
              onClick={ingestSignal}
              disabled={isLoading}
              className="ml-auto text-xs bg-blue-600 hover:bg-blue-700"
            >
              <Eye className="h-3 w-3 mr-1" />
              Ingest
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {osintSignals.length === 0 ? (
            <div className="text-gray-500 text-sm">No OSINT signals detected</div>
          ) : (
            osintSignals.map((signal) => (
              <div key={signal.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <AlertTriangle className="h-4 w-4 text-blue-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-blue-300">[{signal.related_entity_name || 'Unknown Entity'}]</span>
                  </div>
                  <div className="text-xs text-blue-400 mb-1">
                    {signal.signal_content.length > 60 ? 
                      `${signal.signal_content.substring(0, 57)}...` : 
                      signal.signal_content
                    }
                  </div>
                  <div className="text-xs text-gray-500">
                    Detected: {new Date(signal.detected_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getSignalTypeColor(signal.signal_type)}>
                    {signal.signal_type || 'unknown'}
                  </Badge>
                  <Badge className={getConfidenceColor(signal.confidence_score)}>
                    {signal.confidence_score || 0}%
                  </Badge>
                  <Badge className={signal.is_live ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-gray-500/20 text-gray-400 border-gray-500/50'}>
                    {signal.is_live ? 'live' : 'stale'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Feed Analysis Controls */}
      <Card className="bg-black border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
            <Database className="h-4 w-4" />
            Federated Analysis Engine
            <Button
              size="sm"
              onClick={analyzeFeed}
              disabled={isLoading}
              className="ml-auto text-xs bg-purple-600 hover:bg-purple-700"
            >
              <Signal className="h-3 w-3 mr-1" />
              Analyze
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{osintFeeds.filter(f => f.is_active).length}</div>
              <div className="text-xs text-gray-500">Active Feeds</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{osintSignals.length}</div>
              <div className="text-xs text-gray-500">Total Signals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{osintSignals.filter(s => s.is_live).length}</div>
              <div className="text-xs text-gray-500">Live Threats</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
