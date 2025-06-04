
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Eye, Filter, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ScanResult {
  id: string;
  platform: string;
  content: string;
  url: string;
  severity: string;
  confidence_score: number;
  detected_entities: string[];
  source_type: string;
  entity_name: string;
  created_at: string;
  threat_type: string;
}

interface CIAScanResultsPanelProps {
  entityName?: string;
  onClose?: () => void;
}

const CIAScanResultsPanel = ({ entityName, onClose }: CIAScanResultsPanelProps) => {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    if (entityName) {
      loadResults();
    }
  }, [entityName]);

  const loadResults = async () => {
    if (!entityName) return;
    
    setLoading(true);
    try {
      console.log(`🔍 Loading scan results for entity: "${entityName}"`);
      
      // Get ALL results for this entity to debug what's actually there
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .ilike('entity_name', `%${entityName.trim()}%`)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Database query error:', error);
        throw error;
      }
      
      console.log(`📊 Found ${data?.length || 0} total scan results for "${entityName}"`);
      console.log('Raw data sample:', data?.slice(0, 3));
      
      // Debug: show what we found
      const debugData = {
        total: data?.length || 0,
        bySourceType: data?.reduce((acc, item) => {
          acc[item.source_type || 'null'] = (acc[item.source_type || 'null'] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {},
        confidenceScores: data?.map(item => item.confidence_score).filter(Boolean) || [],
        recentCount: data?.filter(item => 
          new Date(item.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length || 0
      };
      
      setDebugInfo(debugData);
      console.log('Debug info:', debugData);
      
      // For now, show ALL results for this entity so we can see what's there
      const transformedResults: ScanResult[] = (data || []).map(item => ({
        id: item.id,
        platform: item.platform,
        content: item.content,
        url: item.url,
        severity: item.severity,
        confidence_score: item.confidence_score || 0,
        detected_entities: parseDetectedEntities(item.detected_entities),
        source_type: item.source_type,
        entity_name: item.entity_name,
        created_at: item.created_at,
        threat_type: item.threat_type || 'intelligence'
      }));
      
      setResults(transformedResults);
    } catch (error) {
      console.error('Error loading scan results:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse detected_entities from various formats
  const parseDetectedEntities = (entities: any): string[] => {
    if (!entities) return [];
    
    try {
      // If it's already an array
      if (Array.isArray(entities)) {
        return entities.map(e => typeof e === 'string' ? e : String(e));
      }
      
      // If it's a JSON string, parse it
      if (typeof entities === 'string') {
        const parsed = JSON.parse(entities);
        if (Array.isArray(parsed)) {
          return parsed.map(e => typeof e === 'string' ? e : String(e));
        }
        return [entities]; // Single string
      }
      
      // If it's an object, try to extract values
      if (typeof entities === 'object') {
        return Object.values(entities).map(e => String(e));
      }
      
      return [];
    } catch (error) {
      console.error('Error parsing detected entities:', error);
      return [];
    }
  };

  const filteredResults = results.filter(result => {
    if (filter === 'all') return true;
    return result.severity === filter;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <Card className="corporate-card">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-corporate-accent mx-auto mb-4"></div>
          <p className="text-white">Loading scan results...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="corporate-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-white">
            <TrendingUp className="h-6 w-6 text-corporate-accent" />
            Scan Results for "{entityName}"
          </CardTitle>
          {onClose && (
            <Button onClick={onClose} variant="outline" size="sm">
              Close
            </Button>
          )}
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="text-sm text-corporate-lightGray">
            {results.length} total results found
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className="text-xs"
            >
              All ({results.length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'high' ? 'default' : 'outline'}
              onClick={() => setFilter('high')}
              className="text-xs"
            >
              High ({results.filter(r => r.severity === 'high').length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'medium' ? 'default' : 'outline'}
              onClick={() => setFilter('medium')}
              className="text-xs"
            >
              Medium ({results.filter(r => r.severity === 'medium').length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'low' ? 'default' : 'outline'}
              onClick={() => setFilter('low')}
              className="text-xs"
            >
              Low ({results.filter(r => r.severity === 'low').length})
            </Button>
          </div>
        </div>
        
        {/* Debug Information */}
        {debugInfo && (
          <div className="mt-4 p-3 bg-corporate-darkTertiary rounded-lg">
            <h4 className="text-sm font-semibold text-white mb-2">Debug Info:</h4>
            <div className="text-xs text-corporate-lightGray space-y-1">
              <div>Total results: {debugInfo.total}</div>
              <div>Source types: {JSON.stringify(debugInfo.bySourceType)}</div>
              <div>Recent (24h): {debugInfo.recentCount}</div>
              <div>Confidence scores: {debugInfo.confidenceScores.slice(0, 5).join(', ')}</div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredResults.length === 0 ? (
          <div className="text-center py-8">
            <Eye className="h-12 w-12 text-corporate-lightGray mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {results.length === 0 ? 'No Results Found' : 'No Results Match Filter'}
            </h3>
            <p className="text-corporate-lightGray">
              {results.length === 0 
                ? 'No scan results found for this entity. Try running a new scan.'
                : 'Try adjusting your filter to see more results.'}
            </p>
            {results.length === 0 && (
              <Button 
                onClick={loadResults} 
                className="mt-4 bg-corporate-accent hover:bg-corporate-accentDark text-black"
              >
                Refresh Results
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResults.map((result) => (
              <div 
                key={result.id}
                className="bg-corporate-darkTertiary border border-corporate-border rounded-lg p-4 hover:bg-corporate-darkSecondary transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={getSeverityColor(result.severity)}>
                      {result.severity.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-corporate-lightGray">
                      {result.platform}
                    </span>
                    <span className={`text-sm font-medium ${getConfidenceColor(result.confidence_score)}`}>
                      {result.confidence_score}% confidence
                    </span>
                  </div>
                  <div className="text-xs text-corporate-lightGray">
                    {new Date(result.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                <p className="text-white text-sm mb-3 line-clamp-3">
                  {result.content}
                </p>
                
                {result.detected_entities && result.detected_entities.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-corporate-lightGray">Entities:</span>
                    <div className="flex gap-1 flex-wrap">
                      {result.detected_entities.map((entity, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {entity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {result.threat_type || 'Intelligence'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {result.source_type}
                    </Badge>
                  </div>
                  
                  {result.url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(result.url, '_blank')}
                      className="text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Source
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CIAScanResultsPanel;
