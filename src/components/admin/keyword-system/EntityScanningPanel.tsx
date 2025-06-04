import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Search, Target, Plus, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { KeywordCIAIntegration } from '@/services/intelligence/keywordCIAIntegration';
import CIAScanResultsPanel from './CIAScanResultsPanel';

interface EntityScanResult {
  entityName: string;
  keywords: string[];
  results: any[];
  precisionStats: {
    total_scanned: number;
    accepted: number;
    quarantined: number;
    rejected: number;
    false_positives_blocked: number;
    avg_precision_score: number;
    confidence_level: 'high' | 'medium' | 'low';
  };
}

interface EntityScanningPanelProps {
  onEntityScanned?: (result: EntityScanResult) => void;
}

const EntityScanningPanel = ({ onEntityScanned }: EntityScanningPanelProps) => {
  const [entityName, setEntityName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<EntityScanResult | null>(null);
  const [showAddToClients, setShowAddToClients] = useState(false);
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  const handleScanEntity = async () => {
    if (!entityName.trim()) {
      toast.error('Please enter an entity name');
      return;
    }

    setIsScanning(true);
    toast.info(`🔍 Starting CIA-level scan for: ${entityName}`);

    try {
      const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
      
      // Execute CIA-level precision scan
      const scanResponse = await KeywordCIAIntegration.executeKeywordPrecisionScan(entityName, {
        precisionMode: 'high',
        enableFalsePositiveFilter: true,
        contextTags: keywordList
      });

      const result: EntityScanResult = {
        entityName,
        keywords: keywordList,
        results: scanResponse.results,
        precisionStats: scanResponse.precisionStats
      };

      setScanResult(result);
      setShowAddToClients(true);
      
      if (onEntityScanned) {
        onEntityScanned(result);
      }

      toast.success(`✅ Scan complete: ${scanResponse.results.length} CIA-verified results`);
      toast.info(`🎯 Precision: ${(scanResponse.precisionStats.avg_precision_score * 100).toFixed(1)}% | Confidence: ${scanResponse.precisionStats.confidence_level.toUpperCase()}`);
      
      if (scanResponse.precisionStats.false_positives_blocked > 0) {
        toast.success(`🚫 Blocked ${scanResponse.precisionStats.false_positives_blocked} false positives`);
      }

    } catch (error) {
      console.error('Entity scan failed:', error);
      toast.error('Failed to scan entity');
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddToClients = async () => {
    if (!scanResult) return;

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          name: scanResult.entityName,
          keywordtargets: scanResult.keywords.join(', '),
          contactemail: `${scanResult.entityName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          contactname: scanResult.entityName,
          industry: 'Intelligence Target'
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success(`✅ "${scanResult.entityName}" added to client database`);
      toast.info('You can now use "Execute Full Pipeline" to scan all clients');
      setShowAddToClients(false);
      setScanResult(null);
      setEntityName('');
      setKeywords('');

    } catch (error) {
      console.error('Error adding to clients:', error);
      toast.error('Failed to add to client database');
    }
  };

  const handleViewDetailedResults = () => {
    if (scanResult?.entityName) {
      setShowDetailedResults(true);
    }
  };

  const getPrecisionColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-900/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-900/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-red-900/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-900/20 text-gray-300 border-gray-500/30';
    }
  };

  if (showDetailedResults && scanResult) {
    return (
      <CIAScanResultsPanel
        entityName={scanResult.entityName}
        onClose={() => setShowDetailedResults(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-white">
            <Search className="h-6 w-6 text-corporate-accent" />
            Entity Intelligence Scanning
          </CardTitle>
          <p className="text-corporate-lightGray">
            Scan prospects with CIA-level precision before adding them as clients
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scanning Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="entityName" className="text-white font-medium">
                Entity Name *
              </Label>
              <Input
                id="entityName"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="e.g., Simon Lindsay, John Smith, ABC Corporation"
                className="bg-corporate-darkTertiary border-corporate-border text-white"
                disabled={isScanning}
              />
            </div>

            <div>
              <Label htmlFor="keywords" className="text-white font-medium">
                Target Keywords (comma-separated)
              </Label>
              <Textarea
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., fraud, investigation, arrest, lawsuit, criminal, allegations"
                className="bg-corporate-darkTertiary border-corporate-border text-white min-h-[80px]"
                disabled={isScanning}
              />
              <p className="text-sm text-corporate-lightGray mt-1">
                Keywords help focus the scan on specific threat types and contexts
              </p>
            </div>

            <Button
              onClick={handleScanEntity}
              disabled={isScanning || !entityName.trim()}
              className="bg-corporate-accent hover:bg-corporate-accentDark text-black font-bold w-full"
            >
              {isScanning ? (
                <>
                  <Target className="h-4 w-4 mr-2 animate-pulse" />
                  Scanning with CIA Precision...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Execute Entity Scan
                </>
              )}
            </Button>
          </div>

          {/* Scan Results */}
          {scanResult && (
            <div className="space-y-4 pt-4 border-t border-corporate-border">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-white">Scan Results for "{scanResult.entityName}"</h4>
                <Button
                  onClick={handleViewDetailedResults}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Detailed Results
                </Button>
              </div>
              
              {/* Precision Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-corporate-darkTertiary p-3 rounded-lg">
                  <div className="text-2xl font-bold text-corporate-accent">
                    {scanResult.precisionStats.total_scanned}
                  </div>
                  <div className="text-sm text-corporate-lightGray">Total Scanned</div>
                </div>
                <div className="bg-corporate-darkTertiary p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {scanResult.precisionStats.accepted}
                  </div>
                  <div className="text-sm text-corporate-lightGray">Accepted</div>
                </div>
                <div className="bg-corporate-darkTertiary p-3 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">
                    {scanResult.precisionStats.quarantined}
                  </div>
                  <div className="text-sm text-corporate-lightGray">Quarantined</div>
                </div>
                <div className="bg-corporate-darkTertiary p-3 rounded-lg">
                  <div className="text-2xl font-bold text-red-400">
                    {scanResult.precisionStats.false_positives_blocked}
                  </div>
                  <div className="text-sm text-corporate-lightGray">False Positives Blocked</div>
                </div>
              </div>

              {/* Precision Level */}
              <div className="flex items-center gap-4">
                <Badge className={`${getPrecisionColor(scanResult.precisionStats.confidence_level)} text-sm font-medium`}>
                  <Target className="h-3 w-3 mr-1" />
                  {scanResult.precisionStats.confidence_level.toUpperCase()} Precision
                </Badge>
                <span className="text-white text-sm">
                  {(scanResult.precisionStats.avg_precision_score * 100).toFixed(1)}% Average Score
                </span>
              </div>

              {/* Keywords Used */}
              {scanResult.keywords.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-white mb-2">Target Keywords:</div>
                  <div className="flex flex-wrap gap-2">
                    {scanResult.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Clients */}
              {showAddToClients && (
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="h-5 w-5 text-blue-400" />
                    <span className="text-blue-300 font-medium">Ready to Add as Client</span>
                  </div>
                  <p className="text-blue-200 text-sm mb-4">
                    This entity has been successfully scanned. Add them to your client database to include them in future full pipeline scans.
                  </p>
                  <Button
                    onClick={handleAddToClients}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Client Database
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EntityScanningPanel;
