
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Brain, 
  Target, 
  FileText, 
  Rocket, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Eye,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import LiveKeywordIntelligence from './keyword-system/LiveKeywordIntelligence';
import CounterNarrativeEngine from './keyword-system/CounterNarrativeEngine';
import ClientControlPanel from './keyword-system/ClientControlPanel';
import ArticleGenerationHub from './keyword-system/ArticleGenerationHub';
import DeploymentCenter from './keyword-system/DeploymentCenter';
import PerformanceTracking from './keyword-system/PerformanceTracking';

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

interface CounterNarrative {
  id: string;
  target_keywords: string[];
  recommended_theme: string;
  content_format: string;
  emotional_tone: string;
  target_audience: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface DeployedArticle {
  id: string;
  title: string;
  url: string;
  target_keywords: string[];
  deployment_platform: string;
  serp_performance: number;
  click_through_rate: number;
  deployment_date: string;
  status: 'indexing' | 'ranked' | 'optimizing';
}

const KeywordToArticleSystem = () => {
  const [activePhase, setActivePhase] = useState('intelligence');
  const [keywordIntelligence, setKeywordIntelligence] = useState<KeywordIntelligence[]>([]);
  const [counterNarratives, setCounterNarratives] = useState<CounterNarrative[]>([]);
  const [deployedArticles, setDeployedArticles] = useState<DeployedArticle[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    liveScanning: false,
    articlesDeployed: 0,
    serpImpact: 0,
    threatLevel: 'low' as const
  });

  const executeFullPipeline = async () => {
    toast.info('🚀 A.R.I.A vX™: Initiating complete reputation reshaping pipeline...');
    
    try {
      // Step 1: Live Keyword Intelligence
      setActivePhase('intelligence');
      const { data: scanResults } = await supabase.functions.invoke('keyword-intelligence-scan', {
        body: { fullScan: true, realTime: true }
      });

      // Step 2: AI Counter-Narrative Generation
      setActivePhase('counter-narrative');
      const { data: narratives } = await supabase.functions.invoke('generate-counter-narratives', {
        body: { keywordData: scanResults }
      });

      // Step 3: Article Generation & Deployment Pipeline
      setActivePhase('generation');
      const { data: deploymentResults } = await supabase.functions.invoke('deploy-counter-articles', {
        body: { narratives, autoApprove: true }
      });

      toast.success(`✅ A.R.I.A vX™: Pipeline complete - ${deploymentResults?.articlesDeployed || 0} articles deployed for reputation reshaping`);
      
      // Refresh data
      await loadSystemData();
      
    } catch (error) {
      console.error('Pipeline execution failed:', error);
      toast.error('❌ A.R.I.A vX™: Pipeline execution failed');
    }
  };

  const loadSystemData = async () => {
    try {
      // Load keyword intelligence data
      const { data: keywords } = await supabase
        .from('keyword_intelligence')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(50);

      // Load counter narratives
      const { data: narratives } = await supabase
        .from('counter_narratives')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      // Load deployed articles
      const { data: articles } = await supabase
        .from('deployed_articles')
        .select('*')
        .order('deployment_date', { ascending: false })
        .limit(30);

      if (keywords) setKeywordIntelligence(keywords);
      if (narratives) setCounterNarratives(narratives);
      if (articles) setDeployedArticles(articles);

      // Update system status
      const threatLevels = keywords?.map(k => k.threat_level) || [];
      const highThreatCount = threatLevels.filter(level => level === 'high' || level === 'critical').length;
      
      setSystemStatus({
        liveScanning: true,
        articlesDeployed: articles?.length || 0,
        serpImpact: articles?.reduce((acc, article) => acc + (article.serp_performance || 0), 0) || 0,
        threatLevel: highThreatCount > 5 ? 'critical' : highThreatCount > 2 ? 'high' : highThreatCount > 0 ? 'medium' : 'low'
      });

    } catch (error) {
      console.error('Failed to load system data:', error);
    }
  };

  useEffect(() => {
    loadSystemData();
    
    // Set up real-time updates
    const interval = setInterval(loadSystemData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-green-400 bg-green-500/10 border-green-500/30';
    }
  };

  return (
    <div className="space-y-6 bg-black text-white min-h-screen p-6">
      {/* System Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Target className="h-10 w-10 text-corporate-accent" />
            A.R.I.A vX™ Keyword-to-Article System
          </h1>
          <p className="text-gray-300 mt-2 text-lg">
            Real-time reputation reshaping — turning negativity into intelligence-driven content dominance
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50 px-4 py-2">
            <Activity className="h-4 w-4 mr-2 animate-pulse" />
            LIVE INTELLIGENCE ACTIVE
          </Badge>
          <Button
            onClick={executeFullPipeline}
            className="bg-corporate-accent text-black hover:bg-corporate-accent/90 font-bold px-6 py-3"
            size="lg"
          >
            <Rocket className="h-5 w-5 mr-2" />
            Execute Full Pipeline
          </Button>
        </div>
      </div>

      {/* System Status Dashboard */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{keywordIntelligence.length}</div>
            <p className="text-xs text-gray-400">Keywords Detected</p>
          </CardContent>
        </Card>
        
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{systemStatus.articlesDeployed}</div>
            <p className="text-xs text-gray-400">Articles Deployed</p>
          </CardContent>
        </Card>
        
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{systemStatus.serpImpact}%</div>
            <p className="text-xs text-gray-400">SERP Impact</p>
          </CardContent>
        </Card>
        
        <Card className={`border ${getThreatColor(systemStatus.threatLevel)}`}>
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${getThreatColor(systemStatus.threatLevel).split(' ')[0]}`}>
              {systemStatus.threatLevel.toUpperCase()}
            </div>
            <p className="text-xs text-gray-400">Threat Level</p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Progress */}
      <Card className="bg-corporate-darkSecondary border-corporate-accent/30">
        <CardHeader>
          <CardTitle className="text-corporate-accent flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Real-Time Pipeline Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Live Keyword Intelligence</span>
              <Badge className={activePhase === 'intelligence' ? 'bg-corporate-accent text-black' : 'bg-gray-600'}>
                {activePhase === 'intelligence' ? 'ACTIVE' : 'STANDBY'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Counter-Narrative Generation</span>
              <Badge className={activePhase === 'counter-narrative' ? 'bg-corporate-accent text-black' : 'bg-gray-600'}>
                {activePhase === 'counter-narrative' ? 'ACTIVE' : 'STANDBY'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Article Generation & Deployment</span>
              <Badge className={activePhase === 'generation' ? 'bg-corporate-accent text-black' : 'bg-gray-600'}>
                {activePhase === 'generation' ? 'ACTIVE' : 'STANDBY'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main System Tabs */}
      <Tabs defaultValue="intelligence" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-gray-900 border border-gray-800">
          <TabsTrigger value="intelligence" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
            <Search className="h-4 w-4 mr-2" />
            Live Intelligence
          </TabsTrigger>
          <TabsTrigger value="counter-narrative" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
            <Brain className="h-4 w-4 mr-2" />
            Counter-Narrative
          </TabsTrigger>
          <TabsTrigger value="control-panel" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
            <Target className="h-4 w-4 mr-2" />
            Control Panel
          </TabsTrigger>
          <TabsTrigger value="generation" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
            <FileText className="h-4 w-4 mr-2" />
            Article Generation
          </TabsTrigger>
          <TabsTrigger value="deployment" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
            <Rocket className="h-4 w-4 mr-2" />
            Live Deployment
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="intelligence">
          <LiveKeywordIntelligence 
            keywordData={keywordIntelligence}
            onRefresh={loadSystemData}
          />
        </TabsContent>

        <TabsContent value="counter-narrative">
          <CounterNarrativeEngine 
            keywordData={keywordIntelligence}
            narratives={counterNarratives}
            onRefresh={loadSystemData}
          />
        </TabsContent>

        <TabsContent value="control-panel">
          <ClientControlPanel 
            keywordData={keywordIntelligence}
            narratives={counterNarratives}
            onRefresh={loadSystemData}
          />
        </TabsContent>

        <TabsContent value="generation">
          <ArticleGenerationHub 
            narratives={counterNarratives}
            onRefresh={loadSystemData}
          />
        </TabsContent>

        <TabsContent value="deployment">
          <DeploymentCenter 
            articles={deployedArticles}
            onRefresh={loadSystemData}
          />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceTracking 
            articles={deployedArticles}
            keywordData={keywordIntelligence}
            onRefresh={loadSystemData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KeywordToArticleSystem;
