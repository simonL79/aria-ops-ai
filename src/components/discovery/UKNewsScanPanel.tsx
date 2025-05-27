import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Loader2, ExternalLink, CheckCircle, AlertTriangle, Users, Building2, TrendingUp, DollarSign, Target, Phone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface UKNewsScanResult {
  headline: string;
  domain: string;
  entities: string[];
  client_matched: boolean;
  prospect_entities: string[];
}

interface ProspectIntelligence {
  entity_name: string;
  estimated_company_size: string;
  estimated_revenue: string;
  potential_ad_spend: string;
  urgency_score: number;
  sales_opportunity_score: number;
  contact_potential: string;
  industry_category: string;
  reputation_risk_level: string;
  contact_channels: string[];
  crisis_indicators: string[];
  growth_indicators: string[];
}

const UKNewsScanPanel = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<UKNewsScanResult[]>([]);
  const [prospectIntel, setProspectIntel] = useState<ProspectIntelligence[]>([]);
  const [lastScanTime, setLastScanTime] = useState<string | null>(null);
  const [scanStats, setScanStats] = useState({
    scannedDomains: 0,
    articlesFound: 0,
    entitiesDetected: 0,
    clientsMatched: 0,
    prospectsIdentified: 0,
    highValueProspects: 0,
    totalAdSpendPotential: '£0'
  });

  const runUKNewsScan = async () => {
    setIsScanning(true);
    
    try {
      toast.info("Starting comprehensive UK newspaper scan for business intelligence...");
      
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
        
        // Load enhanced prospect intelligence
        await loadProspectIntelligence();
        
        // Calculate enhanced statistics
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
          prospectsIdentified: data.prospects_identified || totalProspects,
          highValueProspects: 0, // Will be updated after loading prospect intel
          totalAdSpendPotential: '£0' // Will be calculated after loading prospect intel
        });
        
        toast.success(`Business intelligence scan completed: ${data.articles_found || 0} articles analyzed, ${data.prospects_identified || 0} prospects identified`);
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

  const loadProspectIntelligence = async () => {
    try {
      const { data, error } = await supabase
        .from('prospect_entities')
        .select('*')
        .order('sales_opportunity_score', { ascending: false })
        .limit(20);

      if (error) throw error;

      if (data) {
        setProspectIntel(data);
        
        // Calculate enhanced stats
        const highValueProspects = data.filter(p => p.sales_opportunity_score >= 8).length;
        
        // Estimate total ad spend potential
        const totalAdSpend = data.reduce((total, prospect) => {
          const adSpend = prospect.potential_ad_spend || '£0';
          const match = adSpend.match(/£([\d.]+)([KM]?)/);
          if (match) {
            let value = parseFloat(match[1]);
            if (match[2] === 'K') value *= 1000;
            if (match[2] === 'M') value *= 1000000;
            return total + value;
          }
          return total;
        }, 0);
        
        const formatAdSpend = (value: number) => {
          if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
          if (value >= 1000) return `£${(value / 1000).toFixed(0)}K`;
          return `£${value.toFixed(0)}`;
        };

        setScanStats(prev => ({
          ...prev,
          highValueProspects,
          totalAdSpendPotential: formatAdSpend(totalAdSpend)
        }));
      }
    } catch (error) {
      console.error('Error loading prospect intelligence:', error);
    }
  };

  const getUrgencyColor = (score: number) => {
    if (score >= 8) return 'bg-red-500';
    if (score >= 6) return 'bg-orange-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getSalesOpportunityColor = (score: number) => {
    if (score >= 8) return 'text-green-800 bg-green-100';
    if (score >= 6) return 'text-blue-800 bg-blue-100';
    if (score >= 4) return 'text-orange-800 bg-orange-100';
    return 'text-gray-800 bg-gray-100';
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          A.R.I.A™ UK Business Intelligence Scanner
        </CardTitle>
        <CardDescription className="text-blue-100">
          Proactive client discovery through UK news monitoring with comprehensive business intelligence and advertising spend analysis
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
                Scanning UK News & Building Client Intelligence...
              </>
            ) : (
              <>
                <Target className="mr-2 h-4 w-4" />
                Run Business Intelligence Scan
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
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-lg font-medium text-blue-800">{scanStats.scannedDomains}</div>
              <div className="text-sm text-gray-500">News Sources</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-lg font-medium text-blue-800">{scanStats.articlesFound}</div>
              <div className="text-sm text-gray-500">Articles Analyzed</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-lg font-medium text-green-800">{scanStats.clientsMatched}</div>
              <div className="text-sm text-gray-500">Existing Clients</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="text-lg font-medium text-purple-800">{scanStats.prospectsIdentified}</div>
              <div className="text-sm text-gray-500">New Prospects</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <div className="text-lg font-medium text-orange-800">{scanStats.highValueProspects}</div>
              <div className="text-sm text-gray-500">High Value</div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <div className="text-lg font-medium text-emerald-800">{scanStats.totalAdSpendPotential}</div>
              <div className="text-sm text-gray-500">Ad Spend Potential</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <div className="text-lg font-medium text-indigo-800">{scanStats.entitiesDetected}</div>
              <div className="text-sm text-gray-500">Entities Found</div>
            </div>
          </div>
        )}

        {/* Prospect Intelligence Dashboard */}
        {prospectIntel.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium">High-Priority Prospect Intelligence</h3>
            </div>
            
            <div className="grid gap-4">
              {prospectIntel.slice(0, 5).map((prospect, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gradient-to-r from-white to-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{prospect.entity_name}</h4>
                        <Badge className={getSalesOpportunityColor(prospect.sales_opportunity_score || 5)}>
                          Sales Score: {prospect.sales_opportunity_score || 5}/10
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-sm font-medium text-gray-600">Company Size</div>
                          <div className="text-sm">{prospect.estimated_company_size || 'Unknown'}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Est. Revenue</div>
                          <div className="text-sm">{prospect.estimated_revenue || 'Unknown'}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Ad Spend Potential</div>
                          <div className="text-sm font-semibold text-green-600">{prospect.potential_ad_spend || 'Unknown'}</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="bg-blue-50">
                          {prospect.industry_category || 'General'}
                        </Badge>
                        <Badge variant="outline" className={`${
                          prospect.reputation_risk_level === 'High' ? 'bg-red-50 text-red-700' :
                          prospect.reputation_risk_level === 'Medium' ? 'bg-orange-50 text-orange-700' :
                          'bg-green-50 text-green-700'
                        }`}>
                          Risk: {prospect.reputation_risk_level || 'Low'}
                        </Badge>
                        <Badge variant="outline" className={`${
                          prospect.contact_potential === 'high' ? 'bg-green-50 text-green-700' :
                          prospect.contact_potential === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-gray-50 text-gray-700'
                        }`}>
                          Contact: {prospect.contact_potential || 'Low'}
                        </Badge>
                      </div>
                      
                      {prospect.contact_channels && prospect.contact_channels.length > 0 && (
                        <div className="mb-2">
                          <div className="text-sm font-medium text-gray-600 mb-1">Contact Channels:</div>
                          <div className="flex flex-wrap gap-1">
                            {prospect.contact_channels.map((channel, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-purple-50">
                                <Phone className="h-3 w-3 mr-1" />
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {prospect.crisis_indicators && prospect.crisis_indicators.length > 0 && (
                        <div className="mb-2">
                          <div className="text-sm font-medium text-red-600 mb-1">Crisis Indicators:</div>
                          <div className="flex flex-wrap gap-1">
                            {prospect.crisis_indicators.map((indicator, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-red-50 text-red-600">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {indicator}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {prospect.growth_indicators && prospect.growth_indicators.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-green-600 mb-1">Growth Indicators:</div>
                          <div className="flex flex-wrap gap-1">
                            {prospect.growth_indicators.map((indicator, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-green-50 text-green-600">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {indicator}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Urgency</span>
                        <div className={`w-3 h-3 rounded-full ${getUrgencyColor(prospect.urgency_score || 5)}`}></div>
                        <span className="text-sm font-medium">{prospect.urgency_score || 5}/10</span>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Generate Outreach
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
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
            <h3 className="font-medium text-blue-800 mb-2">A.R.I.A™ Business Intelligence Features:</h3>
            <ul className="text-sm space-y-2 text-blue-700 list-disc pl-5">
              <li>Crawls major UK news sites for business mentions and opportunities</li>
              <li>Identifies decision makers, companies, and growth/crisis indicators</li>
              <li>Estimates company size, revenue, and advertising spend potential</li>
              <li>Calculates sales opportunity scores and contact urgency ratings</li>
              <li>Provides competitor intelligence and market positioning insights</li>
              <li>Tracks reputation risks and growth opportunities in real-time</li>
              <li>Generates comprehensive prospect profiles for targeted outreach</li>
              <li>Automates lead qualification and sales priority scoring</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UKNewsScanPanel;
