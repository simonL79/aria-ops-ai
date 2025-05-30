import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Shield, 
  Brain, 
  Eye, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  Target,
  Zap,
  Users,
  FileText,
  Settings,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ThreatIntelligenceDashboard from './ThreatIntelligenceDashboard';
import TacticalActionPanel from './TacticalActionPanel';
import StrategicGuidancePanel from './StrategicGuidancePanel';

interface ThreatProfile {
  entity_name: string;
  threat_level: 'low' | 'moderate' | 'high' | 'critical';
  risk_score: number;
  total_mentions: number;
  negative_sentiment: number;
  platforms_affected: string[];
  threat_types: string[];
  analysis_complete: boolean;
  recommendations: string[];
}

const AriaCommandCenter = () => {
  const [entityName, setEntityName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [scanMode, setScanMode] = useState<'known' | 'unknown'>('known');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [threatProfile, setThreatProfile] = useState<ThreatProfile | null>(null);
  const [reportGenerated, setReportGenerated] = useState(false);

  const scanPhases = [
    'Initializing Live OSINT Scanner...',
    'Crawling Reddit via RSS Feeds...',
    'Scanning News Sources...',
    'Processing Forum Data...',
    'Analyzing Sentiment Patterns...',
    'Calculating Risk Indicators...',
    'Running ANUBIS Validation...',
    'Generating Intelligence Report...'
  ];

  const runFullThreatAnalysis = async () => {
    if (!entityName.trim()) {
      toast.error('Please enter an entity name');
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setThreatProfile(null);
    setReportGenerated(false);

    try {
      // Phase 1: Initialize scan
      setCurrentPhase(scanPhases[0]);
      setScanProgress(12);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Phase 2: Live Reddit RSS Crawling
      setCurrentPhase(scanPhases[1]);
      setScanProgress(25);
      
      console.log('🔍 Starting live OSINT scan for:', entityName);
      
      const { data: redditScan, error: redditError } = await supabase.functions.invoke('reddit-scan', {
        body: { 
          entity: entityName,
          keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
          source: 'aria_command_center'
        }
      });

      if (redditError) {
        console.warn('Reddit scan warning:', redditError);
      }

      // Phase 3: News Sources Scanning
      setCurrentPhase(scanPhases[2]);
      setScanProgress(40);
      
      const { data: newsScan, error: newsError } = await supabase.functions.invoke('uk-news-scanner', {
        body: { 
          entity: entityName,
          scan_type: 'reputation_threats',
          source: 'aria_command_center'
        }
      });

      if (newsError) {
        console.warn('News scan warning:', newsError);
      }

      // Phase 4: RSS Feed Processing
      setCurrentPhase(scanPhases[3]);
      setScanProgress(55);
      
      const { data: rssScan, error: rssError } = await supabase.functions.invoke('rss-scraper', {
        body: { 
          entity: entityName,
          sources: ['bbc', 'guardian', 'telegraph', 'reuters'],
          scan_type: 'entity_monitoring'
        }
      });

      if (rssError) {
        console.warn('RSS scan warning:', rssError);
      }

      // Phase 5: Sentiment Analysis
      setCurrentPhase(scanPhases[4]);
      setScanProgress(70);
      
      // Get existing live scan results
      const { data: existingThreats, error: dbError } = await supabase
        .from('scan_results')
        .select('*')
        .or(`content.ilike.%${entityName}%,entity_name.ilike.%${entityName}%`)
        .eq('source_type', 'live_osint')
        .order('created_at', { ascending: false })
        .limit(50);

      if (dbError) {
        console.error('Database query error:', dbError);
      }

      // Phase 6: Risk Calculation
      setCurrentPhase(scanPhases[5]);
      setScanProgress(80);

      const liveResults = existingThreats || [];
      const totalMentions = liveResults.length;
      const negativeMentions = liveResults.filter(t => 
        t.sentiment !== null && t.sentiment < -0.1
      ).length;
      const highSeverity = liveResults.filter(t => t.severity === 'high').length;

      // Phase 7: ANUBIS Validation
      setCurrentPhase(scanPhases[6]);
      setScanProgress(90);
      await supabase.rpc('run_anubis_now');

      // Phase 8: Generate Report
      setCurrentPhase(scanPhases[7]);
      setScanProgress(95);

      // Calculate real threat profile based on live data
      const riskScore = Math.min(
        (negativeMentions / Math.max(totalMentions, 1)) * 0.4 +
        (highSeverity / Math.max(totalMentions, 1)) * 0.3 +
        (totalMentions > 10 ? 0.3 : totalMentions > 0 ? 0.1 : 0),
        1.0
      );

      let threatLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
      if (riskScore >= 0.8) threatLevel = 'critical';
      else if (riskScore >= 0.6) threatLevel = 'high';
      else if (riskScore >= 0.3) threatLevel = 'moderate';

      // Safely extract platforms with type filtering
      const platforms = [...new Set(
        liveResults
          .filter((t): t is { platform: string } => typeof t.platform === 'string')
          .map(t => t.platform)
      )];
      
      const profile: ThreatProfile = {
        entity_name: entityName,
        threat_level: threatLevel,
        risk_score: Math.round(riskScore * 100),
        total_mentions: totalMentions,
        negative_sentiment: Math.round((negativeMentions / Math.max(totalMentions, 1)) * 100),
        platforms_affected: platforms,
        threat_types: inferThreatTypes(keywords, liveResults),
        analysis_complete: true,
        recommendations: generateRecommendations(threatLevel, riskScore, totalMentions)
      };

      setThreatProfile(profile);
      setScanProgress(100);
      setReportGenerated(true);

      // Log to ARIA operations
      await supabase.from('aria_ops_log').insert({
        operation_type: 'live_threat_analysis',
        module_source: 'command_center',
        operation_data: { 
          entity_name: entityName,
          threat_level: threatLevel,
          risk_score: riskScore,
          total_live_results: totalMentions
        },
        success: true
      });

      toast.success(`A.R.I.A™ Live OSINT Analysis Complete - ${totalMentions} real intelligence items processed`);

    } catch (error) {
      console.error('Live threat analysis failed:', error);
      toast.error('Live OSINT analysis failed - Check system logs');
    } finally {
      setIsScanning(false);
      setCurrentPhase('Live Analysis Complete');
    }
  };

  const inferThreatTypes = (keywords: string, scanResults: any[]): string[] => {
    const types: string[] = [];
    const keywordLower = keywords.toLowerCase();
    
    if (keywordLower.includes('fraud') || keywordLower.includes('scam')) types.push('Financial Fraud');
    if (keywordLower.includes('harassment') || keywordLower.includes('abuse')) types.push('Harassment Campaign');
    if (keywordLower.includes('doxx') || keywordLower.includes('address')) types.push('Doxxing Threat');
    
    // Analyze actual content from live results
    const contentAnalysis = scanResults.map(r => r.content?.toLowerCase() || '').join(' ');
    if (contentAnalysis.includes('legal') || contentAnalysis.includes('lawsuit')) types.push('Legal Threat');
    if (contentAnalysis.includes('reputation') || contentAnalysis.includes('defamation')) types.push('Reputation Attack');
    
    if (scanResults.some(r => r.platform === 'Reddit')) types.push('Social Media Discussion');
    if (scanResults.some(r => r.platform === 'News')) types.push('Media Coverage');
    if (types.length === 0) types.push('General Monitoring Alert');
    
    return types;
  };

  const generateRecommendations = (level: string, score: number, mentions: number): string[] => {
    const recs: string[] = [];
    
    if (level === 'critical') {
      recs.push('IMMEDIATE: Deploy RSI™ Counter-Narrative Response');
      recs.push('URGENT: Activate CEREBRA AI Memory Override');
      recs.push('IMMEDIATE: Generate Legal Response Package');
    } else if (level === 'high') {
      recs.push('Deploy RSI™ Sentiment Intervention');
      recs.push('Consider EIDETIC Decay Management');
      recs.push('Enhance Live OSINT Monitoring');
    } else if (level === 'moderate') {
      recs.push('Continue Live OSINT Monitoring');
      recs.push('Prepare RSI™ Response Templates');
      recs.push('Monitor Sentiment Trends');
    } else {
      recs.push('Maintain Standard Live Monitoring');
      recs.push('Continue ANUBIS Health Checks');
    }

    return recs;
  };

  const runUnknownEntityScan = async () => {
    setScanMode('unknown');
    setEntityName('Unknown Entity Detected');
    setKeywords('anomaly detection, unknown threat');
    await runFullThreatAnalysis();
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'moderate': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-green-500 bg-green-500/10 border-green-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src="/lovable-uploads/37370275-bf62-4eab-b0e3-e184ce3fa142.png" 
              alt="A.R.I.A Logo" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-wide text-amber-400">
            A.R.I.A™ LIVE OSINT INTELLIGENCE
          </h1>
          <p className="text-xl text-gray-300">
            Real-Time Open Source Intelligence Scanner
          </p>
          <div className="text-amber-500 font-mono text-lg">
            "100% Live Data • No APIs Required • Direct OSINT Crawling"
          </div>
          
          {/* Quick Access to Threats Management */}
          <div className="flex justify-center mt-4">
            <Link to="/threats-management">
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold">
                <AlertTriangle className="mr-2 h-4 w-4" />
                View Live Intelligence Results
              </Button>
            </Link>
          </div>
        </div>

        {/* Entity Input Panel */}
        <Card className="bg-[#1A1B1E] border-amber-600/30">
          <CardHeader>
            <CardTitle className="text-amber-400 flex items-center gap-2">
              <Search className="h-5 w-5" />
              Live OSINT Target Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 mb-4">
              <Button
                variant={scanMode === 'known' ? 'default' : 'outline'}
                onClick={() => setScanMode('known')}
                className={scanMode === 'known' ? 'bg-amber-600 text-black' : 'border-amber-600 text-amber-400'}
              >
                Live Entity Scan
              </Button>
              <Button
                variant={scanMode === 'unknown' ? 'default' : 'outline'}
                onClick={() => setScanMode('unknown')}
                className={scanMode === 'unknown' ? 'bg-amber-600 text-black' : 'border-amber-600 text-amber-400'}
              >
                Unknown Threat Discovery
              </Button>
            </div>

            {scanMode === 'known' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-400 mb-2">
                    Target Entity
                  </label>
                  <Input
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    placeholder="Enter person/brand name..."
                    disabled={isScanning}
                    className="bg-[#0A0B0D] border-amber-600/50 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-400 mb-2">
                    Keywords (Optional)
                  </label>
                  <Input
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="fraud, scandal, controversy..."
                    disabled={isScanning}
                    className="bg-[#0A0B0D] border-amber-600/50 text-white"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={runFullThreatAnalysis}
                    disabled={isScanning || !entityName.trim()}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold"
                  >
                    {isScanning ? (
                      <>
                        <Activity className="mr-2 h-4 w-4 animate-spin" />
                        Live Scanning...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Run Live OSINT Scan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-gray-300">
                  Automated discovery scan to detect unknown entities and emerging threats from live sources
                </p>
                <Button
                  onClick={runUnknownEntityScan}
                  disabled={isScanning}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-3"
                >
                  {isScanning ? (
                    <>
                      <Activity className="mr-2 h-4 w-4 animate-spin" />
                      Live Scanning...
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Run Live Discovery Scan
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scanning Progress */}
        {isScanning && (
          <Card className="bg-[#1A1B1E] border-blue-500/30">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-blue-400 animate-spin" />
                  <span className="text-lg font-medium text-blue-400">
                    A.R.I.A™ Live OSINT Intelligence Gathering
                  </span>
                </div>
                <Progress value={scanProgress} className="h-3" />
                <p className="text-gray-300 text-sm">{currentPhase}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {scanPhases.map((phase, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded border ${
                        scanProgress > (index + 1) * 12 
                          ? 'bg-green-500/20 border-green-500/50 text-green-400'
                          : scanProgress > index * 12
                          ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                          : 'bg-gray-500/20 border-gray-500/50 text-gray-400'
                      }`}
                    >
                      {phase.split('...')[0]}...
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {threatProfile && (
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-[#1A1B1E]">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-amber-600">
                Live Intelligence
              </TabsTrigger>
              <TabsTrigger value="guidance" className="data-[state=active]:bg-amber-600">
                Strategic Guidance
              </TabsTrigger>
              <TabsTrigger value="actions" className="data-[state=active]:bg-amber-600">
                Tactical Actions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <ThreatIntelligenceDashboard threatProfile={threatProfile} />
            </TabsContent>

            <TabsContent value="guidance">
              <StrategicGuidancePanel threatProfile={threatProfile} />
            </TabsContent>

            <TabsContent value="actions">
              <TacticalActionPanel threatProfile={threatProfile} />
            </TabsContent>
          </Tabs>
        )}

      </div>
    </div>
  );
};

export default AriaCommandCenter;
