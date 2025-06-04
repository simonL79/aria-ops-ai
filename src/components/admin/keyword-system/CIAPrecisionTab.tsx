
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import { EnforcedIntelligencePipeline } from '@/services/ariaCore/enforcedIntelligencePipeline';
import { toast } from 'sonner';

interface CIAPrecisionTabProps {
  entityName: string;
}

const CIAPrecisionTab: React.FC<CIAPrecisionTabProps> = ({ entityName }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [precisionScore, setPrecisionScore] = useState(0);

  const runCIAScan = async () => {
    if (!entityName) {
      toast.error('Please select an entity first');
      return;
    }

    setIsScanning(true);
    try {
      toast.info(`🎯 Starting CIA-level precision scan for ${entityName}...`);
      
      const results = await EnforcedIntelligencePipeline.executeCIAPrecisionScan(entityName);

      setScanResults(results);
      const avgScore = results.length > 0 
        ? results.reduce((sum, r) => sum + r.confidence_score, 0) / results.length 
        : 0;
      setPrecisionScore(avgScore);

      toast.success(`✅ CIA scan complete: ${results.length} verified results with ${avgScore.toFixed(1)}% precision`);
    } catch (error) {
      console.error('CIA scan failed:', error);
      toast.error('❌ CIA precision scan failed - live data enforcement active');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-corporate-accent" />
            CIA-Level Precision Filtering (ENFORCED)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Target Entity: {entityName}</h4>
              <p className="text-corporate-lightGray text-sm">
                Live data enforcement active - no simulations permitted
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
                  Run Enforced CIA Scan
                </>
              )}
            </Button>
          </div>

          {precisionScore > 0 && (
            <div className="p-4 bg-corporate-darkSecondary rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Precision Score (Enforced)</span>
                <Badge className={precisionScore >= 75 ? 'bg-green-500' : 'bg-yellow-500'}>
                  {precisionScore.toFixed(1)}%
                </Badge>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${precisionScore >= 75 ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{ width: `${Math.min(precisionScore, 100)}%` }}
                />
              </div>
            </div>
          )}

          {scanResults.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-white font-medium">Live Verified Results ({scanResults.length})</h4>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {scanResults.map((result, index) => (
                  <div key={index} className="p-3 bg-corporate-darkTertiary rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-green-500">
                        LIVE VERIFIED
                      </Badge>
                      <span className="text-corporate-lightGray text-sm">
                        {result.confidence_score}% confidence
                      </span>
                    </div>
                    <p className="text-white text-sm line-clamp-2">
                      {result.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-corporate-lightGray text-xs">
                        Platform: {result.platform}
                      </span>
                      <span className="text-corporate-accent text-xs">
                        Entity: {entityName}
                      </span>
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span className="text-green-400 text-xs">Enforcement Passed</span>
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
