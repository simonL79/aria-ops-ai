
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Loader2, ExternalLink, CheckCircle, AlertTriangle, Users, Building2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface UKNewsScanResult {
  headline: string;
  domain: string;
  entities: string[];
  client_matched: boolean;
  prospect_entities: string[];
}

const UKNewsScanPanel = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<UKNewsScanResult[]>([]);
  const [lastScanTime, setLastScanTime] = useState<string | null>(null);
  const [scanStats, setScanStats] = useState({
    scannedDomains: 0,
    articlesFound: 0,
    entitiesDetected: 0,
    clientsMatched: 0,
    prospectsIdentified: 0
  });

  const runUKNewsScan = async () => {
    setIsScanning(true);
    
    try {
      toast.info("Starting comprehensive UK newspaper scan...");
      
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
        
        // Calculate statistics including prospects
        const uniqueEntities = new Set<string>();
        let clientMatches = 0;
        let totalProspects = 0;
        
        (data.results || []).forEach((result: UKNewsScanResult) => {
          result.entities.forEach(entity => uniqueEntities.add(entity));
          if (result.client_matched) clientMatches++;
          if (result.prospect_entities) totalProspects += result.prospect_entities.length;
        });
        
        setScanStats({
          scannedDomains: data.scanned_domains?.length || 0,
          articlesFound: data.articles_found || 0,
          entitiesDetected: uniqueEntities.size,
          clientsMatched: clientMatches,
          prospectsIdentified: data.prospects_identified || totalProspects
        });
        
        toast.success(`Scan completed: Found ${data.articles_found || 0} articles, ${data.prospects_identified || 0} new prospects identified`);
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
          UK Newspaper Intelligence Scanner
        </CardTitle>
        <CardDescription className="text-blue-100">
          Automatically detect clients and prospects mentioned in UK news outlets with comprehensive intelligence gathering
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
                Scanning UK News & Gathering Intel...
              </>
            ) : (
              <>
                <Newspaper className="mr-2 h-4 w-4" />
                Run Intelligence Scan
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-lg font-medium text-green-800">{scanStats.clientsMatched}</div>
              <div className="text-sm text-gray-500">Client Matches</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="text-lg font-medium text-purple-800">{scanStats.prospectsIdentified}</div>
              <div className="text-sm text-gray-500">New Prospects</div>
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
                    <div className="flex-1">
                      <div className="font-medium mb-1">{result.headline}</div>
                      <div className="text-sm text-gray-500 mb-2">Source: {result.domain}</div>
                      
                      <div className="space-y-2">
                        {result.entities.length > 0 && (
                          <div>
                            <div className="text-xs text-gray-500 mb-1">All Entities:</div>
                            <div className="flex flex-wrap gap-2">
                              {result.entities.map((entity, i) => (
                                <Badge key={i} variant="outline" className="bg-gray-100">
                                  {entity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {result.prospect_entities && result.prospect_entities.length > 0 && (
                          <div>
                            <div className="text-xs text-purple-600 mb-1 flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              New Prospects:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {result.prospect_entities.map((entity, i) => (
                                <Badge key={i} className="bg-purple-100 text-purple-800 border-purple-200">
                                  <Building2 className="h-3 w-3 mr-1" />
                                  {entity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center ml-4">
                      {result.client_matched ? (
                        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Existing Client
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Potential Prospect
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
            <h3 className="font-medium text-blue-800 mb-2">Enhanced Intelligence Scanner Features:</h3>
            <ul className="text-sm space-y-2 text-blue-700 list-disc pl-5">
              <li>Crawls major UK news sites (The Guardian, BBC News, Daily Mail, Telegraph, etc.)</li>
              <li>Identifies people and organizations mentioned in headlines and content</li>
              <li>Automatically matches entities to your existing client database</li>
              <li>Collects comprehensive prospect information for non-clients including:</li>
              <ul className="text-sm space-y-1 text-blue-600 list-disc pl-5 mt-1">
                <li>Industry category and business type</li>
                <li>Sentiment analysis and reputation risk assessment</li>
                <li>Visibility scores and potential reach metrics</li>
                <li>Contact potential rating (High/Medium/Low)</li>
                <li>Context summary and mention tracking</li>
              </ul>
              <li>Flags high-risk content with proper threat classification</li>
              <li>Stores all prospect data for sales outreach and lead generation</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UKNewsScanPanel;
