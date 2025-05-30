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
  AlertCircle,
  Cpu,
  Wrench
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
  const [scanMode, setScanMode] = useState<'standard' | 'recursive' | 'sigma' | 'unknown'>('standard');
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

  const sigmaPhases = [
    'Initializing A.R.I.A™ SIGMA Engine...',
    'Expanding Threat-Focused Queries...',
    'Live Multi-Source Data Collection...',
    'Entity Relationship Extraction...',
    'Generating Threat Profile...',
    'AI Fix Path Generation...',
    'Mission Chain Logging...',
    'SIGMA Intelligence Complete...'
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
      const phases = scanMode === 'sigma' ? sigmaPhases : scanPhases;
      setCurrentPhase(phases[0]);
      setScanProgress(12);
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (scanMode === 'sigma') {
        // Use the new SIGMA live scanner
        setCurrentPhase(phases[1]);
        setScanProgress(25);
        
        console.log('🔍 Starting A.R.I.A™ SIGMA live scan for:', entityName);
        
        const { data: sigmaData, error: sigmaError } = await supabase.functions.invoke('sigmalive', {
          body: { 
            entity: entityName,
            keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
            depth: 2,
            generateProfile: true
          }
        });

        if (sigmaError) {
          console.warn('SIGMA scan warning:', sigmaError);
          throw new Error('SIGMA scan failed');
        } else {
          console.log('✅ SIGMA scan completed:', sigmaData);
          
          // Update progress through SIGMA phases
          for (let i = 2; i < phases.length; i++) {
            setCurrentPhase(phases[i]);
            setScanProgress(25 + (i * 10));
            await new Promise(resolve => setTimeout(resolve, 800));
          }

          // Generate AI fix path if threat profile exists
          if (sigmaData?.threat_profile) {
            setCurrentPhase('Generating AI Fix Path...');
            setScanProgress(90);
            
            const { data: fixPathData, error: fixPathError } = await supabase.functions.invoke('fixpath-ai', {
              body: {
                entity: entityName,
                threatLevel: sigmaData.threat_profile.threat_level,
                riskScore: sigmaData.threat_profile.risk_score,
                threatContext: sigmaData.summary,
                generateActions: true
              }
            });

            if (!fixPathError) {
              console.log('✅ AI fix path generated:', fixPathData);
            }
          }

          // Convert SIGMA threat profile to our component format
          if (sigmaData?.threat_profile) {
            const profile: ThreatProfile = {
              entity_name: sigmaData.threat_profile.entity_name,
              threat_level: sigmaData.threat_profile.threat_level,
              risk_score: Math.round(sigmaData.threat_profile.risk_score * 100),
              total_mentions: sigmaData.threat_profile.total_mentions || sigmaData.scan_results || 0,
              negative_sentiment: Math.round((sigmaData.threat_profile.negative_sentiment_score || 0) * 100),
              platforms_affected: sigmaData.threat_profile.primary_platforms || [],
              threat_types: inferThreatTypes(keywords, []),
              analysis_complete: true,
              recommendations: generateSigmaRecommendations(
                sigmaData.threat_profile.threat_level, 
                sigmaData.threat_profile.risk_score,
                sigmaData.threat_profile.total_mentions || 0
              )
            };
            setThreatProfile(profile);
          }

          setScanProgress(100);
          setReportGenerated(true);
          setCurrentPhase('A.R.I.A™ SIGMA Analysis Complete');

          toast.success(`A.R.I.A™ SIGMA Analysis Complete`, {
            description: `${sigmaData?.scan_results || 0} intelligence items processed, threat level: ${sigmaData?.threat_profile?.threat_level || 'unknown'}`
          });
        }
      } else {
        // ... keep existing code (standard/recursive scan logic)
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
        } else {
          console.log('✅ Reddit scan completed:', redditScan);
        }

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
        } else {
          console.log('✅ News scan completed:', newsScan);
        }

        setCurrentPhase(scanMode === 'recursive' ? 'A.R.I.A™ Recursive Intelligence Gathering...' : scanPhases[3]);
        setScanProgress(55);
        
        if (scanMode === 'recursive') {
          const { data: recursiveScan, error: recursiveError } = await supabase.functions.invoke('recursive-ai-scanner', {
            body: { 
              entity: entityName,
              keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
              maxDepth: 1
            }
          });

          if (recursiveError) {
            console.warn('Recursive scan warning:', recursiveError);
          } else {
            console.log('✅ Recursive AI scan completed:', recursiveScan);
          }
        } else {
          const { data: rssScan, error: rssError } = await supabase.functions.invoke('rss-scraper', {
            body: { 
              entity: entityName,
              sources: ['bbc', 'guardian', 'telegraph', 'reuters'],
              scan_type: 'entity_monitoring'
            }
          });

          if (rssError) {
            console.warn('RSS scan warning:', rssError);
          } else {
            console.log('✅ RSS scan completed:', rssScan);
          }
        }

        setCurrentPhase(scanPhases[4]);
        setScanProgress(70);
        
        const { data: existingThreats, error: dbError } = await supabase
          .from('scan_results')
          .select('*')
          .or(`content.ilike.%${entityName}%,entity_name.ilike.%${entityName}%`)
          .in('source_type', ['live_osint', 'osint_intelligence', 'recursive_osint'])
          .order('created_at', { ascending: false })
          .limit(100);

        if (dbError) {
          console.error('Database query error:', dbError);
        } else {
          console.log(`✅ Retrieved ${existingThreats?.length || 0} live intelligence items`);
        }

        setCurrentPhase(scanPhases[5]);
        setScanProgress(80);

        const liveResults = existingThreats || [];
        const totalMentions = liveResults.length;
        const negativeMentions = liveResults.filter(t => 
          t.sentiment !== null && t.sentiment < -0.1
        ).length;
        const highSeverity = liveResults.filter(t => t.severity === 'high').length;

        console.log(`📊 Analysis results: ${totalMentions} total, ${negativeMentions} negative, ${highSeverity} high severity`);

        setCurrentPhase(scanPhases[6]);
        setScanProgress(90);
        await supabase.rpc('run_anubis_now');

        setCurrentPhase(scanPhases[7]);
        setScanProgress(95);

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

        const platforms = [...new Set(
          liveResults
            .map(t => t.platform)
            .filter((platform): platform is string => typeof platform === 'string')
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
          recommendations: generateRecommendations(threatLevel, riskScore, totalMentions, scanMode)
        };

        setThreatProfile(profile);
        setScanProgress(100);
        setReportGenerated(true);

        await supabase.from('aria_ops_log').insert({
          operation_type: scanMode === 'recursive' ? 'recursive_threat_analysis' : 'live_threat_analysis',
          module_source: 'command_center',
          operation_data: { 
            entity_name: entityName,
            threat_level: threatLevel,
            risk_score: riskScore,
            total_live_results: totalMentions,
            platforms_found: platforms.length,
            scan_phases_completed: scanPhases.length,
            scan_mode: scanMode
          },
          success: true
        });

        toast.success(`A.R.I.A™ ${scanMode === 'recursive' ? 'Recursive AI' : 'Live OSINT'} Analysis Complete`, {
          description: `${totalMentions} intelligence items processed across ${platforms.length} platforms`
        });
      }

    } catch (error) {
      console.error('Live threat analysis failed:', error);
      toast.error('Live OSINT analysis failed', {
        description: 'Check system logs for details'
      });
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
    
    const contentAnalysis = scanResults.map(r => r.content?.toLowerCase() || '').join(' ');
    if (contentAnalysis.includes('legal') || contentAnalysis.includes('lawsuit')) types.push('Legal Threat');
    if (contentAnalysis.includes('reputation') || contentAnalysis.includes('defamation')) types.push('Reputation Attack');
    
    if (scanResults.some(r => r.platform === 'Reddit')) types.push('Social Media Discussion');
    if (scanResults.some(r => r.platform === 'News')) types.push('Media Coverage');
    if (types.length === 0) types.push('General Monitoring Alert');
    
    return types;
  };

  const generateRecommendations = (level: string, score: number, mentions: number, mode: string): string[] => {
    const recs: string[] = [];
    
    if (level === 'critical') {
      recs.push('IMMEDIATE: Deploy RSI™ Counter-Narrative Response');
      recs.push('URGENT: Activate CEREBRA AI Memory Override');
      recs.push('IMMEDIATE: Generate Legal Response Package');
      if (mode === 'recursive') {
        recs.push('CRITICAL: Related entity threats require immediate assessment');
      }
    } else if (level === 'high') {
      recs.push('Deploy RSI™ Sentiment Intervention');
      recs.push('Consider EIDETIC Decay Management');
      recs.push('Enhance Live OSINT Monitoring');
      if (mode === 'recursive') {
        recs.push('Monitor related entities for threat escalation');
      }
    } else if (level === 'moderate') {
      recs.push('Continue Live OSINT Monitoring');
      recs.push('Prepare RSI™ Response Templates');
      recs.push('Monitor Sentiment Trends');
      if (mode === 'recursive') {
        recs.push('Track related entity developments');
      }
    } else {
      recs.push('Maintain Standard Live Monitoring');
      recs.push('Continue ANUBIS Health Checks');
      if (mode === 'recursive') {
        recs.push('Periodic related entity assessment');
      }
    }

    return recs;
  };

  const generateSigmaRecommendations = (level: string, score: number, mentions: number): string[] => {
    const recs: string[] = [];
    
    if (level === 'critical') {
      recs.push('IMMEDIATE: Deploy CEREBRA™ AI Memory Override');
      recs.push('URGENT: Activate SIGMA Counter-Response Protocol');
      recs.push('CRITICAL: Execute AI-Generated Fix Path');
      recs.push('IMMEDIATE: Legal Response Activation');
    } else if (level === 'high') {
      recs.push('URGENT: Deploy RSI™ Sentiment Intervention');
      recs.push('HIGH: Enhance SIGMA Monitoring Frequency');
      recs.push('IMPORTANT: Execute AI Fix Path Steps');
    } else if (level === 'moderate') {
      recs.push('MONITOR: Continue SIGMA Live Surveillance');
      recs.push('PREPARE: RSI™ Response Templates Ready');
      recs.push('TRACK: AI-Monitored Sentiment Trends');
    } else {
      recs.push('MAINTAIN: Standard SIGMA Protocols');
      recs.push('CONTINUE: ANUBIS™ Health Validation');
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
            A.R.I.A™ SIGMA INTELLIGENCE CENTER
          </h1>
          <p className="text-xl text-gray-300">
            Advanced AI-Driven Live Threat Intelligence & Automated Fix Path Generation
          </p>
          <div className="text-amber-500 font-mono text-lg">
            "SIGMA Live Scanner • AI Fix Paths • Recursive Discovery • 100% Live Data"
          </div>
          
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
              A.R.I.A™ SIGMA Intelligence Target Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 mb-4">
              <Button
                variant={scanMode === 'standard' ? 'default' : 'outline'}
                onClick={() => setScanMode('standard')}
                className={scanMode === 'standard' ? 'bg-amber-600 text-black' : 'border-amber-600 text-amber-400'}
              >
                Standard OSINT Scan
              </Button>
              <Button
                variant={scanMode === 'recursive' ? 'default' : 'outline'}
                onClick={() => setScanMode('recursive')}
                className={scanMode === 'recursive' ? 'bg-amber-600 text-black' : 'border-amber-600 text-amber-400'}
              >
                <Brain className="mr-2 h-4 w-4" />
                Recursive AI Scan
              </Button>
              <Button
                variant={scanMode === 'sigma' ? 'default' : 'outline'}
                onClick={() => setScanMode('sigma')}
                className={scanMode === 'sigma' ? 'bg-amber-600 text-black' : 'border-amber-600 text-amber-400'}
              >
                <Cpu className="mr-2 h-4 w-4" />
                SIGMA Live Scanner
              </Button>
              <Button
                variant={scanMode === 'unknown' ? 'default' : 'outline'}
                onClick={() => setScanMode('unknown')}
                className={scanMode === 'unknown' ? 'bg-amber-600 text-black' : 'border-amber-600 text-amber-400'}
              >
                Unknown Threat Discovery
              </Button>
            </div>

            {scanMode !== 'unknown' ? (
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
                        {scanMode === 'sigma' ? 'SIGMA Scanning...' : scanMode === 'recursive' ? 'AI Scanning...' : 'Live Scanning...'}
                      </>
                    ) : (
                      <>
                        {scanMode === 'sigma' ? (
                          <Cpu className="mr-2 h-4 w-4" />
                        ) : scanMode === 'recursive' ? (
                          <Brain className="mr-2 h-4 w-4" />
                        ) : (
                          <Shield className="mr-2 h-4 w-4" />
                        )}
                        Run {scanMode === 'sigma' ? 'SIGMA Live' : scanMode === 'recursive' ? 'Recursive AI' : 'Live OSINT'} Scan
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

            {scanMode === 'sigma' && (
              <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-400 font-medium">A.R.I.A™ SIGMA Live Intelligence</span>
                </div>
                <p className="text-sm text-gray-300">
                  Advanced live threat profiling with AI-powered fix path generation. Automatically discovers entity relationships, 
                  creates threat DNA signatures, generates mission chain logs, and provides actionable mitigation strategies.
                </p>
              </div>
            )}

            {scanMode === 'recursive' && (
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 font-medium">Recursive AI Intelligence</span>
                </div>
                <p className="text-sm text-gray-300">
                  Advanced mode that automatically discovers related entities, expands search queries with AI-enhanced threat patterns, 
                  and performs recursive analysis to map the complete threat landscape. Ideal for comprehensive intelligence gathering.
                </p>
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
                    {scanMode === 'sigma' ? 'A.R.I.A™ SIGMA Live Intelligence Gathering' : 'A.R.I.A™ Live OSINT Intelligence Gathering'}
                  </span>
                </div>
                <Progress value={scanProgress} className="h-3" />
                <p className="text-gray-300 text-sm">{currentPhase}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {(scanMode === 'sigma' ? sigmaPhases : scanPhases).map((phase, index) => (
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
