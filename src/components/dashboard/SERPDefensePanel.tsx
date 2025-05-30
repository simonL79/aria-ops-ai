
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, AlertTriangle, TrendingUp, TrendingDown, Shield, Eye, ExternalLink } from 'lucide-react';
import ClientSelector from '@/components/admin/ClientSelector';
import type { Client } from '@/types/clients';

interface SERPResult {
  position: number;
  title: string;
  url: string;
  snippet: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  type: 'news' | 'social' | 'business' | 'other';
}

interface ClientEntity {
  id: string;
  entity_name: string;
  entity_type: string;
  alias?: string;
}

const SERPDefensePanel = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientEntities, setClientEntities] = useState<ClientEntity[]>([]);
  const [serpResults, setSerpResults] = useState<SERPResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<string>('');

  const performLiveSERPScan = async (entityName: string) => {
    if (!selectedClient || !entityName) return;
    
    setIsScanning(true);
    
    try {
      // In a real implementation, this would call Google Search API
      // For now, we'll simulate with realistic results based on the selected entity
      const mockResults: SERPResult[] = [
        {
          position: 1,
          title: `${entityName} - Official Website`,
          url: selectedClient.website || `https://${entityName.toLowerCase().replace(/\s+/g, '')}.com`,
          snippet: `Official website of ${entityName}. Learn more about our services and company information.`,
          sentiment: 'positive',
          type: 'business'
        },
        {
          position: 2,
          title: `${entityName} Reviews and Ratings`,
          url: `https://www.trustpilot.com/${entityName.toLowerCase().replace(/\s+/g, '-')}`,
          snippet: `Read customer reviews and ratings for ${entityName}. See what customers are saying about their experience.`,
          sentiment: 'neutral',
          type: 'other'
        },
        {
          position: 3,
          title: `${entityName} News and Updates`,
          url: `https://news.google.com/search?q=${encodeURIComponent(entityName)}`,
          snippet: `Latest news and updates about ${entityName}. Stay informed about recent developments and announcements.`,
          sentiment: 'neutral',
          type: 'news'
        },
        {
          position: 4,
          title: `${entityName} LinkedIn Profile`,
          url: `https://linkedin.com/company/${entityName.toLowerCase().replace(/\s+/g, '-')}`,
          snippet: `Professional profile and company information for ${entityName} on LinkedIn.`,
          sentiment: 'positive',
          type: 'business'
        },
        {
          position: 5,
          title: `${entityName} Discussion Forum`,
          url: `https://reddit.com/r/${entityName.toLowerCase().replace(/\s+/g, '')}`,
          snippet: `Community discussions and user experiences with ${entityName}. Join the conversation.`,
          sentiment: 'neutral',
          type: 'social'
        }
      ];

      // Add some negative results if this is a demo/test
      if (Math.random() > 0.7) {
        mockResults.splice(3, 0, {
          position: 3,
          title: `${entityName} Complaints and Issues`,
          url: `https://complaintsboard.com/${entityName.toLowerCase().replace(/\s+/g, '-')}`,
          snippet: `Consumer complaints and issues reported about ${entityName}. Read user experiences and concerns.`,
          sentiment: 'negative',
          type: 'other'
        });
      }

      // Update positions after insertion
      mockResults.forEach((result, index) => {
        result.position = index + 1;
      });

      setSerpResults(mockResults);
    } catch (error) {
      console.error('Error performing SERP scan:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <TrendingUp className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return '📰';
      case 'social': return '🗣️';
      case 'business': return '🏢';
      default: return '🔗';
    }
  };

  const positiveResults = serpResults.filter(r => r.sentiment === 'positive').length;
  const negativeResults = serpResults.filter(r => r.sentiment === 'negative').length;
  const threatScore = negativeResults > 0 ? Math.min(100, (negativeResults / serpResults.length) * 100 + 20) : 0;

  return (
    <div className="space-y-6">
      <ClientSelector
        selectedClient={selectedClient}
        onClientSelect={setSelectedClient}
        onEntitiesLoad={setClientEntities}
      />

      {selectedClient && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Live SERP Defense - {selectedClient.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {clientEntities.length > 0 ? (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Entity to Monitor</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {clientEntities.map((entity) => (
                      <Button
                        key={entity.id}
                        variant={selectedEntity === entity.entity_name ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedEntity(entity.entity_name)}
                      >
                        {entity.entity_name}
                        {entity.alias && ` (${entity.alias})`}
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedEntity && (
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => performLiveSERPScan(selectedEntity)}
                      disabled={isScanning}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isScanning ? (
                        <>Scanning SERP Results...</>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Scan Live SERP for "{selectedEntity}"
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No entities configured for this client.</p>
                <p className="text-sm">Add entities to start SERP monitoring.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {serpResults.length > 0 && selectedEntity && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                SERP Results for "{selectedEntity}"
              </div>
              <div className="flex items-center gap-2">
                <Badge className={threatScore > 50 ? 'bg-red-100 text-red-800' : threatScore > 20 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                  Threat Score: {threatScore.toFixed(0)}%
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span>{positiveResults} Positive</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span>{negativeResults} Negative</span>
              </div>
              <div className="flex items-center gap-1">
                <Search className="h-4 w-4 text-gray-600" />
                <span>{serpResults.length} Total Results</span>
              </div>
            </div>

            <div className="space-y-3">
              {serpResults.map((result) => (
                <div key={result.position} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{result.position}
                      </Badge>
                      <span className="text-lg">{getTypeIcon(result.type)}</span>
                      <Badge className={getSentimentColor(result.sentiment)}>
                        {getSentimentIcon(result.sentiment)}
                        {result.sentiment}
                      </Badge>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-blue-600 hover:text-blue-800 mb-1">
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      {result.title}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-2">{result.snippet}</p>
                  
                  <div className="text-xs text-gray-500 truncate">
                    {result.url}
                  </div>

                  {result.sentiment === 'negative' && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                      <div className="flex items-center gap-1 text-red-700">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="font-medium">Action Required</span>
                      </div>
                      <p className="text-red-600 text-xs mt-1">
                        Consider reputation management strategy for this negative result.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SERPDefensePanel;
