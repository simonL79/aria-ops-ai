
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Target, CheckCircle, AlertTriangle, Info, Brain, Zap } from 'lucide-react';
import { EnforcedIntelligencePipeline } from '@/services/ariaCore/enforcedIntelligencePipeline';
import { IntelligenceValidationCore } from '@/services/ariaCore/intelligenceValidationCore';
import { toast } from 'sonner';

interface CIAPrecisionTabProps {
  entityName: string;
}

const CIAPrecisionTab: React.FC<CIAPrecisionTabProps> = ({ entityName }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [validationStats, setValidationStats] = useState<any>(null);
  const [precisionScore, setPrecisionScore] = useState(0);

  const runCIAScan = async () => {
    if (!entityName) {
      toast.error('Please select an entity first');
      return;
    }

    setIsScanning(true);
    try {
      toast.info(`🎯 Starting CIA-level precision scan for ${entityName}...`);
      
      // Execute CIA precision scan with IVC validation
      const results = await EnforcedIntelligencePipeline.executeCIAPrecisionScan(entityName);
      setScanResults(results);
      
      // Get validation statistics
      const stats = await IntelligenceValidationCore.getValidationStats('24h');
      setValidationStats(stats);
      
      // Calculate overall precision score
      const avgConfidence = results.length > 0 
        ? results.reduce((sum, r) => sum + (r.confidence_score || 0), 0) / results.length
        : 0;
      setPrecisionScore(avgConfidence);

      toast.success(`✅ CIA precision scan complete: ${results.length} validated results`);
    } catch (error) {
      console.error('CIA scan failed:', error);
      toast.error(`❌ CIA scan failed: ${error.message}`);
    } finally {
      setIsScanning(false);
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'accept': return 'bg-green-500';
      case 'review': return 'bg-yellow-500';
      case 'quarantine': return 'bg-orange-500';
      default: return 'bg-red-500';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'accept': return <CheckCircle className="h-3 w-3" />;
      case 'review': return <AlertTriangle className="h-3 w-3" />;
      case 'quarantine': return <AlertTriangle className="h-3 w-3" />;
      default: return <AlertTriangle className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-corporate-accent" />
            CIA-Level Intelligence Validation Core
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium flex items-center gap-2">
                <Brain className="h-4 w-4 text-corporate-accent" />
                Target Entity: {entityName}
              </h4>
              <p className="text-corporate-lightGray text-sm">
                CIA-grade validation: Zero tolerance + Tiered confidence system
              </p>
            </div>
            <Button
              onClick={runCIAScan}
              disabled={isScanning || !entityName}
              className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              {isScanning ? (
                <>
                  <Target className="h-4 w-4 mr-2 animate-spin" />
                  CIA Scanning...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Run CIA Precision Scan
                </>
              )}
            </Button>
          </div>

          {/* Validation Statistics */}
          {validationStats && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="p-3 bg-corporate-darkSecondary rounded-lg">
                <div className="text-green-400 font-medium">{validationStats.acceptedCount}</div>
                <div className="text-corporate-lightGray text-xs">Accepted</div>
              </div>
              <div className="p-3 bg-corporate-darkSecondary rounded-lg">
                <div className="text-yellow-400 font-medium">{validationStats.reviewCount}</div>
                <div className="text-corporate-lightGray text-xs">Review Required</div>
              </div>
              <div className="p-3 bg-corporate-darkSecondary rounded-lg">
                <div className="text-orange-400 font-medium">{validationStats.quarantinedCount}</div>
                <div className="text-corporate-lightGray text-xs">Quarantined</div>
              </div>
              <div className="p-3 bg-corporate-darkSecondary rounded-lg">
                <div className="text-red-400 font-medium">{validationStats.discardedCount}</div>
                <div className="text-corporate-lightGray text-xs">Discarded</div>
              </div>
              <div className="p-3 bg-corporate-darkSecondary rounded-lg">
                <div className="text-corporate-accent font-medium">
                  {(validationStats.avgConfidence * 100).toFixed(1)}%
                </div>
                <div className="text-corporate-lightGray text-xs">Avg Confidence</div>
              </div>
            </div>
          )}

          {/* Precision Score Display */}
          {precisionScore > 0 && (
            <div className="p-4 bg-corporate-darkSecondary rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-corporate-accent" />
                  CIA Precision Score
                </span>
                <Badge className="bg-corporate-accent text-black">
                  {precisionScore.toFixed(1)}% Validated
                </Badge>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-corporate-accent h-2 rounded-full"
                  style={{ width: `${Math.min(precisionScore, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* CIA Validated Results */}
          {scanResults.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="text-white font-medium">CIA Validated Results ({scanResults.length})</h4>
                <Info className="h-4 w-4 text-corporate-accent" />
                <span className="text-corporate-lightGray text-sm">
                  Intelligence Validation Core processed
                </span>
              </div>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {scanResults.map((result, index) => (
                  <div key={index} className="p-3 bg-corporate-darkTertiary rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getTierBadgeColor(result.validationTier)}>
                          {getTierIcon(result.validationTier)}
                          {result.validationTier?.toUpperCase()}
                        </Badge>
                        {result.ciaValidated && (
                          <Badge className="bg-corporate-accent text-black text-xs">
                            CIA VALIDATED
                          </Badge>
                        )}
                      </div>
                      <span className="text-corporate-lightGray text-sm">
                        {result.confidence_score}% confidence
                      </span>
                    </div>
                    
                    <p className="text-white text-sm line-clamp-2 mb-2">
                      {result.content ? result.content.substring(0, 150) + '...' : 'No content available'}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-corporate-lightGray text-xs">
                        Platform: {result.platform}
                      </span>
                      <span className="text-corporate-accent text-xs">
                        Entity: {entityName}
                      </span>
                      {result.requiresReview && (
                        <Badge className="bg-purple-500 text-xs">
                          NEEDS REVIEW
                        </Badge>
                      )}
                    </div>
                    
                    {/* Context Boosts */}
                    {result.contextBoosts && result.contextBoosts.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-corporate-lightGray mb-1">
                          Context Boosts: +{result.contextBoosts.length}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {result.contextBoosts.map((boost: string, i: number) => (
                            <Badge key={i} className="bg-blue-500/20 text-blue-300 text-xs">
                              {boost.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CIAPrecisionTab;
