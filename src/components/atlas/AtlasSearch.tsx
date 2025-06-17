
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Shield, Clock, AlertTriangle } from 'lucide-react';
import { AtlasRealTimeCollector, PersonalIntelligence } from '@/services/atlas/core';

export const AtlasSearch = () => {
  const [searchName, setSearchName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [intelligence, setIntelligence] = useState<PersonalIntelligence | null>(null);
  const [error, setError] = useState<string | null>(null);

  const collector = new AtlasRealTimeCollector();

  const handleSearch = async () => {
    if (!searchName.trim()) return;

    setIsSearching(true);
    setError(null);
    setIntelligence(null);

    try {
      console.log('🔍 Atlas: Starting real-time intelligence gathering');
      const result = await collector.searchPersonMentions(searchName.trim());
      setIntelligence(result);
    } catch (err: any) {
      console.error('Atlas search error:', err);
      setError(err.message || 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Shield className="h-6 w-6" />
            Atlas Intelligence Platform
          </CardTitle>
          <p className="text-blue-700">
            Real-time digital archaeology - ZERO tolerance for mock data
          </p>
        </CardHeader>
      </Card>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Digital Intelligence Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter person's name (e.g., Simon Lindsay)"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch}
              disabled={isSearching || !searchName.trim()}
            >
              {isSearching ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>

          <Alert className="border-green-200 bg-green-50">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Atlas Enforcement Active:</strong> Only real, verified data sources will be processed. 
              All mock, test, or simulated data is automatically blocked.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Search Error:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Intelligence Results */}
      {intelligence && (
        <div className="space-y-4">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Intelligence Summary: {intelligence.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {intelligence.firstMention ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">First Digital Mention</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(intelligence.firstMention.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-1">{intelligence.firstMention.source}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Total Mentions</h4>
                    <p className="text-2xl font-bold">{intelligence.timeline.length}</p>
                    <p className="text-xs text-muted-foreground">Verified sources only</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Reputation Trend</h4>
                    <p className="text-sm capitalize">{intelligence.currentStatus.reputationTrend}</p>
                    <p className="text-xs text-muted-foreground">
                      Last seen: {new Date(intelligence.currentStatus.lastSeen).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    No verified real mentions found. This could indicate:
                    • Very limited digital footprint
                    • Name variations not captured
                    • Privacy-protected individual
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          {intelligence.timeline.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Digital Timeline ({intelligence.timeline.length} entries)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {intelligence.timeline.slice(0, 10).map((entry, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{entry.source}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {entry.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded capitalize ${
                          entry.type === 'professional' ? 'bg-blue-100 text-blue-800' :
                          entry.type === 'legal' ? 'bg-red-100 text-red-800' :
                          entry.type === 'news' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {entry.type}
                        </span>
                        {entry.verified && (
                          <span className="text-xs text-green-600">✓ Verified</span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {intelligence.timeline.length > 10 && (
                    <p className="text-sm text-muted-foreground text-center pt-4">
                      + {intelligence.timeline.length - 10} more entries...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AtlasSearch;
