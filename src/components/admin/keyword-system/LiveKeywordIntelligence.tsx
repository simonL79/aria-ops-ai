
import React, { useState } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const [scanProgress, setScanProgress] = useState(0);

  const executeLiveIntelligenceScan = async () => {
    if (!targetEntity.trim()) {
      toast.error('Please enter a target entity to scan');
      return;
    }

    setIsScanning(true);
    setScanProgress(0);

    try {
      toast.info('🔍 A.R.I.A vX™: Initiating live keyword intelligence scan...');

      // Step 1: Google Search Intelligence
      setScanProgress(20);
      const { data: googleData } = await supabase.functions.invoke('google-keyword-scan', {
        body: { entity: targetEntity, scanType: 'comprehensive' }
      });

      // Step 2: YouTube Intelligence
      setScanProgress(40);
      const { data: youtubeData } = await supabase.functions.invoke('youtube-keyword-scan', {
        body: { entity: targetEntity, scanType: 'comprehensive' }
      });

      // Step 3: Reddit & Social Intelligence
      setScanProgress(60);
      const { data: socialData } = await supabase.functions.invoke('social-keyword-scan', {
        body: { entity: targetEntity, platforms: ['reddit', 'twitter'] }
      });

      // Step 4: News & Blog Intelligence
      setScanProgress(80);
      const { data: newsData } = await supabase.functions.invoke('news-keyword-scan', {
        body: { entity: targetEntity, timeframe: '30d' }
      });

      setScanProgress(100);

      const totalKeywords = (googleData?.keywords?.length || 0) + 
                           (youtubeData?.keywords?.length || 0) + 
                           (socialData?.keywords?.length || 0) + 
                           (newsData?.keywords?.length || 0);

      toast.success(`✅ A.R.I.A vX™: Intelligence scan complete - ${totalKeywords} keywords analyzed across all platforms`);
      
      onRefresh();

    } catch (error) {
      console.error('Live intelligence scan failed:', error);
      toast.error('❌ A.R.I.A vX™: Intelligence scan failed');
    } finally {
      setIsScanning(false);
      setScanProgress(0);
    }
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

          {isScanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Scanning across platforms...</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-corporate-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          <Alert className="bg-blue-500/10 border-blue-500/50">
            <Search className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-300">
              A.R.I.A vX™ scans Google search results, YouTube videos, Reddit threads, tweets, news articles, and forums in real-time to extract trending keywords, sentiment scores, and authority rankings.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Live Intelligence Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {keywordData.map((keyword) => (
          <Card key={keyword.id} className="bg-corporate-dark border-corporate-border hover:border-corporate-accent/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getPlatformIcon(keyword.platform)}
                  <span className="text-xs text-gray-400 uppercase">{keyword.platform}</span>
                </div>
                <Badge className={getThreatColor(keyword.threat_level)}>
                  {keyword.threat_level}
                </Badge>
              </div>

              <h3 className="font-medium text-white mb-2">"{keyword.keyword}"</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Sentiment:</span>
                  <span className={getSentimentColor(keyword.sentiment_score)}>
                    {keyword.sentiment_score > 0 ? '+' : ''}{keyword.sentiment_score.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Authority:</span>
                  <span className="text-blue-400">{keyword.authority_ranking}/100</span>
                </div>

                {keyword.serp_position && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">SERP Position:</span>
                    <span className="text-yellow-400">#{keyword.serp_position}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Source:</span>
                  <a 
                    href={keyword.source_url}
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
                  Detected: {new Date(keyword.detected_at).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {keywordData.length === 0 && (
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No Intelligence Data Yet</h3>
            <p className="text-gray-500 mb-4">
              Start by scanning a target entity to begin live keyword intelligence gathering
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
    </div>
  );
};

export default LiveKeywordIntelligence;
