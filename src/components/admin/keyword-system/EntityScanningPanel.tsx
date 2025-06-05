import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Shield } from "lucide-react";
import { toast } from "sonner";
import { KeywordCIAIntegration } from '@/services/intelligence/keywordCIAIntegration';
import { LiveDataEnforcer } from '@/services/ariaCore/liveDataEnforcer';

const EntityScanningPanel = () => {
  const [entityName, setEntityName] = useState('');
  const [scanKeywords, setScanKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !scanKeywords.includes(newKeyword.trim())) {
      setScanKeywords([...scanKeywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setScanKeywords(scanKeywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleEntityScan = async () => {
    if (!entityName.trim() || scanKeywords.length === 0) {
      toast.error('Please enter an entity name and keywords');
      return;
    }

    setScanning(true);
    setScanResults([]);

    try {
      // MANDATORY: Validate live data compliance
      const compliance = await LiveDataEnforcer.validateLiveDataCompliance();
      if (!compliance.isCompliant) {
        toast.error('Live data compliance failed - scan blocked');
        return;
      }

      const results = await KeywordCIAIntegration.executeKeywordCIAAnalysis({
        keywords: scanKeywords,
        entityName: entityName.trim(),
        precisionMode: 'high',
        liveDataOnly: true,
        blockSimulations: true,
        source: 'entity_scanning_panel'
      });

      setScanResults(results);

      if (results.length > 0) {
        toast.success(`Scan complete: ${results.length} results found`);
      } else {
        toast.info('No threats detected for this entity');
      }

    } catch (error) {
      console.error('Entity scan failed:', error);
      if (error.message.includes('simulation') || error.message.includes('blocked')) {
        toast.error('Scan blocked: Simulation data detected');
      } else {
        toast.error('Entity scan failed - please try again');
      }
    } finally {
      setScanning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entity Threat Scanning</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="entityName" className="block text-sm font-medium mb-1">
            Entity Name
          </label>
          <Input
            id="entityName"
            type="text"
            placeholder="Enter entity name"
            value={entityName}
            onChange={(e) => setEntityName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Keywords</label>
          <div className="flex space-x-2 mb-2">
            <Input
              type="text"
              placeholder="Enter keyword"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
            />
            <Button type="button" size="sm" onClick={handleAddKeyword}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {scanKeywords.map((keyword) => (
              <Badge key={keyword} variant="secondary" className="gap-0.5">
                {keyword}
                <Button
                  variant="ghost"
                  size="icon"
                  className="-mr-1"
                  onClick={() => handleRemoveKeyword(keyword)}
                >
                  <Shield className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        <Button
          variant="action"
          className="w-full"
          onClick={handleEntityScan}
          disabled={scanning}
        >
          {scanning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Start Scan
            </>
          )}
        </Button>

        {scanResults.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Scan Results:</h4>
            <ul>
              {scanResults.map((result, index) => (
                <li key={index} className="mb-2">
                  <Badge variant="outline">{result.keyword}</Badge> - {result.threats.length} threats found
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EntityScanningPanel;
