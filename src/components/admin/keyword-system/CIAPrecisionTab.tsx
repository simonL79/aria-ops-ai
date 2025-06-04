import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Target, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { EnforcedIntelligencePipeline } from '@/services/ariaCore/enforcedIntelligencePipeline';
import { toast } from 'sonner';

interface CIAPrecisionTabProps {
  entityName: string;
}

const CIAPrecisionTab: React.FC<CIAPrecisionTabProps> = ({ entityName }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [precisionScore, setPrecisionScore] = useState(0);
  const [scanStats, setScanStats] = useState<any>(null);
  const [tieredStats, setTieredStats] = useState<any>(null);

  const runCIAScan = async () => {
    if (!entityName) {
      toast.error('Please select an entity first');
      return;
    }

    setIsScanning(true);
    try {
      toast.info(`🎯 Starting tiered CIA scan for ${entityName}...`);
      
      const results = await EnforcedIntelligencePipeline.executeCIAPrecisionScan(entityName);

      setScanResults(results);
      
      // Calculate tiered precision score
      const totalScore = results.reduce((sum, r) => sum + (r.confidence_score || r.match_score || 0), 0);
      const avgScore = results.length > 0 ? totalScore / results.length : 0;
      setPrecisionScore(avgScore);

      // Calculate tiered statistics
      const strong = results.filter(r => r.matchQuality === 'strong').length;
      const moderate = results.filter(r => r.matchQuality === 'moderate').length;
      const weak = results.filter(r => r.matchQuality === 'weak').length;
      const reviewRequired = results.filter(r => r.requiresReview).length;

      setTieredStats({
        strong,
        moderate,
        weak,
        reviewRequired,
        total: results.length,
        retentionRate: ((strong + moderate) / (strong + moderate + weak || 1) * 100).toFixed(1)
      });

      setScanStats({
        total: results.length,
        accepted: strong + moderate,
        quarantined: weak,
        rejected: 0
      });

      toast.success(`✅ Tiered CIA scan complete: ${results.length} results with ${tieredStats?.retentionRate || '0'}% retention rate`);
    } catch (error) {
      console.error('CIA scan failed:', error);
      toast.error(`❌ CIA scan failed: ${error.message}`);
    } finally {
      setIsScanning(false);
    }
  };

  const getQualityBadgeColor = (quality: string) => {
    switch (quality) {
      case 'strong':
        return 'bg-green-500';
      case 'moderate':
        return 'bg-yellow-500';
      case 'weak':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getQualityBadge = (result: any) => {
    const quality = result.matchQuality || 'unknown';
    return (
      <Badge className={getQualityBadgeColor(quality)}>
        {quality.toUpperCase()}
        {result.requiresReview && ' - REVIEW'}
      </Badge>
    );
  };

  const getConfidenceBadgeColor = (score: number) => {
    if (score >= 50) return 'bg-green-500';
    if (score >= 25) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'accepted':
        return <Badge className="bg-green-500">ACCEPTED</Badge>;
      case 'quarantined':
        return <Badge className="bg-yellow-500">QUARANTINED</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">REJECTED</Badge>;
      default:
        return <Badge className="bg-gray-500">UNKNOWN</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-corporate-accent" />
            CIA-Level Tiered Precision Filtering
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Target Entity: {entityName}</h4>
              <p className="text-corporate-lightGray text-sm">
                Tiered confidence system: Strong (60%+), Moderate (30-59%), Weak (15-29%)
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
                  Scanning...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Run Tiered CIA Scan
                </>
              )}
            </Button>
          </div>

          {tieredStats && (
            <div className="p-4 bg-corporate-darkSecondary rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Tiered Results Analysis</span>
                <Badge className="bg-corporate-accent text-black">
                  {tieredStats.retentionRate}% Retention
                </Badge>
              </div>
              
              <div className="grid grid-cols-5 gap-2 text-sm">
                <div className="text-center">
                  <div className="text-green-400 font-medium">{tieredStats.strong}</div>
                  <div className="text-corporate-lightGray">Strong</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-medium">{tieredStats.moderate}</div>
                  <div className="text-corporate-lightGray">Moderate</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-400 font-medium">{tieredStats.weak}</div>
                  <div className="text-corporate-lightGray">Weak</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 font-medium">{tieredStats.reviewRequired}</div>
                  <div className="text-corporate-lightGray">Review</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-medium">{tieredStats.total}</div>
                  <div className="text-corporate-lightGray">Total</div>
                </div>
              </div>
            </div>
          )}

          {precisionScore > 0 && (
            <div className="p-4 bg-corporate-darkSecondary rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Average Confidence Score</span>
                <Badge className={getConfidenceBadgeColor(precisionScore)}>
                  {precisionScore.toFixed(1)}%
                </Badge>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getConfidenceBadgeColor(precisionScore)}`}
                  style={{ width: `${Math.min(precisionScore, 100)}%` }}
                />
              </div>
            </div>
          )}

          {scanResults.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="text-white font-medium">Tiered CIA Results ({scanResults.length})</h4>
                <Info className="h-4 w-4 text-corporate-accent" />
                <span className="text-corporate-lightGray text-sm">
                  Smart escalation with context boosting
                </span>
              </div>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {scanResults.map((result, index) => (
                  <div key={index} className="p-3 bg-corporate-darkTertiary rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      {getQualityBadge(result)}
                      <span className="text-corporate-lightGray text-sm">
                        {result.confidence_score || result.match_score || 0}% confidence
                      </span>
                    </div>
                    <p className="text-white text-sm line-clamp-2">
                      {result.content ? result.content.substring(0, 150) + '...' : 'No content available'}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-corporate-lightGray text-xs">
                        Platform: {result.platform}
                      </span>
                      <span className="text-corporate-accent text-xs">
                        Entity: {entityName}
                      </span>
                      {result.contextBoosts && result.contextBoosts.length > 0 && (
                        <Badge className="bg-blue-500 text-xs">
                          +{result.contextBoosts.length} boosts
                        </Badge>
                      )}
                      {result.requiresReview && (
                        <Badge className="bg-purple-500 text-xs">
                          NEEDS REVIEW
                        </Badge>
                      )}
                    </div>
                    {result.contextBoosts && result.contextBoosts.length > 0 && (
                      <div className="mt-2 text-xs text-corporate-lightGray">
                        Boosts: {result.contextBoosts.join(', ')}
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
