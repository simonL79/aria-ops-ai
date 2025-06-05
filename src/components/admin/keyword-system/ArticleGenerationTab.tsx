
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
        const compliance = await LiveDataEnforcer.validateLiveDataCompliance();
        setLiveDataStatus(compliance.isCompliant ? 'compliant' : 'non-compliant');
        
        if (!compliance.isCompliant) {
          toast.error('🚫 Live data compliance failure detected - simulation mode blocked');
        }
      } catch (error) {
        setLiveDataStatus('non-compliant');
        console.error('Compliance check failed:', error);
      }
    };

    checkCompliance();
  }, []);

  const generateArticles = async () => {
    if (!entityName) {
      toast.error('Please select an entity first');
      return;
    }

    // Validate live data compliance before generation
    const compliance = await LiveDataEnforcer.validateLiveDataCompliance();
    if (!compliance.isCompliant || compliance.simulationDetected) {
      toast.error('🚫 BLOCKED: Article generation requires live data compliance');
      return;
    }

    // Validate entity name is not simulation data
    if (!await LiveDataEnforcer.validateDataInput(entityName, 'article_generation')) {
      toast.error('🚫 BLOCKED: Entity name appears to be simulation data');
      return;
    }

    setIsGenerating(true);
    try {
      toast.info(`📝 Generating LIVE articles for ${entityName}...`);

      // Use CIA-level integration for live article generation
      const scanResult = await KeywordCIAIntegration.executeKeywordPrecisionScan(entityName, {
        precisionMode: 'high',
        enableFalsePositiveFilter: true,
        contextTags: ['article_generation', 'content_strategy']
      });

      if (scanResult.results.length === 0) {
        toast.warning('No live intelligence found for article generation');
        return;
      }

      // Generate articles based on live intelligence
      const newArticles = scanResult.results.slice(0, 3).map((result, index) => ({
        id: `live-${Date.now()}-${index}`,
        title: `Strategic Intelligence: ${entityName} - ${result.match_type || 'Analysis'}`,
        type: 'live_intelligence',
        status: 'live_draft',
        keywords: [
          entityName.toLowerCase(),
          result.match_type || 'intelligence',
          'strategic_analysis',
          'live_data'
        ],
        created_at: new Date().toISOString(),
        confidence_score: result.match_score,
        platform: result.platform,
        live_verified: true,
        source_intelligence: result.content?.substring(0, 100) + '...'
      }));

      setArticles(prev => [...prev, ...newArticles]);
      toast.success(`✅ Generated ${newArticles.length} live intelligence articles`);

      // Log live data operation
      console.log('✅ Live article generation completed:', {
        entity: entityName,
        articles: newArticles.length,
        avgConfidence: scanResult.precisionStats.avg_precision_score,
        liveDataCompliant: true
      });

    } catch (error: any) {
      console.error('Live article generation failed:', error);
      
      if (error.message.includes('simulation') || error.message.includes('blocked')) {
        toast.error('🚫 Article generation blocked: Simulation data detected');
      } else {
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
              <Badge className="bg-yellow-500 text-black">
                Checking Compliance...
              </Badge>
            )}
            {liveDataStatus === 'compliant' && (
              <Badge className="bg-green-500 text-black">
                ✅ Live Data Compliant
              </Badge>
            )}
            {liveDataStatus === 'non-compliant' && (
              <Badge className="bg-red-500 text-white">
                🚫 Non-Compliant - Simulation Detected
              </Badge>
            )}
            <span className="text-corporate-lightGray text-sm">
              {liveDataStatus === 'compliant' 
                ? 'System verified for live intelligence operations'
                : liveDataStatus === 'non-compliant'
                ? 'Simulation data detected - article generation blocked'
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
            Live Intelligence Article Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Entity: {entityName}</h4>
              <p className="text-corporate-lightGray text-sm">
                CIA-level precision article generation from live intelligence
              </p>
              {liveDataStatus === 'non-compliant' && (
                <div className="flex items-center gap-2 mt-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-red-400 text-sm">
                    Live data compliance required for generation
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
                  Generate Live Articles
                </>
              )}
            </Button>
          </div>

          {articles.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-white font-medium">
                Live Intelligence Articles ({articles.length})
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
                          <Badge className="bg-corporate-accent text-black">
                            ✅ LIVE VERIFIED
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
                  ? 'Click "Generate Live Articles" to create content from live intelligence'
                  : 'Live data compliance required before article generation'
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
