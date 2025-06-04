
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

  const runCIAScan = async () => {
    if (!entityName) {
      toast.error('Please select an entity first');
      return;
    }

    setIsScanning(true);
    try {
      toast.info(`🎯 Starting practical CIA scan for ${entityName}...`);
      
      const results = await EnforcedIntelligencePipeline.executeCIAPrecisionScan(entityName);

      setScanResults(results);
      
      // Calculate more realistic precision score
      const totalScore = results.reduce((sum, r) => sum + (r.confidence_score || r.match_score || 0), 0);
      const avgScore = results.length > 0 ? totalScore / results.length : 0;
      setPrecisionScore(avgScore);

      // Calculate scan statistics
      const accepted = results.filter(r => r.match_decision === 'accepted').length;
      const quarantined = results.filter(r => r.match_decision === 'quarantined').length;
      const rejected = results.filter(r => r.match_decision === 'rejected').length;

      setScanStats({
        total: results.length,
        accepted,
        quarantined,
        rejected
      });

      toast.success(`✅ CIA scan complete: ${results.length} practical results with ${avgScore.toFixed(1)}% avg confidence`);
    } catch (error) {
      console.error('CIA scan failed:', error);
      toast.error(`❌ CIA scan failed: ${error.message}`);
    } finally {
      setIsScanning(false);
    }
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
            CIA-Level Precision Filtering (PRACTICAL MODE)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Target Entity: {entityName}</h4>
              <p className="text-corporate-lightGray text-sm">
                Practical CIA filtering - accepts quarantined results for comprehensive coverage
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
                  Run Practical CIA Scan
                </>
              )}
            </Button>
          </div>

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
              
              {scanStats && (
                <div className="mt-3 grid grid-cols-4 gap-2 text-sm">
                  <div className="text-center">
                    <div className="text-white font-medium">{scanStats.total}</div>
                    <div className="text-corporate-lightGray">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-medium">{scanStats.accepted}</div>
                    <div className="text-corporate-lightGray">Accepted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 font-medium">{scanStats.quarantined}</div>
                    <div className="text-corporate-lightGray">Quarantined</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-400 font-medium">{scanStats.rejected}</div>
                    <div className="text-corporate-lightGray">Rejected</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {scanResults.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="text-white font-medium">CIA Scan Results ({scanResults.length})</h4>
                <Info className="h-4 w-4 text-corporate-accent" />
                <span className="text-corporate-lightGray text-sm">
                  Showing both accepted and quarantined results
                </span>
              </div>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {scanResults.map((result, index) => (
                  <div key={index} className="p-3 bg-corporate-darkTertiary rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      {getDecisionBadge(result.match_decision)}
                      <span className="text-corporate-lightGray text-sm">
                        {result.confidence_score || result.match_score || 0}% confidence
                      </span>
                    </div>
                    <p className="text-white text-sm line-clamp-2">
                      {result.content ? result.content.substring(0, 150) + '...' : 'No content available'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-corporate-lightGray text-xs">
                        Platform: {result.platform}
                      </span>
                      <span className="text-corporate-accent text-xs">
                        Entity: {entityName}
                      </span>
                      {result.match_decision === 'accepted' ? (
                        <CheckCircle className="h-3 w-3 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 text-yellow-400" />
                      )}
                      <span className={`text-xs ${result.match_decision === 'accepted' ? 'text-green-400' : 'text-yellow-400'}`}>
                        CIA {result.match_decision === 'accepted' ? 'Verified' : 'Quarantined'}
                      </span>
                    </div>
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
