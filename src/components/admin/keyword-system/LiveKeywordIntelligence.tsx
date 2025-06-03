
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  Globe, 
  Youtube, 
  MessageCircle,
  ExternalLink,
  Zap,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { performRealScan } from '@/services/monitoring/realScan';

interface KeywordIntelligence {
  id: string;
  keyword: string;
  sentiment_score: number;
  authority_ranking: number;
  source_url: string;
  platform: string;
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  detected_at: string;
  serp_position?: number;
}

interface LiveKeywordIntelligenceProps {
  keywordData: KeywordIntelligence[];
  onRefresh: () => void;
}

const LiveKeywordIntelligence: React.FC<LiveKeywordIntelligenceProps> = ({
  keywordData,
  onRefresh
}) => {
  const [targetEntity, setTargetEntity] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [liveIntelligence, setLiveIntelligence] = useState<any[]>([]);

  const executeLiveIntelligenceScan = async () => {
    if (!targetEntity.trim()) {
      toast.error('Please enter a target entity to scan');
      return;
    }

    setIsScanning(true);

    try {
      toast.info('🔍 A.R.I.A vX™: Initiating live keyword intelligence scan...');

      // Use the verified live scanning infrastructure
      const liveResults = await performRealScan({
        fullScan: true,
        targetEntity: targetEntity,
        source: 'keyword_intelligence'
      });

      if (liveResults.length > 0) {
        // Transform live results into keyword intelligence format
        const keywordIntelligence = liveResults.map(result => ({
          id: result.id,
          keyword: extractKeywords(result.content),
          sentiment_score: result.sentiment || 0,
          authority_ranking: result.confidence_score || 75,
          source_url: result.url,
          platform: result.platform,
          threat_level: result.severity,
          detected_at: new Date().toISOString(),
          content: result.content
        }));

        setLiveIntelligence(keywordIntelligence);
        toast.success(`✅ A.R.I.A vX™: Live intelligence scan complete - ${liveResults.length} verified intelligence items analyzed`);
      } else {
        toast.info('A.R.I.A vX™: No new live intelligence detected for this entity');
      }
      
      onRefresh();

    } catch (error) {
      console.error('Live intelligence scan failed:', error);
      toast.error('❌ A.R.I.A vX™: Live intelligence scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  const extractKeywords = (content: string): string => {
    // Simple keyword extraction - take first few meaningful words
    const words = content.split(' ').filter(word => 
      word.length > 3 && 
      !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'use', 'way', 'she', 'many', 'oil', 'sit', 'word'].includes(word.toLowerCase())
    );
    return words.slice(0, 3).join(' ');
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube': return <Youtube className="h-4 w-4" />;
      case 'reddit': return <MessageCircle className="h-4 w-4" />;
      case 'google': return <Search className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-green-500/20 text-green-400 border-green-500/50';
    }
  };

  const getSentimentColor = (score: number) => {
    if (score < -0.5) return 'text-red-400';
    if (score < 0) return 'text-orange-400';
    if (score < 0.5) return 'text-yellow-400';
    return 'text-green-400';
  };

  // Display live intelligence data instead of keywordData if available
  const displayData = liveIntelligence.length > 0 ? liveIntelligence : keywordData;

  return (
    <div className="space-y-6">
      {/* Live Intelligence Scanner */}
      <Card className="bg-corporate-darkSecondary border-corporate-accent/30">
        <CardHeader>
          <CardTitle className="text-corporate-accent flex items-center gap-2">
            <Target className="h-5 w-5" />
            Live Keyword & Sentiment Intelligence Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="targetEntity" className="text-white">Target Entity</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="targetEntity"
                value={targetEntity}
                onChange={(e) => setTargetEntity(e.target.value)}
                placeholder="Enter person, company, or brand name"
                className="bg-corporate-dark border-corporate-border text-white"
              />
              <Button
                onClick={executeLiveIntelligenceScan}
                disabled={isScanning}
                className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
              >
                <Zap className={`h-4 w-4 mr-2 ${isScanning ? 'animate-pulse' : ''}`} />
                {isScanning ? 'Scanning...' : 'Scan Live Intelligence'}
              </Button>
            </div>
          </div>

          <Alert className="bg-blue-500/10 border-blue-500/50">
            <Search className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-300">
              A.R.I.A vX™ uses verified live OSINT sources to extract real-time keywords, sentiment scores, and threat intelligence from Reddit, news feeds, and forums.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Live Intelligence Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayData.map((item, index) => (
          <Card key={item.id || index} className="bg-corporate-dark border-corporate-border hover:border-corporate-accent/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getPlatformIcon(item.platform)}
                  <span className="text-xs text-gray-400 uppercase">{item.platform}</span>
                </div>
                <Badge className={getThreatColor(item.threat_level)}>
                  {item.threat_level}
                </Badge>
              </div>

              <h3 className="font-medium text-white mb-2">"{item.keyword}"</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Sentiment:</span>
                  <span className={getSentimentColor(item.sentiment_score)}>
                    {item.sentiment_score > 0 ? '+' : ''}{item.sentiment_score.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Authority:</span>
                  <span className="text-blue-400">{item.authority_ranking}/100</span>
                </div>

                {item.serp_position && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">SERP Position:</span>
                    <span className="text-yellow-400">#{item.serp_position}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Source:</span>
                  <a 
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-corporate-accent hover:text-corporate-accent/80 flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View
                  </a>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-700">
                <span className="text-xs text-gray-500">
                  Detected: {new Date(item.detected_at).toLocaleString()}
                </span>
              </div>

              {item.content && (
                <div className="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300">
                  {item.content.substring(0, 100)}...
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {displayData.length === 0 && (
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No Live Intelligence Data Yet</h3>
            <p className="text-gray-500 mb-4">
              Start by scanning a target entity to begin live keyword intelligence gathering using verified OSINT sources
            </p>
            <Button
              onClick={() => setTargetEntity('sample entity')}
              variant="outline"
              className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black"
            >
              Try Sample Scan
            </Button>
          </CardContent>
        </Card>
      )}

      {liveIntelligence.length > 0 && (
        <Card className="bg-green-900/20 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-400">
              <Target className="h-4 w-4" />
              <span className="font-medium">Live Intelligence Status: ACTIVE</span>
            </div>
            <p className="text-green-300 text-sm mt-1">
              {liveIntelligence.length} verified live intelligence items processed from OSINT sources
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LiveKeywordIntelligence;
