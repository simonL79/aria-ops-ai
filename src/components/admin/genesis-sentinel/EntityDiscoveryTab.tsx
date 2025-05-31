
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Building, 
  Globe, 
  Users, 
  FileText, 
  TrendingUp,
  Play,
  Pause,
  Settings
} from 'lucide-react';

const EntityDiscoveryTab = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanRegion, setScanRegion] = useState('global');
  const [entityTypes, setEntityTypes] = useState(['companies', 'directors']);

  const mockDiscoveries = [
    {
      id: '1',
      entityName: 'TechVenture AI Ltd',
      entityType: 'Company',
      registrationDate: '2024-01-15',
      jurisdiction: 'UK',
      riskScore: 75,
      riskFactors: ['New director with litigation history', 'High-risk sector'],
      status: 'new'
    },
    {
      id: '2',
      entityName: 'CryptoFlow Holdings',
      entityType: 'Company',
      registrationDate: '2024-01-14',
      jurisdiction: 'Cayman Islands',
      riskScore: 85,
      riskFactors: ['Offshore jurisdiction', 'Crypto sector', 'Anonymous beneficial owners'],
      status: 'flagged'
    },
    {
      id: '3',
      entityName: 'GreenTech Solutions',
      entityType: 'Company',
      registrationDate: '2024-01-13',
      jurisdiction: 'Delaware',
      riskScore: 45,
      riskFactors: ['ESG sector volatility'],
      status: 'monitored'
    }
  ];

  const handleStartScan = () => {
    setIsScanning(true);
    // Simulate scan
    setTimeout(() => setIsScanning(false), 5000);
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'flagged': return 'bg-red-600';
      case 'monitored': return 'bg-yellow-600';
      default: return 'bg-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Scan Configuration */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Settings className="h-5 w-5 text-corporate-accent" />
            Discovery Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="region" className="text-corporate-lightGray">Scan Region</Label>
              <Select value={scanRegion} onValueChange={setScanRegion}>
                <SelectTrigger className="bg-corporate-darkTertiary border-corporate-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-corporate-darkTertiary border-corporate-border">
                  <SelectItem value="global" className="text-white hover:bg-corporate-darkSecondary">Global</SelectItem>
                  <SelectItem value="uk" className="text-white hover:bg-corporate-darkSecondary">United Kingdom</SelectItem>
                  <SelectItem value="us" className="text-white hover:bg-corporate-darkSecondary">United States</SelectItem>
                  <SelectItem value="eu" className="text-white hover:bg-corporate-darkSecondary">European Union</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-corporate-lightGray">Risk Threshold</Label>
              <Select defaultValue="60">
                <SelectTrigger className="bg-corporate-darkTertiary border-corporate-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-corporate-darkTertiary border-corporate-border">
                  <SelectItem value="40" className="text-white hover:bg-corporate-darkSecondary">Low (40+)</SelectItem>
                  <SelectItem value="60" className="text-white hover:bg-corporate-darkSecondary">Medium (60+)</SelectItem>
                  <SelectItem value="80" className="text-white hover:bg-corporate-darkSecondary">High (80+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-corporate-lightGray">Auto-Queue to Watchtower</Label>
              <Select defaultValue="enabled">
                <SelectTrigger className="bg-corporate-darkTertiary border-corporate-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-corporate-darkTertiary border-corporate-border">
                  <SelectItem value="enabled" className="text-white hover:bg-corporate-darkSecondary">Enabled</SelectItem>
                  <SelectItem value="disabled" className="text-white hover:bg-corporate-darkSecondary">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleStartScan}
              disabled={isScanning}
              className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
            >
              {isScanning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Scanning...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Discovery Scan
                </>
              )}
            </Button>

            {isScanning && (
              <Badge className="bg-green-600 text-white">
                <TrendingUp className="h-3 w-3 mr-1" />
                Live Scanning
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Discovery Results */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Search className="h-5 w-5 text-corporate-accent" />
            Recent Discoveries
          </CardTitle>
          <p className="text-sm corporate-subtext">
            New entities detected in the last 24 hours
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDiscoveries.map((entity) => (
              <div key={entity.id} className="p-4 border border-corporate-border rounded-lg bg-corporate-darkTertiary">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="h-4 w-4 text-corporate-accent" />
                      <h3 className="font-semibold text-white">{entity.entityName}</h3>
                      <Badge className={getStatusColor(entity.status)}>
                        {entity.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-corporate-gray">Type:</span>
                        <span className="text-corporate-lightGray ml-1">{entity.entityType}</span>
                      </div>
                      <div>
                        <span className="text-corporate-gray">Registered:</span>
                        <span className="text-corporate-lightGray ml-1">{entity.registrationDate}</span>
                      </div>
                      <div>
                        <span className="text-corporate-gray">Jurisdiction:</span>
                        <span className="text-corporate-lightGray ml-1">{entity.jurisdiction}</span>
                      </div>
                      <div>
                        <span className="text-corporate-gray">Risk Score:</span>
                        <span className={`ml-1 font-semibold ${getRiskColor(entity.riskScore)}`}>
                          {entity.riskScore}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-corporate-gray text-sm">Risk Factors:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entity.riskFactors.map((factor, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-corporate-accent text-corporate-accent">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black">
                      <FileText className="h-3 w-3 mr-1" />
                      Brief
                    </Button>
                    <Button size="sm" className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
                      <Users className="h-3 w-3 mr-1" />
                      Queue
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scan Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-corporate-accent" />
              <div>
                <div className="text-lg font-semibold text-white">247</div>
                <div className="text-xs text-corporate-gray">New entities (24h)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-400" />
              <div>
                <div className="text-lg font-semibold text-white">23</div>
                <div className="text-xs text-corporate-gray">High risk flagged</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-yellow-400" />
              <div>
                <div className="text-lg font-semibold text-white">12</div>
                <div className="text-xs text-corporate-gray">Queued to Watchtower</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-green-400" />
              <div>
                <div className="text-lg font-semibold text-white">8</div>
                <div className="text-xs text-corporate-gray">Jurisdictions scanned</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EntityDiscoveryTab;
