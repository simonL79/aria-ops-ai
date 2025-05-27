
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Search, AlertTriangle, Eye, ExternalLink } from "lucide-react";
import { DiscoveredThreat } from '@/hooks/useDiscoveryScanning';

interface DiscoveryScanPanelProps {
  isScanning: boolean;
  discoveredThreats: DiscoveredThreat[];
  onStartScan: () => void;
}

const DiscoveryScanPanel = ({ isScanning, discoveredThreats, onStartScan }: DiscoveryScanPanelProps) => {
  const [searchFilters, setSearchFilters] = useState({
    entityName: '',
    platform: '',
    threatLevel: ''
  });

  const filteredThreats = discoveredThreats.filter(threat => {
    return (
      (!searchFilters.entityName || threat.entityName.toLowerCase().includes(searchFilters.entityName.toLowerCase())) &&
      (!searchFilters.platform || threat.platform.toLowerCase().includes(searchFilters.platform.toLowerCase())) &&
      (!searchFilters.threatLevel || threat.threatLevel >= parseInt(searchFilters.threatLevel))
    );
  });

  const getThreatLevelColor = (level: number) => {
    if (level >= 8) return 'bg-red-600';
    if (level >= 6) return 'bg-orange-500';
    if (level >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getThreatLevelText = (level: number) => {
    if (level >= 8) return 'Critical';
    if (level >= 6) return 'High';
    if (level >= 4) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-6">
      {/* Zero-Input Discovery Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Zero-Input Discovery Engine
          </CardTitle>
          <CardDescription>
            Autonomous scanning across Reddit, Google News, TrustPilot, Twitter, Forums, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Scan Targets Include:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>• Reddit (r/Scams, r/InfluencerSnark)</div>
                <div>• Google News & Headlines</div>
                <div>• TrustPilot & Yelp Reviews</div>
                <div>• Twitter/X Public Posts</div>
                <div>• Glassdoor Reviews</div>
                <div>• Forum & Blog Pages</div>
                <div>• Social Media Mentions</div>
                <div>• News Article Comments</div>
              </div>
            </div>
            
            <Button 
              onClick={onStartScan}
              disabled={isScanning}
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Search className="mr-2 h-4 w-4" />
              {isScanning ? "Discovery Scan Running..." : "Start Zero-Input Discovery Scan"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Search & Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Discovered Threats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="entityName">Entity Name</Label>
              <Input
                id="entityName"
                placeholder="Search by person or brand..."
                value={searchFilters.entityName}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, entityName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                placeholder="Reddit, Twitter, etc..."
                value={searchFilters.platform}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, platform: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="threatLevel">Min Threat Level</Label>
              <Input
                id="threatLevel"
                type="number"
                min="1"
                max="10"
                placeholder="1-10"
                value={searchFilters.threatLevel}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, threatLevel: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discovered Threats */}
      <Card>
        <CardHeader>
          <CardTitle>Discovered Threats ({filteredThreats.length})</CardTitle>
          <CardDescription>
            Real-time threats detected across all monitored platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredThreats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {discoveredThreats.length === 0 
                  ? "No threats discovered yet. Start a discovery scan to begin monitoring."
                  : "No threats match your current filters."
                }
              </div>
            ) : (
              filteredThreats.map((threat) => (
                <div key={threat.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{threat.entityName}</h4>
                        <Badge variant="outline">{threat.entityType}</Badge>
                        <Badge className={getThreatLevelColor(threat.threatLevel)}>
                          {getThreatLevelText(threat.threatLevel)} ({threat.threatLevel}/10)
                        </Badge>
                        <Badge variant="secondary">{threat.platform}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {threat.contextSnippet}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Mentions: {threat.mentionCount}</span>
                        <span>Velocity: {threat.spreadVelocity}/10</span>
                        <span>Sentiment: {threat.sentiment.toFixed(2)}</span>
                        <span>{new Date(threat.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="mr-1 h-3 w-3" />
                        Analyze
                      </Button>
                      {threat.sourceUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={threat.sourceUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Source
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscoveryScanPanel;
