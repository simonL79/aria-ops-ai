
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Loader2, ExternalLink, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface UKNewsScanResult {
  headline: string;
  domain: string;
  entities: string[];
  client_matched: boolean;
}

const UKNewsScanPanel = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<UKNewsScanResult[]>([]);
  const [lastScanTime, setLastScanTime] = useState<string | null>(null);
  const [scanStats, setScanStats] = useState({
    scannedDomains: 0,
    articlesFound: 0,
    entitiesDetected: 0,
    clientsMatched: 0
  });

  const runUKNewsScan = async () => {
    setIsScanning(true);
    
    try {
      toast.info("Starting UK newspaper scan...");
      
      const response = await fetch('/functions/v1/uk-news-scanner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scanType: 'full' })
      });
      
      if (!response.ok) {
        throw new Error(`Scan failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setResults(data.results || []);
        setLastScanTime(data.scan_timestamp);
        
        // Calculate statistics
        const uniqueEntities = new Set<string>();
        let clientMatches = 0;
        
        (data.results || []).forEach((result: UKNewsScanResult) => {
          result.entities.forEach(entity => uniqueEntities.add(entity));
          if (result.client_matched) clientMatches++;
        });
        
        setScanStats({
          scannedDomains: data.scanned_domains?.length || 0,
          articlesFound: data.articles_found || 0,
          entitiesDetected: uniqueEntities.size,
          clientsMatched: clientMatches
        });
        
        toast.success(`Scan completed: Found ${data.articles_found || 0} articles across ${data.scanned_domains?.length || 0} domains`);
      } else {
        toast.error("Scan completed but returned no results");
      }
    } catch (error) {
      console.error("UK News scan error:", error);
      toast.error("Failed to run UK newspaper scan");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          UK Newspaper Zero-Input Scanner
        </CardTitle>
        <CardDescription className="text-blue-100">
          Automatically detect public figures and organizations mentioned in UK news outlets
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Button 
            onClick={runUKNewsScan} 
            disabled={isScanning}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning UK News Sites...
              </>
            ) : (
              <>
                <Newspaper className="mr-2 h-4 w-4" />
                Scan UK News Sources
              </>
            )}
          </Button>
          
          {lastScanTime && (
            <div className="text-sm text-gray-500 flex items-center">
              Last scan: {new Date(lastScanTime).toLocaleString()}
            </div>
          )}
        </div>

        {scanStats.articlesFound > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-lg font-medium text-blue-800">{scanStats.scannedDomains}</div>
              <div className="text-sm text-gray-500">Domains Scanned</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-lg font-medium text-blue-800">{scanStats.articlesFound}</div>
              <div className="text-sm text-gray-500">Articles Found</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-lg font-medium text-blue-800">{scanStats.entitiesDetected}</div>
              <div className="text-sm text-gray-500">Entities Detected</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-lg font-medium text-blue-800">{scanStats.clientsMatched}</div>
              <div className="text-sm text-gray-500">Client Matches</div>
            </div>
          </div>
        )}

        {results.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Latest Scan Results</h3>
            
            <div className="border rounded-md divide-y">
              {results.map((result, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium mb-1">{result.headline}</div>
                      <div className="text-sm text-gray-500 mb-2">Source: {result.domain}</div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {result.entities.map((entity, i) => (
                          <Badge key={i} variant="outline" className="bg-gray-100">
                            {entity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {result.client_matched ? (
                        <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Client Match
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500 flex items-center gap-1">
                          No Client Match
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : lastScanTime ? (
          <div className="text-center py-6 text-gray-500">
            No results found in the latest scan
          </div>
        ) : (
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">What This Scanner Does:</h3>
            <ul className="text-sm space-y-2 text-blue-700 list-disc pl-5">
              <li>Crawls major UK news sites (The Guardian, BBC News, Daily Mail, etc.)</li>
              <li>Identifies people and organizations mentioned in headlines and content</li>
              <li>Evaluates sentiment and visibility scores for each mention</li>
              <li>Automatically matches entities to your client database</li>
              <li>Adds high-risk content to scan results with proper flagging</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UKNewsScanPanel;
