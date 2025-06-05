
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Target, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { KeywordCIAIntegration } from '@/services/intelligence/keywordCIAIntegration';
import { LiveDataEnforcer } from '@/services/ariaCore/liveDataEnforcer';

interface ArticleGenerationTabProps {
  entityName: string;
}

const ArticleGenerationTab: React.FC<ArticleGenerationTabProps> = ({ entityName }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [liveDataStatus, setLiveDataStatus] = useState<'checking' | 'compliant' | 'non-compliant'>('checking');

  // Check live data compliance on component mount
  React.useEffect(() => {
    const checkCompliance = async () => {
      try {
        console.log('🔍 Checking live data compliance for keyword system...');
        const compliance = await LiveDataEnforcer.validateLiveDataCompliance();
        console.log('Compliance result:', compliance);
        
        setLiveDataStatus(compliance.isCompliant ? 'compliant' : 'non-compliant');
        
        if (!compliance.isCompliant || compliance.simulationDetected) {
          console.error('🚫 COMPLIANCE FAILURE:', compliance.message);
          toast.error('🚫 Live data compliance failure - simulation mode blocked');
        } else {
          console.log('✅ Live data compliance verified');
          toast.success('✅ Live data compliance verified');
        }
      } catch (error) {
        console.error('❌ Compliance check failed:', error);
        setLiveDataStatus('non-compliant');
        toast.error('❌ Compliance check failed');
      }
    };

    if (entityName) {
      checkCompliance();
    }
  }, [entityName]);

  const generateArticles = async () => {
    if (!entityName) {
      toast.error('Please select an entity first');
      return;
    }

    console.log('🎯 Starting LIVE article generation for:', entityName);
    
    setIsGenerating(true);
    try {
      // STEP 1: Validate live data compliance before ANY operations
      console.log('🔒 STEP 1: Validating live data compliance...');
      const compliance = await LiveDataEnforcer.validateLiveDataCompliance();
      if (!compliance.isCompliant || compliance.simulationDetected) {
        console.error('🚫 BLOCKED: Live data compliance failure:', compliance.message);
        toast.error('🚫 BLOCKED: Article generation requires live data compliance');
        return;
      }
      console.log('✅ Live data compliance verified');

      // STEP 2: Validate entity name is not simulation data
      console.log('🔒 STEP 2: Validating entity name...');
      const isLiveEntity = await LiveDataEnforcer.validateDataInput(entityName, 'article_generation');
      if (!isLiveEntity) {
        console.error('🚫 BLOCKED: Entity name appears to be simulation data:', entityName);
        toast.error('🚫 BLOCKED: Entity name appears to be simulation data');
        return;
      }
      console.log('✅ Entity name validated as live data');

      // STEP 3: Execute CIA-level precision scan with LIVE DATA ONLY
      console.log('🎯 STEP 3: Executing CIA-level precision scan...');
      toast.info(`🎯 Generating LIVE articles for ${entityName} - NO SIMULATIONS`);

      const scanResult = await KeywordCIAIntegration.executeKeywordPrecisionScan(entityName, {
        precisionMode: 'high',
        enableFalsePositiveFilter: true,
        contextTags: ['article_generation', 'content_strategy', 'live_intelligence']
      });

      console.log('📊 CIA scan result:', {
        resultsCount: scanResult.results.length,
        avgConfidence: scanResult.precisionStats.avg_precision_score,
        confidenceLevel: scanResult.precisionStats.confidence_level
      });

      if (scanResult.results.length === 0) {
        console.warn('⚠️ No live intelligence found for article generation');
        toast.warning('No live intelligence found for article generation');
        return;
      }

      // STEP 4: Generate articles based ONLY on verified live intelligence
      console.log('📝 STEP 4: Generating articles from live intelligence...');
      const newArticles = scanResult.results.slice(0, 3).map((result, index) => ({
        id: `live-${Date.now()}-${index}`,
        title: `Live Intelligence Report: ${entityName} - ${result.threat_type || 'Strategic Analysis'}`,
        type: 'live_intelligence_report',
        status: 'live_verified',
        keywords: [
          entityName.toLowerCase(),
          result.threat_type || 'intelligence',
          'strategic_analysis',
          'live_data_verified',
          'cia_level_scan'
        ],
        created_at: new Date().toISOString(),
        confidence_score: result.match_score,
        platform: result.platform,
        live_verified: true,
        cia_verified: true,
        source_intelligence: result.content?.substring(0, 150) + '...',
        threat_analysis: result.threat_type,
        severity_level: result.severity,
        precision_stats: {
          confidence_level: scanResult.precisionStats.confidence_level,
          precision_score: scanResult.precisionStats.avg_precision_score
        }
      }));

      setArticles(prev => [...prev, ...newArticles]);
      
      console.log('✅ LIVE article generation completed successfully:', {
        entity: entityName,
        articlesGenerated: newArticles.length,
        avgConfidence: scanResult.precisionStats.avg_precision_score,
        confidenceLevel: scanResult.precisionStats.confidence_level,
        liveDataCompliant: true,
        simulationsBlocked: true
      });

      toast.success(`✅ Generated ${newArticles.length} LIVE intelligence articles - NO MOCK DATA`);

    } catch (error: any) {
      console.error('❌ Live article generation failed:', error);
      
      if (error.message.includes('simulation') || error.message.includes('blocked')) {
        console.error('🚫 SIMULATION DETECTED:', error.message);
        toast.error('🚫 Article generation blocked: Simulation data detected');
      } else if (error.message.includes('Live data compliance')) {
        console.error('🚫 COMPLIANCE FAILURE:', error.message);
        toast.error('🚫 Live data compliance failure - operation blocked');
      } else {
        console.error('❌ GENERAL ERROR:', error.message);
        toast.error('❌ Failed to generate live articles');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Data Status */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className={`h-5 w-5 ${liveDataStatus === 'compliant' ? 'text-green-500' : 'text-red-500'}`} />
            Live Data Enforcement Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            {liveDataStatus === 'checking' && (
              <Badge className="bg-yellow-500 text-black animate-pulse">
                🔍 Checking Compliance...
              </Badge>
            )}
            {liveDataStatus === 'compliant' && (
              <Badge className="bg-green-500 text-black">
                ✅ LIVE DATA VERIFIED
              </Badge>
            )}
            {liveDataStatus === 'non-compliant' && (
              <Badge className="bg-red-500 text-white">
                🚫 SIMULATION DETECTED
              </Badge>
            )}
            <span className="text-corporate-lightGray text-sm">
              {liveDataStatus === 'compliant' 
                ? 'System verified for live intelligence operations - NO SIMULATIONS'
                : liveDataStatus === 'non-compliant'
                ? 'Simulation data detected - all operations blocked until resolved'
                : 'Verifying live data compliance...'
              }
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-corporate-accent" />
            CIA-Level Live Intelligence Article Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Target Entity: {entityName}</h4>
              <p className="text-corporate-lightGray text-sm">
                CIA-level precision article generation from verified live intelligence only
              </p>
              <p className="text-green-400 text-xs mt-1">
                ✅ All simulations permanently blocked - Live data enforcement active
              </p>
              {liveDataStatus === 'non-compliant' && (
                <div className="flex items-center gap-2 mt-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-red-400 text-sm">
                    Live data compliance required - simulation contamination detected
                  </span>
                </div>
              )}
            </div>
            <Button
              onClick={generateArticles}
              disabled={isGenerating || !entityName || liveDataStatus !== 'compliant'}
              className="bg-corporate-accent text-black hover:bg-corporate-accent/90 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Target className="h-4 w-4 mr-2 animate-spin" />
                  Processing Live Intel...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate LIVE Articles
                </>
              )}
            </Button>
          </div>

          {articles.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-white font-medium">
                CIA-Level Live Intelligence Articles ({articles.length})
              </h4>
              <div className="space-y-3">
                {articles.map((article) => (
                  <div key={article.id} className="p-4 bg-corporate-darkSecondary rounded-lg border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500 text-black">
                          {article.type}
                        </Badge>
                        {article.live_verified && (
                          <Badge className="bg-blue-500 text-white">
                            ✅ LIVE VERIFIED
                          </Badge>
                        )}
                        {article.cia_verified && (
                          <Badge className="bg-corporate-accent text-black">
                            🎯 CIA PRECISION
                          </Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="text-corporate-lightGray">
                        {article.status}
                      </Badge>
                    </div>
                    <h5 className="text-white font-medium mb-2">{article.title}</h5>
                    
                    {article.source_intelligence && (
                      <div className="mb-3 p-2 bg-green-500/10 rounded text-sm">
                        <span className="text-green-400 font-medium">Live Intelligence Source:</span>
                        <p className="text-green-300 mt-1">{article.source_intelligence}</p>
                      </div>
                    )}

                    {article.precision_stats && (
                      <div className="mb-3 p-2 bg-blue-500/10 rounded text-sm">
                        <span className="text-blue-400 font-medium">CIA Precision Stats:</span>
                        <div className="flex gap-4 mt-1">
                          <span className="text-blue-300">
                            Confidence: {article.precision_stats.confidence_level}
                          </span>
                          <span className="text-blue-300">
                            Precision: {(article.precision_stats.precision_score * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {article.keywords.map((keyword: string, index: number) => (
                          <Badge key={index} className="bg-blue-500/20 text-blue-300 text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        {article.confidence_score && (
                          <span className="text-green-400">
                            Confidence: {(article.confidence_score * 100).toFixed(1)}%
                          </span>
                        )}
                        <span className="text-corporate-lightGray">
                          {new Date(article.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {articles.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-corporate-lightGray mx-auto mb-4" />
              <p className="text-corporate-lightGray">
                No live intelligence articles generated yet for {entityName}
              </p>
              <p className="text-corporate-lightGray text-sm">
                {liveDataStatus === 'compliant' 
                  ? 'Click "Generate LIVE Articles" to create content from verified live intelligence'
                  : 'Live data compliance required - all simulations permanently blocked'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleGenerationTab;
